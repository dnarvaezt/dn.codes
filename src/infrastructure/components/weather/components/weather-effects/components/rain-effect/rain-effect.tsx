"use client"

import { Condition } from "@/application/domain/weather/weather.enum"
import { useWeatherStore } from "@/infrastructure/components/weather/weather-store"
import "./rain-effect.scss"

export const RainEffect = () => {
  const { weather } = useWeatherStore()
  if (!weather) return null

  const isSnow = weather.scenario.condition === Condition.Snowy
  const cond = weather.scenario.condition
  const isRainLike = cond === Condition.Rainy || cond === Condition.Stormy || isSnow

  if (!isRainLike) {
    return null
  }

  const { metrics } = weather
  const rate1h = isSnow ? metrics.snow?.oneHour : metrics.rain?.oneHour
  const rate3h = isSnow ? metrics.snow?.threeHours : metrics.rain?.threeHours
  const derivedRate = rate1h ?? (rate3h ? rate3h / 3 : undefined)
  // Normaliza intensidad a [0..1] tomando 10 mm/h como “fuerte”
  let normalizedIntensity: number
  if (derivedRate !== undefined) {
    normalizedIntensity = Math.min(1, Math.max(0, derivedRate / 10))
  } else if (cond === Condition.Stormy) {
    normalizedIntensity = 0.8
  } else {
    normalizedIntensity = 0.5
  }

  // Seeded pseudo-random for stable positions within a tick
  const seed = 37 + Math.round((weather.metrics.dt ?? 0) % 997)
  const rand = (i: number) => (Math.sin(seed * (i + 1) * 12.9898) + 1) / 2
  const randX = (i: number) => (Math.sin((seed + 137) * (i + 1.5) * 24.123) + 1) / 2

  // Densidad variable según intensidad
  const count = isSnow
    ? Math.round(12 + normalizedIntensity * 16)
    : Math.round(12 + normalizedIntensity * 22)

  const items = Array.from({ length: count }).map((_, i) => {
    const r = rand(i)
    // posición horizontal independiente para asegurar cobertura total
    const x = randX(i)
    let left = Math.round(x * 100)
    if (i % 3 === 0)
      left = Math.round(x * 50) // fuerza al tercio izquierdo
    else if (i % 3 === 1) left = Math.round(50 + x * 50) // fuerza al tercio derecho
    const baseDuration = isSnow ? 3600 + r * 2600 : 1300 + r * 1000
    const speedFactor = isSnow ? 1 + normalizedIntensity * 0.2 : 1 - normalizedIntensity * 0.3
    const duration = `${Math.round(baseDuration * speedFactor)}ms`
    const delay = `-${(r * 2).toFixed(2)}s`

    if (isSnow) {
      const size = 2 + Math.round(r * (3 + normalizedIntensity * 2))
      const drift = r > 0.5 ? 4 : -4
      const blur = r > 0.6 ? 0.8 : 0.4
      const opacity = r > 0.6 ? 0.85 : 0.7
      return (
        <div
          key={`flake-${i}-${left}-${size}`}
          className="rain-effect__flake"
          style={
            {
              left: `${left}%`,
              ["--size"]: `${size}px`,
              ["--delay"]: delay,
              ["--duration"]: duration,
              ["--drift-x"]: `${drift}vw`,
              ["--blur"]: `${blur}px`,
              ["--opacity"]: opacity,
            } as React.CSSProperties
          }
        />
      )
    }

    // Raindrop: head + trail; tilt around vertical (-12..12deg)
    const maxTilt = 18 + normalizedIntensity * 10
    const angle = Math.round((r - 0.5) * maxTilt)
    const length = 18 + Math.round(r * 14 + normalizedIntensity * 6)
    const thickness = (0.9 + r * 0.7).toFixed(2)
    const headW = (Number.parseFloat(thickness) * 1.6).toFixed(2) // cabeza un poco más ancha que la estela
    const drift = (angle / 12) * 5.5 // horizontal drift coherente con tilt

    return (
      <div
        key={`drop-${i}-${left}-${length}`}
        className="rain-effect__drop"
        style={
          {
            left: `${left}%`,
            ["--duration"]: duration,
            ["--delay"]: delay,
            ["--length"]: `${length}px`,
            ["--thickness"]: `${thickness}px`,
            ["--head-w"]: `${headW}px`,
            ["--alpha"]: "0.32",
            ["--opacity"]: Math.min(0.95, 0.68 + normalizedIntensity * 0.22),
            ["--blur"]: "0px",
            ["--angle"]: `${angle}deg`,
            ["--drift-x"]: `${drift.toFixed(2)}vw`,
          } as React.CSSProperties
        }
      />
    )
  })

  return (
    <div
      className="rain-effect"
      aria-hidden="true"
      style={
        {
          ["--rain-global-opacity"]: isSnow ? 0.85 : 0.6 + normalizedIntensity * 0.35,
        } as React.CSSProperties
      }
    >
      <div
        className="rain-effect__mist"
        aria-hidden="true"
        style={
          {
            ["--mist-opacity"]: Math.max(0, normalizedIntensity - 0.4) * 0.25,
          } as React.CSSProperties
        }
      />
      <div className="rain-effect__drops" aria-hidden="true">
        {items}
      </div>
    </div>
  )
}
