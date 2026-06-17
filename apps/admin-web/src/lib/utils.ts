import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value?: string | null) {
  if (!value) {
    return 'Sin fecha';
  }

  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function questionTypeLabel(type: string) {
  return {
    SHORT_TEXT: 'Texto corto',
    LONG_TEXT: 'Texto largo',
    SINGLE_CHOICE: 'Opcion unica',
    MULTIPLE_CHOICE: 'Multiple opcion',
    NUMBER: 'Numero',
    RATING: 'Calificacion',
  }[type] ?? type;
}
