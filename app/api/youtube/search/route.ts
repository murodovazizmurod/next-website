import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query) {
    return NextResponse.json({ error: 'Query parameter required' }, { status: 400 })
  }

  // Note: You'll need to set up YouTube Data API v3
  // Get an API key from: https://console.cloud.google.com/apis/credentials
  // Add it to your .env file as YOUTUBE_API_KEY
  
  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey) {
    // Return mock data for development
    return NextResponse.json({
      items: [
        {
          id: { videoId: 'dQw4w9WgXcQ' },
          snippet: {
            title: 'Example Video (YouTube API key not configured)',
            description: 'Please configure YOUTUBE_API_KEY in your .env file to enable YouTube search.',
            thumbnails: {
              medium: { url: 'https://via.placeholder.com/320x180' }
            }
          }
        }
      ]
    })
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error('YouTube API error')
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('YouTube API error:', error)
    return NextResponse.json({ error: 'Failed to search YouTube' }, { status: 500 })
  }
}

