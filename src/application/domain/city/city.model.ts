export interface City {
  name: string
  country: string
  countryCode: string
  state?: string
  formatted: string
  placeId: string
  coordinates: {
    latitude: number
    longitude: number
  }
}
