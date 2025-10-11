import { Footer, Navbar } from "@/infrastructure/components/layout"
import { Providers } from "@/infrastructure/components/providers"

export const DefaultLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Providers>
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
