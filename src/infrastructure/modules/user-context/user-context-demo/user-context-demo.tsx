"use client"

import { Combobox } from "@/infrastructure/components/ui"
import Image from "next/image"
import { useUserContextDemo } from "./user-context-demo.hook"
import "./user-context-demo.scss"

export const UserContextDemo = () => {
  const {
    city,
    timezone,
    weather,
    language,
    location,
    isInitialized,
    isLoading,
    error,
    isPartiallyInitialized,
    cityQuery,
    setCityQuery,
    searchLoading,
    searchError,
    comboboxOptions,
    handleSelectCity,
    formatLocalTime,
    formatLocalDate,
    is24Hour,
    toggleTimeFormat,
    setLanguage,
    resetLanguageToAuto,
  } = useUserContextDemo()

  if (!isInitialized && isLoading) {
    return (
      <div className="user-context-demo">
        <div className="user-context-demo__card">
          <p className="user-context-demo__loading">Inicializando contexto de usuario...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="user-context-demo">
      {/* Estado actual */}
      <div className="user-context-demo__card">
        <h3 className="user-context-demo__title">Estado Actual</h3>

        {error && !isPartiallyInitialized && (
          <div className="user-context-demo__error">
            <p className="user-context-demo__error-title">Error:</p>
            <p>{error.message}</p>
            {error.message.includes("geolocalización") && (
              <p className="user-context-demo__error-message">
                💡 Tip: Asegúrate de permitir el acceso a la ubicación en tu navegador
              </p>
            )}
          </div>
        )}

        {isPartiallyInitialized && (
          <div className="user-context-demo__info-box user-context-demo__info-box--limited">
            <p className="user-context-demo__info-title">ℹ️ Modo limitado</p>
            <p className="user-context-demo__info-text">
              Funcionando con timezone y idioma del navegador. Configura la API key para habilitar
              todas las funcionalidades.
            </p>
          </div>
        )}

        <div className="user-context-demo__details">
          <div className="user-context-demo__detail-row">
            <span className="user-context-demo__detail-label">Ciudad:</span>
            <span className="user-context-demo__detail-value">{city?.city || "N/A"}</span>
          </div>
          <div className="user-context-demo__detail-row">
            <span className="user-context-demo__detail-label">País:</span>
            <span className="user-context-demo__detail-value">{city?.country || "N/A"}</span>
          </div>
          <div className="user-context-demo__detail-row">
            <span className="user-context-demo__detail-label">Timezone:</span>
            <span className="user-context-demo__detail-value">{timezone?.timezone || "N/A"}</span>
          </div>
          <div className="user-context-demo__detail-row">
            <span className="user-context-demo__detail-label">Offset:</span>
            <span className="user-context-demo__detail-value">
              {timezone?.offsetString || "N/A"}
            </span>
          </div>
          <div className="user-context-demo__detail-row">
            <span className="user-context-demo__detail-label">Fecha Local:</span>
            <span className="user-context-demo__detail-value user-context-demo__detail-value--capitalize">
              {formatLocalDate}
            </span>
          </div>
          <div className="user-context-demo__detail-row">
            <span className="user-context-demo__detail-label">Hora Local:</span>
            <div className="flex items-center gap-2">
              <span className="user-context-demo__detail-value user-context-demo__detail-value--mono">
                {formatLocalTime}
              </span>
              <button
                onClick={toggleTimeFormat}
                className="user-context-demo__time-toggle"
                title={is24Hour ? "Cambiar a 12 horas" : "Cambiar a 24 horas"}
              >
                {is24Hour ? "24h" : "12h"}
              </button>
            </div>
          </div>
          <div className="user-context-demo__detail-row">
            <span className="user-context-demo__detail-label">DST:</span>
            <span className="user-context-demo__detail-value">{timezone?.isDST ? "Sí" : "No"}</span>
          </div>
          <div className="user-context-demo__detail-row">
            <span className="user-context-demo__detail-label">Idioma:</span>
            <span className="user-context-demo__detail-value">
              {language.language.toUpperCase()}
              {language.isManual && " (Manual)"}
            </span>
          </div>
          <div className="user-context-demo__detail-row">
            <span className="user-context-demo__detail-label">Detección:</span>
            <span className="user-context-demo__detail-value">
              {location?.detectionMethod === "auto" ? "Automática" : "Manual"}
            </span>
          </div>
        </div>
      </div>

      {/* Clima Actual */}
      <div className="user-context-demo__card">
        <h3 className="user-context-demo__title">Clima Actual</h3>

        {weather ? (
          <div className="space-y-4">
            {/* Condición principal con ícono */}
            <div className="user-context-demo__weather-main">
              <div className="user-context-demo__weather-icon-group">
                {weather.weather[0] && (
                  <Image
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                    width={64}
                    height={64}
                    className="user-context-demo__weather-icon"
                  />
                )}
                <div>
                  <p className="user-context-demo__weather-temp">
                    {Math.round(weather.main.temp)}°C
                  </p>
                  <p className="user-context-demo__weather-description">
                    {weather.weather[0]?.description || "N/A"}
                  </p>
                </div>
              </div>
              <div className="user-context-demo__weather-feels-like">
                <p className="user-context-demo__weather-label">Sensación térmica</p>
                <p className="user-context-demo__weather-value">
                  {Math.round(weather.main.feelsLike)}°C
                </p>
              </div>
            </div>

            {/* Detalles del clima */}
            <div className="user-context-demo__weather-section">
              <div className="user-context-demo__weather-grid">
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
            <div className="user-context-demo__weather-section">
              <div className="user-context-demo__weather-grid">
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
          <div className="user-context-demo__info-box user-context-demo__info-box--info">
            <p className="user-context-demo__info-title">ℹ️ Información del clima no disponible</p>
            <p className="user-context-demo__info-text">
              {isPartiallyInitialized
                ? "Configura las API keys para ver el clima"
                : "El clima se cargará automáticamente cuando se detecte tu ubicación"}
            </p>
          </div>
        )}
      </div>

      {/* Cambiar ciudad */}
      <div className="user-context-demo__card">
        <h3 className="user-context-demo__title">Cambiar Ciudad</h3>

        {isPartiallyInitialized ? (
          <div className="user-context-demo__info-box user-context-demo__info-box--warning">
            <p className="user-context-demo__info-title">⚠️ Búsqueda de ciudades no disponible</p>
            <p className="user-context-demo__info-text">
              Configura{" "}
              <code className="user-context-demo__info-code">NEXT_PUBLIC_GEOAPIFY_API_KEY</code> en
              tu archivo .env.local para habilitar esta funcionalidad.
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
      <div className="user-context-demo__card">
        <h3 className="user-context-demo__title">Cambiar Idioma</h3>

        <div className="user-context-demo__language-buttons">
          <button
            onClick={() => setLanguage("es")}
            disabled={language.language === "es" && language.isManual}
            className="user-context-demo__language-button"
          >
            Español
          </button>
          <button
            onClick={() => setLanguage("en")}
            disabled={language.language === "en" && language.isManual}
            className="user-context-demo__language-button"
          >
            English
          </button>
          <button
            onClick={resetLanguageToAuto}
            disabled={!language.isManual}
            className="user-context-demo__language-button"
          >
            Automático
          </button>
        </div>
      </div>
    </div>
  )
}
