import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatDate, getBaseUrl } from '@/lib/utils'
import { Metadata } from 'next'
import PlayButton from '@/components/PlayButton'
import BookmarkButton from '@/components/BookmarkButton'
import EditDeleteButtons from '@/components/EditDeleteButtons'
import MediaActions from '@/components/MediaActions'
import { isAuthenticated } from '@/lib/auth'

interface PageProps {
  params: { id: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const item = await prisma.mediaItem.findUnique({
    where: { id: params.id },
  })

  if (!item) {
    return {
      title: 'Media Not Found',
    }
  }

  // Ensure OG image URL is absolute
  let ogImageUrl = item.metaImage || item.coverImage
  if (ogImageUrl) {
    if (ogImageUrl.startsWith('/')) {
      const baseUrl = getBaseUrl()
      ogImageUrl = `${baseUrl}${ogImageUrl}`
    }
  } else {
    // Generate OG image if no image is available
    const baseUrl = getBaseUrl()
    ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(item.title)}`
  }

  return {
    title: item.metaTitle || item.title,
    description: item.metaDesc || item.description || '',
    openGraph: {
      title: item.metaTitle || item.title,
      description: item.metaDesc || item.description || '',
      images: ogImageUrl ? [{ url: ogImageUrl }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: item.metaTitle || item.title,
      description: item.metaDesc || item.description || '',
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  }
}

export default async function MediaItemPage({ params }: PageProps) {
  const item = await prisma.mediaItem.findUnique({
    where: { id: params.id },
  })

  if (!item) {
    notFound()
  }

  return (
    <article className="max-w-3xl mx-auto px-6 py-20">
      <header className="mb-12">
        {item.coverImage && (
          <div className="mb-8">
            <img
              src={item.coverImage}
              alt={item.title}
              className="w-full h-96 object-cover rounded"
            />
          </div>
        )}
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-4xl font-light flex-1">{item.title}</h1>
          <div className="flex items-center gap-2">
            {await isAuthenticated() && (
              <EditDeleteButtons
                type="media"
                id={item.id}
                editUrl={`/admin/media/edit/${item.id}`}
              />
            )}
            <BookmarkButton
              postId={item.id}
              postType="media"
              title={item.title}
              url={`/media/${item.id}`}
            />
          </div>
        </div>
        {item.author && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{item.author}</p>
        )}
        {(item.type === 'book' || item.type === 'movie') && item.rating !== null && item.rating !== undefined && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            ⭐ {item.rating.toFixed(1)}/5
          </p>
        )}
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-gray-500 mb-6">
          <span className="capitalize">{item.type}</span>
          <time>{formatDate(item.createdAt)}</time>
        </div>
      </header>
      
      {item.description && (
        <div className="mb-8">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {item.description}
          </p>
        </div>
      )}

      {item.type === 'song' && item.fileUrl && (
        <div className="mb-8">
          <PlayButton src={item.fileUrl} title={item.title} coverImage={item.coverImage || undefined} />
        </div>
      )}

      <MediaActions type={item.type} fileUrl={item.fileUrl} link={item.link} />
    </article>
  )
}

