import { useEffect, useState } from "react"

export const useLocalTime = (offsetMinutes: number): string => {
  const [localTime, setLocalTime] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const utcTime = now.getTime() + now.getTimezoneOffset() * 60000
      const localDate = new Date(utcTime + offsetMinutes * 60000)

      const hours = localDate.getHours().toString().padStart(2, "0")
      const minutes = localDate.getMinutes().toString().padStart(2, "0")

      setLocalTime(`${hours}:${minutes}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [offsetMinutes])

  return localTime
}
