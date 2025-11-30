"use client"

import { useCurriculumPageContext } from "../../curriculum-page.context"
import "./curriculum-experience.scss"

export const CurriculumExperience = () => {
  const { experience, isVisible, setSectionRef } = useCurriculumPageContext()

  return (
    <section
      className="curriculum-experience"
      ref={(el) => setSectionRef("experience", el as HTMLDivElement | null)}
    >
      <div className="curriculum-experience__container">
        <div
          className={`curriculum-experience__content ${
            isVisible.experience ? "curriculum-experience__content--visible" : ""
          }`}
        >
          <h2 className="curriculum-experience__title">Experiencia</h2>
          <div className="curriculum-experience__grid">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="curriculum-experience__card"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="curriculum-experience__header">
                  <h3 className="curriculum-experience__card-title">{exp.position}</h3>
                  <span className="curriculum-experience__period">{exp.period}</span>
                </div>
                <p className="curriculum-experience__company">{exp.company}</p>
                <p className="curriculum-experience__description">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
