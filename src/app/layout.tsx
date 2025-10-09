import { Footer, Navbar } from "@/components/layout"
import { StructuredData } from "@/components/seo"
import "@/styles/globals.scss"
import { Geist, Geist_Mono } from "next/font/google"

import type { Metadata } from "next"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "dn.codes | Developer Portfolio",
  description:
    "Modern portfolio showcasing web development projects and skills with React, Next.js, and TypeScript",
  keywords: ["developer", "portfolio", "react", "nextjs", "typescript", "web development"],
  authors: [{ name: "dn.codes" }],
  creator: "dn.codes",
  publisher: "dn.codes",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://dn.codes"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "dn.codes | Developer Portfolio",
    description: "Modern portfolio showcasing web development projects and skills",
    type: "website",
    locale: "en_US",
    url: "https://dn.codes",
    siteName: "dn.codes",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "dn.codes Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "dn.codes | Developer Portfolio",
    description: "Modern portfolio showcasing web development projects and skills",
    creator: "@dncodes",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="canonical" href="https://dn.codes" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon.svg" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StructuredData />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Skip to main content
        </a>
        <div className="flex min-h-screen flex-col">
          <Navbar />
          <main id="main-content" className="flex-1" role="main">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

// Next.js requires default export for layout files
export default RootLayout
