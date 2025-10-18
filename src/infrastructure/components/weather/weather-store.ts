import { Weather, weatherRepository } from "@/application/domain/weather"
import { GetWeatherByCoordinatesProps } from "@/application/domain/weather/weather.repository"
import { axiosErrorHandler } from "@/application/utils"
import { create } from "zustand"

interface WeatherState {
  weather: Weather | null
  isLoading: boolean
  loadWeather: (args: GetWeatherByCoordinatesProps) => Promise<Weather>
}

export const useWeatherStore = create<WeatherState>((set) => {
  const loadWeather = async (args: GetWeatherByCoordinatesProps): Promise<Weather> => {
    set({ isLoading: true })
    try {
      const weather = await weatherRepository.getWeatherByCoordinates(args)
      set({ weather, isLoading: false })
      return weather
    } catch (error) {
      set({ isLoading: false })
      throw axiosErrorHandler(error)
    }
  }

  return {
    weather: null,
    isLoading: false,
    loadWeather,
  }
})
