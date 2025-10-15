import { useMemo } from "react"
import { useWeatherStore } from "../../../../weather-store"
import {
  calculateAtmosphericIntensity,
  calculateAtmosphericOpacity,
  createValidatedParticle,
  generateStableArray,
  generateWeatherSeed,
  validateParticleCount,
  validateWeatherData,
} from "../../utils"
import { useWeatherBackgroundStore } from "../../weather-background.store"
import "./weather-particles.scss"

import type { AtmosphericParticle } from "../../utils"
// Usar la interfaz centralizada con animationDuration
type Particle = AtmosphericParticle & { size: string }

export const WeatherParticles = () => {
  const { weather } = useWeatherStore()
  const { weatherType } = useWeatherBackgroundStore()

  const particles = useMemo((): Particle[] => {
    // No generar partículas si no hay datos del clima
    if (!weather || !weatherType) return []

    // Validar datos del clima usando utilidades centralizadas
    const weatherData = validateWeatherData(weather)

    // Calcular intensidad usando utilidad centralizada
    const particleCount = calculateAtmosphericIntensity(weatherData.visibility, weatherType)
    const validParticleCount = validateParticleCount(particleCount, 0, 25, 8)

    // Calcular opacidad usando utilidad centralizada
    const particleOpacity = calculateAtmosphericOpacity(
      0.6,
      weatherData.humidity,
      weatherData.visibility
    )

    const seed = generateWeatherSeed(weather, weatherType)
    return generateStableArray<Particle>(seed, validParticleCount, (random, i) => {
      let size = "small"
      const sizeRandom = random.random()
      if (sizeRandom >= 0.7) size = "large"
      else if (sizeRandom >= 0.5) size = "medium"

      // Usar utilidad centralizada para crear partícula validada
      const baseParticle = createValidatedParticle(random, i, {
        leftRange: [0, 100],
        topRange: [0, 100],
        delayRange: [0, 5],
        opacityBase: particleOpacity,
        opacityVariation: 0.1,
      })

      return {
        ...baseParticle,
        size,
        animationDuration: 6, // Duración fija para partículas atmosféricas
      }
    })
  }, [weather, weatherType])

  // No renderizar si no hay partículas
  if (particles.length === 0) return null

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
