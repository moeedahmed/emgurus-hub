#!/usr/bin/env python3
"""Clean up imported Google Sites blog post content in Supabase."""

import json, re, sys, urllib.request

SUPABASE_URL = "https://eqljsghnuiysgruwztxs.supabase.co"
SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVxbGpzZ2hudWl5c2dydXd6dHhzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Nzk4MzgxOCwiZXhwIjoyMDgzNTU5ODE4fQ.I4ZJMrLEg11qGgv-p9h4wfd7TrdlDAMMlXq2t_u4wvA"

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

def fetch_all_posts():
    """Fetch all posts, paginated."""
    all_posts = []
    offset = 0
    while True:
        posts = api("GET", f"blog_posts?select=id,title,content&order=created_at.asc&offset={offset}&limit=100")
        if not posts:
            break
        all_posts.extend(posts)
        offset += len(posts)
        if len(posts) < 100:
            break
    return all_posts

def clean_content(html):
    """Clean imported Google Sites content."""
    if not html:
        return html, False

    original = html
    
    # 1. Remove leading H1 title tags (they duplicate the page title)
    # May be wrapped in a <div> or standalone
    # Remove wrapper div if it only contains h1 tags
    html = re.sub(r'^\s*<div>\s*(?:<h1[^>]*>.*?</h1>\s*)+</div>\s*', '', html, count=1, flags=re.DOTALL)
    # Also catch standalone h1 at the start
    html = re.sub(r'^\s*<h1[^>]*>.*?</h1>\s*', '', html, count=1, flags=re.DOTALL)
    
    # 2. Remove breadcrumb paragraphs: <p> containing "EM Gurus > Category > ..." pattern
    # These have anchor links with /blog/ paths separated by " > "
    html = re.sub(
        r'<p[^>]*>\s*(?:<a[^>]*>.*?</a>\s*(?:<span>\s*&gt;\s*</span>|<span>\s*>\s*</span>)\s*)+(?:<span[^>]*>.*?</span>\s*)*</p>\s*',
        '', html, flags=re.DOTALL
    )
    # Simpler breadcrumb pattern: plain text with EM Gurus > ...
    html = re.sub(
        r'<p[^>]*>[^<]*EM Gurus[^<]*(?:&gt;|>)[^<]*</p>\s*',
        '', html, flags=re.DOTALL
    )
    
    # 3. Clean empty style attributes
    html = re.sub(r'\s*style=""', '', html)
    
    # 4. Fix old internal links
    # /blog/home -> /blog
    html = html.replace('href="/blog/home"', 'href="/blog"')
    html = html.replace("href='/blog/home'", "href='/blog'")
    # /blogs/ -> /blog/
    html = re.sub(r'href="/blogs/', 'href="/blog/', html)
    
    # 5. Remove empty style="text-align: center" from h1/h2/h3 that only center
    # (keep other styles)
    
    # 6. Strip empty divs and paragraphs left behind
    html = re.sub(r'<div>\s*</div>', '', html)
    html = re.sub(r'<p>\s*</p>', '', html)
    
    # 7. Strip leading/trailing whitespace
    html = html.strip()
    
    changed = html != original
    return html, changed

def main():
    posts = fetch_all_posts()
    print(f"Fetched {len(posts)} posts")
    
    updated = 0
    errors = 0
    
    for p in posts:
        cleaned, changed = clean_content(p.get("content", ""))
        if not changed:
            continue
        
        if DRY_RUN:
            print(f"  [DRY] Would update: {p['title'][:60]}")
            updated += 1
            continue
        
        try:
            status = api("PATCH", f"blog_posts?id=eq.{p['id']}", {"content": cleaned})
            if status in (200, 204):
                updated += 1
            else:
                print(f"  [ERR] {p['title'][:40]}: HTTP {status}")
                errors += 1
        except Exception as e:
            print(f"  [ERR] {p['title'][:40]}: {e}")
            errors += 1
    
    print(f"\n{'[DRY RUN] ' if DRY_RUN else ''}Updated: {updated}, Errors: {errors}, Unchanged: {len(posts)-updated-errors}")

if __name__ == "__main__":
    main()
