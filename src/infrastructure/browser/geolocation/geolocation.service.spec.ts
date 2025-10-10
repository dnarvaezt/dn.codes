import { GeolocationMode } from "@/core/domain/types/geolocation"
import { beforeEach, describe, expect, it, vi } from "vitest"
import { GeolocationService } from "./geolocation.service"

import type { GeolocationPosition } from "@/core/domain/types/geolocation"

describe("GeolocationService", () => {
  let service: GeolocationService

  beforeEach(() => {
    service = new GeolocationService()
    vi.clearAllMocks()
  })

  describe("getCurrentPosition", () => {
    it("debe retornar la posición actual cuando el navegador la provee", async () => {
      const mockPosition: GeolocationPosition = {
        coords: {
          latitude: 40.7128,
          longitude: -74.006,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      }

      const mockGeolocation = {
        getCurrentPosition: vi.fn((success) => {
          success(mockPosition)
        }),
      }

      vi.stubGlobal("navigator", {
        geolocation: mockGeolocation,
      })

      const result = await service.getCurrentPosition()

      expect(result).toEqual(mockPosition)
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledOnce()
    })

    it("debe lanzar error cuando la geolocalización no está disponible", async () => {
      vi.stubGlobal("navigator", {})

      await expect(service.getCurrentPosition()).rejects.toThrow(
        "La geolocalización no está soportada en este navegador"
      )
    })

    it("debe lanzar error cuando el usuario niega el permiso", async () => {
      const mockGeolocation = {
        getCurrentPosition: vi.fn((_, error) => {
          error({
            code: 1,
            message: "User denied Geolocation",
          })
        }),
      }

      vi.stubGlobal("navigator", {
        geolocation: mockGeolocation,
      })

      await expect(service.getCurrentPosition()).rejects.toThrow(
        "El usuario denegó el permiso de geolocalización"
      )
    })
  })

  describe("watchPosition", () => {
    it("debe retornar un ID de watch cuando se inicia el seguimiento", () => {
      const mockWatchId = 123
      const mockOnSuccess = vi.fn()
      const mockOnError = vi.fn()

      const mockGeolocation = {
        watchPosition: vi.fn(() => mockWatchId),
      }

      vi.stubGlobal("navigator", {
        geolocation: mockGeolocation,
      })

      const watchId = service.watchPosition(mockOnSuccess, mockOnError)

      expect(watchId).toBe(mockWatchId)
      expect(mockGeolocation.watchPosition).toHaveBeenCalledOnce()
    })

    it("debe ejecutar el callback de éxito cuando la posición cambia", () => {
      const mockOnSuccess = vi.fn()
      const mockOnError = vi.fn()
      const mockPosition: GeolocationPosition = {
        coords: {
          latitude: 40.7128,
          longitude: -74.006,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      }

      const mockGeolocation = {
        watchPosition: vi.fn((success) => {
          success({
            coords: {
              latitude: mockPosition.coords.latitude,
              longitude: mockPosition.coords.longitude,
              accuracy: mockPosition.coords.accuracy,
              altitude: mockPosition.coords.altitude,
              altitudeAccuracy: mockPosition.coords.altitudeAccuracy,
              heading: mockPosition.coords.heading,
              speed: mockPosition.coords.speed,
            },
            timestamp: mockPosition.timestamp,
          })
          return 123
        }),
      }

      vi.stubGlobal("navigator", {
        geolocation: mockGeolocation,
      })

      service.watchPosition(mockOnSuccess, mockOnError)

      expect(mockOnSuccess).toHaveBeenCalledWith(mockPosition)
    })
  })

  describe("clearWatch", () => {
    it("debe limpiar el watch position correctamente", () => {
      const mockWatchId = 123
      const mockClearWatch = vi.fn()

      const mockGeolocation = {
        clearWatch: mockClearWatch,
        watchPosition: vi.fn(() => mockWatchId),
      }

      vi.stubGlobal("navigator", {
        geolocation: mockGeolocation,
      })

      const watchId = service.watchPosition(vi.fn(), vi.fn())
      if (watchId !== null) {
        service.clearWatch(watchId)
      }

      expect(mockClearWatch).toHaveBeenCalledWith(mockWatchId)
    })

    it("no debe hacer nada si la geolocalización no está disponible", () => {
      vi.stubGlobal("navigator", {})

      expect(() => service.clearWatch(123)).not.toThrow()
    })
  })

  describe("watchPosition con manejo de errores", () => {
    it("debe retornar null y ejecutar onError cuando la geolocalización no está disponible", () => {
      const mockOnSuccess = vi.fn()
      const mockOnError = vi.fn()

      vi.stubGlobal("navigator", {})

      const watchId = service.watchPosition(mockOnSuccess, mockOnError)

      expect(watchId).toBeNull()
      expect(mockOnError).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 4,
          message: "La geolocalización no está soportada en este navegador",
        })
      )
    })

    it("debe ejecutar onError cuando el navegador devuelve un error", () => {
      const mockOnSuccess = vi.fn()
      const mockOnError = vi.fn()

      const mockGeolocation = {
        watchPosition: vi.fn((success, error) => {
          error({
            code: 2,
            message: "Position unavailable",
          })
          return 123
        }),
      }

      vi.stubGlobal("navigator", {
        geolocation: mockGeolocation,
      })

      service.watchPosition(mockOnSuccess, mockOnError)

      expect(mockOnError).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 2,
          message: "No se pudo determinar la ubicación",
        })
      )
    })
  })

  describe("setDefaultLocation", () => {
    it("debe actualizar la ubicación por defecto", () => {
      const newLocation = {
        latitude: 40.7128,
        longitude: -74.006,
        accuracy: 100,
      }

      service.setDefaultLocation(newLocation)

      const result = service.getDefaultLocation()
      expect(result).toEqual(newLocation)
    })
  })

  describe("getDefaultLocation", () => {
    it("debe retornar la ubicación por defecto inicial", () => {
      const location = service.getDefaultLocation()

      expect(location).toEqual({
        latitude: 0,
        longitude: 0,
        accuracy: 0,
      })
    })

    it("debe retornar una copia de la ubicación por defecto", () => {
      const location1 = service.getDefaultLocation()
      const location2 = service.getDefaultLocation()

      expect(location1).not.toBe(location2)
      expect(location1).toEqual(location2)
    })
  })

  describe("getCurrentPositionOrDefault", () => {
    it("debe retornar la posición actual cuando está disponible", async () => {
      const mockPosition: GeolocationPosition = {
        coords: {
          latitude: 40.7128,
          longitude: -74.006,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      }

      const mockGeolocation = {
        getCurrentPosition: vi.fn((success) => {
          success(mockPosition)
        }),
      }

      vi.stubGlobal("navigator", {
        geolocation: mockGeolocation,
      })

      const result = await service.getCurrentPositionOrDefault()

      expect(result.coords.latitude).toBe(mockPosition.coords.latitude)
      expect(result.coords.longitude).toBe(mockPosition.coords.longitude)
    })

    it("debe retornar la posición por defecto cuando hay un error", async () => {
      const mockGeolocation = {
        getCurrentPosition: vi.fn((_, error) => {
          error({
            code: 1,
            message: "User denied Geolocation",
          })
        }),
      }

      vi.stubGlobal("navigator", {
        geolocation: mockGeolocation,
      })

      const result = await service.getCurrentPositionOrDefault()

      expect(result.coords.latitude).toBe(0)
      expect(result.coords.longitude).toBe(0)
      expect(result.coords.accuracy).toBe(0)
    })

    it("debe retornar la posición por defecto personalizada cuando hay un error", async () => {
      const customDefault = {
        latitude: 51.5074,
        longitude: -0.1278,
        accuracy: 50,
      }

      service.setDefaultLocation(customDefault)

      const mockGeolocation = {
        getCurrentPosition: vi.fn((_, error) => {
          error({
            code: 3,
            message: "Timeout",
          })
        }),
      }

      vi.stubGlobal("navigator", {
        geolocation: mockGeolocation,
      })

      const result = await service.getCurrentPositionOrDefault()

      expect(result.coords.latitude).toBe(customDefault.latitude)
      expect(result.coords.longitude).toBe(customDefault.longitude)
      expect(result.coords.accuracy).toBe(customDefault.accuracy)
    })

    it("debe retornar la posición por defecto cuando la geolocalización no está disponible", async () => {
      vi.stubGlobal("navigator", {})

      const result = await service.getCurrentPositionOrDefault()

      expect(result.coords.latitude).toBe(0)
      expect(result.coords.longitude).toBe(0)
      expect(result.timestamp).toBeDefined()
    })
  })

  describe("Modo de geolocalización", () => {
    it("debe iniciar en modo automático por defecto", () => {
      const mode = service.getMode()

      expect(mode).toBe(GeolocationMode.AUTO)
    })

    it("debe permitir cambiar a modo manual", () => {
      service.setMode(GeolocationMode.MANUAL)

      expect(service.getMode()).toBe(GeolocationMode.MANUAL)
    })

    it("debe permitir cambiar de manual a automático", () => {
      service.setMode(GeolocationMode.MANUAL)
      service.setMode(GeolocationMode.AUTO)

      expect(service.getMode()).toBe(GeolocationMode.AUTO)
    })
  })

  describe("Geolocalización manual", () => {
    it("debe establecer una ubicación manual", () => {
      const manualLocation = {
        latitude: 40.7128,
        longitude: -74.006,
        accuracy: 10,
      }

      service.setManualLocation(manualLocation)

      const result = service.getManualLocation()
      expect(result).toEqual(manualLocation)
    })

    it("debe retornar null cuando no hay ubicación manual establecida", () => {
      const result = service.getManualLocation()

      expect(result).toBeNull()
    })
  })

  describe("getPosition con modos", () => {
    it("debe usar geolocalización del navegador en modo auto", async () => {
      const mockPosition: GeolocationPosition = {
        coords: {
          latitude: 40.7128,
          longitude: -74.006,
          accuracy: 10,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      }

      const mockGeolocation = {
        getCurrentPosition: vi.fn((success) => {
          success(mockPosition)
        }),
      }

      vi.stubGlobal("navigator", {
        geolocation: mockGeolocation,
      })

      service.setMode(GeolocationMode.AUTO)
      const result = await service.getPosition()

      expect(result.coords.latitude).toBe(mockPosition.coords.latitude)
      expect(result.coords.longitude).toBe(mockPosition.coords.longitude)
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled()
    })

    it("debe usar ubicación manual en modo manual", async () => {
      const manualLocation = {
        latitude: 51.5074,
        longitude: -0.1278,
        accuracy: 50,
      }

      service.setMode(GeolocationMode.MANUAL)
      service.setManualLocation(manualLocation)

      const result = await service.getPosition()

      expect(result.coords.latitude).toBe(manualLocation.latitude)
      expect(result.coords.longitude).toBe(manualLocation.longitude)
      expect(result.coords.accuracy).toBe(manualLocation.accuracy)
    })

    it("debe lanzar error en modo manual si no hay ubicación establecida", async () => {
      service.setMode(GeolocationMode.MANUAL)

      await expect(service.getPosition()).rejects.toThrow("No hay ubicación manual establecida")
    })

    it("debe retornar ubicación por defecto en modo manual sin ubicación usando getPositionOrDefault", async () => {
      service.setMode(GeolocationMode.MANUAL)

      const result = await service.getPositionOrDefault()

      expect(result.coords.latitude).toBe(0)
      expect(result.coords.longitude).toBe(0)
    })
  })
})
