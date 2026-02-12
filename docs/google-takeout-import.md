# Google Takeout → EMGurus Hub import

## What this does
- Reads Google Takeout website export zip
- Parses `PUBLISHED/*.html` pages from old EM Gurus Google Sites export
- Uploads embedded page images to Supabase Storage (`blog-assets` bucket)
- Upserts posts into `blog_posts` with `status=published`
- Rewrites internal `.html` links to new `/blogs/{slug}` routes

## Preconditions
1. Set environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_SECRET_KEY` (preferred; modern) or `SUPABASE_SERVICE_ROLE_KEY` (legacy)
   - `IMPORT_AUTHOR_ID` (preferred) **or** `IMPORT_AUTHOR_EMAIL`

## Commands
```bash
# Dry run (parsing only, no DB/storage writes)
npm run import:takeout -- --dry-run

# Import all published pages
npm run import:takeout

# Import first 20 pages only (smoke test)
npm run import:takeout -- --limit 20
```

## Source zip path
Default zip path: `_import/google-takeout/takeout.zip`

Override path if needed:
```bash
npm run import:takeout -- --zip /absolute/path/to/takeout.zip
```

## Notes
- Export source is Google Sites (inferred from Takeout structure/HTML)
- Category for imported content is auto-created as `Imported`
- Script is idempotent via upsert on `blog_posts.slug`
- Assets upload to `blog-covers` by default (override with `BLOG_ASSET_BUCKET`)
