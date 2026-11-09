---
name: blog-draft
description: Research a topic and prepare a Solaris Bronceado blog post (SEO-optimized Spanish article + AI image prompt), then upload it as an unpublished draft once the user drops the cover image in the folder. Use when the user says "/blog-draft <tema>", "haz un post sobre…", or asks for a new blog article.
---

# Blog draft

Turns a topic into a **draft** post the user reviews in `/admin`. You never publish.

## Flow

1. **Research.** Read `src/components/Services.tsx`, `FAQ.tsx`, `PreCare.tsx` and `src/lib/constants.ts` for what the salon actually offers. Then use WebSearch for the topic: prefer dermatology associations, health agencies and peer-reviewed sources over other salons' blogs. Note 2–4 sources worth citing.
2. **Check for duplicates.** If a draft folder or an existing post already covers the topic, say so and propose a different angle instead.
3. **Write** `.blog-drafts/<slug>/article.md` (format below).
4. **Hand off the image.** Give the user the image prompt (rules below) and the exact path: `.blog-drafts/<slug>/cover.png` (`.jpg`/`.webp` also work). Then **stop and wait** for them to say it's there.
5. **Upload.** Run `npm run blog:draft -- .blog-drafts/<slug>`. If it reports field errors, fix `article.md` and re-run. If it fails because `.env.blog-draft` is missing, tell the user to create it from the `.env.example` notes. Never print or ask for credential values.
6. **Report** the admin link the command prints, plus a short summary: target keyword, word count, and any claims the user should double-check.

## article.md format

```markdown
---
title: "…"          # H1, 5–110 chars, primary keyword near the start
seoTitle: "…"       # ≤ 60 chars; the site appends " | Solaris Bronceado"
description: "…"    # 120–160 chars, unique, keyword + benefit + soft call to action
slug: "…"           # optional; short, keyword-based, lowercase-with-dashes
coverAlt: "…"       # 3–150 chars, describes the image itself
---

Body in Markdown…
```

The command rejects anything outside these limits **before** uploading, so get them right the first time. Count characters.

## Writing guidelines

**Language and voice:** Spanish written for Costa Rica. Use *tú*, be warm and close, and sound expert without being clinical. Use local references where natural (the Costa Rican sun, rainy season, beach trips, Mall San Pedro).

**Format.** The site renders Markdown with GFM and strips raw HTML, so never write HTML tags. Make the article rich with what Markdown offers:
- `##` sections and `###` subsections, which become the table of contents and deep-link anchors. Don't use `#`: the title is the only H1.
- Short paragraphs of 2–4 sentences, **bold** for key ideas, numbered steps for procedures and bullets for lists.
- At least one table, e.g. a comparison, a checklist by skin type, or a before/after care timeline.
- `>` blockquotes for "Consejo Solaris" tips or important warnings.
- A final `## Preguntas frecuentes` section with 3–5 `###` questions, written the way people actually search.

**SEO**
- Pick one primary keyword and 3–5 related terms. Put the primary in the title, the first 100 words, at least one `##`, and the description. Write naturally and don't stuff keywords.
- Aim for 1,000–1,600 words. Answer search intent in the opening paragraph, then go deeper.
- Internal links use relative paths: `/#servicios`, `/#proceso`, `/#faq`, `/#contacto`, and `/blog/<slug>` for related posts that exist. Include 2–4.
- External links go only to the authoritative sources you used, cited inline.
- **No WhatsApp or phone links in the body.** They wouldn't be tracked in GA4. The post page already ends with a tracked contact CTA. Close with a short paragraph that invites the reader to book and points to `/#contacto`.

**Advertising and health honesty.** This is a tanning business, so these rules are not optional:
- Never claim tanning is safe or healthy, or that it treats medical conditions. Don't promote it as a vitamin D source. Don't tell readers to skip sunscreen.
- Recommend sun protection and checking with a dermatologist when relevant, especially for sensitive skin, moles or medication.
- No invented statistics, testimonials, prices, promotions or awards. Only state facts about the salon that appear in the codebase.
- No unverifiable superlatives ("el mejor de Costa Rica") and no fear-based selling.
- Content is for adults. Don't target minors.

## Image prompt rules

Give the user one ready-to-paste prompt, in English, that asks for:
- A **16:9** photorealistic image, at least 1600×900. The blog cards crop to 16:9.
- **No text, letters, logos or watermarks.**
- No identifiable faces (show people from behind, cropped, or as silhouettes), and no before/after skin comparisons.
- The brand mood: warm golden light, soft cream backgrounds, accents of deep navy blue (#1e4a99) and sunny orange (#f5a520), clean and premium spa aesthetic.
- A subject that matches the article.

Also remind the user that the file must be **under 4 MB**. If it isn't, they can save it as JPG.
