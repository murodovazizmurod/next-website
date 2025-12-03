'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const search = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await response.json()
        setResults(data.results || [])
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(search, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  const handleSelect = (result: any) => {
    router.push(result.url)
    setIsOpen(false)
    setQuery('')
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-5 h-5 flex items-center justify-center opacity-40 hover:opacity-70 transition-opacity"
        aria-label="Search"
      >
        <Search className="w-3.5 h-3.5" />
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-6">
      <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-900 rounded-lg w-full max-w-2xl shadow-lg">
        <div className="flex items-center gap-2 p-4 border-b border-gray-100 dark:border-gray-900">
          <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent text-sm focus:outline-none"
          />
          <button
            onClick={() => setIsOpen(false)}
            className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-xs text-gray-400 dark:text-gray-500">Searching...</div>
          ) : results.length === 0 && query ? (
            <div className="p-8 text-center text-xs text-gray-400 dark:text-gray-500">No results found</div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-900">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                >
                  <div className="text-sm font-light mb-1">{result.title}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{result.type}</div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-gray-400 dark:text-gray-500">
              Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-900 rounded text-xs">Ctrl+K</kbd> to search
            </div>
          )}
        </div>
      </div>
      <div
        className="fixed inset-0 bg-black/20 -z-10"
        onClick={() => setIsOpen(false)}
      />
    </div>
  )
}

