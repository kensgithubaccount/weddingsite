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
- Sections: Hero, Invitation, Evening (5 acts incl. After-Party), Story, Wedding Party, Attire, FAQ, Registry, NY Guide (at page end). (Contact and Travel sections REMOVED per user.)
- Navigation: VerticalRail (desktop, numbered 01–09, RSVP boxed at 07) + sticky top Nav (mobile/tablet). No Contact or Travel items.
- Key endpoints: `GET /api/content`, `POST /api/rsvp/lookup`, `POST /api/rsvp/submit`, `POST /api/admin/login`, `GET /api/admin/guests`.
- Integrations: Resend (RSVP confirmation emails, Emergent-managed), Gemini Nano Banana (illustration generation, budget-blocked).
- Test credentials: see `/app/memory/test_credentials.md`.

## Implemented (latest first)
- 2026-09-02 (RSVP copy): Party-confirmation step heading changed to "They look familiar?" (party name shown as overline only for multi-guest parties).
- 2026-09-02 (Art-direction pass, "edit, don't redesign"): Removed decorative Marquee ticker; Evening re-composed as centered single-column program + wide unframed taxi strip below (no more split grid, no row spot arts); Attire illustration unframed/offset with italic margin caption; Invitation stripped to pure centered typography (spot doodles removed); Registry given more vertical air; section padding increased site-wide (py-28/py-44). Framed-plate treatment now reserved for Hero cover + Story photograph only. Remaining artwork each carries a story/idea: cover plate, evening-shoes taxi, booth photo, black-tie-in-transit, party portraits.
- 2026-09-01 (Registry live): Registry condensed to one real entry — MyRegistry (https://www.myregistry.com/giftlist/sophieandken) covering gifts, honeymoon fund, and charity. All placeholders removed.
- 2026-09-01 (RSVP production rebuild + Rehearsal Dinner): Complete RSVP architecture rebuilt per user spec —
  - MongoDB collections: parties, guests (normalized lookup keys ×3), rsvp_details, events, event_invites, settings. Indexes on lookup keys, party_id, invite_code (unique), event_code (unique), external_invite_id (unique). Startup migration from legacy households/rsvps.
  - Lookup: POST /api/guest-lookup — single-name, server-side normalization (case/whitespace/punctuation/apostrophes/hyphens), states found/multiple/not_found, signed candidate tokens for disambiguation (email or household-member), generic failures (no enumeration), honeypot + time-trap + rate limits.
  - Flow: party confirm → returning-guest interstitial (update-in-place, submitted_at preserved) → per-person attendance → RD step (invited guests only) → details → contact email → review → confirmation ("You're in."/"We'll miss you.") + Add to Calendar (Google/Outlook/ICS) + Resend email with signed 150-day update link.
  - Rehearsal dinner: Event_Invites is authoritative; per-guest eligibility enforced server-side; non-invited guests never see RD data anywhere; RD details are placeholders ("Details to follow") until Events record is filled; RD section in review/email only when applicable; admin RD counts (invited/responded/attending/declined/outstanding).
  - Admin: stats, search/filter, manual response edit, CSV export (incl. RD column), import (xlsx workbook upsert by external IDs / CSV paste / Google Sheet URL) with preview-before-commit, settings (deadline + meal options).
  - Workbook Sophie_Ken_RSVP_TEST_Import.xlsx imported into PREVIEW: 195 parties, 218 guests, 2 events, 247 invites (29 RD).
  - Tests: /app/backend/tests/test_rsvp.py — 24/24 passing; testing agent iteration_1 all green.
- 2026-09-01: Visual edit round (agentic edit notifications + chat) —
  - Hero: line now reads "We're getting married. Apparently, it requires a website."; standalone tagline removed.
  - Invitation: removed "Important details are below…" heading subcopy.
  - Evening: removed "One evening, five acts…" heading subcopy; After-Party description now "We carry on."
  - Story: "work" → "works" (Morningstar Farms line); closing line removed; photo swapped to user-uploaded black-and-white photo (`/photos/sophie-ken-booth.jpg`); no caption.
  - Wedding Party: intro paragraph removed; secondary italic line kept.
  - Attire: removed "and encouraged" from body copy.
  - Travel section REMOVED entirely (file, rail/nav/footer links, content.py key).
  - NY Guide section MOVED to the end of the page (after Registry, before footer). Page order: Hero, Invitation, Evening, Story, Wedding Party, Attire, FAQ, Registry, New York. Section indexes renumbered (Attire 04, Questions 05, Registry 06, New York 07); rail renumbered 01–09 with RSVP at 07.
  - Verified: section order via DOM, all copy changes, story image live, rail order; lint clean; API serves updated content.
- 2026-08/09: Revision round from user msgs 148 & 151 —
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
- P1: RSVP reply-by deadline (awaiting date from user).
- P1: Rehearsal dinner date/time/venue (Events record placeholders).
- P1: Re-run illustration generation when LLM budget restored.
- P2: Replace placeholder Wedding Party names/bios and portraits when supplied.
