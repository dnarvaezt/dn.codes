import { axiosErrorHandler } from "@/application/utils"
import axios from "axios"

import type { TimezoneInfo } from "./timezone.model"
export interface GetTimezoneByCoordinatesProps {
  latitude: number
  longitude: number
}

export abstract class TimezoneRepository<TModel = TimezoneInfo> {
  abstract getTimezone(): TModel
  abstract getByCoordinates(args: GetTimezoneByCoordinatesProps): Promise<TModel>
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

export class TimezoneRepositoryBrowser implements TimezoneRepository<TimezoneInfo> {
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
    const supported = this.isSupported()
    if (supported) {
      return Intl.DateTimeFormat().resolvedOptions().timeZone
    }
    throw new TimezoneError("Intl.DateTimeFormat no está soportado en este navegador")
  }

  private getUserLocale(): string {
    if (typeof navigator === "undefined") return "en-US"
    return navigator.language || "en-US"
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
    if (!apiKey) return null

    try {
      const { data } = await axios.get("https://api.geoapify.com/v1/geocode/reverse", {
        params: { lat: latitude, lon: longitude, apiKey },
      })

      if (data?.features?.[0]?.properties?.timezone?.name) {
        return data.features[0].properties.timezone.name as string
      }

      return null
    } catch (error) {
      throw axiosErrorHandler(error)
    }
  }

  private findClosestTimezone(latitude: number, longitude: number): string {
    const offsetHours = Math.round(longitude / 15)
    return offsetHours >= 0 ? `Etc/GMT-${offsetHours}` : `Etc/GMT+${Math.abs(offsetHours)}`
  }

  private mapResponseToTimezoneInfo(
    timezone: string,
    coords?: { latitude: number; longitude: number }
  ): TimezoneInfo {
    return {
      timezone,
      offset: this.getOffsetForTimezone(timezone),
      offsetString: this.getOffsetStringForTimezone(timezone),
      locale: this.getUserLocale(),
      isManual: false,
      detectionMethod: coords ? "geolocation" : "browser",
      isDST: this.isDaylightSavingTime(timezone),
      coordinates: coords,
    }
  }

  public async getByCoordinates({
    latitude,
    longitude,
  }: GetTimezoneByCoordinatesProps): Promise<TimezoneInfo> {
    try {
      let timezone = await this.fetchTimezoneFromAPI(latitude, longitude)
      if (!timezone) timezone = this.findClosestTimezone(latitude, longitude)

      return this.mapResponseToTimezoneInfo(timezone, { latitude, longitude })
    } catch (error) {
      throw axiosErrorHandler(error)
    }
  }
}
