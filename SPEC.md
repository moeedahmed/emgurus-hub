# EMGurus Hub — Product Spec

> **Living document.** Updated as the product evolves. This is the source of truth for what we're building and why.

## Mission

Build a single modular AI platform that helps doctors become more effective across their entire journey — exams, career, portfolio, research, QIP, leadership, job search, interviews. Systems that earn money while Moeed sleeps.

## Core Insight

Doctors want outcomes — "tell me what to do next" + "produce a document/output I can use". Not chatbots, but structured workflows that produce practical, exportable artefacts.

## Business

- **Parent company:** Solvoro Labs
- **Product:** EMGurus (emgurus.com)
- **Live:** emgurus-hub.vercel.app

## Target Users (Track Packs)

- **UK trainees** — portfolio, training progression, UK exams + interviews
- **IMGs migrating** — pathway planning, CV/interview localisation, timelines
- **Global medical students** — study systems, early research/QI scaffolding

## Platform Architecture

One Hub with multiple specialised modules ("Gurus"), all sharing:
- Single auth + billing (Supabase + Stripe)
- Doctor Profile (stage, track, specialty, goals, constraints)
- Artefacts Library (versioned, exportable outputs)
- Workspace/history (resume work, versioning)
- Governance (review/approval flows)

## Modules (Gurus)

| Module | Status | Description |
|--------|--------|-------------|
| Career Guru | Most mature | Goals, constraints, timeline, strategy |
| Exam Guru | MVP priority | Diagnostic → weak topics → daily sets → spaced repetition |
| QIP Guru | Planned | Quality improvement workflows |
| Research Guru | Planned | Research productivity |
| Leadership Guru | Planned | Leadership development |
| Job Search Guru | Planned | Job applications, CV optimisation |
| Interview Guru | Planned | Interview prep, practice |
| Portfolio/CPD Guru | Planned | Portfolio building, CPD tracking |

## MVP Strategy

Career + Exam bundle:
- **Career** gives direction (occasional use)
- **Exam** creates daily pull (retention driver)
- Both write to shared Artefacts Library

## Workflow Pattern (all modules)

Collect inputs → Draft → Critique/Refine → Final → Save as artefact

Emphasis on high-quality, reliable outputs. RAG + trusted sources where needed. Optional human review for high-stakes outputs.

## Technical Stack

- **Frontend:** React 19 + Vite 7 + Tailwind v4 + Shadcn
- **Backend:** Supabase (eqljsghnuiysgruwztxs)
- **Hosting:** Vercel
- **Repo:** GitHub (emgurus-hub)

## Technical Architecture

- One Supabase — auth + database
- One Stripe — subscription tiers + add-ons
- One web app (Hub) — modules as isolated vertical slices
- **Isolation strategy:**
  - Code: module boundaries (modules depend on core, not each other)
  - Database: separate Postgres schemas per module (e.g. `career.*`, `exam.*`)
  - Release: feature flags + preview deployments + Supabase branching

## Shared Data Model (spine)

- **User Profile** — stage/track/specialty/goals/constraints
- **Goal** — e.g. "Pass exam by date", "Get job by date"
- **Session** — module interactions
- **Artefact** — type/content/tags/version/linked goals
- **Entitlements** — which modules/tier
- **Progress signals** — streaks, completions, deadlines

## UX Concept: "DoctorOS"

- Hub dashboard: next actions + module tiles
- Track selection (UK / IMG / Global)
- One "Ask" entry point → routes to right workflow
- Artefacts Library where outputs accumulate

## Monetisation

- **Free** — limited access (try platform)
- **Pro** — full Career + Exam + unlimited artefacts
- **Pro + Review** — human Guru review for high-stakes outputs
- **Add-ons later** — exam packs, interview bootcamps, CV credits, Track Packs

## Key Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-02-09 | Single app with paths, not subdomains | Moeed approved — simpler, shared auth |
| 2026-02-09 | React 19 + Vite 7 + Tailwind v4 + Shadcn | Modern stack, fast builds |
| 2026-02-09 | Shared Supabase with career-guru | Single auth, single billing |
| 2026-02-10 | Moved to native Linux (/home/moeed/projects/) | 5-10x faster I/O than /mnt/c/ |

## Current State (Feb 2026)

- Career module: functional (ported from career-guru)
- Exam module: UI only, no backend
- Blog module: UI only, no backend
- Test account: builder-test@emgurus.com / TestAccount2026!

## Near-term Objectives

1. Finalise Platform Core spec
2. Career Guru → Module 1 within Hub (done)
3. Exam Guru → Module 2 behind feature flags (next)
