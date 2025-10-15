"use client"

import { useEffect, useState } from "react"
import { useWeatherStore } from "../../../../weather-store"
import { createStableRandom, generateWeatherSeed } from "../../utils"
import { useWeatherBackgroundStore } from "../../weather-background.store"
import "./weather-thunder.scss"

// Funciones auxiliares para calcular intensidad de tormenta
const calculateStormIntensity = (
  windSpeed: number,
  windGust: number,
  pressure: number,
  humidity: number,
  description: string
): number => {
  let intensity = 1 // Base mínima

  // Tormenta severa: viento fuerte + presión baja + alta humedad
  if (windGust > 15 || pressure < 1000 || humidity > 80) {
    intensity = 3
  }
  // Tormenta moderada: condiciones intermedias
  else if (windSpeed > 8 || pressure < 1010 || humidity > 70) {
    intensity = 2
  }

  // Ajustar según descripción específica
  if (description.includes("heavy") || description.includes("severe")) {
    intensity = Math.max(intensity, 3)
  } else if (description.includes("moderate")) {
    intensity = Math.max(intensity, 2)
  }

  return intensity
}

const getThunderParameters = (stormIntensity: number) => {
  const params = {
    baseDelay: 5,
    delayVariation: 4,
    baseDuration: 0.1,
    durationVariation: 0.05,
  }

  if (stormIntensity === 3) {
    params.baseDelay = 1.5
    params.delayVariation = 2
    params.baseDuration = 0.2
    params.durationVariation = 0.15
  } else if (stormIntensity === 2) {
    params.baseDelay = 3
    params.delayVariation = 3
    params.baseDuration = 0.15
    params.durationVariation = 0.1
  }

  return params
}

export const WeatherThunder = () => {
  const { weather } = useWeatherStore()
  const { weatherType, shouldShowThunder } = useWeatherBackgroundStore()
  const [isFlashing, setIsFlashing] = useState(false)

  useEffect(() => {
    if (!shouldShowThunder || !weather) return

    const mainWeather = weather.weather[0]?.main.toLowerCase()
    const description = weather.weather[0]?.description.toLowerCase()

    // Solo activar para tormentas eléctricas reales
    if (mainWeather !== "thunderstorm") return

    const seed = generateWeatherSeed(weather, weatherType)
    const random = createStableRandom(seed, 0)

    // Calcular intensidad de truenos basada en condiciones meteorológicas reales
    const windSpeed = weather.wind.speed || 0
    const windGust = weather.wind.gust || windSpeed
    const pressure = weather.main.pressure || 1013
    const humidity = weather.main.humidity || 50

    // Determinar intensidad de la tormenta
    const stormIntensity = calculateStormIntensity(
      windSpeed,
      windGust,
      pressure,
      humidity,
      description
    )

    // Calcular parámetros de truenos basados en intensidad
    const thunderParams = getThunderParameters(stormIntensity)

    let timeoutId: NodeJS.Timeout

    const flashThunder = () => {
      setIsFlashing(true)
      const duration =
        thunderParams.baseDuration +
        random.float(-thunderParams.durationVariation, thunderParams.durationVariation)
      setTimeout(() => setIsFlashing(false), duration * 1000)
    }

    const scheduleNextFlash = () => {
      const delay = (thunderParams.baseDelay + random.float(0, thunderParams.delayVariation)) * 1000
      timeoutId = setTimeout(() => {
        flashThunder()
        if (shouldShowThunder) {
          scheduleNextFlash()
        }
      }, delay)
    }

    scheduleNextFlash()

    return () => {
      clearTimeout(timeoutId)
      setIsFlashing(false)
    }
  }, [weather, weatherType, shouldShowThunder])

  if (!shouldShowThunder) return null

  return (
    <div
      className={`weather-background__thunder ${isFlashing ? "weather-background__thunder--flashing" : ""}`}
    >
      {isFlashing && <div className="weather-background__thunder-flash" />}
    </div>
  )
}
