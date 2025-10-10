import { Card, CardContent } from "@/infrastructure/components/ui"
import { skills } from "@/infrastructure/config"

export const SkillsSection = () => {
  return (
    <section className="mb-20" aria-labelledby="skills-heading">
      <h2 id="skills-heading" className="mb-8 text-center text-3xl font-bold">
        Tech Stack
      </h2>
      <div
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        aria-label="Technologies and skills"
      >
        {skills.map((skill) => (
          <Card key={skill} className="text-center">
            <CardContent className="p-6">
              <p className="font-semibold" aria-label={`${skill} technology`}>
                {skill}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
