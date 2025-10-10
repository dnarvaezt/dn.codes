import { BIGDATACLOUD_API_URL, GeocodingError } from "@/core/domain/types/geocoding"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { GeocodingService } from "./geocoding.service"

import type { GeolocationService } from "@/infrastructure/browser/geolocation"
import type { LanguageService } from "@/infrastructure/browser/language"

describe("GeocodingService", () => {
  let service: GeocodingService
  let mockGeolocationService: Partial<GeolocationService>
  let mockLanguageService: Partial<LanguageService>

  beforeEach(() => {
    mockGeolocationService = {
      getCurrentPosition: vi.fn(),
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
    service = new GeocodingService(undefined, mockLanguageService as LanguageService)
    vi.clearAllMocks()
    global.fetch = vi.fn()
  })

  describe("getCityByCoordinates", () => {
    it("debe retornar información de la ciudad cuando la API responde correctamente", async () => {
      const mockResponse = {
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

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.getCityByCoordinates(40.7128, -74.006)

      expect(result).toEqual(mockResponse)
      expect(global.fetch).toHaveBeenCalledWith(
        `${BIGDATACLOUD_API_URL}?latitude=40.7128&longitude=-74.006&localityLanguage=en`,
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      )
    })

    it("debe usar idioma personalizado cuando se proporciona", async () => {
      const mockResponse = {
        city: "Nueva York",
        locality: "Nueva York",
        principalSubdivision: "Nueva York",
        principalSubdivisionCode: "NY",
        countryName: "Estados Unidos",
        countryCode: "US",
        continent: "América del Norte",
        continentCode: "NA",
        latitude: 40.7128,
        longitude: -74.006,
        localityLanguageRequested: "es",
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.getCityByCoordinates(40.7128, -74.006, { language: "es" })

      expect(result.localityLanguageRequested).toBe("es")
      expect(global.fetch).toHaveBeenCalledWith(
        `${BIGDATACLOUD_API_URL}?latitude=40.7128&longitude=-74.006&localityLanguage=es`,
        expect.any(Object)
      )
    })

    it("debe lanzar error cuando la API responde con error", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: "Bad Request",
      })

      await expect(service.getCityByCoordinates(40.7128, -74.006)).rejects.toThrow(GeocodingError)
    })

    it("debe lanzar error cuando la petición falla por red", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"))

      await expect(service.getCityByCoordinates(40.7128, -74.006)).rejects.toThrow(
        "Error al obtener información de geocoding"
      )
    })

    it("debe respetar el timeout configurado", async () => {
      const mockResponse = {
        city: "London",
        locality: "London",
        principalSubdivision: "England",
        principalSubdivisionCode: "ENG",
        countryName: "United Kingdom",
        countryCode: "GB",
        continent: "Europe",
        continentCode: "EU",
        latitude: 51.5074,
        longitude: -0.1278,
        localityLanguageRequested: "en",
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      await service.getCityByCoordinates(51.5074, -0.1278, { timeout: 3000 })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: expect.any(AbortSignal),
        })
      )
    })
  })

  describe("getCityByCoordinatesOrDefault", () => {
    it("debe retornar información de la ciudad cuando la API responde correctamente", async () => {
      const mockResponse = {
        city: "Paris",
        locality: "Paris",
        principalSubdivision: "Île-de-France",
        principalSubdivisionCode: "IDF",
        countryName: "France",
        countryCode: "FR",
        continent: "Europe",
        continentCode: "EU",
        latitude: 48.8566,
        longitude: 2.3522,
        localityLanguageRequested: "en",
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await service.getCityByCoordinatesOrDefault(48.8566, 2.3522)

      expect(result.city).toBe("Paris")
      expect(result.countryName).toBe("France")
    })

    it("debe retornar información por defecto cuando la API falla", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network error"))

      const result = await service.getCityByCoordinatesOrDefault(48.8566, 2.3522)

      expect(result.city).toBe("Unknown")
      expect(result.countryName).toBe("Unknown")
      expect(result.latitude).toBe(48.8566)
      expect(result.longitude).toBe(2.3522)
    })
  })

  describe("getCityFromGeolocation", () => {
    it("debe obtener ciudad usando el servicio de geolocalización", async () => {
      const serviceWithGeo = new GeocodingService(
        mockGeolocationService as GeolocationService,
        mockLanguageService as LanguageService
      )

      const mockPosition = {
        coords: {
          latitude: 35.6762,
          longitude: 139.6503,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      }

      const mockCityInfo = {
        city: "Tokyo",
        locality: "Tokyo",
        principalSubdivision: "Tokyo",
        principalSubdivisionCode: "13",
        countryName: "Japan",
        countryCode: "JP",
        continent: "Asia",
        continentCode: "AS",
        latitude: 35.6762,
        longitude: 139.6503,
        localityLanguageRequested: "en",
      }

      mockGeolocationService.getPosition = vi.fn().mockResolvedValue(mockPosition)

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockCityInfo,
      })

      const result = await serviceWithGeo.getCityFromGeolocation()

      expect(result.city).toBe("Tokyo")
      expect(mockGeolocationService.getPosition).toHaveBeenCalled()
    })

    it("debe lanzar error cuando no hay servicio de geolocalización", async () => {
      await expect(service.getCityFromGeolocation()).rejects.toThrow(
        "Servicio de geolocalización no disponible"
      )
    })

    it("debe lanzar error cuando falla la geolocalización", async () => {
      const serviceWithGeo = new GeocodingService(
        mockGeolocationService as GeolocationService,
        mockLanguageService as LanguageService
      )

      mockGeolocationService.getPosition = vi
        .fn()
        .mockRejectedValue(new Error("Geolocation failed"))

      await expect(serviceWithGeo.getCityFromGeolocation()).rejects.toThrow()
    })

    it("debe usar opciones de geolocalización personalizadas", async () => {
      const serviceWithGeo = new GeocodingService(
        mockGeolocationService as GeolocationService,
        mockLanguageService as LanguageService
      )

      const mockPosition = {
        coords: {
          latitude: -33.8688,
          longitude: 151.2093,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      }

      mockGeolocationService.getPosition = vi.fn().mockResolvedValue(mockPosition)

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          city: "Sydney",
          locality: "Sydney",
          principalSubdivision: "New South Wales",
          principalSubdivisionCode: "NSW",
          countryName: "Australia",
          countryCode: "AU",
          continent: "Oceania",
          continentCode: "OC",
          latitude: -33.8688,
          longitude: 151.2093,
          localityLanguageRequested: "en",
        }),
      })

      await serviceWithGeo.getCityFromGeolocation({
        geolocationOptions: { timeout: 5000 },
      })

      expect(mockGeolocationService.getPosition).toHaveBeenCalledWith({ timeout: 5000 })
    })
  })

  describe("getCityFromGeolocationOrDefault", () => {
    it("debe retornar ciudad cuando la geolocalización funciona", async () => {
      const serviceWithGeo = new GeocodingService(
        mockGeolocationService as GeolocationService,
        mockLanguageService as LanguageService
      )

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

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          city: "Madrid",
          locality: "Madrid",
          principalSubdivision: "Community of Madrid",
          principalSubdivisionCode: "MD",
          countryName: "Spain",
          countryCode: "ES",
          continent: "Europe",
          continentCode: "EU",
          latitude: 40.4168,
          longitude: -3.7038,
          localityLanguageRequested: "en",
        }),
      })

      const result = await serviceWithGeo.getCityFromGeolocationOrDefault()

      expect(result.city).toBe("Madrid")
    })

    it("debe retornar información por defecto cuando todo falla", async () => {
      const serviceWithGeo = new GeocodingService(
        mockGeolocationService as GeolocationService,
        mockLanguageService as LanguageService
      )

      mockGeolocationService.getPosition = vi
        .fn()
        .mockRejectedValue(new Error("Geolocation failed"))

      const result = await serviceWithGeo.getCityFromGeolocationOrDefault()

      expect(result.city).toBe("Unknown")
      expect(result.countryName).toBe("Unknown")
    })
  })

  describe("getDefaultCityInfo", () => {
    it("debe retornar información de ciudad por defecto", () => {
      const defaultInfo = service.getDefaultCityInfo()

      expect(defaultInfo.city).toBe("Unknown")
      expect(defaultInfo.countryName).toBe("Unknown")
      expect(defaultInfo.latitude).toBe(0)
      expect(defaultInfo.longitude).toBe(0)
    })

    it("debe retornar una copia de la información por defecto", () => {
      const info1 = service.getDefaultCityInfo()
      const info2 = service.getDefaultCityInfo()

      expect(info1).not.toBe(info2)
      expect(info1).toEqual(info2)
    })
  })
})
