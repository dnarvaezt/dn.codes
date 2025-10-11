import { TimezoneInfo } from "./timezone.model"

interface TimezoneRepository {
  getTimezone(): TimezoneInfo
  getTimezoneByCoordinates(latitude: number, longitude: number): Promise<TimezoneInfo>
}

class TimezoneError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "TimezoneError"
  }
}

const DEFAULT_TIMEZONE: TimezoneInfo = {
  timezone: "UTC",
  offset: 0,
  offsetString: "+00:00",
  locale: "en-US",
  isManual: false,
  detectionMethod: "browser",
  isDST: false,
}

export class TimezoneRepositoryBrowser implements TimezoneRepository {
  private isSupported(): boolean {
    return typeof Intl !== "undefined" && typeof Intl.DateTimeFormat === "function"
  }

  private getOffset(): number {
    return -new Date().getTimezoneOffset()
  }

  private getOffsetString(): string {
    const offset = this.getOffset()
    const sign = offset >= 0 ? "+" : "-"
    const absOffset = Math.abs(offset)
    const hours = Math.floor(absOffset / 60)
    const minutes = absOffset % 60

    return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
  }

  private getTimezoneName(): string {
    if (!this.isSupported()) {
      throw new TimezoneError("Intl.DateTimeFormat no está soportado en este navegador")
    }

    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  private getUserLocale(): string {
    return typeof navigator !== "undefined" ? navigator.language || "en-US" : "en-US"
  }

  public getTimezone(): TimezoneInfo {
    try {
      const timezone = this.getTimezoneName()
      return {
        timezone,
        offset: this.getOffset(),
        offsetString: this.getOffsetString(),
        locale: this.getUserLocale(),
        isManual: false,
        detectionMethod: "browser",
        isDST: this.isDaylightSavingTime(timezone),
      }
    } catch (error) {
      if (error instanceof TimezoneError) {
        throw error
      }
      return { ...DEFAULT_TIMEZONE }
    }
  }

  private getOffsetForTimezone(timezone: string): number {
    try {
      const date = new Date()
      const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }))
      const tzDate = new Date(date.toLocaleString("en-US", { timeZone: timezone }))
      return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60)
    } catch {
      return 0
    }
  }

  private getOffsetStringForTimezone(timezone: string): string {
    const offset = this.getOffsetForTimezone(timezone)
    const sign = offset >= 0 ? "+" : "-"
    const absOffset = Math.abs(offset)
    const hours = Math.floor(absOffset / 60)
    const minutes = absOffset % 60

    return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
  }

  private isDaylightSavingTime(timezone: string): boolean {
    try {
      const january = new Date(new Date().getFullYear(), 0, 1)
      const july = new Date(new Date().getFullYear(), 6, 1)

      const janOffset = this.getOffsetForTimezoneAtDate(timezone, january)
      const julOffset = this.getOffsetForTimezoneAtDate(timezone, july)

      const currentOffset = this.getOffsetForTimezone(timezone)

      return currentOffset !== Math.min(janOffset, julOffset)
    } catch {
      return false
    }
  }

  private getOffsetForTimezoneAtDate(timezone: string, date: Date): number {
    try {
      const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }))
      const tzDate = new Date(date.toLocaleString("en-US", { timeZone: timezone }))
      return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60)
    } catch {
      return 0
    }
  }

  private async fetchTimezoneFromAPI(latitude: number, longitude: number): Promise<string | null> {
    const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY

    if (!apiKey) {
      return null
    }

    try {
      const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`
      const response = await fetch(url)

      if (!response.ok) {
        return null
      }

      const data = await response.json()

      if (data?.features?.[0]?.properties?.timezone?.name) {
        return data.features[0].properties.timezone.name
      }

      return null
    } catch {
      return null
    }
  }

  private findClosestTimezone(latitude: number, longitude: number): string {
    const offsetHours = Math.round(longitude / 15)
    return offsetHours >= 0 ? `Etc/GMT-${offsetHours}` : `Etc/GMT+${Math.abs(offsetHours)}`
  }

  public async getTimezoneByCoordinates(
    latitude: number,
    longitude: number
  ): Promise<TimezoneInfo> {
    try {
      let timezone = await this.fetchTimezoneFromAPI(latitude, longitude)

      if (!timezone) {
        timezone = this.findClosestTimezone(latitude, longitude)
      }

      const offset = this.getOffsetForTimezone(timezone)
      const isDST = this.isDaylightSavingTime(timezone)

      return {
        timezone,
        offset,
        offsetString: this.getOffsetStringForTimezone(timezone),
        locale: this.getUserLocale(),
        isManual: false,
        detectionMethod: "geolocation",
        isDST,
        coordinates: {
          latitude,
          longitude,
        },
      }
    } catch {
      return {
        ...DEFAULT_TIMEZONE,
        detectionMethod: "geolocation",
        isDST: false,
        coordinates: {
          latitude,
          longitude,
        },
      }
    }
  }
}

export const createTimezoneRepository = (): TimezoneRepository => {
  return new TimezoneRepositoryBrowser()
}
