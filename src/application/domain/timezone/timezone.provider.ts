import type { TimezoneRepository } from "./timezone.repository.interface"
import { TimezoneService } from "./timezone.service"

/**
 * Factory/Provider genérico (sin React)
 * Solo instancia y configura el servicio con sus dependencias
 */
export class TimezoneProvider {
  private static instance: TimezoneService | null = null

  public static getInstance(): TimezoneService | null {
    return this.instance
  }

  public static initializeService(repository: TimezoneRepository): TimezoneService {
    this.instance ??= new TimezoneService(repository)
    return this.instance
  }

  public static createNew(repository: TimezoneRepository): TimezoneService {
    return new TimezoneService(repository)
  }

  public static reset(): void {
    this.instance = null
  }

  public static isInitialized(): boolean {
    return this.instance !== null
  }
}

export const createTimezoneService = (repository: TimezoneRepository): TimezoneService => {
  return TimezoneProvider.createNew(repository)
}
