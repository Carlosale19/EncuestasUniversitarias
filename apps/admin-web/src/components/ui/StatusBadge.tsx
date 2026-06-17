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
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]',
        active ? 'bg-red-100 text-red-700' : 'bg-slate-200 text-slate-700',
      )}
    >
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
