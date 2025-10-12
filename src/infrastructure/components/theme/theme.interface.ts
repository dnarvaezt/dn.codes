import { ThemeMode } from "./theme.type"

export interface ThemeColors {
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
}

export interface ThemeInstance {
  name: ThemeMode
  activate: () => Promise<void>
  deactivate: () => Promise<void>
}

export interface Theme {
  name: ThemeMode
  createInstance: () => ThemeInstance
}
