import { useUserContextStore } from "@/infrastructure/store"

export const useUserInfo = () => {
  const city = useUserContextStore((state) => state.city)
  const timezone = useUserContextStore((state) => state.timezone)
  const language = useUserContextStore((state) => state.language)
  const isInitialized = useUserContextStore((state) => state.isInitialized)
  const isLoading = useUserContextStore((state) => state.isLoading)

  return {
    city,
    timezone,
    language,
    isInitialized,
    isLoading,
  }
}
