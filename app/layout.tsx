import type { Metadata } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import { MusicPlayerProvider } from '@/contexts/MusicPlayerContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import GlobalMusicPlayer from '@/components/GlobalMusicPlayer'
import MainContent from '@/components/MainContent'
import KeyboardShortcuts from '@/components/KeyboardShortcuts'
import PageTransition from '@/components/PageTransition'
import LoadingScreen from '@/components/LoadingScreen'

export const metadata: Metadata = {
  title: "azizmurod's",
  description: "dlsjvtl av tf dlizpal, zayhunly)",
  openGraph: {
    title: "azizmurod's",
    description: "dlsjvtl av tf dlizpal, zayhunly)",
    type: 'website',
    images: [
      {
        url: '/api/og?home=true',
        width: 1200,
        height: 630,
        alt: "azizmurod's",
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "azizmurod's",
    description: "dlsjvtl av tf dlizpal, zayhunly)",
    images: ['/api/og?home=true'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <MusicPlayerProvider>
            <LoadingScreen />
            <PageTransition />
            <KeyboardShortcuts />
            <Navigation />
            <MainContent>
              {children}
            </MainContent>
            <GlobalMusicPlayer />
          </MusicPlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

