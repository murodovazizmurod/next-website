import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { Metadata } from 'next'
import Link from 'next/link'
import ToTopButton from '@/components/ToTopButton'
import LiveContent from '@/components/LiveContent'
import EditDeleteButtons from '@/components/EditDeleteButtons'
import LiveReactions from '@/components/LiveReactions'
import { isAuthenticated } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Live | My Blog',
  description: 'Quick updates and status',
  openGraph: {
    title: 'Live | My Blog',
    description: 'Quick updates and status',
    type: 'website',
  },
}

export default async function LivePage() {
  const posts = await prisma.livePost.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  const authenticated = await isAuthenticated()

  return (
    <>
      <ToTopButton />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {authenticated && (
          <div className="mb-6 sm:mb-8">
            <Link
              href="/admin/live/new"
              className="text-xs text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors inline-flex items-center gap-1"
            >
              <span>+</span>
              <span>Add</span>
            </Link>
          </div>
        )}
        {posts.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-gray-500">No updates yet.</p>
      ) : (
        <div className="relative pl-4 sm:pl-6">
          {/* Vertical timeline line */}
          <div className="absolute left-1.5 sm:left-2 top-0 bottom-0 w-px bg-gray-200 dark:bg-gray-800"></div>
          
          <div className="space-y-4 sm:space-y-6">
            {posts.map((post, index) => (
              <div key={post.id} className="relative">
                {/* Timeline dot */}
                <div className="absolute -left-[18px] sm:-left-[22px] top-1.5 w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 border-2 border-white dark:border-black"></div>
                
                <article className="group">
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <time className="text-[10px] text-gray-400 dark:text-gray-500 mb-2 block">
                        {formatDate(post.createdAt)}
                      </time>
                      <LiveContent content={post.content} />
                      <div className="mt-2">
                        <LiveReactions
                          postId={post.id}
                          initialReactions={post.reactions ? JSON.parse(post.reactions) as Record<string, number> : {}}
                        />
                      </div>
                    </div>
                    {authenticated && (
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <EditDeleteButtons
                          type="live"
                          id={post.id}
                          editUrl={`/admin/live/edit/${post.id}`}
                        />
                      </div>
                    )}
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </>
  )
}

