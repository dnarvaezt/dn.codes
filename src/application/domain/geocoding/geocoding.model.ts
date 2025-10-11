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

export interface GeocodingOptions {
  language?: string
  timeout?: number
}
