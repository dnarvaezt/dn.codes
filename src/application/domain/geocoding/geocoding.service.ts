import type { CityInfo, GeocodingOptions } from "./geocoding.model"

interface GeocodingRepository {
  getCityByCoordinates(
    latitude: number,
    longitude: number,
    options?: GeocodingOptions
  ): Promise<CityInfo>
}

export class GeocodingService {
  constructor(private readonly repository: GeocodingRepository) {}

  public async getCityByCoordinates(
    latitude: number,
    longitude: number,
    options?: GeocodingOptions
  ): Promise<CityInfo> {
    return this.repository.getCityByCoordinates(latitude, longitude, options)
  }
}
