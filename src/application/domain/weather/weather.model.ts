export interface WeatherInfo {
  coordinates: {
    latitude: number
    longitude: number
  }
  weather: Array<{
    id: number
    main: string
    description: string
    icon: string
  }>
  main: {
    temp: number
    feelsLike: number
    tempMin: number
    tempMax: number
    pressure: number
    humidity: number
    seaLevel?: number
    groundLevel?: number
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
    oneHour?: number
    threeHours?: number
  }
  snow?: {
    oneHour?: number
    threeHours?: number
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
  cityId: number
  cityName: string
}

export interface WeatherOptions {
  units?: "metric" | "imperial" | "standard"
  language?: string
  timeout?: number
}
