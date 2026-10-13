import { Plus, Trash2 } from 'lucide-react';
import type { QuestionType } from '@/types/api';
import { questionTypeLabel } from '@/lib/utils';

export type QuestionForm = {
  localId: string;
  titulo: string;
  descripcion: string;
  tipo: QuestionType;
  requerida: boolean;
  orden: number;
  options: Array<{
    localId: string;
    etiqueta: string;
    valor: string;
    orden: number;
  }>;
};

type QuestionBuilderProps = {
  questions: QuestionForm[];
  onChange: (questions: QuestionForm[]) => void;
};

const questionTypes: QuestionType[] = [
  'SHORT_TEXT',
  'LONG_TEXT',
  'SINGLE_CHOICE',
  'MULTIPLE_CHOICE',
  'NUMBER',
  'RATING',
];

export function QuestionBuilder({ questions, onChange }: QuestionBuilderProps) {
  const updateQuestion = (localId: string, patch: Partial<QuestionForm>) => {
    onChange(
      questions.map((question) => (question.localId === localId ? { ...question, ...patch } : question)),
    );
  };

  const removeQuestion = (localId: string) => {
    onChange(
      questions
        .filter((question) => question.localId !== localId)
        .map((question, index) => ({ ...question, orden: index + 1 })),
    );
  };

  const addOption = (localId: string) => {
    onChange(
      questions.map((question) =>
        question.localId !== localId
          ? question
          : {
              ...question,
              options: [
                ...question.options,
                {
                  localId: crypto.randomUUID(),
                  etiqueta: '',
                  valor: '',
                  orden: question.options.length + 1,
                },
              ],
            },
      ),
    );
  };

  return (
    <div className="space-y-4">
      {questions.map((question, index) => {
        const supportsOptions =
          question.tipo === 'SINGLE_CHOICE' || question.tipo === 'MULTIPLE_CHOICE';

        return (
          <article
            key={question.localId}
            className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 sm:p-5 shadow-sm transition hover:border-red-200"
          >
            <div className="mb-4 flex items-center justify-between border-b border-slate-200/60 pb-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-unisinu-red">
                  Pregunta {index + 1}
                </span>
                <p className="mt-0.5 text-xs text-slate-500 font-medium">{questionTypeLabel(question.tipo)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeQuestion(question.localId)}
                className="rounded-xl border border-rose-200 bg-rose-50 p-2 text-rose-600 transition hover:bg-rose-100"
                aria-label="Eliminar pregunta"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">Enunciado / Pregunta *</label>
                <input
                  required
                  placeholder="Ej. ¿Cómo califica la puntualidad de la ruta?"
                  value={question.titulo}
                  onChange={(event) => updateQuestion(question.localId, { titulo: event.target.value })}
                  className="mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">Tipo de Respuesta *</label>
                <select
                  value={question.tipo}
                  onChange={(event) =>
                    updateQuestion(question.localId, {
                      tipo: event.target.value as QuestionType,
                      options:
                        event.target.value === 'SINGLE_CHOICE' || event.target.value === 'MULTIPLE_CHOICE'
                          ? question.options
                          : [],
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
                >
                  {questionTypes.map((type) => (
                    <option key={type} value={type}>
                      {questionTypeLabel(type)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">Aclaración o Ayuda (Opcional)</label>
              <textarea
                placeholder="Instrucción complementaria para el estudiante..."
                value={question.descripcion}
                onChange={(event) => updateQuestion(question.localId, { descripcion: event.target.value })}
                className="mt-1.5 min-h-20 w-full rounded-xl border-2 border-slate-300 bg-white px-3.5 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-unisinu-red focus:ring-4 focus:ring-unisinu-red/15"
              />
            </div>

            <label className="mt-3 inline-flex cursor-pointer items-center gap-2 text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={question.requerida}
                onChange={(event) => updateQuestion(question.localId, { requerida: event.target.checked })}
                className="h-4 w-4 rounded accent-unisinu-red"
              />
              Respuesta requerida (obligatoria)
            </label>

            {supportsOptions ? (
              <div className="mt-4 rounded-xl border-2 border-slate-300 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Opciones de Selección
                  </h3>
                  <button
                    type="button"
                    onClick={() => addOption(question.localId)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50/50 px-2.5 py-1 text-xs font-semibold text-unisinu-red hover:bg-unisinu-red hover:text-white transition"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Agregar Opción
                  </button>
                </div>
                <div className="space-y-2.5">
                  {question.options.map((option) => (
                    <div key={option.localId} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
                      <input
                        placeholder="Texto visible (Ej. Excelente)"
                        value={option.etiqueta}
                        onChange={(event) =>
                          updateQuestion(question.localId, {
                            options: question.options.map((item) =>
                              item.localId === option.localId
                                ? { ...item, etiqueta: event.target.value }
                                : item,
                            ),
                          })
                        }
                        className="rounded-lg border-2 border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-unisinu-red"
                      />
                      <input
                        placeholder="Valor interno (Ej. 5)"
                        value={option.valor}
                        onChange={(event) =>
                          updateQuestion(question.localId, {
                            options: question.options.map((item) =>
                              item.localId === option.localId
                                ? { ...item, valor: event.target.value }
                                : item,
                            ),
                          })
                        }
                        className="rounded-lg border-2 border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-900 placeholder:text-slate-500 outline-none transition hover:border-slate-400 focus:border-unisinu-red"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateQuestion(question.localId, {
                            options: question.options
                              .filter((item) => item.localId !== option.localId)
                              .map((item, optionIndex) => ({ ...item, orden: optionIndex + 1 })),
                          })
                        }
                        className="rounded-lg border border-rose-200 bg-rose-50/50 px-3 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-100"
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
