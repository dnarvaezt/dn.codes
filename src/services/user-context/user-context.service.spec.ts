import { beforeEach, describe, expect, it, vi } from "vitest"
import { UserContextService } from "./user-context.service"
import { UserContextError, UserContextErrorCode } from "./user-context.types"

import type { CitySearchResult, CitySearchService } from "../city-search"
import type { CityInfo, GeocodingService } from "../geocoding"
import type { GeolocationPosition, GeolocationService } from "../geolocation"
import type { LanguageInfo, LanguageService } from "../language"
import type { TimezoneInfo, TimezoneService } from "../timezone"
import type { WeatherInfo, WeatherService } from "../weather"

describe("UserContextService", () => {
  let service: UserContextService
  let mockGeolocationService: Partial<GeolocationService>
  let mockGeocodingService: Partial<GeocodingService>
  let mockCitySearchService: Partial<CitySearchService>
  let mockTimezoneService: Partial<TimezoneService>
  let mockLanguageService: Partial<LanguageService>
  let mockWeatherService: Partial<WeatherService>

  const mockPosition: GeolocationPosition = {
    coords: {
      latitude: 40.7128,
      longitude: -74.006,
      accuracy: 10,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    },
    timestamp: Date.now(),
  }

  const mockCityInfo: CityInfo = {
    city: "New York",
    locality: "New York",
    principalSubdivision: "New York",
    principalSubdivisionCode: "NY",
    countryName: "United States",
    countryCode: "US",
    continent: "North America",
    continentCode: "NA",
    latitude: 40.7128,
    longitude: -74.006,
    localityLanguageRequested: "en",
  }

  const mockTimezone: TimezoneInfo = {
    timezone: "America/New_York",
    offset: -300,
    offsetString: "-05:00",
    locale: "en-US",
    isManual: false,
    detectionMethod: "geolocation",
    coordinates: {
      latitude: 40.7128,
      longitude: -74.006,
    },
  }

  const mockLanguage: LanguageInfo = {
    language: "en",
    fullCode: "en-US",
    isManual: false,
    detectionMethod: "browser",
  }

  const mockWeather: WeatherInfo = {
    coordinates: {
      latitude: 40.7128,
      longitude: -74.006,
    },
    weather: [
      {
        id: 800,
        main: "Clear",
        description: "clear sky",
        icon: "01d",
      },
    ],
    main: {
      temp: 20,
      feelsLike: 19,
      tempMin: 18,
      tempMax: 22,
      pressure: 1013,
      humidity: 60,
    },
    visibility: 10000,
    wind: {
      speed: 5,
      deg: 180,
    },
    clouds: {
      all: 0,
    },
    dt: 1609459200,
    sys: {
      country: "US",
      sunrise: 1609416000,
      sunset: 1609449600,
    },
    timezone: -18000,
    cityId: 5128581,
    cityName: "New York",
  }

  beforeEach(() => {
    mockGeolocationService = {
      getPosition: vi.fn().mockResolvedValue(mockPosition),
    }

    mockGeocodingService = {
      getCityByCoordinates: vi.fn().mockResolvedValue(mockCityInfo),
    }

    mockCitySearchService = {
      searchCities: vi.fn().mockResolvedValue([]),
    }

    mockTimezoneService = {
      getTimezone: vi.fn().mockReturnValue(mockTimezone),
      getTimezoneByCoordinates: vi.fn().mockReturnValue(mockTimezone),
    }

    mockLanguageService = {
      getCurrentLanguage: vi.fn().mockReturnValue(mockLanguage),
      setManualLanguage: vi.fn(),
      resetToAutomatic: vi.fn(),
    }

    mockWeatherService = {
      getWeatherByCoordinates: vi.fn().mockResolvedValue(mockWeather),
    }

    service = new UserContextService(
      mockGeolocationService as GeolocationService,
      mockGeocodingService as GeocodingService,
      mockCitySearchService as CitySearchService,
      mockTimezoneService as TimezoneService,
      mockLanguageService as LanguageService,
      mockWeatherService as WeatherService
    )

    vi.clearAllMocks()
  })

  describe("initializeFromBrowser", () => {
    it("debe inicializar correctamente con geolocalización habilitada", async () => {
      const state = await service.initializeFromBrowser({ enableGeolocation: true })

      expect(state.isInitialized).toBe(true)
      expect(state.location).toBeDefined()
      expect(state.location?.position).toEqual(mockPosition)
      expect(state.location?.detectionMethod).toBe("auto")
      expect(state.city).toBeDefined()
      expect(state.city?.city).toBe("New York")
      expect(state.timezone).toBeDefined()
      expect(state.timezone?.timezone).toBe("America/New_York")
      expect(state.weather).toBeDefined()
      expect(state.weather?.cityName).toBe("New York")
      expect(state.weather?.main.temp).toBe(20)
      expect(state.language).toEqual(mockLanguage)

      expect(mockGeolocationService.getPosition).toHaveBeenCalled()
      expect(mockGeocodingService.getCityByCoordinates).toHaveBeenCalledWith(
        40.7128,
        -74.006,
        expect.objectContaining({
          language: "en",
        })
      )
      expect(mockTimezoneService.getTimezoneByCoordinates).toHaveBeenCalledWith(40.7128, -74.006)
      expect(mockWeatherService.getWeatherByCoordinates).toHaveBeenCalledWith(
        40.7128,
        -74.006,
        expect.objectContaining({
          language: "en",
        })
      )
    })

    it("debe inicializar sin geolocalización cuando está deshabilitada", async () => {
      const state = await service.initializeFromBrowser({ enableGeolocation: false })

      expect(state.isInitialized).toBe(true)
      expect(state.location).toBeNull()
      expect(state.city).toBeNull()
      expect(state.timezone).toBeDefined()
      expect(state.weather).toBeNull()
      expect(state.language).toEqual(mockLanguage)

      expect(mockGeolocationService.getPosition).not.toHaveBeenCalled()
      expect(mockTimezoneService.getTimezone).toHaveBeenCalled()
      expect(mockWeatherService.getWeatherByCoordinates).not.toHaveBeenCalled()
    })

    it("debe usar timezone del navegador si falla la geolocalización", async () => {
      mockGeolocationService.getPosition = vi
        .fn()
        .mockRejectedValue(new Error("Geolocation failed"))

      const state = await service.initializeFromBrowser({ enableGeolocation: true })

      expect(state.isInitialized).toBe(true)
      expect(state.timezone).toBeDefined()
      expect(mockTimezoneService.getTimezone).toHaveBeenCalled()
    })

    it("debe emitir eventos durante la inicialización", async () => {
      const listener = vi.fn()
      service.subscribe(listener)

      await service.initializeFromBrowser({ enableGeolocation: true })

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "language",
        })
      )
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "location",
        })
      )
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "city",
        })
      )
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "timezone",
        })
      )
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "weather",
        })
      )
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "initialized",
        })
      )
    })
  })

  describe("setCity", () => {
    beforeEach(async () => {
      await service.initializeFromBrowser({ enableGeolocation: true })
    })

    it("debe cambiar la ciudad manualmente", async () => {
      const newCity: CitySearchResult = {
        city: "Los Angeles",
        country: "United States",
        countryCode: "US",
        state: "California",
        coordinates: {
          latitude: 34.0522,
          longitude: -118.2437,
        },
        formatted: "Los Angeles, CA, United States",
        placeId: "la-123",
      }

      const newTimezone: TimezoneInfo = {
        timezone: "America/Los_Angeles",
        offset: -480,
        offsetString: "-08:00",
        locale: "en-US",
        isManual: false,
        detectionMethod: "geolocation",
        coordinates: {
          latitude: 34.0522,
          longitude: -118.2437,
        },
      }

      const newWeather: WeatherInfo = {
        ...mockWeather,
        cityName: "Los Angeles",
        coordinates: {
          latitude: 34.0522,
          longitude: -118.2437,
        },
      }

      mockTimezoneService.getTimezoneByCoordinates = vi.fn().mockReturnValue(newTimezone)
      mockWeatherService.getWeatherByCoordinates = vi.fn().mockResolvedValue(newWeather)

      await service.setCity(newCity)

      const state = service.getCurrentState()

      expect(state.city).toEqual(newCity)
      expect(state.timezone?.timezone).toBe("America/Los_Angeles")
      expect(state.weather?.cityName).toBe("Los Angeles")
      expect(state.location?.detectionMethod).toBe("manual")
      expect(mockTimezoneService.getTimezoneByCoordinates).toHaveBeenCalledWith(34.0522, -118.2437)
      expect(mockWeatherService.getWeatherByCoordinates).toHaveBeenCalledWith(
        34.0522,
        -118.2437,
        expect.objectContaining({
          language: "en",
        })
      )
    })

    it("debe lanzar error si la ciudad es inválida", async () => {
      const invalidCity = null as unknown as CitySearchResult

      await expect(service.setCity(invalidCity)).rejects.toThrow("Ciudad inválida")
    })

    it("debe emitir eventos al cambiar ciudad", async () => {
      const listener = vi.fn()
      service.subscribe(listener)

      const newCity: CitySearchResult = {
        city: "Madrid",
        country: "Spain",
        countryCode: "ES",
        coordinates: {
          latitude: 40.4168,
          longitude: -3.7038,
        },
        formatted: "Madrid, Spain",
        placeId: "madrid-123",
      }

      await service.setCity(newCity)

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "city",
        })
      )
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "timezone",
        })
      )
      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "weather",
        })
      )
    })
  })

  describe("setLanguage", () => {
    beforeEach(async () => {
      await service.initializeFromBrowser({ enableGeolocation: true })
    })

    it("debe cambiar el idioma manualmente", () => {
      const newLanguage: LanguageInfo = {
        language: "es",
        fullCode: "es-ES",
        isManual: true,
        detectionMethod: "manual",
      }

      mockLanguageService.getCurrentLanguage = vi.fn().mockReturnValue(newLanguage)

      service.setLanguage("es")

      const state = service.getCurrentState()

      expect(state.language.language).toBe("es")
      expect(state.language.isManual).toBe(true)
      expect(mockLanguageService.setManualLanguage).toHaveBeenCalledWith("es")
    })

    it("debe mantener la ciudad sin cambios al cambiar idioma", () => {
      const cityBeforeLanguageChange = service.getCurrentState().city

      const newLanguage: LanguageInfo = {
        language: "es",
        fullCode: "es-ES",
        isManual: true,
        detectionMethod: "manual",
      }

      mockLanguageService.getCurrentLanguage = vi.fn().mockReturnValue(newLanguage)

      service.setLanguage("es")

      const state = service.getCurrentState()

      expect(state.city).toEqual(cityBeforeLanguageChange)
      expect(state.timezone?.timezone).toBe("America/New_York")
    })

    it("debe emitir evento al cambiar idioma", () => {
      const listener = vi.fn()
      service.subscribe(listener)

      const newLanguage: LanguageInfo = {
        language: "es",
        fullCode: "es-ES",
        isManual: true,
        detectionMethod: "manual",
      }

      mockLanguageService.getCurrentLanguage = vi.fn().mockReturnValue(newLanguage)

      service.setLanguage("es")

      expect(listener).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "language",
        })
      )
    })
  })

  describe("resetLanguageToAuto", () => {
    it("debe resetear el idioma a detección automática", async () => {
      await service.initializeFromBrowser({ enableGeolocation: true })

      service.resetLanguageToAuto()

      expect(mockLanguageService.resetToAutomatic).toHaveBeenCalled()
      expect(mockLanguageService.getCurrentLanguage).toHaveBeenCalled()
    })
  })

  describe("searchCities", () => {
    beforeEach(async () => {
      await service.initializeFromBrowser({ enableGeolocation: true })
    })

    it("debe buscar ciudades con el idioma actual", async () => {
      const mockResults: CitySearchResult[] = [
        {
          city: "Paris",
          country: "France",
          countryCode: "FR",
          coordinates: {
            latitude: 48.8566,
            longitude: 2.3522,
          },
          formatted: "Paris, France",
          placeId: "paris-123",
        },
      ]

      mockCitySearchService.searchCities = vi.fn().mockResolvedValue(mockResults)

      const results = await service.searchCities("Paris")

      expect(results).toEqual(mockResults)
      expect(mockCitySearchService.searchCities).toHaveBeenCalledWith("Paris", {
        language: "en",
      })
    })

    it("debe lanzar error si falla la búsqueda", async () => {
      mockCitySearchService.searchCities = vi.fn().mockRejectedValue(new Error("Search failed"))

      await expect(service.searchCities("Invalid")).rejects.toThrow("Error al buscar ciudades")
    })
  })

  describe("getCurrentState", () => {
    it("debe retornar el estado actual completo", async () => {
      await service.initializeFromBrowser({ enableGeolocation: true })

      const state = service.getCurrentState()

      expect(state).toBeDefined()
      expect(state.isInitialized).toBe(true)
      expect(state.location).toBeDefined()
      expect(state.city).toBeDefined()
      expect(state.timezone).toBeDefined()
      expect(state.weather).toBeDefined()
      expect(state.language).toBeDefined()
    })

    it("debe retornar una copia del estado, no la referencia", async () => {
      await service.initializeFromBrowser({ enableGeolocation: true })

      const state1 = service.getCurrentState()
      const state2 = service.getCurrentState()

      expect(state1).not.toBe(state2)
      expect(state1).toEqual(state2)
    })
  })

  describe("isInitialized", () => {
    it("debe retornar false antes de inicializar", () => {
      expect(service.isInitialized()).toBe(false)
    })

    it("debe retornar true después de inicializar", async () => {
      await service.initializeFromBrowser({ enableGeolocation: true })

      expect(service.isInitialized()).toBe(true)
    })
  })

  describe("reset", () => {
    it("debe resetear el estado completamente", async () => {
      await service.initializeFromBrowser({ enableGeolocation: true })

      service.reset()

      const state = service.getCurrentState()

      expect(state.isInitialized).toBe(false)
      expect(state.location).toBeNull()
      expect(state.city).toBeNull()
      expect(state.timezone).toBeNull()
      expect(state.weather).toBeNull()
    })
  })

  describe("subscribe y unsubscribe", () => {
    it("debe suscribir listeners correctamente", async () => {
      const listener1 = vi.fn()
      const listener2 = vi.fn()

      service.subscribe(listener1)
      service.subscribe(listener2)

      await service.initializeFromBrowser({ enableGeolocation: true })

      expect(listener1).toHaveBeenCalled()
      expect(listener2).toHaveBeenCalled()
    })

    it("debe desuscribir listeners correctamente", async () => {
      const listener = vi.fn()

      const unsubscribe = service.subscribe(listener)
      unsubscribe()

      await service.initializeFromBrowser({ enableGeolocation: true })

      expect(listener).not.toHaveBeenCalled()
    })

    it("debe manejar errores en listeners sin afectar otros listeners", async () => {
      const errorListener = vi.fn().mockImplementation(() => {
        throw new Error("Listener error")
      })
      const normalListener = vi.fn()

      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

      service.subscribe(errorListener)
      service.subscribe(normalListener)

      await service.initializeFromBrowser({ enableGeolocation: true })

      expect(errorListener).toHaveBeenCalled()
      expect(normalListener).toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe("UserContextError", () => {
    it("debe lanzar error con código correcto al fallar búsqueda de ciudades", async () => {
      await service.initializeFromBrowser({ enableGeolocation: true })

      mockCitySearchService.searchCities = vi.fn().mockRejectedValue(new Error("Search failed"))

      try {
        await service.searchCities("Invalid")
        expect.fail("Debería haber lanzado error")
      } catch (error) {
        expect((error as UserContextError).code).toBe(UserContextErrorCode.CITY_SEARCH_FAILED)
      }
    })

    it("debe lanzar error con código correcto para idioma inválido", async () => {
      await service.initializeFromBrowser({ enableGeolocation: true })

      mockLanguageService.setManualLanguage = vi.fn().mockImplementation(() => {
        throw new Error("Invalid language")
      })

      try {
        service.setLanguage("es")
        expect.fail("Debería haber lanzado error")
      } catch (error) {
        expect((error as UserContextError).code).toBe(UserContextErrorCode.INVALID_LANGUAGE)
      }
    })
  })
})
