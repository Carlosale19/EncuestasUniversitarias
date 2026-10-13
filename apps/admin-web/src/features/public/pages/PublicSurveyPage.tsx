import { useMutation, useQuery } from '@tanstack/react-query';
import { Bus, CheckCircle2, Star } from 'lucide-react';
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
      <div className="flex min-h-screen flex-col justify-between bg-slate-50">
        <div className="h-2 w-full bg-unisinu-red" />
        <main className="flex flex-1 items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h1 className="mt-5 text-2xl font-bold text-slate-900">
              ¡Respuesta enviada con éxito!
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Gracias por tu participación. Tu evaluación contribuye a mejorar el servicio de movilidad y transporte de la Universidad del Sinú Seccional Cartagena.
            </p>
          </div>
        </main>
        <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
          Universidad del Sinú Elías Bechara Zainúm · Seccional Cartagena
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900">
      {/* Franja roja institucional */}
      <div className="h-2 w-full bg-unisinu-red" />

      {/* Header público con logotipo Unisinú */}
      <header className="border-b border-slate-200/80 bg-white px-4 py-3 sm:px-6 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <img
            src="/logo-unisinu-rojo.png"
            alt="Universidad del Sinú Seccional Cartagena"
            className="h-10 sm:h-12 w-auto object-contain"
          />
          <div className="hidden text-right text-xs text-slate-500 sm:block">
            <span className="font-semibold text-unisinu-red">Movilidad Estudiantil</span>
            <p className="text-[11px] text-slate-400">Seccional Cartagena</p>
          </div>
        </div>
      </header>

      {/* Formulario de encuesta */}
      <main className="mx-auto max-w-3xl px-4 py-6 sm:py-8">
        <div className="space-y-6">
          {/* Tarjeta de cabecera de la encuesta */}
          <section className="overflow-hidden rounded-3xl bg-unisinu-navy p-6 sm:p-8 text-white shadow-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-unisinu-gold">
              <Bus className="h-3.5 w-3.5" />
              Encuesta de Ruta Universitaria
            </div>
            <h1 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
              {surveyQuery.data?.titulo ?? 'Cargando encuesta...'}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-300">
              {surveyQuery.data?.descripcion}
            </p>
            {surveyQuery.data?.route ? (
              <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3.5 text-xs text-slate-200">
                <p className="font-bold text-unisinu-gold uppercase tracking-wider text-[11px]">
                  Ruta: {surveyQuery.data.route.nombreRuta}
                </p>
                {surveyQuery.data.route.descripcion ? (
                  <p className="mt-1 text-slate-300">{surveyQuery.data.route.descripcion}</p>
                ) : null}
              </div>
            ) : null}
          </section>

          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              submitMutation.mutate();
            }}
          >
            {/* Datos del estudiante */}
            <section className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-sm">
              <h2 className="text-base font-bold text-slate-900">
                Datos del Estudiante
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                Ingresa tu información académica para validar tu registro.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800">Código Estudiantil *</label>
                  <input
                    placeholder="Ej. 20261001"
                    value={studentCode}
                    required
                    onChange={(event) => setStudentCode(event.target.value)}
                    className="mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800">Nombre Completo *</label>
                  <input
                    placeholder="Ej. Ana Gómez"
                    value={studentName}
                    required
                    onChange={(event) => setStudentName(event.target.value)}
                    className="mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-800">Correo Institucional *</label>
                  <input
                    placeholder="estudiante@unisinu.edu.co"
                    type="email"
                    value={studentEmail}
                    required
                    onChange={(event) => setStudentEmail(event.target.value)}
                    className="mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
                  />
                </div>
              </div>
            </section>

            {/* Preguntas dinámicas */}
            {questionList.map((question, index) => (
              <section
                key={question.id}
                className="rounded-3xl border-2 border-slate-200 bg-white p-5 sm:p-7 shadow-sm transition hover:border-slate-300"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-unisinu-red">
                    Pregunta {index + 1} {question.requerida ? '· Obligatoria' : '· Opcional'}
                  </span>
                  <span className="text-[11px] font-medium text-slate-500">
                    {questionTypeLabel(question.tipo)}
                  </span>
                </div>

                <h2 className="mt-2 text-base font-bold text-slate-900">
                  {question.titulo}
                </h2>
                {question.descripcion ? (
                  <p className="mt-1 text-xs text-slate-600">{question.descripcion}</p>
                ) : null}

                <div className="mt-4">
                  {question.tipo === 'SHORT_TEXT' || question.tipo === 'LONG_TEXT' ? (
                    <textarea
                      placeholder="Escribe tu respuesta aquí..."
                      value={answers[question.id]?.valueText ?? ''}
                      required={question.requerida}
                      onChange={(event) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [question.id]: { ...prev[question.id], valueText: event.target.value },
                        }))
                      }
                      className="min-h-24 w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
                    />
                  ) : null}

                  {question.tipo === 'NUMBER' ? (
                    <input
                      type="number"
                      required={question.requerida}
                      placeholder="Ingresa un valor numérico"
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
                      className="w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
                    />
                  ) : null}

                  {question.tipo === 'RATING' ? (
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      {[1, 2, 3, 4, 5].map((val) => {
                        const isSelected = answers[question.id]?.valueNumber === val;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() =>
                              setAnswers((prev) => ({
                                ...prev,
                                [question.id]: {
                                  ...prev[question.id],
                                  valueNumber: val,
                                },
                              }))
                            }
                            className={`flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl border-2 text-sm font-bold transition ${
                              isSelected
                                ? 'border-unisinu-red bg-unisinu-red text-white shadow-md shadow-red-600/30'
                                : 'border-slate-300 bg-white text-slate-800 hover:border-slate-400 hover:bg-slate-50'
                            }`}
                          >
                            <span className="flex items-center gap-0.5">
                              {val}
                              <Star className={`h-3.5 w-3.5 ${isSelected ? 'fill-white' : 'fill-amber-400 text-amber-400'}`} />
                            </span>
                          </button>
                        );
                      })}
                      <span className="ml-2 text-xs font-medium text-slate-600">
                        {answers[question.id]?.valueNumber ? `(Calificación: ${answers[question.id]?.valueNumber}/5)` : '(1 = Muy bajo, 5 = Excelente)'}
                      </span>
                    </div>
                  ) : null}

                  {question.tipo === 'SINGLE_CHOICE' ? (
                    <div className="space-y-2">
                      {question.options.map((option) => (
                        <label
                          key={option.id}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-slate-300 bg-white px-4 py-3 transition hover:border-slate-400 hover:bg-slate-50"
                        >
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
                            className="h-4 w-4 accent-unisinu-red"
                          />
                          <span className="text-sm font-medium text-slate-900">{option.etiqueta}</span>
                        </label>
                      ))}
                    </div>
                  ) : null}

                  {question.tipo === 'MULTIPLE_CHOICE' ? (
                    <div className="space-y-2">
                      {question.options.map((option) => {
                        const selected = answers[question.id]?.selectedOptionIds ?? [];
                        const checked = selected.includes(option.id);

                        return (
                          <label
                            key={option.id}
                            className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-slate-300 bg-white px-4 py-3 transition hover:border-slate-400 hover:bg-slate-50"
                          >
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
                              className="h-4 w-4 rounded accent-unisinu-red"
                            />
                            <span className="text-sm font-medium text-slate-900">{option.etiqueta}</span>
                          </label>
                        );
                      })}
                    </div>
                  ) : null}
                </div>
              </section>
            ))}

            {submitMutation.error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-medium text-unisinu-red">
                {submitMutation.error.message || 'Ocurrió un error al procesar las respuestas.'}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="sticky bottom-4 w-full rounded-2xl bg-unisinu-red px-4 py-3.5 text-base font-semibold text-white shadow-xl shadow-red-600/30 transition hover:bg-unisinu-red-hover active:scale-[0.99] disabled:opacity-60"
            >
              {submitMutation.isPending ? 'Enviando respuestas...' : 'Enviar Respuestas'}
            </button>
          </form>
        </div>
      </main>

      {/* Pie de página */}
      <footer className="mt-8 border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p className="font-medium text-slate-700">
          Universidad del Sinú Elías Bechara Zainúm · Seccional Cartagena
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          Sistema de Encuestas Universitarias de Movilidad y Rutas
        </p>
      </footer>
    </div>
  );
}
