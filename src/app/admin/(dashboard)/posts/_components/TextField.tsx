import { ui } from "../../../_components/ui";

interface Props {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  /** Shows a live counter; turns red outside [min, max]. */
  counter?: { min?: number; max: number };
  multiline?: boolean;
  placeholder?: string;
}

export function TextField({ name, label, value, onChange, error, hint, counter, multiline, placeholder }: Props) {
  const describedBy = [hint && `${name}-hint`, error && `${name}-error`].filter(Boolean).join(" ") || undefined;
  const outOfRange = counter && (value.length > counter.max || (counter.min !== undefined && value.length < counter.min));
  const common = {
    id: name,
    name,
    value,
    placeholder,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: ui.input,
  };

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={name} className={ui.label}>
          {label}
        </label>
        {counter && (
          <span className={`text-xs ${outOfRange ? "text-red-700 font-semibold" : "text-slate-600"}`} aria-live="polite">
            {value.length}
            {counter.min !== undefined ? ` (${counter.min}–${counter.max})` : ` / ${counter.max}`}
          </span>
        )}
      </div>
      {multiline ? (
        <textarea {...common} rows={3} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...common} onChange={(e) => onChange(e.target.value)} />
      )}
      {hint && (
        <p id={`${name}-hint`} className={ui.hint}>
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className={ui.error}>
          {error}
        </p>
      )}
    </div>
  );
}
