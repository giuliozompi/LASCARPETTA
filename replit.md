# La Scarpetta

Multilingual website (RU/IT/EN/FR/ZH) for La Scarpetta — an authentic Italian trattoria in Moscow.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/lascarpetta run dev` — run the React frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run typecheck:libs` — rebuild composite lib declarations (run before leaf typechecks after schema changes)
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed` — seed the database with initial data (admin user + sample content)
- Required env: `DATABASE_URL` — Postgres connection string, `SESSION_SECRET` — express-session secret

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind CSS v4 + Framer Motion + Wouter (routing)
- Fonts: El Messiri (headings) + Raleway (body) via Google Fonts
- API: Express 5 + express-session (cookie-based admin auth)
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema/` — source of truth for all DB tables
- `lib/api-spec/` — OpenAPI spec (source of truth for API contracts)
- `lib/api-zod/` — generated Zod schemas (from codegen)
- `lib/api-client-react/` — generated React Query hooks (from codegen)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/lascarpetta/src/pages/` — React pages (public + admin)
- `artifacts/lascarpetta/src/i18n/` — translation strings (RU/IT/EN/FR/ZH)
- `artifacts/lascarpetta/public/` — static assets (images, robots.txt, sitemap.xml)
- `scripts/src/seed.ts` — database seeder

## Architecture decisions

- Contract-first API: OpenAPI spec → codegen → Zod schemas + React Query hooks used everywhere
- Session-based admin auth (express-session + bcrypt), not JWT — simpler for single-admin CMS use case
- All route handlers use `return res.json()` pattern (required by TypeScript `noImplicitReturns`)
- After changing `lib/*` packages, always run `pnpm run typecheck:libs` before leaf artifact typechecks
- Language switcher persists selection in localStorage; all UI strings use the `useTranslation()` hook

## Product

- **Public site**: Home, Menu (categorized with photos + prices), Gallery, Events, Chef bio, Reviews (4.9★), Reservations (form + Yandex map), Catering booking, Contacts
- **Admin panel** (`/admin`): Manage menu categories/dishes, gallery photos, events, reservations (approve/decline), catering bookings, reviews (approve/reject)
- **5 languages**: Russian, Italian, English, French, Chinese — switchable via nav bar
- **SEO**: robots.txt + XML sitemap with hreflang alternates for Yandex/Google

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- After any schema change in `lib/db`, run `pnpm run typecheck:libs` to rebuild declarations before typechecking `artifacts/*`
- Admin credentials: username=`admin`, password=`scarpetta2024!` (seeded by `pnpm --filter @workspace/scripts run seed`)
- Google Fonts `@import` must come before `@import "tailwindcss"` in index.css — Vite enforces this order
- Menu categories table requires: `slug` (notNull+unique), `nameRu/It/En/Fr/Zh` (all notNull)
- Express 5 + TypeScript `noImplicitReturns`: all async route handlers must explicitly `return res.json()`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- Brand: primary `#7C2912` (burgundy), background `#F9F9F2`
