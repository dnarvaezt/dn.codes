import { create, StoreApi, UseBoundStore } from "zustand"

interface ThemeState {
  isActive: boolean
  activate: () => void
  deactivate: () => void
}

export const createThemeStore = (): UseBoundStore<StoreApi<ThemeState>> =>
  create<ThemeState>((set) => ({
    isActive: false,
    activate: () => set({ isActive: true }),
    deactivate: () => set({ isActive: false }),
  }))
