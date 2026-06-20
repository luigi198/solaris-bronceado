// ─── GA4 Conversion Tracking ────────────────────────────────────────────────
// Property: G-01W27QZDQL
//
// The three functions below fire events that are registered as conversions in
// GA4 Admin → Events. The event NAMES are the source of truth — changing them
// here without updating GA4 will silently break conversion tracking.
//
// To add a new tracked event:
//   1. Add a function here.
//   2. Call it from the relevant component via TrackedLink or onClick.
//   3. After deploy, go GA4 Admin → Events → toggle "Mark as conversion".
// ────────────────────────────────────────────────────────────────────────────

export function trackWhatsAppClick(source: string): void {
  window.gtag?.("event", "whatsapp_click", { source });
}

export function trackPhoneClick(): void {
  window.gtag?.("event", "phone_click");
}

export function trackCtaClick(source: string): void {
  window.gtag?.("event", "cta_click", { source });
}
