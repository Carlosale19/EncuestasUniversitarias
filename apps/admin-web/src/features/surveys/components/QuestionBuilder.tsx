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
          <article key={question.localId} className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Pregunta {index + 1}</p>
                <p className="mt-1 text-sm font-medium text-slate-700">{questionTypeLabel(question.tipo)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeQuestion(question.localId)}
                className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input
                placeholder="Titulo de la pregunta"
                value={question.titulo}
                onChange={(event) => updateQuestion(question.localId, { titulo: event.target.value })}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
              />
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
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                {questionTypes.map((type) => (
                  <option key={type} value={type}>
                    {questionTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              placeholder="Descripcion opcional"
              value={question.descripcion}
              onChange={(event) => updateQuestion(question.localId, { descripcion: event.target.value })}
              className="mt-4 min-h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            />

            <label className="mt-4 inline-flex items-center gap-3 text-sm font-medium text-slate-700">
              <input
                type="checkbox"
                checked={question.requerida}
                onChange={(event) => updateQuestion(question.localId, { requerida: event.target.checked })}
              />
              Respuesta obligatoria
            </label>

            {supportsOptions ? (
              <div className="mt-5 rounded-[20px] bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-800">Opciones</h3>
                  <button
                    type="button"
                    onClick={() => addOption(question.localId)}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar opcion
                  </button>
                </div>
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <div key={option.localId} className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                      <input
                        placeholder="Etiqueta"
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
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                      />
                      <input
                        placeholder="Valor"
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
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
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
                        className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700"
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
