import { StaticLayout, Weather, WeatherBackground } from "@/infrastructure/components"
import { useProfessionalProfilePage } from "./professional-profile-page.hook"
import "./professional-profile-page.scss"

export const ProfessionalProfilePage = () => {
  useProfessionalProfilePage()

  return (
    <StaticLayout>
      <div className="professional-profile-page">
        <Weather />
      </div>
      <WeatherBackground />
    </StaticLayout>
  )
}
