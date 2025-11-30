"use client"

import { useCurriculumPageContext } from "../../curriculum-page.context"
import "./curriculum-hero.scss"

export const CurriculumHero = () => {
  const { personalInfo, isVisible, setSectionRef, setParallaxRef } = useCurriculumPageContext()

  return (
    <section
      className="curriculum-hero"
      ref={(el) => setSectionRef("hero", el as HTMLDivElement | null)}
    >
      <div
        className="curriculum-hero__content"
        ref={(el) => setParallaxRef("hero-content", el as HTMLDivElement | null, 0.3)}
      >
        <div
          className={`curriculum-hero__text ${
            isVisible.hero ? "curriculum-hero__text--visible" : ""
          }`}
        >
          <h1 className="curriculum-hero__name">{personalInfo.name}</h1>
          <p className="curriculum-hero__title">{personalInfo.title}</p>
          <div className="curriculum-hero__contact">
            <span>{personalInfo.email}</span>
            <span>{personalInfo.phone}</span>
            <span>{personalInfo.location}</span>
          </div>
        </div>
      </div>
      <div
        className="curriculum-hero__bg"
        ref={(el) => setParallaxRef("hero-bg", el as HTMLDivElement | null, 0.5)}
      />
    </section>
  )
}
