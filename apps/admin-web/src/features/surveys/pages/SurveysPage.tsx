import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ExternalLink, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { EmptyState } from '@/components/ui/EmptyState';
import { Panel } from '@/components/ui/Panel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { apiFetch } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import type { SurveySummaryDto } from '@/types/api';

export function SurveysPage() {
  const queryClient = useQueryClient();

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

  return (
    <div className="space-y-6">
      <Panel
        title="Encuestas"
        subtitle="Gestiona formularios, estado de publicacion y enlace publico por ruta"
        actions={
          <Link
            to="/encuestas/nueva"
            className="inline-flex items-center gap-2 rounded-2xl bg-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
          >
            <PlusCircle className="h-4 w-4" />
            Nueva encuesta
          </Link>
        }
      >
        {(surveysQuery.data ?? []).length === 0 ? (
          <EmptyState
            title="Todavia no existen encuestas"
            description="Crea la primera encuesta para una ruta y comparte su enlace publico."
          />
        ) : (
          <div className="grid gap-4">
            {surveysQuery.data?.map((survey) => (
              <article
                key={survey.id}
                className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-slate-950">{survey.titulo}</h2>
                      <StatusBadge active={survey.isActive} />
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{survey.descripcion || 'Sin descripcion'}</p>
                    <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span>Ruta: {survey.route?.nombreRuta ?? 'Sin ruta'}</span>
                      <span>{survey.questionsCount} preguntas</span>
                      <span>{survey.responsesCount} respuestas</span>
                      <span>Creada: {formatDate(survey.createdAt)}</span>
                    </div>
                    <a
                      href={`/encuesta/${survey.publicSlug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-red-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                      /encuesta/{survey.publicSlug}
                    </a>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/encuestas/${survey.id}/editar`}
                      className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
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
                      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700"
                    >
                      {survey.isActive ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteMutation.mutate(survey.id)}
                      className="rounded-xl bg-rose-600 px-4 py-2 text-sm text-white"
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
