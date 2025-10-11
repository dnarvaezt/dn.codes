import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Theme = "light" | "dark" | "system"

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "system",
      setTheme: (theme: Theme) => {
        set({ theme })
        applyTheme(theme)
      },
      toggleTheme: () => {
        const current = get().theme
        const newTheme = current === "light" ? "dark" : "light"
        set({ theme: newTheme })
        applyTheme(newTheme)
      },
    }),
    {
      name: "theme-storage",
    }
  )
)

const applyTheme = (theme: Theme) => {
  if (typeof window === "undefined") return

  const root = window.document.documentElement
  root.removeAttribute("data-theme")

  if (theme === "system") {
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    root.setAttribute("data-theme", systemTheme)
  } else {
    root.setAttribute("data-theme", theme)
  }
}
