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

const palette = ['#000000', '#991b1b', '#dc2626', '#fecaca', '#450a0a', '#7f1d1d'];

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
        title="Resultados y analitica"
        subtitle="Explora estadisticas por encuesta y respuestas individuales"
        actions={
          resultsQuery.data ? (
            <button
              type="button"
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-2xl bg-red-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
            >
              <Download className="h-4 w-4" />
              Exportar CSV
            </button>
          ) : null
        }
      >
        <div className="grid gap-4 md:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
          <div className="rounded-[24px] border border-red-100 bg-slate-50 p-5">
            <label className="text-sm font-medium text-slate-700">Selecciona una encuesta</label>
            <select
              value={surveyId}
              onChange={(event) => setSelectedSurveyId(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-red-100 bg-white px-4 py-3 outline-none focus:border-red-600"
            >
              {surveysQuery.data?.map((survey) => (
                <option key={survey.id} value={survey.id}>
                  {survey.titulo}
                </option>
              ))}
            </select>

            {resultsQuery.data ? (
              <div className="mt-5 space-y-3 text-sm text-slate-600">
                <StatusBadge active={resultsQuery.data.survey.isActive} />
                <p><strong>Ruta:</strong> {resultsQuery.data.survey.routeName}</p>
                <p><strong>Respuestas:</strong> {resultsQuery.data.survey.responsesCount}</p>
                <p><strong>Slug:</strong> {resultsQuery.data.survey.publicSlug}</p>
              </div>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Panel className="md:col-span-1">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Preguntas</p>
              <p className="mt-3 text-4xl font-semibold text-slate-950">
                {resultsQuery.data?.analytics.length ?? 0}
              </p>
            </Panel>
            <Panel className="md:col-span-1">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Respuestas</p>
              <p className="mt-3 text-4xl font-semibold text-slate-950">
                {resultsQuery.data?.survey.responsesCount ?? 0}
              </p>
            </Panel>
            <Panel className="md:col-span-1">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Activa</p>
              <p className="mt-3 text-4xl font-semibold text-slate-950">
                {resultsQuery.data?.survey.isActive ? 'Si' : 'No'}
              </p>
            </Panel>
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
