import { CitySearchOptions, CitySearchResult } from "./city-search.model"

interface CitySearchRepository {
  searchCities(text: string, options?: CitySearchOptions): Promise<CitySearchResult[]>
}

interface GeoapifyAutocompleteResponse {
  type: string
  features: GeoapifyFeature[]
  query: {
    text: string
    parsed: {
      city?: string
      expected_type?: string
    }
  }
}

interface GeoapifyFeature {
  type: string
  properties: {
    place_id: string
    name?: string
    city?: string
    country?: string
    country_code?: string
    state?: string
    formatted: string
    lat: number
    lon: number
    result_type: string
    rank: {
      importance: number
    }
  }
  geometry: {
    type: string
    coordinates: [number, number]
  }
}

class CitySearchError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message)
    this.name = "CitySearchError"
  }
}

const GEOAPIFY_AUTOCOMPLETE_URL = "https://api.geoapify.com/v1/geocode/autocomplete"
const DEFAULT_CITY_SEARCH_OPTIONS: Required<Omit<CitySearchOptions, "countryFilter">> = {
  limit: 10,
  language: "en",
  timeout: 10000,
}

export class CitySearchRepositoryGeoapify implements CitySearchRepository {
  private readonly apiKey: string

  constructor(apiKey: string) {
    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error("API key de Geoapify es requerida")
    }
    this.apiKey = apiKey
  }

  private buildSearchUrl(text: string, options?: CitySearchOptions): string {
    const limit = options?.limit ?? DEFAULT_CITY_SEARCH_OPTIONS.limit
    const language = options?.language ?? DEFAULT_CITY_SEARCH_OPTIONS.language

    const params = new URLSearchParams({
      text,
      apiKey: this.apiKey,
      type: "city",
      limit: String(limit),
      lang: language,
    })

    if (options?.countryFilter && options.countryFilter.length > 0) {
      params.append("filter", `countrycode:${options.countryFilter.join(",")}`)
    }

    return `${GEOAPIFY_AUTOCOMPLETE_URL}?${params.toString()}`
  }

  private mapFeatureToResult(feature: GeoapifyFeature): CitySearchResult {
    return {
      city: feature.properties.city || feature.properties.name || "Unknown",
      country: feature.properties.country || "Unknown",
      countryCode: feature.properties.country_code || "",
      state: feature.properties.state,
      coordinates: {
        latitude: feature.properties.lat,
        longitude: feature.properties.lon,
      },
      formatted: feature.properties.formatted,
      placeId: feature.properties.place_id,
    }
  }

  public async searchCities(
    text: string,
    options?: CitySearchOptions
  ): Promise<CitySearchResult[]> {
    const timeout = options?.timeout ?? DEFAULT_CITY_SEARCH_OPTIONS.timeout

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const url = this.buildSearchUrl(text, options)

      const response = await fetch(url, {
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new CitySearchError(
          `Error al buscar ciudades: ${response.statusText}`,
          response.status
        )
      }

      const data: GeoapifyAutocompleteResponse = await response.json()

      if (!data.features || !Array.isArray(data.features)) {
        return []
      }

      return data.features.map((feature) => this.mapFeatureToResult(feature))
    } catch (error) {
      if (error instanceof CitySearchError) throw error

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new CitySearchError("Timeout al buscar ciudades")
        }
        throw new CitySearchError(`Error al buscar ciudades: ${error.message}`)
      }

      throw new CitySearchError("Error desconocido al buscar ciudades")
    } finally {
      clearTimeout(timeoutId)
    }
  }
}

export const createCitySearchRepository = (apiKey: string): CitySearchRepository => {
  return new CitySearchRepositoryGeoapify(apiKey)
}
