"use client"

import { useWeatherStore } from "../../weather-store"
import "./weather-widget.scss"

export const WeatherWidget = () => {
  const { weather } = useWeatherStore()

  const renderLocation = () => {
    return (
      <div className="weather-widget__location">
        <h3>{weather?.metrics.cityName}</h3>
      </div>
    )
  }

  return (
    <div className="weather-widget">
      <div className="weather-widget__container">{renderLocation()}</div>
    </div>
  )
}
