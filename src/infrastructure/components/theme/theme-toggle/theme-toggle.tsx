"use client"

import { Button } from "@/infrastructure/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/infrastructure/components/ui/dropdown-menu"
import { Moon, Sun } from "lucide-react"
import { useThemeControllerStore } from "../theme-controller"
import { ThemeMode } from "../theme.type"
import "./theme-toggle.scss"

export const ThemeToggle = () => {
  const mode = useThemeControllerStore((state) => state.mode)
  const setTheme = useThemeControllerStore((state) => state.setTheme)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="theme-toggle">
          <Sun className="theme-toggle__icon theme-toggle__icon--light" />
          <Moon className="theme-toggle__icon theme-toggle__icon--dark" />
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="theme-toggle__content">
        <DropdownMenuRadioGroup
          value={mode}
          onValueChange={(value) => setTheme(value as ThemeMode)}
        >
          <DropdownMenuRadioItem value={ThemeMode.LIGHT}>
            <Sun className="theme-toggle__menu-icon" />
            Claro
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={ThemeMode.DARK}>
            <Moon className="theme-toggle__menu-icon" />
            Oscuro
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value={ThemeMode.SYSTEM}>
            <span className="theme-toggle__menu-icon">💻</span>Sistema
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
