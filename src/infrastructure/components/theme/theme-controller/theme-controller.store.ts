import { create } from "zustand"
import { persist } from "zustand/middleware"
import { ThemeMode } from "../theme.type"

import type { ThemeInstance } from "../theme.interface"

interface ThemeControllerState {
  mode: ThemeMode
  currentInstance: ThemeInstance | null
  registeredThemes: Map<ThemeMode, ThemeInstance>
  registerTheme: (instance: ThemeInstance) => void
  setTheme: (mode: ThemeMode) => Promise<void>
  getCurrentTheme: () => ThemeInstance | null
}

const getSystemThemeMode = (): ThemeMode => {
  if (typeof window === "undefined") return ThemeMode.LIGHT

  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
  return isDark ? ThemeMode.DARK : ThemeMode.LIGHT
}

export const useThemeControllerStore = create<ThemeControllerState>()(
  persist(
    (set, get) => ({
      mode: ThemeMode.LIGHT,
      currentInstance: null,
      registeredThemes: new Map(),

      registerTheme: (instance: ThemeInstance) => {
        const themes = get().registeredThemes
        themes.set(instance.name, instance)
        set({ registeredThemes: themes })
      },

      setTheme: async (mode: ThemeMode) => {
        const currentInstance = get().currentInstance
        const registeredThemes = get().registeredThemes

        if (currentInstance) {
          await currentInstance.deactivate()
        }

        const resolvedMode = mode === ThemeMode.SYSTEM ? getSystemThemeMode() : mode
        const newInstance = registeredThemes.get(resolvedMode)

        if (newInstance) {
          await newInstance.activate()
          set({ mode, currentInstance: newInstance })
        }
      },

      getCurrentTheme: () => {
        return get().currentInstance
      },
    }),
    {
      name: "theme-controller-storage",
      partialize: (state) => ({ mode: state.mode }),
      onRehydrateStorage: () => async (state) => {
        if (state) {
          await state.setTheme(state.mode)
        }
      },
    }
  )
)
