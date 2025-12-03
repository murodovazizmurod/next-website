'use client'

import { useEffect, useState, useRef } from 'react'
import { usePathname } from 'next/navigation'

export default function PageTransition() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const prevPathnameRef = useRef(pathname)

  useEffect(() => {
    // Only show loading if pathname actually changed
    if (prevPathnameRef.current !== pathname) {
      setIsLoading(true)
      setProgress(0)
      prevPathnameRef.current = pathname

      // Simulate smooth progress
      let currentProgress = 0
      const interval = setInterval(() => {
        currentProgress += Math.random() * 15
        if (currentProgress >= 90) {
          currentProgress = 90
          clearInterval(interval)
        }
        setProgress(currentProgress)
      }, 50)

      // Complete loading
      const timeout = setTimeout(() => {
        clearInterval(interval)
        setProgress(100)
        setTimeout(() => {
          setIsLoading(false)
          setProgress(0)
        }, 150)
      }, 400)

      return () => {
        clearInterval(interval)
        clearTimeout(timeout)
      }
    }
  }, [pathname])

  // Also listen for link clicks to start loading earlier
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      if (link && link.href && !link.href.startsWith('mailto:') && !link.href.startsWith('tel:')) {
        const url = new URL(link.href)
        if (url.origin === window.location.origin && url.pathname !== pathname) {
          setIsLoading(true)
          setProgress(10)
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pathname])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="h-[1px] bg-gray-100 dark:bg-gray-900">
        <div
          className="h-full bg-black dark:bg-white transition-all duration-200 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}

