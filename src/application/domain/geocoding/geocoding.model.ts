// ============================================
// Geocoding Domain - Models & Types
// ============================================

export interface GeocodingCoordinates {
  latitude: number
  longitude: number
}

export interface CityInfo {
  city: string
  locality: string
  principalSubdivision: string
  principalSubdivisionCode: string
  countryName: string
  countryCode: string
  continent: string
  continentCode: string
  latitude: number
  longitude: number
  localityLanguageRequested: string
}

export interface GeocodingResponse {
  city: string
  locality: string
  principalSubdivision: string
  principalSubdivisionCode: string
  countryName: string
  countryCode: string
  continent: string
  continentCode: string
  latitude: number
  longitude: number
  localityLanguageRequested: string
}

export interface GeocodingOptions {
  language?: string
  timeout?: number
}

export class GeocodingError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message)
    this.name = "GeocodingError"
  }
}

export const DEFAULT_CITY_INFO: CityInfo = {
  city: "Unknown",
  locality: "Unknown",
  principalSubdivision: "Unknown",
  principalSubdivisionCode: "",
  countryName: "Unknown",
  countryCode: "",
  continent: "Unknown",
  continentCode: "",
  latitude: 0,
  longitude: 0,
  localityLanguageRequested: "en",
}

export const BIGDATACLOUD_API_URL = "https://api.bigdatacloud.net/data/reverse-geocode-client"

export const DEFAULT_GEOCODING_OPTIONS: Required<GeocodingOptions> = {
  language: "en",
  timeout: 10000,
}
