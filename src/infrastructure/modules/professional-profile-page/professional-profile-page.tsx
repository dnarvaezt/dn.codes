"use client"

import {
  StaticLayout,
  useLocationStore,
  useWeatherStore,
  WeatherEffects,
} from "@/infrastructure/components"
import { WeatherWidget } from "@/infrastructure/components/weather/components/weather-widget/weather-widget"
import { useEffect } from "react"
import { useProfessionalProfilePage } from "./professional-profile-page.hook"
import "./professional-profile-page.scss"

export const ProfessionalProfilePage = () => {
  useProfessionalProfilePage()

  const { loadUserCity, city } = useLocationStore()
  const { loadWeather } = useWeatherStore()

  useEffect(() => {
    loadUserCity()
  }, [loadUserCity])

  useEffect(() => {
    if (city) {
      const { latitude, longitude } = city.coordinates
      loadWeather({
        latitude,
        longitude,
      })
    }
  }, [city, loadWeather])

  return (
    <StaticLayout>
      <div className="professional-profile-page">
        <WeatherWidget />
      </div>
      <WeatherEffects />
    </StaticLayout>
  )
}
