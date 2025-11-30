import "@/infrastructure/assets/globals.scss"
import type { Metadata } from "next"
import { Noto_Sans } from "next/font/google"

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
  display: "swap",
})

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
    <html lang="es" suppressHydrationWarning className={notoSans.variable}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
