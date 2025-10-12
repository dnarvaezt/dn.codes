import "@/infrastructure/assets/globals.scss"
import { DefaultLayout } from "@/infrastructure/components/layout"
import { Geist, Geist_Mono } from "next/font/google"

import type { Metadata } from "next"

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "dn.codes | Developer Portfolio",
  description:
    "Modern portfolio showcasing web development projects and skills with React, Next.js, and TypeScript",
  keywords: ["developer", "portfolio", "react", "nextjs", "typescript", "web development"],
}

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <DefaultLayout>{children}</DefaultLayout>
      </body>
    </html>
  )
}

export default RootLayout
