import type { Theme } from "../../theme.interface"
import { ThemeMode } from "../../theme.type"
import { darkColor } from "./dark.color"
import { darkProvider } from "./dark.provider"

export const darkTheme: Theme = {
  name: ThemeMode.DARK,
  colors: darkColor,
  provider: darkProvider,
}
