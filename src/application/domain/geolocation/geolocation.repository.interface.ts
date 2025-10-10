import type { GeolocationOptions, GeolocationPosition } from "./geolocation.model"

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
