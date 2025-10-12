import { create } from "zustand"

interface DarkThemeState {
  isActive: boolean
  activate: () => void
  deactivate: () => void
}

export const useDarkThemeStore = create<DarkThemeState>((set) => ({
  isActive: false,
  activate: () => set({ isActive: true }),
  deactivate: () => set({ isActive: false }),
}))
