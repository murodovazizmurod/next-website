import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const title = searchParams.get('title') || 'My Blog'
    const isHome = searchParams.get('home') === 'true'

    // Load Source Code Pro font from public/fonts via HTTP - @vercel/og only supports TTF/OTF
    // In edge runtime, we fetch from the public URL (Next.js serves public/ folder)
    // Use the request URL to construct the font URL
    const url = new URL(request.url)
    // Force http for localhost in development
    const protocol = url.hostname === 'localhost' || url.hostname === '127.0.0.1' ? 'http' : url.protocol.replace(':', '')
    const host = url.host
    const fontUrl = `${protocol}://${host}/fonts/SourceCodePro-Regular.ttf`
    
    console.log(`Fetching font from: ${fontUrl}`)
    const response = await fetch(fontUrl)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch Source Code Pro font: ${response.status} ${response.statusText}`)
    }
    
    const fontData = await response.arrayBuffer()
    
    // Validate it's a valid font file
    if (fontData.byteLength < 1000) {
      throw new Error(`Source Code Pro font file too small: ${fontData.byteLength} bytes`)
    }
    
    console.log(`Successfully loaded Source Code Pro font: ${fontData.byteLength} bytes`)

    // Home page design with creative background
    if (isHome) {
      return new ImageResponse(
        (
          <div
            style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#ffffff',
              position: 'relative',
              fontFamily: 'SourceCodePro',
            }}
          >
            {/* Creative background shapes */}
            {/* Large circle */}
            <div
              style={{
                position: 'absolute',
                top: -200,
                right: -100,
                width: 600,
                height: 600,
                borderRadius: '50%',
                backgroundColor: '#f5f5f5',
                display: 'flex',
              }}
            />
            
            {/* Small circle */}
            <div
              style={{
                position: 'absolute',
                bottom: -150,
                left: -50,
                width: 400,
                height: 400,
                borderRadius: '50%',
                backgroundColor: '#fafafa',
                display: 'flex',
              }}
            />
            
            {/* Square shape */}
            <div
              style={{
                position: 'absolute',
                top: 100,
                left: 50,
                width: 120,
                height: 120,
                backgroundColor: '#000000',
                transform: 'rotate(45deg)',
                display: 'flex',
              }}
            />
            
            {/* Rectangle shape */}
            <div
              style={{
                position: 'absolute',
                bottom: 80,
                right: 80,
                width: 200,
                height: 8,
                backgroundColor: '#000000',
                display: 'flex',
              }}
            />
            
            {/* Diagonal line */}
            <div
              style={{
                position: 'absolute',
                top: 200,
                right: 200,
                width: 2,
                height: 300,
                backgroundColor: '#e5e5e5',
                transform: 'rotate(25deg)',
                display: 'flex',
              }}
            />
            
            {/* Small dots pattern */}
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: 150 + i * 80,
                  left: 100 + i * 60,
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  backgroundColor: '#000000',
                  display: 'flex',
                }}
              />
            ))}
            
            {/* Main text centered */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <div
                style={{
                  fontSize: 96,
                  fontWeight: 300,
                  color: '#000000',
                  lineHeight: 1.2,
                  letterSpacing: '0.05em',
                  display: 'flex',
                  textAlign: 'center',
                }}
              >
                azizmurod's
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
          fonts: [
            {
              name: 'SourceCodePro',
              data: fontData,
              style: 'normal' as const,
              weight: 400,
            },
          ],
        }
      )
    }

    // Blog post design (existing)
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            position: 'relative',
            padding: 100,
            fontFamily: 'SourceCodePro',
          }}
        >
          {/* Single minimal accent line */}
          <div
            style={{
              position: 'absolute',
              top: 100,
              left: 100,
              width: 4,
              height: 120,
              backgroundColor: '#000000',
            }}
          />

          {/* Main content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: 900,
              marginLeft: 40,
            }}
          >
            {/* Title with dot */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                marginBottom: 32,
              }}
            >
              <span
                style={{
                  fontSize: 72,
                  fontWeight: 300,
                  color: '#000000',
                  marginRight: 20,
                  lineHeight: 1,
                  marginTop: -8,
                  display: 'flex',
                }}
              >
                •
              </span>
              <span
                style={{
                  fontSize: 64,
                  fontWeight: 300,
                  color: '#000000',
                  lineHeight: 1.2,
                  letterSpacing: '0.05em',
                  display: 'flex',
                }}
              >
                {title}
              </span>
            </div>

            {/* Author attribution */}
            <div
              style={{
                fontSize: 18,
                color: '#666666',
                fontWeight: 400,
                marginTop: 8,
                display: 'flex',
              }}
            >
              <span>by </span>
              <span style={{ color: '#000000', fontWeight: 500, marginLeft: 4 }}>@murodovazizmurod</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'SourceCodePro',
            data: fontData,
            style: 'normal' as const,
            weight: 400,
          },
        ],
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}

