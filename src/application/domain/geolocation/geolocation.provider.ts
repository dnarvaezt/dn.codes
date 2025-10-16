import type { GeolocationPosition } from "./geolocation.model"
import { GeolocationRepository, GeolocationRepositoryBrowser } from "./geolocation.repository"

export const geolocationRepository: GeolocationRepository<GeolocationPosition> =
  new GeolocationRepositoryBrowser()
