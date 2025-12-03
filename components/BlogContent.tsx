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
    images.forEach((img) => {
      img.style.cursor = 'pointer'
      img.addEventListener('click', (e) => {
        const target = e.target as HTMLImageElement
        setLightboxImage({ src: target.src, alt: target.alt || '' })
      })
    })

    return () => {
      images.forEach((img) => {
        img.removeEventListener('click', () => {})
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

