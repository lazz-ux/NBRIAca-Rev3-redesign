# NBRI Academy — Product Roadmap

NBRI Academy is the learning platform and training marketplace for the National Battery
Research Institute. It combines a Udemy-style course catalog, BatteryMBA-style technical
depth, and a Shopee-style ticket shopping experience for workshops. Payment is by manual
bank transfer with WhatsApp confirmation.

The work is split into small milestones that can each ship on their own.

## Milestone 1 — Product surface ✅ (done)

The public, clickable storefront, driven by stub data in `src/lib/fixtures.ts`.

- Homepage: hero with search, categories, promotions (VOLT5 and bundle tiers), nearest workshop tickets, program grid, corporate CTA, testimonials, past programs, FAQ.
- Course marketplace (`/courses`): search, category chips, level, format, price, and sort, all synced to the URL.
- Course detail (`/courses/:slug`): session picker with live seat counts, package variants, ticket quantity, curriculum and agenda, instructor block, related courses, and WhatsApp routes for quote-only and coming-soon programs.
- Workshop schedule (`/schedule`): Shopee-style ticket cards with month and category filters, plus "coming soon" and "completed" sections. Uses the current date at runtime.
- Cart (`/cart`): select/deselect lines, quantities, early-bird, bundle, and coupon discounts, stale-line detection, and recommendations.
- Checkout (`/checkout`): buyer and participant details, bank-transfer instructions, a payment deadline, and a prefilled WhatsApp confirmation.
- Unverified prototype claims (stats, partners, testimonials, bank account, EduTech prices) carry a visible "awaiting admin verification" label.

### English-first & homepage copy refresh

- English default with an EN/ID switcher across every page, new hero copy and CTAs, a learning-paths section, Ruangguru-style photo testimonials with larger logos and an alumni-workplace highlight, the programs area gated behind "Next", and all discount/promo messaging removed (no promotions until launch is further along).

### Homepage refresh (after milestone 1)

- Light theme, a hook-first homepage, official stats, partner logos, photo testimonials, an Instagram video testimonial, experts, a "Kenapa Battery School" section, labelled example success stories, and a step-by-step program finder.

### Content refresh (Nov 2026)

- Only the four recent testimonials (bilingual), a learning-path slider, the full Battery School speaker list on gradient portraits, the 1000+ participants figure, full-colour logos, footer contact and social icons, and the Sailec typeface.

## Milestone 2 — Data model & content in Netlify Database

- Drizzle schema in `db/schema.ts`: `categories`, `courses`, `course_sessions`, `course_variants`, `curriculum_sections`, `lessons`, `instructors`, `bank_accounts`, `testimonials`, `site_stats`, `faqs`, `partners`, `experts`, `success_stories`, `video_testimonials`.
- Every content row has a `verification_status` (`verified` / `needs_review`). The public site only shows `needs_review` content with a label.
- Seed script that imports today's `fixtures.ts`.
- Replace the fixture imports with route loaders and server functions. The page components stay the same.

## Milestone 3 — Accounts, server cart & orders

- Netlify Identity sign-up and login, with roles `student`, `instructor`, and `admin`.
- Server-side cart synced from the browser cart on login.
- `orders`, `order_items`, `tickets`, and `payments` tables. Order creation becomes a server function that re-prices the cart (`src/lib/pricing.ts` moves server-side), checks coupons, and reserves seats in a transaction.
- An order expires after the payment window and releases its seats (scheduled function).
- Order confirmation emails, plus a "My orders" page with payment status.

## Milestone 4 — Payment verification & e-tickets

- Upload of transfer proof (Netlify Blobs), attached to the payment record.
- Admin payment queue: approve or reject, with an audit trail.
- On approval: tickets are issued with signed QR codes (HMAC token, verified server-side) and online course access is granted.
- Check-in page for event staff that scans and validates a QR code once.

## Milestone 5 — Student dashboard & learning player

- "My learning": enrolled courses, progress, upcoming workshops, and tickets.
- Video and lesson player with section navigation, completion tracking, resources, and quizzes.
- Reviews and ratings, limited to verified enrolments (this replaces the unverified ratings from the prototype).

## Milestone 6 — Certificates

- PDF certificates generated on course completion or workshop attendance.
- A public verification page (`/certificates/:code`).

## Milestone 7 — Instructor dashboard

- Course builder: sections, lessons, video uploads, outcomes, and agenda.
- Session management for the instructor's workshops, plus participant lists.
- Analytics for enrolments, completion, and reviews.

## Milestone 8 — Admin dashboard & CMS

- CRUD for courses, sessions, prices, variants, promotions, coupons, bank accounts, FAQ, testimonials, stats, and partners.
- A verification workflow that clears the "awaiting verification" labels.
- Homepage content blocks and promotion scheduling, with start and end dates evaluated server-side.
- User and role management.

## Milestone 9 — Financial reports

- Revenue by period, program, category, and promotion; outstanding and expired orders; CSV export.
- Charts on the admin dashboard.

## Milestone 10 — Hardening

- End-to-end tests for purchase → verification → ticket → check-in.
- Rate limiting on order creation, an audit log, accessibility pass, SEO metadata, and sitemap.
