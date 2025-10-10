import type { WeatherRepository } from "./weather.repository.interface"
import { WeatherService } from "./weather.service"

/**
 * Factory/Provider genérico (sin React)
 * Solo instancia y configura el servicio con sus dependencias
 */
export class WeatherProvider {
  private static instance: WeatherService | null = null

  public static getInstance(): WeatherService | null {
    return this.instance
  }

  public static initializeService(repository: WeatherRepository): WeatherService {
    this.instance ??= new WeatherService(repository)
    return this.instance
  }

  public static createNew(repository: WeatherRepository): WeatherService {
    return new WeatherService(repository)
  }

  public static reset(): void {
    this.instance = null
  }

  public static isInitialized(): boolean {
    return this.instance !== null
  }
}

export const createWeatherService = (repository: WeatherRepository): WeatherService => {
  return WeatherProvider.createNew(repository)
}
