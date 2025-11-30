"use client"

import { useCurriculumPage } from "./curriculum-page.hook"
import "./curriculum-page.scss"

export const CurriculumPage = () => {
  const { personalInfo, experience, education, skills, languages } = useCurriculumPage()

  return (
    <div className="curriculum-page">
      {/* Header Section */}
      <header className="curriculum-page__header">
        <div className="curriculum-page__header-container">
          <h1 className="curriculum-page__name">{personalInfo.name}</h1>
          <p className="curriculum-page__title">{personalInfo.title}</p>
          <div className="curriculum-page__contact">
            <span>{personalInfo.email}</span>
            <span>{personalInfo.phone}</span>
            <span>{personalInfo.location}</span>
          </div>
        </div>
      </header>

      <div className="curriculum-page__container">
        {/* Main Content */}
        <main className="curriculum-page__main">
          <div className="curriculum-page__grid">
            {/* Left Column */}
            <div className="curriculum-page__left">
              {/* About Section */}
              <section className="curriculum-page__section">
                <h2 className="curriculum-page__section-title">Sobre Mí</h2>
                <p className="curriculum-page__text">{personalInfo.about}</p>
              </section>

              {/* Experience Section */}
              <section className="curriculum-page__section">
                <h2 className="curriculum-page__section-title">Experiencia</h2>
                <div className="curriculum-page__list">
                  {experience.map((exp, index) => (
                    <div key={index} className="curriculum-page__list-item">
                      <div className="curriculum-page__list-header">
                        <h3 className="curriculum-page__list-title">{exp.position}</h3>
                        <span className="curriculum-page__list-period">{exp.period}</span>
                      </div>
                      <p className="curriculum-page__list-company">{exp.company}</p>
                      <p className="curriculum-page__list-description">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Education Section */}
              <section className="curriculum-page__section">
                <h2 className="curriculum-page__section-title">Educación</h2>
                <div className="curriculum-page__list">
                  {education.map((edu, index) => (
                    <div key={index} className="curriculum-page__list-item">
                      <div className="curriculum-page__list-header">
                        <h3 className="curriculum-page__list-title">{edu.degree}</h3>
                        <span className="curriculum-page__list-period">{edu.period}</span>
                      </div>
                      <p className="curriculum-page__list-company">{edu.institution}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="curriculum-page__right">
              {/* Skills Section */}
              <section className="curriculum-page__section">
                <h2 className="curriculum-page__section-title">Habilidades</h2>
                <div className="curriculum-page__skills">
                  {skills.map((skill, index) => (
                    <div key={index} className="curriculum-page__skill-item">
                      <div className="curriculum-page__skill-header">
                        <span className="curriculum-page__skill-name">{skill.name}</span>
                        <span className="curriculum-page__skill-percentage">{skill.level}%</span>
                      </div>
                      <div className="curriculum-page__skill-level">
                        <div
                          className="curriculum-page__skill-bar"
                          style={{ "--skill-level": `${skill.level}%` } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Languages Section */}
              <section className="curriculum-page__section">
                <h2 className="curriculum-page__section-title">Idiomas</h2>
                <div className="curriculum-page__languages">
                  {languages.map((lang, index) => (
                    <div key={index} className="curriculum-page__language-item">
                      <span className="curriculum-page__language-name">{lang.name}</span>
                      <span className="curriculum-page__language-level">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
