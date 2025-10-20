import { ThemeMode, ThemeSkin } from "../../theme.type"
import { createThemeInstance } from "../../theme.utils"
import { lightColor } from "./light.color"
import { useLightThemeStore } from "./light.store"

import type { Theme } from "../../theme.interface"

export const lightTheme: Theme = {
  name: ThemeMode.LIGHT,
  skin: ThemeSkin.FLAT,
  createInstance: () =>
    createThemeInstance({
      mode: ThemeMode.LIGHT,
      skin: ThemeSkin.FLAT,
      getColors: lightColor,
      onActivate: () => useLightThemeStore.getState().activate(),
      onDeactivate: () => useLightThemeStore.getState().deactivate(),
    }),
}
