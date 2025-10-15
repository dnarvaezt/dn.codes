"use client"

import { WeatherSkeleton } from "./components/weather-skeleton"
import { useWeather } from "./weather.hook"
import "./weather.scss"

export const Weather = () => {
  const { weather, isLoading, error, refresh, clearError } = useWeather()

  if (isLoading) {
    return <WeatherSkeleton />
  }

  if (error) {
    return (
      <div className="weather">
        <div className="weather__error">
          <p className="weather__error-text">{error}</p>
          <button onClick={clearError} className="weather__error-button" type="button">
            Cerrar
          </button>
        </div>
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="weather">
        <div className="weather__empty">
          <p className="weather__empty-text">No hay información del clima disponible</p>
          <button onClick={refresh} className="weather__refresh-button" type="button">
            Cargar clima
          </button>
        </div>
      </div>
    )
  }

  const mainWeather = weather.weather[0]
  const iconUrl = `https://openweathermap.org/img/wn/${mainWeather.icon}@2x.png`

  return (
    <div className="weather">
      <div className="weather__container">
        <div className="weather__header">
          <h2 className="weather__city">{weather.cityName}</h2>
          <p className="weather__country">{weather.sys.country}</p>
        </div>

        <div className="weather__main">
          <div className="weather__icon-wrapper">
            <img src={iconUrl} alt={mainWeather.description} className="weather__icon" />
          </div>
          <div className="weather__temperature">
            <span className="weather__temp-value">{Math.round(weather.main.temp)}</span>
            <span className="weather__temp-unit">°C</span>
          </div>
          <p className="weather__description">{mainWeather.description}</p>
        </div>

        <div className="weather__details">
          <div className="weather__detail">
            <span className="weather__detail-label">Sensación térmica</span>
            <span className="weather__detail-value">{Math.round(weather.main.feelsLike)}°C</span>
          </div>
          <div className="weather__detail">
            <span className="weather__detail-label">Humedad</span>
            <span className="weather__detail-value">{weather.main.humidity}%</span>
          </div>
          <div className="weather__detail">
            <span className="weather__detail-label">Viento</span>
            <span className="weather__detail-value">{Math.round(weather.wind.speed)} km/h</span>
          </div>
          <div className="weather__detail">
            <span className="weather__detail-label">Presión</span>
            <span className="weather__detail-value">{weather.main.pressure} hPa</span>
          </div>
        </div>

        <button onClick={refresh} className="weather__refresh" type="button">
          Actualizar
        </button>
      </div>
    </div>
  )
}
