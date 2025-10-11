import type { GeolocationOptions, GeolocationPosition } from "./geolocation.model"

interface GeolocationRepository {
  getPosition(options?: GeolocationOptions): Promise<GeolocationPosition>
}

export class GeolocationService {
  constructor(private readonly repository: GeolocationRepository) {}

  public async getPosition(options?: GeolocationOptions): Promise<GeolocationPosition> {
    return this.repository.getPosition(options)
  }
}
