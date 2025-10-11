import type { Metadata } from "next"

export const siteMetadata: Metadata = {
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
