# 🚀 VibeCherry - Vercel Deployment Guide

This guide will walk you through deploying VibeCherry to Vercel and connecting it to your Supabase database.

## Prerequisites

- GitHub account (for connecting to Vercel)
- Supabase account (free tier works great)
- DeepSeek API key

## Step 1: Push to GitHub

If you haven't already, push your code to a GitHub repository:

```bash
# Initialize git if needed
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - VibeCherry production ready"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/vibecherry.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub
2. **Click "Add New Project"**
3. **Import your GitHub repository** (select the vibecherry repo)
4. **Configure the project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

5. **Click "Deploy"** (don't add environment variables yet - we'll do that after)

6. **Wait for the first deployment** to complete (it will fail without env vars, that's OK)

## Step 3: Set Up Supabase Database

1. **Go to [supabase.com](https://supabase.com)** and sign in
2. **Create a new project:**
   - Name: `vibecherry` (or your preferred name)
   - Database Password: Generate a strong password (save it!)
   - Region: Choose closest to your users
   - Wait 2-3 minutes for provisioning

3. **Run the database schema:**
   - Go to **SQL Editor** in your Supabase dashboard
   - Open `DATABASE_SCHEMA.sql` from this project
   - Copy the entire contents
   - Paste into SQL Editor
   - Click **Run** to execute

4. **Create Storage Bucket:**
   - Go to **Storage** in Supabase dashboard
   - Click **Create a new bucket**
   - Name: `spec-screenshots`
   - Make it **Public**
   - File size limit: **5MB**
   - Allowed MIME types: `image/png`

5. **Get your Supabase credentials:**
   - Go to **Project Settings** → **API**
   - Copy these values (you'll need them for Vercel):
     - **Project URL** (e.g., `https://xxxxx.supabase.co`)
     - **anon public** key
     - **service_role** key (keep this secret!)

## Step 4: Configure Vercel Environment Variables

1. **Go to your Vercel project dashboard**
2. **Click "Settings"** → **"Environment Variables"**
3. **Add the following variables:**

### Required Variables

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# DeepSeek API
DEEPSEEK_API_KEY=your_deepseek_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
FREE_SPECS_PER_MONTH=5
```

### Optional Variables (for screenshot service)

```bash
# Redis (if using screenshot worker)
REDIS_URL=redis://your-redis-url

# Screenshot Service
SCREENSHOT_BUCKET=spec-screenshots
NEXT_PUBLIC_SUPABASE_STORAGE_URL=https://your-project.supabase.co/storage/v1/object/public
```

4. **Set environment scope:**
   - For each variable, select:
     - ✅ **Production**
     - ✅ **Preview**
     - ✅ **Development** (optional)

5. **Click "Save"** for each variable

## Step 5: Redeploy

1. **Go to "Deployments"** tab in Vercel
2. **Click the three dots** on the latest deployment
3. **Click "Redeploy"**
4. **Wait for deployment** to complete

Your app should now be live! 🎉

## Step 6: Verify Deployment

1. **Visit your Vercel URL** (e.g., `https://vibecherry.vercel.app`)
2. **Test the signup flow:**
   - Create a new account
   - Verify it appears in Supabase Auth
   - Check that a profile was created in the `profiles` table

3. **Test The Writer:**
   - Create a spec
   - Verify it saves to the database
   - Check that usage limits are tracked

## Troubleshooting

### Build Fails

- **Check build logs** in Vercel dashboard
- **Verify all environment variables** are set
- **Ensure Node.js version** is 18+ (Vercel auto-detects)

### Database Connection Issues

- **Verify Supabase URL** is correct (no trailing slash)
- **Check RLS policies** are enabled in Supabase
- **Verify service role key** is set (for server-side operations)

### Authentication Not Working

- **Check NEXT_PUBLIC_SUPABASE_URL** and **NEXT_PUBLIC_SUPABASE_ANON_KEY**
- **Verify Supabase Auth** is enabled in your project
- **Check redirect URLs** in Supabase Auth settings:
  - Add: `https://your-app.vercel.app/**`
  - Add: `https://your-app.vercel.app`

### Environment Variables Not Working

- **Redeploy after adding variables** (they're only available on new deployments)
- **Check variable names** match exactly (case-sensitive)
- **Verify scope** includes Production environment

## Custom Domain (Optional)

1. **Go to Vercel project** → **Settings** → **Domains**
2. **Add your domain** (e.g., `vibecherry.com`)
3. **Follow DNS instructions** from Vercel
4. **Update Supabase Auth redirect URLs** to include your custom domain

## Updating the App

After making changes:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel will automatically:
- Detect the push
- Build the new version
- Deploy to production

## Monitoring

- **Vercel Analytics**: Built-in performance monitoring
- **Supabase Dashboard**: Database metrics and logs
- **Vercel Logs**: Real-time function logs

## Production Checklist

- [ ] All environment variables set in Vercel
- [ ] Database schema executed in Supabase
- [ ] Storage bucket created
- [ ] Auth redirect URLs configured
- [ ] Test signup/login flow
- [ ] Test spec creation
- [ ] Test feed browsing
- [ ] Custom domain configured (if applicable)
- [ ] Error tracking set up (optional: Sentry)

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

**Your app is now live on Vercel!** 🍒

