import type { PropsWithChildren, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type PanelProps = PropsWithChildren<{
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
}>;

export function Panel({ title, subtitle, actions, className, children }: PanelProps) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm shadow-slate-200/50 transition',
        className,
      )}
    >
      {(title || subtitle || actions) && (
        <header className="mb-5 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {title ? (
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900">
                {title}
              </h2>
            ) : null}
            {subtitle ? <p className="mt-0.5 text-xs sm:text-sm text-slate-600">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
        </header>
      )}
      {children}
    </section>
  );
}
