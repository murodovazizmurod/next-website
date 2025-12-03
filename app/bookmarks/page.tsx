'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<any[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('bookmarks')
    if (stored) {
      setBookmarks(JSON.parse(stored))
    }
  }, [])

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter((b) => b.id !== id)
    setBookmarks(updated)
    localStorage.setItem('bookmarks', JSON.stringify(updated))
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-light mb-8">Bookmarks</h1>
      {bookmarks.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-gray-500">No bookmarks yet.</p>
      ) : (
        <div className="space-y-8">
          {bookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="border-b border-gray-100 dark:border-gray-900 pb-8 last:border-0"
            >
              <div className="flex items-start justify-between mb-2">
                <Link
                  href={bookmark.url}
                  className="text-xl font-light hover:opacity-60 transition-opacity flex-1"
                >
                  {bookmark.title}
                </Link>
                <button
                  onClick={() => removeBookmark(bookmark.id)}
                  className="text-xs text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white ml-4"
                >
                  Remove
                </button>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {bookmark.type} · {formatDate(new Date(bookmark.createdAt))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

