import type { TimezoneInfo } from "./timezone.model"
import type { TimezoneRepository } from "./timezone.repository.interface"

export class TimezoneService {
  constructor(private readonly repository: TimezoneRepository) {}

  public getTimezone(): TimezoneInfo {
    return this.repository.getTimezone()
  }

  public async getTimezoneByCoordinates(
    latitude: number,
    longitude: number
  ): Promise<TimezoneInfo> {
    return this.repository.getTimezoneByCoordinates(latitude, longitude)
  }

  public setManualTimezone(timezone: string): void {
    this.repository.setManualTimezone(timezone)
  }

  public getCurrentTimezone(): TimezoneInfo {
    return this.repository.getCurrentTimezone()
  }

  public resetToAutomatic(): void {
    this.repository.resetToAutomatic()
  }
}
