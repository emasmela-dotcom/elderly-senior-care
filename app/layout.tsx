import type { Metadata, Viewport } from 'next'
import { DM_Sans, Fraunces } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import { Providers } from './providers'
import { SkipLink } from '@/components/SkipLink'
import { GardenBackdrop } from '@/components/GardenBackdrop'
import Footer from '@/components/Footer'
import { SubscriptionTrialBanner } from '@/components/SubscriptionTrialBanner'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CareConnect 24/7 - Your Care, Anytime',
  description:
    'Medications, appointments, health records, and the people you trust — organized in one calm place for seniors and families.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'CareConnect 24/7',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#1A6B4A',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${dmSans.className} font-sans antialiased`}>
        <GardenBackdrop />
        <Providers>
          <SkipLink />
          <Navigation />
          <SubscriptionTrialBanner />
          <main
            id="main-content"
            className="relative z-[1] min-h-screen"
            tabIndex={-1}
          >
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
