# 🍒 VibeCherry - AI-Powered Spec Seeding

Automatically generate hundreds of battle-tested specifications using AI to populate your database.

## 🚀 Quick Start

### Option 1: Auto-Seed (Recommended - Easiest)

Automatically creates system user and generates 15 curated specs:

```bash
npm run seed:specs:auto
```

**Requirements:**
- `SUPABASE_SERVICE_ROLE_KEY` must be set (has admin privileges)
- `DEEPSEEK_API_KEY` must be set

### Option 2: Manual System User Setup

1. **Create system user in Supabase:**
   - Go to Supabase Dashboard → Authentication → Users
   - Click "Add User"
   - Email: `system@vibecherry.local`
   - Password: (generate secure password)
   - Copy the User ID

2. **Create profile:**
   - Run the SQL in `scripts/create-system-user.sql`
   - Replace `YOUR_USER_ID_HERE` with the actual user ID

3. **Generate specs:**
   ```bash
   npm run seed:specs:curated
   ```

### Option 3: Environment Variable

Set the system user ID as an environment variable:

```bash
export SYSTEM_USER_ID=your-user-id-here
npm run seed:specs:curated
```

## 📊 What Gets Generated

### Curated Specs (15 high-quality specs)
- ✅ SaaS Landing Page
- ✅ Creative Agency Portfolio
- ✅ E-commerce Product Launch
- ✅ Analytics Dashboard
- ✅ Project Management Dashboard
- ✅ CRM Dashboard
- ✅ REST API Documentation
- ✅ GraphQL API Reference
- ✅ Modern E-commerce Store
- ✅ Blog Platform
- ✅ Admin Dashboard
- ✅ Marketing Website
- ✅ Product Documentation

### Full Seeding (100+ specs)

Generate hundreds of diverse specs:

```bash
# Generate 100 specs (default)
npm run seed:specs

# Generate specific count
npm run seed:specs -- --count=50

# Generate for specific category
npm run seed:specs -- --category=saas-dashboard
```

## 🎯 Categories Covered

- Landing Pages
- SaaS Dashboards
- API Documentation
- Portfolios
- E-commerce
- Blogs
- Admin Panels
- Marketing Sites
- Documentation

## ⚙️ Configuration

### Environment Variables Required

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DEEPSEEK_API_KEY=your_deepseek_api_key
```

### Rate Limiting

Scripts include automatic delays:
- **Curated**: 3 seconds between specs
- **Full seeding**: 2 seconds between specs

This prevents hitting API rate limits.

## 📈 After Seeding

Your feed will now show:
- ✅ Real, AI-generated specs
- ✅ Diverse categories and difficulties
- ✅ Various vibes and styles
- ✅ Featured specs highlighted
- ✅ Searchable content
- ✅ Downloadable specifications

## 🔄 Ongoing Generation

You can run seeding multiple times:
- New specs will be added
- Existing specs won't be duplicated (by title)
- Featured status is randomized

## 💡 Tips

1. **Start Small**: Use `seed:specs:curated` first (15 specs)
2. **Scale Up**: Use `seed:specs` for more content
3. **Category Focus**: Generate for specific categories as needed
4. **Cost**: Each spec uses ~1 DeepSeek API call
5. **Quality**: Curated specs are hand-picked for quality

## 🐛 Troubleshooting

**"System user not found"**
- Run `seed:specs:auto` (creates user automatically)
- Or manually create user and set `SYSTEM_USER_ID`

**"Database error"**
- Verify `DATABASE_SCHEMA.sql` was run
- Check RLS policies allow service role inserts
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set (not anon key)

**"API rate limit"**
- Scripts include delays, but if you hit limits:
  - Wait and retry
  - Use `seed:specs:curated` for fewer calls
  - Check DeepSeek account credits

**"Profile creation failed"**
- User ID must exist in `auth.users` table
- Check foreign key constraint
- Verify service role has admin privileges

## 📝 Scripts Overview

- `seed-specs-auto.ts` - Auto-creates user, generates 15 curated specs
- `seed-specs-simple.ts` - Generates 15 curated specs (requires existing user)
- `seed-specs.ts` - Generates 100+ diverse specs (requires existing user)

## 🎉 Result

After seeding, your VibeCherry instance will have:
- A library of real, usable specifications
- Content that makes "hundreds of specs" meaningful
- Diverse examples across all categories
- Battle-tested specifications ready to download

---

**Made with 🍒 and AI magic**

