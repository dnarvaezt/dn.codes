"use client"

import { useCurriculumPageContext } from "../../curriculum-page.context"
import { CurriculumLanguages } from "../curriculum-languages"
import { CurriculumSkills } from "../curriculum-skills"
import "./curriculum-skills-languages.scss"

export const CurriculumSkillsLanguages = () => {
  const { skills, languages, isVisible, setSectionRef } = useCurriculumPageContext()

  return (
    <section
      className="curriculum-skills-languages"
      ref={(el) => setSectionRef("skills", el as HTMLDivElement | null)}
    >
      <div className="curriculum-skills-languages__container">
        <div
          className={`curriculum-skills-languages__content ${
            isVisible.skills ? "curriculum-skills-languages__content--visible" : ""
          }`}
        >
          <div className="curriculum-skills-languages__grid">
            <CurriculumSkills />
            <CurriculumLanguages />
          </div>
        </div>
      </div>
    </section>
  )
}
