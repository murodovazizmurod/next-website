# Quick Deploy Guide - azizmurod.uz

## Fastest Way: Deploy to Vercel (5 minutes)

### Prerequisites
- GitHub account
- Vercel account (free)
- PostgreSQL database (Vercel Postgres or external)

### Step-by-Step

#### 1. Prepare Your Code

```bash
# Make sure you're in the project directory
cd "C:\Users\user\Documents\Projects\my blog"

# Initialize git if not already done
git init
git add .
git commit -m "Prepare for deployment"
```

#### 2. Push to GitHub

1. Create a new repository on GitHub (e.g., `azizmurod-blog`)
2. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/azizmurod-blog.git
   git branch -M main
   git push -u origin main
   ```

#### 3. Set Up PostgreSQL Database

**Option A: Vercel Postgres (Recommended)**
- Go to [vercel.com](https://vercel.com) → Your Account → Storage
- Click "Create Database" → Select "Postgres"
- Copy the connection string (starts with `postgres://`)

**Option B: Supabase (Free)**
- Go to [supabase.com](https://supabase.com)
- Create a new project
- Go to Settings → Database → Connection String
- Copy the connection string

#### 4. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. **Before deploying**, click "Environment Variables" and add:
   - `DATABASE_URL` = `postgresql://...` (your PostgreSQL connection string)
   - `NEXT_PUBLIC_APP_URL` = `https://azizmurod.uz`
   - `ADMIN_PASSWORD` = `your_secure_password_here`
4. **IMPORTANT**: Before clicking Deploy, update `prisma/schema.prisma`:
   - Change line 9 from `provider = "sqlite"` to `provider = "postgresql"`
5. Click "Deploy"

#### 5. Run Database Migration

After deployment completes:

1. Install Vercel CLI (if not installed):
   ```bash
   npm i -g vercel
   ```

2. Link your project:
   ```bash
   vercel link
   ```

3. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

4. Run migration:
   ```bash
   npx prisma db push
   ```

   Or use Vercel's built-in terminal:
   - Go to your project on Vercel
   - Open the terminal
   - Run: `npx prisma db push`

#### 6. Configure Custom Domain

1. In Vercel dashboard → Your Project → Settings → Domains
2. Add `azizmurod.uz`
3. Add `www.azizmurod.uz` (optional)
4. Follow DNS instructions:
   - **Option 1**: Add CNAME record pointing to `cname.vercel-dns.com`
   - **Option 2**: Add A record pointing to Vercel's IP (shown in dashboard)

#### 7. Verify Deployment

- Visit `https://azizmurod.uz`
- Test admin login at `https://azizmurod.uz/login`
- Create a test blog post
- Check RSS feed: `https://azizmurod.uz/api/rss`
- Check sitemap: `https://azizmurod.uz/sitemap.xml`

## Important Notes

⚠️ **Before deploying, you MUST:**
1. Change Prisma provider from `sqlite` to `postgresql` in `prisma/schema.prisma`
2. Set up a PostgreSQL database (SQLite won't work on Vercel)
3. Set all environment variables in Vercel dashboard

✅ **After deployment:**
- Run `npx prisma db push` to create database tables
- Test all features (login, create post, upload files)
- Verify OG images are generating correctly

## Troubleshooting

**Build fails?**
- Check that `prisma/schema.prisma` has `provider = "postgresql"`
- Verify `DATABASE_URL` is set correctly
- Check build logs in Vercel dashboard

**Database connection error?**
- Verify `DATABASE_URL` format: `postgresql://user:password@host:port/database`
- Check database is accessible (not blocked by firewall)
- Ensure database exists and is running

**OG images not working?**
- Verify `public/fonts/SourceCodePro-Regular.ttf` exists
- Check that font file is committed to git
- Verify `NEXT_PUBLIC_APP_URL` is set correctly

## Need Help?

- Vercel Support: https://vercel.com/support
- Prisma Docs: https://www.prisma.io/docs
- Next.js Docs: https://nextjs.org/docs




