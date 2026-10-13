import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, Check, ExternalLink, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '@/components/ui/EmptyState';
import { Panel } from '@/components/ui/Panel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { apiFetch } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { SurveySummaryDto } from '@/types/api';

export function SurveysPage() {
  const queryClient = useQueryClient();
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const surveysQuery = useQuery({
    queryKey: ['surveys'],
    queryFn: () => apiFetch<SurveySummaryDto[]>('/surveys'),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiFetch(`/surveys/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['surveys'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiFetch(`/surveys/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['surveys'] }),
  });

  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/encuesta/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Panel
        title="Encuestas de Movilidad"
        subtitle="Formularios por ruta, publicación y recopilación de respuestas"
        actions={
          <Link
            to="/encuestas/nueva"
            className="inline-flex items-center gap-2 rounded-xl bg-unisinu-red px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-red-600/20 transition hover:bg-unisinu-red-hover"
          >
            <PlusCircle className="h-4 w-4" />
            Nueva Encuesta
          </Link>
        }
      >
        {surveysQuery.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : (surveysQuery.data ?? []).length === 0 ? (
          <EmptyState
            title="Todavía no existen encuestas"
            description="Crea la primera encuesta para una ruta y comparte el enlace público con los estudiantes."
          />
        ) : (
          <div className="space-y-4">
            {surveysQuery.data?.map((survey) => (
              <article
                key={survey.id}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-red-200 hover:shadow-md hover:shadow-red-950/5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h2 className="text-base font-bold text-slate-900 group-hover:text-unisinu-red transition">
                        {survey.titulo}
                      </h2>
                      <StatusBadge active={survey.isActive} />
                    </div>
                    <p className="mt-1 text-xs sm:text-sm text-slate-600">
                      {survey.descripcion || 'Sin descripción adicional'}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="font-medium text-slate-700">
                        Ruta: {survey.route?.nombreRuta ?? 'Sin ruta vinculada'}
                      </span>
                      <span>·</span>
                      <span>{survey.questionsCount} preguntas</span>
                      <span>·</span>
                      <span>{survey.responsesCount} respuestas</span>
                      <span>·</span>
                      <span>Creada: {formatDate(survey.createdAt)}</span>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <a
                        href={`/encuesta/${survey.publicSlug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-unisinu-red hover:bg-red-100 transition"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Abrir encuesta
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyLink(survey.publicSlug)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
                      >
                        {copiedSlug === survey.publicSlug ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                            <span className="text-emerald-600">Copiado</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            Copiar enlace
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                    <Link
                      to={`/encuestas/${survey.id}/editar`}
                      className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      onClick={() =>
                        statusMutation.mutate({
                          id: survey.id,
                          isActive: !survey.isActive,
                        })
                      }
                      className="rounded-xl border border-red-200 bg-red-50/50 px-3.5 py-2 text-xs font-semibold text-unisinu-red transition hover:bg-unisinu-red hover:text-white"
                    >
                      {survey.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`¿Estás seguro de eliminar la encuesta "${survey.titulo}"?`)) {
                          deleteMutation.mutate(survey.id);
                        }
                      }}
                      className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </Panel>
    </div>
  );
}
