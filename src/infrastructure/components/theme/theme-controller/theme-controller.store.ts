import { create } from "zustand"
import { persist } from "zustand/middleware"
import { ThemeKey, ThemeMode, ThemeSkin, toThemeKey } from "../theme.type"

import type { ThemeInstance } from "../theme.interface"

interface ThemeControllerState {
  mode: ThemeMode
  skin: ThemeSkin
  currentInstance: ThemeInstance | null
  registeredThemes: Map<ThemeKey, ThemeInstance>
  registerTheme: (instance: ThemeInstance) => void
  setTheme: (mode: ThemeMode) => Promise<void>
  setSkin: (skin: ThemeSkin) => Promise<void>
  getCurrentTheme: () => ThemeInstance | null
}

const getSystemThemeMode = (): ThemeMode => {
  if (globalThis.window === undefined) return ThemeMode.LIGHT

  const isDark = globalThis.matchMedia("(prefers-color-scheme: dark)").matches
  return isDark ? ThemeMode.DARK : ThemeMode.LIGHT
}

export const useThemeControllerStore = create<ThemeControllerState>()(
  persist(
    (set, get) => ({
      mode: ThemeMode.LIGHT,
      skin: ThemeSkin.FLAT,
      currentInstance: null,
      registeredThemes: new Map(),

      registerTheme: (instance: ThemeInstance) => {
        const themes = get().registeredThemes
        const key = toThemeKey(instance.skin, instance.name)
        themes.set(key, instance)
        set({ registeredThemes: themes })
      },

      setTheme: async (mode: ThemeMode) => {
        const currentInstance = get().currentInstance
        const registeredThemes = get().registeredThemes
        const skin = get().skin

        if (currentInstance) {
          await currentInstance.deactivate()
        }

        const resolvedMode = mode === ThemeMode.SYSTEM ? getSystemThemeMode() : mode
        const newInstance = registeredThemes.get(toThemeKey(skin, resolvedMode))

        if (newInstance) {
          await newInstance.activate()
          set({ mode, currentInstance: newInstance })
        }
      },

      setSkin: async (skin: ThemeSkin) => {
        const currentInstance = get().currentInstance
        const registeredThemes = get().registeredThemes
        const mode = get().mode

        if (currentInstance) {
          await currentInstance.deactivate()
        }

        const resolvedMode = mode === ThemeMode.SYSTEM ? getSystemThemeMode() : mode
        const newInstance = registeredThemes.get(toThemeKey(skin, resolvedMode))

        if (newInstance) {
          await newInstance.activate()
          set({ skin, currentInstance: newInstance })
        } else {
          set({ skin })
        }
      },

      getCurrentTheme: () => {
        return get().currentInstance
      },
    }),
    {
      name: "theme-controller-storage",
      partialize: (state) => ({ mode: state.mode, skin: state.skin }),
      onRehydrateStorage: () => async (state) => {
        if (state) {
          await state.setTheme(state.mode)
        }
      },
    }
  )
)
