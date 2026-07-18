import '@/styles/app.css'
import type { Metadata, Viewport } from 'next'
import type { PropsWithChildren } from 'react'
import { Footer } from 'shared/components/footer'
import { Navbar } from 'shared/components/navbar'
import Providers from '@/components/providers'
import { appConfig } from '@/config'
import { font } from '@/shared/assets/font'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: 'light',
  themeColor: '#18181B',
}

export const metadata: Metadata = {
  title: {
    default: appConfig.title,
    template: `%s - ${appConfig.title}`,
  },
  description: appConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${font.className} antialiased`}>
        <Providers>
          <main className="flex h-dvh flex-col">
            <Navbar />
            <main className="container w-full flex-1 p-4">{children}</main>
            <Footer />
          </main>
        </Providers>
      </body>
    </html>
  )
}
