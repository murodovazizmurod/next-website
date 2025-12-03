'use client'

import { useMusicPlayer } from '@/contexts/MusicPlayerContext'

export default function MainContent({ children }: { children: React.ReactNode }) {
  const { currentTrack } = useMusicPlayer()
  
  return (
    <main className={`min-h-screen pt-12 sm:pt-14 ${currentTrack ? 'pb-16 sm:pb-20' : ''}`}>
      {children}
    </main>
  )
}

