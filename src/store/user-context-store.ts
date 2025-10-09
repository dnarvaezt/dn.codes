import {
  CitySearchResult,
  CitySearchService,
  GeocodingService,
  GeolocationService,
  LanguageService,
  SupportedLanguage,
  TimezoneService,
  UserContextInitOptions,
  UserContextService,
  UserContextState,
} from "@/services"
import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface UserContextStore extends UserContextState {
  isLoading: boolean
  error: Error | null
  service: UserContextService | null
  initialize: (options?: UserContextInitOptions) => Promise<void>
  setCity: (city: CitySearchResult) => Promise<void>
  searchCities: (query: string) => Promise<CitySearchResult[]>
  setLanguage: (language: SupportedLanguage) => void
  resetLanguageToAuto: () => void
  reset: () => void
  setPartialInitialization: () => void
  initializeService: (
    geolocationService: GeolocationService,
    geocodingService: GeocodingService,
    citySearchService: CitySearchService,
    timezoneService: TimezoneService,
    languageService: LanguageService
  ) => void
}

export const useUserContextStore = create<UserContextStore>()(
  devtools(
    (set, get) => ({
      location: null,
      city: null,
      timezone: null,
      language: {
        language: "en",
        fullCode: "en-US",
        isManual: false,
        detectionMethod: "browser",
      },
      isInitialized: false,
      isLoading: false,
      error: null,
      service: null,

      initializeService: (
        geolocationService,
        geocodingService,
        citySearchService,
        timezoneService,
        languageService
      ) => {
        const service = new UserContextService(
          geolocationService,
          geocodingService,
          citySearchService,
          timezoneService,
          languageService
        )

        service.subscribe(() => {
          const state = service.getCurrentState()
          set({
            location: state.location,
            city: state.city,
            timezone: state.timezone,
            language: state.language,
            isInitialized: state.isInitialized,
          })
        })

        set({ service })
      },

      initialize: async (options) => {
        const { service } = get()
        if (!service) {
          set({ error: new Error("Servicio no inicializado") })
          return
        }

        try {
          set({ isLoading: true, error: null })
          await service.initializeFromBrowser(options)
        } catch (err) {
          set({ error: err instanceof Error ? err : new Error("Error desconocido") })
        } finally {
          set({ isLoading: false })
        }
      },

      setCity: async (city) => {
        const { service } = get()
        if (!service) {
          throw new Error("Servicio no inicializado")
        }

        try {
          set({ error: null })
          await service.setCity(city)
        } catch (err) {
          const error = err instanceof Error ? err : new Error("Error al cambiar ciudad")
          set({ error })
          throw error
        }
      },

      searchCities: async (query) => {
        const { service } = get()
        console.log("🏪 [UserContextStore] searchCities called:", { query, hasService: !!service })

        if (!service) {
          console.error("❌ [UserContextStore] Servicio no inicializado!")
          throw new Error("Servicio no inicializado")
        }

        try {
          set({ error: null })
          const results = await service.searchCities(query)
          console.log("✅ [UserContextStore] Resultados del servicio:", results)
          return results
        } catch (err) {
          console.error("❌ [UserContextStore] Error en searchCities:", err)
          const error = err instanceof Error ? err : new Error("Error al buscar ciudades")
          set({ error })
          throw error
        }
      },

      setLanguage: (language) => {
        const { service } = get()
        if (!service) {
          throw new Error("Servicio no inicializado")
        }

        try {
          set({ error: null })
          service.setLanguage(language)
        } catch (err) {
          const error = err instanceof Error ? err : new Error("Error al cambiar idioma")
          set({ error })
          throw error
        }
      },

      resetLanguageToAuto: () => {
        const { service } = get()
        if (!service) {
          throw new Error("Servicio no inicializado")
        }

        try {
          set({ error: null })
          service.resetLanguageToAuto()
        } catch (err) {
          const error = err instanceof Error ? err : new Error("Error al resetear idioma")
          set({ error })
          throw error
        }
      },

      reset: () => {
        const { service } = get()
        if (service) {
          service.reset()
        }

        set({
          location: null,
          city: null,
          timezone: null,
          language: {
            language: "en",
            fullCode: "en-US",
            isManual: false,
            detectionMethod: "browser",
          },
          isInitialized: false,
          isLoading: false,
          error: null,
        })
      },

      setPartialInitialization: () => {
        const timezoneService = new TimezoneService()
        const languageService = new LanguageService()

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
