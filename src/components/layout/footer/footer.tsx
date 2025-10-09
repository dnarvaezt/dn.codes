import {
  Github as GitHubIcon,
  Linkedin as LinkedInIcon,
  Mail,
  Twitter as XIcon,
} from "lucide-react"
import Link from "next/link"
import "./footer.scss"

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer" role="contentinfo">
      <div className="footer__container">
        <div className="footer__content">
          <div className="footer__section">
            <h3 className="footer__title">dn.codes</h3>
            <p className="footer__description">
              Building digital experiences with modern technologies.
            </p>
          </div>

          <div className="footer__section">
            <h4 className="footer__subtitle">Links</h4>
            <nav className="footer__links" aria-label="Footer navigation">
              <Link href="/about" className="footer__link">
                About
              </Link>
              <Link href="/projects" className="footer__link">
                Projects
              </Link>
              <Link href="/contact" className="footer__link">
                Contact
              </Link>
            </nav>
          </div>

          <div className="footer__section">
            <h4 className="footer__subtitle">Connect</h4>
            <div className="footer__social" aria-label="Social media links">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Visit my GitHub profile (opens in new tab)"
              >
                <GitHubIcon className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Visit my LinkedIn profile (opens in new tab)"
              >
                <LinkedInIcon className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label="Visit my Twitter profile (opens in new tab)"
              >
                <XIcon className="h-5 w-5" aria-hidden="true" />
              </a>
              <a
                href="mailto:contact@dn.codes"
                className="footer__social-link"
                aria-label="Send me an email"
              >
                <Mail className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">© {currentYear} dn.codes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
