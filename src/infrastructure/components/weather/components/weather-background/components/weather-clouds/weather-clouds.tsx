import { useMemo } from "react"
import { useWeatherStore } from "../../../../weather-store"
import { useWeatherBackground } from "../../weather-background.hook"
import { createStableRandom, generateWeatherSeed } from "../../weather-background.utils"
import "./weather-clouds.scss"

interface WeatherCloudsProps {
  shouldShow: boolean
  isLoading?: boolean
}

interface Cloud {
  id: number
  size: string
  width: number
  height: number
  top: number
  left: number
  animationDelay: number
  animationDuration: number
}

export const WeatherClouds = ({ shouldShow, isLoading = false }: WeatherCloudsProps) => {
  const { weather } = useWeatherStore()
  const { weatherType } = useWeatherBackground(weather)
  const getBaseCloudCount = (visibilityKm: number): number => {
    if (visibilityKm < 1) return 15 // Niebla densa
    if (visibilityKm < 3) return 12 // Niebla moderada
    if (visibilityKm < 10) return 8 // Visibilidad reducida
    if (visibilityKm < 20) return 5 // Visibilidad media
    return 3 // Base mínima
  }

  const getWeatherTypeMultiplier = (weatherType: string): number => {
    if (weatherType.includes("stormy")) return 34
    if (weatherType.includes("heavy-rain") || weatherType.includes("heavy-snow")) return 21
    if (weatherType.includes("rainy") || weatherType.includes("snowy")) return 14
    if (weatherType.includes("overcast") || weatherType.includes("cloudy")) return 8
    if (weatherType.includes("partly-cloudy")) return 5
    if (weatherType.includes("fog")) return 3
    return 3
  }

  const getCloudSize = (sizeRandom: number, random: any) => {
    if (sizeRandom >= 0.8) {
      return {
        size: "large" as const,
        width: random.float(120, 160),
        height: random.float(40, 60),
      }
    }
    if (sizeRandom >= 0.4) {
      return {
        size: "medium" as const,
        width: random.float(70, 120),
        height: random.float(25, 45),
      }
    }
    return {
      size: "small" as const,
      width: random.float(40, 80),
      height: random.float(15, 30),
    }
  }

  const clouds = useMemo((): Cloud[] => {
    if (!shouldShow) return []

    // Durante la carga, mostrar nubes básicas con animación
    if (isLoading) {
      const cloudsArray: Cloud[] = []
      const seed = generateWeatherSeed(null, "loading")

      // Generar 6-8 nubes básicas para la carga
      for (let i = 0; i < 7; i++) {
        const random = createStableRandom(seed, i)
        const sizeData = getCloudSize(random.random(), random)

        cloudsArray.push({
          id: i,
          ...sizeData,
          top: random.float(5, 50),
          left: random.float(-300, -100), // Mayor rango de posiciones iniciales
          animationDelay: random.float(0, 40), // Delays mucho más variados (0-40s)
          animationDuration: 25 + random.float(-8, 8), // Duración más variada
        })
      }
      return cloudsArray
    }

    // Lógica normal cuando no está cargando
    const visibility = weather?.visibility || 10000
    const cloudCoverage = weather?.clouds.all || 0

    const visibilityKm = visibility / 1000
    const baseCloudCount = getBaseCloudCount(visibilityKm)
    const coverageMultiplier = Math.max(0.5, cloudCoverage / 50)
    let cloudCount = Math.floor(baseCloudCount * coverageMultiplier)

    const weatherMultiplier = getWeatherTypeMultiplier(weatherType)
    cloudCount = Math.max(cloudCount, weatherMultiplier)
    cloudCount = Math.min(cloudCount, 20)

    const windSpeed = weather?.wind.speed || 0
    const windMultiplier = Math.max(0.3, Math.min(4, windSpeed / 3))
    const animationDuration = 30 / windMultiplier

    const cloudsArray: Cloud[] = []
    const seed = generateWeatherSeed(weather, weatherType)

    for (let i = 0; i < cloudCount; i++) {
      const random = createStableRandom(seed, i)
      const sizeData = getCloudSize(random.random(), random)

      cloudsArray.push({
        id: i,
        ...sizeData,
        top: random.float(5, 50),
        left: random.float(-400, -100), // Posiciones iniciales más dispersas
        animationDelay: random.float(0, 60), // Delays mucho más variados (0-60s)
        animationDuration: animationDuration + random.float(-15, 15), // Mayor variación en duración
      })
    }
    return cloudsArray
  }, [weather, weatherType, shouldShow, isLoading])

  if (!shouldShow) return null

  return (
    <div
      className={`weather-background__clouds ${isLoading ? "weather-background__clouds--loading" : ""}`}
    >
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className={`weather-background__cloud weather-background__cloud--${cloud.size} ${isLoading ? "weather-background__cloud--loading" : ""}`}
          style={{
            top: `${cloud.top}%`,
            left: `${cloud.left}px`,
            width: `${cloud.width}px`,
            height: `${cloud.height}px`,
            animationDelay: `${cloud.animationDelay}s`,
            animationDuration: `${cloud.animationDuration}s`,
          }}
        />
      ))}
    </div>
  )
}
