#!/usr/bin/env python3
"""
Phase B: Build blog hierarchy from Google Takeout breadcrumbs.

1. Extract breadcrumbs from the zip
2. Map folder names to existing Supabase slugs
3. Add parent_slug + breadcrumb_path columns to blog_posts
4. Update each post with its breadcrumb hierarchy
5. Update slugs to be hierarchical where appropriate
"""

import json, re, sys, urllib.request, zipfile

SUPABASE_URL = "https://eqljsghnuiysgruwztxs.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbGpzZ2hudWl5c2dydXd6dHhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzk4MzgxOCwiZXhwIjoyMDgzNTU5ODE4fQ.I4ZJMrLEg11qGgv-p9h4wfd7TrdlDAMMlXq2t_u4wvA"
MGMT_TOKEN_FILE = "/home/moeed/.supabase/access-token"
PROJECT_REF = "eqljsghnuiysgruwztxs"
ZIP_PATH = "_import/google-takeout/takeout.zip"

HEADERS = {
    "apikey": SERVICE_KEY,
    "Authorization": f"Bearer {SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

DRY_RUN = "--dry-run" in sys.argv

def api(method, path, data=None):
    url = f"{SUPABASE_URL}/rest/v1/{path}"
    body = json.dumps(data).encode() if data else None
    req = urllib.request.Request(url, data=body, headers=HEADERS, method=method)
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read()) if r.status == 200 and method == "GET" else r.status

def mgmt_sql(query):
    """Run SQL via Supabase Management API."""
    with open(MGMT_TOKEN_FILE) as f:
        token = f.read().strip()
    data = json.dumps({"query": query}).encode()
    req = urllib.request.Request(
        f"https://api.supabase.com/v1/projects/{PROJECT_REF}/database/query",
        data=data,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method="POST"
    )
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())

def extract_breadcrumbs():
    """Extract breadcrumb paths from Google Takeout zip."""
    z = zipfile.ZipFile(ZIP_PATH)
    breadcrumbs = {}
    
    for entry in sorted(z.namelist()):
        if '/PUBLISHED/' not in entry or not entry.endswith('.html') or '/Home/' in entry:
            continue
        
        html = z.read(entry).decode('utf-8', errors='replace')
        blocks = re.findall(r'<div class="tyJCtd[^"]*"[^>]*>(.*?)</div>(?:\s*</div>)*', html, re.DOTALL)
        if not blocks:
            continue
        
        content = ' '.join(blocks)
        
        # Extract title
        title_m = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.DOTALL)
        title = re.sub(r'<[^>]*>', '', title_m.group(1)).strip() if title_m else ''
        
        # Extract breadcrumb
        bc = re.search(r'<p[^>]*>(.*?EM Gurus.*?)</p>', content, re.DOTALL)
        if bc:
            bc_text = re.sub(r'<[^>]*>', '', bc.group(1)).strip()
            bc_text = bc_text.replace('&gt;', '>').replace('&amp;', '&')
            parts = [p.strip() for p in bc_text.split('>') if p.strip()]
        else:
            parts = ['EM Gurus', title or entry.split('/')[-2]]
        
        folder = entry.split('/')[-2] if '/index.html' in entry else entry.split('/')[-1].replace('.html', '')
        breadcrumbs[folder] = {'title': title, 'parts': parts}
    
    return breadcrumbs

def slugify(text):
    """Convert text to URL-friendly slug."""
    s = text.lower().strip()
    s = re.sub(r'[^a-z0-9\s-]', '', s)
    s = re.sub(r'[\s-]+', '-', s)
    return s.strip('-')

def main():
    print("Step 1: Extracting breadcrumbs from zip...")
    breadcrumbs = extract_breadcrumbs()
    print(f"  Found {len(breadcrumbs)} posts with breadcrumbs")
    
    print("\nStep 2: Fetching existing posts from Supabase...")
    posts = []
    offset = 0
    while True:
        batch = api("GET", f"blog_posts?select=id,title,slug&order=created_at.asc&offset={offset}&limit=100")
        if not batch:
            break
        posts.extend(batch)
        offset += len(batch)
        if len(batch) < 100:
            break
    print(f"  Found {len(posts)} posts in DB")
    
    # Build mapping: try to match folder names to DB slugs
    slug_to_post = {p['slug']: p for p in posts}
    title_to_post = {}
    for p in posts:
        title_to_post[p['title'].lower()] = p
    
    print("\nStep 3: Adding breadcrumb columns to blog_posts...")
    if not DRY_RUN:
        try:
            result = mgmt_sql("""
                ALTER TABLE blog_posts 
                ADD COLUMN IF NOT EXISTS breadcrumb_path text[] DEFAULT '{}',
                ADD COLUMN IF NOT EXISTS parent_slug text DEFAULT NULL;
            """)
            print(f"  Columns added: {result}")
        except Exception as e:
            print(f"  Column add result: {e}")
    
    print("\nStep 4: Matching breadcrumbs to posts and updating...")
    matched = 0
    unmatched = []
    
    for folder, info in breadcrumbs.items():
        # Try to find matching post
        # The import script used a slugify that removed spaces and special chars
        # e.g., "A Battle for Breath" -> folder "A Battle for Breath" -> slug might be "abattleforbreath"
        possible_slugs = [
            folder.lower().replace(' ', '').replace('%20', ''),  # original import style
            folder.lower().replace(' ', '').replace('%20', '').replace('-', ''),
            slugify(info['title']),
            slugify(folder),
        ]
        
        post = None
        for slug_attempt in possible_slugs:
            if slug_attempt in slug_to_post:
                post = slug_to_post[slug_attempt]
                break
        
        if not post:
            # Try title match
            post = title_to_post.get(info['title'].lower())
        
        if not post:
            unmatched.append(f"  {folder} ({info['title']})")
            continue
        
        matched += 1
        parts = info['parts']
        
        # Build breadcrumb_path (excluding "EM Gurus" root and the page itself)
        # e.g., ["Career Pathways", "UK Pathway", "Entry Routes"]
        bc_path = parts[1:-1] if len(parts) > 2 else []
        
        # Determine parent_slug from breadcrumb
        # Parent is the section one level up
        parent_slug = None
        if len(parts) > 2:
            parent_title = parts[-2]
            parent_post = title_to_post.get(parent_title.lower())
            if parent_post:
                parent_slug = parent_post['slug']
        
        if DRY_RUN:
            print(f"  [DRY] {post['slug']}: path={bc_path}, parent={parent_slug}")
        else:
            # Format array for PostgREST
            bc_array = '{' + ','.join(f'"{p}"' for p in bc_path) + '}'
            update = {"breadcrumb_path": bc_path}
            if parent_slug:
                update["parent_slug"] = parent_slug
            
            try:
                # PostgREST expects arrays as JSON arrays
                payload = {"breadcrumb_path": bc_path}
                if parent_slug:
                    payload["parent_slug"] = parent_slug
                data = json.dumps(payload).encode()
                headers = {**HEADERS, "Content-Type": "application/json", "Prefer": "return=minimal"}
                req = urllib.request.Request(
                    f"{SUPABASE_URL}/rest/v1/blog_posts?id=eq.{post['id']}",
                    data=data, headers=headers, method="PATCH"
                )
                with urllib.request.urlopen(req) as r:
                    pass
            except Exception as e:
                print(f"  [ERR] {post['slug']}: {e}")
    
    print(f"\n  Matched: {matched}")
    if unmatched:
        print(f"  Unmatched ({len(unmatched)}):")
        for u in unmatched[:10]:
            print(u)
        if len(unmatched) > 10:
            print(f"  ... and {len(unmatched) - 10} more")
    
    print("\nDone!")

if __name__ == "__main__":
    main()
