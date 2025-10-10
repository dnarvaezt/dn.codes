"use client"

import { CitySearchProvider, createCitySearchRepository } from "@/application/domain/city-search"
import { createGeocodingRepository, GeocodingProvider } from "@/application/domain/geocoding"
import { createGeolocationRepository, GeolocationProvider } from "@/application/domain/geolocation"
import { createLanguageRepository, LanguageProvider } from "@/application/domain/language"
import { createTimezoneRepository, TimezoneProvider } from "@/application/domain/timezone"
import { createWeatherRepository, WeatherProvider } from "@/application/domain/weather"
import { useUserContextStore } from "@/infrastructure/store"
import { ThemeProvider } from "next-themes"
import { useEffect } from "react"

interface ProvidersProps {
  children: React.ReactNode
}

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
      const geolocationRepository = createGeolocationRepository()
      const geocodingRepository = createGeocodingRepository()
      const citySearchRepository = createCitySearchRepository(geoapifyApiKey)
      const timezoneRepository = createTimezoneRepository()
      const languageRepository = createLanguageRepository()

      const geolocationService = GeolocationProvider.initializeService(geolocationRepository)
      const geocodingService = GeocodingProvider.initializeService(geocodingRepository)
      const citySearchService = CitySearchProvider.initializeService(citySearchRepository)
      const timezoneService = TimezoneProvider.initializeService(timezoneRepository)
      const languageService = LanguageProvider.initializeService(languageRepository)

      const weatherApiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY
      const weatherService = weatherApiKey
        ? WeatherProvider.initializeService(createWeatherRepository(weatherApiKey))
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

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <UserContextInitializer>{children}</UserContextInitializer>
    </ThemeProvider>
  )
}
