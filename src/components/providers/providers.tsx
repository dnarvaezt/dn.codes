"use client"

import {
  CitySearchService,
  GeocodingService,
  GeolocationService,
  LanguageService,
  TimezoneService,
  WeatherService,
} from "@/services"
import { useUserContextStore } from "@/store"
import { ThemeProvider } from "next-themes"
import { useEffect } from "react"

interface ProvidersProps {
  children: React.ReactNode
}

const UserContextInitializer = ({ children }: { children: React.ReactNode }) => {
  const initializeService = useUserContextStore((state) => state.initializeService)
  const initialize = useUserContextStore((state) => state.initialize)
  const setPartialInitialization = useUserContextStore((state) => state.setPartialInitialization)

  useEffect(() => {
    const geoapifyApiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY

    if (!geoapifyApiKey) {
      setPartialInitialization()
      return
    }

    try {
      const geolocationService = new GeolocationService()
      const geocodingService = new GeocodingService()
      const citySearchService = new CitySearchService(geoapifyApiKey)
      const timezoneService = new TimezoneService()
      const languageService = new LanguageService()

      const weatherApiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY
      const weatherService = weatherApiKey
        ? new WeatherService(weatherApiKey, geolocationService, languageService)
        : undefined

      initializeService(
        geolocationService,
        geocodingService,
        citySearchService,
        timezoneService,
        languageService,
        weatherService
      )

      initialize({ enableGeolocation: true, timeout: 10000 }).catch(() => {
        // Error handled by store
      })
    } catch {
      setPartialInitialization()
    }
  }, [initializeService, initialize, setPartialInitialization])

  return <>{children}</>
}

export const Providers = ({ children }: ProvidersProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <UserContextInitializer>{children}</UserContextInitializer>
    </ThemeProvider>
  )
}
