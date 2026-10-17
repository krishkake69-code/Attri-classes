import { StrictMode, lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// The student portal is code-split so marketing visitors never download it.
const StudentLogin = lazy(() => import('./pages/StudentLogin'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));

function RouteFallback() {
  return (
    <div className="min-h-[100dvh] bg-canvas flex items-center justify-center text-ink-faint text-sm">
      Loading…
    </div>
  );
}

function StudentLoginRoute() {
  const navigate = useNavigate();
  return <StudentLogin onSuccess={() => navigate('/student')} onBack={() => navigate('/')} />;
}

function StudentDashboardRoute() {
  const navigate = useNavigate();
  return <StudentDashboard onLoggedOut={() => navigate('/student/login')} />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/student/login" element={<StudentLoginRoute />} />
            <Route path="/student" element={<StudentDashboardRoute />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
