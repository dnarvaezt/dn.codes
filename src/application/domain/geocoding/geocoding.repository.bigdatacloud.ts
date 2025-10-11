import { CityInfo, GeocodingOptions } from "./geocoding.model"

interface GeocodingRepository {
  getCityByCoordinates(
    latitude: number,
    longitude: number,
    options?: GeocodingOptions
  ): Promise<CityInfo>
}

class GeocodingError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message)
    this.name = "GeocodingError"
  }
}

const BIGDATACLOUD_API_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client"
const DEFAULT_GEOCODING_OPTIONS: Required<GeocodingOptions> = {
  language: "en",
  timeout: 10000,
}

export class GeocodingRepositoryBigDataCloud implements GeocodingRepository {
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
      const url = `${BIGDATACLOUD_API_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=${language}`

      const response = await fetch(url, { signal: controller.signal })

      if (!response.ok) {
        throw new GeocodingError(
          `Error al obtener información de geocoding: ${response.statusText}`,
          response.status
        )
      }

      const data: CityInfo = await response.json()

      return {
        city: data.city || "Unknown",
        locality: data.locality || "Unknown",
        principalSubdivision: data.principalSubdivision || "Unknown",
        principalSubdivisionCode: data.principalSubdivisionCode || "",
        countryName: data.countryName || "Unknown",
        countryCode: data.countryCode || "",
        continent: data.continent || "Unknown",
        continentCode: data.continentCode || "",
        latitude: data.latitude,
        longitude: data.longitude,
        localityLanguageRequested: data.localityLanguageRequested || language,
      }
    } catch (error) {
      if (error instanceof GeocodingError) throw error

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new GeocodingError("Timeout al obtener información de geocoding")
        }
        throw new GeocodingError(`Error al obtener información de geocoding: ${error.message}`)
      }

      throw new GeocodingError("Error desconocido al obtener información de geocoding")
    } finally {
      clearTimeout(timeoutId)
    }
  }
}

export const createGeocodingRepository = (): GeocodingRepository => {
  return new GeocodingRepositoryBigDataCloud()
}
