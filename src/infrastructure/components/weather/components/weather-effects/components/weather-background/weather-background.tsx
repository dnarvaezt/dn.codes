import { Condition, Season, TimeOfDay } from "@/application/domain/weather/weather.enum"
import { WeatherScenario } from "@/application/domain/weather/weather.model"
import { useWeatherStore } from "@/infrastructure/components/weather/weather-store"
import "./weather-background.scss"

export const WeatherBackground = () => {
  const { weather, isLoading } = useWeatherStore()

  const getBackgroundStyle = (scenario: WeatherScenario) => {
    const { season, timeOfDay, condition } = scenario
    // Colores semánticos centralizados (tokens HSL)
    const cPrimary = "hsl(var(--primary))"
    const cSecondary = "hsl(var(--secondary))"
    const cAccent = "hsl(var(--accent))"

    // Modificadores por hora del día (colores realistas del cielo)
    const timeModifiers = {
      [TimeOfDay.Dawn]: { brightness: 0.6, saturation: 1.2, hue: 25 }, // Amanecer rosado/naranja
      [TimeOfDay.Morning]: { brightness: 0.8, saturation: 1.1, hue: 5 }, // Mañana cálida
      [TimeOfDay.Noon]: { brightness: 1.1, saturation: 1, hue: 0 }, // Mediodía brillante
      [TimeOfDay.Afternoon]: { brightness: 1, saturation: 1, hue: 0 }, // Tarde normal
      [TimeOfDay.Sunset]: { brightness: 0.7, saturation: 1.3, hue: 30 }, // Atardecer dorado
      [TimeOfDay.Dusk]: { brightness: 0.4, saturation: 1.1, hue: 15 }, // Crepúsculo
      [TimeOfDay.Night]: { brightness: 0.15, saturation: 0.4, hue: 250 }, // Noche azul profundo real
      [TimeOfDay.Midnight]: { brightness: 0.08, saturation: 0.3, hue: 270 }, // Medianoche púrpura profundo real
    }

    // Modificadores por estación (variaciones sutiles y naturales)
    const seasonModifiers = {
      [Season.Spring]: { saturation: 1.03, hue: 4, brightness: 1.02 },
      [Season.Summer]: { saturation: 0.98, hue: 0, brightness: 1.05 },
      [Season.Autumn]: { saturation: 0.95, hue: 8, brightness: 0.92 },
      [Season.Winter]: { saturation: 0.88, hue: 0, brightness: 0.85 },
    }

    const timeMod = timeModifiers[timeOfDay]
    const seasonMod = seasonModifiers[season]
    const isNightTime = timeOfDay === TimeOfDay.Night || timeOfDay === TimeOfDay.Midnight

    // Posición y halo solar (aproximado por hora del día)
    const getSunParams = () => {
      if (isNightTime) return null
      const sunXMap: Record<TimeOfDay, number> = {
        [TimeOfDay.Dawn]: 15,
        [TimeOfDay.Morning]: 25,
        [TimeOfDay.Noon]: 50,
        [TimeOfDay.Afternoon]: 75,
        [TimeOfDay.Sunset]: 85,
        [TimeOfDay.Dusk]: 80,
        [TimeOfDay.Night]: 80,
        [TimeOfDay.Midnight]: 80,
      }
      const sunYMap: Record<TimeOfDay, number> = {
        [TimeOfDay.Dawn]: 86,
        [TimeOfDay.Morning]: 65,
        [TimeOfDay.Noon]: 18,
        [TimeOfDay.Afternoon]: 32,
        [TimeOfDay.Sunset]: 86,
        [TimeOfDay.Dusk]: 90,
        [TimeOfDay.Night]: 90,
        [TimeOfDay.Midnight]: 92,
      }
      const haloAlphaMap: Record<TimeOfDay, number> = {
        [TimeOfDay.Dawn]: 0.16,
        [TimeOfDay.Morning]: 0.1,
        [TimeOfDay.Noon]: 0.06,
        [TimeOfDay.Afternoon]: 0.08,
        [TimeOfDay.Sunset]: 0.18,
        [TimeOfDay.Dusk]: 0.12,
        [TimeOfDay.Night]: 0,
        [TimeOfDay.Midnight]: 0,
      }
      return {
        x: sunXMap[timeOfDay],
        y: sunYMap[timeOfDay],
        halo: haloAlphaMap[timeOfDay],
        disc: Math.max(0, haloAlphaMap[timeOfDay] - 0.08),
      }
    }

    // Crear degradado natural del cielo con múltiples capas
    const createNaturalSkyGradient = (primary: string, secondary: string, accent: string) => {
      const isClearType =
        condition === Condition.Clear ||
        condition === Condition.Sunny ||
        condition === Condition.PartlyCloudy
      const isAfternoonClear = !isNightTime && timeOfDay === TimeOfDay.Afternoon && isClearType
      const isNoonClear = !isNightTime && timeOfDay === TimeOfDay.Noon && isClearType
      let vignetteStrength = 0
      if (isAfternoonClear) vignetteStrength = 0.045
      else if (isNoonClear) vignetteStrength = 0.03

      const vignetteTop =
        vignetteStrength > 0
          ? `radial-gradient(ellipse 160% 80% at 50% -10%, rgba(0,0,0,${vignetteStrength}) 0%, rgba(0,0,0,${(vignetteStrength * 0.55).toFixed(3)}) 40%, transparent 70%),`
          : ""
      if (isNightTime) {
        // Degradado nocturno más natural (transiciones más largas y difuminadas)
        return `
          radial-gradient(120% 90% at 50% -10%, hsl(var(--background)) 0%, hsl(var(--card)) 55%, hsl(var(--popover)) 100%),
          linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--card)) 100%)
        `
      }

      // Degradados específicos por condición climática
      switch (condition) {
        case Condition.Sunny:
        case Condition.Clear:
          return `
            ${vignetteTop}
            radial-gradient(ellipse 150% 120% at 50% 0%, ${accent} 0%, transparent 60%),
            radial-gradient(ellipse 100% 80% at 30% 15%, ${secondary} 0%, transparent 50%),
            radial-gradient(ellipse 120% 100% at 70% 25%, ${primary} 0%, transparent 70%),
            linear-gradient(180deg, ${primary} 0%, ${secondary} 60%, ${accent} 100%)
          `

        case Condition.PartlyCloudy:
          return `
            ${vignetteTop}
            radial-gradient(ellipse 200% 150% at 50% 0%, ${accent} 0%, transparent 40%),
            radial-gradient(ellipse 80% 60% at 20% 30%, ${secondary} 0%, transparent 60%),
            radial-gradient(ellipse 90% 70% at 80% 20%, ${primary} 0%, transparent 50%),
            linear-gradient(180deg, ${primary} 0%, ${secondary} 50%, ${accent} 100%)
          `

        case Condition.Cloudy:
          return `
            radial-gradient(ellipse 180% 120% at 50% 0%, ${accent} 0%, transparent 30%),
            radial-gradient(ellipse 120% 80% at 40% 25%, ${secondary} 0%, transparent 40%),
            linear-gradient(180deg, ${primary} 0%, ${secondary} 40%, ${accent} 100%)
          `

        case Condition.Rainy:
          return `
            radial-gradient(ellipse 160% 100% at 50% 0%, ${accent} 0%, transparent 25%),
            linear-gradient(180deg, ${primary} 0%, ${secondary} 30%, ${accent} 100%)
          `

        case Condition.Stormy:
          return `
            radial-gradient(ellipse 140% 80% at 50% 0%, ${accent} 0%, transparent 20%),
            linear-gradient(180deg, ${primary} 0%, ${secondary} 25%, ${accent} 100%)
          `

        case Condition.Snowy:
          return `
            radial-gradient(ellipse 200% 150% at 50% 0%, ${accent} 0%, transparent 70%),
            radial-gradient(ellipse 100% 80% at 30% 20%, ${secondary} 0%, transparent 60%),
            linear-gradient(180deg, ${primary} 0%, ${secondary} 50%, ${accent} 100%)
          `

        default:
          // Degradado diurno natural con múltiples capas
          return `
            ${vignetteTop}
            radial-gradient(ellipse 120% 100% at 50% 0%, ${accent} 0%, transparent 50%),
            radial-gradient(ellipse 80% 60% at 30% 20%, ${secondary} 0%, transparent 40%),
            radial-gradient(ellipse 100% 80% at 70% 30%, ${primary} 0%, transparent 60%),
            linear-gradient(180deg, ${primary} 0%, ${secondary} 50%, ${accent} 100%)
          `
      }
    }

    // Calcular filtros finales (tonemapping leve)
    const finalBrightness = timeMod.brightness * seasonMod.brightness
    const finalSaturation = timeMod.saturation * seasonMod.saturation
    const finalHue = timeMod.hue + seasonMod.hue
    const adjustedSaturation = isNightTime ? finalSaturation : finalSaturation * 0.93
    const adjustedBrightness = isNightTime ? finalBrightness : finalBrightness * 0.98

    // Calidez de horizonte en horas doradas
    const horizonWarmthAlpha = (() => {
      if (isNightTime) return 0
      switch (timeOfDay) {
        case TimeOfDay.Dawn:
        case TimeOfDay.Sunset:
          return 0.16
        case TimeOfDay.Morning:
        case TimeOfDay.Dusk:
          return 0.08
        default:
          return 0.04
      }
    })()
    const horizonWarmthLayer = horizonWarmthAlpha
      ? `linear-gradient(180deg, hsl(var(--accent) / 0) 55%, hsl(var(--accent) / ${horizonWarmthAlpha}) 82%, hsl(var(--accent) / 0.02) 100%)`
      : ""

    // Contaminación lumínica nocturna (glow cálido en horizonte y ciudad)
    const lightPollutionLayers = isNightTime
      ? [
          `linear-gradient(180deg, transparent 65%, hsl(var(--accent) / 0.08) 85%, hsl(var(--accent) / 0.16) 95%, hsl(var(--accent) / 0.18) 100%)`,
          `radial-gradient(60% 22% at 50% 105%, hsl(var(--accent) / 0.14) 0%, hsl(var(--accent) / 0.03) 60%, transparent 100%)`,
        ]
      : []

    // Halo solar (aureola + disco suave)
    const sunParams = getSunParams()
    const sunHaloLayer =
      sunParams && sunParams.halo > 0
        ? `radial-gradient(40% 35% at ${sunParams.x}% ${sunParams.y}%, hsl(var(--accent) / ${sunParams.halo}) 0%, hsl(var(--accent) / 0) 60%), radial-gradient(12% 12% at ${sunParams.x}% ${sunParams.y}%, hsl(var(--accent) / ${sunParams.disc}) 0%, hsl(var(--accent) / 0) 80%)`
        : ""

    // Dither anti-banding muy sutil (deshabilitado en noche para evitar líneas visibles)
    const ditherLayer = isNightTime
      ? ""
      : `repeating-linear-gradient(45deg, hsl(var(--foreground) / 0.004) 0px, hsl(var(--foreground) / 0.004) 2px, hsl(var(--background) / 0.004) 2px, hsl(var(--background) / 0.004) 4px)`

    // Construcción de capas finales (de arriba hacia abajo)
    const backgroundLayers = [
      ditherLayer,
      sunHaloLayer,
      horizonWarmthLayer,
      ...lightPollutionLayers,
      createNaturalSkyGradient(cPrimary, cSecondary, cAccent),
    ].filter(Boolean)

    // Tone mapping simple con clamps y contraste leve
    const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
    const brightnessClamped = clamp(adjustedBrightness, 0.85, 1.15)
    const saturationClamped = clamp(adjustedSaturation, 0.7, 1.15)

    return {
      background: backgroundLayers.join(","),
      filter: `brightness(${brightnessClamped}) saturate(${saturationClamped}) hue-rotate(${finalHue}deg) contrast(1.03)`,
    }
  }

  if (isLoading || !weather) {
    return <div className="weather-background weather-background--loading"></div>
  }

  const backgroundStyle = getBackgroundStyle(weather.scenario)

  return (
    <div
      className="weather-background"
      style={{
        background: backgroundStyle.background,
        filter: backgroundStyle.filter,
      }}
    />
  )
}
