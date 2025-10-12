import { ThemeControllerProvider } from "../../theme"
import "./default-layout.scss"

export const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeControllerProvider>
      <div className="default-layout">
        <main id="main-content" className="default-layout__main" role="main">
          {children}
        </main>
      </div>
    </ThemeControllerProvider>
  )
}
