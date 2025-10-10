// ============================================
// Types - Geolocation
// ============================================

export interface GeolocationCoordinates {
  latitude: number
  longitude: number
  accuracy: number
  altitude: number | null
  altitudeAccuracy: number | null
  heading: number | null
  speed: number | null
}

export interface GeolocationPosition {
  coords: GeolocationCoordinates
  timestamp: number
}

export interface GeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

export enum GeolocationErrorCode {
  PERMISSION_DENIED = 1,
  POSITION_UNAVAILABLE = 2,
  TIMEOUT = 3,
  NOT_SUPPORTED = 4,
}

export class GeolocationError extends Error {
  constructor(
    public code: GeolocationErrorCode,
    message: string
  ) {
    super(message)
    this.name = "GeolocationError"
  }
}

export interface DefaultLocation {
  latitude: number
  longitude: number
  accuracy: number
}

export const DEFAULT_LOCATION: DefaultLocation = {
  latitude: 0,
  longitude: 0,
  accuracy: 0,
}

export enum GeolocationMode {
  AUTO = "auto",
  MANUAL = "manual",
}

export interface ManualLocation {
  latitude: number
  longitude: number
  accuracy?: number
}

// ============================================
// Types - Language
// ============================================

export type SupportedLanguage = "es" | "en"

export type LanguageDetectionMethod = "browser" | "manual"

export interface LanguageInfo {
  language: SupportedLanguage
  fullCode: string
  isManual: boolean
  detectionMethod: LanguageDetectionMethod
}

export class LanguageError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "LanguageError"
  }
}

export const DEFAULT_LANGUAGE: LanguageInfo = {
  language: "en",
  fullCode: "en-US",
  isManual: false,
  detectionMethod: "browser",
}

export const SUPPORTED_LANGUAGES: readonly SupportedLanguage[] = ["es", "en"] as const

// ============================================
// Types - Timezone
// ============================================

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

// ============================================
// Types - Geocoding
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

// ============================================
// Types - City Search
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

// ============================================
// Types - Weather
// ============================================

export interface WeatherCoordinates {
  latitude: number
  longitude: number
}

export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface WeatherMain {
  temp: number
  feelsLike: number
  tempMin: number
  tempMax: number
  pressure: number
  humidity: number
  seaLevel?: number
  groundLevel?: number
}

export interface WeatherWind {
  speed: number
  deg: number
  gust?: number
}

export interface WeatherClouds {
  all: number
}

export interface WeatherRain {
  oneHour?: number
  threeHours?: number
}

export interface WeatherSnow {
  oneHour?: number
  threeHours?: number
}

export interface WeatherSys {
  type?: number
  id?: number
  country: string
  sunrise: number
  sunset: number
}

export interface WeatherInfo {
  coordinates: WeatherCoordinates
  weather: WeatherCondition[]
  main: WeatherMain
  visibility: number
  wind: WeatherWind
  clouds: WeatherClouds
  rain?: WeatherRain
  snow?: WeatherSnow
  dt: number
  sys: WeatherSys
  timezone: number
  cityId: number
  cityName: string
}

export interface WeatherOptions {
  units?: "metric" | "imperial" | "standard"
  language?: string
  timeout?: number
}

export interface OpenWeatherMapResponse {
  coord: {
    lon: number
    lat: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level?: number
    grnd_level?: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  clouds: {
    all: number
  }
  rain?: {
    "1h"?: number
    "3h"?: number
  }
  snow?: {
    "1h"?: number
    "3h"?: number
  }
  dt: number
  sys: {
    type?: number
    id?: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

export class WeatherError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message)
    this.name = "WeatherError"
  }
}

export const OPENWEATHERMAP_API_URL = "https://api.openweathermap.org/data/2.5/weather"

export const DEFAULT_WEATHER_OPTIONS: Required<WeatherOptions> = {
  units: "metric",
  language: "en",
  timeout: 10000,
}

export const DEFAULT_WEATHER_INFO: WeatherInfo = {
  coordinates: {
    latitude: 0,
    longitude: 0,
  },
  weather: [
    {
      id: 0,
      main: "Unknown",
      description: "Unknown",
      icon: "01d",
    },
  ],
  main: {
    temp: 0,
    feelsLike: 0,
    tempMin: 0,
    tempMax: 0,
    pressure: 0,
    humidity: 0,
  },
  visibility: 0,
  wind: {
    speed: 0,
    deg: 0,
  },
  clouds: {
    all: 0,
  },
  dt: 0,
  sys: {
    country: "",
    sunrise: 0,
    sunset: 0,
  },
  timezone: 0,
  cityId: 0,
  cityName: "Unknown",
}

// ============================================
// Types - User Context (Aggregate Root)
// ============================================

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
