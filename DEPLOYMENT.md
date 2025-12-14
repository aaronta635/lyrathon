# Deployment Architecture

## Should you deploy backend and frontend separately?

**Yes, absolutely!** Here's why and how:

## Recommended Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │────────▶│    Backend      │
│   (Next.js)     │  API    │   (FastAPI)     │
│   Vercel/Netlify│  Calls  │  Railway/Render │
└─────────────────┘         └─────────────────┘
                                      │
                                      ▼
                            ┌─────────────────┐
                            │   Supabase      │
                            │   (Database)    │
                            └─────────────────┘
```

## Why Separate Deployment?

### ✅ Advantages:

1. **Independent Scaling**
   - Frontend and backend can scale separately
   - Frontend is static (can use CDN)
   - Backend handles dynamic requests

2. **Different Hosting Options**
   - Frontend: Vercel, Netlify (optimized for Next.js)
   - Backend: Railway, Render, Fly.io, AWS, etc.

3. **Security**
   - Backend API can have different CORS rules
   - Frontend doesn't expose backend secrets
   - Can use API keys/rate limiting per domain

4. **Development Workflow**
   - Frontend developers don't need backend access
   - Backend can be updated without frontend redeploy
   - Easier to test with different environments

5. **Cost Optimization**
   - Frontend hosting is often free (Vercel/Netlify)
   - Backend can be on cheaper/smaller instance
   - Can use different regions for each

### ❌ Disadvantages:

1. **CORS Configuration**
   - Need to configure CORS on backend for frontend domain
   - Update `app/middleware.py` with production frontend URL

2. **Environment Variables**
   - Frontend needs `NEXT_PUBLIC_API_URL` pointing to backend
   - Backend needs all its env vars

3. **Slightly More Complex**
   - Two deployments instead of one
   - Need to coordinate deployments

## Deployment Steps

### Backend Deployment

**Option 1: Railway (Recommended for FastAPI)**
1. Push code to GitHub
2. Connect Railway to your repo
3. Set environment variables:
   - `DATABASE_URL` (from Supabase)
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`
   - `GITHUB_ANALYZER_URL` (if using)
4. Railway auto-detects FastAPI and deploys
5. Get your backend URL: `https://your-app.railway.app`

**Option 2: Render**
1. Create new Web Service
2. Connect GitHub repo
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Set environment variables
6. Deploy

**Option 3: Fly.io**
```bash
fly launch
fly secrets set DATABASE_URL=...
fly deploy
```

### Frontend Deployment

**Option 1: Vercel (Recommended for Next.js)**
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api`
4. Deploy (automatic on push)

**Option 2: Netlify**
1. Connect GitHub repo
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variable:
   - `NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api`
4. Deploy

## CORS Configuration for Production

Update `backend/app/middleware.py`:

```python
def add_middlewares(app):
    frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[frontend_url],  # Your frontend domain
        allow_credentials=True,
        allow_methods=['*'],
        allow_headers=['*']
    )
```

Add to backend `.env`:
```env
FRONTEND_URL=https://your-frontend.vercel.app
```

## Environment Variables Checklist

### Backend (.env)
- [ ] `DATABASE_URL` - Supabase PostgreSQL connection string
- [ ] `SUPABASE_URL` - Supabase project URL
- [ ] `SUPABASE_ANON_KEY` - Supabase anon key
- [ ] `OPENAI_API_KEY` - OpenAI API key
- [ ] `GITHUB_ANALYZER_URL` - (Optional) GitHub analyzer service URL
- [ ] `FRONTEND_URL` - Frontend domain for CORS

### Frontend (.env.local)
- [ ] `NEXT_PUBLIC_API_URL` - Backend API URL

## Testing After Deployment

1. **Test Backend:**
   ```bash
   curl https://your-backend.railway.app/
   # Should return: {"message":"Enhanced FastAPI App"}
   ```

2. **Test Frontend:**
   - Visit your frontend URL
   - Check browser console for API errors
   - Test submitting an application
   - Test viewing applications

3. **Test CORS:**
   - Open browser DevTools → Network tab
   - Check if API requests succeed
   - Look for CORS errors in console

## Alternative: Monorepo Deployment

If you want to deploy together (not recommended but possible):

**Option: Docker Compose on Single Server**
- Use `docker-compose.yml` (already exists)
- Deploy to single VPS (DigitalOcean, AWS EC2, etc.)
- Frontend and backend on same domain, different ports/paths
- More complex but single deployment

**Recommendation:** Stick with separate deployments for flexibility and scalability.

## Quick Start Commands

### Backend (Local)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend (Local)
```bash
cd frontend
npm install
npm run dev
```

### Test Locally
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

