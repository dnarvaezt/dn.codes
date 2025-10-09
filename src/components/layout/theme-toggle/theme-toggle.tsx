"use client"

import { Button } from "@/components/ui"
import { useThemeStore } from "@/store"
import { Moon, Sun } from "lucide-react"
import { useEffect } from "react"

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeStore()

  useEffect(() => {
    // Apply theme on mount
    const root = window.document.documentElement
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const appliedTheme = theme === "system" ? systemTheme : theme
    root.setAttribute("data-theme", appliedTheme)
  }, [theme])

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  )
}
