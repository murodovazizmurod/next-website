'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="w-6 h-6 flex items-center justify-center opacity-40 hover:opacity-70 transition-opacity"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="w-3.5 h-3.5" />
      ) : (
        <Sun className="w-3.5 h-3.5" />
      )}
    </button>
  )
}

