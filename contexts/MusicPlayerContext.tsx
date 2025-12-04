'use client'

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react'

interface MusicPlayerContextType {
  currentTrack: {
    src: string
    title: string
    coverImage?: string
  } | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  playTrack: (src: string, title: string, coverImage?: string) => void
  togglePlay: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void
  toggleMute: () => void
  close: () => void
}

const MusicPlayerContext = createContext<MusicPlayerContextType | undefined>(undefined)

export function MusicPlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [currentTrack, setCurrentTrack] = useState<{ src: string; title: string; coverImage?: string } | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolumeState] = useState(1)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)
    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleError = (e: Event) => {
      const audio = e.target as HTMLAudioElement
      const error = audio.error
      if (error) {
        let errorMessage = 'Unknown audio error'
        switch (error.code) {
          case error.MEDIA_ERR_ABORTED:
            errorMessage = 'Audio playback was aborted'
            break
          case error.MEDIA_ERR_NETWORK:
            errorMessage = 'Network error while loading audio'
            break
          case error.MEDIA_ERR_DECODE:
            errorMessage = 'Audio decoding error - file may be corrupted or unsupported format'
            break
          case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Audio source not supported or file not found'
            break
        }
        console.error('Audio playback error:', errorMessage, error)
      } else {
        console.error('Audio playback error:', e)
      }
      setIsPlaying(false)
    }

    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('error', handleError)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('error', handleError)
    }
  }, [currentTrack])

  const playTrack = (src: string, title: string, coverImage?: string) => {
    // Validate the source URL
    if (!src || src.trim() === '') {
      console.error('Invalid audio source URL')
      return
    }

    setCurrentTrack({ src, title, coverImage })
    setIsPlaying(true)
    
    // Wait for audio element to be ready
    setTimeout(() => {
      const audio = audioRef.current
      if (!audio) {
        setIsPlaying(false)
        return
      }

      // Reset audio to ensure clean state
      audio.load()
      
      // Wait for audio to be ready to play
      const handleCanPlay = () => {
        audio.play().catch((error) => {
          console.error('Failed to play audio:', error)
          setIsPlaying(false)
        })
        audio.removeEventListener('canplay', handleCanPlay)
      }

      audio.addEventListener('canplay', handleCanPlay)
      
      // If already loaded, try playing immediately
      if (audio.readyState >= 2) {
        audio.play().catch((error) => {
          console.error('Failed to play audio:', error)
          setIsPlaying(false)
        })
      }
    }, 100)
  }

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch((error) => {
        console.error('Failed to play audio:', error)
        setIsPlaying(false)
      })
    }
  }

  const seek = (time: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = time
    setCurrentTime(time)
  }

  const setVolume = (vol: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = vol
    setVolumeState(vol)
    setIsMuted(vol === 0)
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.volume = volume || 0.5
      setIsMuted(false)
    } else {
      audio.volume = 0
      setIsMuted(true)
    }
  }

  const close = () => {
    const audio = audioRef.current
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
    setCurrentTrack(null)
    setIsPlaying(false)
    setCurrentTime(0)
  }

  return (
    <MusicPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        playTrack,
        togglePlay,
        seek,
        setVolume,
        toggleMute,
        close,
      }}
    >
      {children}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={currentTrack.src}
          preload="metadata"
          onLoadedMetadata={() => {
            if (audioRef.current) {
              setDuration(audioRef.current.duration)
            }
          }}
          onError={(e) => {
            const audio = e.currentTarget
            const error = audio.error
            if (error) {
              let errorMessage = 'Unknown audio error'
              switch (error.code) {
                case error.MEDIA_ERR_ABORTED:
                  errorMessage = 'Audio playback was aborted'
                  break
                case error.MEDIA_ERR_NETWORK:
                  errorMessage = 'Network error while loading audio'
                  break
                case error.MEDIA_ERR_DECODE:
                  errorMessage = 'Audio decoding error - file may be corrupted or unsupported format'
                  break
                case error.MEDIA_ERR_SRC_NOT_SUPPORTED:
                  errorMessage = 'Audio source not supported or file not found'
                  break
              }
              console.error('Audio loading error:', errorMessage, error)
            } else {
              console.error('Audio loading error:', e)
            }
            setIsPlaying(false)
          }}
        />
      )}
    </MusicPlayerContext.Provider>
  )
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext)
  if (context === undefined) {
    throw new Error('useMusicPlayer must be used within a MusicPlayerProvider')
  }
  return context
}



