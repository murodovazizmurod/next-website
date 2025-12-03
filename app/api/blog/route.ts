import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Auto-generate SEO fields from title and content
    const metaTitle = body.title
    const metaDesc = body.excerpt || body.content.replace(/<[^>]*>/g, '').slice(0, 160)
    const metaImage = await generateOGImage(body.title)
    
    const post = await prisma.blogPost.create({
      data: {
        ...body,
        metaTitle,
        metaDesc,
        metaImage,
      },
    })
    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating blog post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

async function generateOGImage(title: string): Promise<string> {
  // Generate a simple OG image URL from the title
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/api/og?title=${encodeURIComponent(title)}`
}

