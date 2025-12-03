'use client'

import { useMusicPlayer } from '@/contexts/MusicPlayerContext'
import { Play } from 'lucide-react'

interface PlayButtonProps {
  src: string
  title: string
  coverImage?: string
}

export default function PlayButton({ src, title, coverImage }: PlayButtonProps) {
  const { playTrack } = useMusicPlayer()

  const handlePlay = () => {
    playTrack(src, title, coverImage)
  }

  return (
    <button
      onClick={handlePlay}
      className="flex items-center gap-1.5 px-3 py-1.5 border border-black rounded text-xs hover:bg-black hover:text-white transition-colors"
    >
      <Play className="w-3 h-3" />
      Play
    </button>
  )
}

