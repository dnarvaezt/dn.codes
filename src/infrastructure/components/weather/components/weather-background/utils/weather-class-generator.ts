import type { WeatherContext } from "./weather-type-classifier"

/**
 * Generador de clases CSS precisas basadas en el contexto meteorológico completo
 */
export class WeatherClassGenerator {
  /**
   * Genera clases CSS basadas en el contexto meteorológico
   */
  static generateClasses(context: WeatherContext | null): string {
    if (!context) return "weather-background weather-background--default"

    const baseClass = "weather-background"
    const classes: string[] = [baseClass]

    // Clase principal del tipo de clima
    classes.push(`${baseClass}--${context.weatherType}`)

    // Clases adicionales basadas en condiciones atmosféricas
    const atmosphericClasses = this.generateAtmosphericClasses(context)
    classes.push(...atmosphericClasses)

    // Clases basadas en intensidad
    const intensityClasses = this.generateIntensityClasses(context)
    classes.push(...intensityClasses)

    // Clases combinadas para condiciones extremas
    const combinedClasses = this.generateCombinedClasses(context)
    classes.push(...combinedClasses)

    return classes.join(" ")
  }

  /**
   * Genera clases basadas en condiciones atmosféricas
   */
  private static generateAtmosphericClasses(context: WeatherContext): string[] {
    const classes: string[] = []
    const { atmospheric } = context

    // Presión atmosférica
    if (atmospheric.pressure === "low") {
      classes.push("weather-background--low-pressure")
    } else if (atmospheric.pressure === "high") {
      classes.push("weather-background--high-pressure")
    }

    // Humedad
    if (atmospheric.humidity === "dry") {
      classes.push("weather-background--dry-atmosphere")
    } else if (atmospheric.humidity === "humid") {
      classes.push("weather-background--humid-atmosphere")
    }

    // Visibilidad
    if (atmospheric.visibility === "very-poor") {
      classes.push("weather-background--very-poor-visibility")
    }

    return classes
  }

  /**
   * Genera clases basadas en intensidad
   */
  private static generateIntensityClasses(context: WeatherContext): string[] {
    const classes: string[] = []
    const { intensity, weatherType } = context

    // Viento extremo
    if (intensity === "extreme" && weatherType.includes("windy")) {
      classes.push("weather-background--extreme-wind")
    }

    return classes
  }

  /**
   * Genera clases combinadas para condiciones complejas
   */
  private static generateCombinedClasses(context: WeatherContext): string[] {
    const classes: string[] = []
    const { intensity, weatherType, atmospheric } = context

    // Tormentas extremas
    if (weatherType.includes("stormy") && intensity === "extreme") {
      classes.push("weather-background--stormy-extreme")
    }

    // Lluvia extrema
    if (weatherType.includes("heavy-rain") && intensity === "extreme") {
      classes.push("weather-background--heavy-rain-extreme")
    }

    // Condiciones de baja presión con tormentas
    if (
      atmospheric.pressure === "low" &&
      (weatherType.includes("stormy") || weatherType.includes("rain"))
    ) {
      classes.push("weather-background--low-pressure")
    }

    return classes
  }

  /**
   * Genera clases específicas para efectos meteorológicos
   */
  static generateEffectClasses(context: WeatherContext | null): {
    clouds: string
    rain: string
    snow: string
    thunder: string
  } {
    if (!context) {
      return {
        clouds: "weather-background__clouds",
        rain: "weather-background__rain",
        snow: "weather-background__snow",
        thunder: "weather-background__thunder",
      }
    }

    const { weatherType, intensity, atmospheric } = context

    return {
      clouds: this.getCloudsClass(weatherType, atmospheric),
      rain: this.getRainClass(weatherType, intensity),
      snow: this.getSnowClass(weatherType, intensity),
      thunder: this.getThunderClass(weatherType, intensity),
    }
  }

  private static getCloudsClass(
    weatherType: string,
    atmospheric: { pressure: string; humidity: string; visibility: string }
  ): string {
    let className = "weather-background__clouds"

    if (atmospheric.visibility === "very-poor") {
      className += " weather-background__clouds--dense"
    }

    if (atmospheric.pressure === "low") {
      className += " weather-background__clouds--low-pressure"
    }

    return className
  }

  private static getRainClass(weatherType: string, intensity: string): string {
    let className = "weather-background__rain"

    if (intensity === "extreme") {
      className += " weather-background__rain--extreme"
    } else if (intensity === "heavy") {
      className += " weather-background__rain--heavy"
    }

    return className
  }

  private static getSnowClass(weatherType: string, intensity: string): string {
    let className = "weather-background__snow"

    if (intensity === "extreme") {
      className += " weather-background__snow--extreme"
    } else if (intensity === "heavy") {
      className += " weather-background__snow--heavy"
    }

    return className
  }

  private static getThunderClass(weatherType: string, intensity: string): string {
    let className = "weather-background__thunder"

    if (intensity === "extreme") {
      className += " weather-background__thunder--extreme"
    } else if (intensity === "heavy") {
      className += " weather-background__thunder--heavy"
    }

    return className
  }
}
