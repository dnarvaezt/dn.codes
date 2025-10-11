import { Footer, Navbar } from "@/infrastructure/components/layout"
import { Providers } from "@/infrastructure/components/providers"
import { StructuredData } from "@/infrastructure/components/seo"

interface DefaultLayoutProps {
  children: React.ReactNode
}

export const DefaultLayout = ({ children }: DefaultLayoutProps) => {
  return (
    <Providers>
      <StructuredData />
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main id="main-content" className="flex-1" role="main">
          {children}
        </main>
        <Footer />
      </div>
    </Providers>
  )
}
