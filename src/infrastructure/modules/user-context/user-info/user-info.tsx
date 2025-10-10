"use client"

import { useUserInfo } from "./user-info.hook"
import "./user-info.scss"

export const UserInfo = () => {
  const { city, timezone, language, isInitialized, isLoading } = useUserInfo()

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
