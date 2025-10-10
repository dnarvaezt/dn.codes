import type {
  DefaultLocation,
  GeolocationMode,
  GeolocationOptions,
  GeolocationPosition,
  ManualLocation,
} from "./geolocation.model"
import type { GeolocationRepository } from "./geolocation.repository.interface"

export class GeolocationService {
  constructor(private readonly repository: GeolocationRepository) {}

  public async getPosition(options?: GeolocationOptions): Promise<GeolocationPosition> {
    return this.repository.getPosition(options)
  }

  public async getCurrentPosition(options?: GeolocationOptions): Promise<GeolocationPosition> {
    return this.repository.getCurrentPosition(options)
  }

  public watchPosition(
    onSuccess: (position: GeolocationPosition) => void,
    onError: (error: Error) => void,
    options?: GeolocationOptions
  ): number | null {
    return this.repository.watchPosition(onSuccess, onError, options)
  }

  public clearWatch(watchId: number): void {
    this.repository.clearWatch(watchId)
  }

  public setDefaultLocation(location: DefaultLocation): void {
    if ("setDefaultLocation" in this.repository) {
      ;(this.repository as GeolocationRepositoryBrowser).setDefaultLocation(location)
    }
  }

  public setMode(mode: GeolocationMode): void {
    if ("setMode" in this.repository) {
      ;(this.repository as GeolocationRepositoryBrowser).setMode(mode)
    }
  }

  public setManualLocation(location: ManualLocation): void {
    if ("setManualLocation" in this.repository) {
      ;(this.repository as GeolocationRepositoryBrowser).setManualLocation(location)
    }
  }
}

import type { GeolocationRepositoryBrowser } from "./geolocation.repository.browser"
