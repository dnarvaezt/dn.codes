import type { WeatherInfo } from "@/application/domain/weather"
import { calculateVisibilityBasedIntensity } from "./data-validators"

export interface IntensityCalculator {
  calculate(weather: WeatherInfo | null, weatherType: string): number
}

export class CloudIntensityCalculator implements IntensityCalculator {
  calculate(weather: WeatherInfo | null, weatherType: string): number {
    if (!weather) return 3

    // Usar utilidad centralizada para cálculo base
    const baseIntensity = calculateVisibilityBasedIntensity(
      weather.visibility ?? 10000,
      weatherType,
      {
        baseIntensity: 8,
        maxIntensity: 35,
        visibilityThresholds: [
          { threshold: 1, intensity: 25 }, // Niebla densa
          { threshold: 3, intensity: 20 }, // Niebla moderada
          { threshold: 10, intensity: 15 }, // Visibilidad reducida
          { threshold: 20, intensity: 12 }, // Visibilidad media
        ],
        weatherTypeMultipliers: [
          { pattern: "stormy", multiplier: 45 },
          { pattern: "heavy-rain", multiplier: 35 },
          { pattern: "heavy-snow", multiplier: 35 },
          { pattern: "rainy", multiplier: 25 },
          { pattern: "snowy", multiplier: 25 },
          { pattern: "overcast", multiplier: 15 },
          { pattern: "cloudy", multiplier: 15 },
          { pattern: "partly-cloudy", multiplier: 10 },
          { pattern: "fog", multiplier: 8 },
        ],
      }
    )

    // Ajustar por cobertura de nubes
    const coverageMultiplier = Math.max(0.5, (weather.clouds.all ?? 0) / 50)
    return Math.floor(baseIntensity * coverageMultiplier)
  }
}

export class RainIntensityCalculator implements IntensityCalculator {
  calculate(weather: WeatherInfo | null, weatherType: string): number {
    if (!weather) return 20

    const rainVolume1h = weather.rain?.oneHour || 0
    const rainVolume3h = weather.rain?.threeHours || 0
    const actualRainVolume = Math.max(rainVolume1h, rainVolume3h / 3)

    if (actualRainVolume > 0) {
      return Math.min(100, Math.max(20, actualRainVolume * 8))
    }

    if (weatherType.includes("heavy-rain")) return 80
    if (weatherType.includes("stormy")) return 60
    if (weatherType.includes("rain")) return 40
    if (weatherType.includes("drizzle")) return 20
    return 20
  }
}

export class SnowIntensityCalculator implements IntensityCalculator {
  calculate(weather: WeatherInfo | null, weatherType: string): number {
    if (!weather) return 15

    const snowVolume1h = weather.snow?.oneHour || 0
    const snowVolume3h = weather.snow?.threeHours || 0
    const actualSnowVolume = Math.max(snowVolume1h, snowVolume3h / 3)

    if (actualSnowVolume > 0) {
      return Math.min(60, Math.max(15, actualSnowVolume * 5))
    }

    if (weatherType.includes("heavy-snow")) return 50
    if (weatherType.includes("snow")) return 35
    return 15
  }
}
