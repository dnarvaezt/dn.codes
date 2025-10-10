import type { WeatherInfo, WeatherOptions } from "./weather.model"

export interface WeatherRepository {
  getWeatherByCoordinates(
    latitude: number,
    longitude: number,
    options?: WeatherOptions
  ): Promise<WeatherInfo>
  getWeatherByCity(cityName: string, options?: WeatherOptions): Promise<WeatherInfo>
  getWeatherByCoordinatesOrDefault(
    latitude: number,
    longitude: number,
    options?: WeatherOptions
  ): Promise<WeatherInfo>
}
