# Production Environment Checklist

## Required Environment Variables

Your `.env` file (lines 1-7) should include these **required** variables for production:

### ✅ Critical (Must Have)

1. **`DATABASE_URL`** ⚠️ **REQUIRED**
   - Format: `postgresql://user:password@host:port/database`
   - **Important**: If your password contains `@`, URL-encode it as `%40`
   - Example: `postgresql://user:myp%40ssword@db.example.com:5432/mydb`
   - ❌ **NOT** `sqlite:///./test.db` (SQLite is for development only)

2. **`SUPABASE_URL`** ⚠️ **REQUIRED**
   - Format: `https://your-project.supabase.co`
   - Used for authentication token verification
   - Get from: Supabase Dashboard → Settings → API

3. **`SUPABASE_ANON_KEY`** ⚠️ **REQUIRED**
   - Supabase anonymous/public key
   - Used for API authentication
   - Get from: Supabase Dashboard → Settings → API

4. **`OPENAI_API_KEY`** ⚠️ **REQUIRED**
   - OpenAI API key for resume extraction
   - Required if you use the `/api/resume/extract` endpoint
   - Get from: https://platform.openai.com/api-keys

5. **`FRONTEND_URL`** ⚠️ **REQUIRED**
   - Your frontend domain (e.g., `https://your-app.vercel.app`)
   - Used for CORS configuration
   - **Must be a full URL** starting with `http://` or `https://`

6. **`DEBUG`** ⚠️ **REQUIRED**
   - Must be set to `false` in production
   - Setting to `true` is a security risk

### 🔶 Optional (Nice to Have)

- **`SUPABASE_SECRET_KEY`** - Only needed for admin operations
- **`GITHUB_ANALYZER_URL`** - Only if using GitHub analyzer microservice
- **`GITHUB_API_TOKEN`** - Optional, improves GitHub API rate limits

## Quick Validation

Run the validation script to check your configuration:

```bash
# Make sure your .env variables are loaded
export $(cat .env | grep -v '^#' | xargs)
python validate_env.py
```

Or if using a shell that supports it:
```bash
source <(cat .env | grep -v '^#' | sed 's/^/export /')
python validate_env.py
```

## Common Issues

### ❌ Issue: Password with `@` symbol
**Solution**: URL-encode the password
- `myp@ssword` → `myp%40ssword`
- Full URL: `postgresql://user:myp%40ssword@host:5432/db`

### ❌ Issue: Using SQLite in production
**Solution**: Switch to PostgreSQL (Supabase provides this)
- SQLite doesn't scale and can cause data corruption in production
- Use Supabase PostgreSQL connection string

### ❌ Issue: Missing FRONTEND_URL
**Solution**: Set your production frontend domain
- Example: `FRONTEND_URL=https://your-app.vercel.app`
- This is critical for CORS to work properly

### ❌ Issue: DEBUG=true in production
**Solution**: Always set `DEBUG=false` in production
- Debug mode exposes sensitive error information
- Can be a security vulnerability

## Production Deployment Checklist

- [ ] All required variables are set
- [ ] `DATABASE_URL` uses PostgreSQL (not SQLite)
- [ ] Password in `DATABASE_URL` is URL-encoded if it contains special characters
- [ ] `FRONTEND_URL` is set to your production frontend domain
- [ ] `DEBUG=false` is set
- [ ] All API keys are valid and have proper permissions
- [ ] CORS is configured correctly (check `app/middleware.py`)
- [ ] Database connection is tested and working
- [ ] Environment variables are set in your hosting platform (Railway, Render, etc.)

## Security Best Practices

1. **Never commit `.env` to git** - It's already in `.gitignore`
2. **Use environment variables in your hosting platform** - Don't hardcode secrets
3. **Rotate keys regularly** - Especially if exposed or compromised
4. **Use different keys for dev/staging/prod** - Never reuse production keys
5. **Limit API key permissions** - Only grant necessary scopes
6. **Monitor API usage** - Set up alerts for unusual activity

## Testing Your Configuration

After setting up your `.env`, test locally:

```bash
# Start the backend
cd backend
uvicorn app.main:app --reload

# Test health endpoint
curl http://localhost:8000/health

# Test with authentication (if you have a valid token)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/api/applications
```

If all tests pass, your configuration is ready for production! 🚀

