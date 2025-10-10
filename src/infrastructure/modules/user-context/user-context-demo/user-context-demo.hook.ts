import type { CitySearchResult } from "@/application/domain/city-search"
import type { ComboboxOption } from "@/infrastructure/components/ui"

import { useDebounce } from "@/infrastructure/hooks"
import { useUserContextStore } from "@/infrastructure/store"
import { useEffect, useMemo, useState } from "react"

export const useUserContextDemo = () => {
  const city = useUserContextStore((state) => state.city)
  const timezone = useUserContextStore((state) => state.timezone)
  const weather = useUserContextStore((state) => state.weather)
  const language = useUserContextStore((state) => state.language)
  const location = useUserContextStore((state) => state.location)
  const isInitialized = useUserContextStore((state) => state.isInitialized)
  const isLoading = useUserContextStore((state) => state.isLoading)
  const error = useUserContextStore((state) => state.error)
  const citySearchService = useUserContextStore((state) => state.citySearchService)
  const setCity = useUserContextStore((state) => state.setCity)
  const searchCities = useUserContextStore((state) => state.searchCities)
  const setLanguage = useUserContextStore((state) => state.setLanguage)
  const resetLanguageToAuto = useUserContextStore((state) => state.resetLanguageToAuto)

  const isPartiallyInitialized = isInitialized && !citySearchService

  const [cityQuery, setCityQuery] = useState("")
  const [cityResults, setCityResults] = useState<CitySearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [is24Hour, setIs24Hour] = useState(true)

  const debouncedQuery = useDebounce(cityQuery, 300)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatLocalTime = useMemo(() => {
    if (!timezone?.timezone) return "N/A"

    try {
      return new Intl.DateTimeFormat(language.fullCode || "es-ES", {
        timeZone: timezone.timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: !is24Hour,
      }).format(currentTime)
    } catch {
      return "N/A"
    }
  }, [timezone?.timezone, language.fullCode, currentTime, is24Hour])

  const formatLocalDate = useMemo(() => {
    if (!timezone?.timezone) return "N/A"

    try {
      return new Intl.DateTimeFormat(language.fullCode || "es-ES", {
        timeZone: timezone.timezone,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(currentTime)
    } catch {
      return "N/A"
    }
  }, [timezone?.timezone, language.fullCode, currentTime])

  const comboboxOptions: ComboboxOption[] = useMemo(() => {
    const options = cityResults.map((city) => ({
      value: city.placeId,
      label: city.formatted,
      secondaryLabel: city.city && city.state ? `${city.city}, ${city.state}` : city.city,
      data: city,
    }))
    return options
  }, [cityResults])

  useEffect(() => {
    if (isPartiallyInitialized) {
      return
    }

    const performSearch = async () => {
      if (!debouncedQuery.trim()) {
        setCityResults([])
        setSearchError(null)
        return
      }

      try {
        setSearchLoading(true)
        setSearchError(null)
        const results = await searchCities(debouncedQuery)
        setCityResults(results)
      } catch (err) {
        setSearchError(err instanceof Error ? err.message : "Error al buscar ciudades")
        setCityResults([])
      } finally {
        setSearchLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery, searchCities, isPartiallyInitialized])

  const handleSelectCity = async (option: ComboboxOption) => {
    const cityData = option.data as CitySearchResult
    await setCity(cityData)
    setCityResults([])
    setCityQuery("")
    setSearchError(null)
  }

  const toggleTimeFormat = () => {
    setIs24Hour(!is24Hour)
  }

  return {
    // Estado del contexto de usuario
    city,
    timezone,
    weather,
    language,
    location,
    isInitialized,
    isLoading,
    error,
    isPartiallyInitialized,

    // Estado de búsqueda de ciudades
    cityQuery,
    setCityQuery,
    cityResults,
    searchLoading,
    searchError,
    comboboxOptions,
    handleSelectCity,

    // Formato de tiempo
    currentTime,
    is24Hour,
    formatLocalTime,
    formatLocalDate,
    toggleTimeFormat,

    // Acciones
    setLanguage,
    resetLanguageToAuto,
  }
}
