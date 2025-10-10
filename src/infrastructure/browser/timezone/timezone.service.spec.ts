import { beforeEach, describe, expect, it, vi } from "vitest"
import { TimezoneService } from "./timezone.service"

import type { GeolocationService } from "@/infrastructure/browser/geolocation"
import type { LanguageService } from "@/infrastructure/browser/language"

describe("TimezoneService", () => {
  let service: TimezoneService
  let mockGeolocationService: Partial<GeolocationService>
  let mockLanguageService: Partial<LanguageService>

  beforeEach(() => {
    mockGeolocationService = {
      getCurrentPosition: vi.fn(),
      getCurrentPositionOrDefault: vi.fn(),
    }
    mockLanguageService = {
      getCurrentLanguage: vi.fn().mockReturnValue({
        language: "en",
        fullCode: "en-US",
        isManual: false,
        detectionMethod: "browser",
      }),
    }
    service = new TimezoneService(
      mockGeolocationService as GeolocationService,
      mockLanguageService as LanguageService
    )
    vi.clearAllMocks()
  })

  describe("getTimezone", () => {
    it("debe retornar la zona horaria del navegador", () => {
      const result = service.getTimezone()

      expect(result).toBeDefined()
      expect(result.timezone).toBeDefined()
      expect(typeof result.timezone).toBe("string")
      expect(result.offset).toBeDefined()
      expect(typeof result.offset).toBe("number")
      expect(result.offsetString).toBeDefined()
      expect(typeof result.offsetString).toBe("string")
      expect(result.locale).toBeDefined()
      expect(typeof result.locale).toBe("string")
    })

    it("debe retornar offset como número en minutos", () => {
      const result = service.getTimezone()

      expect(result.offset).toBeGreaterThanOrEqual(-720)
      expect(result.offset).toBeLessThanOrEqual(840)
    })

    it("debe retornar offsetString con formato correcto", () => {
      const result = service.getTimezone()

      expect(result.offsetString).toMatch(/^[+-]\d{2}:\d{2}$/)
    })
  })

  describe("getTimezoneWithOptions", () => {
    it("debe usar el locale proporcionado en las opciones", () => {
      const customLocale = "es-ES"
      const result = service.getTimezoneWithOptions({ locale: customLocale })

      expect(result.locale).toBe(customLocale)
    })

    it("debe incluir offset cuando includeOffset es true", () => {
      const result = service.getTimezoneWithOptions({ includeOffset: true })

      expect(result.offset).toBeDefined()
      expect(result.offsetString).toBeDefined()
    })

    it("debe usar valores por defecto cuando no se proporcionan opciones", () => {
      const result = service.getTimezoneWithOptions()

      expect(result).toBeDefined()
      expect(result.timezone).toBeDefined()
    })
  })

  describe("getOffset", () => {
    it("debe retornar el offset en minutos", () => {
      const offset = service.getOffset()

      expect(typeof offset).toBe("number")
      expect(offset).toBeGreaterThanOrEqual(-720)
      expect(offset).toBeLessThanOrEqual(840)
    })
  })

  describe("getOffsetString", () => {
    it("debe formatear offset positivo correctamente", () => {
      vi.spyOn(service, "getOffset").mockReturnValue(120)

      const result = service.getOffsetString()

      expect(result).toBe("+02:00")
    })

    it("debe formatear offset negativo correctamente", () => {
      vi.spyOn(service, "getOffset").mockReturnValue(-300)

      const result = service.getOffsetString()

      expect(result).toBe("-05:00")
    })

    it("debe formatear offset cero correctamente", () => {
      vi.spyOn(service, "getOffset").mockReturnValue(0)

      const result = service.getOffsetString()

      expect(result).toBe("+00:00")
    })
  })

  describe("getTimezoneName", () => {
    it("debe retornar el nombre de la zona horaria", () => {
      const name = service.getTimezoneName()

      expect(typeof name).toBe("string")
      expect(name.length).toBeGreaterThan(0)
    })
  })

  describe("getUserLocale", () => {
    it("debe retornar el locale del navegador", () => {
      const locale = service.getUserLocale()

      expect(typeof locale).toBe("string")
      expect(locale.length).toBeGreaterThan(0)
    })

    it("debe retornar locale por defecto si no está disponible", () => {
      const originalLanguage = navigator.language

      Object.defineProperty(navigator, "language", {
        value: undefined,
        configurable: true,
      })

      const locale = service.getUserLocale()

      expect(locale).toBe("en-US")

      Object.defineProperty(navigator, "language", {
        value: originalLanguage,
        configurable: true,
      })
    })
  })

  describe("formatDate", () => {
    it("debe formatear fecha con zona horaria del usuario", () => {
      const date = new Date("2024-01-15T12:00:00Z")
      const formatted = service.formatDate(date)

      expect(typeof formatted).toBe("string")
      expect(formatted.length).toBeGreaterThan(0)
    })

    it("debe usar locale personalizado si se proporciona", () => {
      const date = new Date("2024-01-15T12:00:00Z")
      const formatted = service.formatDate(date, { locale: "es-ES" })

      expect(typeof formatted).toBe("string")
      expect(formatted.length).toBeGreaterThan(0)
    })
  })

  describe("compareTimezones", () => {
    it("debe comparar zona horaria actual con otra zona horaria", () => {
      const comparison = service.compareTimezones("America/New_York")

      expect(comparison).toBeDefined()
      expect(comparison.currentTimezone).toBeDefined()
      expect(comparison.targetTimezone).toBe("America/New_York")
      expect(typeof comparison.offsetDifference).toBe("number")
    })

    it("debe calcular diferencia de offset correctamente", () => {
      const comparison = service.compareTimezones("UTC")

      expect(comparison.offsetDifference).toBeDefined()
      expect(typeof comparison.offsetDifference).toBe("number")
    })
  })

  describe("isValidTimezone", () => {
    it("debe retornar true para zonas horarias válidas", () => {
      expect(service.isValidTimezone("America/New_York")).toBe(true)
      expect(service.isValidTimezone("Europe/London")).toBe(true)
      expect(service.isValidTimezone("Asia/Tokyo")).toBe(true)
    })

    it("debe retornar false para zonas horarias inválidas", () => {
      expect(service.isValidTimezone("Invalid/Timezone")).toBe(false)
      expect(service.isValidTimezone("")).toBe(false)
    })
  })

  describe("getDefaultTimezone", () => {
    it("debe retornar la zona horaria por defecto", () => {
      const defaultTz = service.getDefaultTimezone()

      expect(defaultTz).toBeDefined()
      expect(defaultTz.timezone).toBe("UTC")
      expect(defaultTz.offset).toBe(0)
      expect(defaultTz.offsetString).toBe("+00:00")
      expect(defaultTz.locale).toBe("en-US")
      expect(defaultTz.isManual).toBe(false)
    })

    it("debe retornar una copia de la zona horaria por defecto", () => {
      const tz1 = service.getDefaultTimezone()
      const tz2 = service.getDefaultTimezone()

      expect(tz1).not.toBe(tz2)
      expect(tz1).toEqual(tz2)
    })
  })

  describe("setManualTimezone", () => {
    it("debe configurar una zona horaria manualmente", () => {
      service.setManualTimezone("America/New_York")

      const timezone = service.getCurrentTimezone()

      expect(timezone.timezone).toBe("America/New_York")
      expect(timezone.isManual).toBe(true)
    })

    it("debe lanzar error si la zona horaria no es válida", () => {
      expect(() => service.setManualTimezone("Invalid/Timezone")).toThrow(
        "La zona horaria 'Invalid/Timezone' no es válida"
      )
    })
  })

  describe("getTimezoneByCoordinates", () => {
    it("debe obtener zona horaria basada en coordenadas", () => {
      const result = service.getTimezoneByCoordinates(40.7128, -74.006)

      expect(result).toBeDefined()
      expect(result.timezone).toBeDefined()
      expect(typeof result.timezone).toBe("string")
      expect(result.coordinates).toEqual({
        latitude: 40.7128,
        longitude: -74.006,
      })
      expect(result.isManual).toBe(false)
    })

    it("debe retornar zona horaria por defecto si no puede determinar la ubicación", () => {
      const result = service.getTimezoneByCoordinates(0, 0)

      expect(result).toBeDefined()
      expect(result.timezone).toBeDefined()
    })
  })

  describe("detectTimezoneAutomatically", () => {
    it("debe detectar zona horaria usando geolocalización", async () => {
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

      mockGeolocationService.getCurrentPosition = vi.fn().mockResolvedValue(mockPosition)

      const result = await service.detectTimezoneAutomatically({ useGeolocation: true })

      expect(result).toBeDefined()
      expect(result.coordinates).toEqual({
        latitude: 40.7128,
        longitude: -74.006,
      })
      expect(result.isManual).toBe(false)
      expect(mockGeolocationService.getCurrentPosition).toHaveBeenCalled()
    })

    it("debe usar zona horaria del navegador si no se usa geolocalización", async () => {
      const result = await service.detectTimezoneAutomatically({ useGeolocation: false })

      expect(result).toBeDefined()
      expect(result.timezone).toBeDefined()
      expect(result.isManual).toBe(false)
      expect(mockGeolocationService.getCurrentPosition).not.toHaveBeenCalled()
    })

    it("debe retornar zona horaria del navegador si falla la geolocalización", async () => {
      mockGeolocationService.getCurrentPosition = vi
        .fn()
        .mockRejectedValue(new Error("Geolocation failed"))

      const result = await service.detectTimezoneAutomatically({
        useGeolocation: true,
        fallbackToManual: false,
      })

      expect(result).toBeDefined()
      expect(result.timezone).toBeDefined()
      expect(result.isManual).toBe(false)
    })
  })

  describe("getCurrentTimezone", () => {
    it("debe retornar la zona horaria configurada actualmente", () => {
      const timezone = service.getCurrentTimezone()

      expect(timezone).toBeDefined()
      expect(timezone.timezone).toBeDefined()
      expect(typeof timezone.isManual).toBe("boolean")
    })

    it("debe retornar zona horaria manual si fue configurada", () => {
      service.setManualTimezone("Europe/London")

      const timezone = service.getCurrentTimezone()

      expect(timezone.timezone).toBe("Europe/London")
      expect(timezone.isManual).toBe(true)
    })
  })

  describe("resetToAutomatic", () => {
    it("debe resetear a detección automática", () => {
      service.setManualTimezone("America/New_York")

      expect(service.getCurrentTimezone().isManual).toBe(true)

      service.resetToAutomatic()

      expect(service.getCurrentTimezone().isManual).toBe(false)
    })
  })

  describe("isManuallySet", () => {
    it("debe retornar false por defecto", () => {
      expect(service.isManuallySet()).toBe(false)
    })

    it("debe retornar true después de configurar manualmente", () => {
      service.setManualTimezone("Asia/Tokyo")

      expect(service.isManuallySet()).toBe(true)
    })

    it("debe retornar false después de resetear", () => {
      service.setManualTimezone("Asia/Tokyo")
      service.resetToAutomatic()

      expect(service.isManuallySet()).toBe(false)
    })
  })

  describe("setTimezoneByGeolocation", () => {
    it("debe configurar zona horaria usando geolocalización", async () => {
      const mockPosition = {
        coords: {
          latitude: 51.5074,
          longitude: -0.1278,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      }

      mockGeolocationService.getCurrentPosition = vi.fn().mockResolvedValue(mockPosition)

      const result = await service.setTimezoneByGeolocation()

      expect(result).toBeDefined()
      expect(result.coordinates).toEqual({
        latitude: 51.5074,
        longitude: -0.1278,
      })
      expect(result.isManual).toBe(false)
      expect(mockGeolocationService.getCurrentPosition).toHaveBeenCalled()
    })

    it("debe usar opciones de geolocalización personalizadas", async () => {
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

      mockGeolocationService.getCurrentPosition = vi.fn().mockResolvedValue(mockPosition)

      const result = await service.setTimezoneByGeolocation({
        timeout: 3000,
        enableHighAccuracy: true,
      })

      expect(result).toBeDefined()
      expect(mockGeolocationService.getCurrentPosition).toHaveBeenCalledWith({
        timeout: 3000,
        enableHighAccuracy: true,
      })
    })

    it("debe lanzar error si no hay servicio de geolocalización", async () => {
      const serviceWithoutGeo = new TimezoneService()

      await expect(serviceWithoutGeo.setTimezoneByGeolocation()).rejects.toThrow(
        "Servicio de geolocalización no disponible"
      )
    })

    it("debe lanzar error si la geolocalización falla", async () => {
      mockGeolocationService.getCurrentPosition = vi
        .fn()
        .mockRejectedValue(new Error("GPS no disponible"))

      await expect(service.setTimezoneByGeolocation()).rejects.toThrow()
    })

    it("debe actualizar la zona horaria actual después de configurar por geolocalización", async () => {
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

      mockGeolocationService.getCurrentPosition = vi.fn().mockResolvedValue(mockPosition)

      await service.setTimezoneByGeolocation()

      const current = service.getCurrentTimezone()
      expect(current.coordinates).toEqual({
        latitude: -33.8688,
        longitude: 151.2093,
      })
    })
  })

  describe("setTimezoneFromBrowser", () => {
    it("debe configurar zona horaria desde el navegador", () => {
      const result = service.setTimezoneFromBrowser()

      expect(result).toBeDefined()
      expect(result.timezone).toBeDefined()
      expect(result.isManual).toBe(false)
      expect(result.coordinates).toBeUndefined()
    })

    it("debe actualizar la zona horaria actual", () => {
      service.setManualTimezone("America/New_York")

      expect(service.getCurrentTimezone().timezone).toBe("America/New_York")

      service.setTimezoneFromBrowser()

      const current = service.getCurrentTimezone()
      expect(current.timezone).toBe(Intl.DateTimeFormat().resolvedOptions().timeZone)
      expect(current.isManual).toBe(false)
    })
  })

  describe("getDetectionMethod", () => {
    it("debe retornar el método de detección actual", () => {
      const method = service.getDetectionMethod()

      expect(method).toBe("browser")
    })

    it("debe retornar 'manual' después de configurar manualmente", () => {
      service.setManualTimezone("Europe/Paris")

      expect(service.getDetectionMethod()).toBe("manual")
    })

    it("debe retornar 'geolocation' después de configurar por geolocalización", async () => {
      const mockPosition = {
        coords: {
          latitude: 48.8566,
          longitude: 2.3522,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      }

      mockGeolocationService.getCurrentPosition = vi.fn().mockResolvedValue(mockPosition)

      await service.setTimezoneByGeolocation()

      expect(service.getDetectionMethod()).toBe("geolocation")
    })

    it("debe retornar 'browser' después de resetear", () => {
      service.setManualTimezone("Asia/Shanghai")
      service.resetToAutomatic()

      expect(service.getDetectionMethod()).toBe("browser")
    })
  })
})
