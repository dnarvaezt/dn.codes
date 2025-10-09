import { beforeEach, describe, expect, it, vi } from "vitest"
import { CitySearchService } from "./city-search.service"
import { CitySearchError, GEOAPIFY_AUTOCOMPLETE_URL } from "./city-search.types"

import type { LanguageService } from "../language"

describe("CitySearchService", () => {
  let service: CitySearchService
  let mockLanguageService: Partial<LanguageService>
  const mockApiKey = "test-api-key"

  beforeEach(() => {
    mockLanguageService = {
      getCurrentLanguage: vi.fn().mockReturnValue({
        language: "en",
        fullCode: "en-US",
        isManual: false,
        detectionMethod: "browser",
      }),
    }
    service = new CitySearchService(mockApiKey, mockLanguageService as LanguageService)
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  describe("searchCities", () => {
    it("debe buscar ciudades y retornar resultados correctamente", async () => {
      const mockResponse = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              place_id: "1",
              name: "New York",
              city: "New York",
              country: "United States",
              country_code: "us",
              state: "New York",
              formatted: "New York, NY, United States",
              lat: 40.7128,
              lon: -74.006,
              result_type: "city",
              rank: {
                importance: 0.9,
              },
            },
            geometry: {
              type: "Point",
              coordinates: [-74.006, 40.7128],
            },
          },
        ],
        query: {
          text: "New York",
          parsed: {
            city: "New York",
            expected_type: "city",
          },
        },
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const results = await service.searchCities("New York")

      expect(results).toHaveLength(1)
      expect(results[0]).toEqual({
        city: "New York",
        country: "United States",
        countryCode: "us",
        state: "New York",
        coordinates: {
          latitude: 40.7128,
          longitude: -74.006,
        },
        formatted: "New York, NY, United States",
        placeId: "1",
      })
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(GEOAPIFY_AUTOCOMPLETE_URL),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      )
    })

    it("debe usar opciones personalizadas cuando se proporcionan", async () => {
      const mockResponse = {
        type: "FeatureCollection",
        features: [],
        query: {
          text: "Madrid",
          parsed: {},
        },
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      await service.searchCities("Madrid", {
        limit: 5,
        language: "es",
        countryFilter: ["es"],
      })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("limit=5"),
        expect.any(Object)
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("lang=es"),
        expect.any(Object)
      )
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("filter=countrycode%3Aes"),
        expect.any(Object)
      )
    })

    it("debe lanzar error cuando la API responde con error", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
      })

      await expect(service.searchCities("London")).rejects.toThrow(CitySearchError)
    })

    it("debe lanzar error cuando la petición falla por red", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"))

      await expect(service.searchCities("Paris")).rejects.toThrow("Error al buscar ciudades")
    })

    it("debe respetar el timeout configurado", async () => {
      const mockResponse = {
        type: "FeatureCollection",
        features: [],
        query: {
          text: "Tokyo",
          parsed: {},
        },
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      await service.searchCities("Tokyo", { timeout: 3000 })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      )
    })

    it("debe retornar array vacío cuando no hay resultados", async () => {
      const mockResponse = {
        type: "FeatureCollection",
        features: [],
        query: {
          text: "NonexistentCity",
          parsed: {},
        },
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const results = await service.searchCities("NonexistentCity")

      expect(results).toEqual([])
    })

    it("debe manejar ciudades sin estado opcional", async () => {
      const mockResponse = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              place_id: "2",
              name: "London",
              city: "London",
              country: "United Kingdom",
              country_code: "gb",
              formatted: "London, United Kingdom",
              lat: 51.5074,
              lon: -0.1278,
              result_type: "city",
              rank: {
                importance: 0.95,
              },
            },
            geometry: {
              type: "Point",
              coordinates: [-0.1278, 51.5074],
            },
          },
        ],
        query: {
          text: "London",
          parsed: {
            city: "London",
          },
        },
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const results = await service.searchCities("London")

      expect(results[0].state).toBeUndefined()
      expect(results[0].city).toBe("London")
    })

    it("debe retornar array vacío cuando la respuesta no tiene features", async () => {
      const mockResponse = {
        type: "FeatureCollection",
        query: {
          text: "Test",
          parsed: {},
        },
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const results = await service.searchCities("Test")

      expect(results).toEqual([])
    })

    it("debe retornar array vacío cuando features no es un array", async () => {
      const mockResponse = {
        type: "FeatureCollection",
        features: null,
        query: {
          text: "Test",
          parsed: {},
        },
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const results = await service.searchCities("Test")

      expect(results).toEqual([])
    })
  })

  describe("searchCitiesOrEmpty", () => {
    it("debe retornar resultados cuando la búsqueda es exitosa", async () => {
      const mockResponse = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              place_id: "3",
              name: "Paris",
              city: "Paris",
              country: "France",
              country_code: "fr",
              formatted: "Paris, France",
              lat: 48.8566,
              lon: 2.3522,
              result_type: "city",
              rank: {
                importance: 0.9,
              },
            },
            geometry: {
              type: "Point",
              coordinates: [2.3522, 48.8566],
            },
          },
        ],
        query: {
          text: "Paris",
          parsed: {
            city: "Paris",
          },
        },
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const results = await service.searchCitiesOrEmpty("Paris")

      expect(results).toHaveLength(1)
      expect(results[0].city).toBe("Paris")
    })

    it("debe retornar array vacío cuando falla la búsqueda", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"))

      const results = await service.searchCitiesOrEmpty("Madrid")

      expect(results).toEqual([])
    })
  })

  describe("getCityById", () => {
    it("debe buscar primero y retornar ciudad por ID", async () => {
      const mockResponse = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {
              place_id: "test-id",
              name: "Berlin",
              city: "Berlin",
              country: "Germany",
              country_code: "de",
              formatted: "Berlin, Germany",
              lat: 52.52,
              lon: 13.405,
              result_type: "city",
              rank: {
                importance: 0.88,
              },
            },
            geometry: {
              type: "Point",
              coordinates: [13.405, 52.52],
            },
          },
        ],
        query: {
          text: "Berlin",
          parsed: {
            city: "Berlin",
          },
        },
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.getCityById("test-id", "Berlin")

      expect(result).toBeDefined()
      expect(result?.placeId).toBe("test-id")
      expect(result?.city).toBe("Berlin")
    })

    it("debe retornar null cuando no encuentra la ciudad", async () => {
      const mockResponse = {
        type: "FeatureCollection",
        features: [],
        query: {
          text: "NonExistent",
          parsed: {},
        },
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.getCityById("invalid-id", "NonExistent")

      expect(result).toBeNull()
    })
  })

  describe("validateApiKey", () => {
    it("debe validar que la API key funciona correctamente", async () => {
      const mockResponse = {
        type: "FeatureCollection",
        features: [],
        query: {
          text: "test",
          parsed: {},
        },
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
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

  describe("constructor sin API key", () => {
    it("debe lanzar error cuando no se proporciona API key", () => {
      expect(() => new CitySearchService("")).toThrow("API key de Geoapify es requerida")
    })
  })
})
