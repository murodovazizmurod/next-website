import { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AuthCheck from '@/components/AuthCheck'

export const metadata: Metadata = {
  title: 'Admin | My Blog',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminPage() {
  return (
    <AuthCheck>
      <AdminContent />
    </AuthCheck>
  )
}

async function AdminContent() {
  const blogPosts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  })
  const livePosts = await prisma.livePost.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  })
  const mediaItems = await prisma.mediaItem.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <div className="space-y-12 mb-12">
        <Link
          href="/admin/blog/new"
          className="block border-b border-gray-100 dark:border-gray-900 pb-6 hover:border-gray-300 dark:hover:border-gray-800 transition-colors group"
        >
          <h2 className="text-xl font-light mb-1 group-hover:opacity-60 transition-opacity">New Blog Post</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Create a new blog post</p>
        </Link>

        <Link
          href="/admin/live/new"
          className="block border-b border-gray-100 dark:border-gray-900 pb-6 hover:border-gray-300 dark:hover:border-gray-800 transition-colors group"
        >
          <h2 className="text-xl font-light mb-1 group-hover:opacity-60 transition-opacity">New Live Post</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Create a quick update</p>
        </Link>

        <Link
          href="/admin/media/new"
          className="block border-b border-gray-100 dark:border-gray-900 pb-6 hover:border-gray-300 dark:hover:border-gray-800 transition-colors group"
        >
          <h2 className="text-xl font-light mb-1 group-hover:opacity-60 transition-opacity">New Media Item</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Add book, movie, or song</p>
        </Link>
      </div>

      <div className="space-y-12">
        <section>
          <h2 className="text-lg font-light mb-6">Recent Blog Posts</h2>
          <div className="space-y-4">
            {blogPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-900 pb-4">
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm hover:opacity-60 transition-opacity flex-1"
                >
                  {post.title}
                </Link>
                <Link
                  href={`/admin/blog/edit/${post.id}`}
                  className="text-xs text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white ml-4"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-light mb-6">Recent Live Posts</h2>
          <div className="space-y-4">
            {livePosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-900 pb-4">
                <Link
                  href="/live"
                  className="text-sm hover:opacity-60 transition-opacity flex-1 line-clamp-1"
                >
                  {post.content.replace(/<[^>]*>/g, '').substring(0, 50)}...
                </Link>
                <Link
                  href={`/admin/live/edit/${post.id}`}
                  className="text-xs text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white ml-4"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-light mb-6">Recent Media Items</h2>
          <div className="space-y-4">
            {mediaItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-900 pb-4">
                <Link
                  href={`/media/${item.id}`}
                  className="text-sm hover:opacity-60 transition-opacity flex-1"
                >
                  {item.title}
                </Link>
                <Link
                  href={`/admin/media/edit/${item.id}`}
                  className="text-xs text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white ml-4"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}


