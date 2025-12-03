'use client'

import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const updateProgress = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const scrollableHeight = documentHeight - windowHeight
      const scrolled = scrollTop / scrollableHeight
      setProgress(Math.min(100, Math.max(0, scrolled * 100)))
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress()

    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  return (
    <div className="fixed top-14 left-0 right-0 h-0.5 bg-gray-100 dark:bg-gray-900 z-40">
      <div
        className="h-full bg-black dark:bg-white transition-all duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

