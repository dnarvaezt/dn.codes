import { ThemeMode, ThemeSkin } from "../../theme.type"
import { createThemeInstance } from "../../theme.utils"
import { darkColor } from "./dark.color"
import { useDarkThemeStore } from "./dark.store"

import type { Theme } from "../../theme.interface"

export const darkTheme: Theme = {
  name: ThemeMode.DARK,
  skin: ThemeSkin.FLAT,
  createInstance: () =>
    createThemeInstance({
      mode: ThemeMode.DARK,
      skin: ThemeSkin.FLAT,
      getColors: darkColor,
      onActivate: () => useDarkThemeStore.getState().activate(),
      onDeactivate: () => useDarkThemeStore.getState().deactivate(),
    }),
}
