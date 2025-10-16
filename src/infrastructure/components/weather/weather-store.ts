import { geolocationRepository } from "@/application/domain/geolocation"
import { Weather, weatherRepository } from "@/application/domain/weather"
import { create } from "zustand"

interface WeatherState {
  weather: Weather | null
  isLoading: boolean
  error: string | null
  lastUpdated: number | null
  fetchWeather: () => Promise<void>
  clearError: () => void
}

export const useWeatherStore = create<WeatherState>((set) => {
  const getServices = () => ({
    geolocationService: geolocationRepository,
    weatherService: weatherRepository,
  })

  return {
    weather: null,
    isLoading: false,
    error: null,
    lastUpdated: null,

    fetchWeather: async () => {
      set({ isLoading: true, error: null })

      try {
        const { geolocationService: geoService, weatherService: weatherSvc } = getServices()

        const position = await geoService.getPosition({
          options: { enableHighAccuracy: true, timeout: 10000 },
        })

        const weather = await weatherSvc.getWeatherByCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })

        set({
          weather,
          isLoading: false,
          error: null,
          lastUpdated: Date.now(),
        })
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Error al obtener información del clima"

        set({
          isLoading: false,
          error: errorMessage,
          weather: null,
        })
      }
    },

    clearError: () => set({ error: null }),
  }
})
