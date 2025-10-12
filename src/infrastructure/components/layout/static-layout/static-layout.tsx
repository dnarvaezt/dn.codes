import { ThemeToggle } from "../../theme"
import { DefaultLayout } from "../default-layout"
import "./static-layout.scss"

export const StaticLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <DefaultLayout>
      <div className="static-layout">
        {children}
        <div className="static-layout__theme-toggle">
          <ThemeToggle />
        </div>
      </div>
    </DefaultLayout>
  )
}
