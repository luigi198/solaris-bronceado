---
name: blog-draft
description: Research a topic and prepare a Solaris Bronceado blog post (SEO-optimized Spanish article + AI image brief), then upload it as an unpublished draft once the user drops the cover image in the folder. Use when the user says "/blog-draft <tema>", "haz un post sobre…", or asks for a new blog article.
---

# Blog draft

Turns a topic into a **draft** post the user reviews in `/admin`. You never publish.

## Flow

0. **Topic.** If the user gave no topic, take the first `pending` row of `.blog-drafts/calendar.md` and use its keyword, angle and links. If that row lists a question for the owner, ask it before writing. After the upload succeeds, set that row's status to `drafted`.
1. **Research.** Read `src/components/Services.tsx`, `FAQ.tsx`, `PreCare.tsx` and `src/lib/constants.ts` for what the salon actually offers. Then use WebSearch for the topic: prefer dermatology associations, health agencies and peer-reviewed sources over other salons' blogs. Note 2–4 sources worth citing.
2. **Check for duplicates.** If a draft folder or an existing post already covers the topic, say so and propose a different angle instead.
3. **Write** `.blog-drafts/<slug>/article.md` (format below).
4. **Write the image prompt.** Re-read the finished article and write `.blog-drafts/<slug>/image-prompt.md`, holding only the paste-ready prompt (rules below). Then make `coverAlt` in `article.md` describe that scene.
5. **Hand off the image.** Show the user the prompt in one code block, the exact path for the image (`.blog-drafts/<slug>/cover.png`; `.jpg`/`.webp` also work), and the checklist below. Then **stop and wait** for them to say it's there. Never create a placeholder or code-drawn image under the cover's filename.
6. **Upload.** Run `npm run blog:draft -- .blog-drafts/<slug>`. If it reports field errors, fix `article.md` and re-run. If it fails because `.env.blog-draft` is missing, tell the user to create it from the `.env.example` notes. Never print or ask for credential values.
7. **Report** the admin link the command prints, plus a short summary: target keyword, word count, and any claims the user should double-check.

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
- Write so AI assistants can quote you; in GA4 they send the visitors most likely to message on WhatsApp. That means one-sentence definitions ("El bronceado en spray es…"), concrete numbers that are true for this salon, tables, and FAQ answers that make sense on their own.
- Internal links use relative paths: `/#servicios`, `/#proceso`, `/#faq`, `/#contacto`, and `/blog/<slug>` for related posts that exist. Include 2–4.
- External links go only to the authoritative sources you used, cited inline.
- **No WhatsApp or phone links in the body.** They wouldn't be tracked in GA4. The post page already ends with a tracked contact CTA. Close with a short paragraph that invites the reader to book and points to `/#contacto`.

**Advertising and health honesty.** This is a tanning business, so these rules are not optional:
- Never claim tanning is safe or healthy, or that it treats medical conditions. Don't promote it as a vitamin D source. Don't tell readers to skip sunscreen.
- Recommend sun protection and checking with a dermatologist when relevant, especially for sensitive skin, moles or medication.
- No invented statistics, testimonials, prices, promotions or awards. Only state facts about the salon that appear in the codebase.
- No unverifiable superlatives ("el mejor de Costa Rica") and no fear-based selling.
- Content is for adults. Don't target minors.

## Image prompt (`image-prompt.md`)

The user pastes the prompt into a tool that **can generate images**, such as ChatGPT or Gemini with image generation. Plain Claude chat cannot, and will only redescribe the prompt. Say this in the handoff.

Image models respond best to one dense descriptive paragraph, so the file holds **only the prompt**, with no headings, bullets or Markdown:
- **English, one paragraph, about 120–180 words.** Start with "Photorealistic editorial photograph, 16:9 landscape."
- **Take the scene from the article, not the topic.** Choose the one moment that best shows the article's main promise, e.g. the application step in a how-to, the two options side by side in a comparison, or the prep ritual in a preparation guide. Use details the article mentions (the salon's equipment, products, steps and setting). Avoid generic stock scenes like a woman on a beach.
- **Describe only what is in the frame:** subject, action, props, setting, camera angle, framing and depth of field. Leave out the article's purpose, audience and the salon's facts (durations, prices). The model can't use them and may render them as text.
- **Use color names, not hex codes:** "deep navy blue" and "warm sunny orange". Hex codes don't help the model, and a `#` at the start of a line turns into a Markdown heading when pasted.
- **Avoid digits and quoted phrases**, because models tend to render them as text. Write distances in words ("a hand's width away").
- **State the constraints positively in the scene itself**, because long "do not" lists backfire: "shown from behind, cropped at the neck", "the technician's face is out of frame", "a clearly adult woman", "all surfaces, bottles and devices are plain and blank, with no writing anywhere". Keep it to people shown from behind or cropped, adults only, no before/after comparisons and no sunburn.
- **Always include the brand mood:** warm golden light, soft cream backgrounds, deep navy blue and warm sunny orange accents, a clean premium spa feel, and natural skin texture.
- **Put the main subject in the center** so card crops don't cut it ("main subject centered with generous margins").

**Checklist for the user** (put it in the handoff, not in the prompt). Before saving, check that:
1. There is no text, letters or logos anywhere, including on bottles and devices.
2. No face is identifiable, and every person clearly looks like an adult.
3. The main subject survives a crop of the edges.
4. The file is under 4 MB; if it isn't, save it as JPG.
