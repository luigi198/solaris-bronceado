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
```

**ESLint is mandatory.** After any code change, run `npm run lint` and fix every reported issue. Never suppress a rule with `// eslint-disable`, `/* eslint-disable */`, `@ts-ignore`, or `@ts-expect-error` — fix the root cause instead.

---

## Architecture

- **Framework:** Next.js 16 App Router (`src/app/`)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 (PostCSS plugin, no config file needed)
- **Fonts:** `next/font/google` loaded in `src/app/layout.tsx` as CSS variables (`--font-geist-sans`, `--font-geist-mono`)
- **Path alias:** `@/*` maps to `src/*`

All routes live under `src/app/`. Shared UI components go in `src/components/`, utilities in `src/lib/`. Co-locate page-specific components with their route segment rather than hoisting them globally unless they are reused.

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

## Code Quality Rules

- Run `npm run lint` after every change. Zero warnings, zero errors — no exceptions.
- Fix ESLint issues at the source. Do not disable, ignore, or suppress rules.
- `npm run build` must pass cleanly before marking any task complete. TypeScript errors are build failures.
- Prefer named exports over default exports for components (except page/layout files that Next.js requires as default exports).
- Keep components small and single-purpose. Extract logic into custom hooks (`src/hooks/`) when a component accumulates business logic.
