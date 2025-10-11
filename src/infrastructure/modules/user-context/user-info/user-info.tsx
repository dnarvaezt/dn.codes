"use client"

import { useUserContextStore } from "@/infrastructure/modules/user-context/user-context-store"
import { useLocalTime } from "./use-local-time"
import "./user-info.scss"

export const UserInfo = () => {
  const city = useUserContextStore((state) => state.city)
  const timezone = useUserContextStore((state) => state.timezone)
  const language = useUserContextStore((state) => state.language)
  const isInitialized = useUserContextStore((state) => state.isInitialized)
  const isLoading = useUserContextStore((state) => state.isLoading)
  const localTime = useLocalTime(timezone?.offset ?? 0)

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
          {timezone && localTime && (
            <>
              <span className="user-info__separator">•</span>
              <span>🕐 {localTime}</span>
            </>
          )}
          <span className="user-info__separator">•</span>
          <span>🌐 {language.language.toUpperCase()}</span>
        </>
      )}
    </div>
  )
}
