import { ProfessionalProfile } from "./professional-profile.model"

export abstract class ProfessionalProfileRepository {
  abstract getProfessionalProfile(): Promise<ProfessionalProfile>
}

export class ProfessionalProfileRepositoryMemory implements ProfessionalProfileRepository {
  async getProfessionalProfile(): Promise<ProfessionalProfile> {
    return {
      name: "David Narváez",
      phone: "https://api.whatsapp.com/send?phone=573137756824",
      email: "dnarvaez@unimayor.edu.co",
      github: "https://github.com/davidnarvaez",
      linkedin: "https://www.linkedin.com/in/davidnarvaez",
    }
  }
}
