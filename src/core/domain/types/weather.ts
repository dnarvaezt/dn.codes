export interface WeatherCoordinates {
  latitude: number
  longitude: number
}

export interface WeatherCondition {
  id: number
  main: string
  description: string
  icon: string
}

export interface WeatherMain {
  temp: number
  feelsLike: number
  tempMin: number
  tempMax: number
  pressure: number
  humidity: number
  seaLevel?: number
  groundLevel?: number
}

export interface WeatherWind {
  speed: number
  deg: number
  gust?: number
}

export interface WeatherClouds {
  all: number
}

export interface WeatherRain {
  oneHour?: number
  threeHours?: number
}

export interface WeatherSnow {
  oneHour?: number
  threeHours?: number
}

export interface WeatherSys {
  type?: number
  id?: number
  country: string
  sunrise: number
  sunset: number
}

export interface WeatherInfo {
  coordinates: WeatherCoordinates
  weather: WeatherCondition[]
  main: WeatherMain
  visibility: number
  wind: WeatherWind
  clouds: WeatherClouds
  rain?: WeatherRain
  snow?: WeatherSnow
  dt: number
  sys: WeatherSys
  timezone: number
  cityId: number
  cityName: string
}

export interface WeatherOptions {
  units?: "metric" | "imperial" | "standard"
  language?: string
  timeout?: number
}

export interface OpenWeatherMapResponse {
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

export class WeatherError extends Error {
  constructor(
    message: string,
    public readonly statusCode?: number
  ) {
    super(message)
    this.name = "WeatherError"
  }
}

export const OPENWEATHERMAP_API_URL = "https://api.openweathermap.org/data/2.5/weather"

export const DEFAULT_WEATHER_OPTIONS: Required<WeatherOptions> = {
  units: "metric",
  language: "en",
  timeout: 10000,
}

export const DEFAULT_WEATHER_INFO: WeatherInfo = {
  coordinates: {
    latitude: 0,
    longitude: 0,
  },
  weather: [
    {
      id: 0,
      main: "Unknown",
      description: "Unknown",
      icon: "01d",
    },
  ],
  main: {
    temp: 0,
    feelsLike: 0,
    tempMin: 0,
    tempMax: 0,
    pressure: 0,
    humidity: 0,
  },
  visibility: 0,
  wind: {
    speed: 0,
    deg: 0,
  },
  clouds: {
    all: 0,
  },
  dt: 0,
  sys: {
    country: "",
    sunrise: 0,
    sunset: 0,
  },
  timezone: 0,
  cityId: 0,
  cityName: "Unknown",
}
