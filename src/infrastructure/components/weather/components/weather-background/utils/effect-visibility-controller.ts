import type { WeatherInfo } from "@/application/domain/weather"

export interface WeatherVisibilityStrategy {
  shouldShowRain(weather: WeatherInfo): boolean
  shouldShowSnow(weather: WeatherInfo): boolean
  shouldShowClouds(weather: WeatherInfo): boolean
  shouldShowThunder(weather: WeatherInfo): boolean
}

export class WeatherVisibilityService {
  private strategy: WeatherVisibilityStrategy

  constructor(strategy: WeatherVisibilityStrategy) {
    this.strategy = strategy
  }

  setStrategy(strategy: WeatherVisibilityStrategy): void {
    this.strategy = strategy
  }

  getVisibilityFlags(weather: WeatherInfo | null) {
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
  shouldShowRain(weather: WeatherInfo): boolean {
    const mainWeather = weather.weather[0]?.main.toLowerCase()
    return mainWeather === "rain" || mainWeather === "drizzle" || mainWeather === "thunderstorm"
  }

  shouldShowSnow(weather: WeatherInfo): boolean {
    const mainWeather = weather.weather[0]?.main.toLowerCase()
    return mainWeather === "snow"
  }

  shouldShowClouds(weather: WeatherInfo): boolean {
    const mainWeather = weather.weather[0]?.main.toLowerCase()
    return (
      mainWeather === "clouds" ||
      mainWeather === "rain" ||
      mainWeather === "drizzle" ||
      mainWeather === "thunderstorm"
    )
  }

  shouldShowThunder(weather: WeatherInfo): boolean {
    const mainWeather = weather.weather[0]?.main.toLowerCase()
    return mainWeather === "thunderstorm"
  }
}
