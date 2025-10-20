export enum ThemeMode {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export enum ThemeSkin {
  FLAT = "flat",
  // Futuras pieles: MATERIAL = "material"
}

export type ThemeKey = `${ThemeSkin}:${ThemeMode}`

export const toThemeKey = (skin: ThemeSkin, mode: ThemeMode): ThemeKey => `${skin}:${mode}`
