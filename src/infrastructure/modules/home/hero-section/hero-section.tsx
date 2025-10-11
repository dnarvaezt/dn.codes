"use client"

import { Button } from "@/infrastructure/components/ui"
import { socialLinks } from "@/infrastructure/modules/home-page/site-data"
import { Github, Linkedin, Mail } from "lucide-react"

const openExternalLink = (url: string) => window.open(url, "_blank", "noopener,noreferrer")

const iconClass = "mr-2 h-4 w-4"

export const HeroSection = () => {
  return (
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
        <Button
          size="lg"
          aria-label="Send email to contact me"
          onClick={() => openExternalLink(socialLinks.email)}
        >
          <Mail className={iconClass} aria-hidden="true" />
          Get in touch
        </Button>
        <Button
          size="lg"
          variant="outline"
          aria-label="View my GitHub profile (opens in new tab)"
          onClick={() => openExternalLink(socialLinks.github)}
        >
          <Github className={iconClass} aria-hidden="true" />
          View GitHub
        </Button>
        <Button
          size="lg"
          variant="outline"
          aria-label="View my LinkedIn profile (opens in new tab)"
          onClick={() => openExternalLink(socialLinks.linkedin)}
        >
          <Linkedin className={iconClass} aria-hidden="true" />
          LinkedIn
        </Button>
      </div>
    </section>
  )
}
