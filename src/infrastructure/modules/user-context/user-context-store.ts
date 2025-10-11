import { create } from "zustand"

import type { CitySearchResult, CitySearchService } from "@/application/domain/city-search"
import type { GeocodingService } from "@/application/domain/geocoding"
import type { GeolocationPosition, GeolocationService } from "@/application/domain/geolocation"
import type {
  LanguageInfo,
  LanguageService,
  SupportedLanguage,
} from "@/application/domain/language"
import type { TimezoneInfo, TimezoneService } from "@/application/domain/timezone"
import type { WeatherInfo, WeatherService } from "@/application/domain/weather"

interface UserContextStore {
  location: GeolocationPosition | null
  city: CitySearchResult | null
  timezone: TimezoneInfo | null
  weather: WeatherInfo | null
  language: LanguageInfo
  isInitialized: boolean
  isLoading: boolean
  error: Error | null
  geolocationService: GeolocationService | null
  geocodingService: GeocodingService | null
  citySearchService: CitySearchService | null
  timezoneService: TimezoneService | null
  languageService: LanguageService | null
  weatherService: WeatherService | null
  initializeServices: (services: {
    geolocation: GeolocationService
    geocoding: GeocodingService
    citySearch: CitySearchService
    timezone: TimezoneService
    language: LanguageService
    weather?: WeatherService
  }) => void
  initialize: (options?: { enableGeolocation?: boolean; timeout?: number }) => Promise<void>
  setCity: (city: CitySearchResult) => Promise<void>
  searchCities: (query: string) => Promise<CitySearchResult[]>
  setLanguage: (language: SupportedLanguage) => void
  resetLanguageToAuto: () => void
  setPartialInitialization: () => void
}

const toError = (err: unknown, fallbackMessage: string): Error =>
  err instanceof Error ? err : new Error(fallbackMessage)

const tryOrSetError = async (
  set: (state: Partial<UserContextStore>) => void,
  action: () => Promise<void>,
  errorMsg: string
) => {
  try {
    set({ error: null })
    await action()
  } catch (err) {
    const error = toError(err, errorMsg)
    set({ error })
    throw error
  }
}

const updateWeather = async (
  weatherService: WeatherService | null,
  latitude: number,
  longitude: number,
  language: string,
  timeout?: number
): Promise<WeatherInfo | null> => {
  if (!weatherService) return null
  try {
    return await weatherService.getWeatherByCoordinates(latitude, longitude, {
      language,
      timeout,
    })
  } catch {
    return null
  }
}

export const useUserContextStore = create<UserContextStore>()((set, get) => ({
  location: null,
  city: null,
  timezone: null,
  weather: null,
  language: {
    language: "en",
    fullCode: "en-US",
    isManual: false,
    detectionMethod: "browser",
  },
  isInitialized: false,
  isLoading: false,
  error: null,
  geolocationService: null,
  geocodingService: null,
  citySearchService: null,
  timezoneService: null,
  languageService: null,
  weatherService: null,

  initializeServices: (services) => {
    set({
      geolocationService: services.geolocation,
      geocodingService: services.geocoding,
      citySearchService: services.citySearch,
      timezoneService: services.timezone,
      languageService: services.language,
      weatherService: services.weather,
    })
  },

  initialize: async (options = {}) => {
    const {
      geolocationService,
      geocodingService,
      timezoneService,
      languageService,
      weatherService,
    } = get()

    if (!geolocationService || !geocodingService || !timezoneService || !languageService) {
      set({ error: new Error("Servicios no inicializados") })
      return
    }

    try {
      set({ isLoading: true, error: null })

      const language = languageService.getCurrentLanguage()
      set({ language })

      if (options.enableGeolocation !== false) {
        try {
          const position = await geolocationService.getPosition({
            timeout: options.timeout ?? 10000,
          })

          set({ location: position })

          const cityInfo = await geocodingService.getCityByCoordinates(
            position.coords.latitude,
            position.coords.longitude,
            {
              language: language.language,
              timeout: options.timeout ?? 10000,
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

          set({ city: cityResult })

          const timezone = await timezoneService.getTimezoneByCoordinates(
            position.coords.latitude,
            position.coords.longitude
          )

          set({ timezone })

          const weather = await updateWeather(
            weatherService,
            position.coords.latitude,
            position.coords.longitude,
            language.language,
            options.timeout ?? 10000
          )
          set({ weather })
        } catch {
          const timezone = timezoneService.getTimezone()
          set({ timezone })
        }
      } else {
        const timezone = timezoneService.getTimezone()
        set({ timezone })
      }

      set({ isInitialized: true })
    } catch (err) {
      set({ error: toError(err, "Error desconocido") })
    } finally {
      set({ isLoading: false })
    }
  },

  setCity: async (city) => {
    const { timezoneService, weatherService, language } = get()
    if (!timezoneService) throw new Error("Servicios no inicializados")

    await tryOrSetError(
      set,
      async () => {
        set({ city })
        const timezone = await timezoneService.getTimezoneByCoordinates(
          city.coordinates.latitude,
          city.coordinates.longitude
        )
        const weather = await updateWeather(
          weatherService,
          city.coordinates.latitude,
          city.coordinates.longitude,
          language.language
        )
        set({
          timezone,
          weather,
          location: {
            coords: {
              ...city.coordinates,
              accuracy: 0,
              altitude: null,
              altitudeAccuracy: null,
              heading: null,
              speed: null,
            },
            timestamp: Date.now(),
          },
        })
      },
      "Error al cambiar ciudad"
    )
  },

  searchCities: async (query) => {
    const { citySearchService, language } = get()
    if (!citySearchService) throw new Error("Servicios no inicializados")

    let result: CitySearchResult[] = []
    await tryOrSetError(
      set,
      async () => {
        result = await citySearchService.searchCities(query, { language: language.language })
      },
      "Error al buscar ciudades"
    )
    return result
  },

  setLanguage: (language) => {
    const { languageService } = get()
    if (!languageService) throw new Error("Servicios no inicializados")

    tryOrSetError(
      set,
      async () => {
        languageService.setManualLanguage(language)
        set({ language: languageService.getCurrentLanguage() })
      },
      "Error al cambiar idioma"
    )
  },

  resetLanguageToAuto: () => {
    const { languageService } = get()
    if (!languageService) throw new Error("Servicios no inicializados")

    tryOrSetError(
      set,
      async () => {
        languageService.resetToAutomatic()
        set({ language: languageService.getCurrentLanguage() })
      },
      "Error al resetear idioma"
    )
  },

  setPartialInitialization: () => {
    const { timezoneService, languageService } = get()
    if (!timezoneService || !languageService) {
      set({ error: new Error("Servicios no inicializados") })
      return
    }

    set({
      timezone: timezoneService.getTimezone(),
      language: languageService.getCurrentLanguage(),
      isInitialized: true,
      isLoading: false,
      error: new Error(
        "Servicio parcialmente inicializado. La búsqueda de ciudades no está disponible."
      ),
    })
  },
}))
