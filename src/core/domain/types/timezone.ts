export type TimezoneDetectionMethod = "browser" | "geolocation" | "manual"

export interface TimezoneInfo {
  timezone: string
  offset: number
  offsetString: string
  locale: string
  isManual: boolean
  detectionMethod: TimezoneDetectionMethod
  isDST?: boolean
  coordinates?: {
    latitude: number
    longitude: number
  }
}

export interface TimezoneOptions {
  locale?: string
  includeOffset?: boolean
}

export interface TimezoneDetectionOptions {
  useGeolocation?: boolean
  fallbackToManual?: boolean
  timeout?: number
}

export class TimezoneError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "TimezoneError"
  }
}

export const DEFAULT_TIMEZONE: TimezoneInfo = {
  timezone: "UTC",
  offset: 0,
  offsetString: "+00:00",
  locale: "en-US",
  isManual: false,
  detectionMethod: "browser",
  isDST: false,
}
