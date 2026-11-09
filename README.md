# Solaris Bronceado

Website for Solaris Bronceado, a tanning salon in Costa Rica: the marketing site plus a self-hosted, SEO-focused blog with a private single-admin editor.

- **Framework:** Next.js 16 (App Router), React 19, TypeScript (strict), Tailwind CSS v4
- **Data:** MongoDB (blog posts, admin sessions, login rate limits)
- **Images:** Amazon S3, provisioned with Terraform (`infra/`)
- **Hosting:** Vercel

> Next.js 16 has breaking changes. Read the relevant guide in `node_modules/next/dist/docs/` before changing framework-level code. Contributor and agent conventions are in [`CLAUDE.md`](CLAUDE.md).

## Getting started

Requirements: Node.js 24, Docker (for a local MongoDB).

```bash
npm install

# Local MongoDB (any free port works; keep it bound to 127.0.0.1)
docker run -d --name solaris-mongo -p 127.0.0.1:27018:27017 mongo:8

cp .env.example .env.local   # then fill in the values (see below)
npm run setup:admin          # generates the admin credential variables
npm run dev                  # http://localhost:3001
```

`npm run build` prerenders `/blog` from MongoDB, so a reachable database is required for builds too (including the pre-commit hook).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server on port 3001 |
| `npm run build` | Production build (type-checks, then regenerates the sitemap via `next-sitemap`) |
| `npm run start` | Serves the production build |
| `npm run lint` | ESLint — must be clean before committing |
| `npm test` | Vitest; storage tests run against a real in-memory `mongod` (downloaded on first run) |
| `npm run setup:admin` | Interactive: prints the admin username, password hash, TOTP secret and session secret as env vars |

A Husky pre-commit hook runs lint and build.

## Environment variables

All variables are listed in [`.env.example`](.env.example). Real values live only in `.env.local` (gitignored) and in Vercel → Settings → Environment Variables (Production and Preview). **Never commit real values.**

| Group | Variables | Source |
|---|---|---|
| MongoDB | `MONGODB_URI`, `MONGODB_DB` | MongoDB Atlas (or the local Docker instance) |
| Admin login | `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `ADMIN_TOTP_SECRET`, `AUTH_SECRET` | `npm run setup:admin` |
| Images | `S3_REGION`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `NEXT_PUBLIC_IMAGE_BASE_URL` | `infra/` outputs + an access key for the upload user |

Vercel reserves `AWS_*` names, hence the `S3_*` prefix. `NEXT_PUBLIC_IMAGE_BASE_URL` is inlined at build time, so redeploy after changing it.

`setup:admin` must run in a real terminal (it reads the password with hidden input). The plain password is never stored anywhere — only its scrypt hash. Rotating `AUTH_SECRET` invalidates every session and trusted-device cookie.

## Project structure

```
src/
  app/
    (site)/            Public pages (site chrome + analytics live in this group's layout)
      blog/            Blog index, pagination, post pages, /blog/sitemap.xml
    admin/             Private editor — no site chrome, no analytics, noindex
  components/          Shared UI (incl. PostBody: the Markdown renderer)
  hooks/               Client hooks
  lib/
    contracts/         Interfaces + entity types at layer boundaries
    auth/ blog/ images/  Domain logic (never imports storage)
    storage/mongo|s3/  Storage adapters (never import domain)
    server/            Env loading + composition root (wires adapters to services)
    http/              Cookie and request helpers for pages/Server Actions
  proxy.ts             Optimistic redirect for /admin (not the security boundary)
infra/                 Terraform for the S3 bucket and upload-only IAM user
scripts/               setup-admin
test/                  Test helpers (in-memory MongoDB, fake clock)
```

## Writing blog posts

Posts are written in Markdown (typically AI-generated) in the admin editor at `/admin`.

- Paste the whole article. If it starts with a front-matter block, **"Usar metadatos del encabezado"** fills in the fields:

  ```markdown
  ---
  title: Cómo cuidar tu bronceado
  slug: como-cuidar-tu-bronceado
  description: Una meta descripción de 120 a 160 caracteres que resume el artículo.
  seoTitle: Título corto para Google (opcional, máx. 60)
  ---
  ## Primera sección
  …
  ```

- The post title is the page's only `<h1>`; use `##` and `###` in the body (a `#` in the body is demoted automatically).
- Raw HTML in Markdown is ignored. Only images uploaded through the editor are rendered.
- Publishing requires a 120–160 character description, a cover image with alt text and at least 300 characters of content. Drafts can be incomplete.
- Changing a published post's slug permanently redirects the old URL.
- Pages are cached (ISR) and refreshed immediately when a post is saved, unpublished or deleted.
- Deleting a post also deletes its cover and inline images, except any still used by another post or draft. Deleted images stop being public immediately and stay recoverable in S3 for 30 days.

Each post gets canonical URL, Open Graph/Twitter tags, `BlogPosting` and breadcrumb JSON-LD, and an entry in `/blog/sitemap.xml` (listed in `robots.txt`).

## Security model

There are no user accounts: a single admin is defined entirely by environment variables.

- **Login** requires username, password (scrypt) and a TOTP code from an authenticator app. All three are always checked, failures return one generic message with uniform timing, and a TOTP code cannot be reused.
- **Brute force:** attempts are counted before credentials are verified, with escalating per-client locks and a global cap. Browsers that have logged in before carry a signed trusted-device cookie that exempts them from the global cap only, so a distributed attack cannot lock the admin out.
- **Sessions** are random opaque tokens stored only as hashes, with idle and absolute expiry, in `HttpOnly`, `Secure`, `SameSite=Strict`, `__Host-` cookies. "Cerrar todas las sesiones" revokes every session.
- **Authorization** is enforced in every admin page and Server Action, not just in the proxy.
- **Content:** Markdown HTML is stripped, JSON-LD is escaped, and uploads are type-checked by content and re-encoded (which strips metadata such as GPS) before reaching S3.
- **Infrastructure:** the bucket only allows public reads under `blog/`. The app's IAM user can only create new objects there (never overwrite) and delete them; it cannot read, list or remove old versions. The bucket is versioned, so nothing the app — or a leaked key — does is irreversible within the 30-day recovery window.
- **Logs** are structured JSON; IPs are pseudonymized and credentials, tokens and cookies are redacted.

If you find a security issue, please report it privately to the maintainers rather than opening a public issue.

## Infrastructure

See [`infra/README.md`](infra/README.md). Terraform state is kept locally and is gitignored; it is never committed.

## Deployment

Vercel builds every push: branches get a Preview deployment, `main` deploys to production. Before the first deploy:

1. Add every variable from `.env.example` to Vercel (Production and Preview).
2. Allow Vercel to reach MongoDB Atlas (Vercel has no fixed outbound IPs, so Atlas network access must permit it). Use a database user limited to the app's database.
3. Preview and Production share whatever database their variables point to — content published from a Preview is live data.
