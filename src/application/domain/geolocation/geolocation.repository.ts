import type { GeolocationOptions, GeolocationPosition } from "./geolocation.model"

export interface GetPositionProps {
  options?: GeolocationOptions
}

export abstract class GeolocationRepository<GeolocationPosition> {
  abstract getPosition(args?: GetPositionProps): Promise<GeolocationPosition>
}

enum GeolocationErrorCode {
  PERMISSION_DENIED = 1,
  POSITION_UNAVAILABLE = 2,
  TIMEOUT = 3,
  NOT_SUPPORTED = 4,
}

class GeolocationError extends Error {
  constructor(
    public code: GeolocationErrorCode,
    message: string
  ) {
    super(message)
    this.name = "GeolocationError"
  }
}

const DEFAULT_GEOLOCATION_OPTIONS: Required<GeolocationOptions> = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0,
}

export class GeolocationRepositoryBrowser implements GeolocationRepository<GeolocationPosition> {
  async getPosition(args?: GetPositionProps): Promise<GeolocationPosition> {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      throw new GeolocationError(
        GeolocationErrorCode.NOT_SUPPORTED,
        "La geolocalización no está soportada en este navegador"
      )
    }

    const opts: Required<GeolocationOptions> = args?.options
      ? { ...DEFAULT_GEOLOCATION_OPTIONS, ...args.options }
      : DEFAULT_GEOLOCATION_OPTIONS

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              altitude: position.coords.altitude,
              altitudeAccuracy: position.coords.altitudeAccuracy,
              heading: position.coords.heading,
              speed: position.coords.speed,
            },
            timestamp: position.timestamp,
          } as GeolocationPosition)
        },
        (error) => {
          const errorMessages: Record<number, string> = {
            1: "El usuario denegó el permiso de geolocalización",
            2: "No se pudo determinar la ubicación",
            3: "Se agotó el tiempo de espera al intentar obtener la ubicación",
          }
          reject(
            new GeolocationError(
              error.code as GeolocationErrorCode,
              errorMessages[error.code] || "Error desconocido al obtener la ubicación"
            )
          )
        },
        opts
      )
    })
  }
}
