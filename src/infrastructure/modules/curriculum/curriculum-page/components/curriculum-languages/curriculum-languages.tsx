"use client"

import { useCurriculumPageContext } from "../../curriculum-page.context"
import "./curriculum-languages.scss"

export const CurriculumLanguages = () => {
  const { languages } = useCurriculumPageContext()

  return (
    <div className="curriculum-languages">
      <h2 className="curriculum-languages__title">Idiomas</h2>
      <div className="curriculum-languages__list">
        {languages.map((lang, index) => (
          <div
            key={index}
            className="curriculum-languages__item"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <span className="curriculum-languages__name">{lang.name}</span>
            <span className="curriculum-languages__level">{lang.level}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
