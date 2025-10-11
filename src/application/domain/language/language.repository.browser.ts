import { LanguageInfo, SupportedLanguage } from "./language.model"

interface LanguageRepository {
  getCurrentLanguage(): LanguageInfo
  setManualLanguage(language: SupportedLanguage): void
  resetToAutomatic(): void
}

class LanguageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "LanguageError"
  }
}

const DEFAULT_LANGUAGE: LanguageInfo = {
  language: "en",
  fullCode: "en-US",
  isManual: false,
  detectionMethod: "browser",
}

const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = ["es", "en"] as const

export class LanguageRepositoryBrowser implements LanguageRepository {
  private currentLanguage: LanguageInfo | null = null

  public setManualLanguage(language: SupportedLanguage): void {
    if (!SUPPORTED_LANGUAGES.includes(language)) {
      throw new LanguageError(
        `El idioma '${language}' no está soportado. Solo se soportan: ${SUPPORTED_LANGUAGES.join(", ")}`
      )
    }

    this.currentLanguage = {
      language,
      fullCode: language === "es" ? "es-ES" : "en-US",
      isManual: true,
      detectionMethod: "manual",
    }
  }

  public getCurrentLanguage(): LanguageInfo {
    if (this.currentLanguage) {
      return { ...this.currentLanguage }
    }

    const browserLanguage =
      typeof navigator !== "undefined"
        ? navigator.language || DEFAULT_LANGUAGE.fullCode
        : DEFAULT_LANGUAGE.fullCode
    const baseLanguage = browserLanguage.toLowerCase().split("-")[0]
    const language = SUPPORTED_LANGUAGES.includes(baseLanguage as SupportedLanguage)
      ? (baseLanguage as SupportedLanguage)
      : DEFAULT_LANGUAGE.language

    return {
      language,
      fullCode: browserLanguage,
      isManual: false,
      detectionMethod: "browser",
    }
  }

  public resetToAutomatic(): void {
    this.currentLanguage = null
  }
}

export const createLanguageRepository = (): LanguageRepository => {
  return new LanguageRepositoryBrowser()
}
