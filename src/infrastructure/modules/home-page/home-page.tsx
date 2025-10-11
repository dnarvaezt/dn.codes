import {
  CtaSection,
  DemoSection,
  HeroSection,
  ProjectsSection,
  SkillsSection,
} from "@/infrastructure/modules/home"

export const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <HeroSection />
      <SkillsSection />
      <ProjectsSection />
      <DemoSection />
      <CtaSection />
    </div>
  )
}
