# EMGurus Hub — UI Overhaul Spec

**Date:** 2026-02-11
**Status:** Draft — awaiting Moeed's approval before execution

---

## Context

The teal design system is now live (dark mode working). But several major UI issues remain:
1. Pages aren't mobile-responsive
2. No sidebar navigation (career-guru had it)
3. Admin content visible to all users
4. Modules look disjointed (different component styles)

## Reference

- **Career-guru** (career.emgurus.com) — gold standard for design
- **Old EMGurus** (`/mnt/c/Web Apps/emgurus/`) — had `WorkspaceLayout.tsx` with sidebar + tabs pattern
- **Old ProjectBrief.md** — defined workspace sections, role-based dashboards, chip atoms, filter patterns

---

## Task 1: Mobile Responsiveness Audit & Fix

**Priority: HIGH — do first**

### Pages to audit (375px viewport)
- Landing page
- Login / Signup
- Onboarding wizard
- Hub Dashboard (module tiles)
- Career module (all sub-pages)
- Exam module: Dashboard, Question Bank, AI Practice, Practice/Exam sessions
- Blog module: List, Detail, Write/Edit
- Forum module: Thread list, Thread detail, New thread
- Profile page
- Admin dashboard

### Common mobile issues to fix
- Text overflow / truncation (question bank cards)
- Filter bars not stacking vertically on mobile
- Horizontal scrolling (nothing should scroll horizontally)
- Touch targets too small (minimum 44x44px)
- Padding/margins too tight or too wide
- Tables → card layouts on mobile
- Modal/sheet sizing

### Approach
- Screenshot every page at 375px
- Log issues found
- Fix CSS/layout for each
- Re-screenshot and send to Moeed for verification

---

## Task 2: Admin Role-Gating

**Priority: HIGH — can run in parallel with Task 1**

### Current problem
- Question Bank shows "Published" status badges to all users
- Edit/settings icons (gear icons) visible to non-admins
- Admin-only content leaking into regular user views

### Fix approach
- Use existing `useAdmin()` hook to conditionally render admin-only UI
- Components to update:
  - `QuestionBankPage.tsx` — hide status badges, edit icons for non-admins
  - `QuestionDetail.tsx` — hide admin actions
  - `ReviewedQuestionBank.tsx` — admin-only page (gate entirely)
  - `ReviewedQuestionDetail.tsx` — admin-only page (gate entirely)
  - Blog post list — hide draft/review status for non-admins
  - Forum — hide moderation tools for non-admins

### Moeed's account
- Email: drmoeedahmed@gmail.com
- User ID: 820b6af9-c9df-4a7a-bd57-d9bfdd5019ca
- Role: admin ✅

### Test account (non-admin)
- Email: builder-test@emgurus.com
- User ID: 06020df8-8f20-4038-b549-c59af7e75744
- Role: none (regular user)

---

## Task 3: Navigation — Sidebar (Desktop) + Bottom Nav (Mobile)

**Priority: MEDIUM — do after Tasks 1 & 2**

### Decision: Option C (approved by Moeed)
- Desktop: Collapsible left sidebar with module sections
- Mobile: Bottom navigation bar (app-style)

### Structure

**Hub level (when not inside a module):**
- Desktop sidebar: Career Guru, Exam Guru, Blog, Forum, Profile, Admin (if admin)
- Mobile bottom nav: Home, Career, Exam, Blog, Profile

**Inside a module (e.g. Exam Guru):**
- Desktop sidebar: Module-specific sections
  - Exam: Dashboard, Question Bank, AI Practice, My Attempts, Progress
  - Career: Goals, Pathways, Roadmap, Chat
  - Blog: All Posts, My Drafts, Write New
  - Forum: All Threads, My Threads, New Thread
- Mobile bottom nav: Module-specific tabs (same as above, max 5)
- "← Hub" button in sidebar header to go back

### Reuse from old EMGurus
- `WorkspaceLayout.tsx` pattern (sidebar + tabs)
- `SidebarProvider` / `Sidebar` from Shadcn
- URL-addressable via `?view=...&tab=...`

### Admin section
- Centralised at `/admin` (already exists)
- Keep current 3 tabs: Users, Content, System Health
- Only visible to admin role users
- Each module's sidebar has an "Admin" link at the bottom → deep-links to that module's section within `/admin` (e.g. Exam sidebar "Admin" → `/admin?view=content&module=exam`)
- No per-module admin sections — all admin in one place, well-organised by module

---

## Task 4: Component Standardisation

**Priority: LOW — polish after Tasks 1-3**

### Goal
Make all modules feel like "one app" not "bolted together projects"

### Areas to standardise
- Card components (question cards, blog cards, forum thread cards)
- Button styles (primary teal, secondary outline, ghost)
- Empty states (consistent illustration + message pattern)
- Loading states (skeleton vs spinner)
- Filter patterns (search + dropdown chips)
- Page headers (title + subtitle + action buttons)

---

## Execution Plan

### Phase 1 (parallel — Claude Code tasks)
- **Task 1:** Mobile audit + fixes (all pages at 375px)
- **Task 2:** Admin role-gating (hide admin UI from regular users)

### Phase 2 (sequential — needs spec approval)
- **Task 3:** Sidebar navigation (desktop + mobile bottom nav)

### Phase 3 (polish)
- **Task 4:** Component standardisation across modules

### Verification
- Every fix: screenshot before/after → sent to Moeed's Telegram
- Every page: share direct link for Moeed to test on his phone
- Dual verification (Builder browser + Moeed manual) before marking complete

---

## Open Questions for Moeed

1. **Career module sidebar sections** — what tabs should Career have? (Goals, Pathways, Roadmap, Chat — anything else?)
2. **Should Forum appear in bottom nav on mobile?** (5 tabs max: Home, Career, Exam, Blog, ?)
3. **Any pages you want me to prioritise in the mobile audit?**
