import { Condition, Season, TimeOfDay } from "@/application/domain/weather/weather.enum"
import { useWeatherStore } from "@/infrastructure/components/weather/weather-store"
import "./star-field.scss"

export const StarField = () => {
  const { weather } = useWeatherStore()

  // Determinar la intensidad de las estrellas según condiciones y hora
  type StarIntensity = "bright" | "medium" | "dim" | "sparse" | "none"

  const getStarIntensity = (): StarIntensity => {
    if (!weather) return "none"

    const { condition, timeOfDay, season } = weather.scenario

    // Map base por condición atmosférica
    let base: StarIntensity
    switch (condition) {
      case Condition.Clear:
      case Condition.Sunny:
        base = "bright"
        break
      case Condition.PartlyCloudy:
        base = "medium"
        break
      case Condition.Windy:
      case Condition.Dry:
      case Condition.Humid:
      case Condition.Hot:
      case Condition.Cold:
        base = "dim"
        break
      case Condition.Cloudy:
      case Condition.Rainy:
      case Condition.Snowy:
      case Condition.Foggy:
        // Muy nublado/lluvioso/niebla: aún podrían verse unas pocas
        base = "sparse"
        break
      case Condition.Stormy:
      case Condition.Hailing:
      case Condition.Rainbow:
      default:
        base = "none"
        break
    }

    // Ajuste por hora de la noche
    const promote = (v: StarIntensity): StarIntensity => {
      if (v === "none") return "none"
      if (v === "sparse") return "dim"
      if (v === "dim") return "medium"
      return "bright" // medium -> bright, bright stays bright
    }
    const demote = (v: StarIntensity): StarIntensity => {
      if (v === "bright") return "medium"
      if (v === "medium") return "dim"
      if (v === "dim") return "sparse"
      if (v === "sparse") return "sparse"
      return "none"
    }

    let byTime: StarIntensity
    if (timeOfDay === TimeOfDay.Midnight) {
      byTime = base === "none" ? "none" : promote(base)
    } else if (timeOfDay === TimeOfDay.Dusk) {
      byTime = base === "none" ? "none" : demote(base)
    } else if (timeOfDay === TimeOfDay.Night) {
      byTime = base
    } else {
      // Fuera de noche/anochecer no mostramos estrellas
      return "none"
    }

    if (byTime === "none") return "none"

    // Ajuste por fase lunar simulada (basada en día juliano aprox)
    const secondsPerDay = 86400
    const lunarCycleDays = 29.53
    const dayNumber = Math.floor(weather.metrics.dt / secondsPerDay)
    const phase = (dayNumber % lunarCycleDays) / lunarCycleDays // 0..1 (0 nueva, ~0.5 llena)
    let byMoon: StarIntensity = byTime
    if (phase < 0.33) {
      byMoon = promote(byMoon) // luna nueva: cielo más oscuro, más estrellas
    } else if (phase > 0.66) {
      byMoon = demote(byMoon) // luna llena: cielo más brillante, menos visibles
    }

    // Ajuste por estación
    let bySeason: StarIntensity = byMoon
    if (season === Season.Winter) bySeason = promote(bySeason)
    if (season === Season.Summer) bySeason = demote(bySeason)

    return bySeason
  }

  const starIntensity = getStarIntensity()
  if (starIntensity === "none") return null

  const modifiers: string[] = []
  if (weather) {
    modifiers.push(`star-field--${weather.scenario.season}`)
    if (weather.scenario.condition === Condition.Humid) modifiers.push("star-field--humid")
    if (weather.scenario.condition === Condition.Windy) modifiers.push("star-field--windy")
    const clouds = weather.metrics.clouds?.all ?? 0
    if (clouds >= 20 && clouds < 40) modifiers.push("star-field--clouds-20")
    else if (clouds >= 40 && clouds < 60) modifiers.push("star-field--clouds-40")
    else if (clouds >= 60 && clouds < 80) modifiers.push("star-field--clouds-60")
    else if (clouds >= 80) modifiers.push("star-field--clouds-80")
  }
  return (
    <div className={["star-field", `star-field--${starIntensity}`, ...modifiers].join(" ")}></div>
  )
}
