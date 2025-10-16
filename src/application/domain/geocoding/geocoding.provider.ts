import type { CityInfo } from "./geocoding.model"
import { GeocodingRepository, GeocodingRepositoryBigDataCloud } from "./geocoding.repository"

export const geocodingRepository: GeocodingRepository<CityInfo> =
  new GeocodingRepositoryBigDataCloud()
