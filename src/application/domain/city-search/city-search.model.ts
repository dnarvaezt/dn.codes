// ============================================
// City Search Domain - Models & Types
// ============================================

export interface CitySearchCoordinates {
  latitude: number
  longitude: number
}

export interface CitySearchResult {
  city: string
  country: string
  countryCode: string
  state?: string
  coordinates: CitySearchCoordinates
  formatted: string
  placeId: string
}

export interface CitySearchOptions {
  limit?: number
  language?: string
  countryFilter?: string[]
  timeout?: number
}

export interface GeoapifyAutocompleteResponse {
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

export interface GeoapifyFeature {
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

export class CitySearchError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message)
    this.name = "CitySearchError"
  }
}

export const GEOAPIFY_AUTOCOMPLETE_URL = "https://api.geoapify.com/v1/geocode/autocomplete"

export const DEFAULT_CITY_SEARCH_OPTIONS: Required<Omit<CitySearchOptions, "countryFilter">> = {
  limit: 10,
  language: "en",
  timeout: 10000,
}
