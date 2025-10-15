import type { WeatherInfo } from "@/application/domain/weather"

export interface WeatherTypeStrategy {
  getWeatherType(weather: WeatherInfo): string
  shouldShow(weather: WeatherInfo): boolean
}

type TimeOfDay = "dawn" | "day" | "dusk" | "night"
type Season = "spring" | "summer" | "autumn" | "winter"
type Intensity = "light" | "moderate" | "heavy" | "extreme"
type Pressure = "low" | "normal" | "high"
type Humidity = "dry" | "normal" | "humid"
type Visibility = "clear" | "reduced" | "poor" | "very-poor"

export interface WeatherContext {
  weatherType: string
  timeOfDay: TimeOfDay
  season: Season
  intensity: Intensity
  atmospheric: {
    pressure: Pressure
    humidity: Humidity
    visibility: Visibility
  }
}

export class WeatherTypeService {
  private readonly strategies: Map<string, WeatherTypeStrategy> = new Map()

  registerStrategy(type: string, strategy: WeatherTypeStrategy): void {
    this.strategies.set(type, strategy)
  }

  getWeatherType(weather: WeatherInfo | null): string {
    if (!weather) return "default"

    const mainWeather = weather.weather[0]?.main.toLowerCase()
    const strategy = this.strategies.get(mainWeather)

    if (strategy) {
      return strategy.getWeatherType(weather)
    }

    // Fallback logic
    return this.getFallbackWeatherType(weather)
  }

  getWeatherContext(weather: WeatherInfo | null): WeatherContext | null {
    if (!weather) return null

    const timeOfDay = this.getTimeOfDay(weather)
    const season = this.getSeason(weather)
    const intensity = this.getIntensity(weather)
    const atmospheric = this.getAtmosphericConditions(weather)

    // Calcular weatherType directamente sin usar getWeatherType para evitar recursión
    const weatherType = this.getWeatherTypeDirect(weather, {
      timeOfDay,
      season,
      intensity,
      atmospheric,
    })

    return {
      weatherType,
      timeOfDay,
      season,
      intensity,
      atmospheric,
    }
  }

  private getTimeOfDay(weather: WeatherInfo): TimeOfDay {
    const now = new Date((weather.dt + weather.timezone) * 1000)
    const sunrise = new Date((weather.sys.sunrise + weather.timezone) * 1000)
    const sunset = new Date((weather.sys.sunset + weather.timezone) * 1000)

    const currentHour = now.getHours()
    const sunriseHour = sunrise.getHours()
    const sunsetHour = sunset.getHours()

    // Amanecer: 1 hora antes y 2 horas después del amanecer
    if (currentHour >= sunriseHour - 1 && currentHour <= sunriseHour + 2) {
      return "dawn"
    }

    // Atardecer: 2 horas antes y 1 hora después del atardecer
    if (currentHour >= sunsetHour - 2 && currentHour <= sunsetHour + 1) {
      return "dusk"
    }

    // Noche: después del atardecer + 1 hora o antes del amanecer - 1 hora
    if (currentHour >= sunsetHour + 1 || currentHour <= sunriseHour - 1) {
      return "night"
    }

    return "day"
  }

  private getSeason(weather: WeatherInfo): Season {
    const now = new Date((weather.dt + weather.timezone) * 1000)
    const month = now.getMonth() + 1 // 1-12

    // Estaciones basadas en el hemisferio norte (ajustar según coordenadas si es necesario)
    if (month >= 3 && month <= 5) return "spring"
    if (month >= 6 && month <= 8) return "summer"
    if (month >= 9 && month <= 11) return "autumn"
    return "winter"
  }

  private getIntensity(weather: WeatherInfo): Intensity {
    const mainWeather = weather.weather[0]?.main.toLowerCase()
    const description = weather.weather[0]?.description.toLowerCase()

    // Tormentas
    if (mainWeather === "thunderstorm") {
      return this.getThunderstormIntensity(weather, description)
    }

    // Lluvia
    if (mainWeather === "rain") {
      return this.getRainIntensity(weather)
    }

    // Nieve
    if (mainWeather === "snow") {
      return this.getSnowIntensity(weather)
    }

    // Viento
    return this.getWindIntensity(weather)
  }

  private getThunderstormIntensity(weather: WeatherInfo, description: string): Intensity {
    if (description.includes("heavy") || description.includes("severe")) {
      return weather.wind.gust && weather.wind.gust > 25 ? "extreme" : "heavy"
    }
    return "moderate"
  }

  private getRainIntensity(weather: WeatherInfo): Intensity {
    const rainVolume = Math.max(weather.rain?.oneHour || 0, (weather.rain?.threeHours || 0) / 3)
    if (rainVolume > 10) return "extreme"
    if (rainVolume > 5) return "heavy"
    if (rainVolume > 2.5) return "moderate"
    return "light"
  }

  private getSnowIntensity(weather: WeatherInfo): Intensity {
    const snowVolume = Math.max(weather.snow?.oneHour || 0, (weather.snow?.threeHours || 0) / 3)
    if (snowVolume > 5) return "extreme"
    if (snowVolume > 2.5) return "heavy"
    if (snowVolume > 1) return "moderate"
    return "light"
  }

  private getWindIntensity(weather: WeatherInfo): Intensity {
    if (weather.wind.speed > 20) return "extreme"
    if (weather.wind.speed > 15) return "heavy"
    if (weather.wind.speed > 10) return "moderate"
    return "light"
  }

  private getAtmosphericConditions(weather: WeatherInfo) {
    // Presión atmosférica
    let pressure: Pressure
    if (weather.main.pressure < 1000) pressure = "low"
    else if (weather.main.pressure > 1025) pressure = "high"
    else pressure = "normal"

    // Humedad
    let humidity: Humidity
    if (weather.main.humidity < 40) humidity = "dry"
    else if (weather.main.humidity > 70) humidity = "humid"
    else humidity = "normal"

    // Visibilidad
    let visibility: Visibility
    const visibilityKm = weather.visibility / 1000
    if (visibilityKm >= 10) visibility = "clear"
    else if (visibilityKm >= 5) visibility = "reduced"
    else if (visibilityKm >= 1) visibility = "poor"
    else visibility = "very-poor"

    return { pressure, humidity, visibility }
  }

  private getWeatherTypeDirect(
    weather: WeatherInfo,
    context: {
      timeOfDay: TimeOfDay
      season: Season
      intensity: Intensity
      atmospheric: { pressure: Pressure; humidity: Humidity; visibility: Visibility }
    }
  ): string {
    const mainWeather = weather.weather[0]?.main.toLowerCase()

    // Precipitación
    const precipitationType = this.getPrecipitationType(mainWeather, context)
    if (precipitationType) return precipitationType

    // Niebla / bruma
    const fogType = this.getFogType(mainWeather, context)
    if (fogType) return fogType

    // Condiciones extremas
    const extremeType = this.getExtremeConditions(weather)
    if (extremeType) return extremeType

    // Cielo despejado
    if (mainWeather === "clear") {
      return this.getClearSkyType(context)
    }

    // Nubes
    if (mainWeather === "clouds") {
      return this.getCloudyType(context, weather)
    }

    // Cielo parcialmente nublado
    return context.timeOfDay === "night" ? "partly-cloudy-night" : "partly-cloudy"
  }

  private getFallbackWeatherType(weather: WeatherInfo): string {
    const context = this.getWeatherContext(weather)

    if (!context) return "cloudy"

    // Usar el método directo para evitar recursión
    return this.getWeatherTypeDirect(weather, context)
  }

  private getPrecipitationType(
    mainWeather: string,
    context: {
      timeOfDay: TimeOfDay
      season: Season
      intensity: Intensity
      atmospheric: { pressure: Pressure; humidity: Humidity; visibility: Visibility }
    }
  ): string | null {
    if (mainWeather === "thunderstorm") {
      return this.getThunderstormType(context)
    }

    if (mainWeather === "rain" || mainWeather === "drizzle") {
      return this.getRainType(context)
    }

    if (mainWeather === "snow") {
      return this.getSnowType(context)
    }

    return null
  }

  private getThunderstormType(context: { timeOfDay: TimeOfDay; intensity: Intensity }): string {
    if (context.intensity === "extreme") return "stormy-night"
    return context.timeOfDay === "night" ? "stormy-night" : "stormy"
  }

  private getRainType(context: { timeOfDay: TimeOfDay; intensity: Intensity }): string {
    if (context.intensity === "heavy" || context.intensity === "extreme") {
      return context.timeOfDay === "night" ? "heavy-rain-night" : "heavy-rain"
    }
    return context.timeOfDay === "night" ? "rainy-night" : "rainy"
  }

  private getSnowType(context: { timeOfDay: TimeOfDay; intensity: Intensity }): string {
    if (context.intensity === "heavy" || context.intensity === "extreme") {
      return context.timeOfDay === "night" ? "heavy-snow-night" : "heavy-snow"
    }
    return context.timeOfDay === "night" ? "snowy-night" : "snowy"
  }

  private getFogType(mainWeather: string, context: { timeOfDay: TimeOfDay }): string | null {
    if (mainWeather === "mist" || mainWeather === "fog" || mainWeather === "haze") {
      return context.timeOfDay === "night" ? "foggy-night" : "foggy"
    }
    return null
  }

  private getExtremeConditions(weather: WeatherInfo): string | null {
    if (weather.main.temp > 35) return "hot"
    if (weather.main.temp < -10) return "freezing"
    if (weather.wind.speed > 15) return "windy"
    return null
  }

  private getClearSkyType(context: { timeOfDay: TimeOfDay; season: Season }): string {
    if (context.timeOfDay === "dawn") return "dawn"
    if (context.timeOfDay === "dusk") return "dusk"
    if (context.timeOfDay === "night") return "clear-night"

    // Variaciones estacionales para días despejados
    if (context.season === "summer") return "summer-sunny"
    if (context.season === "spring") return "spring-sunny"
    if (context.season === "autumn") return "autumn-sunny"
    if (context.season === "winter") return "winter-clear"

    return "sunny"
  }

  private getCloudyType(
    context: { timeOfDay: TimeOfDay; season: Season },
    weather: WeatherInfo
  ): string {
    if (context.timeOfDay === "night") return "cloudy-night"

    // Variaciones estacionales para días nublados
    if (context.season === "summer") {
      return weather.clouds.all > 75 ? "summer-overcast" : "summer-cloudy"
    }
    if (context.season === "winter") {
      return weather.clouds.all > 75 ? "winter-overcast" : "winter-cloudy"
    }

    return weather.clouds.all > 75 ? "overcast" : "cloudy"
  }
}
