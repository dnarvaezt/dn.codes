import type { WeatherInfo, WeatherOptions } from "./weather.model"
import type { WeatherRepository } from "./weather.repository.interface"

export class WeatherService {
  constructor(private readonly repository: WeatherRepository) {}

  public async getWeatherByCoordinates(
    latitude: number,
    longitude: number,
    options?: WeatherOptions
  ): Promise<WeatherInfo> {
    return this.repository.getWeatherByCoordinates(latitude, longitude, options)
  }

  public async getWeatherByCity(cityName: string, options?: WeatherOptions): Promise<WeatherInfo> {
    return this.repository.getWeatherByCity(cityName, options)
  }

  public async getWeatherByCoordinatesOrDefault(
    latitude: number,
    longitude: number,
    options?: WeatherOptions
  ): Promise<WeatherInfo> {
    return this.repository.getWeatherByCoordinatesOrDefault(latitude, longitude, options)
  }
}
