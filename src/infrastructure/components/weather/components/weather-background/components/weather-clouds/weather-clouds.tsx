import { useMemo } from "react"
import { useWeatherStore } from "../../../../weather-store"
import { useWeatherBackground } from "../../weather-background.hook"
import { createStableRandom, generateWeatherSeed } from "../../weather-background.utils"
import { Cloud } from "./components"
import "./weather-clouds.scss"

interface WeatherCloudsProps {
  shouldShow: boolean
  isLoading?: boolean
}

interface CloudItem {
  id: number
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

  type StableRandom = {
    random: () => number
    float: (min: number, max: number) => number
  }

  const computeFinalCloudCount = (
    visibility: number | undefined,
    cloudCoverage: number | undefined,
    currentWeatherType: string
  ): number => {
    const visibilityKm = (visibility ?? 10000) / 1000
    const baseCloudCount = getBaseCloudCount(visibilityKm)
    const coverageMultiplier = Math.max(0.5, (cloudCoverage ?? 0) / 50)
    let cloudCount = Math.floor(baseCloudCount * coverageMultiplier)

    const weatherMultiplier = getWeatherTypeMultiplier(currentWeatherType)
    cloudCount = Math.max(cloudCount, weatherMultiplier)
    cloudCount = Math.min(cloudCount, 20)
    return cloudCount
  }

  type CloudParams = {
    topMin: number
    topMax: number
    leftMin: number
    leftMax: number
    delayMin: number
    delayMax: number
    durationBase: number
    durationVariance: number
  }

  const createCloud = (idx: number, seed: number, params: CloudParams): CloudItem => {
    const random = createStableRandom(seed, idx) as StableRandom
    return {
      id: idx,
      top: random.float(params.topMin, params.topMax),
      left: random.float(params.leftMin, params.leftMax),
      animationDelay: random.float(params.delayMin, params.delayMax),
      animationDuration:
        params.durationBase + random.float(-params.durationVariance, params.durationVariance),
    }
  }

  const generateClouds = (seed: number, count: number, params: CloudParams): CloudItem[] => {
    const cloudsArray: CloudItem[] = []
    for (let i = 0; i < count; i++) {
      cloudsArray.push(createCloud(i, seed, params))
    }
    return cloudsArray
  }

  const seedLoading = generateWeatherSeed(null, "loading")
  const seedNormal = generateWeatherSeed(weather, weatherType)

  const clouds = useMemo((): CloudItem[] => {
    if (!shouldShow) return []

    // Durante la carga, generar con parámetros específicos
    if (isLoading) {
      return generateClouds(seedLoading, 7, {
        topMin: 5,
        topMax: 50,
        leftMin: -300,
        leftMax: -100,
        delayMin: 0,
        delayMax: 40,
        durationBase: 25,
        durationVariance: 8,
      })
    }

    // Lógica normal cuando no está cargando
    const cloudCount = computeFinalCloudCount(weather?.visibility, weather?.clouds.all, weatherType)

    const windSpeed = weather?.wind.speed || 0
    const windMultiplier = Math.max(0.3, Math.min(4, windSpeed / 3))
    const durationBase = 30 / windMultiplier

    return generateClouds(seedNormal, cloudCount, {
      topMin: 5,
      topMax: 50,
      leftMin: -400,
      leftMax: -100,
      delayMin: 0,
      delayMax: 60,
      durationBase,
      durationVariance: 15,
    })
  }, [weather, weatherType, shouldShow, isLoading, seedLoading, seedNormal])

  if (!shouldShow) return null

  return (
    <div
      className={`weather-background__clouds ${isLoading ? "weather-background__clouds--loading" : ""}`}
    >
      {clouds.map((cloud) => (
        <Cloud
          key={cloud.id}
          seed={isLoading ? seedLoading : seedNormal}
          index={cloud.id}
          isLoading={isLoading}
          style={{
            top: `${cloud.top}%`,
            left: `${cloud.left}px`,
            animationDelay: `${cloud.animationDelay}s`,
            animationDuration: `${cloud.animationDuration}s`,
          }}
        />
      ))}
    </div>
  )
}
