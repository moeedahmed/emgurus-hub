# Plan: Admin Role-Gating — Hide Admin-Only UI from Regular Users

## Summary

Audit all user-facing components and conditionally hide admin/guru-only UI elements so regular users see a clean interface. Most admin pages are already route-guarded. The issues are **inline admin elements** visible on shared pages.

---

## Existing Role System

Three hooks exist (no need to create new ones):
- **`useAdmin()`** — `src/core/hooks/useAdmin.ts` — returns `{ isAdmin, isGuru, roles, isLoading }`
- **`useRoles()`** — `src/modules/exam/hooks/useRoles.ts` — returns `{ isAdmin, isGuru, isUser, roles, primaryRole, isLoading }`
- **`RoleGate`** — `src/modules/blog/components/auth/RoleGate.tsx` — wrapper component with fallback support

---

## Already Protected (No Changes Needed)

These are already correctly role-gated:

| Component | Protection |
|-----------|-----------|
| `Admin.tsx` (admin dashboard) | `useAdmin()` → redirects non-admins |
| `MilestoneValidationPage.tsx` | `useAdmin()` → redirects non-admins |
| `EditorEdit.tsx` — Featured toggle | `{isAdmin && (...)}` |
| `EditorEdit.tsx` — Approve/Reject buttons | `RoleGate roles={['admin','guru']}` |
| `BlogChat.tsx` | `if (!isAdmin && !isGuru) return null` |
| `BlogCategoryPanel.tsx` | `if (!isGuru && !isAdmin) return null` |
| `BlogEditorSidebar.tsx` — Category panel | `{!isUser && (...)}` |
| `AIOverviewPanel.tsx` — Generate button | `if (!isAdmin && !isReviewer) return null` |
| `AIOverviewPanel.tsx` — Refresh button | `(isAdmin || isReviewer) && (...)` |
| `QuestionChat.tsx` — Delete button | `{isAdmin && (...)}` |
| `BlogChat.tsx` — Delete button | `{(isAdmin || isMine) && (...)}` |
| `ExamConfig.tsx` — Paid bypass | `isAdmin || isGuru` for subscription check |
| Exam admin components (`QuestionGenerator`, `ExamsAICuration`, `QuestionSets`) | Not routed — only exist as files in `/admin/` folder, not imported into any user-facing route |

---

## Changes Needed

### Change 1: Question Bank — Hide `status` label from regular users
**File**: `src/modules/exam/pages/QuestionBankPage.tsx`
**Line**: 131
**Current**: Shows `{q.status}` (e.g., "published") as plain text to ALL users
**Problem**: Regular users don't need to see internal content status labels
**Fix**: Remove the status display entirely. Since this page only queries `status: 'published'` questions (line 66), the status is always "published" — it's redundant info for users.
**What users see instead**: Just the question stem, difficulty, and source type badges.

### Change 2: Question Bank — Hide `published_at` date badge from regular users
**File**: `src/modules/exam/pages/QuestionBankPage.tsx`
**Line**: 137-139
**Current**: Shows "Published {date}" badge to ALL users
**Problem**: Internal publishing metadata visible to regular users
**Fix**: Wrap in role check — only show to admin/guru. Import `useRoles` hook.
**What users see instead**: Just difficulty and source type badges.

### Change 3: Reviewed Question Bank — Hide `Published` badge from regular users
**File**: `src/modules/exam/pages/ReviewedQuestionBank.tsx`
**Lines**: 218-221
**Current**: Shows "Published X ago" badge to ALL users
**Problem**: Same as above — internal publishing metadata
**Fix**: Import `useRoles` and conditionally render. Only show to admin/guru.
**What users see instead**: Just difficulty and source type info.

### Change 4: Reviewed Question Bank — Remove `fromAdmin: true` hardcoded navigation
**File**: `src/modules/exam/pages/ReviewedQuestionBank.tsx`
**Line**: 163
**Current**: `navigate(\`/tools/submit-question/${it.id}\`, { state: { fromAdmin: true } })` — hardcoded `fromAdmin: true` for ALL users
**Problem**: Passes admin context to navigation even for regular users
**Fix**: Change to `{ state: { fromAdmin: embedded } }` to match the non-embedded version (line 209), or better yet, conditionally set based on actual role.

### Change 5: HubLayout — Add admin link to navigation (for admins only)
**File**: `src/core/layouts/HubLayout.tsx`
**Current**: No admin link in top nav or bottom nav — admins must type `/admin` manually
**Problem**: Not a hiding issue, but the inverse — admin link should exist but only for admins
**Fix**: Import `useAdmin()` from `@/core/hooks/useAdmin` and conditionally show a Settings/Shield icon link to `/admin` in the top bar, next to Profile and Logout. Only visible when `isAdmin` is true.
**What regular users see**: No change — they never see this link.

### Change 6: QuestionChat — Hide entire chat from regular users
**File**: `src/modules/exam/components/exams/QuestionChat.tsx`
**Current**: Chat is visible to ALL users (no role gate at component level). Only the delete button is gated.
**Problem**: The discussion panel between reviewers/admins about questions is visible to all users
**Fix**: Add `if (!isAdmin && !isGuru) return null;` early return (like BlogChat already does on line 186).
**What regular users see**: No discussion panel — cleaner question view.

---

## Files to Modify (6 files)

1. **`src/modules/exam/pages/QuestionBankPage.tsx`** — Remove status text (line 131), wrap published_at badge in role check (lines 137-139), add `useRoles` import
2. **`src/modules/exam/pages/ReviewedQuestionBank.tsx`** — Wrap "Published" badge in role check (lines 218-221), fix `fromAdmin: true` hardcode (line 163), add `useRoles` import
3. **`src/modules/exam/components/exams/QuestionChat.tsx`** — Add early return for non-admin/guru users (after line 22)
4. **`src/core/layouts/HubLayout.tsx`** — Add conditional admin nav link for admins only

---

## What Regular Users See After These Changes

- **Question Bank**: Questions with difficulty and source type only — no status labels, no publishing dates
- **Reviewed Question Bank**: Questions without "Published X ago" badges
- **Practice/Exam Sessions**: No reviewer discussion panel
- **Blog Editor**: Already gated — regular users see Save Draft / Submit for Review only
- **Navigation**: No admin link (admins see a shield icon in top bar)
- **Hub Dashboard**: No changes needed — already clean

## What Does NOT Change

- All admin route-level protections stay as-is
- All existing role checks in blog module stay as-is (already correct)
- No backend/RLS changes needed — this is purely UI visibility
- No new components or hooks needed — using existing `useRoles()` and `useAdmin()`
