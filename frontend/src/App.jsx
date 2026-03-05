import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import useThemeStore from './store/themeStore';
import useAuthStore from './store/authStore';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Guards
import ProtectedRoute from './components/ProtectedRoute';

// Public pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VideosPage from './pages/VideosPage';

// Dashboard pages
import StudentDashboard from './pages/StudentDashboard';
import ProfessorDashboard from './pages/ProfessorDashboard';
import ClassroomsPage from './pages/ClassroomsPage';
import ClassroomDetailPage from './pages/ClassroomDetailPage';
import AIAssistantPage from './pages/AIAssistantPage';
import FlashcardsPage from './pages/FlashcardsPage';
import QuizPage from './pages/QuizPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import StudentsPage from './pages/StudentsPage';
import CreateVideoPage from './pages/CreateVideoPage';
import ProgressPage from './pages/ProgressPage';

// Smart dashboard redirect based on role
function DashboardRedirect() {
  const { user } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  // Check if profile is complete
  if (!user.isProfileComplete && user.role === 'USER') {
    return <Navigate to="/complete-profile" replace />;
  }
  return <Navigate to={user.role === 'PROFESSOR' ? '/dashboard/professor' : '/dashboard/student'} replace />;
}

// Redirect logged-in users away from auth pages
function PublicRedirect({ children }) {
  const { user } = useAuthStore();
  if (user) return <DashboardRedirect />;
  return children;
}

// Render DashboardLayout (with sidebar) if logged in, otherwise MainLayout
function DynamicVideosRoute() {
  const { user } = useAuthStore();
  return user ? <DashboardLayout /> : <MainLayout />;
}

// Simple Settings page placeholder
function SettingsPage() {
  const { theme, toggleTheme } = useThemeStore();
  return (
    <div className="page-container" style={{ maxWidth: 560, margin: '0 auto' }}>
      <h2 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 22, marginBottom: 24 }}>Paramètres</h2>
      <div className="card" style={{ padding: 24, marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Mode d'affichage</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Actuel : {theme === 'dark' ? 'Sombre (Nuit)' : 'Clair (Jour)'}</div>
          </div>
          <button onClick={toggleTheme} className="btn btn-secondary">{theme === 'dark' ? 'Mode clair' : 'Mode sombre'}</button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: 'var(--bg-raised)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '12px', fontFamily: 'Sora, sans-serif', fontSize: 14 },
          success: { iconTheme: { primary: '#10B981', secondary: '#080C10' } },
        }}
      />
      <Routes>
        {/* Public routes strictly for non-logged in users */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<PublicRedirect><LoginPage /></PublicRedirect>} />
          <Route path="/register" element={<PublicRedirect><RegisterPage /></PublicRedirect>} />
        </Route>

        {/* Dynamic layout for Videos: MainLayout if logged out, DashboardLayout if logged in */}
        <Route element={<DynamicVideosRoute />}>
          <Route path="/videos" element={<VideosPage />} />
        </Route>

        {/* Protected dashboard routes */}
        <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/complete-profile" element={<CompleteProfilePage />} />

          <Route path="/dashboard/student" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/dashboard/professor" element={<ProtectedRoute allowedRoles={['PROFESSOR']}><ProfessorDashboard /></ProtectedRoute>} />

          <Route path="/classrooms" element={<ClassroomsPage />} />
          <Route path="/classrooms/:id" element={<ClassroomDetailPage />} />

          <Route path="/ai-assistant" element={<ProtectedRoute allowedRoles={['STUDENT']}><AIAssistantPage /></ProtectedRoute>} />
          <Route path="/flashcards" element={<ProtectedRoute allowedRoles={['STUDENT']}><FlashcardsPage /></ProtectedRoute>} />
          <Route path="/quiz" element={<ProtectedRoute allowedRoles={['STUDENT']}><QuizPage /></ProtectedRoute>} />
          <Route path="/progress" element={<ProtectedRoute allowedRoles={['STUDENT']}><ProgressPage /></ProtectedRoute>} />

          <Route path="/students" element={<ProtectedRoute allowedRoles={['PROFESSOR']}><StudentsPage /></ProtectedRoute>} />
          <Route path="/create-video" element={<ProtectedRoute allowedRoles={['PROFESSOR']}><CreateVideoPage /></ProtectedRoute>} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
