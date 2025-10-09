import {
  BIGDATACLOUD_API_URL,
  CityInfo,
  DEFAULT_CITY_INFO,
  GeocodingError,
  GeocodingOptions,
  GeocodingResponse,
} from "./geocoding.types"

import type { GeolocationOptions, GeolocationService } from "../geolocation"
import type { LanguageService } from "../language"

export class GeocodingService {
  private readonly geolocationService?: GeolocationService
  private readonly languageService?: LanguageService

  constructor(geolocationService?: GeolocationService, languageService?: LanguageService) {
    this.geolocationService = geolocationService
    this.languageService = languageService
  }

  private createError(message: string, statusCode?: number): GeocodingError {
    return new GeocodingError(message, statusCode)
  }

  private buildApiUrl(latitude: number, longitude: number, language: string): string {
    return `${BIGDATACLOUD_API_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=${language}`
  }

  private mapResponseToCityInfo(response: GeocodingResponse): CityInfo {
    const defaultLanguage = this.languageService?.getCurrentLanguage().language ?? "en"

    return {
      city: response.city || "Unknown",
      locality: response.locality || "Unknown",
      principalSubdivision: response.principalSubdivision || "Unknown",
      principalSubdivisionCode: response.principalSubdivisionCode || "",
      countryName: response.countryName || "Unknown",
      countryCode: response.countryCode || "",
      continent: response.continent || "Unknown",
      continentCode: response.continentCode || "",
      latitude: response.latitude,
      longitude: response.longitude,
      localityLanguageRequested: response.localityLanguageRequested || defaultLanguage,
    }
  }

  public async getCityByCoordinates(
    latitude: number,
    longitude: number,
    options?: GeocodingOptions
  ): Promise<CityInfo> {
    const language =
      options?.language || this.languageService?.getCurrentLanguage().language || "en"
    const timeout = options?.timeout || 10000

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const url = this.buildApiUrl(latitude, longitude, language)

      const response = await fetch(url, {
        signal: controller.signal,
      })

      if (!response.ok) {
        throw this.createError(
          `Error al obtener información de geocoding: ${response.statusText}`,
          response.status
        )
      }

      const data: GeocodingResponse = await response.json()

      return this.mapResponseToCityInfo(data)
    } catch (error) {
      if (error instanceof GeocodingError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw this.createError("Timeout al obtener información de geocoding")
        }
        throw this.createError(`Error al obtener información de geocoding: ${error.message}`)
      }

      throw this.createError("Error desconocido al obtener información de geocoding")
    } finally {
      clearTimeout(timeoutId)
    }
  }

  public async getCityByCoordinatesOrDefault(
    latitude: number,
    longitude: number,
    options?: GeocodingOptions
  ): Promise<CityInfo> {
    try {
      return await this.getCityByCoordinates(latitude, longitude, options)
    } catch {
      return {
        ...DEFAULT_CITY_INFO,
        latitude,
        longitude,
      }
    }
  }

  public async getCityFromGeolocation(options?: {
    geolocationOptions?: GeolocationOptions
    geocodingOptions?: GeocodingOptions
  }): Promise<CityInfo> {
    if (!this.geolocationService) {
      throw this.createError("Servicio de geolocalización no disponible")
    }

    const position = await this.geolocationService.getPosition(options?.geolocationOptions)

    return this.getCityByCoordinates(
      position.coords.latitude,
      position.coords.longitude,
      options?.geocodingOptions
    )
  }

  public async getCityFromGeolocationOrDefault(options?: {
    geolocationOptions?: GeolocationOptions
    geocodingOptions?: GeocodingOptions
  }): Promise<CityInfo> {
    try {
      return await this.getCityFromGeolocation(options)
    } catch {
      return { ...DEFAULT_CITY_INFO }
    }
  }

  public getDefaultCityInfo(): CityInfo {
    return { ...DEFAULT_CITY_INFO }
  }
}

export const createGeocodingService = (
  geolocationService?: GeolocationService,
  languageService?: LanguageService
) => {
  return new GeocodingService(geolocationService, languageService)
}
