import type { Theme, ThemeStrategy } from "./theme.interface"

export class DOMThemeStrategy implements ThemeStrategy {
  apply(theme: Theme): void {
    const root = document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme.name)
  }

  remove(): void {
    const root = document.documentElement
    root.classList.remove("light", "dark")
  }
}
