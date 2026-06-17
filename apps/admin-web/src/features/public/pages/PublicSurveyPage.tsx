import { useMutation, useQuery } from '@tanstack/react-query';
import { BusFront, CheckCircle2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { apiFetch } from '@/lib/api';
import { questionTypeLabel } from '@/lib/utils';
import type { PublicSurveyDto } from '@/types/api';

type AnswersState = Record<
  string,
  {
    valueText?: string;
    valueNumber?: number;
    selectedOptionIds?: string[];
  }
>;

export function PublicSurveyPage() {
  const { publicSlug = '' } = useParams();
  const [studentCode, setStudentCode] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [answers, setAnswers] = useState<AnswersState>({});

  const surveyQuery = useQuery({
    queryKey: ['public-survey', publicSlug],
    queryFn: () => apiFetch<PublicSurveyDto>(`/public/surveys/${publicSlug}`),
  });

  const submitMutation = useMutation({
    mutationFn: () =>
      apiFetch(`/public/surveys/${publicSlug}/responses`, {
        method: 'POST',
        body: JSON.stringify({
          studentCode,
          studentName,
          studentEmail,
          answers: Object.entries(answers).map(([questionId, answer]) => ({
            questionId,
            ...answer,
          })),
        }),
      }),
  });

  const questionList = useMemo(() => surveyQuery.data?.questions ?? [], [surveyQuery.data]);

  if (submitMutation.isSuccess) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#1a0000_0%,#320000_45%,#ffffff_100%)] px-4 py-10">
        <div className="mx-auto max-w-xl rounded-[32px] border border-red-200 bg-white p-8 text-center shadow-2xl">
          <CheckCircle2 className="mx-auto h-16 w-16 text-red-700" />
          <h1 className="mt-6 text-3xl font-semibold text-black">Respuesta enviada</h1>
          <p className="mt-3 text-slate-600">
            Gracias por compartir tu experiencia. Tu informacion ya fue registrada correctamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#1a0000_0%,#320000_35%,#f8fafc_100%)] px-4 py-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="rounded-[32px] bg-black px-6 py-8 text-white shadow-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-700/15 px-4 py-2 text-xs uppercase tracking-[0.24em] text-red-200">
            <BusFront className="h-4 w-4" />
            Encuesta de movilidad
          </div>
          <h1 className="mt-5 text-3xl font-semibold">{surveyQuery.data?.titulo ?? 'Cargando encuesta...'}</h1>
          <p className="mt-3 text-slate-300">{surveyQuery.data?.descripcion}</p>
          <div className="mt-5 rounded-[24px] border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
            <p><strong>Ruta:</strong> {surveyQuery.data?.route.nombreRuta}</p>
            <p className="mt-2">{surveyQuery.data?.route.descripcion}</p>
          </div>
        </section>

        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            submitMutation.mutate();
          }}
        >
          <section className="rounded-[32px] border border-red-100 bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-black">Datos del estudiante</h2>
            <p className="mt-2 text-sm text-slate-500">Los campos Codigo, Nombre y Correo son obligatorios.</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <input
                placeholder="Codigo"
                value={studentCode}
                required
                onChange={(event) => setStudentCode(event.target.value)}
                className="rounded-2xl border border-red-100 bg-white px-4 py-3 outline-none transition focus:border-red-500"
              />
              <input
                placeholder="Nombre"
                value={studentName}
                required
                onChange={(event) => setStudentName(event.target.value)}
                className="rounded-2xl border border-red-100 bg-white px-4 py-3 outline-none transition focus:border-red-500"
              />
              <input
                placeholder="Correo"
                type="email"
                value={studentEmail}
                required
                onChange={(event) => setStudentEmail(event.target.value)}
                className="rounded-2xl border border-red-100 bg-white px-4 py-3 outline-none transition focus:border-red-500"
              />
            </div>
          </section>

          {questionList.map((question, index) => (
            <section key={question.id} className="rounded-[32px] border border-red-100 bg-white p-6 shadow-xl">
              <p className="text-xs uppercase tracking-[0.24em] text-red-700">Pregunta {index + 1}</p>
              <h2 className="mt-2 text-lg font-semibold text-black">{question.titulo}</h2>
              <p className="mt-1 text-sm text-slate-500">{questionTypeLabel(question.tipo)}</p>
              {question.descripcion ? <p className="mt-3 text-sm text-slate-600">{question.descripcion}</p> : null}

              <div className="mt-5">
                {question.tipo === 'SHORT_TEXT' || question.tipo === 'LONG_TEXT' ? (
                  <textarea
                    value={answers[question.id]?.valueText ?? ''}
                    required={question.requerida}
                    onChange={(event) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.id]: { ...prev[question.id], valueText: event.target.value },
                      }))
                    }
                    className="min-h-28 w-full rounded-2xl border border-red-100 bg-white px-4 py-3 outline-none transition focus:border-red-500"
                  />
                ) : null}

                {question.tipo === 'NUMBER' || question.tipo === 'RATING' ? (
                  <input
                    type="number"
                    min={question.tipo === 'RATING' ? 1 : undefined}
                    max={question.tipo === 'RATING' ? 5 : undefined}
                    required={question.requerida}
                    value={answers[question.id]?.valueNumber ?? ''}
                    onChange={(event) =>
                      setAnswers((prev) => ({
                        ...prev,
                        [question.id]: {
                          ...prev[question.id],
                          valueNumber: Number(event.target.value),
                        },
                      }))
                    }
                    className="w-full rounded-2xl border border-red-100 bg-white px-4 py-3 outline-none transition focus:border-red-500"
                  />
                ) : null}

                {question.tipo === 'SINGLE_CHOICE' ? (
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <label key={option.id} className="flex items-center gap-3 rounded-2xl border border-red-100 bg-white px-4 py-3">
                        <input
                          type="radio"
                          name={question.id}
                          checked={answers[question.id]?.selectedOptionIds?.[0] === option.id}
                          onChange={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [question.id]: { selectedOptionIds: [option.id] },
                            }))
                          }
                        />
                        <span>{option.etiqueta}</span>
                      </label>
                    ))}
                  </div>
                ) : null}

                {question.tipo === 'MULTIPLE_CHOICE' ? (
                  <div className="space-y-3">
                    {question.options.map((option) => {
                      const selected = answers[question.id]?.selectedOptionIds ?? [];
                      const checked = selected.includes(option.id);

                      return (
                        <label key={option.id} className="flex items-center gap-3 rounded-2xl border border-red-100 bg-white px-4 py-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                [question.id]: {
                                  selectedOptionIds: checked
                                    ? selected.filter((item) => item !== option.id)
                                    : [...selected, option.id],
                                },
                              }))
                            }
                          />
                          <span>{option.etiqueta}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </section>
          ))}

          {submitMutation.error ? (
            <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {submitMutation.error.message}
            </p>
          ) : null}

          <button
            type="submit"
            className="sticky bottom-4 w-full rounded-2xl bg-red-700 px-4 py-4 text-base font-semibold text-white shadow-xl transition hover:bg-red-800"
          >
            {submitMutation.isPending ? 'Enviando...' : 'Enviar respuestas'}
          </button>
        </form>
      </div>
    </div>
  );
}
