'use client'

import { Share2, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface ShareButtonsProps {
  title: string
  url: string
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const fullUrl = typeof window !== 'undefined' ? window.location.origin + url : url

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: fullUrl,
        })
      } catch (err) {
        // User cancelled or error
      }
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareToTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(title)}`, '_blank')
  }

  const canShare = typeof window !== 'undefined' && typeof navigator.share === 'function'

  return (
    <div className="flex items-center gap-3 pt-8 border-t border-gray-100 dark:border-gray-900">
      <span className="text-xs text-gray-400 dark:text-gray-500">Share:</span>
      <div className="flex items-center gap-2">
        {canShare && (
          <button
            onClick={handleShare}
            className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
            title="Share"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={shareToTelegram}
          className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
          title="Share on Telegram"
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.12l-6.87 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
          </svg>
        </button>
        <button
          onClick={handleCopy}
          className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
          title="Copy link"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  )
}

