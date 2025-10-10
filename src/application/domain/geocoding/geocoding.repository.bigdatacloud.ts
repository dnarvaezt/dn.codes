import type { GeocodingRepository } from "./geocoding.repository.interface"

import {
  BIGDATACLOUD_API_URL,
  CityInfo,
  DEFAULT_CITY_INFO,
  DEFAULT_GEOCODING_OPTIONS,
  GeocodingError,
  GeocodingOptions,
  GeocodingResponse,
} from "./geocoding.model"

export class GeocodingRepositoryBigDataCloud implements GeocodingRepository {
  private createError(message: string, statusCode?: number): GeocodingError {
    return new GeocodingError(message, statusCode)
  }

  private buildApiUrl(latitude: number, longitude: number, language: string): string {
    return `${BIGDATACLOUD_API_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=${language}`
  }

  private mapResponseToCityInfo(response: GeocodingResponse, defaultLanguage: string): CityInfo {
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
    const language = options?.language ?? DEFAULT_GEOCODING_OPTIONS.language
    const timeout = options?.timeout ?? DEFAULT_GEOCODING_OPTIONS.timeout

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

      return this.mapResponseToCityInfo(data, language)
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
}

export const createGeocodingRepository = (): GeocodingRepository => {
  return new GeocodingRepositoryBigDataCloud()
}
