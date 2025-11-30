# 🍒 VibeCherry Seed Scripts

These scripts automatically generate a library of specifications using AI to populate your database.

## Quick Start (Recommended)

Generate 15 curated, high-quality specs:

```bash
npm run seed:specs:curated
```

This generates a diverse set of production-ready specs across all categories.

## Full Seeding

Generate hundreds of specs (takes longer, uses more API credits):

```bash
# Generate 100 specs (default)
npm run seed:specs

# Generate specific count
npm run seed:specs -- --count=50

# Generate for specific category
npm run seed:specs -- --category=saas-dashboard
```

## Prerequisites

1. **Environment Variables** - Make sure these are set:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   DEEPSEEK_API_KEY=your_deepseek_api_key
   ```

2. **Database Setup** - Run `DATABASE_SCHEMA.sql` in Supabase first

3. **System User** - The script will create a system user automatically

## What Gets Generated

### Curated Specs (15 specs)
- Landing pages (SaaS, Agency, Product Launch)
- SaaS dashboards (Analytics, Project Management, CRM)
- API documentation (REST, GraphQL)
- E-commerce stores
- Blogs
- Admin panels
- Marketing sites
- Documentation sites

### Full Seeding (100+ specs)
- All categories covered
- Multiple difficulty levels
- Various vibes and styles
- Diverse features and pages
- Mix of featured and regular specs

## Usage Tips

1. **Start Small**: Run `seed:specs:curated` first to get 15 quality specs
2. **Scale Up**: Use `seed:specs` to generate more if needed
3. **Rate Limiting**: Scripts include delays to respect API limits
4. **Cost**: Each spec uses ~1 API call to DeepSeek

## After Seeding

Your feed will now show:
- ✅ Real specs to browse
- ✅ Diverse categories
- ✅ Different difficulty levels
- ✅ Various vibes and styles
- ✅ Featured specs highlighted

## Troubleshooting

**"Missing Supabase environment variables"**
- Check your `.env.local` file
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is set (not just anon key)

**"Database error"**
- Verify `DATABASE_SCHEMA.sql` was run
- Check RLS policies allow service role inserts

**"API rate limit"**
- Scripts include delays, but if you hit limits, wait and retry
- Consider using `seed:specs:curated` for fewer API calls

---

**Made with 🍒 and AI magic**

