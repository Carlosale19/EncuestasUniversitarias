import { describe, expect, it } from 'vitest';
import { formatDate, questionTypeLabel } from './utils';

describe('utils', () => {
  it('traduce los tipos de pregunta a etiquetas amigables', () => {
    expect(questionTypeLabel('MULTIPLE_CHOICE')).toBe('Multiple opcion');
    expect(questionTypeLabel('RATING')).toBe('Calificacion');
  });

  it('formatea fechas o devuelve un fallback', () => {
    expect(formatDate(null)).toBe('Sin fecha');
    expect(formatDate('2026-06-15T12:30:00.000Z')).toContain('2026');
  });
});
