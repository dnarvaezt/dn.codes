import { toKebabCase } from "@/infrastructure/utils"

import type { ThemeColors, ThemeInstance } from "./theme.interface"
import type { ThemeMode } from "./theme.type"

interface CreateThemeInstanceOptions {
  mode: ThemeMode
  getColors: () => Promise<ThemeColors>
  onActivate?: () => void
  onDeactivate?: () => void
}

export const createThemeInstance = ({
  mode,
  getColors,
  onActivate,
  onDeactivate,
}: CreateThemeInstanceOptions): ThemeInstance => ({
  name: mode,

  activate: async () => {
    const colors = await getColors()
    const root = document.documentElement

    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = `--${toKebabCase(key)}`
      root.style.setProperty(cssVar, value)
    })

    root.setAttribute("data-theme", mode)
    onActivate?.()
  },

  deactivate: async () => {
    const colors = await getColors()
    const root = document.documentElement

    Object.keys(colors).forEach((key) => {
      const cssVar = `--${toKebabCase(key)}`
      root.style.removeProperty(cssVar)
    })

    root.removeAttribute("data-theme")
    onDeactivate?.()
  },
})
