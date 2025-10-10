"use client"

import {
  createCitySearchRepository,
  createGeocodingRepository,
  createGeolocationRepository,
  createLanguageRepository,
  createTimezoneRepository,
  createWeatherRepository,
} from "@/application/domain/user-context"
import { useUserContextStore } from "@/infrastructure/store"
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
      const geolocationRepository = createGeolocationRepository()
      const geocodingRepository = createGeocodingRepository()
      const citySearchRepository = createCitySearchRepository(geoapifyApiKey)
      const timezoneRepository = createTimezoneRepository()
      const languageRepository = createLanguageRepository()

      const weatherApiKey = process.env.NEXT_PUBLIC_OPENWEATHERMAP_API_KEY
      const weatherRepository = weatherApiKey ? createWeatherRepository(weatherApiKey) : undefined

      initializeService(
        geolocationRepository,
        geocodingRepository,
        citySearchRepository,
        timezoneRepository,
        languageRepository,
        weatherRepository
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
