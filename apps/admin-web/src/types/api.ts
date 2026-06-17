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

export interface LoginResponse {
  accessToken: string;
  user: AuthUser;
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
  route: UniversityRouteDto | null;
  questionsCount: number;
  responsesCount: number;
  createdAt: string;
}

export interface SurveyDetailDto extends SurveySummaryDto {
  questions: SurveyQuestionDto[];
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

export interface DashboardOverviewDto {
  totalSurveys: number;
  activeSurveys: number;
  totalResponses: number;
  surveys: Array<{
    id: string;
    titulo: string;
    publicSlug: string;
    isActive: boolean;
    routeName: string;
    responsesCount: number;
    createdAt: string;
  }>;
}

export interface DashboardResultsDto {
  survey: {
    id: string;
    titulo: string;
    descripcion: string | null;
    publicSlug: string;
    isActive: boolean;
    routeName: string;
    responsesCount: number;
  };
  analytics: Array<{
    questionId: string;
    title: string;
    type: QuestionType;
    totalAnswers: number;
    options?: Array<{
      optionId: string;
      label: string;
      value: string;
      count: number;
    }>;
    average?: number;
    values?: number[];
    responses?: string[];
  }>;
  records: Array<{
    id: string;
    studentCode: string | null;
    studentName: string | null;
    studentEmail: string | null;
    submittedAt: string;
    answers: Array<{
      questionId: string;
      questionTitle: string;
      value: string | number;
    }>;
  }>;
}
