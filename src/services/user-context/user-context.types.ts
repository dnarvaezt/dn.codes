import type { CitySearchResult } from "../city-search"
import type { GeolocationPosition } from "../geolocation"
import type { LanguageInfo } from "../language"
import type { TimezoneInfo } from "../timezone"
import type { WeatherInfo } from "../weather"

export type UserContextDetectionMethod = "auto" | "manual"

export interface UserLocation {
  position: GeolocationPosition
  detectionMethod: UserContextDetectionMethod
}

export interface UserContextState {
  location: UserLocation | null
  city: CitySearchResult | null
  timezone: TimezoneInfo | null
  weather: WeatherInfo | null
  language: LanguageInfo
  isInitialized: boolean
}

export interface UserContextInitOptions {
  enableGeolocation?: boolean
  timeout?: number
  defaultLanguage?: "es" | "en"
}

export interface UserContextChangeEvent {
  type: "location" | "city" | "timezone" | "weather" | "language" | "initialized"
  data: Partial<UserContextState>
  timestamp: number
}

export type UserContextListener = (event: UserContextChangeEvent) => void

export class UserContextError extends Error {
  constructor(
    message: string,
    public readonly code: UserContextErrorCode
  ) {
    super(message)
    this.name = "UserContextError"
  }
}

export enum UserContextErrorCode {
  GEOLOCATION_FAILED = "GEOLOCATION_FAILED",
  GEOCODING_FAILED = "GEOCODING_FAILED",
  CITY_SEARCH_FAILED = "CITY_SEARCH_FAILED",
  TIMEZONE_FAILED = "TIMEZONE_FAILED",
  WEATHER_FAILED = "WEATHER_FAILED",
  LANGUAGE_FAILED = "LANGUAGE_FAILED",
  NOT_INITIALIZED = "NOT_INITIALIZED",
  INVALID_CITY = "INVALID_CITY",
  INVALID_LANGUAGE = "INVALID_LANGUAGE",
}

export const DEFAULT_USER_CONTEXT_OPTIONS: Required<UserContextInitOptions> = {
  enableGeolocation: true,
  timeout: 10000,
  defaultLanguage: "en",
}
