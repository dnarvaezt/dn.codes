import { createGeolocationRepository, GeolocationService } from "@/application/domain/geolocation"
import { createWeatherRepository, WeatherInfo, WeatherService } from "@/application/domain/weather"
import { create } from "zustand"

interface WeatherState {
  weather: WeatherInfo | null
  isLoading: boolean
  error: string | null
  lastUpdated: number | null
  fetchWeather: () => Promise<void>
  clearError: () => void
}

export const useWeatherStore = create<WeatherState>((set) => {
  let geolocationService: GeolocationService | null = null
  let weatherService: WeatherService | null = null

  const getServices = () => {
    if (!geolocationService) {
      geolocationService = new GeolocationService(createGeolocationRepository())
    }
    if (!weatherService) {
      weatherService = new WeatherService(createWeatherRepository())
    }
    return { geolocationService, weatherService }
  }

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
          enableHighAccuracy: true,
          timeout: 10000,
        })

        const weather = await weatherSvc.getWeatherByCoordinates(
          position.coords.latitude,
          position.coords.longitude,
          {
            units: "metric",
            language: "es",
          }
        )

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
