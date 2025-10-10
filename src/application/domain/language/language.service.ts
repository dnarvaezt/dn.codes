import type { LanguageInfo, SupportedLanguage } from "./language.model"
import type { LanguageRepository } from "./language.repository.interface"

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

  public isSupported(language: string): boolean {
    return this.repository.isSupported(language)
  }

  public getSupportedLanguages(): readonly SupportedLanguage[] {
    return this.repository.getSupportedLanguages()
  }
}
