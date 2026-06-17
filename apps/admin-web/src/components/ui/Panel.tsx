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
        'rounded-[28px] border border-red-100 bg-white/95 p-6 shadow-[0_20px_60px_-32px_rgba(127,29,29,0.28)] backdrop-blur',
        className,
      )}
    >
      {(title || subtitle || actions) && (
        <header className="mb-5 flex flex-col gap-4 border-b border-red-50 pb-5 md:flex-row md:items-start md:justify-between">
          <div>
            {title ? <h2 className="text-lg font-semibold text-slate-900">{title}</h2> : null}
            {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
          </div>
          {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
        </header>
      )}
      {children}
    </section>
  );
}
