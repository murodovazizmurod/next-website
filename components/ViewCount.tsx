'use client'

import { useEffect, useState, useRef } from 'react'

interface ViewCountProps {
  slug: string
  initialCount: number
}

export default function ViewCount({ slug, initialCount }: ViewCountProps) {
  const [count, setCount] = useState(initialCount)
  const hasCounted = useRef(false)

  useEffect(() => {
    // Prevent double counting in React Strict Mode
    if (hasCounted.current) return
    
    hasCounted.current = true
    
    // Track view
    fetch(`/api/blog/view/${slug}`, {
      method: 'POST',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to track view')
        }
        return res.json()
      })
      .then((data) => {
        if (data.viewCount !== undefined) {
          setCount(data.viewCount)
        }
      })
      .catch((err) => {
        console.error('View count error:', err)
        // Reset on error so it can retry
        hasCounted.current = false
      })
  }, [slug])

  return <span>{count} views</span>
}

