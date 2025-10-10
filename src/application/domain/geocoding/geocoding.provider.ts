import type { GeocodingRepository } from "./geocoding.repository.interface"
import { GeocodingService } from "./geocoding.service"

/**
 * Factory/Provider genérico (sin React)
 * Solo instancia y configura el servicio con sus dependencias
 */
export class GeocodingProvider {
  private static instance: GeocodingService | null = null

  public static getInstance(): GeocodingService | null {
    return this.instance
  }

  public static initializeService(repository: GeocodingRepository): GeocodingService {
    this.instance ??= new GeocodingService(repository)
    return this.instance
  }

  public static createNew(repository: GeocodingRepository): GeocodingService {
    return new GeocodingService(repository)
  }

  public static reset(): void {
    this.instance = null
  }

  public static isInitialized(): boolean {
    return this.instance !== null
  }
}

export const createGeocodingService = (repository: GeocodingRepository): GeocodingService => {
  return GeocodingProvider.createNew(repository)
}
