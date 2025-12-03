import { prisma } from '@/lib/prisma'
import { Metadata } from 'next'
import Link from 'next/link'
import MediaItemCard from '@/components/MediaItemCard'
import SongList from '@/components/SongList'
import { isAuthenticated } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Media | My Blog',
  description: 'Books, movies, songs, and more',
  openGraph: {
    title: 'Media | My Blog',
    description: 'Books, movies, songs, and more',
    type: 'website',
  },
}

export default async function MediaPage() {
  const items = await prisma.mediaItem.findMany({
    orderBy: { createdAt: 'desc' },
  })

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = []
    }
    acc[item.type].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  // Sort types to put songs first
  const sortedTypes = Object.keys(groupedItems).sort((a, b) => {
    if (a === 'song') return -1
    if (b === 'song') return 1
    return 0
  })

  const authenticated = await isAuthenticated()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {authenticated && (
        <div className="mb-6 sm:mb-8">
          <Link
            href="/admin/media/new"
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <span>+</span>
            <span>Add</span>
          </Link>
        </div>
      )}
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No media items yet.</p>
      ) : (
        <div className="space-y-12 sm:space-y-16">
          {sortedTypes.map((type) => {
            const typeItems = groupedItems[type]
            return (
              <section key={type}>
                <h2 className="text-xl sm:text-2xl font-light mb-6 sm:mb-8 capitalize">{type}</h2>
                {type === 'song' ? (
                  <SongList items={typeItems} />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {typeItems.map((item) => (
                      <MediaItemCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

