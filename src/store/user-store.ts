import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface UserState {
  user: User | null
  isLoading: boolean
  error: string | null
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,
      setUser: (user) => set({ user }),
      login: async (email: string, _password: string) => {
        set({ isLoading: true, error: null })
        try {
          // Simulated API call - replace with actual authentication
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const mockUser: User = {
            id: "1",
            name: "Demo User",
            email,
            avatar: "https://github.com/shadcn.png",
          }

          set({ user: mockUser, isLoading: false })
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : "Login failed"
          set({ error: errorMessage, isLoading: false })
        }
      },
      logout: () => set({ user: null, error: null }),
    }),
    { name: "user-store" }
  )
)
