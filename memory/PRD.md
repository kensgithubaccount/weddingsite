# PRD — Sophie + Ken Wedding Website

## Original Problem Statement
A complete, fully functional wedding website for Sophie Knochenhauer and Ken Syme (Saturday, June 5, 2027, New York Athletic Club, 180 Central Park South). Inspired by the literary sophistication, visual restraint, observational humor, and editorial illustration of The New Yorker — without copying its IP. The experience reads like a small, beautifully designed Manhattan publication: bespoke illustrations, elegant typography (Cormorant Garamond / Lora / Chivo), restrained motion, a seamless RSVP flow, and an admin dashboard.

## Standing Creative Rules (NEVER violate)
- Oxford comma everywhere; dry, understated, editorial humor.
- Three page states only: Editorial Ivory, Feature Paper, Dark Interruption. No zebra-striping section backgrounds.
- Restrained motion only (Framer Motion staggered reveals + Lenis smooth scroll).

## Architecture
- React frontend (`/app/frontend/src`), FastAPI backend (`/app/backend`), MongoDB.
- Centralized CMS: all public copy lives in `/app/backend/content.py`, served via `GET /api/content`.
- Sections: Hero, Invitation, Evening (5 acts incl. After-Party), Story, Wedding Party, NY Guide, Travel, Attire, FAQ, Registry. (Contact section REMOVED Aug 2026 per user.)
- Navigation: VerticalRail (desktop, numbered 01–10) + sticky top Nav (mobile/tablet). No Contact item.
- Key endpoints: `GET /api/content`, `POST /api/rsvp/lookup`, `POST /api/rsvp/submit`, `POST /api/admin/login`, `GET /api/admin/guests`.
- Integrations: Resend (RSVP confirmation emails, Emergent-managed), Gemini Nano Banana (illustration generation, budget-blocked).
- Test credentials: see `/app/memory/test_credentials.md`.

## Implemented (latest first)
- 2026-08/09 (this session): Revision round from user msgs 148 & 151 —
  - Contact section fully removed (page, rail, content.py); last FAQ removed (8 FAQs remain).
  - After-party integrated into main timeline as Act 5 ("The After-Party", 11:30 PM, "For those who, for whatever reason, would like to spend more time with the couple."); standalone dark Epilogue block removed; heading copy now "One evening, five acts."
  - NY Guide: "Make my day worse" button and "Perfect Saturday" module removed.
  - Attire: "Shoes & walking" and "Weather" guidance removed; image replaced with user-supplied taxi watercolor (`black-tie-transit.png`), caption "Black tie, in transit."
  - Evening illustration replaced with `taxi.png`, caption "The evening shoes travel separately."
  - Story photo caption removed.
  - Footer type-credit line removed.
  - RSVP step one shows "Kindly reply, one way or the other, at your earliest convenience."
  - Hero image and navigation/section headers left AS IS per explicit user instruction.
  - Verified: full RSVP flow (lookup → submit → confirmation), admin login, API content shape, all removals via DOM checks + screenshots.
- Earlier: full site build, Resend emails, admin back office, Wedding Party, NY Guide overhaul, creative-director copy pass. See git log.

## Known Blockers
- Editorial illustration generation (17 images via `/app/scripts/generate_illustrations.py`) BLOCKED on Emergent LLM Key budget. Missing images degrade gracefully (hidden, no broken icons).

## Backlog
- P1: Real registry, honeymoon fund, and charity links (awaiting URLs from user).
- P1: Explicit RSVP reply-by deadline (awaiting date from user).
- P1: Re-run illustration generation when LLM budget restored.
- P2: Replace placeholder Wedding Party names/bios and portraits when supplied.
