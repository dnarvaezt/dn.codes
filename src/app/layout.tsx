import { layoutConfig } from "@/app/layout.config"
import { siteMetadata } from "@/app/metadata"
import "@/infrastructure/assets/globals.scss"
import { DefaultLayout } from "@/infrastructure/components/layout"

export const metadata = siteMetadata

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const { fonts, htmlLang, preconnect, manifest, icons } = layoutConfig

  const fontVariables = [fonts.sans.variable, fonts.mono.variable].filter(Boolean).join(" ")

  return (
    <html lang={htmlLang} suppressHydrationWarning>
      <head>
        {preconnect.map((url) => (
          <link key={url} rel="preconnect" href={url} crossOrigin="" />
        ))}
        {manifest && <link rel="manifest" href={manifest} />}
        {icons.icon && <link rel="icon" href={icons.icon.href} type={icons.icon.type} />}
        {icons.appleTouchIcon && <link rel="apple-touch-icon" href={icons.appleTouchIcon.href} />}
      </head>
      <body className={`${fontVariables} antialiased`}>
        <DefaultLayout>{children}</DefaultLayout>
      </body>
    </html>
  )
}

export default RootLayout
