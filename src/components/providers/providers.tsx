"use client"

import {
  CitySearchService,
  GeocodingService,
  GeolocationService,
  LanguageService,
  TimezoneService,
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
    const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY

    if (!apiKey) {
      console.warn(
        "⚠️ NEXT_PUBLIC_GEOAPIFY_API_KEY no está configurada. La búsqueda de ciudades no estará disponible."
      )
      setPartialInitialization()
      return
    }

    try {
      const geolocationService = new GeolocationService()
      const geocodingService = new GeocodingService()
      const citySearchService = new CitySearchService(apiKey)
      const timezoneService = new TimezoneService()
      const languageService = new LanguageService()

      initializeService(
        geolocationService,
        geocodingService,
        citySearchService,
        timezoneService,
        languageService
      )

      initialize({ enableGeolocation: true, timeout: 10000 }).catch((error) => {
        console.error("Error al inicializar UserContextStore:", error)
      })
    } catch (error) {
      console.error("Error al configurar servicios:", error)
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
