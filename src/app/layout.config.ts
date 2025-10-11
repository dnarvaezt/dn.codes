import { Geist, Geist_Mono } from "next/font/google"

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
})

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

export const layoutConfig = {
  fonts: {
    sans: geistSans,
    mono: geistMono,
  },
  htmlLang: "en",
  preconnect: ["https://fonts.gstatic.com"],
  manifest: "/manifest.webmanifest",
  icons: {
    icon: { href: "/icon.svg", type: "image/svg+xml" },
    appleTouchIcon: { href: "/icon.svg" },
  },
  mainContentId: "main-content",
  minHeightScreen: true,
  flexLayout: true,
} as const
