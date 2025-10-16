import { axiosErrorHandler } from "@/application/utils"
import axios from "axios"

import type { CitySearchOptions, CitySearchResult } from "./city-search.model"
export interface SearchCitiesProps {
  text: string
  options?: CitySearchOptions
}

export abstract class CitySearchRepository<TModel = CitySearchResult[]> {
  abstract searchCities(args: SearchCitiesProps): Promise<TModel>
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

export class CitySearchRepositoryGeoapify implements CitySearchRepository<CitySearchResult[]> {
  private get url(): string {
    return "https://api.geoapify.com/v1/geocode/autocomplete"
  }

  async searchCities(args: SearchCitiesProps): Promise<CitySearchResult[]> {
    const { text, options } = args

    const apiKey: string = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || ""
    const limit = options?.limit ?? 10
    const language = options?.language ?? "en"
    const timeout = options?.timeout ?? 10000

    const params: Record<string, string> = {
      apiKey,
      text,
      type: "city",
      limit: String(limit),
      lang: language,
    }

    if (options?.countryFilter && options.countryFilter.length > 0) {
      params.filter = `countrycode:${options.countryFilter.join(",")}`
    }

    try {
      const { data } = await axios.get<GeoapifyAutocompleteResponse>(this.url, {
        params,
        timeout,
      })

      if (!data.features || !Array.isArray(data.features)) {
        return []
      }

      return data.features.map((feature) => this.mapFeatureToResult(feature))
    } catch (error) {
      throw axiosErrorHandler(error)
    }
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
}
