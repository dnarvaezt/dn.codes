import type { WeatherInfo, WeatherOptions } from "./weather.model"

interface WeatherRepository {
  getWeatherByCoordinates(
    latitude: number,
    longitude: number,
    options?: WeatherOptions
  ): Promise<WeatherInfo>
}

export class WeatherService {
  constructor(private readonly repository: WeatherRepository) {}

  public async getWeatherByCoordinates(
    latitude: number,
    longitude: number,
    options?: WeatherOptions
  ): Promise<WeatherInfo> {
    return this.repository.getWeatherByCoordinates(latitude, longitude, options)
  }
}
