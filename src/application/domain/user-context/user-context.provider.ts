import type {
  CitySearchRepository,
  GeocodingRepository,
  GeolocationRepository,
  LanguageRepository,
  TimezoneRepository,
  WeatherRepository,
} from "./user-context.repository.interface"

import { UserContextService } from "./user-context.service"

/**
 * Factory/Provider genérico (sin React)
 * Solo instancia y configura el servicio con sus dependencias
 * Patrón Singleton para mantener una única instancia del servicio
 */
export class UserContextProvider {
  private static instance: UserContextService | null = null

  /**
   * Obtiene la instancia única del servicio
   * Si no existe, debe ser inicializado primero con initializeService
   */
  public static getInstance(): UserContextService | null {
    return this.instance
  }

  /**
   * Inicializa el servicio con todas sus dependencias
   * Solo debe llamarse una vez en el ciclo de vida de la aplicación
   */
  public static initializeService(
    geolocationRepository: GeolocationRepository,
    geocodingRepository: GeocodingRepository,
    citySearchRepository: CitySearchRepository,
    timezoneRepository: TimezoneRepository,
    languageRepository: LanguageRepository,
    weatherRepository?: WeatherRepository
  ): UserContextService {
    this.instance ??= new UserContextService(
      geolocationRepository,
      geocodingRepository,
      citySearchRepository,
      timezoneRepository,
      languageRepository,
      weatherRepository
    )
    return this.instance
  }

  /**
   * Crea una nueva instancia del servicio sin mantener el singleton
   * Útil para testing o casos donde se necesitan múltiples instancias
   */
  public static createNew(
    geolocationRepository: GeolocationRepository,
    geocodingRepository: GeocodingRepository,
    citySearchRepository: CitySearchRepository,
    timezoneRepository: TimezoneRepository,
    languageRepository: LanguageRepository,
    weatherRepository?: WeatherRepository
  ): UserContextService {
    return new UserContextService(
      geolocationRepository,
      geocodingRepository,
      citySearchRepository,
      timezoneRepository,
      languageRepository,
      weatherRepository
    )
  }

  /**
   * Resetea la instancia singleton
   * Útil para testing o para reiniciar el servicio
   */
  public static reset(): void {
    if (this.instance) {
      this.instance.reset()
      this.instance = null
    }
  }

  /**
   * Verifica si el servicio está inicializado
   */
  public static isInitialized(): boolean {
    return this.instance !== null
  }
}

/**
 * Función factory simple para crear instancias del servicio
 * Alternativa al patrón Singleton cuando no se necesita mantener estado global
 * Delega la creación al método createNew del UserContextProvider
 */
export const createUserContextService = (
  geolocationRepository: GeolocationRepository,
  geocodingRepository: GeocodingRepository,
  citySearchRepository: CitySearchRepository,
  timezoneRepository: TimezoneRepository,
  languageRepository: LanguageRepository,
  weatherRepository?: WeatherRepository
): UserContextService => {
  return UserContextProvider.createNew(
    geolocationRepository,
    geocodingRepository,
    citySearchRepository,
    timezoneRepository,
    languageRepository,
    weatherRepository
  )
}
