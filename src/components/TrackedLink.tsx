"use client";

import { type AnchorHTMLAttributes } from "react";
import { trackWhatsAppClick, trackPhoneClick, trackCtaClick } from "@/lib/analytics";

type TrackingEvent =
  | { event: "whatsapp_click"; source: string }
  | { event: "phone_click" }
  | { event: "cta_click"; source: string };

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {
  tracking: TrackingEvent | TrackingEvent[];
}

function fireEvent(t: TrackingEvent): void {
  if (t.event === "whatsapp_click") trackWhatsAppClick(t.source);
  else if (t.event === "phone_click") trackPhoneClick();
  else trackCtaClick(t.source);
}

export default function TrackedLink({ tracking, onClick, children, ...props }: Props) {
  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    const events = Array.isArray(tracking) ? tracking : [tracking];
    events.forEach(fireEvent);
    onClick?.(e);
  }
  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  );
}
