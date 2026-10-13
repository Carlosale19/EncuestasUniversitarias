import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EmptyState } from '@/components/ui/EmptyState';
import { Panel } from '@/components/ui/Panel';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { apiFetch } from '@/lib/api';
import { formatDate, questionTypeLabel } from '@/lib/utils';
import type { DashboardResultsDto, SurveySummaryDto } from '@/types/api';

const palette = ['#e42313', '#ffb606', '#1a202c', '#4caf50', '#c51d0f', '#0284c7'];

function escapeCsvValue(value: string | number | null | undefined) {
  const normalized = String(value ?? '');
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}

export function ResultsPage() {
  const [selectedSurveyId, setSelectedSurveyId] = useState<string>('');

  const surveysQuery = useQuery({
    queryKey: ['surveys'],
    queryFn: () => apiFetch<SurveySummaryDto[]>('/surveys'),
  });

  const surveyId = selectedSurveyId || surveysQuery.data?.[0]?.id || '';

  const resultsQuery = useQuery({
    queryKey: ['results', surveyId],
    queryFn: () => apiFetch<DashboardResultsDto>(`/dashboard/surveys/${surveyId}/results`),
    enabled: Boolean(surveyId),
  });

  const choiceAnalytics = useMemo(
    () => resultsQuery.data?.analytics.filter((item) => item.options && item.options.length > 0) ?? [],
    [resultsQuery.data],
  );

  const numericAnalytics = useMemo(
    () => resultsQuery.data?.analytics.filter((item) => item.values && item.values.length > 0) ?? [],
    [resultsQuery.data],
  );

  const exportCsv = () => {
    if (!resultsQuery.data) {
      return;
    }

    const questionTitles = Array.from(
      new Set(
        resultsQuery.data.records.flatMap((record) =>
          record.answers.map((answer) => answer.questionTitle),
        ),
      ),
    );

    const header = ['Codigo', 'Nombre', 'Correo', 'Fecha envio', ...questionTitles];
    const rows = resultsQuery.data.records.map((record) => {
      const answersByTitle = new Map(record.answers.map((answer) => [answer.questionTitle, answer.value]));
      return [
        record.studentCode,
        record.studentName,
        record.studentEmail,
        formatDate(record.submittedAt),
        ...questionTitles.map((title) => answersByTitle.get(title) ?? ''),
      ];
    });

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => escapeCsvValue(cell)).join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${resultsQuery.data.survey.publicSlug}-resultados.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Panel
        title="Resultados y Analítica"
        subtitle="Métricas consolidadas, distribución de respuestas y registros por estudiante"
        actions={
          resultsQuery.data ? (
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-xl bg-unisinu-red px-4 py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm shadow-red-600/20 transition hover:bg-unisinu-red-hover"
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </button>
          ) : null
        }
      >
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Seleccionar Encuesta
            </label>
            <select
              value={surveyId}
              onChange={(event) => setSelectedSurveyId(event.target.value)}
              className="mt-2 w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
            >
              {surveysQuery.data?.map((survey) => (
                <option key={survey.id} value={survey.id}>
                  {survey.titulo}
                </option>
              ))}
            </select>

            {resultsQuery.data ? (
              <div className="mt-4 space-y-2.5 border-t border-slate-200/60 pt-4 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">Estado:</span>
                  <StatusBadge active={resultsQuery.data.survey.isActive} />
                </div>
                <p>
                  <strong className="text-slate-800">Ruta:</strong> {resultsQuery.data.survey.routeName}
                </p>
                <p>
                  <strong className="text-slate-800">Total respuestas:</strong>{' '}
                  <span className="font-bold text-unisinu-red">
                    {resultsQuery.data.survey.responsesCount}
                  </span>
                </p>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Preguntas</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {resultsQuery.data?.analytics.length ?? 0}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Respuestas</p>
              <p className="mt-2 text-3xl font-extrabold text-unisinu-red">
                {resultsQuery.data?.survey.responsesCount ?? 0}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Publicada</p>
              <p className="mt-2 text-3xl font-extrabold text-slate-900">
                {resultsQuery.data?.survey.isActive ? 'Sí' : 'No'}
              </p>
            </div>
          </div>
        </div>
      </Panel>

      {resultsQuery.data ? (
        <div className="grid gap-6">
          {choiceAnalytics.map((item) => (
            <Panel key={item.questionId} title={item.title} subtitle={questionTypeLabel(item.type)}>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={item.options}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="label" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" radius={[12, 12, 0, 0]}>
                        {item.options?.map((entry, index) => (
                          <Cell key={entry.optionId} fill={palette[index % palette.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={item.options} dataKey="count" nameKey="label" innerRadius={60} outerRadius={100}>
                        {item.options?.map((entry, index) => (
                          <Cell key={entry.optionId} fill={palette[index % palette.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Panel>
          ))}

          {numericAnalytics.map((item) => (
            <Panel key={item.questionId} title={item.title} subtitle={`Promedio: ${item.average ?? 0}`}>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={(item.values ?? []).map((value, index) => ({
                      index: `R${index + 1}`,
                      value,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="index" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#991b1b" radius={[10, 10, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Panel>
          ))}

          <Panel title="Registros individuales" subtitle="Detalle de cada estudiante que completo la encuesta">
            {resultsQuery.data.records.length === 0 ? (
              <EmptyState
                title="Aun no hay respuestas"
                description="Comparte el enlace publico de la encuesta para comenzar a recolectar respuestas."
              />
            ) : (
              <div className="space-y-4">
                {resultsQuery.data.records.map((record) => (
                  <article key={record.id} className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
                    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">{record.studentName || 'Sin nombre'}</h3>
                        <p className="text-sm text-red-700">Codigo: {record.studentCode || 'Sin codigo'}</p>
                        <p className="text-sm text-slate-500">{record.studentEmail || 'Sin correo'}</p>
                      </div>
                      <p className="text-sm text-slate-500">{formatDate(record.submittedAt)}</p>
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                      {record.answers.map((answer) => (
                        <div key={`${record.id}-${answer.questionId}`} className="rounded-2xl bg-white p-4">
                          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">{answer.questionTitle}</p>
                          <p className="mt-2 text-sm text-slate-900">{String(answer.value) || 'Sin respuesta'}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </Panel>
        </div>
      ) : (
        <EmptyState
          title="Selecciona una encuesta"
          description="Elige una encuesta para cargar estadisticas y respuestas."
        />
      )}
    </div>
  );
}
