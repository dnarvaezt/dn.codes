import type {
  CityInfo,
  CitySearchOptions,
  CitySearchResult,
  GeocodingOptions,
  GeolocationOptions,
  GeolocationPosition,
  LanguageInfo,
  SupportedLanguage,
  TimezoneInfo,
  WeatherInfo,
  WeatherOptions,
} from "./user-context.model"

// ============================================
// Repository Interfaces
// ============================================

export interface GeolocationRepository {
  getPosition(options?: GeolocationOptions): Promise<GeolocationPosition>
  getCurrentPosition(options?: GeolocationOptions): Promise<GeolocationPosition>
  watchPosition(
    onSuccess: (position: GeolocationPosition) => void,
    onError: (error: Error) => void,
    options?: GeolocationOptions
  ): number | null
  clearWatch(watchId: number): void
}

export interface GeocodingRepository {
  getCityByCoordinates(
    latitude: number,
    longitude: number,
    options?: GeocodingOptions
  ): Promise<CityInfo>
  getCityByCoordinatesOrDefault(
    latitude: number,
    longitude: number,
    options?: GeocodingOptions
  ): Promise<CityInfo>
}

export interface CitySearchRepository {
  searchCities(text: string, options?: CitySearchOptions): Promise<CitySearchResult[]>
  searchCitiesOrEmpty(text: string, options?: CitySearchOptions): Promise<CitySearchResult[]>
  getCityById(
    placeId: string,
    searchText: string,
    options?: CitySearchOptions
  ): Promise<CitySearchResult | null>
}

export interface TimezoneRepository {
  getTimezone(): TimezoneInfo
  getTimezoneByCoordinates(latitude: number, longitude: number): Promise<TimezoneInfo>
  setManualTimezone(timezone: string): void
  getCurrentTimezone(): TimezoneInfo
  resetToAutomatic(): void
}

export interface LanguageRepository {
  getCurrentLanguage(): LanguageInfo
  setManualLanguage(language: SupportedLanguage): void
  resetToAutomatic(): void
  isSupported(language: string): boolean
  getSupportedLanguages(): readonly SupportedLanguage[]
}

export interface WeatherRepository {
  getWeatherByCoordinates(
    latitude: number,
    longitude: number,
    options?: WeatherOptions
  ): Promise<WeatherInfo>
  getWeatherByCity(cityName: string, options?: WeatherOptions): Promise<WeatherInfo>
  getWeatherByCoordinatesOrDefault(
    latitude: number,
    longitude: number,
    options?: WeatherOptions
  ): Promise<WeatherInfo>
}
