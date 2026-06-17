import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLayout } from '@/app/layouts/AdminLayout';
import { useAuthStore } from '@/features/auth/hooks/useAuthStore';
import { DashboardPage } from '@/features/analytics/pages/DashboardPage';
import { ResultsPage } from '@/features/analytics/pages/ResultsPage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { PublicSurveyPage } from '@/features/public/pages/PublicSurveyPage';
import { RoutesPage } from '@/features/routes/pages/RoutesPage';
import { SurveyEditorPage } from '@/features/surveys/pages/SurveyEditorPage';
import { SurveysPage } from '@/features/surveys/pages/SurveysPage';
import { UsersPage } from '@/features/users/pages/UsersPage';

function ProtectedRoute() {
  const token = useAuthStore((state) => state.token);
  return token ? <AdminLayout /> : <Navigate to="/login" replace />;
}

function HomeRedirect() {
  const token = useAuthStore((state) => state.token);
  return <Navigate to={token ? '/dashboard' : '/login'} replace />;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomeRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/encuesta/:publicSlug" element={<PublicSurveyPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/usuarios" element={<UsersPage />} />
        <Route path="/rutas" element={<RoutesPage />} />
        <Route path="/encuestas" element={<SurveysPage />} />
        <Route path="/encuestas/nueva" element={<SurveyEditorPage />} />
        <Route path="/encuestas/:surveyId/editar" element={<SurveyEditorPage />} />
        <Route path="/resultados" element={<ResultsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
