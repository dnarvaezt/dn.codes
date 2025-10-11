export interface CitySearchResult {
  city: string
  country: string
  countryCode: string
  state?: string
  coordinates: {
    latitude: number
    longitude: number
  }
  formatted: string
  placeId: string
}

export interface CitySearchOptions {
  limit?: number
  language?: string
  countryFilter?: string[]
  timeout?: number
}
