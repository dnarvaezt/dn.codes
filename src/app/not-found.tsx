import Link from "next/link"

const NotFound = () => {
  return (
    <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold">404</h1>
      <h2 className="mb-4 text-2xl font-semibold">Página no encontrada</h2>
      <p className="mb-8 text-muted-foreground">La página que buscas no existe o ha sido movida.</p>
      <Link
        href="/"
        className="hover:bg-primary/90 rounded-md bg-primary px-6 py-3 text-primary-foreground"
      >
        Volver al inicio
      </Link>
    </div>
  )
}

export default NotFound
