"use client"

import { UserInfo } from "@/infrastructure/modules/user-context/user-info/user-info"
import Link from "next/link"
import { ThemeToggle } from "../theme-toggle"
import "./navbar.scss"

export const Navbar = () => {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar__container">
        <Link href="/" className="navbar__logo" aria-label="dn.codes - Home">
          <span className="navbar__logo-text">dn.codes</span>
        </Link>

        <div className="navbar__menu" role="menubar">
          <Link href="/" className="navbar__link" role="menuitem" aria-current="page">
            Home
          </Link>
          <Link href="/about" className="navbar__link" role="menuitem">
            About
          </Link>
          <Link href="/projects" className="navbar__link" role="menuitem">
            Projects
          </Link>
          <Link href="/contact" className="navbar__link" role="menuitem">
            Contact
          </Link>
        </div>

        <div className="navbar__actions" aria-label="User actions">
          <UserInfo />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  )
}
