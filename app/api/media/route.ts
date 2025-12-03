import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Auto-generate SEO fields from title and description
    const metaTitle = body.title
    const metaDesc = body.description || ''
    const metaImage = body.coverImage || await generateOGImage(body.title)
    
    const item = await prisma.mediaItem.create({
      data: {
        ...body,
        metaTitle,
        metaDesc,
        metaImage,
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('Error creating media item:', error)
    return NextResponse.json({ error: 'Failed to create media item' }, { status: 500 })
  }
}

async function generateOGImage(title: string): Promise<string> {
  // Generate a simple OG image URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/api/og?title=${encodeURIComponent(title)}`
}

