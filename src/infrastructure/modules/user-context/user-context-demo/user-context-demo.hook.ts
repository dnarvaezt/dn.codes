import type { CitySearchResult } from "@/application/domain/city-search"
import type { ComboboxOption } from "@/infrastructure/components/ui"

import { useUserContextStore } from "@/infrastructure/modules/user-context/user-context-store"
import { useEffect, useMemo, useState } from "react"

const useDebounce = <T>(value: T, delay: number = 300): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

export const useUserContextDemo = () => {
  const {
    city,
    timezone,
    weather,
    language,
    isInitialized,
    isLoading,
    error,
    citySearchService,
    setCity,
    searchCities,
    setLanguage,
    resetLanguageToAuto,
  } = useUserContextStore()

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
      return new Intl.DateTimeFormat(language.fullCode, {
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
      return new Intl.DateTimeFormat(language.fullCode, {
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

  const comboboxOptions: ComboboxOption[] = useMemo(
    () =>
      cityResults.map((city) => ({
        value: city.placeId,
        label: city.formatted,
        secondaryLabel: city.city && city.state ? `${city.city}, ${city.state}` : city.city,
        data: city,
      })),
    [cityResults]
  )

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
    await setCity(option.data as CitySearchResult)
    setCityResults([])
    setCityQuery("")
    setSearchError(null)
  }

  const toggleTimeFormat = () => setIs24Hour(!is24Hour)

  return {
    // Estado del contexto de usuario
    city,
    timezone,
    weather,
    language,
    isInitialized,
    isLoading,
    error,
    isPartiallyInitialized,

    // Estado de búsqueda de ciudades
    cityQuery,
    setCityQuery,
    searchLoading,
    searchError,
    comboboxOptions,
    handleSelectCity,

    // Formato de tiempo
    is24Hour,
    formatLocalTime,
    formatLocalDate,
    toggleTimeFormat,

    // Acciones
    setLanguage,
    resetLanguageToAuto,
  }
}
