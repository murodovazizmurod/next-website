'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function KeyboardShortcuts() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return
      }

      // ? - Show shortcuts help
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        // Could show a modal with shortcuts, but keeping minimal for now
        return
      }

      // j/k - Navigate between blog posts (only on blog pages)
      if ((e.key === 'j' || e.key === 'k') && pathname?.startsWith('/blog')) {
        // This would require fetching post list, keeping simple for now
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router, pathname])

  return null
}

