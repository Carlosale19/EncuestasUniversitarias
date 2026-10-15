import { useQuery } from '@tanstack/react-query';
import { Activity, ClipboardList, MessageSquare, RadioTower, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Panel } from '@/components/ui/Panel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { apiFetch } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { DashboardOverviewDto } from '@/types/api';

const statCards = [
  { key: 'totalSurveys', label: 'Total Encuestas', icon: ClipboardList, color: 'text-[#e42313] bg-red-50 border border-red-100' },
  { key: 'activeSurveys', label: 'Encuestas Activas', icon: RadioTower, color: 'text-emerald-700 bg-emerald-50 border border-emerald-100' },
  { key: 'totalResponses', label: 'Respuestas Registradas', icon: MessageSquare, color: 'text-amber-700 bg-amber-50 border border-amber-100' },
] as const;

export function DashboardPage() {
  const overviewQuery = useQuery({
    queryKey: ['dashboard-overview'],
    queryFn: () => apiFetch<DashboardOverviewDto>('/dashboard/overview'),
  });

  const overview = overviewQuery.data;

  return (
    <div className="space-y-6">
      {/* Banner de bienvenida institucional */}
      <div className="relative overflow-hidden rounded-3xl bg-[#1a202c] p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-[#e42313]/15 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#ffb606]">
              <Sparkles className="h-3.5 w-3.5 text-[#ffb606]" />
              Panel de Control · Unisinú Cartagena
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Monitoreo de Rutas y Transporte
            </h1>
            <p className="mt-1.5 max-w-2xl text-xs sm:text-sm text-slate-300">
              Analítica de satisfacción estudiantil, seguimiento a recorridos y volumen de participación activa.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-medium text-slate-200 backdrop-blur-sm md:self-auto">
            <Activity className="h-4 w-4 text-[#ffb606]" />
            Datos en tiempo real
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas responsive */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Panel key={card.key} className="relative overflow-hidden border border-slate-200 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600">{card.label}</p>
                  <p className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900">
                    {overview ? overview[card.key] : '--'}
                  </p>
                </div>
                <div className={`rounded-2xl p-3.5 ${card.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Panel>
          );
        })}
      </div>

      {/* Listado de encuestas recientes */}
      <Panel
        title="Encuestas Recientes"
        subtitle="Disponibilidad por ruta universitaria y nivel de respuesta"
      >
        {overviewQuery.isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : overview?.surveys.length === 0 ? (
          <div className="py-8 text-center text-sm text-slate-500">
            No hay encuestas registradas actualmente.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {overview?.surveys.map((survey) => (
              <Link
                key={survey.id}
                to={`/resultados?surveyId=${survey.id}`}
                className="group block rounded-2xl border border-slate-200/80 bg-white p-5 transition hover:border-red-200 hover:shadow-md hover:shadow-red-950/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-bold text-slate-900 group-hover:text-unisinu-red transition">
                      {survey.titulo}
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">{survey.routeName}</p>
                  </div>
                  <StatusBadge active={survey.isActive} />
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">
                    {survey.responsesCount} {survey.responsesCount === 1 ? 'respuesta' : 'respuestas'}
                  </span>
                  <span>{formatDate(survey.createdAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
