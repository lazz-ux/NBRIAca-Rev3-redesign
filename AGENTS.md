# AGENTS.md

This document describes the project for developers and AI agents working on this codebase.

## Project Overview

NBRI Academy: the LMS and battery-training marketplace for the National Battery Research Institute. The UI is bilingual: **English by default**, with an EN/ID switcher (Bahasa Indonesia). **Read `PLAN.md` first.** Milestone 1 (the public storefront) is done, and future sessions continue from the next unchecked milestone there.

The original HTML prototype is the design reference (stored under `.netlify/assets/`, which is not deployed). Brand colors: teal `#03A696`, white, navy `#0F1526`, and the gradient `--brand-gradient`. They are exposed as `bg-navy`, `text-navy`, `bg-teal`, `text-sale` (the shop-style price/discount red), `.bg-brand-gradient`, and `.text-brand-gradient`.

### Architecture (milestone 1)

- `src/lib/fixtures.ts`: **the single stub data module**: courses, sessions, variants, promotions, FAQ, stats, partners, testimonials, bank accounts. Milestone 2 swaps it for Netlify Database queries. Keep screens reading through `src/lib/catalog.ts` so the swap is local.
- `src/lib/catalog.ts`: pure helpers: date labels, runtime session status (`isSessionDone`, `upcomingSessions`), `purchaseState()` (decides buy / quote / coming-soon / TBA CTA), `rupiah()`, `whatsappLink()`, `cdnImage()`.
- `src/lib/pricing.ts`: list-price totals and `isLineAvailable()`. It must move server-side in milestone 3 so totals are authoritative. **No discounts or promotions are shown anywhere yet** (too early); the early-bird/bundle/coupon engine was removed.
- `src/lib/text.ts` + `src/lib/i18n.tsx`: bilingual copy. Fixtures use `l(en, id)` (type `L`) or a plain string for language-neutral names (type `Text`). Components call `const { lang, t, tr } = useLang()`: `t("English", "Indonesia")` for inline copy, `tr(text)` for fixture copy. The language lives in the `nbri-lang` cookie, read in the root `beforeLoad` (server and client) so SSR renders the right language; route `head()` reads `match.context.lang`. Date helpers (`sessionLabel`, `dayLabel`, `monthNames`) take `lang`.
- `src/lib/cart.tsx`: `CartProvider` / `useCart()`, persisted to localStorage (read in `useEffect` only).
- `src/components/site-shell.tsx` (header, footer, mobile tab bar), `course-card.tsx` (CourseCard, SessionCard, CoursePrice, StatusBadge, VerifyNote), `order-summary.tsx`, `chip.tsx`.
- Routes: `index.tsx`, `courses.index.tsx`, `courses.$slug.tsx`, `schedule.tsx`, `cart.tsx`, `checkout.tsx`.
- Images: generated assets in `public/img/`, always served through `cdnImage()` (Netlify Image CDN).

### Non-obvious decisions

- **Never publish unverified claims as fact.** Prototype stats, partners, testimonials, EduTech prices, and the bank account are flagged `verified: false` and shown with `<VerifyNote />`. Ratings and enrolment counts from the prototype were dropped; real reviews come with milestone 5.
- Schedules are evaluated against the current date at runtime. Past sessions show as "Selesai" and can't be bought. Courses with no upcoming session show "Jadwal segera diumumkan" with a WhatsApp notify link. Don't invent dates.
- EduTech courses are `availability: 'coming-soon'` (not sellable) until content exists.
- No fake QR codes: tickets say the QR is issued after admin payment verification (milestone 4).
- Checkout currently creates the order client-side only (stub). Milestone 3 replaces it with a server function.
- The site uses a light theme: white header, light-teal (`bg-secondary`) page headers and footer. Navy is a text colour, not a large background.
- The stats, partner logos, testimonials and experts come from the official site (nbriacademy.n-bri.org) and are `verified: true`. The images are copied into `public/img/{partners,people,experts}`. The official partner logos are light grey, so they're darkened with `brightness-[0.45]`.
- `SUCCESS_STORIES` holds labelled illustrations (`verified: false`) until real alumni stories with consent arrive. Never attach real company names to them.
- Home page order: hero + stats, partner logos, "Find the Right Learning Path for You" (4 cards), photo testimonials + alumni-workplace highlight, experts, why Battery School, success stories, then a "Next" gate. The program finder, upcoming training, corporate CTA and past programs only render after the visitor clicks "Next", so the page opens light.
- Company/institution logos are shown in their original full colours from `public/img/logos-color/`. Never apply grayscale, monochrome, opacity or brightness filters to them. ALVA's official logo only exists in white, so it sits on a navy tile (`dark: true`). CBI and Charged use their symbol mark with a text `label`, because their full logos aren't legible at tile size.
- Testimonials are exactly the four supplied by NBRI (past year). The Indonesian text is the original wording and the English is a faithful translation. Don't add, merge or paraphrase quotes, and don't bring back the older or COVID-era testimonials or the video testimonial. Their photos are in `public/img/people/`; anyone without a photo gets an initials avatar.
- The participant highlight lists only the institutions of people with published testimonials.
- Speakers (`EXPERTS`) are everyone who has taught at Battery School, **except Reynaldi Istanto (Pak Rey) and Pak Elly, who are on hold and must not appear anywhere on the site**. Portraits use transparent or background-removed PNGs on a soft teal gradient.
- The participant figure is **1000+** everywhere.
- The font is Sailec (licensed), loaded with `@font-face` from `public/fonts/sailec/Sailec-{Regular,Medium,Bold,Black}.woff2`. DM Sans (Google Fonts) is the fallback until those files are added.
- The footer social links live in `CONTACT.social`. The brand icons are inline SVGs in `src/components/brand-icons.tsx`, because lucide has no brand icons.

### Tech Stack

| Layer         | Technology                                          |
| ------------- | --------------------------------------------------- |
| Framework     | TanStack Start                                      |
| Frontend      | React 19, TanStack Router                           |
| Build         | Vite 8                                              |
| Styling       | Tailwind CSS 4, theme variables in `src/styles.css` |
| UI Components | shadcn/ui (Radix UI + Tailwind)                     |
| Toasts        | sonner                                              |
| Icons         | lucide-react                                        |
| Language      | TypeScript 6.0 (strict mode)                        |
| Deployment    | Netlify, via `@netlify/vite-plugin-tanstack-start`  |

`src/routeTree.gen.ts` is generated by the router plugin when the dev server or build runs. Don't edit it.

Shared framework skill source lives in `frameworks/tanstack-start-react/.claude/skills` in this repository, separate from the standalone starter. Consult the matching framework/Netlify skills when available in a generated app; don't assume the starter contains a `.claude` directory.

## Key Concepts

### File-Based Routing

Route files in `src/routes/` define pages and endpoints:

- `__root.tsx` wraps every page.
- `index.tsx` is `/`.
- `about.tsx` would be `/about`.
- `api.*.ts` files are server API endpoints. See the `tanstack-start-api-routes` skill.

### Theme Variables

Colors and corner radius are CSS variables in `src/styles.css` (`--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--radius`, and more), with a second set under `.dark`. Tailwind exposes them as classes such as `bg-primary`, `text-muted-foreground`, and `border-border`.

Set these variables for the product before you build any page. In components, use the variable classes instead of raw colors like `bg-white` or `text-gray-600`, so the whole site changes when a variable changes.

### UI Components

Ready-made components are in `src/components/ui/`. Use them before writing your own, and restyle them through the theme variables or their variants. Add more with `npx shadcn add <name>`. Show a toast by calling `toast()` from `sonner`; the container is already mounted in `__root.tsx`. `TooltipProvider` is mounted there too, so `Tooltip` works anywhere without its own provider.

| Need               | Components                                                         |
| ------------------ | ------------------------------------------------------------------ |
| Actions and status | Button, Badge, Progress, Skeleton, Alert, Sonner                   |
| Forms              | Input, Textarea, Label, Checkbox, RadioGroup, Switch, Select, Form |
| Overlays and menus | Dialog, Sheet, Popover, DropdownMenu, Tooltip                      |
| Content and layout | Card, Tabs, Accordion, Separator, Table                            |

Use `Form` with React Hook Form and the Zod resolver. Start from `src/examples/validated-form.tsx`; it isn't mounted or connected to a backend. Its required `onSubmit` callback must reject on failure. See [the form pattern](docs/forms.md) for HTTP submission and error handling.

Use Sheet for a mobile menu and DropdownMenu for short action lists. Give Dialog and Sheet an accessible title and description. Pair Checkbox, RadioGroup, Switch, and inputs with visible labels. Reserve tables for tabular data and wrap them in their provided scroll container.

### Design Choices

Set the product's palette, heading/body fonts, and layout before building its screens. Use an explicit user design when supplied; otherwise choose defaults that fit the product. Keep Basic's placeholder until you replace it with the requested product.

- Set `--font-body` and `--font-heading` in `src/styles.css`. Use `font-display` for headings when the product needs a separate heading font.
- Use `max-w-content` for a page container and `max-w-reading` for long text. Keep consistent horizontal padding, such as `px-4 sm:px-6`, and a small repeated spacing scale, such as `gap-4`, `gap-6`, and `py-12`.
- Keep one main heading per page and a clear heading order. Use muted text for supporting copy, not essential low-contrast labels.
- Preserve focus rings. Give icon-only buttons an accessible name. Ensure actions work with a keyboard and on narrow screens.
- Use short color/opacity transitions. Add `motion-reduce:transition-none` or `motion-reduce:animate-none` when adding motion; don't make essential content depend on animation.
- Provide loading, empty, error, and success states for each data-driven screen. Skeletons should follow the shape of the content they replace.

### Routing and Server Data

Router types are registered in `src/router.tsx`, so use typed `Link` destinations and route parameters. The root route supplies the themed 404 page; the router's default error component supplies the safe retry/home page, including child-route SSR failures. Use `throw notFound()` for absent records; keep unexpected failures on the error path. See [routing conventions](src/routes/README.md).

Start with route loaders and server functions for server data. Validate server-function input with `.validator(...)`, keep secrets on the server, and handle HTTP failures before returning data. See [the data-fetching pattern](docs/data-fetching.md). Add TanStack Query only when client-side caching, mutations, or background refresh are needed.

### Browser Storage

Pages are rendered on the server first, where `window` and `localStorage` don't exist. Read `localStorage` inside `useEffect`, not during render or in a `useState` initializer, or the first render will differ from the server HTML and React will log a hydration error.

## Configuration Files

| File             | Purpose                                                                                          |
| ---------------- | ------------------------------------------------------------------------------------------------ |
| `vite.config.ts` | Vite path aliases and Tailwind, Netlify, TanStack Start, React plugins                           |
| `tsconfig.json`  | Strict TypeScript, with the `@/*` alias for `src/*`                                              |
| `netlify.toml`   | Builds with `vite build`, publishes `dist/client`, dev server on port 8888 proxying Vite on 3000 |

## Development Commands

Use Node 22.13+ on the Node 22 line, Node 24, or Node 26+. The installed lint and test tools set this minimum alongside the framework.

```bash
npm run dev        # Start the Vite dev server on port 3000
npm run build      # Production build
npm run typecheck  # Type-check with tsc; the build doesn't
npm run lint       # Check TypeScript and React Hooks rules
npm run format:check # Check formatting
npm run format     # Format project files
npm test           # Run local form, control, and error page tests
npm run preview    # Preview the production build
```

## Conventions

- Components: PascalCase. Utilities and hooks: camelCase. Route files: kebab-case.
- Import from `src` with the `@/` alias.
- TypeScript fails on unused locals and parameters, so remove what you don't use.
- Use React hooks for state.
- Run the dev server or build once to generate route types before type-checking a fresh copy.
- Run build, typecheck, lint, format:check, and tests before reporting completion. Verify changed user flows locally; a passing build doesn't prove an interaction works.

## Application Name

Set the product's name and description in `src/routes/__root.tsx`:

- `siteName` is the page title and the title shown when the link is shared.
- `siteDescription` is the meta description and the description shown when the link is shared.

Then replace the placeholder heading and text in `src/routes/index.tsx`.

## Homepage redesign (Nov 2026) — supersedes the colour and home-order notes above

- **Palette**: primary is now blue `#1f6feb`, light-blue surfaces (`secondary` `#e8f1fd`), deep navy text `#0b1b3a`. Teal (`--brand-teal`) survives only as the Beginner-level accent. Edit the variables in `src/styles.css`.
- **Home order**: Hero → Why Battery School → Find Your Learning Path → Choose Your Level → Career Journey → Alumni Stories → Partner logos → Battery Speakers (navy) → program finder ("Next" gate) → FAQ.
- **Levels**: `src/lib/learning.ts`. `levelOf(course)` maps legacy `Course.level` (Basic/Intermediate/Advanced) to Beginner/Advanced/Expert. These are indicative until the Project Officer confirms them; add a `levelId` on `Course` for explicit overrides.
- **Images**: every homepage photo is an entry in `MEDIA` (`src/lib/learning.ts`). They are still the generated placeholders; replace `src` with real NBRI photography.
- **Accounts**: `src/lib/auth.ts` is an adapter seam with NO working provider (all calls reject with `AuthNotConfiguredError`). `/signin` is wired to it. Plug in Netlify Identity (PLAN.md milestone 3) by implementing `AuthAdapter`. The cart/checkout routes are intact; the header no longer links to the cart (course pages still navigate to it after "add").
- **Not yet done**: participant dashboard, calendar redesign (`/schedule`), Project Officer schedule management, medal/certificate photography.
