import { beforeEach, describe, expect, it, vi } from "vitest"
import { LanguageService } from "./language.service"

describe("LanguageService", () => {
  let service: LanguageService

  beforeEach(() => {
    service = new LanguageService()
    vi.clearAllMocks()
  })

  describe("getLanguage", () => {
    it("debe detectar español cuando el navegador está en español", () => {
      vi.spyOn(navigator, "language", "get").mockReturnValue("es-ES")

      const result = service.getLanguage()

      expect(result.language).toBe("es")
      expect(result.fullCode).toBe("es-ES")
      expect(result.isManual).toBe(false)
      expect(result.detectionMethod).toBe("browser")
    })

    it("debe detectar inglés cuando el navegador está en inglés", () => {
      vi.spyOn(navigator, "language", "get").mockReturnValue("en-US")

      const result = service.getLanguage()

      expect(result.language).toBe("en")
      expect(result.fullCode).toBe("en-US")
      expect(result.isManual).toBe(false)
      expect(result.detectionMethod).toBe("browser")
    })

    it("debe usar idioma por defecto cuando el navegador está en idioma no soportado", () => {
      vi.spyOn(navigator, "language", "get").mockReturnValue("fr-FR")

      const result = service.getLanguage()

      expect(result.language).toBe("en")
      expect(result.isManual).toBe(false)
    })

    it("debe detectar español con código de país diferente", () => {
      vi.spyOn(navigator, "language", "get").mockReturnValue("es-MX")

      const result = service.getLanguage()

      expect(result.language).toBe("es")
      expect(result.fullCode).toBe("es-MX")
    })

    it("debe detectar inglés con código de país diferente", () => {
      vi.spyOn(navigator, "language", "get").mockReturnValue("en-GB")

      const result = service.getLanguage()

      expect(result.language).toBe("en")
      expect(result.fullCode).toBe("en-GB")
    })

    it("debe manejar código de idioma sin país", () => {
      vi.spyOn(navigator, "language", "get").mockReturnValue("es")

      const result = service.getLanguage()

      expect(result.language).toBe("es")
      expect(result.fullCode).toBe("es")
    })
  })

  describe("setManualLanguage", () => {
    it("debe configurar español manualmente", () => {
      service.setManualLanguage("es")

      const result = service.getCurrentLanguage()

      expect(result.language).toBe("es")
      expect(result.isManual).toBe(true)
      expect(result.detectionMethod).toBe("manual")
    })

    it("debe configurar inglés manualmente", () => {
      service.setManualLanguage("en")

      const result = service.getCurrentLanguage()

      expect(result.language).toBe("en")
      expect(result.isManual).toBe(true)
      expect(result.detectionMethod).toBe("manual")
    })

    it("debe lanzar error cuando el idioma no está soportado", () => {
      expect(() => service.setManualLanguage("fr" as any)).toThrow(
        "El idioma 'fr' no está soportado. Solo se soportan: es, en"
      )
    })
  })

  describe("getCurrentLanguage", () => {
    it("debe retornar idioma del navegador por defecto", () => {
      vi.spyOn(navigator, "language", "get").mockReturnValue("es-ES")

      const result = service.getCurrentLanguage()

      expect(result.language).toBe("es")
      expect(result.isManual).toBe(false)
    })

    it("debe retornar idioma manual si fue configurado", () => {
      service.setManualLanguage("es")

      const result = service.getCurrentLanguage()

      expect(result.language).toBe("es")
      expect(result.isManual).toBe(true)
    })
  })

  describe("resetToAutomatic", () => {
    it("debe resetear a detección automática", () => {
      service.setManualLanguage("es")

      expect(service.getCurrentLanguage().isManual).toBe(true)

      service.resetToAutomatic()

      expect(service.getCurrentLanguage().isManual).toBe(false)
    })
  })

  describe("isManuallySet", () => {
    it("debe retornar false por defecto", () => {
      expect(service.isManuallySet()).toBe(false)
    })

    it("debe retornar true después de configurar manualmente", () => {
      service.setManualLanguage("en")

      expect(service.isManuallySet()).toBe(true)
    })

    it("debe retornar false después de resetear", () => {
      service.setManualLanguage("en")
      service.resetToAutomatic()

      expect(service.isManuallySet()).toBe(false)
    })
  })

  describe("isSupported", () => {
    it("debe retornar true para español", () => {
      expect(service.isSupported("es")).toBe(true)
    })

    it("debe retornar true para inglés", () => {
      expect(service.isSupported("en")).toBe(true)
    })

    it("debe retornar false para idiomas no soportados", () => {
      expect(service.isSupported("fr" as any)).toBe(false)
      expect(service.isSupported("de" as any)).toBe(false)
      expect(service.isSupported("" as any)).toBe(false)
    })
  })

  describe("getDetectionMethod", () => {
    it("debe retornar 'browser' por defecto", () => {
      expect(service.getDetectionMethod()).toBe("browser")
    })

    it("debe retornar 'manual' después de configurar manualmente", () => {
      service.setManualLanguage("es")

      expect(service.getDetectionMethod()).toBe("manual")
    })

    it("debe retornar 'browser' después de resetear", () => {
      service.setManualLanguage("en")
      service.resetToAutomatic()

      expect(service.getDetectionMethod()).toBe("browser")
    })
  })

  describe("getDefaultLanguage", () => {
    it("debe retornar idioma por defecto", () => {
      const result = service.getDefaultLanguage()

      expect(result.language).toBe("en")
      expect(result.fullCode).toBe("en-US")
      expect(result.isManual).toBe(false)
      expect(result.detectionMethod).toBe("browser")
    })

    it("debe retornar una copia del idioma por defecto", () => {
      const lang1 = service.getDefaultLanguage()
      const lang2 = service.getDefaultLanguage()

      expect(lang1).not.toBe(lang2)
      expect(lang1).toEqual(lang2)
    })
  })

  describe("getSupportedLanguages", () => {
    it("debe retornar lista de idiomas soportados", () => {
      const supported = service.getSupportedLanguages()

      expect(supported).toEqual(["es", "en"])
    })
  })

  describe("getBrowserLanguage", () => {
    it("debe retornar el idioma del navegador", () => {
      vi.spyOn(navigator, "language", "get").mockReturnValue("es-ES")

      const result = service.getBrowserLanguage()

      expect(result).toBe("es-ES")
    })

    it("debe retornar idioma por defecto si no está disponible", () => {
      vi.spyOn(navigator, "language", "get").mockReturnValue(undefined as any)

      const result = service.getBrowserLanguage()

      expect(result).toBe("en-US")
    })
  })
})
