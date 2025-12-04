import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  const blogPosts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  })

  const mediaItems = await prisma.mediaItem.findMany({
    select: { id: true, updatedAt: true },
  })

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/live</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/media</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  ${blogPosts
    .map(
      (post) => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`
    )
    .join('')}
  ${mediaItems
    .map(
      (item) => `
  <url>
    <loc>${baseUrl}/media/${item.id}</loc>
    <lastmod>${item.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
    )
    .join('')}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}



