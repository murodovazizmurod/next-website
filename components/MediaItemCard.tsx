'use client'

import Link from 'next/link'

interface MediaItemCardProps {
  item: {
    id: string
    type: string
    title: string
    author?: string | null
    description?: string | null
    coverImage?: string | null
    link?: string | null
    fileUrl?: string | null
    rating?: number | null
  }
}

export default function MediaItemCard({ item }: MediaItemCardProps) {
  return (
    <div className="border border-gray-200 dark:border-gray-900 rounded p-4 hover:border-gray-300 dark:hover:border-gray-800 transition-colors group">
      {item.coverImage && (
        <div className="mb-3 overflow-hidden rounded">
          <img
            src={item.coverImage}
            alt={item.title}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <h3 className="text-sm font-light mb-1 group-hover:opacity-70 transition-opacity line-clamp-1">
        {item.title}
      </h3>
      {item.author && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 line-clamp-1">{item.author}</p>
      )}
      {(item.type === 'book' || item.type === 'movie') && item.rating !== null && item.rating !== undefined && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
          ⭐ {item.rating.toFixed(1)}/5
        </p>
      )}
      <Link
        href={`/media/${item.id}`}
        className="text-xs text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors mt-2 block"
      >
        View →
      </Link>
    </div>
  )
}

