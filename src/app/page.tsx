import {
  CtaSection,
  DemoSection,
  HeroSection,
  ProjectsSection,
  SkillsSection,
} from "@/infrastructure/modules/home"

const Home = () => {
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

export default Home
