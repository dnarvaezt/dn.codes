export const socialLinks = {
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  email: "mailto:contact@dn.codes",
} as const

export const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "Tailwind",
  "Node.js",
  "Zustand",
  "SCSS",
  "Git",
] as const

export const projects = [
  {
    id: 1,
    title: "Project One",
    description: "A modern web application built with Next.js and TypeScript",
    tech: ["Next.js", "TypeScript", "Tailwind"],
  },
  {
    id: 2,
    title: "Project Two",
    description: "E-commerce platform with advanced features and animations",
    tech: ["React", "Node.js", "MongoDB"],
  },
  {
    id: 3,
    title: "Project Three",
    description: "Real-time collaboration tool for remote teams",
    tech: ["Next.js", "WebSocket", "Redis"],
  },
] as const
