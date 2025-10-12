import { create } from "zustand"

interface LightThemeState {
  isActive: boolean
  activate: () => void
  deactivate: () => void
}

export const useLightThemeStore = create<LightThemeState>((set) => ({
  isActive: false,
  activate: () => set({ isActive: true }),
  deactivate: () => set({ isActive: false }),
}))
