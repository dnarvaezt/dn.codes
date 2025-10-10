import { OPENWEATHERMAP_API_URL, WeatherError } from "@/core/domain/types/weather"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { WeatherService } from "./weather.service"

import type { GeolocationService } from "@/infrastructure/browser/geolocation"
import type { LanguageService } from "@/infrastructure/browser/language"

describe("WeatherService", () => {
  let service: WeatherService
  let mockGeolocationService: Partial<GeolocationService>
  let mockLanguageService: Partial<LanguageService>
  const mockApiKey = "test-api-key"

  beforeEach(() => {
    mockGeolocationService = {
      getPosition: vi.fn(),
    }
    mockLanguageService = {
      getCurrentLanguage: vi.fn().mockReturnValue({
        language: "en",
        fullCode: "en-US",
        isManual: false,
        detectionMethod: "browser",
      }),
    }
    service = new WeatherService(
      mockApiKey,
      mockGeolocationService as GeolocationService,
      mockLanguageService as LanguageService
    )
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  describe("constructor", () => {
    it("debe lanzar error cuando no se proporciona API key", () => {
      expect(() => new WeatherService("")).toThrow("API key de OpenWeatherMap es requerida")
    })

    it("debe crear instancia correctamente con API key válida", () => {
      expect(service).toBeInstanceOf(WeatherService)
    })
  })

  describe("getWeatherByCoordinates", () => {
    it("debe obtener información del clima por coordenadas", async () => {
      const mockResponse = {
        coord: { lat: 40.7128, lon: -74.006 },
        weather: [
          {
            id: 800,
            main: "Clear",
            description: "clear sky",
            icon: "01d",
          },
        ],
        base: "stations",
        main: {
          temp: 20,
          feels_like: 19,
          temp_min: 18,
          temp_max: 22,
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
        id: 5128581,
        name: "New York",
        cod: 200,
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.getWeatherByCoordinates(40.7128, -74.006)

      expect(result.cityName).toBe("New York")
      expect(result.main.temp).toBe(20)
      expect(result.weather[0].main).toBe("Clear")
      expect(result.coordinates.latitude).toBe(40.7128)
      expect(result.coordinates.longitude).toBe(-74.006)
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(OPENWEATHERMAP_API_URL),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      )
    })

    it("debe usar opciones personalizadas cuando se proporcionan", async () => {
      const mockResponse = {
        coord: { lat: 40.4168, lon: -3.7038 },
        weather: [{ id: 800, main: "Clear", description: "cielo claro", icon: "01d" }],
        base: "stations",
        main: {
          temp: 15,
          feels_like: 14,
          temp_min: 13,
          temp_max: 17,
          pressure: 1015,
          humidity: 50,
        },
        visibility: 10000,
        wind: { speed: 3, deg: 90 },
        clouds: { all: 0 },
        dt: 1609459200,
        sys: { country: "ES", sunrise: 1609416000, sunset: 1609449600 },
        timezone: 3600,
        id: 3117735,
        name: "Madrid",
        cod: 200,
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      await service.getWeatherByCoordinates(40.4168, -3.7038, {
        units: "imperial",
        language: "es",
      })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("units=imperial"),
        expect.any(Object)
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("lang=es"),
        expect.any(Object)
      )
    })

    it("debe lanzar error cuando la API responde con error", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      })

      await expect(service.getWeatherByCoordinates(40.7128, -74.006)).rejects.toThrow(WeatherError)
    })

    it("debe lanzar error cuando la petición falla por red", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"))

      await expect(service.getWeatherByCoordinates(40.7128, -74.006)).rejects.toThrow(
        "Error al obtener información del clima"
      )
    })

    it("debe respetar el timeout configurado", async () => {
      const mockResponse = {
        coord: { lat: 51.5074, lon: -0.1278 },
        weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
        base: "stations",
        main: {
          temp: 12,
          feels_like: 11,
          temp_min: 10,
          temp_max: 14,
          pressure: 1010,
          humidity: 70,
        },
        visibility: 10000,
        wind: { speed: 4, deg: 270 },
        clouds: { all: 10 },
        dt: 1609459200,
        sys: { country: "GB", sunrise: 1609416000, sunset: 1609449600 },
        timezone: 0,
        id: 2643743,
        name: "London",
        cod: 200,
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      await service.getWeatherByCoordinates(51.5074, -0.1278, { timeout: 3000 })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      )
    })
  })

  describe("getWeatherByCoordinatesOrDefault", () => {
    it("debe retornar información del clima cuando la API responde correctamente", async () => {
      const mockResponse = {
        coord: { lat: 48.8566, lon: 2.3522 },
        weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
        base: "stations",
        main: {
          temp: 18,
          feels_like: 17,
          temp_min: 16,
          temp_max: 20,
          pressure: 1012,
          humidity: 65,
        },
        visibility: 10000,
        wind: { speed: 3.5, deg: 200 },
        clouds: { all: 5 },
        dt: 1609459200,
        sys: { country: "FR", sunrise: 1609416000, sunset: 1609449600 },
        timezone: 3600,
        id: 2988507,
        name: "Paris",
        cod: 200,
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.getWeatherByCoordinatesOrDefault(48.8566, 2.3522)

      expect(result.cityName).toBe("Paris")
      expect(result.main.temp).toBe(18)
    })

    it("debe retornar información por defecto cuando la API falla", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"))

      const result = await service.getWeatherByCoordinatesOrDefault(48.8566, 2.3522)

      expect(result.cityName).toBe("Unknown")
      expect(result.coordinates.latitude).toBe(48.8566)
      expect(result.coordinates.longitude).toBe(2.3522)
    })
  })

  describe("getWeatherByCity", () => {
    it("debe obtener información del clima por nombre de ciudad", async () => {
      const mockResponse = {
        coord: { lat: 35.6762, lon: 139.6503 },
        weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
        base: "stations",
        main: {
          temp: 22,
          feels_like: 21,
          temp_min: 20,
          temp_max: 24,
          pressure: 1015,
          humidity: 55,
        },
        visibility: 10000,
        wind: { speed: 2, deg: 90 },
        clouds: { all: 0 },
        dt: 1609459200,
        sys: { country: "JP", sunrise: 1609416000, sunset: 1609449600 },
        timezone: 32400,
        id: 1850144,
        name: "Tokyo",
        cod: 200,
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.getWeatherByCity("Tokyo")

      expect(result.cityName).toBe("Tokyo")
      expect(result.main.temp).toBe(22)
      expect(result.sys.country).toBe("JP")
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("q=Tokyo"),
        expect.any(Object)
      )
    })

    it("debe lanzar error cuando la ciudad no se encuentra", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      })

      await expect(service.getWeatherByCity("InvalidCity")).rejects.toThrow(WeatherError)
    })
  })

  describe("getWeatherByCityOrDefault", () => {
    it("debe retornar información del clima cuando la búsqueda es exitosa", async () => {
      const mockResponse = {
        coord: { lat: -33.8688, lon: 151.2093 },
        weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
        base: "stations",
        main: {
          temp: 25,
          feels_like: 24,
          temp_min: 23,
          temp_max: 27,
          pressure: 1010,
          humidity: 60,
        },
        visibility: 10000,
        wind: { speed: 5, deg: 180 },
        clouds: { all: 0 },
        dt: 1609459200,
        sys: { country: "AU", sunrise: 1609416000, sunset: 1609449600 },
        timezone: 36000,
        id: 2147714,
        name: "Sydney",
        cod: 200,
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.getWeatherByCityOrDefault("Sydney")

      expect(result.cityName).toBe("Sydney")
    })

    it("debe retornar información por defecto cuando falla la búsqueda", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"))

      const result = await service.getWeatherByCityOrDefault("InvalidCity")

      expect(result.cityName).toBe("Unknown")
    })
  })

  describe("getWeatherFromGeolocation", () => {
    it("debe obtener clima usando el servicio de geolocalización", async () => {
      const mockPosition = {
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

      const mockWeatherResponse = {
        coord: { lat: 40.7128, lon: -74.006 },
        weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
        base: "stations",
        main: {
          temp: 20,
          feels_like: 19,
          temp_min: 18,
          temp_max: 22,
          pressure: 1013,
          humidity: 60,
        },
        visibility: 10000,
        wind: { speed: 5, deg: 180 },
        clouds: { all: 0 },
        dt: 1609459200,
        sys: { country: "US", sunrise: 1609416000, sunset: 1609449600 },
        timezone: -18000,
        id: 5128581,
        name: "New York",
        cod: 200,
      }

      mockGeolocationService.getPosition = vi.fn().mockResolvedValue(mockPosition)

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockWeatherResponse,
      })

      const result = await service.getWeatherFromGeolocation()

      expect(result.cityName).toBe("New York")
      expect(mockGeolocationService.getPosition).toHaveBeenCalled()
    })

    it("debe lanzar error cuando no hay servicio de geolocalización", async () => {
      const serviceWithoutGeo = new WeatherService(mockApiKey)

      await expect(serviceWithoutGeo.getWeatherFromGeolocation()).rejects.toThrow(
        "Servicio de geolocalización no disponible"
      )
    })

    it("debe lanzar error cuando falla la geolocalización", async () => {
      mockGeolocationService.getPosition = vi
        .fn()
        .mockRejectedValue(new Error("Geolocation failed"))

      await expect(service.getWeatherFromGeolocation()).rejects.toThrow()
    })
  })

  describe("getWeatherFromGeolocationOrDefault", () => {
    it("debe retornar clima cuando la geolocalización funciona", async () => {
      const mockPosition = {
        coords: {
          latitude: 40.4168,
          longitude: -3.7038,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      }

      mockGeolocationService.getPosition = vi.fn().mockResolvedValue(mockPosition)

      const mockWeatherResponse = {
        coord: { lat: 40.4168, lon: -3.7038 },
        weather: [{ id: 800, main: "Clear", description: "clear sky", icon: "01d" }],
        base: "stations",
        main: {
          temp: 15,
          feels_like: 14,
          temp_min: 13,
          temp_max: 17,
          pressure: 1015,
          humidity: 50,
        },
        visibility: 10000,
        wind: { speed: 3, deg: 90 },
        clouds: { all: 0 },
        dt: 1609459200,
        sys: { country: "ES", sunrise: 1609416000, sunset: 1609449600 },
        timezone: 3600,
        id: 3117735,
        name: "Madrid",
        cod: 200,
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockWeatherResponse,
      })

      const result = await service.getWeatherFromGeolocationOrDefault()

      expect(result.cityName).toBe("Madrid")
    })

    it("debe retornar información por defecto cuando todo falla", async () => {
      mockGeolocationService.getPosition = vi
        .fn()
        .mockRejectedValue(new Error("Geolocation failed"))

      const result = await service.getWeatherFromGeolocationOrDefault()

      expect(result.cityName).toBe("Unknown")
    })
  })

  describe("validateApiKey", () => {
    it("debe validar que la API key funciona correctamente", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
      })

      const isValid = await service.validateApiKey()

      expect(isValid).toBe(true)
    })

    it("debe retornar false cuando la API key es inválida", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      })

      const isValid = await service.validateApiKey()

      expect(isValid).toBe(false)
    })

    it("debe retornar false cuando hay error de red", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"))

      const isValid = await service.validateApiKey()

      expect(isValid).toBe(false)
    })
  })

  describe("getDefaultWeatherInfo", () => {
    it("debe retornar información de clima por defecto", () => {
      const defaultInfo = service.getDefaultWeatherInfo()

      expect(defaultInfo.cityName).toBe("Unknown")
      expect(defaultInfo.main.temp).toBe(0)
    })

    it("debe retornar una copia de la información por defecto", () => {
      const info1 = service.getDefaultWeatherInfo()
      const info2 = service.getDefaultWeatherInfo()

      expect(info1).not.toBe(info2)
      expect(info1).toEqual(info2)
    })
  })

  describe("getIconUrl", () => {
    it("debe generar URL correcta para icono de clima con tamaño por defecto", () => {
      const url = service.getIconUrl("01d")

      expect(url).toBe("https://openweathermap.org/img/wn/01d@2x.png")
    })

    it("debe generar URL correcta para icono de clima con tamaño 4x", () => {
      const url = service.getIconUrl("01d", "4x")

      expect(url).toBe("https://openweathermap.org/img/wn/01d@4x.png")
    })
  })

  describe("createWeatherServiceFromEnv", () => {
    it("debe crear instancia con API key desde variable de entorno", async () => {
      const originalEnv = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY
      process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY = "env-api-key"

      const weatherModule = await import("./weather.service")
      const serviceFromEnv = weatherModule.createWeatherServiceFromEnv()

      expect(serviceFromEnv).toBeInstanceOf(WeatherService)

      process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY = originalEnv
    })

    it("debe lanzar error cuando no hay API key en variables de entorno", async () => {
      const originalEnv = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY
      delete process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY

      const weatherModule = await import("./weather.service")

      expect(() => weatherModule.createWeatherServiceFromEnv()).toThrow(
        "NEXT_PUBLIC_OPENWEATHERMAP_API_KEY no está configurada en las variables de entorno"
      )

      process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY = originalEnv
    })
  })
})
