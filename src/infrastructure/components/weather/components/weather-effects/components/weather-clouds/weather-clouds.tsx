import { Condition, TimeOfDay } from "@/application/domain/weather/weather.enum"
import { useWeatherStore } from "@/infrastructure/components/weather/weather-store"
import { WeatherCloud } from "./components"
import "./weather-clouds.scss"

export const WeatherClouds = () => {
  const { weather } = useWeatherStore()

  if (!weather) {
    return <div className={`weather-clouds`}></div>
  }

  const { metrics, scenario } = weather
  const cloudiness = Math.max(0, Math.min(100, metrics.clouds.all)) // 0..100
  const windSpeed = Math.max(0, metrics.wind.speed || 0) // m/s
  const windDeg = metrics.wind.deg ?? 0 // 0..360

  // decide direction: 90..270 -> RTL (from east to west), else LTR
  const direction = windDeg > 90 && windDeg < 270 ? "rtl" : "ltr"

  // base counts by cloudiness bands (avoid nested ternaries for readability)
  let baseCount = 1
  if (cloudiness < 15) {
    baseCount = 1
  } else if (cloudiness < 40) {
    baseCount = 3
  } else if (cloudiness < 70) {
    baseCount = 6
  } else {
    baseCount = 10
  }

  // time of day affects vertical placement and opacity
  const isNight =
    scenario.timeOfDay === TimeOfDay.Night || scenario.timeOfDay === TimeOfDay.Midnight
  const nightOpacityFactor = isNight ? 0.85 : 1

  // condition affects overall opacity and size slightly
  const conditionOpacityMap: Partial<Record<Condition, number>> = {
    [Condition.Rainy]: 0.95,
    [Condition.Stormy]: 0.98,
    [Condition.Cloudy]: 0.9,
    [Condition.PartlyCloudy]: 0.8,
    [Condition.Foggy]: 0.85,
    [Condition.Snowy]: 0.92,
  }
  const conditionOpacity = conditionOpacityMap[scenario.condition] ?? 0.75

  // wind influences speed: map 0..20+ m/s to 90..25 seconds
  const mapWindToDuration = (speed: number) => {
    if (speed <= 0.5) return 120
    if (speed >= 20) return 25
    return 120 - (speed / 20) * (120 - 25)
  }

  // Generate layers with parallax: back(1), mid(2), front(3)
  const layers: Array<{
    layer: 1 | 2 | 3
    countFactor: number
    scaleRange: [number, number]
    topRange: [number, number]
    opacity: number
  }> = [
    { layer: 1, countFactor: 0.35, scaleRange: [0.6, 0.85], topRange: [8, 28], opacity: 0.65 },
    { layer: 2, countFactor: 0.45, scaleRange: [0.8, 1.1], topRange: [18, 48], opacity: 0.8 },
    { layer: 3, countFactor: 0.6, scaleRange: [1, 1.35], topRange: [35, 65], opacity: 0.9 },
  ]

  const clouds = layers.flatMap(({ layer, countFactor, scaleRange, topRange, opacity }) => {
    const count = Math.max(1, Math.round(baseCount * countFactor))
    return Array.from({ length: count }).map((_, i) => {
      // pseudo-random but stable per index using simple hash of inputs
      const seed = (i + 1) * (layer * 7 + Math.round(cloudiness))
      const rnd = (min: number, max: number) =>
        min + (((seed * 9301 + 49297) % 233280) / 233280) * (max - min)

      const topPercent = rnd(topRange[0], topRange[1])
      const scale = rnd(scaleRange[0], scaleRange[1])
      const jitter = rnd(0, 0.2)
      const baseOpacity = Math.min(
        1,
        Math.max(0.4, opacity * conditionOpacity * nightOpacityFactor + jitter - 0.1)
      )
      const durationSec = mapWindToDuration(windSpeed) * (1 + (3 - layer) * 0.2) // farther layers slower
      const delaySec = -rnd(0, durationSec) // negative delay to start mid-path

      return (
        <WeatherCloud
          key={`cloud-${layer}-${i}`}
          topPercent={topPercent}
          scale={scale}
          opacity={baseOpacity}
          durationSec={durationSec}
          delaySec={delaySec}
          direction={direction}
          layer={layer}
        />
      )
    })
  })

  return (
    <div className={`weather-clouds`}>
      <div className="weather-clouds__container">{clouds}</div>
    </div>
  )
}
