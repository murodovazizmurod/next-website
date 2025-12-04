'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { X } from 'lucide-react'

interface TagFilterProps {
  tags: string[]
  activeTag?: string
}

export default function TagFilter({ tags, activeTag }: TagFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (params.get('tag') === tag) {
      params.delete('tag')
    } else {
      params.set('tag', tag)
    }
    router.push(`/blog?${params.toString()}`)
  }

  const clearFilter = () => {
    router.push('/blog')
  }

  if (tags.length === 0) return null

  return (
    <div className="space-y-3">
      {activeTag && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 dark:text-gray-500">Filtered by:</span>
          <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 rounded text-xs">
            {activeTag}
          </span>
          <button
            onClick={clearFilter}
            className="w-4 h-4 flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-2 py-0.5 rounded text-xs transition-opacity hover:opacity-70 ${
              activeTag === tag
                ? 'bg-black dark:bg-white text-white dark:text-black'
                : 'bg-gray-100 dark:bg-gray-900'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}



