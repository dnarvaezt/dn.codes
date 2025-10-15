import {
  calculateWindBasedDuration,
  roundDecimals,
  validateIntensity,
  validateParticleCount,
  validateWeatherData,
} from "./data-validators"
import { generateStableArray, generateWeatherSeed, StableRandomGen } from "./random-generator"

import type {
  BaseParticle,
  CloudParticle,
  ParticleConfig,
  RainParticle,
  SnowParticle,
} from "./particle-interfaces"

// Re-exportar interfaces desde particle-interfaces
export type { ParticleConfig, BaseParticle as ParticleData }

export class ParticleGenerator {
  generateParticles<T extends BaseParticle>(
    weather: {
      main: { temp: number; humidity: number; pressure: number }
      clouds: { all: number }
      wind?: { speed: number; deg: number }
    },
    weatherType: string,
    config: ParticleConfig,
    factory: (random: StableRandomGen, i: number) => T
  ): T[] {
    const seed = generateWeatherSeed(weather, weatherType)
    return generateStableArray<T>(seed, config.count, factory)
  }
}

export class CloudParticleGenerator extends ParticleGenerator {
  generateClouds(
    weather: {
      main: { temp: number; humidity: number; pressure: number }
      clouds: { all: number }
      wind?: { speed: number; deg: number }
    } | null,
    weatherType: string,
    count: number
  ): CloudParticle[] {
    if (!weather) return []

    // Validar datos del clima y count
    const weatherData = validateWeatherData(weather)
    const validCount = validateParticleCount(count, 0, 35, 3)

    // Calcular duración base basada en viento
    const baseDuration = calculateWindBasedDuration(weatherData.windKmh, 460, 30, 1.8)
    const durationVariance = roundDecimals(baseDuration * 0.3)

    return this.generateParticles(
      weather,
      weatherType,
      { count: validCount, animationDuration: baseDuration, animationDelay: 0 },
      (random, i) => {
        const left = roundDecimals(random.scattered(-200, 200, 0.4))

        return {
          id: i,
          left,
          top: roundDecimals(random.scattered(0, 50, 0.3)),
          animationDelay: left + 100 >= 0 ? 0 : roundDecimals(random.float(0, 10)),
          animationDuration: roundDecimals(
            baseDuration + random.scattered(-durationVariance, durationVariance, 0.2)
          ),
        }
      }
    )
  }
}

export class RainParticleGenerator extends ParticleGenerator {
  generateRaindrops(
    weather: {
      main: { temp: number; humidity: number; pressure: number }
      clouds: { all: number }
      wind?: { speed: number; deg: number }
    } | null,
    weatherType: string,
    intensity: number
  ): RainParticle[] {
    if (!weather) return []

    // Validar datos del clima e intensidad
    const weatherData = validateWeatherData(weather)
    const validIntensity = validateIntensity(intensity, 0, 100, 20)

    // Calcular duración base basada en viento (lluvia más rápida que nubes)
    const baseDuration = calculateWindBasedDuration(weatherData.windKmh, 2, 0.5, 0.05)

    return this.generateParticles(
      weather,
      weatherType,
      { count: validIntensity, animationDuration: baseDuration, animationDelay: 0 },
      (random, i) => ({
        id: i,
        left: roundDecimals(random.scattered(0, 100, 0.5)),
        top: roundDecimals(random.scattered(-100, -20, 0.4)),
        animationDelay: roundDecimals(random.float(0, 2)),
        animationDuration: roundDecimals(baseDuration + random.scattered(-0.25, 0.25, 0.3)),
      })
    )
  }
}

export class SnowParticleGenerator extends ParticleGenerator {
  generateSnowflakes(
    weather: {
      main: { temp: number; humidity: number; pressure: number }
      clouds: { all: number }
      wind?: { speed: number; deg: number }
    } | null,
    weatherType: string,
    intensity: number
  ): SnowParticle[] {
    if (!weather) return []

    // Validar datos del clima e intensidad
    const weatherData = validateWeatherData(weather)
    const validIntensity = validateIntensity(intensity, 0, 60, 15)

    // Calcular duración base basada en viento (nieve más lenta que lluvia)
    const baseDuration = calculateWindBasedDuration(weatherData.windKmh, 5, 2, 0.15)

    return this.generateParticles(
      weather,
      weatherType,
      { count: validIntensity, animationDuration: baseDuration, animationDelay: 0 },
      (random, i) => ({
        id: i,
        left: roundDecimals(random.scattered(0, 100, 0.6)),
        top: roundDecimals(random.scattered(-100, -20, 0.5)),
        animationDelay: roundDecimals(random.float(0, 3)),
        animationDuration: roundDecimals(baseDuration + random.scattered(-0.5, 0.5, 0.4)),
      })
    )
  }
}
