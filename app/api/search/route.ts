import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ results: [] })
  }

  try {
    const searchTerm = query.toLowerCase()
    const results: Array<{ id: string; type: string; title: string; url: string }> = []

    // Search blog posts - SQLite is case-insensitive by default
    const allBlogPosts = await prisma.blogPost.findMany({
      where: { published: true },
    })

    const blogPosts = allBlogPosts
      .filter((post) => {
        const title = post.title.toLowerCase()
        const excerpt = (post.excerpt || '').toLowerCase()
        const content = post.content.replace(/<[^>]*>/g, '').toLowerCase()
        return (
          title.includes(searchTerm) ||
          excerpt.includes(searchTerm) ||
          content.includes(searchTerm)
        )
      })
      .slice(0, 5)

    blogPosts.forEach((post) => {
      results.push({
        id: post.id,
        type: 'Blog Post',
        title: post.title,
        url: `/blog/${post.slug}`,
      })
    })

    // Search live posts
    const allLivePosts = await prisma.livePost.findMany()
    const livePosts = allLivePosts
      .filter((post) => {
        const content = post.content.replace(/<[^>]*>/g, '').toLowerCase()
        return content.includes(searchTerm)
      })
      .slice(0, 5)

    livePosts.forEach((post) => {
      results.push({
        id: post.id,
        type: 'Live Post',
        title: post.content.replace(/<[^>]*>/g, '').substring(0, 60) + '...',
        url: '/live',
      })
    })

    // Search media items
    const allMediaItems = await prisma.mediaItem.findMany()
    const mediaItems = allMediaItems
      .filter((item) => {
        const title = item.title.toLowerCase()
        const description = (item.description || '').toLowerCase()
        const author = (item.author || '').toLowerCase()
        return (
          title.includes(searchTerm) ||
          description.includes(searchTerm) ||
          author.includes(searchTerm)
        )
      })
      .slice(0, 5)

    mediaItems.forEach((item) => {
      results.push({
        id: item.id,
        type: `Media (${item.type})`,
        title: item.title,
        url: `/media/${item.id}`,
      })
    })

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed', results: [] }, { status: 500 })
  }
}

