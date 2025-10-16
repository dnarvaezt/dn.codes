import type { Weather } from "@/application/domain/weather"

export interface WeatherVisibilityStrategy {
  shouldShowRain(weather: Weather): boolean
  shouldShowSnow(weather: Weather): boolean
  shouldShowClouds(weather: Weather): boolean
  shouldShowThunder(weather: Weather): boolean
}

export class WeatherVisibilityService {
  private strategy: WeatherVisibilityStrategy

  constructor(strategy: WeatherVisibilityStrategy) {
    this.strategy = strategy
  }

  setStrategy(strategy: WeatherVisibilityStrategy): void {
    this.strategy = strategy
  }

  getVisibilityFlags(weather: Weather | null) {
    if (!weather) {
      return {
        shouldShowRain: false,
        shouldShowSnow: false,
        shouldShowClouds: false,
        shouldShowThunder: false,
      }
    }

    return {
      shouldShowRain: this.strategy.shouldShowRain(weather),
      shouldShowSnow: this.strategy.shouldShowSnow(weather),
      shouldShowClouds: this.strategy.shouldShowClouds(weather),
      shouldShowThunder: this.strategy.shouldShowThunder(weather),
    }
  }
}

export class DefaultWeatherVisibilityStrategy implements WeatherVisibilityStrategy {
  shouldShowRain(weather: Weather): boolean {
    const mainWeather = weather.weather[0]?.main.toLowerCase()
    return mainWeather === "rain" || mainWeather === "drizzle" || mainWeather === "thunderstorm"
  }

  shouldShowSnow(weather: Weather): boolean {
    const mainWeather = weather.weather[0]?.main.toLowerCase()
    return mainWeather === "snow"
  }

  shouldShowClouds(weather: Weather): boolean {
    const mainWeather = weather.weather[0]?.main.toLowerCase()
    return (
      mainWeather === "clouds" ||
      mainWeather === "rain" ||
      mainWeather === "drizzle" ||
      mainWeather === "thunderstorm"
    )
  }

  shouldShowThunder(weather: Weather): boolean {
    const mainWeather = weather.weather[0]?.main.toLowerCase()
    return mainWeather === "thunderstorm"
  }
}
