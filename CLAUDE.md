# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Important: Next.js Version Notice

This project runs **Next.js 16** — a breaking-change release. APIs, conventions, and file structure may differ significantly from training data. Before writing any code, read the relevant guide in `node_modules/next/dist/docs/`. Heed all deprecation notices.

---

## Commands

```bash
npm run dev       # Start dev server
npm run build     # Production build (also type-checks)
npm run start     # Serve production build
npm run lint      # Run ESLint
npm test          # Vitest (uses an in-memory mongod; first run downloads it)
npm run setup:admin  # Generate admin credential env vars (interactive)
```

`npm run build` prerenders `/blog` from MongoDB, so it needs `MONGODB_URI`. Locally: `docker run -d --name solaris-mongo -p 127.0.0.1:27018:27017 mongo:8` and copy `.env.example` to `.env.local`.

**ESLint is mandatory.** After any code change, run `npm run lint` and fix every reported issue. Never suppress a rule with `// eslint-disable`, `/* eslint-disable */`, `@ts-ignore`, or `@ts-expect-error` — fix the root cause instead.

---

## Architecture

- **Framework:** Next.js 16 App Router (`src/app/`)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (PostCSS plugin, no config file needed)
- **Fonts:** `next/font/google` loaded in `src/app/layout.tsx` as CSS variables (`--font-geist-sans`, `--font-geist-mono`)
- **Path alias:** `@/*` maps to `src/*`

All routes live under `src/app/`. Shared UI components go in `src/components/`, utilities in `src/lib/`. Co-locate page-specific components with their route segment rather than hoisting them globally unless they are reused.

Public pages live in the `(site)` route group (its layout adds Navbar, WhatsApp float and GA4). `/admin` sits outside it on purpose: no site chrome, no analytics.

---

## Blog & Admin

Self-hosted blog: MongoDB for posts, S3 for images, a single admin whose credentials live only in env vars.

**Layers** (domain never imports storage; storage never imports domain — both depend on `src/lib/contracts/`):

| Layer | Path |
|---|---|
| Presentation | `src/app/(site)/blog/*`, `src/app/admin/*` (pages + Server Actions) |
| Composition root | `src/lib/server/container.ts` — the only place that wires concrete adapters |
| Domain | `src/lib/auth/*`, `src/lib/blog/*`, `src/lib/images/*` |
| Contracts | `src/lib/contracts/*` — interfaces + entity types at the boundary |
| Storage | `src/lib/storage/mongo/*`, `src/lib/storage/s3/*` |

**Security rules — do not weaken:**
- Every admin page and Server Action calls `requireAdmin()` first. `src/proxy.ts` is only an optimistic cookie check.
- Login order in `LoginService`: lock check → count attempt → verify username, password and TOTP unconditionally → burn TOTP step. Do not short-circuit.
- A valid trusted-device cookie (`src/lib/auth/trustedDevice.ts`) exempts a browser from the *global* login cap only, so a distributed flood cannot lock the admin out. Never let it bypass per-client limits, the password or TOTP.
- `revalidatePath` for dynamic blog routes must include the route group (`/(site)/blog/[slug]`), or it silently matches nothing.
- Sessions are opaque random tokens stored as SHA-256 in `auth_sessions`; never store or log raw tokens, passwords, TOTP codes or raw IPs (use `pseudonymize`).
- Markdown renders with `skipHtml`; only images from `NEXT_PUBLIC_IMAGE_BASE_URL` render. JSON-LD goes through `<JsonLd>` (escapes `<`).
- Uploads are sniffed by magic bytes and re-encoded with sharp; keys are server-generated.

**Infra:** AWS resources (S3 bucket, upload-only IAM user) are Terraform in `infra/` — see `infra/README.md`. Always run `aws sts get-caller-identity --profile solaris` before plan/apply.

**Caching:** blog pages are ISR (`revalidate = 3600`) and admin Server Actions call `revalidateBlog()`. Do not add `loading.tsx` under `/blog` — the Suspense boundary makes `notFound()`/redirects return HTTP 200 (soft 404s).

---

## Frontend Practices

- **Server Components by default.** Only add `"use client"` when the component needs browser APIs, event handlers, or React state/effects. Keep client boundaries as deep (small) as possible.
- **Data fetching in Server Components.** Fetch directly in async Server Components; avoid redundant client-side fetching for data that can be server-rendered.
- **TypeScript strict mode is on.** Every value must be properly typed; no `any`, no unsafe casts.
- **Tailwind only.** Do not introduce CSS Modules, CSS-in-JS, or inline `style` props unless a dynamic value cannot be expressed with Tailwind utilities.
- **No magic numbers in JSX class strings.** Extract repeated utility combinations into semantic component abstractions or Tailwind `@apply` if they repeat more than twice.
- **Images:** Always use `next/image`. Provide explicit `width`/`height` or `fill` with a sized container. Never use raw `<img>`.
- **Links:** Always use `next/link`. Never use `<a>` for internal navigation.
- **Fonts:** Load all fonts via `next/font` to prevent layout shift. Never import fonts via `<link>` in the `<head>`.

---

## Sitemap

The sitemap is generated by `next-sitemap` and configured in `next-sitemap.config.js`. It runs automatically via the `postbuild` script on every `npm run build`.

**Rule:** After adding, removing, or renaming any route segment under `src/app/` (i.e., any `page.tsx`), run `npm run build` to regenerate `public/sitemap.xml`, `public/sitemap-0.xml`, and `public/robots.txt`. Never edit those files by hand — they are build artifacts and will be overwritten.

Blog URLs are excluded from `next-sitemap` and served instead by the dynamic `/blog/sitemap.xml` (`src/app/(site)/blog/sitemap.ts`), which `robots.txt` lists via `additionalSitemaps`.

---

## SEO

- Every page must export a `metadata` object (or a `generateMetadata` function for dynamic pages) with at minimum `title` and `description`.
- Titles follow the pattern `Page Name | Site Name` using Next.js `metadata.title.template` set in the root layout.
- `description` must be unique per page, 120–160 characters, and describe actual page content.
- Use semantic HTML: one `<h1>` per page, logical heading hierarchy (`h2` → `h3`), landmark elements (`<main>`, `<nav>`, `<footer>`, `<article>`, `<section>`).
- Every `next/image` must have a descriptive, non-empty `alt` prop. Decorative images use `alt=""`.
- Add `robots`, `openGraph`, and `twitter` metadata fields for pages that are publicly indexed.
- Use `next/link` with `prefetch` defaults; avoid client-side navigation that prevents the browser from receiving a proper URL for crawling.
- Structured data (JSON-LD) goes in a `<script type="application/ld+json">` inside the relevant Server Component, not in a client component.

---

## UI/UX

- **Mobile-first.** All layouts are designed at `sm` width first, then extended upward with responsive prefixes (`md:`, `lg:`, `xl:`).
- **Accessible by default.** Interactive elements must be keyboard-navigable. Use native `<button>` for actions and `<a>` (via `next/link`) for navigation — never make a `<div>` clickable.
- **Focus styles must be visible.** Never remove `:focus-visible` outlines. Tailwind's `focus-visible:ring-*` utilities are preferred.
- **Color contrast.** Text must meet WCAG AA (4.5:1 for body text, 3:1 for large text). Do not rely on color alone to convey meaning.
- **Loading states.** Any async UI must have a loading skeleton or spinner. Use Next.js `loading.tsx` segment files for route-level loading UI.
- **Error states.** Provide descriptive, actionable error messages. Use `error.tsx` segment files for route-level error boundaries.
- **Motion.** Respect `prefers-reduced-motion`. Wrap animations in `@media (prefers-reduced-motion: no-preference)` or use Tailwind's `motion-safe:` variant.
- **Touch targets.** Minimum 44×44 px for all interactive elements on mobile.

---

## Analytics — GA4 Conversion Tracking

**Do not rename, move, or delete `src/lib/analytics.ts` or `src/components/TrackedLink.tsx` without updating GA4 first.**

GA4 property `G-01W27QZDQL` has three events registered as conversions:

| Event name | Fires from |
|---|---|
| `whatsapp_click` | `WhatsAppFloat`, Hero CTA, ContactCTA WA button, Services "Consultas" links |
| `phone_click` | ContactCTA phone link (`tel:`) |
| `cta_click` | Hero CTA (`source: "hero"`), ContactCTA primary button (`source: "contact_cta"`) |

Rules:
- All GA4 `gtag('event', ...)` calls go through `src/lib/analytics.ts`. Never call `window.gtag` directly in a component.
- Tracked `<a>` elements use `<TrackedLink>` from `src/components/TrackedLink.tsx` (a client component).
- If you add a new WhatsApp link anywhere, wrap it in `<TrackedLink tracking={{ event: "whatsapp_click", source: "<location>" }}>`.
- Adding a new conversion event requires a code change in `analytics.ts` **and** a manual step in GA4 Admin → Events → "Mark as conversion".

---

## Code Quality Rules

- Run `npm run lint` after every change. Zero warnings, zero errors — no exceptions.
- Fix ESLint issues at the source. Do not disable, ignore, or suppress rules.
- `npm run build` must pass cleanly before marking any task complete. TypeScript errors are build failures.
- Prefer named exports over default exports for components (except page/layout files that Next.js requires as default exports).
- Keep components small and single-purpose. Extract logic into custom hooks (`src/hooks/`) when a component accumulates business logic.
