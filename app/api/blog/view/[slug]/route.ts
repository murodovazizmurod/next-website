import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> | { slug: string } }
) {
  try {
    const params = await Promise.resolve(context.params)
    const slug = params.slug
    
    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
    }

    const post = await prisma.blogPost.findUnique({
      where: { slug },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    const updatedPost = await prisma.blogPost.update({
      where: { slug },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })
    
    return NextResponse.json({ viewCount: updatedPost.viewCount })
  } catch (error) {
    console.error('View count error:', error)
    return NextResponse.json(
      { error: 'Failed to update view count', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
