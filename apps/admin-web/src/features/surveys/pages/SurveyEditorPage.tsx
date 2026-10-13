import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, ClipboardPlus, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Panel } from '@/components/ui/Panel';
import { apiFetch } from '@/lib/api';
import type { QuestionType, SurveyDetailDto, UniversityRouteDto } from '@/types/api';
import { QuestionBuilder, type QuestionForm } from '../components/QuestionBuilder';

type SurveyForm = {
  routeId: string;
  titulo: string;
  descripcion: string;
  isActive: boolean;
  startsAt: string;
  endsAt: string;
};

const initialSurveyForm: SurveyForm = {
  routeId: '',
  titulo: '',
  descripcion: '',
  isActive: false,
  startsAt: '',
  endsAt: '',
};

function createEmptyQuestion(type: QuestionType = 'SHORT_TEXT', order = 1): QuestionForm {
  return {
    localId: crypto.randomUUID(),
    titulo: '',
    descripcion: '',
    tipo: type,
    requerida: true,
    orden: order,
    options: [],
  };
}

export function SurveyEditorPage() {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SurveyForm>(initialSurveyForm);
  const [questions, setQuestions] = useState<QuestionForm[]>([createEmptyQuestion()]);

  const routesQuery = useQuery({
    queryKey: ['routes'],
    queryFn: () => apiFetch<UniversityRouteDto[]>('/university-routes'),
  });

  const surveyQuery = useQuery({
    queryKey: ['survey', surveyId],
    queryFn: () => apiFetch<SurveyDetailDto>(`/surveys/${surveyId}`),
    enabled: Boolean(surveyId),
  });

  useEffect(() => {
    if (!surveyQuery.data) {
      return;
    }

    setForm({
      routeId: surveyQuery.data.route?.id ?? '',
      titulo: surveyQuery.data.titulo,
      descripcion: surveyQuery.data.descripcion ?? '',
      isActive: surveyQuery.data.isActive,
      startsAt: surveyQuery.data.startsAt?.slice(0, 16) ?? '',
      endsAt: surveyQuery.data.endsAt?.slice(0, 16) ?? '',
    });
    setQuestions(
      surveyQuery.data.questions.map((question, index) => ({
        localId: question.id,
        titulo: question.titulo,
        descripcion: question.descripcion ?? '',
        tipo: question.tipo,
        requerida: question.requerida,
        orden: index + 1,
        options: question.options.map((option, optionIndex) => ({
          localId: option.id,
          etiqueta: option.etiqueta,
          valor: option.valor,
          orden: optionIndex + 1,
        })),
      })),
    );
  }, [surveyQuery.data]);

  const saveMutation = useMutation({
    mutationFn: () =>
      apiFetch(surveyId ? `/surveys/${surveyId}` : '/surveys', {
        method: surveyId ? 'PATCH' : 'POST',
        body: JSON.stringify({
          routeId: form.routeId,
          titulo: form.titulo,
          descripcion: form.descripcion,
          isActive: form.isActive,
          startsAt: form.startsAt || undefined,
          endsAt: form.endsAt || undefined,
          questions: questions.map((question, index) => ({
            titulo: question.titulo,
            descripcion: question.descripcion,
            tipo: question.tipo,
            requerida: question.requerida,
            orden: index + 1,
            options: question.options.map((option, optionIndex) => ({
              etiqueta: option.etiqueta,
              valor: option.valor,
              orden: optionIndex + 1,
            })),
          })),
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveys'] });
      navigate('/encuestas');
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/encuestas"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a Encuestas
        </Link>
        <button
          type="button"
          onClick={() =>
            setQuestions((prev) => [
              ...prev,
              createEmptyQuestion('SHORT_TEXT', prev.length + 1),
            ])
          }
          className="inline-flex items-center gap-2 rounded-xl border border-unisinu-red bg-red-50/50 px-3.5 py-2 text-xs sm:text-sm font-semibold text-unisinu-red hover:bg-unisinu-red hover:text-white transition"
        >
          <PlusCircle className="h-4 w-4" />
          Agregar Pregunta
        </button>
      </div>

      <Panel
        title={surveyId ? 'Editar Encuesta' : 'Nueva Encuesta'}
        subtitle="Configura ruta institucional, vigencia temporal y preguntas dinámicas"
        actions={
          <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 border border-red-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-unisinu-red">
            <ClipboardPlus className="h-3.5 w-3.5" />
            Formulario Dinámico
          </div>
        }
      >
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            saveMutation.mutate();
          }}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                Ruta Universitaria Asociada *
              </label>
              <select
                required
                value={form.routeId}
                onChange={(event) => setForm((prev) => ({ ...prev, routeId: event.target.value }))}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
              >
                <option value="">Selecciona una ruta</option>
                {routesQuery.data?.map((route) => (
                  <option key={route.id} value={route.id}>
                    {route.nombreRuta}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                Título de la Encuesta *
              </label>
              <input
                required
                value={form.titulo}
                onChange={(event) => setForm((prev) => ({ ...prev, titulo: event.target.value }))}
                placeholder="Ej. Evaluación de Rutas Universitarias 2026-II"
                className="mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
              Descripción o Instrucciones para el Estudiante
            </label>
            <textarea
              value={form.descripcion}
              onChange={(event) => setForm((prev) => ({ ...prev, descripcion: event.target.value }))}
              placeholder="Explica el objetivo de la encuesta..."
              className="mt-1.5 min-h-24 w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">Fecha y Hora de Inicio</label>
              <input
                type="datetime-local"
                value={form.startsAt}
                onChange={(event) => setForm((prev) => ({ ...prev, startsAt: event.target.value }))}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">Fecha y Hora de Cierre</label>
              <input
                type="datetime-local"
                value={form.endsAt}
                onChange={(event) => setForm((prev) => ({ ...prev, endsAt: event.target.value }))}
                className="mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
              />
            </div>
          </div>

          <label className="inline-flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-100/80 transition">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
              className="h-4 w-4 rounded accent-unisinu-red"
            />
            Activar encuesta inmediatamente al guardar
          </label>

          <QuestionBuilder
            questions={questions}
            onChange={(nextQuestions) =>
              setQuestions(nextQuestions.map((question, index) => ({ ...question, orden: index + 1 })))
            }
          />

          {saveMutation.error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-unisinu-red">
              {saveMutation.error.message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="w-full rounded-xl bg-unisinu-red px-4 py-3 text-sm font-semibold text-white shadow-md shadow-red-600/20 transition hover:bg-unisinu-red-hover disabled:opacity-60"
          >
            {saveMutation.isPending ? 'Guardando encuesta...' : 'Guardar y Publicar Encuesta'}
          </button>
        </form>
      </Panel>
    </div>
  );
}
