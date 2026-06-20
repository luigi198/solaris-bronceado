// ─── GA4 Conversion Tracking ────────────────────────────────────────────────
// Property: G-01W27QZDQL
//
// Conversion events registered in GA4 Admin → Events:
//   whatsapp_click, phone_click, cta_click
//
// The event NAMES are the source of truth — changing them here without
// updating GA4 will silently break conversion tracking.
//
// To add a new tracked event:
//   1. Call trackEvent() below, or add a named helper that wraps it.
//   2. Use TrackedLink or onClick in the component.
//   3. After deploy, go GA4 Admin → Events → toggle "Mark as conversion".
// ────────────────────────────────────────────────────────────────────────────

export const trackEvent = (
  eventName: string,
  parameters: Record<string, unknown> = {}
): void => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, parameters);
  }
};

export const trackWhatsAppClick = (source: string): void =>
  trackEvent("whatsapp_click", { source });

export const trackPhoneClick = (): void =>
  trackEvent("phone_click");

export const trackCtaClick = (source: string): void =>
  trackEvent("cta_click", { source });
