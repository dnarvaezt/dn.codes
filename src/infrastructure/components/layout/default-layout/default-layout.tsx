import { ThemeProvider } from "../../theme"
import "./default-layout.scss"

export const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <div className="default-layout">
        <main id="main-content" className="default-layout__main" role="main">
          {children}
        </main>
      </div>
    </ThemeProvider>
  )
}
