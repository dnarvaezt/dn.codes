"use client"

import { Condition, TimeOfDay } from "@/application/domain/weather/weather.enum"
import { useWeatherStore } from "@/infrastructure/components/weather/weather-store"
import { useEffect, useMemo, useRef, useState } from "react"
import "./lightning-effect.scss"

export const LightningEffect = () => {
  const { weather } = useWeatherStore()

  // Mostrar solo en condiciones naturales: tormenta/granizo ó lluvia fuerte nocturna con alta nubosidad y viento
  const canShow = useMemo(() => {
    if (!weather) return false
    const { condition, timeOfDay } = weather.scenario
    const nightish =
      timeOfDay === TimeOfDay.Night ||
      timeOfDay === TimeOfDay.Midnight ||
      timeOfDay === TimeOfDay.Dusk

    const cloudsPct = Math.max(0, Math.min(100, weather.metrics.clouds.all))
    const rain1h = weather.metrics.rain?.oneHour ?? 0
    const rain3h = weather.metrics.rain?.threeHours ?? 0
    const wind = Math.max(0, weather.metrics.wind.speed || 0)

    const isSevere = condition === Condition.Stormy || condition === Condition.Hailing
    const isHeavyRainNight =
      condition === Condition.Rainy &&
      nightish &&
      cloudsPct >= 70 &&
      (rain1h >= 5 || rain3h >= 10) &&
      wind >= 5

    return nightish && (isSevere || isHeavyRainNight)
  }, [weather])

  const [flashSeed, setFlashSeed] = useState(0)
  const rafRef = useRef<number | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const computeNextDelay = (): number => {
    const wind = Math.max(0, weather?.metrics.wind.speed || 0)
    const condition = weather?.scenario.condition
    const cloudsPct = Math.max(0, Math.min(100, weather?.metrics.clouds.all || 0))
    const rain1h = weather?.metrics.rain?.oneHour ?? 0
    const rain3h = weather?.metrics.rain?.threeHours ?? 0
    const isSevere = condition === Condition.Stormy || condition === Condition.Hailing
    const isHeavyRain =
      condition === Condition.Rainy && cloudsPct >= 70 && (rain1h >= 5 || rain3h >= 10)

    let severityFactor = 1
    if (isSevere) {
      severityFactor = 0.5
    } else if (isHeavyRain) {
      severityFactor = 0.75
    }

    const minMs = 2000 * severityFactor
    const maxMs = 9000 * Math.max(0.5, 1 - wind / 25)
    return Math.floor(minMs + Math.random() * Math.max(500, maxMs - minMs))
  }

  const onTimeout = () => {
    setFlashSeed((s) => s + 1)
    scheduleNext()
  }

  const scheduleNext = () => {
    const delay = computeNextDelay()
    timeoutRef.current = setTimeout(onTimeout, delay)
  }

  useEffect(() => {
    if (!canShow) return
    scheduleNext()
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [canShow, weather])

  if (!canShow) return null

  // Posición/duración pseudoaleatoria por flash
  const rnd = (min: number, max: number) =>
    min + ((Math.sin(flashSeed * 9301) + 1) / 2) * (max - min)
  const flashX = `${rnd(15, 85)}%`
  const flashY = `${rnd(10, 60)}%`
  const duration = `${Math.round(rnd(300, 700))}ms`

  // Bolt generation (simple jagged polyline + 0-2 small branches)
  const shouldBolt = (() => {
    if (!weather) return false
    const isSevere =
      weather.scenario.condition === Condition.Stormy ||
      weather.scenario.condition === Condition.Hailing
    const chance = Math.abs(Math.sin(flashSeed * 1.37)) // 0..1
    return isSevere && chance > 0.35
  })()

  const generateBoltPoints = (seed: number) => {
    const baseX = Number.parseFloat(flashX)
    const baseY = Number.parseFloat(flashY)
    const segments = 6 + Math.floor(((Math.sin(seed * 7.1) + 1) / 2) * 4) // 6..10
    const points: Array<[number, number]> = []
    let x = baseX
    let y = baseY
    for (let i = 0; i < segments; i += 1) {
      const dx = Math.sin(seed * (i + 1) * 2.3) * 8 + Math.cos(seed * (i + 2) * 1.7) * 5
      const dy = 10 + (Math.sin(seed * (i + 3) * 1.1) + 1) * 6
      x = Math.max(5, Math.min(95, x + dx))
      y = Math.max(5, Math.min(95, y + dy))
      points.push([x, y])
    }
    return points
  }

  const mainBolt = shouldBolt ? generateBoltPoints(flashSeed + 0.5) : []
  const branch1 =
    shouldBolt && mainBolt.length > 3
      ? mainBolt
          .slice(1, 4)
          .map(([px, py], idx) => [px + 6 + idx * 2, py + 6 + idx * 4] as [number, number])
      : []
  const branch2 =
    shouldBolt && mainBolt.length > 4
      ? mainBolt
          .slice(2, 5)
          .map(([px, py], idx) => [px - 8 - idx * 2, py + 5 + idx * 4] as [number, number])
      : []

  const style = {
    "--flash-x": flashX,
    "--flash-y": flashY,
    "--flash-duration": duration,
  } as React.CSSProperties

  return (
    <div className="lightning-effect" aria-hidden="true">
      <div className="lightning-effect__flash" style={style} key={flashSeed}></div>
      {shouldBolt && (
        <svg
          className="lightning-effect__bolt"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={style}
          key={`bolt-${flashSeed}`}
        >
          {mainBolt.length > 0 && (
            <polyline
              points={mainBolt.map(([px, py]) => `${px},${py}`).join(" ")}
              className="lightning-effect__bolt-line"
            />
          )}
          {branch1.length > 0 && (
            <polyline
              points={branch1.map(([px, py]) => `${px},${py}`).join(" ")}
              className="lightning-effect__bolt-branch"
            />
          )}
          {branch2.length > 0 && (
            <polyline
              points={branch2.map(([px, py]) => `${px},${py}`).join(" ")}
              className="lightning-effect__bolt-branch"
            />
          )}
        </svg>
      )}
    </div>
  )
}
