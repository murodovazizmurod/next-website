'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import RichTextEditor from '@/components/RichTextEditor'

export default function NewLivePostPage() {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save post')
      }

      router.push('/live')
    } catch (error) {
      console.error('Error saving post:', error)
      alert('Failed to save post')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-light mb-2">Content *</label>
          <RichTextEditor 
            value={content} 
            onChange={setContent}
            placeholder="What's happening?"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving || !content.trim()}
            className="px-6 py-2 border border-black dark:border-white rounded text-sm hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors disabled:opacity-50"
          >
            {saving ? 'Posting...' : 'Post'}
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

