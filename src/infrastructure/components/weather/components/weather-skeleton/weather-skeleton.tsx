"use client"

import "./weather-skeleton.scss"

export const WeatherSkeleton = () => {
  return (
    <div className="weather-skeleton">
      <div className="weather-skeleton__container">
        <div className="weather-skeleton__header">
          <div className="weather-skeleton__city" />
          <div className="weather-skeleton__country" />
        </div>

        <div className="weather-skeleton__main">
          <div className="weather-skeleton__icon" />
          <div className="weather-skeleton__temperature" />
          <div className="weather-skeleton__description" />
        </div>

        <div className="weather-skeleton__details">
          <div className="weather-skeleton__detail">
            <div className="weather-skeleton__detail-label" />
            <div className="weather-skeleton__detail-value" />
          </div>
          <div className="weather-skeleton__detail">
            <div className="weather-skeleton__detail-label" />
            <div className="weather-skeleton__detail-value" />
          </div>
          <div className="weather-skeleton__detail">
            <div className="weather-skeleton__detail-label" />
            <div className="weather-skeleton__detail-value" />
          </div>
          <div className="weather-skeleton__detail">
            <div className="weather-skeleton__detail-label" />
            <div className="weather-skeleton__detail-value" />
          </div>
        </div>

        <div className="weather-skeleton__refresh" />
      </div>
    </div>
  )
}
