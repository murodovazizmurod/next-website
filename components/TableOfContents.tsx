'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface TocItem {
  id: string
  text: string
  level: number
}

export default function TableOfContents({ content }: { content: string }) {
  const [tocItems, setTocItems] = useState<TocItem[]>([])
  const [isOpen, setIsOpen] = useState(true)
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    // Parse headings from HTML content
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, 'text/html')
    const headings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6')
    
    const items: TocItem[] = []
    headings.forEach((heading, index) => {
      const id = `heading-${index}`
      heading.id = id
      items.push({
        id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName.charAt(1)),
      })
    })

    setTocItems(items)

    // Add scroll spy
    const handleScroll = () => {
      const scrollPos = window.scrollY + 100
      for (let i = items.length - 1; i >= 0; i--) {
        const element = document.getElementById(items[i].id)
        if (element && element.offsetTop <= scrollPos) {
          setActiveId(items[i].id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [content])

  if (tocItems.length === 0) return null

  return (
    <div className="sticky top-20 mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-light mb-2 hover:opacity-70 transition-opacity"
      >
        {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        <span>Contents</span>
      </button>
      {isOpen && (
        <nav className="text-xs space-y-1">
          {tocItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault()
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className={`block py-1 hover:opacity-70 transition-opacity ${
                item.level === 1 ? 'font-medium' : item.level === 2 ? 'ml-3' : 'ml-6'
              } ${
                activeId === item.id ? 'opacity-100' : 'opacity-60'
              }`}
            >
              {item.text}
            </a>
          ))}
        </nav>
      )}
    </div>
  )
}




