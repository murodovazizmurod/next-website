'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import FileUpload from '@/components/FileUpload'

export default function NewMediaItemPage() {
  const router = useRouter()
  const [type, setType] = useState('book')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [link, setLink] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [rating, setRating] = useState<number | ''>('')
  const [saving, setSaving] = useState(false)

  const handleFileUpload = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          title,
          author,
          description,
          coverImage,
          link,
          fileUrl,
          rating: rating === '' ? null : Number(rating),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save media item')
      }

      router.push('/media')
    } catch (error) {
      console.error('Error saving media item:', error)
      alert('Failed to save media item')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-light mb-2">Type *</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-900 rounded px-4 py-2 text-sm focus:outline-none focus:border-black dark:focus:border-white bg-transparent"
          >
            <option value="book">Book</option>
            <option value="movie">Movie</option>
            <option value="song">Song</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-light mb-2">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full border border-gray-200 dark:border-gray-900 rounded px-4 py-2 text-sm focus:outline-none focus:border-black dark:focus:border-white bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-light mb-2">Author/Creator</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border border-gray-200 dark:border-gray-900 rounded px-4 py-2 text-sm focus:outline-none focus:border-black dark:focus:border-white bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-light mb-2">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={6}
            className="w-full border border-gray-200 dark:border-gray-900 rounded px-4 py-2 text-sm focus:outline-none focus:border-black dark:focus:border-white bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-light mb-2">Cover Image</label>
          <FileUpload
            onUpload={async (file) => {
              const url = await handleFileUpload(file)
              setCoverImage(url)
              return url
            }}
            currentFile={coverImage}
            onRemove={() => setCoverImage('')}
          />
        </div>

        <div>
          <label className="block text-sm font-light mb-2">Link</label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://..."
            className="w-full border border-gray-200 dark:border-gray-900 rounded px-4 py-2 text-sm focus:outline-none focus:border-black dark:focus:border-white bg-transparent"
          />
        </div>

        {(type === 'book' || type === 'movie') && (
          <div>
            <label className="block text-sm font-light mb-2">Rating (0-5)</label>
            <input
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={rating === '' ? '' : String(rating)}
              onChange={(e) => {
                const val = e.target.value
                setRating(val === '' ? '' : (isNaN(parseFloat(val)) ? '' : parseFloat(val)))
              }}
              placeholder="4.5"
              className="w-full border border-gray-200 dark:border-gray-900 rounded px-4 py-2 text-sm focus:outline-none focus:border-black dark:focus:border-white bg-transparent"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-light mb-2">
            {type === 'book' ? 'PDF File' : type === 'song' ? 'Audio File' : 'File'}
          </label>
          <FileUpload
            onUpload={async (file) => {
              const url = await handleFileUpload(file)
              setFileUrl(url)
              return url
            }}
            currentFile={fileUrl}
            onRemove={() => setFileUrl('')}
            accept={
              type === 'book'
                ? { 'application/pdf': ['.pdf'] }
                : type === 'song'
                ? { 'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'] }
                : undefined
            }
            maxSize={type === 'book' ? undefined : 10 * 1024 * 1024}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 border border-black dark:border-white rounded text-sm hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Media Item'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-200 dark:border-gray-900 rounded text-sm hover:border-black dark:hover:border-white transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

