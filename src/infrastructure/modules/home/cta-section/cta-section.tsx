import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/infrastructure/components/ui"
import { socialLinks } from "@/infrastructure/config"
import { Mail } from "lucide-react"

const openExternalLink = (url: string) => window.open(url, "_blank", "noopener,noreferrer")

export const CtaSection = () => {
  return (
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
          <Button
            size="lg"
            className="w-full sm:w-auto"
            aria-label="Contact me via email"
            onClick={() => openExternalLink(socialLinks.email)}
          >
            <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
            Contact Me
          </Button>
        </CardContent>
      </Card>
    </section>
  )
}
