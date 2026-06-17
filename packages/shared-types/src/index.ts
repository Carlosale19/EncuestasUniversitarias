export type UserRole = 'ADMIN' | 'OPERATOR';

export type QuestionType =
  | 'SHORT_TEXT'
  | 'LONG_TEXT'
  | 'SINGLE_CHOICE'
  | 'MULTIPLE_CHOICE'
  | 'NUMBER'
  | 'RATING';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface UniversityRouteDto {
  id: string;
  nombreRuta: string;
  descripcion: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionOptionDto {
  id: string;
  etiqueta: string;
  valor: string;
  orden: number;
}

export interface SurveyQuestionDto {
  id: string;
  titulo: string;
  descripcion: string | null;
  tipo: QuestionType;
  requerida: boolean;
  orden: number;
  options: QuestionOptionDto[];
}

export interface SurveySummaryDto {
  id: string;
  titulo: string;
  descripcion: string | null;
  publicSlug: string;
  isActive: boolean;
  startsAt: string | null;
  endsAt: string | null;
  route: UniversityRouteDto;
  questionsCount: number;
  responsesCount: number;
  createdAt: string;
}

export interface PublicSurveyDto {
  id: string;
  titulo: string;
  descripcion: string | null;
  publicSlug: string;
  route: {
    id: string;
    nombreRuta: string;
    descripcion: string | null;
  };
  questions: SurveyQuestionDto[];
}
