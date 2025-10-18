import { Condition, Season, TimeOfDay } from "@/application/domain/weather/weather.enum"
import { WeatherScenario } from "@/application/domain/weather/weather.model"
import { useWeatherStore } from "@/infrastructure/components/weather/weather-store"
import "./weather-background.scss"

export const WeatherBackground = () => {
  const { weather, isLoading } = useWeatherStore()

  const getBackgroundStyle = (scenario: WeatherScenario) => {
    const { season, timeOfDay, condition } = scenario

    // Colores base por condición climática (Colores realistas del cielo)
    const conditionColors = {
      [Condition.Sunny]: {
        primary: "#87CEEB", // Azul cielo claro real
        secondary: "#B0E0E6", // Azul cielo medio real
        accent: "#F0F8FF", // Blanco azulado real
      },
      [Condition.PartlyCloudy]: {
        primary: "#87CEEB", // Azul cielo real
        secondary: "#E6F3FF", // Blanco azulado suave real
        accent: "#F8F9FA", // Blanco nube real
      },
      [Condition.Cloudy]: {
        primary: "#B0C4DE", // Gris azulado real
        secondary: "#D3D3D3", // Gris claro real
        accent: "#F5F5F5", // Blanco grisáceo real
      },
      [Condition.Rainy]: {
        primary: "#708090", // Gris azulado oscuro real
        secondary: "#A9A9A9", // Gris medio real
        accent: "#D3D3D3", // Gris claro real
      },
      [Condition.Stormy]: {
        primary: "#2F4F4F", // Gris oscuro tormenta real
        secondary: "#696969", // Gris medio real
        accent: "#A9A9A9", // Gris claro real
      },
      [Condition.Snowy]: {
        primary: "#E6F3FF", // Blanco azulado real
        secondary: "#F0F8FF", // Blanco nieve real
        accent: "#FFFFFF", // Blanco puro real
      },
      [Condition.Windy]: {
        primary: "#87CEEB", // Azul cielo real
        secondary: "#B0E0E6", // Azul cielo claro real
        accent: "#E6F3FF", // Blanco azulado real
      },
      [Condition.Foggy]: {
        primary: "#D3D3D3", // Gris niebla real
        secondary: "#E6E6E6", // Gris claro real
        accent: "#F5F5F5", // Blanco grisáceo real
      },
      [Condition.Clear]: {
        primary: "#87CEEB", // Azul cielo claro real
        secondary: "#B0E0E6", // Azul cielo medio real
        accent: "#F0F8FF", // Blanco azulado real
      },
      [Condition.Humid]: {
        primary: "#98FB98", // Verde pálido real
        secondary: "#B0E0E6", // Azul cielo real
        accent: "#F0F8FF", // Blanco azulado real
      },
      [Condition.Dry]: {
        primary: "#F4A460", // Marrón arena real
        secondary: "#DEB887", // Marrón trigo real
        accent: "#F5DEB3", // Marrón claro real
      },
      [Condition.Hot]: {
        primary: "#FF6347", // Rojo tomate real
        secondary: "#FFD700", // Amarillo dorado real
        accent: "#FFA500", // Naranja real
      },
      [Condition.Cold]: {
        primary: "#B0C4DE", // Azul acero claro real
        secondary: "#E6E6FA", // Lavanda real
        accent: "#F0F8FF", // Blanco azulado real
      },
      [Condition.Hailing]: {
        primary: "#708090", // Gris pizarra real
        secondary: "#A9A9A9", // Gris medio real
        accent: "#D3D3D3", // Gris claro real
      },
      [Condition.Rainbow]: {
        primary: "#FF6B6B", // Rojo coral real
        secondary: "#4ECDC4", // Turquesa real
        accent: "#45B7D1", // Azul cielo real
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

    // Modificadores por estación (colores realistas del cielo)
    const seasonModifiers = {
      [Season.Spring]: { saturation: 1.1, hue: 5, brightness: 1 }, // Primavera fresca
      [Season.Summer]: { saturation: 1, hue: 0, brightness: 1.1 }, // Verano brillante
      [Season.Autumn]: { saturation: 1.1, hue: 15, brightness: 0.9 }, // Otoño cálido
      [Season.Winter]: { saturation: 0.9, hue: 0, brightness: 0.8 }, // Invierno frío
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

    // Crear degradado natural del cielo con múltiples capas
    const createNaturalSkyGradient = (primary: string, secondary: string, accent: string) => {
      if (isNightTime) {
        // Degradado nocturno más natural
        return `
          radial-gradient(ellipse at top, ${primary} 0%, ${secondary} 40%, ${accent} 100%),
          linear-gradient(180deg, ${primary} 0%, ${accent} 100%)
        `
      }

      // Degradados específicos por condición climática
      switch (condition) {
        case Condition.Sunny:
        case Condition.Clear:
          return `
            radial-gradient(ellipse 150% 120% at 50% 0%, ${accent} 0%, transparent 60%),
            radial-gradient(ellipse 100% 80% at 30% 15%, ${secondary} 0%, transparent 50%),
            radial-gradient(ellipse 120% 100% at 70% 25%, ${primary} 0%, transparent 70%),
            linear-gradient(180deg, ${primary} 0%, ${secondary} 60%, ${accent} 100%)
          `

        case Condition.PartlyCloudy:
          return `
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

    return {
      background: createNaturalSkyGradient(modifiedPrimary, modifiedSecondary, modifiedAccent),
      filter: `brightness(${finalBrightness}) saturate(${finalSaturation}) hue-rotate(${finalHue}deg)`,
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
