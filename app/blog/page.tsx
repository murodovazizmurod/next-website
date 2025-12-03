import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate, calculateReadingTime } from '@/lib/utils'
import { Metadata } from 'next'
import TagFilter from '@/components/TagFilter'
import { isAuthenticated } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'Blog | My Blog',
  description: 'Thoughts and articles',
  openGraph: {
    title: 'Blog | My Blog',
    description: 'Thoughts and articles',
    type: 'website',
  },
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { tag?: string }
}) {
  const allPosts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  // Get all unique tags
  const allTags = Array.from(
    new Set(
      allPosts
        .flatMap((post) => post.tags.split(',').map((t) => t.trim()))
        .filter((t) => t)
    )
  ).sort()

  // Filter by tag if provided
  const posts = searchParams.tag
    ? allPosts.filter((post) =>
        post.tags
          .split(',')
          .map((t) => t.trim())
          .includes(searchParams.tag!)
      )
    : allPosts

  const authenticated = await isAuthenticated()

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="flex items-center justify-between mb-6 sm:mb-8 flex-wrap gap-2">
        <TagFilter tags={allTags} activeTag={searchParams.tag} />
        {authenticated && (
          <Link
            href="/admin/blog/new"
            className="text-xs text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors inline-flex items-center gap-1"
          >
            <span>+</span>
            <span>Add</span>
          </Link>
        )}
      </div>
      
      {posts.length === 0 ? (
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-8">
          {searchParams.tag ? `No posts with tag "${searchParams.tag}"` : 'No posts yet.'}
        </p>
      ) : (
        <div className="space-y-12 sm:space-y-16 mt-6 sm:mt-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <article className="border-b border-gray-100 dark:border-gray-900 pb-8 sm:pb-12 hover:border-gray-300 dark:hover:border-gray-800 transition-colors">
                <h2 className="text-lg sm:text-xl font-light mb-3 group-hover:opacity-60 transition-opacity leading-tight">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <time>{formatDate(post.createdAt)}</time>
                    <span>·</span>
                    <span>{calculateReadingTime(post.content)} min</span>
                  </div>
                  {post.tags && (
                    <div className="flex gap-2 flex-wrap">
                      {post.tags.split(',').slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 rounded text-xs">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
