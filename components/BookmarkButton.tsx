'use client'

import { useState, useEffect } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'

interface BookmarkButtonProps {
  postId: string
  postType: 'blog' | 'live' | 'media'
  title: string
  url: string
}

export default function BookmarkButton({ postId, postType, title, url }: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false)

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    setIsBookmarked(bookmarks.some((b: any) => b.id === postId))
  }, [postId])

  const toggleBookmark = () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]')
    
    if (isBookmarked) {
      const filtered = bookmarks.filter((b: any) => b.id !== postId)
      localStorage.setItem('bookmarks', JSON.stringify(filtered))
      setIsBookmarked(false)
    } else {
      bookmarks.push({ id: postId, type: postType, title, url, createdAt: new Date().toISOString() })
      localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
      setIsBookmarked(true)
    }
  }

  return (
    <button
      onClick={toggleBookmark}
      className="w-5 h-5 flex items-center justify-center opacity-40 hover:opacity-70 transition-opacity"
      aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
    >
      {isBookmarked ? (
        <BookmarkCheck className="w-3.5 h-3.5" />
      ) : (
        <Bookmark className="w-3.5 h-3.5" />
      )}
    </button>
  )
}




