import {
  ProfessionalProfileRepository,
  ProfessionalProfileRepositoryMemory,
} from "./professional-profile.repository"

export const professionalProfileRepository: ProfessionalProfileRepository =
  new ProfessionalProfileRepositoryMemory()
