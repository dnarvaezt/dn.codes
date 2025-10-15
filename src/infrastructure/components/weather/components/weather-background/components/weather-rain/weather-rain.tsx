import { useMemo } from "react"
import { useWeatherEffect } from "../../hooks"
import { RainIntensityCalculator, RainParticleGenerator } from "../../utils"
import { useWeatherBackgroundStore } from "../../weather-background.store"
import "./weather-rain.scss"

import type { RainParticle } from "../../utils"

export const WeatherRain = () => {
  const { shouldShowRain } = useWeatherBackgroundStore()

  // Dependencies injection (DIP)
  const intensityCalculator = useMemo(() => new RainIntensityCalculator(), [])
  const particleGenerator = useMemo(() => new RainParticleGenerator(), [])

  const { particles: raindrops } = useWeatherEffect<RainParticle>({
    shouldShow: shouldShowRain,
    intensityCalculator,
    particleGenerator,
    generateParticlesFn: (weather, weatherType, intensity) =>
      particleGenerator.generateRaindrops(weather, weatherType, intensity),
    loadingParticleCount: 15,
  })

  if (!shouldShowRain) return null

  return (
    <div className="weather-background__rain">
      {raindrops.map((drop) => (
        <div
          key={drop.id}
          className="weather-background__raindrop"
          style={{
            left: `${drop.left}%`,
            top: `${drop.top}vh`,
            animationDelay: `${drop.animationDelay}s`,
            animationDuration: `${drop.animationDuration}s`,
          }}
        />
      ))}
    </div>
  )
}
