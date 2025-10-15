"use client"

import { Weather } from "@/infrastructure/components"
import "./profile-header.scss"

interface ProfileHeaderProps {
  name?: string
  title?: string
  bio?: string
  avatarUrl?: string
  location?: string
  email?: string
  website?: string
}

export const ProfileHeader = ({
  name = "Daniel Narváez",
  title = "Senior Software Engineer",
  bio = "Desarrollador Full Stack especializado en arquitecturas escalables y clean code. Apasionado por crear soluciones elegantes a problemas complejos.",
  avatarUrl = "/avatar.jpg",
  location = "Remote",
  email = "contact@dn.codes",
  website = "dn.codes",
}: ProfileHeaderProps) => {
  return (
    <header className="profile-header">
      <div className="profile-header__container">
        <div className="profile-header__main">
          <div className="profile-header__avatar-section">
            <div className="profile-header__avatar">
              <img
                src={avatarUrl}
                alt={`${name} avatar`}
                className="profile-header__avatar-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&size=200&background=3b82f6&color=fff&bold=true`
                }}
              />
              <div className="profile-header__status" />
            </div>
          </div>

          <div className="profile-header__info">
            <div className="profile-header__name-section">
              <h1 className="profile-header__name">{name}</h1>
              <span className="profile-header__title">{title}</span>
            </div>

            <p className="profile-header__bio">{bio}</p>

            <div className="profile-header__meta">
              <div className="profile-header__meta-item">
                <svg
                  className="profile-header__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{location}</span>
              </div>

              <div className="profile-header__meta-item">
                <svg
                  className="profile-header__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a href={`mailto:${email}`} className="profile-header__link">
                  {email}
                </a>
              </div>

              <div className="profile-header__meta-item">
                <svg
                  className="profile-header__icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <a
                  href={`https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="profile-header__link"
                >
                  {website}
                </a>
              </div>
            </div>
          </div>
        </div>

        <aside className="profile-header__weather">
          <Weather />
        </aside>
      </div>
    </header>
  )
}
