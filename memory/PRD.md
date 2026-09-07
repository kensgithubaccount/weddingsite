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
- Sections: Hero, Invitation, Evening (5-part program: Arrival, The Ceremony, Cocktail Hour, The Reception, The After-Party), Story, Wedding Party, Attire, FAQ, Registry, NY Guide (at page end). (Contact and Travel sections REMOVED per user.)
- Navigation: VerticalRail (desktop, numbered 01–09, RSVP boxed at 07) + sticky top Nav (mobile/tablet). No Contact or Travel items.
- Key endpoints: `GET /api/content`, `POST /api/rsvp/lookup`, `POST /api/rsvp/submit`, `POST /api/admin/login`, `GET /api/admin/guests`.
- Integrations: Resend (RSVP confirmation emails, Emergent-managed), Gemini Nano Banana (illustration generation, budget-blocked).
- Test credentials: see `/app/memory/test_credentials.md`.

## Implemented (latest first)
- 2026-09-07 (Targeted copy + design polish — Invitation, Registry, NY Guide only):
  - Invitation re-typeset: "Together with their parents" overline → parent line (Dr. and Mrs. Eric and Marie Knochenhauer, kept verbatim) → large whitespace → couple names in huge Bodoni caps (font-std) with small green "and" → italic "request the pleasure of your company / at their wedding" → thin rule → utility stack (Saturday / June 5, 2027 in green Bodoni, Arrival / 5:30 PM, venue lines, Black Tie Optional) → action buttons (Add to calendar, Copy address, Open in maps, RSVP all kept). No card, no box.
  - Registry: headline "A Few Things We’d Be Happy to Have Around" in green Bodoni (SectionHeading gained optional titleClass); supporting copy now "Having you with us is the point." + "For those who have asked, we’ve put together a few things we love, a few things we need, and a few things we did not realize we had opinions about until now." + signoff "Love, Sophie & Ken". MyRegistry entry/link unchanged.
  - NY Guide: intro now "A few places to start. We stand by some of them." (disclaimer line removed); all 13 recommendation bodies replaced with the user's exact dry copy (Street CD note: "Actually, don't."); categories consolidated to Eat / See / Shop / Walk / Drink (chips auto-derived); card names, tags, pins, maps links unchanged.
- 2026-09-06 (Visual edit round, agentic selections): Invitation now opens with the host line "Dr. and Mrs. Eric and Marie Knochenhauer request the pleasure of your company at the wedding of their daughter" (replacing the standalone "request the pleasure" block); Evening headings/subheads swapped — headings "The Arrival / The Ceremony / The Cocktail Hour / The Reception / The After-Party", subheads "We arrive. / We do. / We drink. / We eat and dance. / We carry on."; footer "Vol. I · No. 1 · One Night Only" colophon line removed. Hero top "Vol. I · No. 1" issue line removed; Attire bow-tie figure removed (section now text-only); Registry coupe drawing removed (text-only); unused LineArt exports (BowTie, Coupe, Envelope, TaxiLine) deleted — remaining line art: stick couple (Story), cab-with-cans (RSVP confirmation), pigeon (404). Hero tagline ("We're getting married. Apparently, it requires a website.") reduced to text-lg/xl; hero photo caption row removed; Invitation section tightened (top padding reduced, bottom envelope line art removed); Evening heading "The Program" rewritten as "One evening, five parts." and program item titles returned to the punchy set — "We arrive. / We do. / We drink. / We eat and dance. / We carry on." (descriptions kept, After-Party description restored to "For those who, for whatever reason, would like to spend more time with the couple."); Story standfirst now "This is the story of how Sophie and Ken met. They call it a plant-based meat-cute."; Wedding Party "Portraits are being drawn…" note removed; Attire section shifted up; NY Guide closing taxi + note block removed. Verified via DOM + screenshots (compile clean, content API correct).
- 2026-09-06 (Logo + RSVP deadline): Site seal replaced with the user-supplied circular "PROPERTY OF / SK+KS / NYC" mark — extracted to transparent 512px PNG (`/public/seal.png`, ink ≈ #153D28), `Seal` component now renders the image (ivory-inverted via CSS filter on the dark footer); favicon now points to it. RSVP deadline set to April 5, 2027 (stored `2027-04-05T23:59:59-04:00` in settings via admin API); guest-facing note updated to "Kindly reply, one way or the other, by April 5, 2027." Verified: note renders on /rsvp, seal in rail/nav/footer/RSVP, status endpoint returns deadline with closed=false.
- 2026-09-06 (SAVE-THE-DATE ART DIRECTION — reskin, not redesign): Whole site re-skinned to match the user-supplied Save the Date card. Structure, section order, grids, spacing, copy, and RSVP/Admin logic unchanged.
  - Palette: warm cream/ivory + ink + deep forest green (#1D3F2C / hover #142B1F) replacing oxblood (#731F17) across all UI, tokens (--forest/--forest-deep), and the RSVP confirmation email HTML. Attending = green, Regrets = muted #595959 (kept distinguishable in email + Admin).
  - Typography: Bodoni Moda added (`.font-std`) used selectively — hero date block only; body/hierarchy fonts unchanged.
  - Hero: right-side framed plate now shows the B&W couple photo extracted from the Save the Date (`/photos/sophie-ken-bw.jpg`, 3x Lanczos upscale, no content edits); stamps removed; caption adapted to "Sophie and Ken, shortly before everything changes".
  - Line art system: new `/app/frontend/src/components/LineArt.jsx` — thin hand-drawn SVGs (StickCouple, CabCans, TaxiLine, BowTie, Coupe, Envelope, Pigeon) in ink/forest green.
  - Placements: Story photo → StickCouple ("Sophie and Ken, drawn from memory."); Attire large taxi → small BowTie (caption kept); Evening wide taxi removed; FAQ suitcase figure removed; NYGuide desk cartoon removed + small TaxiLine above closing note; Registry small Coupe; Invitation small Envelope; RSVP confirmation taxi → small CabCans; 404 → small Pigeon (caption kept).
  - Deleted: 9 old watercolor PNGs from public/illustrations, unused SpotArt.jsx, stray root yarn.lock. Two dormant graceful-fallback refs remain (portrait-placeholder, manhattan-map) — pre-existing, intentional.
  - Checkpoint: git tag `pre-savethedate-checkpoint` = commit 5d3ede4 (clean pre-reskin state, restorable).
  - Verified: testing agent iteration_3 — 100% frontend pass (all 7 SVGs render, zero oxblood remnants via computed-style scan, no mobile overflow at 375px, full RSVP E2E incl. apostrophe name + RD gating for invited/non-invited, Admin colors, 404), backend pytest 24/24 re-passed.
- 2026-09-02 (REVERT): Illustration integration pass fully reverted at user request ("these don't work"). All 5 placements removed and image files deleted; site restored to its pre-integration state. Verified by testing agent (iteration_2, 100% pass). The 5 uploaded clip-art assets (NYAC entrance, pigeons, Anthora cup, MetroCard, checker taxi) are NOT on the site.
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
- None active. (Former watercolor illustration-generation plan is superseded by the Save-the-Date line-art direction; old assets deleted.)

## Backlog
- P1: Rehearsal dinner date/time/venue (Events record placeholders).
- P1: Production DB migration/indexes/import + validation (Preview and Production are separate databases; real guest workbook still needed).
- P2: Replace placeholder Wedding Party names/bios and portraits when supplied.
- P2: User visual acceptance pass on the Save-the-Date reskin.
