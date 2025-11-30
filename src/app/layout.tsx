import "@/infrastructure/assets/globals.scss"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Diego Narváez - Portfolio",
  description: "Portfolio personal de Diego Narváez - Desarrollador Full Stack",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
