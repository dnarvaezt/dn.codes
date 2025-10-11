import type { TimezoneInfo } from "./timezone.model"

interface TimezoneRepository {
  getTimezone(): TimezoneInfo
  getTimezoneByCoordinates(latitude: number, longitude: number): Promise<TimezoneInfo>
}

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
}
