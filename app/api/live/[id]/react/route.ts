import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { emoji, action, previousEmoji } = body

    if (!emoji) {
      return NextResponse.json({ error: 'Emoji required' }, { status: 400 })
    }

    if (!action || !['add', 'remove', 'change'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const post = await prisma.livePost.findUnique({
      where: { id: params.id },
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Get current reactions or initialize empty object
    const currentReactions = post.reactions 
      ? (JSON.parse(post.reactions) as Record<string, number>)
      : {}
    
    let updatedReactions = { ...currentReactions }

    if (action === 'remove') {
      // Remove reaction: decrement count, remove if 0
      if (updatedReactions[emoji] && updatedReactions[emoji] > 0) {
        updatedReactions[emoji] = updatedReactions[emoji] - 1
        if (updatedReactions[emoji] === 0) {
          delete updatedReactions[emoji]
        }
      }
    } else if (action === 'change' && previousEmoji) {
      // Change reaction: remove previous emoji, add new emoji
      // Always remove the previous one first
      if (updatedReactions[previousEmoji] && updatedReactions[previousEmoji] > 0) {
        updatedReactions[previousEmoji] = updatedReactions[previousEmoji] - 1
        if (updatedReactions[previousEmoji] === 0) {
          delete updatedReactions[previousEmoji]
        }
      }
      // Add the new emoji
      updatedReactions[emoji] = (updatedReactions[emoji] || 0) + 1
    } else if (action === 'add') {
      // Add new reaction: increment count
      // Safety check: if previousEmoji exists, this should have been a 'change', not 'add'
      // But we'll still process it as an add to be safe
      if (previousEmoji && previousEmoji !== emoji) {
        // This shouldn't happen, but if it does, treat it as a change
        if (updatedReactions[previousEmoji] && updatedReactions[previousEmoji] > 0) {
          updatedReactions[previousEmoji] = updatedReactions[previousEmoji] - 1
          if (updatedReactions[previousEmoji] === 0) {
            delete updatedReactions[previousEmoji]
          }
        }
      }
      updatedReactions[emoji] = (updatedReactions[emoji] || 0) + 1
    }

    // Update the post with new reactions
    const updatedPost = await prisma.livePost.update({
      where: { id: params.id },
      data: {
        reactions: JSON.stringify(updatedReactions),
      },
    })

    return NextResponse.json({
      reactions: JSON.parse(updatedPost.reactions || '{}') as Record<string, number>,
    })
  } catch (error) {
    console.error('Error updating reaction:', error)
    return NextResponse.json({ error: 'Failed to update reaction' }, { status: 500 })
  }
}

