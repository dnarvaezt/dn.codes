"use client"

import { cityRepository } from "@/application/domain/city"
import { useEffect, useRef, useState } from "react"
import { useWeatherStore } from "../../weather-store"
import "./weather-widget.scss"

import type { City } from "@/application/domain/city"
import type { KeyboardEvent } from "react"
export const WeatherWidget = () => {
  const { weather, isLoading, loadWeather } = useWeatherStore()

  const [query, setQuery] = useState("")
  const [results, setResults] = useState<City[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    const text = query.trim()
    if (text.length < 2) {
      setResults([])
      setShowResults(false)
      return
    }

    if (searchTimeoutRef.current) {
      globalThis.clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = globalThis.setTimeout(async () => {
      setIsSearching(true)
      try {
        const found = await cityRepository.searchCities(text)
        setResults(found.slice(0, 5))
        setShowResults(true)
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

  const handleSelectCity = async (city: City) => {
    setQuery(city.formatted)
    setShowResults(false)
    await loadWeather({
      latitude: city.coordinates.latitude,
      longitude: city.coordinates.longitude,
    })
  }

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Enter") {
      if (results.length > 0) {
        void handleSelectCity(results[0])
      }
    }
    if (event.key === "Escape") {
      setShowResults(false)
    }
  }

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
        <div className="weather-widget__header">
          <div className="weather-widget__location">
            <h3 className="weather-widget__city">{metrics.cityName}</h3>
            <p className="weather-widget__country">{metrics.sys.country}</p>
          </div>
          <div className="weather-widget__icon">
            <img
              src={getWeatherIcon(currentWeather.icon)}
              alt={currentWeather.description}
              className="weather-widget__weather-icon"
            />
          </div>
        </div>

        <div className="weather-widget__main">
          <div className="weather-widget__temperature">
            <span className="weather-widget__temp-value">
              {formatTemperature(metrics.main.temp)}°
            </span>
            <span className="weather-widget__temp-unit">C</span>
          </div>
          <div className="weather-widget__description">
            <p className="weather-widget__condition">{currentWeather.description}</p>
            <p className="weather-widget__feels-like">
              Sensación térmica {formatTemperature(metrics.main.feelsLike)}°
            </p>
          </div>
        </div>

        <div className="weather-widget__details">
          <div className="weather-widget__detail-item">
            <span className="weather-widget__detail-label">Min</span>
            <span className="weather-widget__detail-value">
              {formatTemperature(metrics.main.tempMin)}°
            </span>
          </div>
          <div className="weather-widget__detail-item">
            <span className="weather-widget__detail-label">Max</span>
            <span className="weather-widget__detail-value">
              {formatTemperature(metrics.main.tempMax)}°
            </span>
          </div>
          <div className="weather-widget__detail-item">
            <span className="weather-widget__detail-label">Humedad</span>
            <span className="weather-widget__detail-value">{metrics.main.humidity}%</span>
          </div>
          <div className="weather-widget__detail-item">
            <span className="weather-widget__detail-label">Viento</span>
            <span className="weather-widget__detail-value">{metrics.wind.speed} m/s</span>
          </div>
        </div>

        <div className="weather-widget__sun-info">
          <div className="weather-widget__sun-item">
            <span className="weather-widget__sun-label">Amanecer</span>
            <span className="weather-widget__sun-time">{formatTime(metrics.sys.sunrise)}</span>
          </div>
          <div className="weather-widget__sun-item">
            <span className="weather-widget__sun-label">Atardecer</span>
            <span className="weather-widget__sun-time">{formatTime(metrics.sys.sunset)}</span>
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
        <div className="weather-widget__search">
          <div className="weather-widget__search-input-wrapper">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
              onKeyDown={handleInputKeyDown}
              className="weather-widget__search-input"
              aria-label="Buscar ciudad"
              placeholder="Buscar ciudad (ej. Bogotá, Madrid)"
              tabIndex={0}
            />
          </div>

          {showResults && (
            <div className="weather-widget__search-results" aria-label="Resultados de búsqueda">
              {isSearching && <div className="weather-widget__search-loading">Buscando…</div>}
              {!isSearching && results.length === 0 && (
                <div className="weather-widget__search-empty">Sin resultados</div>
              )}
              {!isSearching &&
                results.map((city) => (
                  <button
                    key={city.placeId}
                    type="button"
                    className="weather-widget__search-item"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => handleSelectCity(city)}
                    aria-label={`${city.name}, ${city.country}`}
                  >
                    {city.name}, {city.state ? `${city.state}, ` : ""}
                    {city.country}
                  </button>
                ))}
            </div>
          )}
        </div>

        {renderContent()}
      </div>
    </div>
  )
}
