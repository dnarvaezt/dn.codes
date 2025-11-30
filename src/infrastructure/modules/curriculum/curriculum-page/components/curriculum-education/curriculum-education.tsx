"use client"

import { useCurriculumPageContext } from "../../curriculum-page.context"
import "./curriculum-education.scss"

export const CurriculumEducation = () => {
  const { education, isVisible, setSectionRef } = useCurriculumPageContext()

  return (
    <section
      className="curriculum-education"
      ref={(el) => setSectionRef("education", el as HTMLDivElement | null)}
    >
      <div className="curriculum-education__container">
        <div
          className={`curriculum-education__content ${
            isVisible.education ? "curriculum-education__content--visible" : ""
          }`}
        >
          <h2 className="curriculum-education__title">Educación</h2>
          <div className="curriculum-education__grid">
            {education.map((edu, index) => (
              <div
                key={index}
                className="curriculum-education__card"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="curriculum-education__header">
                  <h3 className="curriculum-education__card-title">{edu.degree}</h3>
                  <span className="curriculum-education__period">{edu.period}</span>
                </div>
                <p className="curriculum-education__institution">{edu.institution}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
