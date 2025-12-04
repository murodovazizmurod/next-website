import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
  <channel>
    <title>My Blog</title>
    <link>${baseUrl}</link>
    <description>A minimalistic blog</description>
    <language>en-us</language>
    ${posts
      .map((post) => {
        const content = post.content.replace(/<[^>]*>/g, '').substring(0, 200)
        return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${baseUrl}/blog/${post.slug}</link>
      <description>${escapeXml(content)}</description>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
      <guid>${baseUrl}/blog/${post.slug}</guid>
    </item>`
      })
      .join('')}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}

function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}



