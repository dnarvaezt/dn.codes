"use client"

import { useUserContextStore } from "@/infrastructure/modules/user-context/user-context-store"
import "./user-info.scss"

export const UserInfo = () => {
  const city = useUserContextStore((state) => state.city)
  const timezone = useUserContextStore((state) => state.timezone)
  const language = useUserContextStore((state) => state.language)
  const isInitialized = useUserContextStore((state) => state.isInitialized)
  const isLoading = useUserContextStore((state) => state.isLoading)

  if (isLoading) {
    return (
      <div className="user-info">
        <p className="user-info__loading">Detectando tu ubicación...</p>
      </div>
    )
  }

  if (!isInitialized) {
    return null
  }

  return (
    <div className="user-info">
      {city && (
        <>
          <span>📍</span>
          <span>
            {city.city}, {city.country}
          </span>
          {timezone && (
            <>
              <span className="user-info__separator">•</span>
              <span>🕐 {timezone.timezone}</span>
            </>
          )}
          <span className="user-info__separator">•</span>
          <span>🌐 {language.language.toUpperCase()}</span>
        </>
      )}
    </div>
  )
}
