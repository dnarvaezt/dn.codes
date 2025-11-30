"use client"

import {
  CurriculumAbout,
  CurriculumEducation,
  CurriculumExperience,
  CurriculumHero,
  CurriculumSkillsLanguages,
} from "./components"
import { CurriculumPageProvider } from "./curriculum-page.context"
import "./curriculum-page.scss"

export const CurriculumPage = () => {
  return (
    <CurriculumPageProvider>
      <div className="curriculum-page">
        <CurriculumHero />
        <CurriculumAbout />
        <CurriculumExperience />
        <CurriculumSkillsLanguages />
        <CurriculumEducation />
      </div>
    </CurriculumPageProvider>
  )
}
