"use client"

import { CitySearchService, createCitySearchRepository } from "@/application/domain/city-search"
import { createGeocodingRepository, GeocodingService } from "@/application/domain/geocoding"
import { createGeolocationRepository, GeolocationService } from "@/application/domain/geolocation"
import { createLanguageRepository, LanguageService } from "@/application/domain/language"
import { createTimezoneRepository, TimezoneService } from "@/application/domain/timezone"
import { createWeatherRepository, WeatherService } from "@/application/domain/weather"
import { useUserContextStore } from "@/infrastructure/modules/user-context/user-context-store"
import { ThemeProvider } from "next-themes"
import { useEffect } from "react"

const UserContextInitializer = ({ children }: { children: React.ReactNode }) => {
  const initializeServices = useUserContextStore((state) => state.initializeServices)
  const initialize = useUserContextStore((state) => state.initialize)
  const setPartialInitialization = useUserContextStore((state) => state.setPartialInitialization)

  useEffect(() => {
    const geoapifyApiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY

    if (!geoapifyApiKey) {
      setPartialInitialization()
      return
    }

    try {
      const geolocationService = new GeolocationService(createGeolocationRepository())
      const geocodingService = new GeocodingService(createGeocodingRepository())
      const citySearchService = new CitySearchService(createCitySearchRepository(geoapifyApiKey))
      const timezoneService = new TimezoneService(createTimezoneRepository())
      const languageService = new LanguageService(createLanguageRepository())

      const weatherApiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY
      const weatherService = weatherApiKey
        ? new WeatherService(createWeatherRepository(weatherApiKey))
        : undefined

      initializeServices({
        geolocation: geolocationService,
        geocoding: geocodingService,
        citySearch: citySearchService,
        timezone: timezoneService,
        language: languageService,
        weather: weatherService,
      })

      initialize({ enableGeolocation: true, timeout: 10000 }).catch(() => {
        // Error handled by store
      })
    } catch {
      setPartialInitialization()
    }
  }, [initializeServices, initialize, setPartialInitialization])

  return <>{children}</>
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <UserContextInitializer>{children}</UserContextInitializer>
    </ThemeProvider>
  )
}
