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
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Link>
        <button
          type="button"
          onClick={() =>
            setQuestions((prev) => [
              ...prev,
              createEmptyQuestion('SHORT_TEXT', prev.length + 1),
            ])
          }
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white"
        >
          <PlusCircle className="h-4 w-4" />
          Agregar pregunta
        </button>
      </div>

      <Panel
        title={surveyId ? 'Editar encuesta' : 'Nueva encuesta'}
        subtitle="Configura ruta, vigencia, estado y formulario dinamico"
        actions={
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm text-red-700">
            <ClipboardPlus className="h-4 w-4" />
            Constructor flexible
          </div>
        }
      >
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            saveMutation.mutate();
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <select
              value={form.routeId}
              onChange={(event) => setForm((prev) => ({ ...prev, routeId: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <option value="">Selecciona una ruta</option>
              {routesQuery.data?.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.nombreRuta}
                </option>
              ))}
            </select>
            <input
              value={form.titulo}
              onChange={(event) => setForm((prev) => ({ ...prev, titulo: event.target.value }))}
              placeholder="Titulo de la encuesta"
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
          </div>

          <textarea
            value={form.descripcion}
            onChange={(event) => setForm((prev) => ({ ...prev, descripcion: event.target.value }))}
            placeholder="Descripcion"
            className="min-h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              type="datetime-local"
              value={form.startsAt}
              onChange={(event) => setForm((prev) => ({ ...prev, startsAt: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
            <input
              type="datetime-local"
              value={form.endsAt}
              onChange={(event) => setForm((prev) => ({ ...prev, endsAt: event.target.value }))}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
          </div>

          <label className="inline-flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) => setForm((prev) => ({ ...prev, isActive: event.target.checked }))}
            />
            Activar encuesta al guardar
          </label>

          <QuestionBuilder
            questions={questions}
            onChange={(nextQuestions) =>
              setQuestions(nextQuestions.map((question, index) => ({ ...question, orden: index + 1 })))
            }
          />

          {saveMutation.error ? (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {saveMutation.error.message}
            </p>
          ) : null}

          <button
            type="submit"
            className="w-full rounded-2xl bg-slate-950 px-4 py-3 font-semibold text-white"
          >
            {saveMutation.isPending ? 'Guardando...' : 'Guardar encuesta'}
          </button>
        </form>
      </Panel>
    </div>
  );
}
