import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatDate, calculateReadingTime, getBaseUrl } from '@/lib/utils'
import { Metadata } from 'next'
import BlogContent from '@/components/BlogContent'
import ToTopButton from '@/components/ToTopButton'
import ReadingProgress from '@/components/ReadingProgress'
import BookmarkButton from '@/components/BookmarkButton'
import EditDeleteButtons from '@/components/EditDeleteButtons'
import TableOfContents from '@/components/TableOfContents'
import ShareButtons from '@/components/ShareButtons'
import ViewCount from '@/components/ViewCount'
import { isAuthenticated } from '@/lib/auth'

interface PageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  })

  if (!post || !post.published) {
    return {
      title: 'Post Not Found',
    }
  }

  // Generate OG image URL if metaImage is missing or relative
  let ogImageUrl = post.metaImage
  if (!ogImageUrl || ogImageUrl.startsWith('/')) {
    const baseUrl = getBaseUrl()
    ogImageUrl = post.metaImage && post.metaImage.startsWith('/')
      ? `${baseUrl}${post.metaImage}`
      : `${baseUrl}/api/og?title=${encodeURIComponent(post.title)}`
  }

  return {
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.excerpt || '',
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDesc || post.excerpt || '',
      images: [{ url: ogImageUrl }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDesc || post.excerpt || '',
      images: [ogImageUrl],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  })

  if (!post || !post.published) {
    notFound()
  }

  const readingTime = calculateReadingTime(post.content)
  const authenticated = await isAuthenticated()

  return (
    <>
      <ReadingProgress />
      <ToTopButton />
      <article className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="w-full">
          <header className="mb-8 sm:mb-12">
            <div className="flex items-start justify-between mb-6 sm:mb-8 gap-4">
              <h1 className="text-2xl sm:text-3xl font-light leading-tight flex-1">{post.title}</h1>
              <div className="flex items-center gap-2 flex-shrink-0">
                {authenticated && (
                  <EditDeleteButtons
                    type="blog"
                    id={post.id}
                    editUrl={`/admin/blog/edit/${post.id}`}
                  />
                )}
                <BookmarkButton
                  postId={post.id}
                  postType="blog"
                  title={post.title}
                  url={`/blog/${post.slug}`}
                />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500 mb-6 sm:mb-8 flex-wrap gap-3">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <time>{formatDate(post.createdAt)}</time>
                <span>·</span>
                <span>{readingTime} min read</span>
                <span>·</span>
                <ViewCount slug={post.slug} initialCount={post.viewCount} />
              </div>
              {post.tags && (
                <div className="flex gap-2 flex-wrap">
                  {post.tags.split(',').map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-900 rounded text-xs">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>
          
          <div className="mb-8 sm:mb-12 w-full">
            <BlogContent content={post.content} />
          </div>
          
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-100 dark:border-gray-900 w-full">
            <ShareButtons title={post.title} url={`/blog/${post.slug}`} />
          </div>
        </div>
      </article>
    </>
  )
}

