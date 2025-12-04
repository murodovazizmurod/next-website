'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import RichTextEditor from '@/components/RichTextEditor'
import { slugify } from '@/lib/utils'
import YouTubeSearchModal from '@/components/YouTubeSearchModal'

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [tags, setTags] = useState('')
  const [published, setPublished] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [showYouTubeModal, setShowYouTubeModal] = useState(false)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/blog/${id}`)
        if (!response.ok) throw new Error('Failed to fetch')
        const post = await response.json()
        setTitle(post.title)
        setContent(post.content)
        setExcerpt(post.excerpt || '')
        setTags(post.tags || '')
        setPublished(post.published)
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
      const slug = slugify(title)
      const response = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt,
          tags,
          published,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update post')
      }

      router.push(`/blog/${slug}`)
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post')
    } finally {
      setSaving(false)
    }
  }

  const handleInsertYouTube = (videoUrl: string, videoId: string) => {
    const embedCode = `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
    setContent(content + '\n' + embedCode)
    setShowYouTubeModal(false)
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
      <form onSubmit={handleSubmit} className="space-y-8">
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
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-light">Content *</label>
            <button
              type="button"
              onClick={() => setShowYouTubeModal(true)}
              className="text-xs text-gray-500 hover:text-black dark:hover:text-white"
            >
              Search YouTube
            </button>
          </div>
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        <div>
          <label className="block text-sm font-light mb-2">Excerpt</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="w-full border border-gray-200 dark:border-gray-900 rounded px-4 py-2 text-sm focus:outline-none focus:border-black dark:focus:border-white bg-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-light mb-2">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="design, development, thoughts"
            className="w-full border border-gray-200 dark:border-gray-900 rounded px-4 py-2 text-sm focus:outline-none focus:border-black dark:focus:border-white bg-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4"
          />
          <label htmlFor="published" className="text-sm font-light">
            Publish immediately
          </label>
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

      {showYouTubeModal && (
        <YouTubeSearchModal
          onSelect={handleInsertYouTube}
          onClose={() => setShowYouTubeModal(false)}
        />
      )}
    </div>
  )
}




