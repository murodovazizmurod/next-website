'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'

interface EditDeleteButtonsProps {
  type: 'blog' | 'live' | 'media'
  id: string
  editUrl: string
}

export default function EditDeleteButtons({ type, id, editUrl }: EditDeleteButtonsProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this?')) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/${type}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Delete failed')
      }

      if (type === 'blog') {
        router.push('/blog')
      } else if (type === 'live') {
        router.push('/live')
      } else {
        router.push('/media')
      }
      router.refresh()
    } catch (error) {
      console.error('Delete error:', error)
      alert('Failed to delete')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex items-center gap-2 opacity-40 hover:opacity-70 transition-opacity">
      <Link
        href={editUrl}
        className="w-5 h-5 flex items-center justify-center"
      >
        <Edit className="w-3.5 h-3.5" />
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="w-5 h-5 flex items-center justify-center"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

