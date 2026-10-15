import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from '@/app/router/AppRouter';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppRouter />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

