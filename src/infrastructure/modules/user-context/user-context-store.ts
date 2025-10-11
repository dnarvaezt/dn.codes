import { create } from "zustand"
import { devtools } from "zustand/middleware"

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

interface UserContextState {
  location: GeolocationPosition | null
  city: CitySearchResult | null
  timezone: TimezoneInfo | null
  weather: WeatherInfo | null
  language: LanguageInfo
  isInitialized: boolean
}

interface UserContextStore extends UserContextState {
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

export const useUserContextStore = create<UserContextStore>()(
  devtools(
    (set, get) => ({
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

              if (weatherService) {
                try {
                  const weather = await weatherService.getWeatherByCoordinates(
                    position.coords.latitude,
                    position.coords.longitude,
                    {
                      language: language.language,
                      timeout: options.timeout ?? 10000,
                    }
                  )
                  set({ weather })
                } catch {
                  set({ weather: null })
                }
              }
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
          set({ error: err instanceof Error ? err : new Error("Error desconocido") })
        } finally {
          set({ isLoading: false })
        }
      },

      setCity: async (city) => {
        const { timezoneService, weatherService, language } = get()

        if (!timezoneService) {
          throw new Error("Servicios no inicializados")
        }

        try {
          set({ error: null, city })

          const timezone = await timezoneService.getTimezoneByCoordinates(
            city.coordinates.latitude,
            city.coordinates.longitude
          )

          set({ timezone })

          if (weatherService) {
            try {
              const weather = await weatherService.getWeatherByCoordinates(
                city.coordinates.latitude,
                city.coordinates.longitude,
                {
                  language: language.language,
                }
              )
              set({ weather })
            } catch {
              set({ weather: null })
            }
          }

          set({
            location: {
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
          })
        } catch (err) {
          const error = err instanceof Error ? err : new Error("Error al cambiar ciudad")
          set({ error })
          throw error
        }
      },

      searchCities: async (query) => {
        const { citySearchService, language } = get()

        if (!citySearchService) {
          throw new Error("Servicios no inicializados")
        }

        try {
          set({ error: null })
          const results = await citySearchService.searchCities(query, {
            language: language.language,
          })
          return results
        } catch (err) {
          const error = err instanceof Error ? err : new Error("Error al buscar ciudades")
          set({ error })
          throw error
        }
      },

      setLanguage: (language) => {
        const { languageService } = get()

        if (!languageService) {
          throw new Error("Servicios no inicializados")
        }

        try {
          set({ error: null })
          languageService.setManualLanguage(language)
          const updatedLanguage = languageService.getCurrentLanguage()
          set({ language: updatedLanguage })
        } catch (err) {
          const error = err instanceof Error ? err : new Error("Error al cambiar idioma")
          set({ error })
          throw error
        }
      },

      resetLanguageToAuto: () => {
        const { languageService } = get()

        if (!languageService) {
          throw new Error("Servicios no inicializados")
        }

        try {
          set({ error: null })
          languageService.resetToAutomatic()
          const updatedLanguage = languageService.getCurrentLanguage()
          set({ language: updatedLanguage })
        } catch (err) {
          const error = err instanceof Error ? err : new Error("Error al resetear idioma")
          set({ error })
          throw error
        }
      },

      setPartialInitialization: () => {
        const { timezoneService, languageService } = get()

        if (!timezoneService || !languageService) {
          set({ error: new Error("Servicios no inicializados") })
          return
        }

        const timezone = timezoneService.getTimezone()
        const language = languageService.getCurrentLanguage()

        set({
          timezone,
          language,
          isInitialized: true,
          isLoading: false,
          error: new Error(
            "Servicio parcialmente inicializado. La búsqueda de ciudades no está disponible."
          ),
        })
      },
    }),
    { name: "user-context-store" }
  )
)
