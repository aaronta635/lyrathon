# Frontend - Application Viewer

Simple frontend to view and manage applications with YouTube video and website iframes.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Configure API URL:**
   
   Create a `.env.local` file in the frontend directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   ```
   
   For production, set this to your deployed backend URL:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
   ```

3. **Run development server:**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

## Features

- ✅ View all applications
- ✅ Display YouTube videos in iframes (auto-converts URLs to embed format)
- ✅ Display websites in iframes (if `can_embed` is true)
- ✅ Add/update media for applications via PATCH API
- ✅ Form validation and error handling

## API Endpoints Used

- `GET /api/applications` - List all applications
- `PATCH /api/applications/{id}/media` - Update video and deploy URLs

## YouTube URL Formats Supported

The frontend automatically converts these YouTube URL formats to embed format:
- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID` (already embed format)

## Deployment

See deployment section below for architecture recommendations.

