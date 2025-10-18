import { axiosErrorHandler } from "@/application/utils"
import axios from "axios"
import { buildWeatherScenario } from "./weather.build-scenario"

import type { Weather, WeatherMetrics, WeatherScenario } from "./weather.model"
export interface GetWeatherByCoordinatesProps {
  latitude: number
  longitude: number
}

export abstract class WeatherRepository<TWeather = Weather> {
  abstract getWeatherByCoordinates(args: GetWeatherByCoordinatesProps): Promise<TWeather>
}

export class WeatherRepositoryOpenWeatherMap implements WeatherRepository<Weather> {
  private get url(): string {
    return `https://api.openweathermap.org/data/2.5/weather`
  }

  async getWeatherByCoordinates(args: GetWeatherByCoordinatesProps): Promise<Weather> {
    const { latitude, longitude } = args
    const appid: string = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY || ""

    try {
      const { data } = await axios.get(this.url, {
        params: {
          appid,
          lat: String(latitude),
          lon: String(longitude),
          units: "metric",
          lang: "es",
          mode: "json",
        },
      })

      const metrics: WeatherMetrics = this.mapResponseToWeatherMetrics(data)
      const scenario: WeatherScenario = buildWeatherScenario(metrics)

      return {
        scenario,
        metrics,
      } as Weather
    } catch (error) {
      throw axiosErrorHandler(error)
    }
  }

  private mapResponseToWeatherMetrics(response: any): WeatherMetrics {
    return {
      coordinates: {
        latitude: response.coord.lat,
        longitude: response.coord.lon,
      },
      weather: response.weather.map((w: any) => ({
        id: w.id,
        main: w.main,
        description: w.description,
        icon: w.icon,
      })),
      main: {
        temp: response.main.temp,
        feelsLike: response.main.feels_like,
        tempMin: response.main.temp_min,
        tempMax: response.main.temp_max,
        pressure: response.main.pressure,
        humidity: response.main.humidity,
        seaLevel: response.main.sea_level,
        groundLevel: response.main.grnd_level,
      },
      visibility: response.visibility,
      wind: {
        speed: response.wind.speed,
        deg: response.wind.deg,
        gust: response.wind.gust,
      },
      clouds: {
        all: response.clouds.all,
      },
      rain: response.rain
        ? {
            oneHour: response.rain["1h"],
            threeHours: response.rain["3h"],
          }
        : undefined,
      snow: response.snow
        ? {
            oneHour: response.snow["1h"],
            threeHours: response.snow["3h"],
          }
        : undefined,
      dt: response.dt,
      sys: {
        type: response.sys.type,
        id: response.sys.id,
        country: response.sys.country,
        sunrise: response.sys.sunrise,
        sunset: response.sys.sunset,
      },
      timezone: response.timezone,
      cityId: response.id,
      cityName: response.name,
    }
  }
}
