import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { isAuthenticated } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const params = await Promise.resolve(context.params)
    const item = await prisma.mediaItem.findUnique({
      where: { id: params.id },
    })
    if (!item) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const params = await Promise.resolve(context.params)
    await prisma.mediaItem.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const params = await Promise.resolve(context.params)
    const body = await request.json()
    const { type, title, author, description, coverImage, link, fileUrl, rating } = body

    // Auto-generate SEO fields
    const metaTitle = title
    const metaDesc = description || ''
    const metaImage = await generateOGImage(title)

    const item = await prisma.mediaItem.update({
      where: { id: params.id },
      data: {
        type,
        title,
        author: author || null,
        description: description || null,
        coverImage: coverImage || null,
        link: link || null,
        fileUrl: fileUrl || null,
        rating: rating !== undefined && rating !== null && rating !== '' ? Number(rating) : null,
        metaTitle,
        metaDesc,
        metaImage,
      },
    })
    return NextResponse.json(item)
  } catch (error) {
    console.error('Update error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: 'Failed to update', details: errorMessage }, { status: 500 })
  }
}

async function generateOGImage(title: string): Promise<string> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/api/og?title=${encodeURIComponent(title)}`
}
