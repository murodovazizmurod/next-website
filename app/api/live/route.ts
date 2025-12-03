import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const post = await prisma.livePost.create({
      data: {
        content: body.content,
      },
    })
    return NextResponse.json(post)
  } catch (error) {
    console.error('Error creating live post:', error)
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 })
  }
}

