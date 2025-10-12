"use client"

import { ReactNode, useEffect } from "react"
import { ThemeMode } from "../theme.type"
import { darkTheme, lightTheme } from "../themes"
import { useThemeControllerStore } from "./theme-controller.store"

export const ThemeControllerProvider = ({ children }: { children: ReactNode }) => {
  const registerTheme = useThemeControllerStore((state) => state.registerTheme)
  const setTheme = useThemeControllerStore((state) => state.setTheme)
  const mode = useThemeControllerStore((state) => state.mode)

  useEffect(() => {
    ;[darkTheme, lightTheme].forEach((theme) => registerTheme(theme.createInstance()))
  }, [registerTheme])

  useEffect(() => {
    setTheme(mode)
  }, [setTheme, mode])

  useEffect(() => {
    const handleSystemThemeChange = () => {
      if (useThemeControllerStore.getState().mode === ThemeMode.SYSTEM) {
        setTheme(ThemeMode.SYSTEM)
      }
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", handleSystemThemeChange)

    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange)
  }, [setTheme])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme-controller-storage" && e.newValue) {
        try {
          const stored = JSON.parse(e.newValue)
          const newMode = stored.state?.mode as ThemeMode

          if (newMode && useThemeControllerStore.getState().mode !== newMode) {
            setTheme(newMode)
          }
        } catch {
          // Silently fail on sync errors
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [setTheme])

  return <>{children}</>
}
