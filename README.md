# NBRI Academy

Learning platform and battery-training marketplace for the **National Battery Research
Institute**. It covers Battery School workshops, Industrial Training, Training of Trainers,
and EduTech online courses, with a shop-style ticket flow and manual bank-transfer
checkout with WhatsApp confirmation.

## What's live

- **Homepage** (`/`): hero search, categories, promotions, nearest workshop tickets, programs, FAQ
- **Course marketplace** (`/courses`): search, filters, and sorting
- **Course detail** (`/courses/:slug`): sessions, packages, quantity, and curriculum
- **Workshop schedule** (`/schedule`): ticket cards with seat availability
- **Cart** (`/cart`) and **Checkout** (`/checkout`): automatic bundle discounts, the VOLT5 coupon, bank transfer, and WhatsApp confirmation

Content currently comes from `src/lib/fixtures.ts`. Claims carried over from the original
prototype that still need confirming are labelled on screen as awaiting admin verification.

## Tech stack

- TanStack Start (React 19, TanStack Router) on Vite
- Tailwind CSS 4 with shadcn/ui components
- Netlify (hosting, Image CDN). Netlify Database and Identity arrive in later milestones.

## Run locally

```bash
pnpm install
netlify dev        # or: pnpm dev
```

## Roadmap

See [PLAN.md](PLAN.md). Next up: the data model in Netlify Database, then accounts, a
server-side cart and orders, payment verification with QR e-tickets, the student learning
player, certificates, and the instructor and admin dashboards with financial reports.
