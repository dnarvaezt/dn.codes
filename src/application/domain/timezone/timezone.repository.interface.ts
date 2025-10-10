import type { TimezoneInfo } from "./timezone.model"

export interface TimezoneRepository {
  getTimezone(): TimezoneInfo
  getTimezoneByCoordinates(latitude: number, longitude: number): Promise<TimezoneInfo>
  setManualTimezone(timezone: string): void
  getCurrentTimezone(): TimezoneInfo
  resetToAutomatic(): void
}
