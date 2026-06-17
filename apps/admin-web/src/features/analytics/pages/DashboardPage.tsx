import { useQuery } from '@tanstack/react-query';
import { Activity, ClipboardList, MessageSquare, RadioTower } from 'lucide-react';
import { Panel } from '@/components/ui/Panel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { apiFetch } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { DashboardOverviewDto } from '@/types/api';

const statCards = [
  { key: 'totalSurveys', label: 'Encuestas', icon: ClipboardList },
  { key: 'activeSurveys', label: 'Activas', icon: RadioTower },
  { key: 'totalResponses', label: 'Respuestas', icon: MessageSquare },
] as const;

export function DashboardPage() {
  const overviewQuery = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => apiFetch<DashboardOverviewDto>('/dashboard/overview'),
  });

  const overview = overviewQuery.data;

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] bg-black p-8 text-white shadow-2xl">
        <p className="text-xs uppercase tracking-[0.28em] text-red-200">Dashboard</p>
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Monitorea la experiencia de las rutas universitarias</h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-300">
              Revisa actividad reciente, encuestas activas y volumen de respuestas antes de entrar al detalle analitico.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-red-700/15 px-4 py-2 text-sm text-red-200">
            <Activity className="h-4 w-4" />
            Actualizacion centralizada
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Panel key={card.key} className="overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{card.label}</p>
                  <p className="mt-3 text-4xl font-semibold text-slate-950">
                    {overview ? overview[card.key] : '--'}
                  </p>
                </div>
                <div className="rounded-2xl bg-red-50 p-3 text-red-700">
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Panel>
          );
        })}
      </div>

      <Panel
        title="Encuestas recientes"
        subtitle="Resumen operativo por ruta y disponibilidad publica"
      >
        {overviewQuery.isLoading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-[24px] bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {overview?.surveys.map((survey) => (
              <article
                key={survey.id}
                className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-slate-900">{survey.titulo}</h2>
                    <p className="mt-1 text-sm text-slate-500">{survey.routeName}</p>
                  </div>
                  <StatusBadge active={survey.isActive} />
                </div>
                <div className="mt-5 flex items-center justify-between text-sm text-slate-600">
                  <span>{survey.responsesCount} respuestas</span>
                  <span>{formatDate(survey.createdAt)}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
