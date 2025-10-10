import type { LanguageInfo, SupportedLanguage } from "./language.model"

export interface LanguageRepository {
  getCurrentLanguage(): LanguageInfo
  setManualLanguage(language: SupportedLanguage): void
  resetToAutomatic(): void
  isSupported(language: string): boolean
  getSupportedLanguages(): readonly SupportedLanguage[]
}
