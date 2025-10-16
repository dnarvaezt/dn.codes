import type { TimezoneInfo } from "./timezone.model"
import { TimezoneRepository, TimezoneRepositoryBrowser } from "./timezone.repository"

export const timezoneRepository: TimezoneRepository<TimezoneInfo> = new TimezoneRepositoryBrowser()
