import { useParallax } from "@/infrastructure/hooks/use-parallax"
import { useEffect, useRef, useState } from "react"
import type {
  Education,
  Experience,
  Language,
  PersonalInfo,
  Skill,
} from "./curriculum-page.interface"

export const useCurriculumPage = () => {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({})
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const { setParallaxRef } = useParallax()

  useEffect(() => {
    // Intersection Observer para animaciones al entrar en viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const key = entry.target.getAttribute("data-section-key")
          if (key) {
            setIsVisible((prev) => ({ ...prev, [key]: entry.isIntersecting }))
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    )

    // Observar todos los elementos con refs
    const observeSections = () => {
      Object.keys(sectionRefs.current).forEach((key) => {
        const element = sectionRefs.current[key]
        if (element && !element.hasAttribute("data-section-key")) {
          element.setAttribute("data-section-key", key)
          observer.observe(element)
        }
      })
    }

    // Observar después de que los refs estén listos
    const timeoutId = setTimeout(observeSections, 100)

    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [])

  const setSectionRef = (key: string, element: HTMLDivElement | null) => {
    sectionRefs.current[key] = element
  }
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
    isVisible,
    setSectionRef,
    setParallaxRef,
  }
}
