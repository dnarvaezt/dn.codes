import type { CitySearchRepository } from "./city-search.repository.interface"
import { CitySearchService } from "./city-search.service"

/**
 * Factory/Provider genérico (sin React)
 * Solo instancia y configura el servicio con sus dependencias
 */
export class CitySearchProvider {
  private static instance: CitySearchService | null = null

  public static getInstance(): CitySearchService | null {
    return this.instance
  }

  public static initializeService(repository: CitySearchRepository): CitySearchService {
    this.instance ??= new CitySearchService(repository)
    return this.instance
  }

  public static createNew(repository: CitySearchRepository): CitySearchService {
    return new CitySearchService(repository)
  }

  public static reset(): void {
    this.instance = null
  }

  public static isInitialized(): boolean {
    return this.instance !== null
  }
}

export const createCitySearchService = (repository: CitySearchRepository): CitySearchService => {
  return CitySearchProvider.createNew(repository)
}
