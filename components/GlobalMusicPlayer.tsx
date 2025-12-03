'use client'

import { useMusicPlayer } from '@/contexts/MusicPlayerContext'
import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react'

export default function GlobalMusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    close,
  } = useMusicPlayer()

  if (!currentTrack) return null

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-900">
      <div className="max-w-4xl mx-auto px-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-4 py-2 sm:py-3">
          {currentTrack.coverImage && (
            <img
              src={currentTrack.coverImage}
              alt={currentTrack.title}
              className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded flex-shrink-0"
            />
          )}
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xs font-light truncate mb-0.5 sm:mb-1">{currentTrack.title}</h3>
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={togglePlay}
                className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center border border-black dark:border-white rounded hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors flex-shrink-0"
              >
                {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              
              <div className="flex-1 min-w-0">
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={(e) => seek(parseFloat(e.target.value))}
                  className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>
              
              <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={toggleMute}
                  className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
                >
                  {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-16 h-1 bg-gray-200 dark:bg-gray-800 rounded appearance-none cursor-pointer"
                />
              </div>
              
              <button
                onClick={toggleMute}
                className="sm:hidden w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity flex-shrink-0"
              >
                {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
              </button>
              
              <button
                onClick={close}
                className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

