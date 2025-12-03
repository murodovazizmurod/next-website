'use client'

import { Music, Play } from 'lucide-react'
import { useMusicPlayer } from '@/contexts/MusicPlayerContext'

interface SongListProps {
  items: Array<{
    id: string
    title: string
    author?: string | null
    fileUrl?: string | null
    coverImage?: string | null
  }>
}

export default function SongList({ items }: SongListProps) {
  const { playTrack, currentTrack, isPlaying } = useMusicPlayer()

  const handleClick = (item: SongListProps['items'][0]) => {
    if (item.fileUrl) {
      playTrack(item.fileUrl, item.title, item.coverImage || undefined)
    }
  }

  return (
    <div className="space-y-2">
      {items.map((item) => {
        const isCurrentlyPlaying = currentTrack?.src === item.fileUrl && isPlaying
        
        return (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            className="flex items-center gap-2 text-sm hover:opacity-70 transition-opacity group w-full text-left"
          >
            {isCurrentlyPlaying ? (
              <Play className="w-3.5 h-3.5 text-black dark:text-white" />
            ) : (
              <Music className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
            )}
            <span className={`border-b border-current pb-0.5 ${isCurrentlyPlaying ? 'font-medium' : ''}`}>
              {item.title}
            </span>
            {item.author && (
              <span className="text-xs text-gray-400 dark:text-gray-500">· {item.author}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}

