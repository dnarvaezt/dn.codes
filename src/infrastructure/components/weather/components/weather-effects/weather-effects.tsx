"use client"

import {
  LightningEffect,
  RainEffect,
  StarField,
  WeatherBackground,
  WeatherClouds,
} from "./components"
import "./weather-effects.scss"

export const WeatherEffects = () => {
  return (
    <div className={"weather-effects"}>
      <RainEffect />
      <WeatherClouds />
      <LightningEffect />
      <StarField />
      <WeatherBackground />
    </div>
  )
}
