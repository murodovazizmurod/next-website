# Deployment Checklist for azizmurod.uz

## Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All code committed to git
- [ ] Repository pushed to GitHub
- [ ] `.env` file is NOT committed (already in `.gitignore`)
- [ ] `public/fonts/SourceCodePro-Regular.ttf` exists and is committed

### 2. Database Migration
- [ ] **CRITICAL**: Change `prisma/schema.prisma` line 9:
  - From: `provider = "sqlite"`
  - To: `provider = "postgresql"`
- [ ] PostgreSQL database created (Vercel Postgres, Supabase, or other)
- [ ] Database connection string copied

### 3. Configuration Updates
- [ ] `next.config.js` updated (already done - includes azizmurod.uz in domains)
- [ ] Environment variables prepared:
  - `DATABASE_URL` (PostgreSQL connection string)
  - `NEXT_PUBLIC_APP_URL` = `https://azizmurod.uz`
  - `ADMIN_PASSWORD` (your secure password)

## Deployment Steps

### Step 1: Deploy to Vercel
- [ ] Go to vercel.com/new
- [ ] Import GitHub repository
- [ ] **Before clicking Deploy**, add environment variables:
  - [ ] `DATABASE_URL`
  - [ ] `NEXT_PUBLIC_APP_URL`
  - [ ] `ADMIN_PASSWORD`
- [ ] Click Deploy
- [ ] Wait for build to complete

### Step 2: Database Setup
- [ ] After deployment, run database migration:
  ```bash
  npx prisma db push
  ```
  (Use Vercel CLI or built-in terminal)

### Step 3: Domain Configuration
- [ ] In Vercel dashboard → Settings → Domains
- [ ] Add `azizmurod.uz`
- [ ] Add `www.azizmurod.uz` (optional)
- [ ] Configure DNS records as instructed by Vercel
- [ ] Wait for DNS propagation (can take up to 48 hours, usually < 1 hour)

### Step 4: Testing
- [ ] Visit `https://azizmurod.uz` (or temporary Vercel URL)
- [ ] Test homepage loads correctly
- [ ] Test admin login at `/login`
- [ ] Test creating a blog post
- [ ] Test creating a live post
- [ ] Test uploading an image
- [ ] Test music player functionality
- [ ] Check RSS feed: `/api/rss`
- [ ] Check sitemap: `/sitemap.xml`
- [ ] Verify OG images are generating (check blog post meta tags)

## Post-Deployment

### Security
- [ ] Change default admin password to a strong one
- [ ] Verify HTTPS is working (SSL certificate)
- [ ] Test that admin routes are protected

### Performance
- [ ] Check page load times
- [ ] Verify images are loading correctly
- [ ] Test on mobile devices

### SEO
- [ ] Verify meta tags are correct
- [ ] Test OG images in social media previews
- [ ] Submit sitemap to Google Search Console
- [ ] Verify RSS feed is accessible

## Rollback Plan

If something goes wrong:
1. Revert `prisma/schema.prisma` to `sqlite` for local development
2. Check Vercel deployment logs
3. Verify environment variables are correct
4. Re-run database migrations if needed

## Quick Commands

```bash
# Link Vercel project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run database migration
npx prisma db push

# Generate Prisma client
npm run db:generate

# Build locally to test
npm run build
npm start
```

## Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Domain Setup**: https://vercel.com/docs/concepts/projects/domains



