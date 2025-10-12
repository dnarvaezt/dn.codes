import { create } from "zustand"
import { persist } from "zustand/middleware"
import { DOMThemeStrategy } from "../theme.strategy"
import { ThemeMode } from "../theme.type"
import { darkTheme, lightTheme } from "../themes"

import type { Theme } from "../theme.interface"
interface ThemeState {
  currentTheme: Theme
  mode: ThemeMode
  setTheme: (mode: ThemeMode) => void
}

const getSystemTheme = (): Theme => {
  if (typeof window === "undefined") return lightTheme

  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  return isDark ? darkTheme : lightTheme
}

const getThemeByMode = (mode: ThemeMode): Theme => {
  if (mode === ThemeMode.SYSTEM) return getSystemTheme()
  return mode === ThemeMode.DARK ? darkTheme : lightTheme
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => {
      const strategy = new DOMThemeStrategy()

      return {
        currentTheme: lightTheme,
        mode: ThemeMode.LIGHT,

        setTheme: (mode: ThemeMode) => {
          const theme = getThemeByMode(mode)
          strategy.apply(theme)
          set({ currentTheme: theme, mode })
        },
      }
    },
    {
      name: "theme-storage",
      partialize: (state) => ({ mode: state.mode }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const theme = getThemeByMode(state.mode)
          const strategy = new DOMThemeStrategy()
          strategy.apply(theme)
        }
      },
    }
  )
)
