import { toKebabCase } from "@/infrastructure/utils"

import type { ThemeColors, ThemeInstance } from "./theme.interface"
import type { ThemeMode, ThemeSkin } from "./theme.type"

interface CreateThemeInstanceOptions {
  mode: ThemeMode
  skin: ThemeSkin
  getColors: () => Promise<ThemeColors>
  onActivate?: () => void
  onDeactivate?: () => void
}

export const createThemeInstance = ({
  mode,
  skin,
  getColors,
  onActivate,
  onDeactivate,
}: CreateThemeInstanceOptions): ThemeInstance => ({
  name: mode,
  skin,

  activate: async () => {
    const colors = await getColors()
    const root = document.documentElement

    for (const [key, value] of Object.entries(colors)) {
      const cssVar = `--${toKebabCase(key)}`
      root.style.setProperty(cssVar, value)
    }

    root.dataset.theme = mode
    root.dataset.skin = skin
    onActivate?.()
  },

  deactivate: async () => {
    const colors = await getColors()
    const root = document.documentElement

    for (const key of Object.keys(colors)) {
      const cssVar = `--${toKebabCase(key)}`
      root.style.removeProperty(cssVar)
    }

    delete root.dataset.theme
    delete root.dataset.skin
    onDeactivate?.()
  },
})
