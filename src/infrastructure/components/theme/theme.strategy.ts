import type { Theme, ThemeColors, ThemeStrategy } from "./theme.interface"

const themeColorKeys: Array<keyof ThemeColors> = [
  "background",
  "foreground",
  "card",
  "cardForeground",
  "popover",
  "popoverForeground",
  "primary",
  "primaryForeground",
  "secondary",
  "secondaryForeground",
  "muted",
  "mutedForeground",
  "accent",
  "accentForeground",
  "destructive",
  "destructiveForeground",
  "border",
  "input",
  "ring",
]

const camelToKebab = (str: string): string => {
  return str.replace(/([A-Z])/g, "-$1").toLowerCase()
}

export class DOMThemeStrategy implements ThemeStrategy {
  async apply(theme: Theme): Promise<void> {
    const root = document.documentElement
    const colors = await theme.colors()

    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = `--${camelToKebab(key)}`
      root.style.setProperty(cssVar, value)
    })

    root.setAttribute("data-theme", theme.name)
  }

  async remove(): Promise<void> {
    const root = document.documentElement

    themeColorKeys.forEach((key) => {
      const cssVar = `--${camelToKebab(key)}`
      root.style.removeProperty(cssVar)
    })

    root.removeAttribute("data-theme")
  }
}
