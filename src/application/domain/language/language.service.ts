import type { LanguageInfo, SupportedLanguage } from "./language.model"

interface LanguageRepository {
  getCurrentLanguage(): LanguageInfo
  setManualLanguage(language: SupportedLanguage): void
  resetToAutomatic(): void
}

export class LanguageService {
  constructor(private readonly repository: LanguageRepository) {}

  public getCurrentLanguage(): LanguageInfo {
    return this.repository.getCurrentLanguage()
  }

  public setManualLanguage(language: SupportedLanguage): void {
    this.repository.setManualLanguage(language)
  }

  public resetToAutomatic(): void {
    this.repository.resetToAutomatic()
  }
}
