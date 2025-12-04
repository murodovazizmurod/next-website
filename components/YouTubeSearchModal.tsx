'use client'

import { useState } from 'react'
import { X, Search, Play } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface YouTubeVideo {
  id: { videoId: string }
  snippet: {
    title: string
    description: string
    thumbnails: {
      medium: { url: string }
    }
  }
}

interface YouTubeSearchModalProps {
  onSelect: (videoUrl: string, videoId: string) => void
  onClose: () => void
}

export default function YouTubeSearchModal({ onSelect, onClose }: YouTubeSearchModalProps) {
  const [query, setQuery] = useState('')
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchYouTube = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)

    try {
      // Note: In production, you'd need to use YouTube Data API v3
      // For now, this is a placeholder that shows the structure
      // You'll need to set up YouTube API key and create an API route
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`)
      
      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setVideos(data.items || [])
    } catch (err) {
      setError('Failed to search YouTube. Please try again.')
      console.error('YouTube search error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchYouTube()
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col"
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-light">Search YouTube</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 border-b border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for videos..."
                className="flex-1 border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:border-black"
              />
              <button
                onClick={searchYouTube}
                disabled={loading || !query.trim()}
                className="px-4 py-2 border border-black rounded text-sm hover:bg-black hover:text-white transition-colors disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {error && (
              <p className="text-sm text-red-500 mb-4">{error}</p>
            )}

            {loading ? (
              <p className="text-sm text-gray-500 text-center py-8">Searching...</p>
            ) : videos.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">
                {query ? 'No videos found. Try a different search.' : 'Enter a search query to find videos.'}
              </p>
            ) : (
              <div className="space-y-4">
                {videos.map((video) => (
                  <button
                    key={video.id.videoId}
                    onClick={() => {
                      onSelect(`https://www.youtube.com/watch?v=${video.id.videoId}`, video.id.videoId)
                    }}
                    className="w-full flex gap-4 p-4 border border-gray-200 rounded hover:border-black transition-colors text-left"
                  >
                    <img
                      src={video.snippet.thumbnails.medium.url}
                      alt={video.snippet.title}
                      className="w-32 h-24 object-cover rounded flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-light mb-1 line-clamp-2">
                        {video.snippet.title}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {video.snippet.description}
                      </p>
                    </div>
                    <Play className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}




