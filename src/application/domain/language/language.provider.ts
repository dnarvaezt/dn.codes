import type { LanguageRepository } from "./language.repository.interface"
import { LanguageService } from "./language.service"

/**
 * Factory/Provider genérico (sin React)
 * Solo instancia y configura el servicio con sus dependencias
 */
export class LanguageProvider {
  private static instance: LanguageService | null = null

  public static getInstance(): LanguageService | null {
    return this.instance
  }

  public static initializeService(repository: LanguageRepository): LanguageService {
    this.instance ??= new LanguageService(repository)
    return this.instance
  }

  public static createNew(repository: LanguageRepository): LanguageService {
    return new LanguageService(repository)
  }

  public static reset(): void {
    this.instance = null
  }

  public static isInitialized(): boolean {
    return this.instance !== null
  }
}

export const createLanguageService = (repository: LanguageRepository): LanguageService => {
  return LanguageProvider.createNew(repository)
}
