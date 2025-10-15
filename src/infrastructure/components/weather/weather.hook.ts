"use client"

import { useEffect } from "react"
import { useWeatherStore } from "./weather-store"

export const useWeather = () => {
  const { weather, isLoading, error, lastUpdated, fetchWeather, clearError } = useWeatherStore()

  useEffect(() => {
    const shouldFetch = !weather && !isLoading && !error
    const isStale = lastUpdated && Date.now() - lastUpdated > 600000

    if (shouldFetch || isStale) {
      fetchWeather()
    }
  }, [weather, isLoading, error, lastUpdated, fetchWeather])

  const refresh = () => {
    fetchWeather()
  }

  return {
    weather,
    isLoading,
    error,
    refresh,
    clearError,
  }
}
