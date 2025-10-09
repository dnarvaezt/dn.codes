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
