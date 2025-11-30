"use client"

import { useCurriculumPageContext } from "../../curriculum-page.context"
import "./curriculum-skills.scss"

export const CurriculumSkills = () => {
  const { skills } = useCurriculumPageContext()

  return (
    <div className="curriculum-skills">
      <h2 className="curriculum-skills__title">Habilidades</h2>
      <div className="curriculum-skills__list">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="curriculum-skills__item"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <div className="curriculum-skills__header">
              <span className="curriculum-skills__name">{skill.name}</span>
              <span className="curriculum-skills__percentage">{skill.level}%</span>
            </div>
            <div className="curriculum-skills__level">
              <div
                className="curriculum-skills__bar"
                style={{ "--skill-level": `${skill.level}%` } as React.CSSProperties}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
