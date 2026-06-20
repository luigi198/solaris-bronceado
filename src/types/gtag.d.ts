declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js" | "set",
      targetId: string,
      params?: Record<string, unknown>
    ) => void;
    dataLayer: unknown[];
  }
}

export {};
