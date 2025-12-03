'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Rss } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import GlobalSearch from './GlobalSearch'
import AuthNavClient from './AuthNavClient'

const navItems = [
  { href: '/blog', label: 'blog' },
  { href: '/live', label: 'live' },
  { href: '/media', label: 'media' },
]

export default function Navigation() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-12 sm:h-14">
          <Link 
            href="/" 
            className="text-xs font-light tracking-wider hover:opacity-50 transition-opacity sm:block"
          >
            {isHome ? '•' : '←'}
          </Link>
          <div className="flex items-center gap-3 sm:gap-6 absolute left-1/2 transform -translate-x-1/2 sm:relative sm:left-0 sm:transform-none">
            {navItems.map((item) => {
              const isActive = pathname?.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs font-light tracking-wider transition-opacity lowercase ${
                    isActive ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <AuthNavClient />
            <GlobalSearch />
            <Link
              href="/api/rss"
              className="w-5 h-5 flex items-center justify-center hover:opacity-70 transition-opacity"
              aria-label="RSS Feed"
            >
              <Rss className="w-4 h-4" />
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}

