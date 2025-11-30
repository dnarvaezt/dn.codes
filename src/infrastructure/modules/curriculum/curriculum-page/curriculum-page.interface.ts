export interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  about: string
}

export interface Experience {
  position: string
  company: string
  period: string
  description: string
}

export interface Education {
  degree: string
  institution: string
  period: string
}

export interface Skill {
  name: string
  level: number
}

export interface Language {
  name: string
  level: string
}

export interface CurriculumPageContextValue {
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: Skill[]
  languages: Language[]
  isVisible: Record<string, boolean>
  setSectionRef: (key: string, element: HTMLDivElement | null) => void
  setParallaxRef: (key: string, element: HTMLElement | null, speed: number) => void
}
