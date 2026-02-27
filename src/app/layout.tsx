import '@/styles/app.css'
import type { Metadata } from 'next'
import type { PropsWithChildren } from 'react'
import Providers from '@/components/providers'
import { appConfig } from '@/config'
import { font } from '@/shared/assets/font'

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
      <head>
        <link rel="theme-color" href="#000000" />
        <link rel="manifest" href="/manifest.json" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
      </head>
      <body className={`${font.className} antialiased`}>
        <Providers>
          <main className="sm:container-sm min-h-dvh w-full border-0 bg-background sm:border-x">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
