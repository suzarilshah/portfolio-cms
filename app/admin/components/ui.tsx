'use client';

import { forwardRef, useState } from 'react';
import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Loader2, Plus, X } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* -- Type ---------------------------------------------------------------- */

export function Meta({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('studio-meta', className)}>{children}</span>;
}

export function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('studio-label', className)}>{children}</span>;
}

/* -- Surfaces ------------------------------------------------------------ */

export function Card({
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
    <section className={cn('studio-card', className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--line-soft)] px-5 py-4 sm:px-6">
          <div className="min-w-0">
            {title && <h2 className="text-[15px] font-semibold tracking-[-0.01em]">{title}</h2>}
            {description && (
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--muted)]">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cn('p-5 sm:p-6', bodyClassName)}>{children}</div>
    </section>
  );
}

/** Transitional alias: screens not yet rebuilt still import Panel. */
export const Panel = Card;

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
    <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-2.5">{eyebrow}</div>}
        <h1 className="studio-display">{title}</h1>
        {description && (
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--muted)]">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

/* -- Controls ------------------------------------------------------------ */

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'accent' | 'default' | 'ghost' | 'danger';
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
      className={cn('studio-btn', `studio-btn-${variant}`, className)}
      {...rest}
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </button>
  );
});

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...rest }, ref) {
    return <input ref={ref} className={cn('studio-input', className)} {...rest} />;
  }
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...rest }, ref) {
  return <textarea ref={ref} className={cn('studio-input', className)} {...rest} />;
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
      {hint && <p className="-mt-1 text-[13px] leading-relaxed text-[var(--faint)]">{hint}</p>}
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
        // 44px touch target on the outer hit area, visual switch inside.
        'relative inline-flex h-[26px] w-[44px] shrink-0 items-center rounded-full transition-colors disabled:opacity-40',
        checked ? 'bg-[var(--ink-deep)]' : 'bg-[#d8d6d2]'
      )}
    >
      <span
        className={cn(
          'absolute h-[20px] w-[20px] rounded-full bg-white shadow-sm transition-all',
          checked ? 'left-[21px]' : 'left-[3px]'
        )}
      />
    </button>
  );
}

/* -- Tag input ----------------------------------------------------------- */

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
    if (!value || full || values.includes(value)) return setDraft('');
    onChange([...values, value]);
    setDraft('');
  };

  return (
    <div className="space-y-2.5">
      {values.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <li
              key={`${value}-${index}`}
              className="flex items-center gap-1.5 rounded-full bg-[var(--sunken)] py-1.5 pl-3.5 pr-1.5 text-[13px]"
            >
              {value}
              <button
                type="button"
                aria-label={`Remove ${value}`}
                onClick={() => onChange(values.filter((_, i) => i !== index))}
                className="grid h-5 w-5 place-items-center rounded-full text-[var(--faint)] transition-colors hover:bg-white hover:text-[var(--danger)]"
              >
                <X size={12} />
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
          <Plus size={15} />
          <span className="sr-only sm:not-sr-only">Add</span>
        </Button>
      </div>
    </div>
  );
}

/* -- Status -------------------------------------------------------------- */

type Tone = 'neutral' | 'ok' | 'warn' | 'danger' | 'accent';

const TONE: Record<Tone, string> = {
  neutral: 'bg-[var(--sunken)] text-[var(--muted)]',
  ok: 'bg-[#0f7b52]/10 text-[var(--ok)]',
  warn: 'bg-[#a26a12]/10 text-[var(--warn)]',
  danger: 'bg-[#b4252c]/10 text-[var(--danger)]',
  accent: 'bg-[var(--accent-soft)] text-[var(--accent)]',
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
  return <span className={cn('studio-pill', TONE[tone], className)}>{children}</span>;
}

export function Dot({ tone = 'neutral' }: { tone?: Tone }) {
  const bg: Record<Tone, string> = {
    neutral: 'bg-[var(--faint)]',
    ok: 'bg-[var(--ok)]',
    warn: 'bg-[var(--warn)]',
    danger: 'bg-[var(--danger)]',
    accent: 'bg-[var(--accent)]',
  };
  return <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', bg[tone])} />;
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
    <div className="flex flex-col items-center justify-center gap-3 rounded-[var(--r-card)] bg-[var(--sunken)] px-6 py-14 text-center">
      {icon && <div className="text-[var(--faint)]">{icon}</div>}
      <div>
        <p className="text-[15px] font-medium">{title}</p>
        {description && (
          <p className="mx-auto mt-1.5 max-w-sm text-[13px] leading-relaxed text-[var(--muted)]">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

/* -- Save bar ------------------------------------------------------------
 * The single place an editor reports state, so "did that save?" is never a
 * guess. On mobile it is a floating pill above the bottom nav.
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
    <div className="pointer-events-none sticky bottom-4 z-30 mt-6 flex justify-center px-2 pb-20 md:pb-0">
      <div className="studio-card pointer-events-auto flex w-full max-w-2xl flex-wrap items-center justify-between gap-3 px-4 py-3 shadow-[var(--lift-lg)]">
        <div className="flex min-w-0 items-center gap-2.5">
          {state.status === 'error' ? (
            <>
              <Dot tone="danger" />
              <span className="text-[13px] text-[var(--danger)]">{state.message}</span>
            </>
          ) : saving ? (
            <>
              <Loader2 size={13} className="animate-spin text-[var(--faint)]" />
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
                Published{' '}
                {state.savedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
