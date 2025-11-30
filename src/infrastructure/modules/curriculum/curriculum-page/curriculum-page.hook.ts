interface PersonalInfo {
  name: string
  title: string
  email: string
  phone: string
  location: string
  about: string
}

interface Experience {
  position: string
  company: string
  period: string
  description: string
}

interface Education {
  degree: string
  institution: string
  period: string
}

interface Skill {
  name: string
  level: number
}

interface Language {
  name: string
  level: string
}

export const useCurriculumPage = () => {
  const personalInfo: PersonalInfo = {
    name: "Diego Narváez",
    title: "Desarrollador Full Stack",
    email: "diego@example.com",
    phone: "+57 300 000 0000",
    location: "Bogotá, Colombia",
    about:
      "Desarrollador Full Stack con experiencia en tecnologías modernas como React, Next.js, TypeScript y Node.js. Apasionado por crear aplicaciones escalables y de alto rendimiento.",
  }

  const experience: Experience[] = [
    {
      position: "Desarrollador Full Stack Senior",
      company: "Empresa Tech",
      period: "2022 - Presente",
      description:
        "Lidero el desarrollo de aplicaciones web modernas utilizando React, Next.js y TypeScript. Implemento arquitecturas limpias y escalables siguiendo principios SOLID.",
    },
    {
      position: "Desarrollador Frontend",
      company: "Startup Innovadora",
      period: "2020 - 2022",
      description:
        "Desarrollé interfaces de usuario responsivas y accesibles. Colaboré en el diseño de sistemas de componentes reutilizables.",
    },
  ]

  const education: Education[] = [
    {
      degree: "Ingeniería de Sistemas",
      institution: "Universidad Nacional",
      period: "2016 - 2020",
    },
    {
      degree: "Certificación en Desarrollo Web",
      institution: "Platzi",
      period: "2020",
    },
  ]

  const skills: Skill[] = [
    { name: "React", level: 90 },
    { name: "TypeScript", level: 85 },
    { name: "Next.js", level: 80 },
    { name: "Node.js", level: 75 },
    { name: "Tailwind CSS", level: 85 },
    { name: "PostgreSQL", level: 70 },
  ]

  const languages: Language[] = [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Avanzado" },
  ]

  return {
    personalInfo,
    experience,
    education,
    skills,
    languages,
  }
}
