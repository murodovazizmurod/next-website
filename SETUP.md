# Setup Guide

## Initial Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up the Database**
   ```bash
   npm run db:push
   npm run db:generate
   ```
   This will create a SQLite database file (`dev.db`) in your project root.

3. **Create Uploads Directory**
   ```bash
   mkdir -p public/uploads
   ```

4. **Optional: YouTube API Key**
   To enable YouTube video search in the admin panel:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create a new API key
   - Enable YouTube Data API v3
   - Add the key to your `.env` file:
     ```
     YOUTUBE_API_KEY="your_api_key_here"
     ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Creating Your First Content

1. Go to `/admin` to access the admin panel
2. Create a blog post, live post, or media item
3. Upload images, videos, or files as needed
4. For blog posts, you can search and embed YouTube videos directly

## File Storage

- Uploaded files are stored in `public/uploads/`
- Make sure this directory exists and is writable
- For production, consider using a cloud storage service (AWS S3, Cloudinary, etc.)

## Database Management

- View/edit data: `npm run db:studio`
- Reset database: Delete `dev.db` and run `npm run db:push` again

## Production Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Set environment variables in your hosting platform

3. Make sure the `public/uploads` directory is persistent or use cloud storage

4. For better performance, consider:
   - Using a PostgreSQL database instead of SQLite
   - Setting up image optimization with Next.js Image component
   - Using a CDN for static assets

