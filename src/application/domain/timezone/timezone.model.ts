export interface TimezoneInfo {
  timezone: string
  offset: number
  offsetString: string
  locale: string
  isManual: boolean
  detectionMethod: "browser" | "geolocation" | "manual"
  isDST?: boolean
  coordinates?: {
    latitude: number
    longitude: number
  }
}
