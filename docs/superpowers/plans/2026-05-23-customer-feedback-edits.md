# Customer Feedback Edits Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply 13 customer feedback items from Ericka Chacón across Hero, Services, Benefits, FAQ, Footer, and constants.

**Architecture:** Pure text/copy changes plus one new service card and a TikTok→Facebook social swap. No new files needed — all edits in existing components and `src/lib/constants.ts`.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Tailwind CSS v4

---

## File Map

| File | Changes |
|------|---------|
| `src/components/Hero.tsx:50` | Replace "SunSation" → "Solaris" |
| `src/components/Services.tsx:3-73` | Update 4 descriptions, add sessions note, add Salón service, add `hideConsultBtn` flag, rename button, remove button on Exfoliación |
| `src/components/Benefits.tsx:53-55` | Update subtitle to mention "desde 1999" |
| `src/components/FAQ.tsx:13-16` | Append spray results sentence to "¿Cuándo veré resultados?" |
| `src/components/Footer.tsx:4-11,66-76` | Fix SERVICE_LINKS list; swap TikTok icon+link for Facebook |
| `src/lib/constants.ts` | Add local phone constants; swap SOCIAL.tiktok for SOCIAL.facebook |

---

## Task 1: Hero — Replace "SunSation" with "Solaris"

**Files:**
- Modify: `src/components/Hero.tsx:50`

- [ ] **Step 1: Edit Hero.tsx**

In [Hero.tsx:50](src/components/Hero.tsx#L50), change:
```
En SunSation, entendemos que el bronceado no es una cuestión de &quot;talla única&quot;...
```
to:
```
En Solaris, entendemos que el bronceado no es una cuestión de &quot;talla única&quot;...
```

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: 0 errors, 0 warnings

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "copy: replace SunSation with Solaris in hero paragraph"
```

---

## Task 2: Services — Bronceado Brasileño sessions note

**Files:**
- Modify: `src/components/Services.tsx:7`

- [ ] **Step 1: Update description**

In [Services.tsx:7](src/components/Services.tsx#L7), change the `description` of "Bronceado Brasileño" from:
```
"Técnica híbrida que combina cámara UV, activadores de melanina y pigmentos naturales para lograr un tono intenso, uniforme y de larga duración. Incluye diseño de bikini con cintas. ₡20.000 por sesión.",
```
to:
```
"Técnica híbrida que combina cámara UV, activadores de melanina y pigmentos naturales para lograr un tono intenso, uniforme y de larga duración. Incluye diseño de bikini con cintas. ₡20.000 por sesión. El número de sesiones requerido varía dependiendo de su tipo de piel; en general recomendamos un mínimo de 3 sesiones.",
```

- [ ] **Step 2: Lint**

Run: `npm run lint`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/components/Services.tsx
git commit -m "copy: add minimum sessions note to Bronceado Brasileño"
```

---

## Task 3: Services — Cámara de Bronceado rewrite

**Files:**
- Modify: `src/components/Services.tsx:26`

- [ ] **Step 1: Update description**

In [Services.tsx:26](src/components/Services.tsx#L26), change the `description` of "Cámara de Bronceado" from:
```
"10 sesiones + acelerador Australian Gold + gafas protectoras. Un bronceado natural, uniforme y duradero, igual al obtenido con el sol. Todos nuestros equipos son verticales. ₡50.000 el paquete.",
```
to:
```
"Ofrecemos un paquete que incluye 10 sesiones + acelerador Australian Gold + gafas protectoras para un bronceado natural, uniforme y duradero, igual al obtenido con el sol. Todos nuestros equipos son verticales. Costo del paquete: ₡50.000.",
```

- [ ] **Step 2: Lint + Commit**

```bash
npm run lint && git add src/components/Services.tsx && git commit -m "copy: rewrite Cámara de Bronceado description per customer feedback"
```

---

## Task 4: Services — Exfoliación description + remove price button

**Files:**
- Modify: `src/components/Services.tsx:3-145`

This task has two parts: update the Exfoliación copy, and make the "Consultas" button conditional so it can be hidden per service.

- [ ] **Step 1: Add `hideConsultBtn` flag to SERVICES type**

In [Services.tsx](src/components/Services.tsx), update the `SERVICES` array — add `hideConsultBtn?: boolean` to the Exfoliación entry and update its description. The full updated Exfoliación object (currently at line 49):

```ts
{
  title: "Exfoliación Pre-Bronceado",
  description:
    "Recomendamos para todo tipo de sesión preparar tu piel con una exfoliación previa, eliminando células muertas para lograr un bronceado más uniforme, intenso y duradero.",
  tag: null,
  hideConsultBtn: true,
  icon: (/* unchanged */),
},
```

- [ ] **Step 2: Make the button conditional in the JSX**

In [Services.tsx:126-138](src/components/Services.tsx#L126-L138), wrap the `<a>` tag so it only renders when `hideConsultBtn` is not set:

```tsx
{!service.hideConsultBtn && (
  <a
    href={WA_LINK}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-brand-orange font-semibold hover:text-brand-orange-dark transition-colors text-sm"
    aria-label={`Consultas sobre ${service.title}`}
  >
    Consultas
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  </a>
)}
```

Note: the button text also changes from "Consultar precio" → "Consultas" for all other services (item 4 of feedback).

- [ ] **Step 3: Lint**

Run: `npm run lint`
Expected: 0 errors. TypeScript will complain that `hideConsultBtn` is not in the inferred type of `SERVICES` — fix by removing the `as const` assertion OR typing the array explicitly as `Array<{title: string; description: string; tag: string | null; hideConsultBtn?: boolean; icon: React.ReactNode}>`.

The simplest fix is to change `] as const` to `] satisfies readonly {...}[]` or just remove `as const` and let TypeScript infer. Since `icon` contains JSX, the easiest approach is to declare an explicit interface above SERVICES:

```ts
interface Service {
  title: string;
  description: string;
  tag: string | null;
  hideConsultBtn?: boolean;
  icon: React.ReactNode;
}

const SERVICES: Service[] = [
```

Add `import type { ReactNode } from "react";` at the top if not already present (in Next.js 16 with React 19, `ReactNode` comes from `"react"`).

- [ ] **Step 4: Lint again + Commit**

```bash
npm run lint && git add src/components/Services.tsx && git commit -m "feat: add hideConsultBtn flag; update Exfoliación copy; rename button to Consultas"
```

---

## Task 5: Services — Hidratación Post-Bronceado description

**Files:**
- Modify: `src/components/Services.tsx` (Hidratación entry, currently line 62)

- [ ] **Step 1: Update description**

Change the `description` of "Hidratación Post-Bronceado" from:
```
"Tratamiento hidratante y sellado en cámara de colágeno para prolongar un bronceado uniforme y luminoso.",
```
to:
```
"Recomendamos que posteriormente a su sesión de bronceado utilice cremas hidratantes para mantener su piel saludable, con brillo y suavidad natural. Por ello, le ofrecemos una amplia línea de productos para el cuidado de la piel.",
```

- [ ] **Step 2: Lint + Commit**

```bash
npm run lint && git add src/components/Services.tsx && git commit -m "copy: update Hidratación Post-Bronceado description"
```

---

## Task 6: Services — Add "Salón" service card

**Files:**
- Modify: `src/components/Services.tsx`

- [ ] **Step 1: Add Salón entry to SERVICES array**

Append the following object before the closing `]` of the SERVICES array:

```ts
{
  title: "Salón",
  description:
    "Para tu mayor comodidad te ofrecemos los servicios de cuidado de cabello, uñas, pestañas y diseño de bikini con cintas, para satisfacer en un solo lugar todas tus necesidades antes de cualquier evento.",
  tag: null,
  icon: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  ),
},
```

- [ ] **Step 2: Lint + Commit**

```bash
npm run lint && git add src/components/Services.tsx && git commit -m "feat: add Salón service card"
```

---

## Task 7: Benefits — "¿Por qué Solaris?" update with 1999

**Files:**
- Modify: `src/components/Benefits.tsx:53-55`

- [ ] **Step 1: Update subtitle paragraph**

In [Benefits.tsx:53-55](src/components/Benefits.tsx#L53-L55), change:
```
No somos un salón más. Somos especialistas en bronceado con la
mejor técnica, los mejores productos y el mejor resultado.
```
to:
```
Somos especialistas en bronceado desde 1999, con la mejor técnica,
los mejores productos y el mejor resultado.
```

- [ ] **Step 2: Lint + Commit**

```bash
npm run lint && git add src/components/Benefits.tsx && git commit -m "copy: mention 1999 founding in Benefits section"
```

---

## Task 8: FAQ — Add spray results line

**Files:**
- Modify: `src/components/FAQ.tsx:13-16`

- [ ] **Step 1: Update answer**

In [FAQ.tsx:15](src/components/FAQ.tsx#L15), change the `answer` of "¿Cuándo veré los resultados del bronceado?" from:
```
"Los resultados del bronceado brasileño son visibles desde las primeras sesiones. En el bronceado en cámara UV, el tono aparece de forma gradual y con 10 sesiones ya es notorio el cambio en la tonalidad de la piel.",
```
to:
```
"Los resultados del bronceado brasileño son visibles desde las primeras sesiones. En el bronceado en cámara UV, el tono aparece de forma gradual y con 10 sesiones ya es notorio el cambio en la tonalidad de la piel. Con el bronceado spray los resultados serán inmediatos.",
```

- [ ] **Step 2: Lint + Commit**

```bash
npm run lint && git add src/components/FAQ.tsx && git commit -m "copy: add spray immediate results line to FAQ"
```

---

## Task 9: Constants — Add local phone number

**Files:**
- Modify: `src/lib/constants.ts`
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Add local phone constants**

In [constants.ts](src/lib/constants.ts), add after the existing `PHONE_LINK` line:

```ts
export const PHONE_LOCAL = "2283-1368";
export const PHONE_LOCAL_LINK = "tel:+5062283-1368";
```

- [ ] **Step 2: Display local phone in Footer contact block**

In [Footer.tsx:141-143](src/components/Footer.tsx#L141-L143), after the existing `<li>` for WhatsApp phone, add a second `<li>` for the local number:

```tsx
<li className="flex items-center gap-2">
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 text-brand-orange" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 12 19.79 19.79 0 01.22 3.43 2 2 0 012.18 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.09a16 16 0 006 6l1.46-1.46a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
  </svg>
  <a href={PHONE_LOCAL_LINK} className="hover:text-brand-gold transition-colors">
    {PHONE_LOCAL}
  </a>
</li>
```

Also add `PHONE_LOCAL, PHONE_LOCAL_LINK` to the import at line 2.

- [ ] **Step 3: Lint + Commit**

```bash
npm run lint && git add src/lib/constants.ts src/components/Footer.tsx && git commit -m "feat: add local phone 2283-1368 to footer contact"
```

---

## Task 10: Footer — Swap TikTok for Facebook

**Files:**
- Modify: `src/lib/constants.ts`
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Update constants**

In [constants.ts:13-16](src/lib/constants.ts#L13-L16), change:
```ts
export const SOCIAL = {
  instagram: "https://www.instagram.com/solariscentrodebronceado/",
  tiktok: "https://www.tiktok.com/@centrodebronceadosolaris",
};
```
to:
```ts
export const SOCIAL = {
  instagram: "https://www.instagram.com/solariscentrodebronceado/",
  facebook: "https://www.facebook.com/solariscentrodebronceado",
};
```

- [ ] **Step 2: Update Footer social icon block**

In [Footer.tsx:66-76](src/components/Footer.tsx#L66-L76), replace the entire TikTok `<a>` element with a Facebook one:

```tsx
<a
  href={SOCIAL.facebook}
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Facebook de Solaris Bronceado"
  className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-brand-orange transition-colors duration-200"
>
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97H15.83c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
  </svg>
</a>
```

Also update the import in Footer.tsx line 2: remove `tiktok` reference (it's accessed via `SOCIAL.tiktok`). Since the object shape changed, TypeScript will catch it — replace `SOCIAL.tiktok` with `SOCIAL.facebook` in the JSX (already done in step above).

- [ ] **Step 3: Lint + Commit**

```bash
npm run lint && git add src/lib/constants.ts src/components/Footer.tsx && git commit -m "feat: replace TikTok with Facebook in footer social links"
```

---

## Task 11: Footer — Fix SERVICE_LINKS list

**Files:**
- Modify: `src/components/Footer.tsx:4-11`

The current list contains "Cama de Bronceado", "Paquete Solaris VIP", "Mantenimiento & Retoques" which don't match the services on the page. Replace with the actual service names in page order, using "Cámara" not "Cama".

- [ ] **Step 1: Update SERVICE_LINKS**

In [Footer.tsx:4-11](src/components/Footer.tsx#L4-L11), replace:
```ts
const SERVICE_LINKS = [
  "Bronceado Brasileño",
  "Cama de Bronceado",
  "Exfoliación Pre-Bronceado",
  "Hidratación Post-Bronceado",
  "Paquete Solaris VIP",
  "Mantenimiento & Retoques",
] as const;
```
with:
```ts
const SERVICE_LINKS = [
  "Bronceado Brasileño",
  "Cámara de Bronceado",
  "Bronceado con Spray",
  "Exfoliación Pre-Bronceado",
  "Hidratación Post-Bronceado",
  "Salón",
] as const;
```

- [ ] **Step 2: Lint + Commit**

```bash
npm run lint && git add src/components/Footer.tsx && git commit -m "copy: update footer service links to match page order and names"
```

---

## Task 12: Build verification

- [ ] **Step 1: Full build**

Run: `npm run build`
Expected: exits 0, no TypeScript errors, no ESLint errors

- [ ] **Step 2: Commit if anything was auto-fixed**

Only if `npm run build` changed files. Otherwise no extra commit needed.

---

## Self-Review Against Spec

| # | Feedback item | Task |
|---|---------------|------|
| 1 | Replace SunSation → Solaris in 1st paragraph | Task 1 |
| 2 | Bronceado Brasileño: add minimum 3 sessions note | Task 2 |
| 3 | Cámara de Bronceado: start with "ofrecemos un paquete..." | Task 3 |
| 4 | Replace "Consultar precio" → "Consultas" on all cards | Task 4 (Step 2) |
| 5 | Exfoliación: new copy + remove price button | Task 4 |
| 6 | Hidratación: new copy about moisturizers and product line | Task 5 |
| 7 | ¿Por qué Solaris?: add "desde 1999" | Task 7 |
| 8 | FAQ results: add spray immediate results line | Task 8 |
| 9 | Add local phone 2283-1368 | Task 9 |
| 10 | TikTok → Facebook icon | Task 10 |
| 11 | Footer: fix service list order + cama→cámara | Task 11 |
| 12 | Photos for each service (waiting on client) | Skipped |
| 13 | Add Salón service | Task 6 |
