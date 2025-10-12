"use client"

import { ReactNode, useEffect } from "react"
import { useThemeStore } from "./theme.store"
import { ThemeMode } from "./theme.type"

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const currentTheme = useThemeStore((state) => state.currentTheme)
  const setTheme = useThemeStore((state) => state.setTheme)

  useEffect(() => {
    const storedMode = useThemeStore.getState().mode
    setTheme(storedMode)
  }, [setTheme])

  useEffect(() => {
    const handleSystemThemeChange = () => {
      if (useThemeStore.getState().mode === ThemeMode.SYSTEM) {
        setTheme(ThemeMode.SYSTEM)
      }
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    mediaQuery.addEventListener("change", handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange)
    }
  }, [setTheme])

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "theme-storage" && e.newValue) {
        try {
          const stored = JSON.parse(e.newValue)
          const newMode = stored.state?.mode as ThemeMode

          if (newMode && useThemeStore.getState().mode !== newMode) {
            setTheme(newMode)
          }
        } catch (error) {
          console.error("Error syncing theme across tabs:", error)
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [setTheme])

  const ThemeSpecificProvider = currentTheme.provider

  if (ThemeSpecificProvider) {
    return <ThemeSpecificProvider>{children}</ThemeSpecificProvider>
  }

  return <>{children}</>
}
