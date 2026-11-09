/** Shared admin class strings so controls look and behave the same everywhere. */
const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2";
const BUTTON_BASE = `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS}`;

export const ui = {
  label: "block text-sm font-semibold text-slate-800 mb-1",
  hint: "mt-1 text-xs text-slate-600",
  error: "mt-1 text-sm text-red-700",
  input: `block w-full min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 aria-[invalid=true]:border-red-600 ${FOCUS}`,
  buttonPrimary: `${BUTTON_BASE} bg-brand-navy text-white hover:bg-brand-navy-light`,
  buttonSecondary: `${BUTTON_BASE} border border-slate-300 bg-white text-slate-800 hover:bg-slate-50`,
  buttonDanger: `${BUTTON_BASE} border border-red-300 bg-white text-red-700 hover:bg-red-50`,
  link: `rounded text-brand-navy-light underline underline-offset-2 hover:text-brand-orange-dark ${FOCUS}`,
  card: "rounded-xl border border-slate-200 bg-white p-4 md:p-6",
} as const;
