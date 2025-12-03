'use client'

import { useState, useEffect } from 'react'
import ImageLightbox from './ImageLightbox'

export default function BlogContent({ content }: { content: string }) {
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null)

  useEffect(() => {
    // Add IDs to headings for TOC
    const headings = document.querySelectorAll('.prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6')
    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = `heading-${index}`
      }
    })

    // Add click handlers to images
    const images = document.querySelectorAll('.prose img')
    const clickHandlers: Array<(e: Event) => void> = []
    
    images.forEach((img) => {
      const imageElement = img as HTMLImageElement
      imageElement.style.cursor = 'pointer'
      const clickHandler = (e: Event) => {
        const target = e.target as HTMLImageElement
        setLightboxImage({ src: target.src, alt: target.alt || '' })
      }
      imageElement.addEventListener('click', clickHandler)
      clickHandlers.push(clickHandler)
    })

    return () => {
      images.forEach((img, index) => {
        const imageElement = img as HTMLImageElement
        imageElement.removeEventListener('click', clickHandlers[index])
      })
    }
  }, [content])

  return (
    <>
      <div
        className="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
      {lightboxImage && (
        <ImageLightbox
          src={lightboxImage.src}
          alt={lightboxImage.alt}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </>
  )
}

