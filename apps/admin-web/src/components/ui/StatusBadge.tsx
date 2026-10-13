import { cn } from '@/lib/utils';

type StatusBadgeProps = {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
};

export function StatusBadge({
  active,
  activeLabel = 'Activo',
  inactiveLabel = 'Inactivo',
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider',
        active
          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
          : 'bg-slate-100 text-slate-600 border border-slate-200',
      )}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
