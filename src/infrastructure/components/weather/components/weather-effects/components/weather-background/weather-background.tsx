import { Condition, Season, TimeOfDay } from "@/application/domain/weather/weather.enum"
import { WeatherScenario } from "@/application/domain/weather/weather.model"
import { useWeatherStore } from "@/infrastructure/components/weather/weather-store"
import "./weather-background.scss"

export const WeatherBackground = () => {
  const { weather, isLoading } = useWeatherStore()

  const getBackgroundStyle = (scenario: WeatherScenario) => {
    const { season, timeOfDay, condition } = scenario

    // Colores base por condición climática (día: paleta más suave y realista)
    const conditionColors = {
      [Condition.Sunny]: {
        primary: "#6EA2D1", // cielo suave natural
        secondary: "#A9C9E2", // azul claro realista
        accent: "#EAF2FA", // brillo tenue
      },
      [Condition.PartlyCloudy]: {
        primary: "#7DA1BC", // azul grisáceo natural
        secondary: "#D0DAE4", // nubes suaves
        accent: "#EEF2F6", // luz difusa
      },
      [Condition.Cloudy]: {
        primary: "#95A3B0", // gris azulado moderado natural
        secondary: "#C5CDD5", // gris claro natural
        accent: "#E3E7EC", // tono alto suave
      },
      [Condition.Rainy]: {
        primary: "#5E7282", // azul pizarra más natural
        secondary: "#8899A6", // gris azulado medio
        accent: "#C8D0D6", // luz de lluvia
      },
      [Condition.Stormy]: {
        primary: "#4A5863", // azul grisáceo tormenta natural
        secondary: "#7A8791", // gris medio desaturado
        accent: "#B6BDC4", // luz difusa
      },
      [Condition.Snowy]: {
        primary: "#DFE8F2", // azul muy pálido
        secondary: "#F2F6FA", // casi blanco frío
        accent: "#F9FBFD", // blanco suave
      },
      [Condition.Windy]: {
        primary: "#78AFCF", // cielo claro desaturado
        secondary: "#B6D1E3", // tono medio natural
        accent: "#E7EFF6", // luz alta sutil
      },
      [Condition.Foggy]: {
        primary: "#C9CED2", // Gris niebla natural
        secondary: "#DEE2E6", // Gris claro natural
        accent: "#F1F3F5", // Blanco grisáceo tenue
      },
      [Condition.Clear]: {
        primary: "#6CA5D6", // cielo despejado realista
        secondary: "#B4D0EA", // azul claro
        accent: "#EAF2FA", // brillo suave
      },
      [Condition.Humid]: {
        primary: "#97BCD3", // azul húmedo tenue natural
        secondary: "#C4D6E3", // azul pálido
        accent: "#ECF2F6", // luz difusa
      },
      [Condition.Dry]: {
        primary: "#AFC8DA", // cielo pálido y seco
        secondary: "#D7E3ED", // azul muy claro
        accent: "#F3F6F9", // luz alta tenue
      },
      [Condition.Hot]: {
        primary: "#8FB5D7", // cielo pálido y caluroso
        secondary: "#CFE0EE", // azul muy claro lavado por calor
        accent: "#F4EAD0", // bruma cálida en el horizonte
      },
      [Condition.Cold]: {
        primary: "#6F9CCF", // azul frío natural
        secondary: "#BFD5EB", // azul claro frío
        accent: "#E9F2FA", // brillo frío tenue
      },
      [Condition.Hailing]: {
        primary: "#667684", // gris azulado granizo natural
        secondary: "#8F9BA5", // gris medio
        accent: "#CCD3D8", // luz difusa
      },
      [Condition.Rainbow]: {
        primary: "#7BAED9", // cielo limpio tras lluvia
        secondary: "#C7D9EC", // azul claro con nubes
        accent: "#EFF4FA", // luz alta
      },
    }

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

    const baseColors = conditionColors[condition]
    const timeMod = timeModifiers[timeOfDay]
    const seasonMod = seasonModifiers[season]

    // Colores especiales para condiciones nocturnas
    const isNightTime = timeOfDay === TimeOfDay.Night || timeOfDay === TimeOfDay.Midnight
    const nightColors: Record<Condition, { primary: string; secondary: string; accent: string }> = {
      [Condition.Sunny]: {
        primary: "#191970", // Azul medianoche profundo
        secondary: "#000080", // Azul marino oscuro
        accent: "#000033", // Azul muy oscuro
      },
      [Condition.PartlyCloudy]: {
        primary: "#2F2F2F", // Gris muy oscuro
        secondary: "#1C1C1C", // Gris casi negro
        accent: "#0F0F0F", // Casi negro
      },
      [Condition.Cloudy]: {
        primary: "#2F2F2F", // Gris muy oscuro
        secondary: "#1C1C1C", // Gris casi negro
        accent: "#0F0F0F", // Casi negro
      },
      [Condition.Rainy]: {
        primary: "#1A1A2E", // Azul muy oscuro lluvioso
        secondary: "#16213E", // Azul marino oscuro
        accent: "#0F0F23", // Azul casi negro
      },
      [Condition.Stormy]: {
        primary: "#0F0F0F", // Negro tormenta
        secondary: "#1A1A1A", // Gris muy oscuro
        accent: "#000000", // Negro puro
      },
      [Condition.Snowy]: {
        primary: "#1A1A2E", // Azul muy oscuro nevado
        secondary: "#16213E", // Azul marino oscuro
        accent: "#0F0F23", // Azul casi negro
      },
      [Condition.Windy]: {
        primary: "#191970", // Azul medianoche profundo
        secondary: "#000080", // Azul marino oscuro
        accent: "#000033", // Azul muy oscuro
      },
      [Condition.Foggy]: {
        primary: "#2F2F2F", // Gris muy oscuro
        secondary: "#1C1C1C", // Gris casi negro
        accent: "#0F0F0F", // Casi negro
      },
      [Condition.Clear]: {
        primary: "#191970", // Azul medianoche profundo
        secondary: "#000080", // Azul marino oscuro
        accent: "#000033", // Azul muy oscuro
      },
      [Condition.Humid]: {
        primary: "#191970", // Azul medianoche profundo
        secondary: "#000080", // Azul marino oscuro
        accent: "#000033", // Azul muy oscuro
      },
      [Condition.Dry]: {
        primary: "#2F2F2F", // Gris muy oscuro
        secondary: "#1C1C1C", // Gris casi negro
        accent: "#0F0F0F", // Casi negro
      },
      [Condition.Hot]: {
        primary: "#2F2F2F", // Gris muy oscuro
        secondary: "#1C1C1C", // Gris casi negro
        accent: "#0F0F0F", // Casi negro
      },
      [Condition.Cold]: {
        primary: "#191970", // Azul medianoche profundo
        secondary: "#000080", // Azul marino oscuro
        accent: "#000033", // Azul muy oscuro
      },
      [Condition.Hailing]: {
        primary: "#2F2F2F", // Gris muy oscuro
        secondary: "#1C1C1C", // Gris casi negro
        accent: "#0F0F0F", // Casi negro
      },
      [Condition.Rainbow]: {
        primary: "#191970", // Azul medianoche profundo
        secondary: "#000080", // Azul marino oscuro
        accent: "#000033", // Azul muy oscuro
      },
    }

    // Usar colores nocturnos si es de noche
    const finalColors = isNightTime && nightColors[condition] ? nightColors[condition] : baseColors

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
          radial-gradient(120% 90% at 50% -10%, ${primary} 0%, ${secondary} 55%, ${accent} 100%),
          linear-gradient(180deg, ${primary} 0%, ${accent} 100%)
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

    // Aplicar modificadores a los colores (combinando tiempo, estación y condición)
    const modifiedPrimary = applyColorModifiers(finalColors.primary, timeMod, seasonMod)
    const modifiedSecondary = applyColorModifiers(finalColors.secondary, timeMod, seasonMod)
    const modifiedAccent = applyColorModifiers(finalColors.accent, timeMod, seasonMod)

    // Calcular filtros finales combinando todos los modificadores
    const finalBrightness = timeMod.brightness * seasonMod.brightness
    const finalSaturation = timeMod.saturation * seasonMod.saturation
    const finalHue = timeMod.hue + seasonMod.hue

    // Reducción global sutil de saturación en horas diurnas para mayor realismo
    const adjustedSaturation = isNightTime ? finalSaturation : finalSaturation * 0.93
    // Reducción sutil de brillo en horas diurnas
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
      ? `linear-gradient(180deg, rgba(255, 184, 120, 0) 55%, rgba(255, 184, 120, ${horizonWarmthAlpha}) 82%, rgba(255, 184, 120, 0.02) 100%)`
      : ""

    // Contaminación lumínica nocturna (glow cálido en horizonte y ciudad)
    const lightPollutionLayers = isNightTime
      ? [
          `linear-gradient(180deg, transparent 65%, rgba(255, 200, 130, 0.08) 85%, rgba(255, 200, 130, 0.16) 95%, rgba(255, 200, 130, 0.18) 100%)`,
          `radial-gradient(60% 22% at 50% 105%, rgba(255, 200, 140, 0.14) 0%, rgba(255, 200, 140, 0.03) 60%, transparent 100%)`,
        ]
      : []

    // Halo solar (aureola + disco suave)
    const sunParams = getSunParams()
    const sunHaloLayer =
      sunParams && sunParams.halo > 0
        ? `radial-gradient(40% 35% at ${sunParams.x}% ${sunParams.y}%, rgba(255, 220, 160, ${sunParams.halo}) 0%, rgba(255, 220, 160, 0) 60%), radial-gradient(12% 12% at ${sunParams.x}% ${sunParams.y}%, rgba(255, 245, 215, ${sunParams.disc}) 0%, rgba(255, 245, 215, 0) 80%)`
        : ""

    // Dither anti-banding muy sutil (deshabilitado en noche para evitar líneas visibles)
    const ditherLayer = isNightTime
      ? ""
      : `repeating-linear-gradient(45deg, rgba(0,0,0,0.004) 0px, rgba(0,0,0,0.004) 2px, rgba(255,255,255,0.004) 2px, rgba(255,255,255,0.004) 4px)`

    // Construcción de capas finales (de arriba hacia abajo)
    const backgroundLayers = [
      ditherLayer,
      sunHaloLayer,
      horizonWarmthLayer,
      ...lightPollutionLayers,
      createNaturalSkyGradient(modifiedPrimary, modifiedSecondary, modifiedAccent),
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

  const applyColorModifiers = (
    color: string,
    timeMod: { brightness: number; saturation: number; hue: number },
    seasonMod: { saturation: number; hue: number; brightness: number }
  ) => {
    // Convertir hex a HSL para aplicar modificadores
    const hexToHsl = (hex: string) => {
      const r = Number.parseInt(hex.slice(1, 3), 16) / 255
      const g = Number.parseInt(hex.slice(3, 5), 16) / 255
      const b = Number.parseInt(hex.slice(5, 7), 16) / 255

      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h = 0
      let s = 0
      const l = (max + min) / 2

      if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0)
            break
          case g:
            h = (b - r) / d + 2
            break
          case b:
            h = (r - g) / d + 4
            break
        }
        h /= 6
      }
      return [h * 360, s * 100, l * 100]
    }

    const hslToHex = (h: number, s: number, l: number) => {
      h = h / 360
      s = s / 100
      l = l / 100

      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      let r, g, b
      if (s === 0) {
        r = g = b = l
      } else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1 / 3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1 / 3)
      }

      const toHex = (c: number) => {
        const hex = Math.round(c * 255).toString(16)
        return hex.length === 1 ? "0" + hex : hex
      }

      return `#${toHex(r)}${toHex(g)}${toHex(b)}`
    }

    const [h, s, l] = hexToHsl(color)

    // Combinar modificadores de tiempo y estación
    const combinedHue = (h + timeMod.hue + seasonMod.hue) % 360
    const combinedSaturation = Math.min(100, s * timeMod.saturation * seasonMod.saturation)
    const combinedLightness = Math.min(100, l * timeMod.brightness * seasonMod.brightness)

    return hslToHex(combinedHue, combinedSaturation, combinedLightness)
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
