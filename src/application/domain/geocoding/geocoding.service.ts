import type { CityInfo, GeocodingOptions } from "./geocoding.model"
import type { GeocodingRepository } from "./geocoding.repository.interface"

export class GeocodingService {
  constructor(private readonly repository: GeocodingRepository) {}

  public async getCityByCoordinates(
    latitude: number,
    longitude: number,
    options?: GeocodingOptions
  ): Promise<CityInfo> {
    return this.repository.getCityByCoordinates(latitude, longitude, options)
  }

  public async getCityByCoordinatesOrDefault(
    latitude: number,
    longitude: number,
    options?: GeocodingOptions
  ): Promise<CityInfo> {
    return this.repository.getCityByCoordinatesOrDefault(latitude, longitude, options)
  }
}
