"use client"

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui"
import { Github as GitHubIcon, Linkedin as LinkedInIcon, Mail } from "lucide-react"
import dynamic from "next/dynamic"

const UserContextDemo = dynamic(
  () =>
    import("@/presentation/components/user-context-demo").then((mod) => ({
      default: mod.UserContextDemo,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="text-center text-muted-foreground">Cargando contexto de usuario...</div>
    ),
  }
)

const Home = () => {
  const projects = [
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
  ]

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="mb-20 text-center" aria-labelledby="hero-heading">
        <h1
          id="hero-heading"
          className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
        >
          Hi, I&apos;m{" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Developer
          </span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-muted-foreground">
          Building modern web applications with cutting-edge technologies. Passionate about creating
          exceptional user experiences and clean, maintainable code.
        </p>
        <div className="flex flex-wrap justify-center gap-4" aria-label="Contact actions">
          <Button size="lg" aria-label="Send email to contact me">
            <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
            Get in touch
          </Button>
          <Button
            size="lg"
            variant="outline"
            aria-label="View my GitHub profile (opens in new tab)"
            onClick={() => window.open("https://github.com", "_blank", "noopener,noreferrer")}
          >
            <GitHubIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            View GitHub
          </Button>
          <Button
            size="lg"
            variant="outline"
            aria-label="View my LinkedIn profile (opens in new tab)"
            onClick={() => window.open("https://linkedin.com", "_blank", "noopener,noreferrer")}
          >
            <LinkedInIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            LinkedIn
          </Button>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mb-20" aria-labelledby="skills-heading">
        <h2 id="skills-heading" className="mb-8 text-center text-3xl font-bold">
          Tech Stack
        </h2>
        <div
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
          aria-label="Technologies and skills"
        >
          {["React", "Next.js", "TypeScript", "Tailwind", "Node.js", "Zustand", "SCSS", "Git"].map(
            (skill) => (
              <Card key={skill} className="text-center">
                <CardContent className="p-6">
                  <p className="font-semibold" aria-label={`${skill} technology`}>
                    {skill}
                  </p>
                </CardContent>
              </Card>
            )
          )}
        </div>
      </section>

      {/* Projects Section */}
      <section className="mb-20" aria-labelledby="projects-heading">
        <h2 id="projects-heading" className="mb-8 text-center text-3xl font-bold">
          Featured Projects
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="Featured projects">
          {projects.map((project) => (
            <Card key={project.id} className="transition-shadow hover:shadow-lg">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="flex flex-wrap gap-2"
                  aria-label={`Technologies used in ${project.title}`}
                >
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium"
                      aria-label={`${tech} technology`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* User Context Demo */}
      <section className="mb-20" aria-labelledby="demo-heading">
        <h2 id="demo-heading" className="mb-8 text-center text-3xl font-bold">
          User Context Demo
        </h2>
        <div className="mx-auto max-w-2xl">
          <UserContextDemo />
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center" aria-labelledby="cta-heading">
        <Card className="from-primary/10 to-secondary/10 mx-auto max-w-2xl bg-gradient-to-br">
          <CardHeader>
            <CardTitle id="cta-heading" className="text-3xl">
              Let&apos;s Work Together
            </CardTitle>
            <CardDescription className="text-base">
              I&apos;m always interested in hearing about new projects and opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" className="w-full sm:w-auto" aria-label="Contact me via email">
              <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
              Contact Me
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

// Next.js requires default export for page files
export default Home
