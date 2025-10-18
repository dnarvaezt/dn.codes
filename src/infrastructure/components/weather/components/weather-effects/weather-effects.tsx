"use client"

import { StarField, WeatherBackground, WeatherClouds } from "./components"
import "./weather-effects.scss"

export const WeatherEffects = () => {
  return (
    <div className={"weather-effects"}>
      <WeatherClouds />
      <StarField />
      <WeatherBackground />
    </div>
  )
}
