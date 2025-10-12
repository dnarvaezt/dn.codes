"use client"

import type { ThemeProviderProps } from "../../theme.interface"

export const DarkProvider = ({ children }: ThemeProviderProps) => {
  return <>{children}</>
}

export const darkProvider = DarkProvider
