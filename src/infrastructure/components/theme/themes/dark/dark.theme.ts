import { toKebabCase } from "@/infrastructure/utils"
import { ThemeMode } from "../../theme.type"
import { darkColor } from "./dark.color"
import { useDarkThemeStore } from "./dark.store"

import type { Theme, ThemeInstance } from "../../theme.interface"

const createDarkThemeInstance = (): ThemeInstance => ({
  name: ThemeMode.DARK,

  activate: async () => {
    const colors = await darkColor()
    const root = document.documentElement

    Object.entries(colors).forEach(([key, value]) => {
      const cssVar = `--${toKebabCase(key)}`
      root.style.setProperty(cssVar, value)
    })

    root.setAttribute("data-theme", ThemeMode.DARK)
    useDarkThemeStore.getState().activate()
  },

  deactivate: async () => {
    const colors = await darkColor()
    const root = document.documentElement

    Object.keys(colors).forEach((key) => {
      const cssVar = `--${toKebabCase(key)}`
      root.style.removeProperty(cssVar)
    })

    root.removeAttribute("data-theme")
    useDarkThemeStore.getState().deactivate()
  },
})

export const darkTheme: Theme = {
  name: ThemeMode.DARK,
  createInstance: createDarkThemeInstance,
}
