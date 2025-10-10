import type {
  CitySearchRepository,
  GeocodingRepository,
  GeolocationRepository,
  LanguageRepository,
  TimezoneRepository,
  WeatherRepository,
} from "./user-context.repository.interface"

import type {
  CitySearchResult,
  SupportedLanguage,
  UserContextChangeEvent,
  UserContextInitOptions,
  UserContextListener,
  UserContextState,
} from "./user-context.model"

import {
  DEFAULT_USER_CONTEXT_OPTIONS,
  UserContextError,
  UserContextErrorCode,
} from "./user-context.model"

export class UserContextService {
  private state: UserContextState
  private listeners: UserContextListener[] = []

  constructor(
    private readonly geolocationRepository: GeolocationRepository,
    private readonly geocodingRepository: GeocodingRepository,
    private readonly citySearchRepository: CitySearchRepository,
    private readonly timezoneRepository: TimezoneRepository,
    private readonly languageRepository: LanguageRepository,
    private readonly weatherRepository?: WeatherRepository
  ) {
    this.state = {
      location: null,
      city: null,
      timezone: null,
      weather: null,
      language: this.languageRepository.getCurrentLanguage(),
      isInitialized: false,
    }
  }

  private createError(message: string, code: UserContextErrorCode): UserContextError {
    return new UserContextError(message, code)
  }

  private notifyListeners(event: UserContextChangeEvent): void {
    this.listeners.forEach((listener) => {
      try {
        listener(event)
      } catch {
        // Silently handle listener errors
      }
    })
  }

  private emitEvent(type: UserContextChangeEvent["type"], data: Partial<UserContextState>): void {
    const event: UserContextChangeEvent = {
      type,
      data,
      timestamp: Date.now(),
    }
    this.notifyListeners(event)
  }

  public subscribe(listener: UserContextListener): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  public async initializeFromBrowser(options?: UserContextInitOptions): Promise<UserContextState> {
    const opts = { ...DEFAULT_USER_CONTEXT_OPTIONS, ...options }

    try {
      const language = this.languageRepository.getCurrentLanguage()
      this.state.language = language
      this.emitEvent("language", { language })

      if (opts.enableGeolocation) {
        try {
          const position = await this.geolocationRepository.getPosition({
            timeout: opts.timeout,
          })

          this.state.location = {
            position,
            detectionMethod: "auto",
          }
          this.emitEvent("location", { location: this.state.location })

          const cityInfo = await this.geocodingRepository.getCityByCoordinates(
            position.coords.latitude,
            position.coords.longitude,
            {
              language: language.language,
              timeout: opts.timeout,
            }
          )

          const stateInfo = cityInfo.principalSubdivision
            ? `${cityInfo.principalSubdivision}, `
            : ""
          const formatted = `${cityInfo.city}, ${stateInfo}${cityInfo.countryName}`

          const cityResult: CitySearchResult = {
            city: cityInfo.city,
            country: cityInfo.countryName,
            countryCode: cityInfo.countryCode,
            state: cityInfo.principalSubdivision,
            coordinates: {
              latitude: cityInfo.latitude,
              longitude: cityInfo.longitude,
            },
            formatted,
            placeId: `${cityInfo.latitude},${cityInfo.longitude}`,
          }

          this.state.city = cityResult
          this.emitEvent("city", { city: this.state.city })

          const timezone = await this.timezoneRepository.getTimezoneByCoordinates(
            position.coords.latitude,
            position.coords.longitude
          )

          this.state.timezone = timezone
          this.emitEvent("timezone", { timezone: this.state.timezone })

          if (this.weatherRepository) {
            try {
              const weather = await this.weatherRepository.getWeatherByCoordinates(
                position.coords.latitude,
                position.coords.longitude,
                {
                  language: language.language,
                  timeout: opts.timeout,
                }
              )
              this.state.weather = weather
              this.emitEvent("weather", { weather: this.state.weather })
            } catch {
              this.state.weather = null
            }
          }
        } catch {
          const timezone = this.timezoneRepository.getTimezone()
          this.state.timezone = timezone
          this.emitEvent("timezone", { timezone: this.state.timezone })
        }
      } else {
        const timezone = this.timezoneRepository.getTimezone()
        this.state.timezone = timezone
        this.emitEvent("timezone", { timezone: this.state.timezone })
      }

      this.state.isInitialized = true
      this.emitEvent("initialized", { isInitialized: true })

      return this.getCurrentState()
    } catch (error: unknown) {
      if (error instanceof UserContextError) {
        throw error
      }

      if (error instanceof Error) {
        throw this.createError(
          `Error al inicializar contexto de usuario: ${error.message}`,
          UserContextErrorCode.GEOLOCATION_FAILED
        )
      }

      throw this.createError(
        "Error desconocido al inicializar contexto de usuario",
        UserContextErrorCode.GEOLOCATION_FAILED
      )
    }
  }

  public async setCity(city: CitySearchResult): Promise<void> {
    if (!city?.coordinates) {
      throw this.createError("Ciudad inválida", UserContextErrorCode.INVALID_CITY)
    }

    this.state.city = city
    this.emitEvent("city", { city: this.state.city })

    const timezone = await this.timezoneRepository.getTimezoneByCoordinates(
      city.coordinates.latitude,
      city.coordinates.longitude
    )

    this.state.timezone = timezone
    this.emitEvent("timezone", { timezone: this.state.timezone })

    if (this.weatherRepository) {
      try {
        const weather = await this.weatherRepository.getWeatherByCoordinates(
          city.coordinates.latitude,
          city.coordinates.longitude,
          {
            language: this.state.language.language,
          }
        )
        this.state.weather = weather
        this.emitEvent("weather", { weather: this.state.weather })
      } catch {
        this.state.weather = null
        this.emitEvent("weather", { weather: null })
      }
    }

    if (this.state.location) {
      this.state.location = {
        position: {
          coords: {
            latitude: city.coordinates.latitude,
            longitude: city.coordinates.longitude,
            accuracy: 0,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
          timestamp: Date.now(),
        },
        detectionMethod: "manual",
      }
      this.emitEvent("location", { location: this.state.location })
    }
  }

  public async searchCities(query: string): Promise<CitySearchResult[]> {
    try {
      return await this.citySearchRepository.searchCities(query, {
        language: this.state.language.language,
      })
    } catch (error) {
      throw this.createError(
        `Error al buscar ciudades: ${error instanceof Error ? error.message : "Error desconocido"}`,
        UserContextErrorCode.CITY_SEARCH_FAILED
      )
    }
  }

  public setLanguage(language: SupportedLanguage): void {
    try {
      this.languageRepository.setManualLanguage(language)
      this.state.language = this.languageRepository.getCurrentLanguage()
      this.emitEvent("language", { language: this.state.language })
    } catch (error) {
      throw this.createError(
        `Error al cambiar idioma: ${error instanceof Error ? error.message : "Error desconocido"}`,
        UserContextErrorCode.INVALID_LANGUAGE
      )
    }
  }

  public resetLanguageToAuto(): void {
    this.languageRepository.resetToAutomatic()
    this.state.language = this.languageRepository.getCurrentLanguage()
    this.emitEvent("language", { language: this.state.language })
  }

  public getCurrentState(): UserContextState {
    return {
      location: this.state.location ? { ...this.state.location } : null,
      city: this.state.city ? { ...this.state.city } : null,
      timezone: this.state.timezone ? { ...this.state.timezone } : null,
      weather: this.state.weather ? { ...this.state.weather } : null,
      language: { ...this.state.language },
      isInitialized: this.state.isInitialized,
    }
  }

  public isInitialized(): boolean {
    return this.state.isInitialized
  }

  public reset(): void {
    this.state = {
      location: null,
      city: null,
      timezone: null,
      weather: null,
      language: this.languageRepository.getCurrentLanguage(),
      isInitialized: false,
    }
    this.listeners = []
  }
}

export const createUserContextService = (
  geolocationRepository: GeolocationRepository,
  geocodingRepository: GeocodingRepository,
  citySearchRepository: CitySearchRepository,
  timezoneRepository: TimezoneRepository,
  languageRepository: LanguageRepository,
  weatherRepository?: WeatherRepository
) => {
  return new UserContextService(
    geolocationRepository,
    geocodingRepository,
    citySearchRepository,
    timezoneRepository,
    languageRepository,
    weatherRepository
  )
}
