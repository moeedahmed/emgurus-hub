#!/usr/bin/env python3
"""Import old Google Sites pages from Google Takeout into Supabase blog tables.

Usage:
  python3 scripts/import_google_takeout.py [--zip PATH] [--limit N] [--dry-run]

Required environment variables:
  SUPABASE_URL
  SUPABASE_SECRET_KEY (preferred) or SUPABASE_SERVICE_ROLE_KEY (legacy)
  IMPORT_AUTHOR_ID (preferred) OR IMPORT_AUTHOR_EMAIL
"""

from __future__ import annotations

import argparse
import html
import os
import re
import sys
import uuid
import zipfile
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import PurePosixPath
from typing import Dict, Optional
from urllib.parse import quote

import requests
from bs4 import BeautifulSoup


DEFAULT_ZIP = "_import/google-takeout/takeout.zip"
PUBLISHED_PREFIX = "Takeout/Drive/Website/EM Gurus/PUBLISHED/"
ASSET_BUCKET = os.environ.get("BLOG_ASSET_BUCKET", "blog-covers")


@dataclass
class ImportStats:
    scanned: int = 0
    imported: int = 0
    updated: int = 0
    skipped: int = 0
    uploaded_assets: int = 0


def slugify(value: str) -> str:
    v = value.strip().lower()
    v = re.sub(r"\.html?$", "", v)
    v = re.sub(r"[^a-z0-9]+", "-", v)
    return re.sub(r"(^-|-$)", "", v) or "post"


def estimate_reading_minutes(text: str) -> int:
    words = len(re.findall(r"\w+", text))
    return max(1, round(words / 220))


def clean_title(raw_title: str, fallback_name: str) -> str:
    title = (raw_title or "").strip()
    if title.startswith("EM Gurus -"):
        title = title.replace("EM Gurus -", "", 1).strip()
    return title or fallback_name


class SupabaseClient:
    def __init__(self, url: str, service_key: str):
        self.url = url.rstrip("/")
        self.service_key = service_key
        self.base_headers = {
            "apikey": service_key,
            "Authorization": f"Bearer {service_key}",
        }

    def rest(self, method: str, path: str, *, params=None, json_body=None, headers=None):
        hdrs = dict(self.base_headers)
        if headers:
            hdrs.update(headers)
        if json_body is not None and "Content-Type" not in hdrs:
            hdrs["Content-Type"] = "application/json"
        res = requests.request(method, f"{self.url}/rest/v1/{path}", params=params, json=json_body, headers=hdrs, timeout=60)
        if res.status_code >= 400:
            raise RuntimeError(f"Supabase REST {method} {path} failed: {res.status_code} {res.text}")
        if not res.text:
            return None
        return res.json()

    def resolve_author_id(self, import_author_id: Optional[str], import_author_email: Optional[str]) -> str:
        if import_author_id:
            return import_author_id
        if not import_author_email:
            raise RuntimeError("Set IMPORT_AUTHOR_ID or IMPORT_AUTHOR_EMAIL")

        hdrs = dict(self.base_headers)
        res = requests.get(
            f"{self.url}/auth/v1/admin/users",
            headers=hdrs,
            params={"page": 1, "per_page": 1000},
            timeout=60,
        )
        if res.status_code >= 400:
            raise RuntimeError(f"Unable to resolve IMPORT_AUTHOR_EMAIL: {res.status_code} {res.text}")
        users = res.json().get("users", [])
        for u in users:
            if (u.get("email") or "").lower() == import_author_email.lower():
                return u.get("id")
        raise RuntimeError(f"No auth user found for IMPORT_AUTHOR_EMAIL={import_author_email}")

    def get_or_create_imported_category_id(self) -> str:
        self.rest(
            "POST",
            "blog_categories",
            params={"on_conflict": "slug"},
            json_body={"title": "Imported", "slug": "imported"},
            headers={"Prefer": "resolution=merge-duplicates,return=minimal"},
        )
        row = self.rest("GET", "blog_categories", params={"slug": "eq.imported", "select": "id", "limit": 1})
        if not row:
            raise RuntimeError("Unable to fetch/import blog category 'imported'")
        return row[0]["id"]

    def upsert_post(self, payload: dict) -> bool:
        data = self.rest(
            "POST",
            "blog_posts",
            params={"on_conflict": "slug", "select": "id,slug"},
            json_body=payload,
            headers={"Prefer": "resolution=merge-duplicates,return=representation"},
        )
        return bool(data)

    def upload_asset(self, object_path: str, blob: bytes, content_type: str):
        hdrs = dict(self.base_headers)
        hdrs["x-upsert"] = "true"
        hdrs["Content-Type"] = content_type
        res = requests.post(
            f"{self.url}/storage/v1/object/{ASSET_BUCKET}/{quote(object_path)}",
            headers=hdrs,
            data=blob,
            timeout=120,
        )
        if res.status_code >= 400:
            raise RuntimeError(f"Asset upload failed for {object_path}: {res.status_code} {res.text}")

    def public_asset_url(self, object_path: str) -> str:
        return f"{self.url}/storage/v1/object/public/{ASSET_BUCKET}/{quote(object_path)}"


def extract_main_content(html_text: str) -> tuple[str, str, str]:
    soup = BeautifulSoup(html_text, "html.parser")

    title_tag = soup.find("h1")
    page_title = title_tag.get_text(" ", strip=True) if title_tag else ""

    # Google Sites exports keep page content in .tyJCtd blocks.
    blocks = []
    seen = set()
    for node in soup.select(".tyJCtd"):
        text = re.sub(r"\s+", " ", node.get_text(" ", strip=True)).strip()
        if not text or text in seen:
            continue
        seen.add(text)
        blocks.append(str(node))

    if blocks:
        content_html = "\n".join(blocks)
        text = " ".join(re.sub(r"\s+", " ", BeautifulSoup(b, "html.parser").get_text(" ", strip=True)) for b in blocks)
    else:
        # fallback: entire body (minus scripts/styles)
        fallback = BeautifulSoup(html_text, "html.parser")
        for bad in fallback(["script", "style", "noscript", "meta", "link"]):
            bad.decompose()
        main = fallback.body or fallback
        for noise in main.select('header, footer, nav, [role="navigation"], [aria-label="Breadcrumbs"]'):
            noise.decompose()
        content_html = str(main)
        text = main.get_text(" ", strip=True)

    excerpt = re.sub(r"\s+", " ", text)[:280].strip()
    return page_title, content_html, excerpt


def infer_content_type(path: str) -> str:
    lower = path.lower()
    if lower.endswith(".png"):
        return "image/png"
    if lower.endswith(".gif"):
        return "image/gif"
    if lower.endswith(".webp"):
        return "image/webp"
    return "image/jpeg"


def rewrite_html_and_upload_assets(
    raw_html: str,
    zip_file: zipfile.ZipFile,
    html_zip_path: str,
    slug: str,
    supabase: SupabaseClient,
    asset_cache: Dict[str, str],
    stats: ImportStats,
    dry_run: bool,
) -> tuple[str, Optional[str]]:
    soup = BeautifulSoup(raw_html, "html.parser")
    html_dir = str(PurePosixPath(html_zip_path).parent)

    first_image_url: Optional[str] = None

    for img in soup.find_all("img"):
        src = (img.get("src") or "").strip()
        if not src or src.startswith("http") or src.startswith("data:"):
            continue

        resolved = str(PurePosixPath(html_dir) / src)
        resolved = resolved.replace("%20", " ")
        if resolved not in zip_file.namelist():
            # some exports have files at PUBLISHED root instead of nested folder
            fallback = str(PurePosixPath(PUBLISHED_PREFIX) / PurePosixPath(src).name)
            if fallback in zip_file.namelist():
                resolved = fallback
            else:
                continue

        if resolved in asset_cache:
            public_url = asset_cache[resolved]
        else:
            object_name = f"takeout/{slug}/{PurePosixPath(resolved).name}"
            public_url = supabase.public_asset_url(object_name)
            if not dry_run:
                blob = zip_file.read(resolved)
                supabase.upload_asset(object_name, blob, infer_content_type(resolved))
                stats.uploaded_assets += 1
            asset_cache[resolved] = public_url

        img["src"] = public_url
        if not first_image_url:
            first_image_url = public_url

    for a in soup.find_all("a"):
        href = (a.get("href") or "").strip()
        if not href or href.startswith(("http://", "https://", "mailto:", "tel:", "#")):
            continue
        href_clean = href.split("#", 1)[0].split("?", 1)[0]
        if href_clean.lower().endswith(".html"):
            internal_name = PurePosixPath(href_clean).name
            internal_slug = slugify(internal_name)
            a["href"] = f"/blogs/{internal_slug}"

    return str(soup), first_image_url


def import_takeout(zip_path: str, limit: Optional[int], dry_run: bool):
    supabase: Optional[SupabaseClient] = None
    author_id: Optional[str] = None
    category_id: Optional[str] = None

    if not dry_run:
        supabase_url = os.environ.get("SUPABASE_URL")
        service_key = os.environ.get("SUPABASE_SECRET_KEY") or os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
        if not supabase_url or not service_key:
            raise RuntimeError("SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) are required")

        import_author_id = os.environ.get("IMPORT_AUTHOR_ID")
        import_author_email = os.environ.get("IMPORT_AUTHOR_EMAIL")

        supabase = SupabaseClient(supabase_url, service_key)
        author_id = supabase.resolve_author_id(import_author_id, import_author_email)
        category_id = supabase.get_or_create_imported_category_id()

    stats = ImportStats()
    asset_cache: Dict[str, str] = {}

    with zipfile.ZipFile(zip_path) as zf:
        html_files = [
            n for n in zf.namelist()
            if n.startswith(PUBLISHED_PREFIX) and n.lower().endswith(".html")
        ]
        html_files.sort()
        if limit:
            html_files = html_files[:limit]

        print(f"Found {len(html_files)} published HTML pages")

        for html_path in html_files:
            stats.scanned += 1
            file_name = PurePosixPath(html_path).name
            if file_name.lower() in {"home.html"}:
                stats.skipped += 1
                continue

            raw = zf.read(html_path).decode("utf-8", errors="ignore")
            page_title, content_html, excerpt = extract_main_content(raw)
            title = clean_title(page_title, file_name.replace(".html", ""))
            slug = slugify(file_name)

            if dry_run:
                cover = None
            else:
                content_html, cover = rewrite_html_and_upload_assets(
                    content_html,
                    zf,
                    html_path,
                    slug,
                    supabase,
                    asset_cache,
                    stats,
                    dry_run,
                )

            now = datetime.now(timezone.utc).isoformat()
            payload = {
                "title": title,
                "slug": slug,
                "description": excerpt or title,
                "content": content_html,
                "cover_image_url": cover,
                "category_id": category_id,
                "author_id": author_id,
                "status": "published",
                "published_at": now,
                "reading_minutes": estimate_reading_minutes(excerpt or title),
                "updated_at": now,
            }

            if dry_run:
                print(f"[DRY RUN] {slug} <- {html_path}")
                stats.imported += 1
                continue

            supabase.upsert_post(payload)
            stats.imported += 1
            print(f"Imported: {slug}")

    print("\nImport complete")
    print(f"  Scanned pages:    {stats.scanned}")
    print(f"  Imported pages:   {stats.imported}")
    print(f"  Skipped pages:    {stats.skipped}")
    print(f"  Uploaded assets:  {stats.uploaded_assets}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--zip", default=DEFAULT_ZIP, help="Path to Google Takeout zip")
    parser.add_argument("--limit", type=int, default=None, help="Import only first N pages")
    parser.add_argument("--dry-run", action="store_true", help="Parse and print without writing to Supabase")
    args = parser.parse_args()

    zip_path = args.zip
    if not os.path.exists(zip_path):
        raise RuntimeError(f"Zip not found: {zip_path}")

    import_takeout(zip_path, args.limit, args.dry_run)


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        sys.exit(1)
