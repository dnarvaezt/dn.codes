import type { GeolocationRepository } from "./user-context.repository.interface"

import {
  DEFAULT_LOCATION,
  DefaultLocation,
  GeolocationError,
  GeolocationErrorCode,
  GeolocationMode,
  GeolocationOptions,
  GeolocationPosition,
  ManualLocation,
} from "./user-context.model"

export class GeolocationRepositoryImpl implements GeolocationRepository {
  private defaultLocation: DefaultLocation = DEFAULT_LOCATION
  private mode: GeolocationMode = GeolocationMode.AUTO
  private manualLocation: ManualLocation | null = null

  private isSupported(): boolean {
    return "geolocation" in navigator
  }

  private createError(code: GeolocationErrorCode, message: string): GeolocationError {
    return new GeolocationError(code, message)
  }

  private mapGeolocationError(error: GeolocationPositionError): GeolocationError {
    const errorMessages: Record<number, string> = {
      1: "El usuario denegó el permiso de geolocalización",
      2: "No se pudo determinar la ubicación",
      3: "Se agotó el tiempo de espera al intentar obtener la ubicación",
    }

    return this.createError(
      error.code as GeolocationErrorCode,
      errorMessages[error.code] || "Error desconocido al obtener la ubicación"
    )
  }

  private mapPosition(position: GeolocationPosition): GeolocationPosition {
    return {
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
    }
  }

  private createDefaultPosition(): GeolocationPosition {
    return {
      coords: {
        latitude: this.defaultLocation.latitude,
        longitude: this.defaultLocation.longitude,
        accuracy: this.defaultLocation.accuracy,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    }
  }

  public setDefaultLocation(location: DefaultLocation): void {
    this.defaultLocation = location
  }

  public getDefaultLocation(): DefaultLocation {
    return { ...this.defaultLocation }
  }

  public async getCurrentPosition(options?: GeolocationOptions): Promise<GeolocationPosition> {
    if (!this.isSupported()) {
      throw this.createError(
        4 as GeolocationErrorCode,
        "La geolocalización no está soportada en este navegador"
      )
    }

    const defaultOptions: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options,
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(this.mapPosition(position as GeolocationPosition))
        },
        (error) => {
          reject(this.mapGeolocationError(error))
        },
        defaultOptions
      )
    })
  }

  public watchPosition(
    onSuccess: (position: GeolocationPosition) => void,
    onError: (error: Error) => void,
    options?: GeolocationOptions
  ): number | null {
    if (!this.isSupported()) {
      onError(
        this.createError(
          4 as GeolocationErrorCode,
          "La geolocalización no está soportada en este navegador"
        )
      )
      return null
    }

    const defaultOptions: GeolocationOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
      ...options,
    }

    return navigator.geolocation.watchPosition(
      (position) => {
        onSuccess(this.mapPosition(position as GeolocationPosition))
      },
      (error) => {
        onError(this.mapGeolocationError(error))
      },
      defaultOptions
    )
  }

  public clearWatch(watchId: number): void {
    if (this.isSupported()) {
      navigator.geolocation.clearWatch(watchId)
    }
  }

  public async getCurrentPositionOrDefault(
    options?: GeolocationOptions
  ): Promise<GeolocationPosition> {
    try {
      return await this.getCurrentPosition(options)
    } catch {
      return this.createDefaultPosition()
    }
  }

  public setMode(mode: GeolocationMode): void {
    this.mode = mode
  }

  public getMode(): GeolocationMode {
    return this.mode
  }

  public setManualLocation(location: ManualLocation): void {
    this.manualLocation = {
      latitude: location.latitude,
      longitude: location.longitude,
      accuracy: location.accuracy ?? 0,
    }
  }

  public getManualLocation(): ManualLocation | null {
    return this.manualLocation ? { ...this.manualLocation } : null
  }

  private createManualPosition(): GeolocationPosition {
    if (!this.manualLocation) {
      throw this.createError(4 as GeolocationErrorCode, "No hay ubicación manual establecida")
    }

    return {
      coords: {
        latitude: this.manualLocation.latitude,
        longitude: this.manualLocation.longitude,
        accuracy: this.manualLocation.accuracy ?? 0,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      },
      timestamp: Date.now(),
    }
  }

  public async getPosition(options?: GeolocationOptions): Promise<GeolocationPosition> {
    if (this.mode === GeolocationMode.MANUAL) {
      return this.createManualPosition()
    }

    return this.getCurrentPosition(options)
  }

  public async getPositionOrDefault(options?: GeolocationOptions): Promise<GeolocationPosition> {
    try {
      return await this.getPosition(options)
    } catch {
      return this.createDefaultPosition()
    }
  }
}

export const createGeolocationRepository = () => {
  return new GeolocationRepositoryImpl()
}
