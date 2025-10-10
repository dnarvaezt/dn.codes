import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/infrastructure/components/ui"
import { projects } from "@/infrastructure/config"

export const ProjectsSection = () => {
  return (
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
  )
}
