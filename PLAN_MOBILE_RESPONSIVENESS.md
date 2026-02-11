# Mobile Responsiveness Audit & Fix Plan — EMGurus Hub

## Complete Route Map (27 pages)

### Public Routes
1. `/` — Landing
2. `/login` — Login
3. `/signup` — SignUp
4. `/onboarding` — Onboarding (5-step wizard)

### Protected Routes (inside HubLayout)
5. `/hub` — HubDashboard
6. `/profile` — Profile
7. `/admin` — Admin (3 tabs: Users, Content, System)

### Career Module (inside ModuleLayout)
8. `/career` — DashboardPage
9. `/career/goals` — GoalsPage
10. `/career/pathways` — PathwaysPage
11. `/career/roadmap/:id` — RoadmapPage

### Exam Module (inside ModuleLayout)
12. `/exam` — ExamsPage (dashboard)
13. `/exam/bank` — QuestionBankPage
14. `/exam/config` — ExamConfig
15. `/exam/session/:id` — ExamSession
16. `/exam/report/:id` — ExamReport
17. `/exam/practice/config` — PracticeConfig
18. `/exam/practice/session/:id` — PracticeSession
19. `/exam/ai/config` — AiPracticeConfig
20. `/exam/ai/session/:id` — AiPracticeSession

### Blog Module (inside ModuleLayout)
21. `/blog` — Blogs (list)
22. `/blog/:slug` — BlogDetail
23. `/blog/category/:category` — BlogCategory
24. `/blog/editor` — BlogsEditor
25. `/blog/editor/new` — EditorNew
26. `/blog/editor/:id` — EditorEdit

### Forum Module (inside ModuleLayout)
27. `/forum` — ThreadList
28. `/forum/thread/:threadId` — ThreadDetail
29. `/forum/new` — NewThread

---

## Priority Tiers

**P0 = Broken at 375px** (content overflows, elements inaccessible)
**P1 = Poor UX at 375px** (cramped, hard to tap, awkward wrapping)
**P2 = Minor polish** (spacing, padding, could be tighter)

---

## Fixes Grouped by File

### Fix 1 — `src/modules/exam/components/exams/FloatingSettings.tsx`
**Priority: P0**
**Issue:** Settings card uses `w-80` (320px). On 375px viewport, this overflows the screen.
**Fix:** Change `w-80` → `w-[calc(100vw-2rem)] max-w-80` so it respects viewport width with 1rem margin on each side.

---

### Fix 2 — `src/modules/forum/pages/ThreadDetail.tsx`
**Priority: P0**
**Issues:**
- Vote buttons are ~28px tap area (p-1 + h-5 icon). Below 44px minimum.
- `whitespace-pre-wrap` on user content without `break-words` risks horizontal overflow.
- Reply metadata (avatar + name + full datetime) wraps badly at 375px.
- "Post Reply" button not full-width on mobile.
- Quote button awkwardly positioned on narrow screens.

**Fixes:**
1. Vote buttons: Add `min-h-[44px] min-w-[44px]` to vote button elements, increase padding to `p-2.5`.
2. User content: Add `break-words overflow-wrap-anywhere` alongside `whitespace-pre-wrap`.
3. Reply metadata: Shorten date to `month: 'short', day: 'numeric'` on mobile, hide time. Or wrap into two rows.
4. "Post Reply" button: Add `w-full sm:w-auto`.
5. Quote button: Move below content on mobile with `flex-col sm:flex-row` on the reply header.

---

### Fix 3 — `src/modules/blog/pages/BlogDetail.tsx`
**Priority: P0**
**Issues:**
- Hero `h-[60vh]` dominates mobile viewport.
- Hero title `text-4xl` too large for 375px (causes 2-3 word lines).
- Hero padding `p-8` excessive on mobile.
- Engagement buttons `gap-4` squeezes at 375px.
- Author cards `p-6` excessive on mobile.
- Mobile sticky bar may overlap content (missing bottom padding).

**Fixes:**
1. Hero height: `h-[40vh] sm:h-[50vh] lg:h-[60vh]`
2. Hero title: `text-2xl sm:text-3xl lg:text-4xl xl:text-5xl`
3. Hero padding: `p-4 sm:p-6 lg:p-8`
4. Engagement buttons gap: `gap-2 sm:gap-4`
5. Author cards: `p-4 sm:p-6`
6. Add `pb-20 sm:pb-6` to main content area to clear sticky bar.
7. Grid gap: `gap-4 sm:gap-6 lg:gap-8` (was `gap-8`)

---

### Fix 4 — `src/modules/blog/pages/EditorNew.tsx`
**Priority: P0**
**Issues:**
- Sidebar `hidden lg:block` with NO mobile alternative — users can't add blocks on mobile.
- Layout gap `gap-8` excessive.
- Card padding `p-8` excessive.
- Cover image preview `max-h-80` too tall on mobile.
- Empty state text references sidebar that doesn't exist on mobile.

**Fixes:**
1. Add a mobile block-picker: Either a Sheet/Drawer trigger or a sticky bottom toolbar that opens block palette on mobile. Add `lg:hidden` toggle button above editor area.
2. Gap: `gap-4 lg:gap-8`
3. Card padding: `p-4 sm:p-6 lg:p-8`
4. Cover image: `max-h-48 sm:max-h-64 lg:max-h-80`
5. Empty state: Change text to "Tap + to add blocks" on mobile, keep sidebar reference on desktop.

---

### Fix 5 — `src/modules/blog/pages/EditorEdit.tsx`
**Priority: P0**
**Same sidebar + padding issues as EditorNew.**
**Additional fixes:**
1. Same mobile block-picker solution as EditorNew.
2. Approval buttons `flex gap-4 justify-end` → `flex flex-col sm:flex-row gap-2 sm:gap-4 sm:justify-end` to stack on mobile.
3. Back button text: Truncate or abbreviate on mobile.

---

### Fix 6 — `src/modules/exam/pages/PracticeSession.tsx` + `AiPracticeSession.tsx`
**Priority: P1**
**Issue:** QuestionMap in mobile drawer uses `grid-cols-8` — too many columns at 375px (drawer is ~343px usable).
**Fix:** Change drawer QuestionMap grid to `grid-cols-6 sm:grid-cols-8`. Each button at 6 cols = ~52px width, comfortable for touch.

---

### Fix 7 — `src/modules/career/pages/MilestoneValidationPage.tsx` (admin page)
**Priority: P1**
**Issue:** Filter selects have hardcoded `w-[140px]` and `w-[160px]` — overflow at 375px.
**Fix:** Change to `w-full sm:w-[140px]` and `w-full sm:w-[160px]`. Wrap filter row with `flex-col sm:flex-row`.

---

### Fix 8 — `src/modules/blog/pages/BlogCategory.tsx`
**Priority: P1**
**Issues:**
- Header `flex items-center justify-between` doesn't wrap.
- Grid gap-6 excessive on mobile.
- Card image h-40 large on mobile.

**Fixes:**
1. Header: `flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2`
2. Grid gap: `gap-4 sm:gap-6`
3. Card image: `h-32 sm:h-40`

---

### Fix 9 — `src/modules/blog/pages/Blogs.tsx`
**Priority: P1**
**Issues:**
- Sheet filter `max-w-sm` still 384px, wider than 375px viewport.
- Featured carousel `-ml-2` might clip.

**Fixes:**
1. Sheet: `max-w-[calc(100vw-2rem)] sm:max-w-sm`
2. Carousel: Test and add `overflow-hidden` to carousel container if clipping occurs.

---

### Fix 10 — `src/modules/forum/pages/ThreadList.tsx`
**Priority: P1**
**Issues:**
- Thread metadata wraps awkwardly (badge + avatar + name + date + replies all in one flex row).
- `whitespace-pre-wrap` on preview without `break-words`.

**Fixes:**
1. Metadata: Split into two rows on mobile. Row 1: badge + author. Row 2: date + reply count. Use `flex-col sm:flex-row`.
2. Add `break-words` to content preview.

---

### Fix 11 — `src/modules/forum/pages/NewThread.tsx`
**Priority: P1**
**Issue:** "Cancel" and "Create Thread" buttons side-by-side may cramp at 375px.
**Fix:** `flex flex-col-reverse sm:flex-row gap-2 sm:gap-3` — stack buttons on mobile (Create on top, Cancel below).

---

### Fix 12 — `src/modules/exam/components/exams/ReportCard.tsx`
**Priority: P1**
**Issue:** Three action buttons use `sm:flex-row` — won't fit 3-across at 640px.
**Fix:** Change to `md:flex-row` so buttons stack until medium breakpoint.

---

### Fix 13 — `src/app/pages/Profile.tsx`
**Priority: P1**
**Issues:**
- Evidence vault header doesn't stack on mobile.
- Document list filenames can overflow without truncation.

**Fixes:**
1. Evidence vault header: `flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3`
2. Document filename: Add `truncate max-w-[200px] sm:max-w-none`.
3. Document metadata row: Add `flex-wrap` and `min-w-0` to parent.

---

### Fix 14 — `src/modules/career/components/UsageBar.tsx`
**Priority: P2**
**Issue:** Four metrics in a row with `gap-4` wraps awkwardly at 375px.
**Fix:** `gap-2 sm:gap-4` and optionally `grid grid-cols-2 sm:flex` to make metrics a 2×2 grid on mobile.

---

### Fix 15 — `src/modules/career/components/PageHeader.tsx`
**Priority: P2**
**Issue:** Button group has `ml-10` left margin on mobile — excessive.
**Fix:** `ml-0 sm:ml-8 lg:ml-0` (remove margin on smallest screens).

---

### Fix 16 — `src/modules/career/pages/PathwayMilestonesPage.tsx` + `AIPathwayMilestonesPage.tsx`
**Priority: P2**
**Issue:** Progress card uses `p-6` — excessive on mobile.
**Fix:** `p-4 sm:p-6`

---

### Fix 17 — `src/modules/exam/pages/ExamConfig.tsx` + `PracticeConfig.tsx` + `AiPracticeConfig.tsx`
**Priority: P2**
**Issue:** Sticky header "Back to Exams" button text may overflow at 375px.
**Fix:** Hide text on mobile: `<span className="hidden sm:inline">Back to Exams</span>` and show just back arrow icon on mobile.

---

### Fix 18 — `src/modules/blog/pages/BlogsEditor.tsx`
**Priority: P2**
**Issues:**
- Textarea `min-h-[300px]` dominates mobile screen.
- Double padding from container + card.

**Fixes:**
1. Textarea: `min-h-[200px] sm:min-h-[300px]`
2. Card padding: `p-4 sm:p-6`

---

### Fix 19 — `src/core/layouts/ModuleLayout.tsx`
**Priority: P2**
**Issue:** Mobile bottom nav touch targets are borderline. Nav items are `px-3 py-1` with h-5 icon + text — tap area is ~44px wide but only ~36px tall.
**Fix:** Increase to `py-2` for 44px+ height.

---

### Fix 20 — `src/core/layouts/HubLayout.tsx`
**Priority: P2**
**Same bottom nav touch target issue as ModuleLayout.**
**Fix:** Increase nav item padding to `py-2`.

---

## Execution Order (by user impact)

### Phase 1 — P0 Fixes (Broken at 375px) — 6 changes
1. Fix 2 — Forum ThreadDetail (vote buttons, content overflow, reply layout)
2. Fix 3 — Blog BlogDetail (hero, title, padding, sticky bar)
3. Fix 4 — Blog EditorNew (mobile block picker, padding)
4. Fix 5 — Blog EditorEdit (same as EditorNew + approval buttons)
5. Fix 1 — Exam FloatingSettings (card width overflow)
6. Fix 6 — Exam PracticeSession + AiPracticeSession (QuestionMap columns)

### Phase 2 — P1 Fixes (Poor UX at 375px) — 7 changes
7. Fix 7 — Career MilestoneValidationPage (fixed-width selects)
8. Fix 8 — Blog BlogCategory (header, grid, images)
9. Fix 9 — Blog Blogs list (sheet width, carousel)
10. Fix 10 — Forum ThreadList (metadata layout, break-words)
11. Fix 11 — Forum NewThread (button stacking)
12. Fix 12 — Exam ReportCard (button breakpoint)
13. Fix 13 — Profile (evidence vault, document list)

### Phase 3 — P2 Polish (Minor spacing) — 7 changes
14. Fix 14 — Career UsageBar (metrics gap)
15. Fix 15 — Career PageHeader (button margin)
16. Fix 16 — Career milestone pages (card padding)
17. Fix 17 — Exam config pages (back button text)
18. Fix 18 — Blog BlogsEditor (textarea height)
19. Fix 19 — ModuleLayout (nav touch targets)
20. Fix 20 — HubLayout (nav touch targets)

---

## Pages That Are Already Mobile-Ready (No Fixes Needed)

- **Landing** — Fully responsive with `sm:` breakpoints throughout
- **Login** — Card-based, `max-w-sm`, centered, `px-4` padding
- **SignUp** — Same as Login
- **Onboarding** — Mobile-first design, `max-w-md`, fixed bottom nav
- **HubDashboard** — 2-col grid at mobile, cards stack properly
- **Admin** — Table uses `overflow-x-auto`, columns hide with `hidden sm:table-cell`
- **Career DashboardPage** — Grids collapse to 1-col, minor spacing only
- **Career GoalsPage** — Single column on mobile, good
- **Career PathwaysPage** — Single column on mobile, good
- **Career RoadmapPage** — Cards responsive, DnD has TouchSensor
- **Exam ExamsPage** — Single column cards, good
- **Exam ExamSession** — Drawer pattern for sidebar, good responsive text

---

## Total: 20 fixes across ~25 files, organized in 3 phases.
