# CLAUDE.md — EMGurus Hub Project Context

## Project
EMGurus Hub — modular AI toolbox for doctors. Modules: Career, Exam, Blog, Forum.

## Stack
- React 19 + Vite + TypeScript + Tailwind v4 + Shadcn UI
- Supabase (auth, DB, Edge Functions, storage)
- Deployed on Vercel (auto-deploy from main branch)

## Design System
- **Dark mode default** (class="dark" on html)
- Primary: teal (hsl 172 45% 50%)
- Accent: warm orange (hsl 25 65% 55%)
- Fonts: Sora (headings), DM Sans (body)
- Background: hsl(220 20% 8%)
- Cards: hsl(220 18% 11%)
- Mobile-first always (375px minimum)

## Key Files
- `src/index.css` — design tokens (HSL format, @theme inline for Tailwind v4)
- `src/app/Router.tsx` — all routes
- `src/core/layouts/HubLayout.tsx` — main layout wrapper
- `src/core/auth/AuthProvider.tsx` — auth context, profile, useAuth hook
- `src/modules/career/` — Career module (ported from career-guru)
- `src/modules/exam/` — Exam module
- `src/modules/blog/` — Blog module
- `src/modules/forum/` — Forum module
- `src/app/pages/Admin.tsx` — Admin dashboard (3 tabs)

## Auth & Roles
- Supabase auth (email + Google OAuth)
- `user_roles` table with `app_role` enum
- `useAdmin()` hook checks role via RPC `user_has_role('admin')`
- Admin user: drmoeedahmed@gmail.com (820b6af9-c9df-4a7a-bd57-d9bfdd5019ca)
- Test user: builder-test@emgurus.com (06020df8-8f20-4038-b549-c59af7e75744)

## Commands
- Dev: `npm run dev`
- Build: `npm run build` (vite only, no tsc)
- Lint: `npm run lint`
- Preview: `npm run preview`
- Single Playwright test: `npx playwright test <file> --project=chromium-desktop`
- Full E2E suite: `npm run test:e2e` (run ONCE as final gate, never repeatedly)
- Update visual baselines: `npm run test:e2e:update`
- Pre-deploy check: `npm run test:predeploy`

## Rules
- No AI slop — clean, readable, purposeful code
- Mobile-first — better on mobile than desktop at all times
- Use Shadcn components before custom
- Use semantic Tailwind tokens (bg-background, text-foreground, etc.) — no raw colors
- Commit messages: conventional commits (feat/fix/chore)
- NEVER delete migration files
- NEVER run full Playwright suite repeatedly — single test during iteration, full suite once at end
- Verify RLS policies after any schema change
- After finishing: run `openclaw system event --text "Done: [summary]" --mode now`
