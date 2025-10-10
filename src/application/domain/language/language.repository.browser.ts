import type { LanguageRepository } from "./language.repository.interface"

import {
  DEFAULT_LANGUAGE,
  LanguageDetectionMethod,
  LanguageError,
  LanguageInfo,
  SUPPORTED_LANGUAGES,
  SupportedLanguage,
} from "./language.model"

export class LanguageRepositoryBrowser implements LanguageRepository {
  private currentLanguage: LanguageInfo | null = null

  private createError(message: string): LanguageError {
    return new LanguageError(message)
  }

  private extractLanguageCode(fullCode: string): SupportedLanguage {
    const baseLanguage = fullCode.toLowerCase().split("-")[0]

    if (this.isSupported(baseLanguage)) {
      return baseLanguage as SupportedLanguage
    }

    return DEFAULT_LANGUAGE.language
  }

  public getBrowserLanguage(): string {
    return typeof navigator !== "undefined"
      ? navigator.language || DEFAULT_LANGUAGE.fullCode
      : DEFAULT_LANGUAGE.fullCode
  }

  public getLanguage(): LanguageInfo {
    const browserLanguage = this.getBrowserLanguage()
    const language = this.extractLanguageCode(browserLanguage)

    return {
      language,
      fullCode: browserLanguage,
      isManual: false,
      detectionMethod: "browser",
    }
  }

  public setManualLanguage(language: SupportedLanguage): void {
    if (!this.isSupported(language)) {
      throw this.createError(
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

    return this.getLanguage()
  }

  public resetToAutomatic(): void {
    this.currentLanguage = null
  }

  public isManuallySet(): boolean {
    return this.currentLanguage?.isManual ?? false
  }

  public isSupported(language: string): boolean {
    return SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)
  }

  public getDetectionMethod(): LanguageDetectionMethod {
    return this.currentLanguage?.detectionMethod ?? "browser"
  }

  public getDefaultLanguage(): LanguageInfo {
    return { ...DEFAULT_LANGUAGE }
  }

  public getSupportedLanguages(): readonly SupportedLanguage[] {
    return SUPPORTED_LANGUAGES
  }
}

export const createLanguageRepository = (): LanguageRepository => {
  return new LanguageRepositoryBrowser()
}
