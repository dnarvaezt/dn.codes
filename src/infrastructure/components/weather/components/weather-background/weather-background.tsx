"use client"

import { useEffect } from "react"
import { useWeatherStore } from "../../weather-store"
import {
  WeatherClouds,
  WeatherParticles,
  WeatherRain,
  WeatherSnow,
  WeatherThunder,
} from "./components"
import { WeatherClassGenerator } from "./utils"
import "./weather-background.scss"
import { useWeatherBackgroundStore } from "./weather-background.store"

export const WeatherBackground = () => {
  const { weather, isLoading } = useWeatherStore()
  const { weatherContext, computeFromWeather } = useWeatherBackgroundStore()

  useEffect(() => {
    computeFromWeather(weather)
  }, [weather, computeFromWeather])

  // Generar clases CSS precisas basadas en el contexto meteorológico completo
  const backgroundClass = isLoading
    ? "weather-background weather-background--loading"
    : WeatherClassGenerator.generateClasses(weatherContext)

  return (
    <div className={backgroundClass}>
      <div className="weather-background__gradient" />

      <WeatherClouds />

      {!isLoading && (
        <>
          <WeatherParticles />

          <WeatherRain />

          <WeatherSnow />

          <WeatherThunder />
        </>
      )}
    </div>
  )
}
