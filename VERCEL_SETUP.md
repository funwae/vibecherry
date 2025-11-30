# 🚀 Vercel Deployment Setup - Quick Reference

## Pre-Deployment Checklist

- [x] ✅ Project structure is Vercel-ready
- [x] ✅ `vercel.json` configured
- [x] ✅ `.vercelignore` created
- [x] ✅ `.gitignore` updated
- [x] ✅ `next.config.js` optimized
- [x] ✅ Environment variables documented
- [x] ✅ Deployment guide created

## Quick Deploy Steps

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - VibeCherry production ready"
   git remote add origin https://github.com/YOUR_USERNAME/vibecherry.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Deploy (will fail without env vars - that's OK)

3. **Set Up Supabase**
   - Create new project at [supabase.com](https://supabase.com)
   - Run `DATABASE_SCHEMA.sql` in SQL Editor
   - Create `spec-screenshots` storage bucket

4. **Add Environment Variables in Vercel**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
   SUPABASE_SERVICE_ROLE_KEY=xxx
   DEEPSEEK_API_KEY=xxx
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   FREE_SPECS_PER_MONTH=5
   ```

5. **Redeploy**
   - Go to Deployments → Redeploy latest

## Environment Variables Reference

### Required
- `NEXT_PUBLIC_SUPABASE_URL` - From Supabase project settings
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - From Supabase project settings
- `SUPABASE_SERVICE_ROLE_KEY` - From Supabase project settings (keep secret!)
- `DEEPSEEK_API_KEY` - From DeepSeek platform
- `NEXT_PUBLIC_APP_URL` - Your Vercel deployment URL

### Optional
- `FREE_SPECS_PER_MONTH` - Default: 5
- `REDIS_URL` - Only if using screenshot worker
- `SCREENSHOT_BUCKET` - Default: spec-screenshots
- `NEXT_PUBLIC_SUPABASE_STORAGE_URL` - Supabase storage URL

## File Structure for Vercel

```
vibecherry/
├── app/                    # Next.js App Router
├── components/             # React components
├── lib/                    # Utilities and clients
├── public/                 # Static assets (if any)
├── vercel.json            # Vercel configuration ✅
├── .vercelignore          # Files to ignore ✅
├── .gitignore             # Git ignore rules ✅
├── next.config.js         # Next.js config ✅
├── package.json           # Dependencies ✅
├── tsconfig.json          # TypeScript config ✅
└── DEPLOYMENT.md          # Full deployment guide ✅
```

## Build Configuration

- **Framework**: Next.js (auto-detected)
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install`
- **Node Version**: 18.x (auto-detected)

## Post-Deployment

After deployment, verify:
1. ✅ Homepage loads
2. ✅ Signup creates user in Supabase
3. ✅ Profile is created in database
4. ✅ Writer generates specs
5. ✅ Feed displays specs
6. ✅ Collections work

## Troubleshooting

**Build fails?**
- Check Vercel build logs
- Verify all dependencies in package.json
- Ensure Node.js 18+ is used

**Database errors?**
- Verify Supabase credentials
- Check RLS policies are enabled
- Ensure DATABASE_SCHEMA.sql was run

**Auth not working?**
- Add redirect URLs in Supabase Auth settings
- Verify NEXT_PUBLIC_ variables are set
- Check middleware.ts is working

---

**See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.**

