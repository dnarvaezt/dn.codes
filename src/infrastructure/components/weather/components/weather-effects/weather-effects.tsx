"use client"

import { LightningEffect, StarField, WeatherBackground, WeatherClouds } from "./components"
import "./weather-effects.scss"

export const WeatherEffects = () => {
  return (
    <div className={"weather-effects"}>
      <WeatherClouds />
      <LightningEffect />
      <StarField />
      <WeatherBackground />
    </div>
  )
}
