"use client"

import { WeatherBackground } from "./components/weather-background"
import "./weather-effects.scss"

export const WeatherEffects = () => {
  return (
    <div className={"weather-effects"}>
      <WeatherBackground />
    </div>
  )
}
