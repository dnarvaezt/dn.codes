"use client"

import { Combobox } from "@/presentation/components/ui"
import { useDebounce } from "@/presentation/hooks"
import { useUserContextStore } from "@/presentation/store"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"

import type { CitySearchResult } from "@/core/domain/types/city-search"
import type { ComboboxOption } from "@/presentation/components/ui"

export const UserContextDemo = () => {
  const city = useUserContextStore((state) => state.city)
  const timezone = useUserContextStore((state) => state.timezone)
  const weather = useUserContextStore((state) => state.weather)
  const language = useUserContextStore((state) => state.language)
  const location = useUserContextStore((state) => state.location)
  const isInitialized = useUserContextStore((state) => state.isInitialized)
  const isLoading = useUserContextStore((state) => state.isLoading)
  const error = useUserContextStore((state) => state.error)
  const service = useUserContextStore((state) => state.service)
  const setCity = useUserContextStore((state) => state.setCity)
  const searchCities = useUserContextStore((state) => state.searchCities)
  const setLanguage = useUserContextStore((state) => state.setLanguage)
  const resetLanguageToAuto = useUserContextStore((state) => state.resetLanguageToAuto)

  const isPartiallyInitialized = isInitialized && !service

  const [cityQuery, setCityQuery] = useState("")
  const [cityResults, setCityResults] = useState<CitySearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [is24Hour, setIs24Hour] = useState(true)

  // Debounce para evitar llamadas excesivas a la API
  const debouncedQuery = useDebounce(cityQuery, 300)

  // Actualizar la hora cada segundo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Formatear hora según el timezone
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

  // Formatear fecha según el timezone
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

  // Convertir resultados a formato de Combobox
  const comboboxOptions: ComboboxOption[] = useMemo(() => {
    const options = cityResults.map((city) => ({
      value: city.placeId,
      label: city.formatted,
      secondaryLabel: city.city && city.state ? `${city.city}, ${city.state}` : city.city,
      data: city,
    }))
    return options
  }, [cityResults])

  // Efecto para buscar ciudades cuando el query con debounce cambie
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

  if (!isInitialized && isLoading) {
    return (
      <div className="user-context-demo">
        <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
          <p className="text-center text-muted-foreground">Inicializando contexto de usuario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="user-context-demo space-y-6">
      {/* Estado actual */}
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Estado Actual</h3>

        {error && !isPartiallyInitialized && (
          <div className="bg-destructive/10 mb-4 rounded-md p-3 text-sm text-destructive">
            <p className="font-semibold">Error:</p>
            <p>{error.message}</p>
            {error.message.includes("geolocalización") && (
              <p className="mt-2 text-xs">
                💡 Tip: Asegúrate de permitir el acceso a la ubicación en tu navegador
              </p>
            )}
          </div>
        )}

        {isPartiallyInitialized && (
          <div className="mb-4 rounded-md border border-blue-500/50 bg-blue-500/10 p-3 text-sm text-blue-700 dark:text-blue-400">
            <p className="font-semibold">ℹ️ Modo limitado</p>
            <p className="mt-1 text-xs">
              Funcionando con timezone y idioma del navegador. Configura la API key para habilitar
              todas las funcionalidades.
            </p>
          </div>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Ciudad:</span>
            <span className="font-medium">{city?.city || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">País:</span>
            <span className="font-medium">{city?.country || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Timezone:</span>
            <span className="font-medium">{timezone?.timezone || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Offset:</span>
            <span className="font-medium">{timezone?.offsetString || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Fecha Local:</span>
            <span className="font-medium capitalize">{formatLocalDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Hora Local:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-medium">{formatLocalTime}</span>
              <button
                onClick={() => setIs24Hour(!is24Hour)}
                className="hover:bg-muted/80 rounded-md bg-muted px-2 py-0.5 text-xs"
                title={is24Hour ? "Cambiar a 12 horas" : "Cambiar a 24 horas"}
              >
                {is24Hour ? "24h" : "12h"}
              </button>
            </div>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">DST:</span>
            <span className="font-medium">{timezone?.isDST ? "Sí" : "No"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Idioma:</span>
            <span className="font-medium">
              {language.language.toUpperCase()}
              {language.isManual && " (Manual)"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Detección:</span>
            <span className="font-medium">
              {location?.detectionMethod === "auto" ? "Automática" : "Manual"}
            </span>
          </div>
        </div>
      </div>

      {/* Clima Actual */}
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Clima Actual</h3>

        {weather ? (
          <div className="space-y-4">
            {/* Condición principal con ícono */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {weather.weather[0] && (
                  <Image
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                    width={64}
                    height={64}
                    className="h-16 w-16"
                  />
                )}
                <div>
                  <p className="text-3xl font-bold">{Math.round(weather.main.temp)}°C</p>
                  <p className="capitalize text-muted-foreground">
                    {weather.weather[0]?.description || "N/A"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Sensación térmica</p>
                <p className="text-lg font-semibold">{Math.round(weather.main.feelsLike)}°C</p>
              </div>
            </div>

            {/* Detalles del clima */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mín/Máx:</span>
                  <span className="font-medium">
                    {Math.round(weather.main.tempMin)}° / {Math.round(weather.main.tempMax)}°
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Humedad:</span>
                  <span className="font-medium">{weather.main.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Presión:</span>
                  <span className="font-medium">{weather.main.pressure} hPa</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visibilidad:</span>
                  <span className="font-medium">{(weather.visibility / 1000).toFixed(1)} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Viento:</span>
                  <span className="font-medium">{weather.wind.speed} m/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Dirección:</span>
                  <span className="font-medium">{weather.wind.deg}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nubes:</span>
                  <span className="font-medium">{weather.clouds.all}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">País:</span>
                  <span className="font-medium">{weather.sys.country}</span>
                </div>
              </div>
            </div>

            {/* Amanecer y atardecer */}
            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">🌅 Amanecer:</span>
                  <span className="font-medium">
                    {new Date(weather.sys.sunrise * 1000).toLocaleTimeString(language.fullCode, {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: timezone?.timezone,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">🌇 Atardecer:</span>
                  <span className="font-medium">
                    {new Date(weather.sys.sunset * 1000).toLocaleTimeString(language.fullCode, {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: timezone?.timezone,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-blue-500/50 bg-blue-500/10 p-4 text-center text-sm text-blue-700 dark:text-blue-400">
            <p className="font-semibold">ℹ️ Información del clima no disponible</p>
            <p className="mt-1 text-xs">
              {isPartiallyInitialized
                ? "Configura las API keys para ver el clima"
                : "El clima se cargará automáticamente cuando se detecte tu ubicación"}
            </p>
          </div>
        )}
      </div>

      {/* Cambiar ciudad */}
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Cambiar Ciudad</h3>

        {isPartiallyInitialized ? (
          <div className="rounded-md border border-yellow-500/50 bg-yellow-500/10 p-4 text-sm text-yellow-700 dark:text-yellow-400">
            <p className="font-semibold">⚠️ Búsqueda de ciudades no disponible</p>
            <p className="mt-1 text-xs">
              Configura{" "}
              <code className="rounded bg-yellow-900/20 px-1 py-0.5">
                NEXT_PUBLIC_GEOAPIFY_API_KEY
              </code>{" "}
              en tu archivo .env.local para habilitar esta funcionalidad.
            </p>
          </div>
        ) : (
          <Combobox
            value={cityQuery}
            onChange={setCityQuery}
            onSelect={handleSelectCity}
            options={comboboxOptions}
            selectedValue={city?.placeId}
            loading={searchLoading}
            error={searchError || undefined}
            placeholder="Buscar ciudad..."
            emptyMessage="No se encontraron ciudades"
            loadingMessage="Buscando ciudades..."
            aria-label="Buscar ciudad"
          />
        )}
      </div>

      {/* Cambiar idioma */}
      <div className="rounded-lg border bg-card p-6 text-card-foreground shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Cambiar Idioma</h3>

        <div className="flex gap-2">
          <button
            onClick={() => setLanguage("es")}
            disabled={language.language === "es" && language.isManual}
            className="flex-1 rounded-md border bg-background px-4 py-2 text-sm hover:bg-accent disabled:opacity-50"
          >
            Español
          </button>
          <button
            onClick={() => setLanguage("en")}
            disabled={language.language === "en" && language.isManual}
            className="flex-1 rounded-md border bg-background px-4 py-2 text-sm hover:bg-accent disabled:opacity-50"
          >
            English
          </button>
          <button
            onClick={resetLanguageToAuto}
            disabled={!language.isManual}
            className="flex-1 rounded-md border bg-background px-4 py-2 text-sm hover:bg-accent disabled:opacity-50"
          >
            Automático
          </button>
        </div>
      </div>
    </div>
  )
}
