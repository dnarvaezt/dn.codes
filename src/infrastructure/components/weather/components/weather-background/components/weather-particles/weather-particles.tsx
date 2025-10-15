import { useMemo } from "react"
import { useWeatherStore } from "../../../../weather-store"
import { useWeatherBackground } from "../../weather-background.hook"
import { createStableRandom, generateWeatherSeed } from "../../weather-background.utils"
import "./weather-particles.scss"

interface Particle {
  id: number
  size: string
  left: number
  top: number
  animationDelay: number
  opacity: number
}

export const WeatherParticles = () => {
  const { weather } = useWeatherStore()
  const { weatherType } = useWeatherBackground(weather)
  const particles = useMemo((): Particle[] => {
    // Usar datos reales de visibilidad y humedad
    const visibility = weather?.visibility || 10000 // En metros, default 10km
    const humidity = weather?.main.humidity || 50 // Porcentaje de humedad

    // Calcular cantidad de partículas basada en visibilidad (menos visibilidad = más partículas)
    const visibilityKm = visibility / 1000
    let particleCount = 8 // Visibilidad normal

    // Ajustar según visibilidad (partículas atmosféricas)
    if (visibilityKm < 1)
      particleCount = 25 // Niebla densa
    else if (visibilityKm < 3)
      particleCount = 20 // Niebla moderada
    else if (visibilityKm < 10) particleCount = 15 // Visibilidad reducida

    // Ajustar según tipo de clima
    if (weatherType.includes("sunny") || weatherType.includes("clear"))
      particleCount = Math.max(particleCount, 20)
    else if (weatherType.includes("stormy")) particleCount = Math.max(particleCount, 6)
    else if (weatherType.includes("rain")) particleCount = Math.max(particleCount, 8)
    else if (weatherType.includes("snow")) particleCount = Math.max(particleCount, 10)
    else if (weatherType.includes("fog")) particleCount = Math.max(particleCount, 15)
    else if (weatherType.includes("windy")) particleCount = Math.max(particleCount, 15)

    // Calcular opacidad basada en humedad y visibilidad
    const baseOpacity = 0.6
    const humidityFactor = humidity / 100 // 0 a 1
    const visibilityFactor = Math.max(0.3, visibilityKm / 10) // 0.3 a 1
    const particleOpacity = baseOpacity * humidityFactor * visibilityFactor

    const particlesArray: Particle[] = []
    const seed = generateWeatherSeed(weather, weatherType)

    for (let i = 0; i < particleCount; i++) {
      const random = createStableRandom(seed, i)
      let size = "small"
      const sizeRandom = random.random()
      if (sizeRandom >= 0.7) size = "large"
      else if (sizeRandom >= 0.5) size = "medium"

      particlesArray.push({
        id: i,
        size,
        left: random.float(0, 100),
        top: random.float(0, 100),
        animationDelay: random.float(0, 5),
        opacity: particleOpacity + random.float(-0.1, 0.1), // Variación ±0.1
      })
    }
    return particlesArray
  }, [weather, weatherType])

  return (
    <div className="weather-background__particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`weather-background__particle weather-background__particle--${particle.size}`}
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            animationDelay: `${particle.animationDelay}s`,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  )
}
