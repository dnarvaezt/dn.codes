// ============================================
// Language Domain - Models & Types
// ============================================

export type SupportedLanguage = "es" | "en"

export type LanguageDetectionMethod = "browser" | "manual"

export interface LanguageInfo {
  language: SupportedLanguage
  fullCode: string
  isManual: boolean
  detectionMethod: LanguageDetectionMethod
}

export class LanguageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "LanguageError"
  }
}

export const DEFAULT_LANGUAGE: LanguageInfo = {
  language: "en",
  fullCode: "en-US",
  isManual: false,
  detectionMethod: "browser",
}

export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = ["es", "en"] as const
