"use client"

import { useUserContextStore } from "@/presentation/store"

export const UserInfo = () => {
  const city = useUserContextStore((state) => state.city)
  const timezone = useUserContextStore((state) => state.timezone)
  const language = useUserContextStore((state) => state.language)
  const isInitialized = useUserContextStore((state) => state.isInitialized)
  const isLoading = useUserContextStore((state) => state.isLoading)

  if (isLoading) {
    return (
      <div className="user-info">
        <p className="text-muted-foreground">Detectando tu ubicación...</p>
      </div>
    )
  }

  if (!isInitialized) {
    return null
  }

  return (
    <div className="user-info">
      {city && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>📍</span>
          <span>
            {city.city}, {city.country}
          </span>
          {timezone && (
            <>
              <span className="text-muted">•</span>
              <span>🕐 {timezone.timezone}</span>
            </>
          )}
          <span className="text-muted">•</span>
          <span>🌐 {language.language.toUpperCase()}</span>
        </div>
      )}
    </div>
  )
}
