import type { CityInfo, GeocodingOptions } from "./geocoding.model"

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
