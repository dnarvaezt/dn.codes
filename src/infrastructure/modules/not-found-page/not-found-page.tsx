import Link from "next/link"
import { useNotFoundPage } from "./not-found-page.hook"
import "./not-found-page.scss"

export const NotFoundPage = () => {
  useNotFoundPage()

  return (
    <div className="not-found-page">
      <h1 className="not-found-page__title">404</h1>
      <h2 className="not-found-page__subtitle">Página no encontrada</h2>
      <p className="not-found-page__description">
        La página que buscas no existe o ha sido movida.
      </p>
      <Link href="/professional-profile" className="not-found-page__link">
        Volver al inicio
      </Link>
    </div>
  )
}
