import { ComponentType, ReactNode } from "react"
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

export interface ThemeProviderProps {
  children: ReactNode
}

export interface Theme {
  name: ThemeMode
  colors: () => Promise<ThemeColors>
  provider?: ComponentType<ThemeProviderProps>
}

export interface ThemeStrategy {
  apply(theme: Theme): Promise<void>
  remove(): Promise<void>
}
