/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'azizmurod.uz', 'www.azizmurod.uz'],
    unoptimized: true,
  },
  // Remove allowedDevOrigins in production - only needed for development
  ...(process.env.NODE_ENV === 'development' && {
    experimental: {
      allowedDevOrigins: [
        '2e0ebd0e18c7.ngrok-free.app',
      ],
    },
  }),
}

module.exports = nextConfig

