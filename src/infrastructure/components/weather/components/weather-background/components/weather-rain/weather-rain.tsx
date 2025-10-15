import { useMemo } from "react"
import { useWeatherStore } from "../../../../weather-store"
import { useWeatherBackground } from "../../weather-background.hook"
import { createStableRandom, generateWeatherSeed } from "../../weather-background.utils"
import "./weather-rain.scss"

interface WeatherRainProps {
  shouldShow: boolean
}

interface Raindrop {
  id: number
  left: number
  animationDelay: number
  animationDuration: number
}

export const WeatherRain = ({ shouldShow }: WeatherRainProps) => {
  const { weather } = useWeatherStore()
  const { weatherType } = useWeatherBackground(weather)
  const raindrops = useMemo((): Raindrop[] => {
    if (!shouldShow) return []

    // Usar datos reales de lluvia de la API
    const rainVolume1h = weather?.rain?.oneHour || 0
    const rainVolume3h = weather?.rain?.threeHours || 0
    const actualRainVolume = Math.max(rainVolume1h, rainVolume3h / 3) // Usar el mayor entre 1h o promedio de 3h

    // Calcular intensidad basada en volumen real de lluvia (mm/h)
    let rainIntensity

    if (actualRainVolume > 0) {
      // Escalar intensidad según volumen real
      rainIntensity = Math.min(100, Math.max(20, actualRainVolume * 8)) // 8 gotas por mm/h, máximo 100
    } else if (weatherType.includes("heavy-rain")) {
      rainIntensity = 80
    } else if (weatherType.includes("stormy")) {
      rainIntensity = 60
    } else if (weatherType.includes("rain")) {
      rainIntensity = 40
    } else if (weatherType.includes("drizzle")) {
      rainIntensity = 20
    } else {
      rainIntensity = 20 // Base mínima
    }

    // Calcular velocidad de caída basada en intensidad
    const baseDuration = 1.0 // Duración base en segundos
    const speedMultiplier = Math.max(0.3, Math.min(2, actualRainVolume / 2)) // Más rápido con más lluvia
    const animationDuration = baseDuration / speedMultiplier

    const raindropsArray: Raindrop[] = []
    const seed = generateWeatherSeed(weather, weatherType)

    for (let i = 0; i < rainIntensity; i++) {
      const random = createStableRandom(seed, i)
      raindropsArray.push({
        id: i,
        left: random.float(0, 100),
        animationDelay: random.float(0, 2),
        animationDuration: animationDuration + random.float(-0.25, 0.25), // Variación ±0.25s
      })
    }
    return raindropsArray
  }, [weather, weatherType, shouldShow])

  if (!shouldShow) return null

  return (
    <div className="weather-background__rain">
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          className="weather-background__raindrop"
          style={{
            left: `${drop.left}%`,
            animationDelay: `${drop.animationDelay}s`,
            animationDuration: `${drop.animationDuration}s`,
          }}
        />
      ))}
    </div>
  )
}
