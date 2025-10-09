import {
  DEFAULT_WEATHER_INFO,
  DEFAULT_WEATHER_OPTIONS,
  OPENWEATHERMAP_API_URL,
  OpenWeatherMapResponse,
  WeatherError,
  WeatherInfo,
  WeatherOptions,
} from "./weather.types"

import type { GeolocationService } from "../geolocation"
import type { LanguageService } from "../language"

export class WeatherService {
  private readonly apiKey: string
  private readonly geolocationService?: GeolocationService
  private readonly languageService?: LanguageService

  constructor(
    apiKey: string,
    geolocationService?: GeolocationService,
    languageService?: LanguageService
  ) {
    if (!apiKey || apiKey.trim().length === 0) {
      throw new Error("API key de OpenWeatherMap es requerida")
    }
    this.apiKey = apiKey
    this.geolocationService = geolocationService
    this.languageService = languageService
  }

  private createError(message: string, statusCode?: number): WeatherError {
    return new WeatherError(message, statusCode)
  }

  private buildApiUrl(latitude: number, longitude: number, options?: WeatherOptions): string {
    const units = options?.units ?? DEFAULT_WEATHER_OPTIONS.units
    const language =
      options?.language ??
      this.languageService?.getCurrentLanguage().language ??
      DEFAULT_WEATHER_OPTIONS.language

    const params = new URLSearchParams({
      lat: String(latitude),
      lon: String(longitude),
      appid: this.apiKey,
      units,
      lang: language,
    })

    return `${OPENWEATHERMAP_API_URL}?${params.toString()}`
  }

  private buildCityApiUrl(cityName: string, options?: WeatherOptions): string {
    const units = options?.units ?? DEFAULT_WEATHER_OPTIONS.units
    const language =
      options?.language ??
      this.languageService?.getCurrentLanguage().language ??
      DEFAULT_WEATHER_OPTIONS.language

    const params = new URLSearchParams({
      q: cityName,
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
        throw this.createError(
          `Error al obtener información del clima: ${response.statusText}`,
          response.status
        )
      }

      const data: OpenWeatherMapResponse = await response.json()

      return this.mapResponseToWeatherInfo(data)
    } catch (error) {
      if (error instanceof WeatherError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw this.createError("Timeout al obtener información del clima")
        }
        throw this.createError(`Error al obtener información del clima: ${error.message}`)
      }

      throw this.createError("Error desconocido al obtener información del clima")
    } finally {
      clearTimeout(timeoutId)
    }
  }

  public async getWeatherByCoordinatesOrDefault(
    latitude: number,
    longitude: number,
    options?: WeatherOptions
  ): Promise<WeatherInfo> {
    try {
      return await this.getWeatherByCoordinates(latitude, longitude, options)
    } catch {
      return {
        ...DEFAULT_WEATHER_INFO,
        coordinates: {
          latitude,
          longitude,
        },
      }
    }
  }

  public async getWeatherByCity(cityName: string, options?: WeatherOptions): Promise<WeatherInfo> {
    const timeout = options?.timeout ?? DEFAULT_WEATHER_OPTIONS.timeout

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const url = this.buildCityApiUrl(cityName, options)

      const response = await fetch(url, {
        signal: controller.signal,
      })

      if (!response.ok) {
        throw this.createError(
          `Error al obtener información del clima para ${cityName}: ${response.statusText}`,
          response.status
        )
      }

      const data: OpenWeatherMapResponse = await response.json()

      return this.mapResponseToWeatherInfo(data)
    } catch (error) {
      if (error instanceof WeatherError) {
        throw error
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw this.createError("Timeout al obtener información del clima")
        }
        throw this.createError(`Error al obtener información del clima: ${error.message}`)
      }

      throw this.createError("Error desconocido al obtener información del clima")
    } finally {
      clearTimeout(timeoutId)
    }
  }

  public async getWeatherByCityOrDefault(
    cityName: string,
    options?: WeatherOptions
  ): Promise<WeatherInfo> {
    try {
      return await this.getWeatherByCity(cityName, options)
    } catch {
      return { ...DEFAULT_WEATHER_INFO }
    }
  }

  public async getWeatherFromGeolocation(options?: WeatherOptions): Promise<WeatherInfo> {
    if (!this.geolocationService) {
      throw this.createError("Servicio de geolocalización no disponible")
    }

    const position = await this.geolocationService.getPosition()

    return this.getWeatherByCoordinates(
      position.coords.latitude,
      position.coords.longitude,
      options
    )
  }

  public async getWeatherFromGeolocationOrDefault(options?: WeatherOptions): Promise<WeatherInfo> {
    try {
      return await this.getWeatherFromGeolocation(options)
    } catch {
      return { ...DEFAULT_WEATHER_INFO }
    }
  }

  public async validateApiKey(): Promise<boolean> {
    try {
      const url = `${OPENWEATHERMAP_API_URL}?lat=0&lon=0&appid=${this.apiKey}`
      const response = await fetch(url)
      return response.ok
    } catch {
      return false
    }
  }

  public getDefaultWeatherInfo(): WeatherInfo {
    return { ...DEFAULT_WEATHER_INFO }
  }

  public getIconUrl(iconCode: string, size: "2x" | "4x" = "2x"): string {
    return `https://openweathermap.org/img/wn/${iconCode}@${size}.png`
  }
}

export const createWeatherService = (
  apiKey: string,
  geolocationService?: GeolocationService,
  languageService?: LanguageService
) => {
  return new WeatherService(apiKey, geolocationService, languageService)
}

export const createWeatherServiceFromEnv = (
  geolocationService?: GeolocationService,
  languageService?: LanguageService
) => {
  const apiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY

  if (!apiKey) {
    throw new Error(
      "NEXT_PUBLIC_OPENWEATHERMAP_API_KEY no está configurada en las variables de entorno"
    )
  }

  return new WeatherService(apiKey, geolocationService, languageService)
}
