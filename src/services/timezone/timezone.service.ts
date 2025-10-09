import {
  DEFAULT_TIMEZONE,
  TimezoneDetectionMethod,
  TimezoneDetectionOptions,
  TimezoneError,
  TimezoneInfo,
  TimezoneOptions,
} from "./timezone.types"

import type { GeolocationPosition, GeolocationService } from "../geolocation"
import type { LanguageService } from "../language"

export class TimezoneService {
  private currentTimezone: TimezoneInfo | null = null
  private readonly geolocationService?: GeolocationService
  private readonly languageService?: LanguageService

  constructor(geolocationService?: GeolocationService, languageService?: LanguageService) {
    this.geolocationService = geolocationService
    this.languageService = languageService
  }

  private isSupported(): boolean {
    return typeof Intl !== "undefined" && typeof Intl.DateTimeFormat === "function"
  }

  private createError(message: string): TimezoneError {
    return new TimezoneError(message)
  }

  public getOffset(): number {
    return -new Date().getTimezoneOffset()
  }

  public getOffsetString(): string {
    const offset = this.getOffset()
    const sign = offset >= 0 ? "+" : "-"
    const absOffset = Math.abs(offset)
    const hours = Math.floor(absOffset / 60)
    const minutes = absOffset % 60

    return `${sign}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
  }

  public getTimezoneName(): string {
    if (!this.isSupported()) {
      throw this.createError("Intl.DateTimeFormat no está soportado en este navegador")
    }

    return Intl.DateTimeFormat().resolvedOptions().timeZone
  }

  public getUserLocale(): string {
    return this.languageService?.getCurrentLanguage().fullCode || navigator.language || "en-US"
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

  public setManualTimezone(timezone: string): void {
    if (!this.isValidTimezone(timezone)) {
      throw this.createError(`La zona horaria '${timezone}' no es válida`)
    }

    this.currentTimezone = {
      timezone,
      offset: this.getOffset(),
      offsetString: this.getOffsetString(),
      locale: this.getUserLocale(),
      isManual: true,
      detectionMethod: "manual",
      isDST: this.isDaylightSavingTime(timezone),
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
    if (latitude >= 35 && latitude <= 70 && longitude >= -10 && longitude <= 40) {
      return "Europe/Madrid"
    }

    if (latitude >= -60 && latitude <= 50 && longitude >= -170 && longitude <= -30) {
      if (latitude >= 25 && latitude <= 50 && longitude >= -125 && longitude <= -65) {
        return "America/New_York"
      }
      if (latitude >= -35 && latitude <= 15 && longitude >= -80 && longitude <= -60) {
        return "America/Bogota"
      }
      if (latitude >= -55 && latitude <= -20 && longitude >= -75 && longitude <= -35) {
        return "America/Argentina/Buenos_Aires"
      }
      if (latitude >= 15 && latitude <= 35 && longitude >= -120 && longitude <= -80) {
        return "America/Mexico_City"
      }
      return "America/New_York"
    }

    if (latitude >= -10 && latitude <= 50 && longitude >= 60 && longitude <= 150) {
      if (latitude >= 20 && latitude <= 45 && longitude >= 70 && longitude <= 90) {
        return "Asia/Kolkata"
      }
      if (latitude >= 20 && latitude <= 45 && longitude >= 100 && longitude <= 125) {
        return "Asia/Shanghai"
      }
      if (latitude >= 25 && latitude <= 45 && longitude >= 125 && longitude <= 145) {
        return "Asia/Tokyo"
      }
      return "Asia/Dubai"
    }

    if (latitude >= -40 && latitude <= 40 && longitude >= -20 && longitude <= 55) {
      return "Africa/Cairo"
    }

    if (latitude >= -50 && latitude <= -10 && longitude >= 110 && longitude <= 155) {
      return "Australia/Sydney"
    }

    const offsetHours = Math.round(longitude / 15)
    if (offsetHours >= 0) {
      return `Etc/GMT-${offsetHours}`
    } else {
      return `Etc/GMT+${Math.abs(offsetHours)}`
    }
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

  public async detectTimezoneAutomatically(
    options?: TimezoneDetectionOptions
  ): Promise<TimezoneInfo> {
    const useGeolocation = options?.useGeolocation ?? false

    if (useGeolocation && this.geolocationService) {
      try {
        const position: GeolocationPosition = await this.geolocationService.getCurrentPosition({
          timeout: options?.timeout,
        })

        const timezoneInfo = await this.getTimezoneByCoordinates(
          position.coords.latitude,
          position.coords.longitude
        )

        this.currentTimezone = timezoneInfo
        return timezoneInfo
      } catch (error) {
        if (!options?.fallbackToManual) {
          const browserTimezone = this.getTimezone()
          this.currentTimezone = browserTimezone
          return browserTimezone
        }
        throw error
      }
    }

    const browserTimezone = this.getTimezone()
    this.currentTimezone = browserTimezone
    return browserTimezone
  }

  public getCurrentTimezone(): TimezoneInfo {
    if (this.currentTimezone) {
      return { ...this.currentTimezone }
    }

    return this.getTimezone()
  }

  public resetToAutomatic(): void {
    this.currentTimezone = null
  }

  public isManuallySet(): boolean {
    return this.currentTimezone?.isManual ?? false
  }

  public async setTimezoneByGeolocation(
    options?: Partial<{
      timeout: number
      enableHighAccuracy: boolean
      maximumAge: number
    }>
  ): Promise<TimezoneInfo> {
    if (!this.geolocationService) {
      throw this.createError("Servicio de geolocalización no disponible")
    }

    const position: GeolocationPosition = await this.geolocationService.getCurrentPosition(options)

    const timezoneInfo = await this.getTimezoneByCoordinates(
      position.coords.latitude,
      position.coords.longitude
    )

    this.currentTimezone = timezoneInfo
    return timezoneInfo
  }

  public setTimezoneFromBrowser(): TimezoneInfo {
    const browserTimezone = this.getTimezone()
    this.currentTimezone = browserTimezone
    return browserTimezone
  }

  public getDetectionMethod(): TimezoneDetectionMethod {
    return this.currentTimezone?.detectionMethod ?? "browser"
  }

  public getTimezoneWithOptions(options?: TimezoneOptions): TimezoneInfo {
    const timezone = this.getTimezone()

    if (options?.locale) {
      timezone.locale = options.locale
    }

    if (options?.includeOffset === false) {
      timezone.offset = 0
      timezone.offsetString = "+00:00"
    }

    return timezone
  }

  public formatDate(date: Date, options?: TimezoneOptions): string {
    const locale = options?.locale || this.getUserLocale()

    if (!this.isSupported()) {
      return date.toISOString()
    }

    return new Intl.DateTimeFormat(locale, {
      dateStyle: "full",
      timeStyle: "long",
      timeZone: this.getTimezoneName(),
    }).format(date)
  }

  public compareTimezones(targetTimezone: string): {
    currentTimezone: string
    targetTimezone: string
    offsetDifference: number
  } {
    let offsetDifference = 0
    try {
      const date = new Date()
      const targetDate = new Intl.DateTimeFormat("en-US", {
        timeZone: targetTimezone,
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }).format(date)

      const currentDate = new Intl.DateTimeFormat("en-US", {
        timeZone: this.getTimezoneName(),
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      }).format(date)

      const [targetHour, targetMinute] = targetDate.split(":").map(Number)
      const [currentHour, currentMinute] = currentDate.split(":").map(Number)

      offsetDifference = targetHour * 60 + targetMinute - (currentHour * 60 + currentMinute)
    } catch (error) {
      if (error instanceof Error) {
        throw this.createError(`Error al comparar zonas horarias: ${error.message}`)
      }
    }

    return {
      currentTimezone: this.getTimezoneName(),
      targetTimezone,
      offsetDifference,
    }
  }

  public isValidTimezone(timezone: string): boolean {
    if (!timezone || typeof timezone !== "string") {
      return false
    }

    try {
      Intl.DateTimeFormat(undefined, { timeZone: timezone })
      return true
    } catch {
      return false
    }
  }

  public getDefaultTimezone(): TimezoneInfo {
    return { ...DEFAULT_TIMEZONE }
  }
}

export const createTimezoneService = (
  geolocationService?: GeolocationService,
  languageService?: LanguageService
) => {
  return new TimezoneService(geolocationService, languageService)
}
