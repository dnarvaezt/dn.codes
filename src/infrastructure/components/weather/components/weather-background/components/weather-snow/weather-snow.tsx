import { useMemo } from "react"
import { useWeatherEffect } from "../../hooks"
import { SnowIntensityCalculator, SnowParticleGenerator } from "../../utils"
import { useWeatherBackgroundStore } from "../../weather-background.store"
import "./weather-snow.scss"

import type { SnowParticle } from "../../utils"

export const WeatherSnow = () => {
  const { shouldShowSnow } = useWeatherBackgroundStore()

  // Dependencies injection (DIP)
  const intensityCalculator = useMemo(() => new SnowIntensityCalculator(), [])
  const particleGenerator = useMemo(() => new SnowParticleGenerator(), [])

  const { particles: snowflakes } = useWeatherEffect<SnowParticle>({
    shouldShow: shouldShowSnow,
    intensityCalculator,
    particleGenerator,
    generateParticlesFn: (weather, weatherType, intensity) =>
      particleGenerator.generateSnowflakes(weather, weatherType, intensity),
    loadingParticleCount: 10,
  })

  if (!shouldShowSnow) return null

  return (
    <div className="weather-background__snow">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="weather-background__snowflake"
          style={{
            left: `${flake.left}%`,
            animationDelay: `${flake.animationDelay}s`,
            animationDuration: `${flake.animationDuration}s`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  )
}
