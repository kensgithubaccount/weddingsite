# PRD — Sophie + Ken Wedding Website

## Original Problem Statement
Build a complete wedding website for Sophie Knochenhauer and Ken Syme (June 5, 2027, New York Athletic Club, 180 Central Park South, Manhattan) inspired by the literary sophistication, restraint, observational humor and editorial illustration of The New Yorker — without copying any of its IP. The site must feel like a small, beautifully designed Manhattan publication devoted to one event, while remaining a fully functional wedding website: invitation, schedule, story, NY guide, travel, attire, FAQ, secure RSVP with guest lookup, registry, contact, admin, custom 404, password-protected preview.

## User Personas
- Wedding guests (desktop + mobile, need instant clarity on where/when, easy RSVP)
- Sophie & Ken (editors: manage guest list, view/export responses, replace placeholder content)
- Out-of-town guests (travel, hotels, attire guidance)

## Architecture
- Frontend: React 19 + Tailwind + framer-motion + lenis (smooth scroll), Shadcn accordion, sonner toasts. Single-page editorial home + /rsvp + /admin + custom 404. All public copy served from one centralized source.
- Backend: FastAPI + MongoDB (motor). Routes under /api: /content, /preview/unlock, /rsvp/lookup, /rsvp/submit, /admin/* (JWT), /admin/export (CSV). Rate limiting + honeypot spam protection. Confirmation emails via Emergent managed Resend proxy (EMERGENT_EMAIL_KEY, from_name "Sophie + Ken").
- Content: /app/backend/content.py — single editable source, every item marked _status confirmed/placeholder/hidden.
- Illustrations: 8 bespoke ink-and-wash editorial images generated with Gemini Nano Banana (gemini-3.1-flash-image-preview), saved to /app/frontend/public/illustrations/ (hero, evening, doorman, chairs, taxi, nyac, pigeon, story). Regenerate via /app/scripts/generate_illustrations.py.
- Design system: /app/design_guidelines.json — Cormorant Garamond / Lora / Chivo; ivory #F7F5F0, ink #1A1A1A, oxblood #731F17, park green, taxi yellow; SK+KS seal + date/edition stamps; grain overlay; folio labels; fine rules.

## Implemented (2026-08-08, update 3)
- Preview password gate removed; site is fully public
- Hero copy: "We're getting married. / Apparently, it requires a website."
- Invitation section retitled "The Details" with new intro
- Program rebuilt: Arrival 5:30 / The Ceremony 6:00 / Cocktail Hour 6:30 / The Reception 7:30–11:30 + after-party
- NY guide retitled "New York, According to Us" with new intro; slot wired for "The Manhattan Plan" feature cartoon
- Travel retitled "Getting Here. Staying Here." with By plane/train/car/getting-around copy (valet confirmed by couple)
- FAQ retitled "Everything You Were About to Ask"; 4 answers replaced (venue, attire, children, after-11:30)
- 404 rewritten ("This does not appear to be the place." / BACK TO THE WEDDING); falls back to pigeon art until notfound.png exists
- 17 illustration slots wired sitewide (2 feature cartoons + 15 spot marginalia) with graceful hiding until files exist
- BLOCKED: image generation fails — Universal Key budget exceeded (proxy reports max 0.4, current 0.54). Fix: Profile → Manage plan → Universal Key → Add Balance, then run `python /app/scripts/generate_illustrations.py` (skips existing files)

## Implemented (2026-08-06, update 2)
- Name corrected universally: Sophie Knochenhauer
- Vertical section index rail (seal + numbered items 01–11, boxed 09 RSVP, oxblood active state tracking scroll, 2xl screens and up)
- Gift registry built out: Zola (sample outbound link), Honeymoon Fund, charity card — content-driven, "Link to come" states
- Dress code published: Black Tie Optional, with plain-English guidance (men/women/shoes/weather) + FAQ answer updated

## Implemented (2026-08-06)
- Password-protected preview gate (password: soph)
- Editorial cover homepage: masked line-by-line name reveal, bespoke hero illustration with parallax + clip reveal, date stamp landing, RSVP + details actions, slow editorial marquee
- Formal invitation section with Add to Calendar (.ics), Copy Address, Open in Maps, RSVP
- The Evening program (5:30 Arrival / 6:30 Cocktails / 7:30–11:30 Ceremony & Celebration) + dark After-Party block
- Our Story framework (drop cap, According to Sophie/Ken, photo slots — placeholder-marked)
- New York guide framework with category tabs (empty until couple adds picks)
- Travel & Stay framework (getting-here facts + hotel placeholder card)
- Attire placeholder section, FAQ accordion (confirmed answers only), quiet Registry, Contact (obfuscated placeholder emails)
- RSVP: name lookup → household responses (attendance, sample entrées, dietary, accessibility, controlled plus-ones) → contact + song question → attending/declining confirmations with stamp; revise-by-relookup; duplicate-safe upsert; real confirmation email sent via Resend
- Admin back office (/admin): stats, household/member management, responses, CSV export
- Custom 404 with pigeon illustration; custom favicon; OG/social meta; reduced-motion support; data-testids throughout
- Seeded sample guests: Test Guest (+1), Taylor Guest / Alex Sample (+1) / Jordan, Riley, Casey Example

## Backlog
- P0: Replace placeholder content (story, NY recommendations, hotels/room blocks, dress code, registry links, real contact emails, final menu, RSVP deadline, after-party details)
- P1: Real photographs of the couple; final commissioned illustrations to replace AI placeholders
- P1: Content editing UI in admin (currently edit /app/backend/content.py)
- P2: Additional events (welcome drinks) attendance tracking; email reminder blast; analytics
