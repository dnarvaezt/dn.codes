"use client"

import { useCurriculumPageContext } from "../../curriculum-page.context"
import "./curriculum-about.scss"

export const CurriculumAbout = () => {
  const { personalInfo, isVisible, setSectionRef } = useCurriculumPageContext()

  return (
    <section
      className="curriculum-about"
      ref={(el) => setSectionRef("about", el as HTMLDivElement | null)}
    >
      <div className="curriculum-about__container">
        <div
          className={`curriculum-about__content ${
            isVisible.about ? "curriculum-about__content--visible" : ""
          }`}
        >
          <h2 className="curriculum-about__title">Sobre Mí</h2>
          <p className="curriculum-about__text">{personalInfo.about}</p>
        </div>
      </div>
    </section>
  )
}
