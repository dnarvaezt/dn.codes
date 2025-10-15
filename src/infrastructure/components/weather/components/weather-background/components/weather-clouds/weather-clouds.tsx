import { useMemo } from "react"
import { useWeatherEffect } from "../../hooks"
import { CloudIntensityCalculator, CloudParticleGenerator } from "../../utils"
import { useWeatherBackgroundStore } from "../../weather-background.store"
import { Cloud } from "./components"
import "./weather-clouds.scss"

import type { CloudParticle } from "../../utils"

export const WeatherClouds = () => {
  const { shouldShowClouds } = useWeatherBackgroundStore()

  // Dependencies injection (DIP)
  const intensityCalculator = useMemo(() => new CloudIntensityCalculator(), [])
  const particleGenerator = useMemo(() => new CloudParticleGenerator(), [])

  const {
    particles: clouds,
    isLoading,
    seedLoading,
    seedNormal,
  } = useWeatherEffect<CloudParticle>({
    shouldShow: shouldShowClouds,
    intensityCalculator,
    particleGenerator,
    generateParticlesFn: (weather, weatherType, intensity) =>
      particleGenerator.generateClouds(weather, weatherType, intensity),
    loadingParticleCount: 7,
  })

  if (!shouldShowClouds) return null

  return (
    <div
      className={`weather-background__clouds ${isLoading ? "weather-background__clouds--loading" : ""}`}
    >
      {clouds.map((cloud) => (
        <Cloud
          key={cloud.id}
          seed={isLoading ? seedLoading : seedNormal}
          index={cloud.id}
          isLoading={isLoading}
          style={{
            top: `${cloud.top}%`,
            left: `${cloud.left}%`,
            animationDelay: `${cloud.animationDelay}s`,
            animationDuration: `${cloud.animationDuration}s`,
          }}
        />
      ))}
    </div>
  )
}
