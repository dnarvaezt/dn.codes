import { useMemo } from "react"
import { useWeatherStore } from "../../../../weather-store"
import { useWeatherBackground } from "../../weather-background.hook"
import { createStableRandom, generateWeatherSeed } from "../../weather-background.utils"
import "./weather-snow.scss"

interface WeatherSnowProps {
  shouldShow: boolean
}

interface Snowflake {
  id: number
  left: number
  animationDelay: number
  animationDuration: number
}

export const WeatherSnow = ({ shouldShow }: WeatherSnowProps) => {
  const { weather } = useWeatherStore()
  const { weatherType } = useWeatherBackground(weather)
  const snowflakes = useMemo((): Snowflake[] => {
    if (!shouldShow) return []

    // Usar datos reales de nieve de la API
    const snowVolume1h = weather?.snow?.oneHour || 0
    const snowVolume3h = weather?.snow?.threeHours || 0
    const actualSnowVolume = Math.max(snowVolume1h, snowVolume3h / 3) // Usar el mayor entre 1h o promedio de 3h

    // Calcular intensidad basada en volumen real de nieve (mm/h)
    let snowIntensity = 15 // Base mínima

    if (actualSnowVolume > 0) {
      // Escalar intensidad según volumen real (la nieve es más lenta que la lluvia)
      snowIntensity = Math.min(60, Math.max(15, actualSnowVolume * 5)) // 5 copos por mm/h, máximo 60
    } else if (weatherType.includes("heavy-snow")) {
      snowIntensity = 50
    } else if (weatherType.includes("snow")) {
      snowIntensity = 35
    }

    // Calcular velocidad de caída basada en intensidad (más lenta que la lluvia)
    const baseDuration = 3.0 // Duración base más lenta para nieve
    const speedMultiplier = Math.max(0.5, Math.min(1.5, actualSnowVolume / 3)) // Más lento que la lluvia
    const animationDuration = baseDuration / speedMultiplier

    const snowflakesArray: Snowflake[] = []
    const seed = generateWeatherSeed(weather, weatherType)

    for (let i = 0; i < snowIntensity; i++) {
      const random = createStableRandom(seed, i)
      snowflakesArray.push({
        id: i,
        left: random.float(0, 100),
        animationDelay: random.float(0, 3),
        animationDuration: animationDuration + random.float(-0.5, 0.5), // Variación ±0.5s
      })
    }
    return snowflakesArray
  }, [weather, weatherType, shouldShow])

  if (!shouldShow) return null

  return (
    <div className="weather-background__snow">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="weather-background__snowflake"
          style={{
            left: `${flake.left}%`,
            animationDelay: `${flake.animationDelay}s`,
            animationDuration: `${flake.animationDuration}s`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  )
}
