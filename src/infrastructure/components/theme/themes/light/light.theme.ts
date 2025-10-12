import type { Theme } from "../../theme.interface"
import { ThemeMode } from "../../theme.type"
import { lightColor } from "./light.color"
import { lightProvider } from "./light.provider"

export const lightTheme: Theme = {
  name: ThemeMode.LIGHT,
  colors: lightColor,
  provider: lightProvider,
}
