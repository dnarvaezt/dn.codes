import { StaticLayout, WeatherBackground } from "@/infrastructure/components"
import { ProfileHeader } from "./components"
import { useProfessionalProfilePage } from "./professional-profile-page.hook"
import "./professional-profile-page.scss"

export const ProfessionalProfilePage = () => {
  useProfessionalProfilePage()

  return (
    <StaticLayout>
      <div className="professional-profile-page">
        <ProfileHeader />
      </div>
      <WeatherBackground />
    </StaticLayout>
  )
}
