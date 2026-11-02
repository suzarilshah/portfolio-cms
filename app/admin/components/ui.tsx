'use client';

import { forwardRef, useState } from 'react';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2, Plus, X } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* -- Type ---------------------------------------------------------------- */

export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('wb-label', className)}>{children}</span>;
}

export function Meta({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('wb-meta', className)}>{children}</span>;
}

/* -- Surfaces ------------------------------------------------------------ */

export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn('wb-panel', className)}>
      {(title || actions) && (
        <header className="flex items-start justify-between gap-4 px-5 py-3.5 border-b border-[var(--line)]">
          <div className="min-w-0">
            {title && <h2 className="text-[13px] font-semibold text-[var(--text)]">{title}</h2>}
            {description && (
              <p className="mt-1 text-[12px] leading-relaxed text-[var(--faint)]">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn('p-5', bodyClassName)}>{children}</div>
    </section>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-[var(--line)] pb-5 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-2">{eyebrow}</div>}
        <h1 className="text-[22px] font-semibold tracking-[-0.01em] text-[var(--text)]">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-[var(--dim)]">{description}</p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}

/* -- Controls ------------------------------------------------------------ */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'default' | 'ghost' | 'danger';
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'default', loading, disabled, children, className, ...rest },
  ref
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn('wb-btn', `wb-btn-${variant}`, className)}
      {...rest}
    >
      {loading && <Loader2 size={14} className="animate-spin" />}
      {children}
    </button>
  );
});

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={cn('wb-input', className)} {...rest} />;
  }
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...rest }, ref) {
  return <textarea ref={ref} className={cn('wb-input', className)} {...rest} />;
});

export function Field({
  label,
  hint,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={htmlFor} className="block">
        <Label>{label}</Label>
      </label>
      {hint && <p className="text-[12px] leading-relaxed text-[var(--faint)]">{hint}</p>}
      {children}
    </div>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative h-[18px] w-[32px] shrink-0 rounded-full border transition-colors disabled:opacity-40',
        checked
          ? 'border-[var(--accent-line)] bg-[var(--accent)]'
          : 'border-[var(--line)] bg-[var(--raised)]'
      )}
    >
      <span
        className={cn(
          'absolute top-1/2 h-[12px] w-[12px] -translate-y-1/2 rounded-full transition-all',
          checked ? 'left-[17px] bg-[#06080b]' : 'left-[2px] bg-[var(--faint)]'
        )}
      />
    </button>
  );
}

/* -- Tag input -----------------------------------------------------------
 * Enter commits, Backspace on an empty field removes the last entry. Used
 * anywhere the content model is "an ordered list of short strings".
 */

export function TagInput({
  values,
  onChange,
  placeholder = 'Type and press Enter…',
  max,
}: {
  values: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  max?: number;
}) {
  const [draft, setDraft] = useState('');
  const full = max !== undefined && values.length >= max;

  const commit = (raw: string) => {
    const value = raw.trim();
    if (!value || full || values.includes(value)) {
      setDraft('');
      return;
    }
    onChange([...values, value]);
    setDraft('');
  };

  return (
    <div className="space-y-2">
      {values.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {values.map((value, index) => (
            <li
              key={`${value}-${index}`}
              className="group flex items-center gap-1.5 rounded-[3px] border border-[var(--line)] bg-[var(--raised)] py-1 pl-2.5 pr-1 text-[12px] text-[var(--text)]"
            >
              {value}
              <button
                type="button"
                aria-label={`Remove ${value}`}
                onClick={() => onChange(values.filter((_, i) => i !== index))}
                className="rounded-[2px] p-0.5 text-[var(--faint)] transition-colors hover:text-[var(--danger)]"
              >
                <X size={11} />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        <Input
          value={draft}
          disabled={full}
          placeholder={full ? `Limit of ${max} reached` : placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit(draft);
            } else if (e.key === 'Backspace' && draft === '' && values.length > 0) {
              onChange(values.slice(0, -1));
            }
          }}
        />
        <Button type="button" onClick={() => commit(draft)} disabled={!draft.trim() || full}>
          <Plus size={14} />
        </Button>
      </div>
    </div>
  );
}

/* -- Status -------------------------------------------------------------- */

type Tone = 'neutral' | 'ok' | 'warn' | 'danger' | 'accent';

const TONE: Record<Tone, string> = {
  neutral: 'border-[var(--line)] text-[var(--faint)]',
  ok: 'border-[#3fb97f4d] text-[var(--ok)]',
  warn: 'border-[#e0a33e4d] text-[var(--warn)]',
  danger: 'border-[#f2555a4d] text-[var(--danger)]',
  accent: 'border-[var(--accent-line)] text-[var(--accent)]',
};

export function Pill({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: Tone;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'wb-label inline-flex items-center gap-1.5 rounded-[3px] border px-1.5 py-[3px]',
        TONE[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Dot({ tone = 'neutral' }: { tone?: Tone }) {
  const bg: Record<Tone, string> = {
    neutral: 'bg-[var(--faint)]',
    ok: 'bg-[var(--ok)]',
    warn: 'bg-[var(--warn)]',
    danger: 'bg-[var(--danger)]',
    accent: 'bg-[var(--accent)]',
  };
  return <span className={cn('h-[5px] w-[5px] shrink-0 rounded-full', bg[tone])} />;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-[var(--line)] rounded-[4px] px-6 py-12 text-center">
      {icon && <div className="text-[var(--faint)]">{icon}</div>}
      <div>
        <p className="text-[13px] font-medium text-[var(--dim)]">{title}</p>
        {description && (
          <p className="mx-auto mt-1 max-w-sm text-[12px] leading-relaxed text-[var(--faint)]">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

/* -- Save bar ------------------------------------------------------------
 * Pinned to the bottom of the editor column. It is the single place an editor
 * reports state, so "did that save?" is never a guess: it shows dirty, in
 * flight, the actual error text on failure, and when the last save landed.
 */

export type SaveState =
  | { status: 'idle'; savedAt?: Date }
  | { status: 'saving' }
  | { status: 'error'; message: string };

export function SaveBar({
  dirty,
  state,
  onSave,
  onReset,
  children,
}: {
  dirty: boolean;
  state: SaveState;
  onSave: () => void;
  onReset?: () => void;
  children?: React.ReactNode;
}) {
  const saving = state.status === 'saving';

  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-6 border-t border-[var(--line)] bg-[var(--bg)]/95 px-4 py-3 backdrop-blur-none md:-mx-8 md:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {state.status === 'error' ? (
            <>
              <Dot tone="danger" />
              <span className="text-[12px] text-[var(--danger)]">{state.message}</span>
            </>
          ) : saving ? (
            <>
              <Loader2 size={12} className="animate-spin text-[var(--faint)]" />
              <Meta>Publishing…</Meta>
            </>
          ) : dirty ? (
            <>
              <Dot tone="warn" />
              <Meta>Unsaved changes</Meta>
            </>
          ) : state.savedAt ? (
            <>
              <Dot tone="ok" />
              <Meta>
                Published {state.savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Meta>
            </>
          ) : (
            <>
              <Dot />
              <Meta>No changes</Meta>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {children}
          {dirty && onReset && (
            <Button variant="ghost" onClick={onReset} disabled={saving}>
              Discard
            </Button>
          )}
          <Button variant="primary" onClick={onSave} loading={saving} disabled={!dirty}>
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
