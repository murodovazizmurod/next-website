# My Minimalistic Blog

A minimalistic, professional blog built with Next.js, featuring blog posts, live updates, and media library.

## Features

- **Blog Section**: Rich text editing with tags, image/video upload
- **Live Section**: Twitter-like quick updates
- **Media Section**: Books, movies, songs with music player
- **SEO Optimized**: Custom meta tags for all pages
- **Admin Panel**: Full-featured content management with authentication
- **Edit/Delete**: Edit and delete posts (admin only)
- **Global Search**: Search across all content
- **Bookmarks**: Save posts for later
- **Reading Time**: Estimated reading time for posts
- **Dark Mode**: Light/dark theme toggle
- **RSS Feed**: Auto-generated RSS feed

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npm run db:push
npm run db:generate
```

3. Create `.env` file with:
```
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_PASSWORD="your_secure_password_here"
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the blog.

## Admin Access

1. Go to `/login` and enter your admin password
2. Once logged in, you'll see "admin" and "logout" links in the navigation
3. Access admin panel at `/admin` to create, edit, and delete posts

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma (SQLite)
- Tailwind CSS
- React Quill (Rich Text Editor)
- Framer Motion (Animations)

