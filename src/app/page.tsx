import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-foreground">Portfolio</h1>
        <p className="text-muted-foreground">Bienvenido a mi portfolio</p>
        <Link
          href="/curriculum"
          className="inline-block rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Ver Currículum
        </Link>
      </div>
    </div>
  )
}
