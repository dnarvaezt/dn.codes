import type { CitySearchResult, CitySearchService } from "../city-search"
import type { GeocodingService } from "../geocoding"
import type { GeolocationService } from "../geolocation"
import type { LanguageService, SupportedLanguage } from "../language"
import type { TimezoneService } from "../timezone"
import type { WeatherService } from "../weather"

import {
  DEFAULT_USER_CONTEXT_OPTIONS,
  UserContextChangeEvent,
  UserContextError,
  UserContextErrorCode,
  UserContextInitOptions,
  UserContextListener,
  UserContextState,
} from "./user-context.types"

export class UserContextService {
  private state: UserContextState
  private listeners: UserContextListener[] = []

  constructor(
    private readonly geolocationService: GeolocationService,
    private readonly geocodingService: GeocodingService,
    private readonly citySearchService: CitySearchService,
    private readonly timezoneService: TimezoneService,
    private readonly languageService: LanguageService,
    private readonly weatherService?: WeatherService
  ) {
    this.state = {
      location: null,
      city: null,
      timezone: null,
      weather: null,
      language: this.languageService.getCurrentLanguage(),
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
      const language = this.languageService.getCurrentLanguage()
      this.state.language = language
      this.emitEvent("language", { language })

      if (opts.enableGeolocation) {
        try {
          const position = await this.geolocationService.getPosition({
            timeout: opts.timeout,
          })

          this.state.location = {
            position,
            detectionMethod: "auto",
          }
          this.emitEvent("location", { location: this.state.location })

          const cityInfo = await this.geocodingService.getCityByCoordinates(
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

          const timezone = await this.timezoneService.getTimezoneByCoordinates(
            position.coords.latitude,
            position.coords.longitude
          )

          this.state.timezone = timezone
          this.emitEvent("timezone", { timezone: this.state.timezone })

          if (this.weatherService) {
            try {
              const weather = await this.weatherService.getWeatherByCoordinates(
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
          const timezone = this.timezoneService.getTimezone()
          this.state.timezone = timezone
          this.emitEvent("timezone", { timezone: this.state.timezone })
        }
      } else {
        const timezone = this.timezoneService.getTimezone()
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

    const timezone = await this.timezoneService.getTimezoneByCoordinates(
      city.coordinates.latitude,
      city.coordinates.longitude
    )

    this.state.timezone = timezone
    this.emitEvent("timezone", { timezone: this.state.timezone })

    if (this.weatherService) {
      try {
        const weather = await this.weatherService.getWeatherByCoordinates(
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
      return await this.citySearchService.searchCities(query, {
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
      this.languageService.setManualLanguage(language)
      this.state.language = this.languageService.getCurrentLanguage()
      this.emitEvent("language", { language: this.state.language })
    } catch (error) {
      throw this.createError(
        `Error al cambiar idioma: ${error instanceof Error ? error.message : "Error desconocido"}`,
        UserContextErrorCode.INVALID_LANGUAGE
      )
    }
  }

  public resetLanguageToAuto(): void {
    this.languageService.resetToAutomatic()
    this.state.language = this.languageService.getCurrentLanguage()
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
      language: this.languageService.getCurrentLanguage(),
      isInitialized: false,
    }
    this.listeners = []
  }
}

export const createUserContextService = (
  geolocationService: GeolocationService,
  geocodingService: GeocodingService,
  citySearchService: CitySearchService,
  timezoneService: TimezoneService,
  languageService: LanguageService,
  weatherService?: WeatherService
) => {
  return new UserContextService(
    geolocationService,
    geocodingService,
    citySearchService,
    timezoneService,
    languageService,
    weatherService
  )
}
