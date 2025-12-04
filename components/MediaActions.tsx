'use client'

import { Download, ExternalLink } from 'lucide-react'

interface MediaActionsProps {
  type: string
  fileUrl?: string | null
  link?: string | null
}

export default function MediaActions({ type, fileUrl, link }: MediaActionsProps) {
  return (
    <div className="flex gap-4">
      {type === 'book' && fileUrl && (
        <a
          href={fileUrl}
          download
          className="flex items-center gap-2 px-4 py-2 border border-black dark:border-white rounded text-sm hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </a>
      )}
      
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 border border-black dark:border-white rounded text-sm hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Visit Link
        </a>
      )}
    </div>
  )
}



