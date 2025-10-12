"use client"

import type { ThemeProviderProps } from "../../theme.interface"

export const lightProvider = ({ children }: ThemeProviderProps) => {
  return <>{children}</>
}
