"use client"

import { useWeatherStore } from "../../weather-store"
import "./weather-widget.scss"

export const WeatherWidget = () => {
  const { weather, isLoading } = useWeatherStore()

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
      <div className="weather-widget__container">{renderContent()}</div>
    </div>
  )
}
