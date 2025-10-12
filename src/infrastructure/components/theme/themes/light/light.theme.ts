import { toKebabCase } from "@/infrastructure/utils"
import { ThemeMode } from "../../theme.type"
import { lightColor } from "./light.color"
import { useLightThemeStore } from "./light.store"

import type { Theme, ThemeInstance } from "../../theme.interface"

const createLightThemeInstance = (): ThemeInstance => ({
  name: ThemeMode.LIGHT,

  activate: async () => {
    const colors = await lightColor()
    const root = document.documentElement

    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = `--${toKebabCase(key)}`
      root.style.setProperty(cssVar, value)
    })

    root.setAttribute("data-theme", ThemeMode.LIGHT)
    useLightThemeStore.getState().activate()
  },

  deactivate: async () => {
    const colors = await lightColor()
    const root = document.documentElement

    Object.keys(colors).forEach((key) => {
      const cssVar = `--${toKebabCase(key)}`
      root.style.removeProperty(cssVar)
    })

    root.removeAttribute("data-theme")
    useLightThemeStore.getState().deactivate()
  },
})

export const lightTheme: Theme = {
  name: ThemeMode.LIGHT,
  createInstance: createLightThemeInstance,
}
