'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function LoadingScreen() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)

  useEffect(() => {
    // Show loading on initial page load
    if (isInitialLoad) {
      const timeout = setTimeout(() => {
        setIsLoading(false)
        setIsInitialLoad(false)
      }, 800)
      return () => clearTimeout(timeout)
    }
  }, [isInitialLoad])

  useEffect(() => {
    // Show loading on route changes
    if (!isInitialLoad) {
      setIsLoading(true)
      const timeout = setTimeout(() => {
        setIsLoading(false)
      }, 400)
      return () => clearTimeout(timeout)
    }
  }, [pathname, isInitialLoad])

  // Also listen for link clicks
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a')
      if (link && link.href && !link.href.startsWith('mailto:') && !link.href.startsWith('tel:') && !link.download) {
        const url = new URL(link.href)
        if (url.origin === window.location.origin && url.pathname !== pathname) {
          setIsLoading(true)
        }
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pathname])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Minimalistic creative loading animation */}
        <div className="relative w-12 h-12">
          {/* Rotating square with rounded corners */}
          <div className="absolute inset-0 border-2 border-black dark:border-white border-t-transparent rounded-sm animate-spin"></div>
          {/* Pulsing center dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
        
        {/* Minimal loading indicator */}
        <div className="flex items-center gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full"
              style={{
                animation: `pulse 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

