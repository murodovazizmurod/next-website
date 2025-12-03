'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import RichTextEditor from '@/components/RichTextEditor'

export default function EditLivePostPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/live/${id}`)
        if (!response.ok) throw new Error('Failed to fetch')
        const post = await response.json()
        setContent(post.content)
      } catch (error) {
        console.error('Error fetching post:', error)
        router.push('/admin')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/live/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error('Failed to update post')
      }

      router.push('/live')
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-xs text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-light mb-2">Content *</label>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 border border-black dark:border-white rounded text-sm hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors disabled:opacity-50"
          >
            {saving ? 'Updating...' : 'Update Post'}
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

