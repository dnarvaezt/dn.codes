/**
 * Hook personalizado para centralizar la lógica común de efectos meteorológicos
 */

import { useMemo } from "react"
import { useWeatherStore } from "../../../weather-store"
import { generateWeatherSeed, IntensityCalculator, ParticleGenerator } from "../utils"
import { useWeatherBackgroundStore } from "../weather-background.store"

import type { BaseParticle } from "../utils"

/**
 * Configuración para efectos meteorológicos
 */
interface WeatherEffectConfig<T extends BaseParticle> {
  shouldShow: boolean
  intensityCalculator: IntensityCalculator
  particleGenerator: ParticleGenerator
  generateParticlesFn: (
    weather: {
      main: { temp: number; humidity: number; pressure: number }
      clouds: { all: number }
      wind?: { speed: number; deg: number }
    } | null,
    weatherType: string,
    intensity: number
  ) => T[]
  loadingParticleCount?: number
}

/**
 * Hook que centraliza la lógica común de los componentes de efectos meteorológicos
 */
export const useWeatherEffect = <T extends BaseParticle>({
  shouldShow,
  intensityCalculator,
  particleGenerator: _particleGenerator,
  generateParticlesFn,
  loadingParticleCount = 7,
}: WeatherEffectConfig<T>) => {
  const { weather, isLoading } = useWeatherStore()
  const { weatherType } = useWeatherBackgroundStore()

  // Generar semillas
  const seedLoading = useMemo(() => generateWeatherSeed(null, "loading"), [])
  const seedNormal = useMemo(
    () => generateWeatherSeed(weather, weatherType),
    [weather, weatherType]
  )

  // Calcular partículas
  const particles = useMemo((): T[] => {
    if (!shouldShow) return []

    if (isLoading) {
      // Durante loading, generar partículas básicas con valores estables
      return Array.from({ length: loadingParticleCount }, (_, i) => {
        // Usar el índice como base para generar valores pseudoaleatorios estables
        const seed = i * 12345 + 67890
        const stableRandom = (seed: number) => {
          const x = Math.sin(seed) * 10000
          return x - Math.floor(x)
        }

        return {
          id: i,
          left: stableRandom(seed) * 100,
          top: stableRandom(seed + 1) * 100,
          animationDelay: stableRandom(seed + 2) * 5,
          animationDuration: 20 + stableRandom(seed + 3) * 10,
        } as T
      })
    }

    if (!weather) {
      return []
    }

    const intensity = intensityCalculator.calculate(weather, weatherType)
    return generateParticlesFn(weather, weatherType, intensity)
  }, [
    shouldShow,
    isLoading,
    loadingParticleCount,
    intensityCalculator,
    generateParticlesFn,
    weather,
    weatherType,
  ])

  return {
    weather,
    weatherType,
    isLoading,
    shouldShow,
    particles,
    seedLoading,
    seedNormal,
  }
}
