"use client"

import { useWeatherStore } from "../../weather-store"
import {
  WeatherClouds,
  WeatherParticles,
  WeatherRain,
  WeatherSnow,
  WeatherThunder,
} from "./components"
import { useWeatherBackground } from "./weather-background.hook"
import "./weather-background.scss"

export const WeatherBackground = () => {
  const { weather, isLoading } = useWeatherStore()

  const { weatherType, shouldShowRain, shouldShowSnow, shouldShowClouds, shouldShowThunder } =
    useWeatherBackground(weather)

  // Durante la carga inicial, usar un estado de transición suave
  const backgroundClass = isLoading
    ? "weather-background weather-background--loading"
    : `weather-background weather-background--${weatherType}`

  return (
    <div className={backgroundClass}>
      <div className="weather-background__gradient" />

      <WeatherClouds shouldShow={shouldShowClouds} isLoading={isLoading} />

      {!isLoading && (
        <>
          <WeatherParticles />

          <WeatherRain shouldShow={shouldShowRain} />

          <WeatherSnow shouldShow={shouldShowSnow} />

          <WeatherThunder shouldShow={shouldShowThunder} />
        </>
      )}
    </div>
  )
}
