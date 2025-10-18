import { Condition, TimeOfDay } from "@/application/domain/weather/weather.enum"
import { useWeatherStore } from "@/infrastructure/components/weather/weather-store"
import "./star-field.scss"

export const StarField = () => {
  const { weather } = useWeatherStore()

  // Las estrellas aparecen durante la noche con diferentes condiciones de cielo
  const isNightTime =
    weather &&
    (weather.scenario.timeOfDay === TimeOfDay.Night ||
      weather.scenario.timeOfDay === TimeOfDay.Midnight ||
      weather.scenario.timeOfDay === TimeOfDay.Dusk)

  const hasVisibleStars =
    weather &&
    (weather.scenario.condition === Condition.Clear ||
      weather.scenario.condition === Condition.Sunny ||
      weather.scenario.condition === Condition.PartlyCloudy ||
      weather.scenario.condition === Condition.Windy ||
      weather.scenario.condition === Condition.Dry)

  // Determinar la intensidad de las estrellas según las condiciones
  const getStarIntensity = () => {
    if (!weather) return "none"

    switch (weather.scenario.condition) {
      case Condition.Clear:
      case Condition.Sunny:
        return "bright"
      case Condition.PartlyCloudy:
        return "medium"
      case Condition.Windy:
      case Condition.Dry:
        return "dim"
      default:
        return "none"
    }
  }

  if (!isNightTime || !hasVisibleStars) {
    return null
  }

  const starIntensity = getStarIntensity()

  return <div className={`star-field star-field--${starIntensity}`}></div>
}
