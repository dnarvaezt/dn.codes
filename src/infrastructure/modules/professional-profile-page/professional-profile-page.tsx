import { StaticLayout } from "@/infrastructure/components"
import { useProfessionalProfilePage } from "./professional-profile-page.hook"
import "./professional-profile-page.scss"

export const ProfessionalProfilePage = () => {
  useProfessionalProfilePage()

  return (
    <StaticLayout>
      <div className="professional-profile-page">
        <h1 className="professional-profile-page__title">Perfil Profesional</h1>
      </div>
    </StaticLayout>
  )
}
