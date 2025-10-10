import type { GeolocationRepository } from "./geolocation.repository.interface"
import { GeolocationService } from "./geolocation.service"

/**
 * Factory/Provider genérico (sin React)
 * Solo instancia y configura el servicio con sus dependencias
 */
export class GeolocationProvider {
  private static instance: GeolocationService | null = null

  public static getInstance(): GeolocationService | null {
    return this.instance
  }

  public static initializeService(repository: GeolocationRepository): GeolocationService {
    this.instance ??= new GeolocationService(repository)
    return this.instance
  }

  public static createNew(repository: GeolocationRepository): GeolocationService {
    return new GeolocationService(repository)
  }

  public static reset(): void {
    this.instance = null
  }

  public static isInitialized(): boolean {
    return this.instance !== null
  }
}

export const createGeolocationService = (repository: GeolocationRepository): GeolocationService => {
  return GeolocationProvider.createNew(repository)
}
