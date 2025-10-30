"use client"

import { cityRepository } from "@/application/domain/city"
import { Input, Popover, PopoverAnchor, PopoverContent } from "@/infrastructure/components/ui"
import { Droplets, MapPin, Sunrise, Sunset, Wind } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useWeatherStore } from "../../weather-store"
import "./weather-widget.scss"

import type { City } from "@/application/domain/city"
import type { KeyboardEvent as ReactKeyboardEvent } from "react"
export const WeatherWidget = () => {
  const { weather, isLoading, loadWeather } = useWeatherStore()

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<City[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const text = query.trim()
    if (text.length < 2) {
      setResults([])
      setShowResults(false)
      setFocusedIndex(-1)
      return
    }

    if (searchTimeoutRef.current) {
      globalThis.clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = globalThis.setTimeout(async () => {
      setIsSearching(true)
      try {
        const found = await cityRepository.searchCities(text)
        const list = found.slice(0, 5)
        setResults(list)
        const nextIndex = list.length ? 0 : -1
        setFocusedIndex(nextIndex)
        if (inputRef.current) {
          inputRef.current.focus({ preventScroll: true })
        }
      } finally {
        setIsSearching(false)
      }
    }, 300)

    return () => {
      if (searchTimeoutRef.current) {
        globalThis.clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [query])

  // Mantener visible la opción activa al navegar con teclado
  useEffect(() => {
    if (!showResults) return
    const container = listRef.current
    if (!container) return
    const active = container.querySelector(".weather-widget__search-item--active")
    active?.scrollIntoView({ block: "nearest" })
  }, [focusedIndex, showResults])

  const handleSelectCity = async (city: City) => {
    setQuery(city.formatted)
    setShowResults(false)
    await loadWeather({
      latitude: city.coordinates.latitude,
      longitude: city.coordinates.longitude,
    })
  }

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>): void => {
    // Navegación solo si el menú ya está abierto
    if (!showResults) return

    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (results.length === 0) return
      setFocusedIndex((prev) => (prev + 1) % results.length)
      return
    }

    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (results.length === 0) return
      setFocusedIndex((prev) => (prev - 1 + results.length) % results.length)
      return
    }

    if (event.key === "Enter") {
      if (results.length === 0) return
      const index = Math.max(focusedIndex, 0)
      void handleSelectCity(results[index])
      return
    }

    if (event.key === "Escape") {
      setShowResults(false)
    }
  }

  useEffect(() => {
    if (!showResults) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowResults(false)
    }
    document.addEventListener("keydown", handleEsc)
    return () => document.removeEventListener("keydown", handleEsc)
  }, [showResults])

  // Mantener el input sincronizado con la ciudad actual
  useEffect(() => {
    if (!weather) return
    setQuery(weather.metrics.cityName)
  }, [weather])

  const formatTemperature = (temp: number) => {
    return Math.round(temp)
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  const renderWeatherInfo = () => {
    if (!weather) return null

    const { metrics } = weather
    const currentWeather = metrics.weather[0]

    return (
      <div className="weather-widget__content">
        <div className="weather-widget__hero">
          <div className="weather-widget__icon-wrap" aria-hidden="true">
            <img
              src={getWeatherIcon(currentWeather.icon)}
              alt={currentWeather.description}
              className="weather-widget__weather-icon"
            />
          </div>
          <div className="weather-widget__temp">
            <span className="weather-widget__temp-value">
              {formatTemperature(metrics.main.temp)}°
            </span>
            <span className="weather-widget__temp-unit">C</span>
          </div>
          <div className="weather-widget__meta">
            <p className="weather-widget__condition">{currentWeather.description}</p>
            <p className="weather-widget__feels-like">
              Sensación térmica {formatTemperature(metrics.main.feelsLike)}°
            </p>
          </div>
        </div>

        <div className="weather-widget__stats" aria-label="Métricas principales">
          <div className="weather-widget__stat" aria-label="Temperatura mínima">
            <span className="weather-widget__stat-label">Min</span>
            <span className="weather-widget__stat-value">
              {formatTemperature(metrics.main.tempMin)}°
            </span>
          </div>
          <div className="weather-widget__stat" aria-label="Temperatura máxima">
            <span className="weather-widget__stat-label">Max</span>
            <span className="weather-widget__stat-value">
              {formatTemperature(metrics.main.tempMax)}°
            </span>
          </div>
          <div className="weather-widget__stat" aria-label="Humedad">
            <Droplets size={14} aria-hidden="true" />
            <span className="weather-widget__stat-value">{metrics.main.humidity}%</span>
          </div>
          <div className="weather-widget__stat" aria-label="Viento">
            <Wind size={14} aria-hidden="true" />
            <span className="weather-widget__stat-value">{metrics.wind.speed} m/s</span>
          </div>
        </div>

        <div className="weather-widget__times" aria-label="Amanecer y atardecer">
          <div className="weather-widget__time">
            <Sunrise size={14} aria-hidden="true" />
            <span className="weather-widget__time-label">Amanecer</span>
            <span className="weather-widget__time-value">{formatTime(metrics.sys.sunrise)}</span>
          </div>
          <div className="weather-widget__time">
            <Sunset size={14} aria-hidden="true" />
            <span className="weather-widget__time-label">Atardecer</span>
            <span className="weather-widget__time-value">{formatTime(metrics.sys.sunset)}</span>
          </div>
        </div>
      </div>
    )
  }

  const renderLoading = () => (
    <div className="weather-widget__loading">
      <div className="weather-widget__loading-spinner"></div>
      <p className="weather-widget__loading-text">Cargando clima...</p>
    </div>
  )

  const renderEmpty = () => (
    <div className="weather-widget__empty">
      <div className="weather-widget__empty-icon">🌤️</div>
      <p className="weather-widget__empty-text">No hay datos del clima disponibles</p>
    </div>
  )

  const renderContent = () => {
    if (isLoading) return renderLoading()
    if (weather) return renderWeatherInfo()
    return renderEmpty()
  }

  return (
    <div className="weather-widget">
      <div className="weather-widget__container">
        <div className="weather-widget__top">
          <div className="weather-widget__top-search">
            <Popover open={showResults} onOpenChange={setShowResults}>
              <PopoverAnchor asChild>
                <label
                  className="weather-widget__search-input-wrapper"
                  htmlFor="weather-widget-search-input"
                  aria-label="Abrir búsqueda de ciudad"
                >
                  <Input
                    ref={inputRef}
                    id="weather-widget-search-input"
                    className="weather-widget__search-input"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onClick={() => setShowResults(true)}
                    onFocus={undefined}
                    onKeyDown={handleInputKeyDown}
                    aria-label="Buscar ciudad"
                    placeholder="Buscar ciudad (ej. Bogotá, Madrid)"
                    tabIndex={0}
                    aria-expanded={showResults}
                    aria-controls="weather-widget-results"
                  />
                </label>
              </PopoverAnchor>

              <PopoverContent
                align="start"
                sideOffset={4}
                className="weather-widget__search-results z-50 w-[var(--radix-popper-anchor-width)] overflow-hidden p-0"
                aria-label="Resultados de búsqueda"
                onOpenAutoFocus={(e) => e.preventDefault()}
                onInteractOutside={() => setShowResults(false)}
                onEscapeKeyDown={() => setShowResults(false)}
              >
                {isSearching && <div className="weather-widget__search-loading">Buscando…</div>}
                {!isSearching && results.length === 0 && (
                  <div className="weather-widget__search-empty">Sin resultados</div>
                )}
                {!isSearching && results.length > 0 && (
                  <div id="weather-widget-results" aria-label="Sugerencias de ciudad" ref={listRef}>
                    {results.map((city, idx) => {
                      const isActive = idx === focusedIndex
                      const label = city.state
                        ? `${city.name}, ${city.state}, ${city.country}`
                        : `${city.name}, ${city.country}`
                      return (
                        <div key={city.placeId}>
                          <button
                            type="button"
                            className={`weather-widget__search-item ${isActive ? "weather-widget__search-item--active" : ""}`}
                            onMouseEnter={() => setFocusedIndex(idx)}
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => void handleSelectCity(city)}
                            aria-label={label}
                            id={`weather-option-${city.placeId}`}
                            aria-pressed={isActive}
                          >
                            <span className="weather-widget__search-item-icon" aria-hidden="true">
                              <MapPin size={16} />
                            </span>
                            <span className="weather-widget__search-item-label">{label}</span>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  )
}
