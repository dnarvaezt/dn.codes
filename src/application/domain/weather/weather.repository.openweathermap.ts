import { WeatherInfo, WeatherOptions } from "./weather.model"

interface WeatherRepository {
  getWeatherByCoordinates(
    latitude: number,
    longitude: number,
    options?: WeatherOptions
  ): Promise<WeatherInfo>
}

interface OpenWeatherMapResponse {
  coord: {
    lon: number
    lat: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  base: string
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
    sea_level?: number
    grnd_level?: number
  }
  visibility: number
  wind: {
    speed: number
    deg: number
    gust?: number
  }
  clouds: {
    all: number
  }
  rain?: {
    "1h"?: number
    "3h"?: number
  }
  snow?: {
    "1h"?: number
    "3h"?: number
  }
  dt: number
  sys: {
    type?: number
    id?: number
    country: string
    sunrise: number
    sunset: number
  }
  timezone: number
  id: number
  name: string
  cod: number
}

class WeatherError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message)
    this.name = "WeatherError"
  }
}

const OPENWEATHERMAP_API_URL = "https://api.openweathermap.org/data/2.5/weather"
const DEFAULT_WEATHER_OPTIONS: Required<WeatherOptions> = {
  units: "metric",
  language: "en",
  timeout: 10000,
}

export class WeatherRepositoryOpenWeatherMap implements WeatherRepository {
  private readonly apiKey: string

  constructor(apiKey: string) {
    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error("API key de OpenWeatherMap es requerida")
    }
    this.apiKey = apiKey
  }

  private buildApiUrl(latitude: number, longitude: number, options?: WeatherOptions): string {
    const units = options?.units ?? DEFAULT_WEATHER_OPTIONS.units
    const language = options?.language ?? DEFAULT_WEATHER_OPTIONS.language

    const params = new URLSearchParams({
      lat: String(latitude),
      lon: String(longitude),
      appid: this.apiKey,
      units,
      lang: language,
    })

    return `${OPENWEATHERMAP_API_URL}?${params.toString()}`
  }

  private mapResponseToWeatherInfo(response: OpenWeatherMapResponse): WeatherInfo {
    return {
      coordinates: {
        latitude: response.coord.lat,
        longitude: response.coord.lon,
      },
      weather: response.weather.map((w) => ({
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

  public async getWeatherByCoordinates(
    latitude: number,
    longitude: number,
    options?: WeatherOptions
  ): Promise<WeatherInfo> {
    const timeout = options?.timeout ?? DEFAULT_WEATHER_OPTIONS.timeout

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const url = this.buildApiUrl(latitude, longitude, options)

      const response = await fetch(url, {
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new WeatherError(
          `Error al obtener información del clima: ${response.statusText}`,
          response.status
        )
      }

      const data: OpenWeatherMapResponse = await response.json()

      return this.mapResponseToWeatherInfo(data)
    } catch (error) {
      if (error instanceof WeatherError) throw error

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new WeatherError("Timeout al obtener información del clima")
        }
        throw new WeatherError(`Error al obtener información del clima: ${error.message}`)
      }

      throw new WeatherError("Error desconocido al obtener información del clima")
    } finally {
      clearTimeout(timeoutId)
    }
  }
}

export const createWeatherRepository = (): WeatherRepository => {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY || ""
  return new WeatherRepositoryOpenWeatherMap(apiKey)
}
