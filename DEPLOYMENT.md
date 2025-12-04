# Deployment Guide for azizmurod.uz

This guide will help you deploy your blog to azizmurod.uz.

## Important: Database Migration Required

⚠️ **SQLite won't work on serverless platforms like Vercel** (read-only filesystem). You need to migrate to PostgreSQL.

## Option 1: Deploy to Vercel (Recommended)

Vercel is the easiest platform for Next.js deployment.

### Step 1: Prepare Your Code

1. **Update Prisma Schema for PostgreSQL**:
   - Change `provider = "sqlite"` to `provider = "postgresql"` in `prisma/schema.prisma`
   - Run `npm run db:generate` after the change

2. **Update `next.config.js`**:
   - Remove `allowedDevOrigins` (not needed in production)
   - Update `images.domains` to include your domain

3. **Create `.env.production`** (for reference):
   ```
   DATABASE_URL="postgresql://user:password@host:5432/database"
   NEXT_PUBLIC_APP_URL="https://azizmurod.uz"
   ADMIN_PASSWORD="your_secure_password_here"
   ```

### Step 2: Set Up PostgreSQL Database

**Option A: Vercel Postgres (Easiest)**
1. Go to your Vercel project dashboard
2. Navigate to Storage → Create Database → Postgres
3. Copy the connection string

**Option B: External PostgreSQL (Supabase, Railway, etc.)**
- Create a PostgreSQL database on your preferred provider
- Copy the connection string

### Step 3: Deploy to Vercel

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure environment variables:
     - `DATABASE_URL`: Your PostgreSQL connection string
     - `NEXT_PUBLIC_APP_URL`: `https://azizmurod.uz`
     - `ADMIN_PASSWORD`: Your admin password
   - Click "Deploy"

3. **Run Database Migrations**:
   - After deployment, go to your project settings
   - Open the terminal/console
   - Run: `npx prisma db push`
   - Or use Vercel's CLI: `vercel env pull` then `npx prisma db push`

### Step 4: Configure Custom Domain

1. In Vercel dashboard, go to your project → Settings → Domains
2. Add `azizmurod.uz` and `www.azizmurod.uz`
3. Follow Vercel's DNS configuration instructions:
   - Add an A record pointing to Vercel's IP
   - Or add a CNAME record pointing to your Vercel deployment

### Step 5: Update Environment Variables

Make sure these are set in Vercel:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_APP_URL`: `https://azizmurod.uz`
- `ADMIN_PASSWORD`: Your secure password

## Option 2: Deploy to Your Own Server

If you prefer self-hosting:

### Requirements
- Node.js 18+ installed
- PostgreSQL database
- Domain DNS configured
- SSL certificate (Let's Encrypt recommended)

### Steps

1. **Clone and build**:
   ```bash
   git clone <your-repo>
   cd my-blog
   npm install
   npm run build
   ```

2. **Set up environment variables**:
   ```bash
   export DATABASE_URL="postgresql://user:password@localhost:5432/database"
   export NEXT_PUBLIC_APP_URL="https://azizmurod.uz"
   export ADMIN_PASSWORD="your_secure_password"
   ```

3. **Run database migrations**:
   ```bash
   npx prisma db push
   ```

4. **Start the server**:
   ```bash
   npm start
   ```

5. **Use PM2 for process management**:
   ```bash
   npm install -g pm2
   pm2 start npm --name "azizmurod-blog" -- start
   pm2 save
   pm2 startup
   ```

6. **Set up Nginx reverse proxy** (example):
   ```nginx
   server {
       listen 80;
       server_name azizmurod.uz www.azizmurod.uz;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Set up SSL with Let's Encrypt**:
   ```bash
   sudo certbot --nginx -d azizmurod.uz -d www.azizmurod.uz
   ```

## Post-Deployment Checklist

- [ ] Database migrated from SQLite to PostgreSQL
- [ ] Environment variables configured
- [ ] Domain DNS configured
- [ ] SSL certificate installed
- [ ] Database migrations run
- [ ] Test admin login
- [ ] Test creating/editing posts
- [ ] Test file uploads
- [ ] Verify OG images work
- [ ] Check RSS feed at `/api/rss`
- [ ] Verify sitemap at `/sitemap.xml`

## Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database is accessible from your deployment platform
- Ensure database migrations have run

### File Upload Issues
- Check `public/uploads` directory exists and is writable
- For Vercel, consider using external storage (S3, Cloudinary)

### OG Image Generation Issues
- Verify font files exist in `public/fonts/`
- Check `@vercel/og` is properly configured

## Need Help?

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- Prisma Deployment: https://www.prisma.io/docs/guides/deployment



