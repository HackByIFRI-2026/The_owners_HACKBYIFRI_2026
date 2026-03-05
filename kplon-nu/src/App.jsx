import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import LandingPage from './pages/LandingPage.jsx'
import StudentDashboard from './pages/StudentDashboard.jsx'
import ProfessorDashboard from './pages/ProfessorDashboard.jsx'
import CoursesPage from './pages/CoursesPage.jsx'
import CourseDetailPage from './pages/CourseDetailPage.jsx'
import AIAssistantPage from './pages/AIAssistantPage.jsx'
import FlashcardsPage from './pages/FlashcardsPage.jsx'
import QuizPage from './pages/QuizPage.jsx'
import ProgressPage from './pages/ProgressPage.jsx'
import NotificationsPage from './pages/NotificationsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import CreateCoursePage from './pages/CreateCoursePage.jsx'
import StudentsPage from './pages/StudentsPage.jsx'
import ClassroomsPage from './pages/ClassroomsPage.jsx'
import ClassroomDetailPage from './pages/ClassroomDetailPage.jsx'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--bg-void)' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--amber)', borderTop: '3px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
        <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>Chargement...</div>
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return children
}

function DashboardRedirect() {
  const { user } = useAuth()
  if (user?.role === 'professor') return <ProfessorDashboard />
  return <StudentDashboard />
}

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        {children}
      </div>
    </div>
  )
}

function ForgotPasswordPage() {
  const [email, setEmail] = React.useState('')
  const [sent, setSent] = React.useState(false)
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-void)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ background: 'var(--bg-surface)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 'var(--radius-xl)', padding: 40, width: '100%', maxWidth: 420 }}>
        {!sent ? (
          <>
            <h2 style={{ marginBottom: 8 }}>Mot de passe oublié</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Entrez votre email pour recevoir un lien de réinitialisation.</p>
            <div className="input-group">
              <label className="input-label">Email</label>
              <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)} placeholder="vous@exemple.com" />
            </div>
            <button onClick={() => setSent(true)} className="btn btn-primary btn-full">Envoyer le lien</button>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <h3 style={{ marginBottom: 8 }}>Email envoyé !</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Lien envoyé à <strong>{email}</strong>.</p>
            <a href="/login" className="btn btn-primary">Retour à la connexion</a>
          </div>
        )}
      </div>
    </div>
  )
}

function AppRoutes() {
  const { user } = useAuth()
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardRedirect /></AppLayout></ProtectedRoute>} />
      <Route path="/courses" element={<ProtectedRoute><AppLayout><CoursesPage /></AppLayout></ProtectedRoute>} />
      <Route path="/courses/:id" element={<ProtectedRoute><AppLayout><CourseDetailPage /></AppLayout></ProtectedRoute>} />
      <Route path="/classrooms" element={<ProtectedRoute><AppLayout><ClassroomsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/classrooms/:id" element={<ProtectedRoute><AppLayout><ClassroomDetailPage /></AppLayout></ProtectedRoute>} />
      <Route path="/ai-assistant" element={<ProtectedRoute><AppLayout><AIAssistantPage /></AppLayout></ProtectedRoute>} />
      <Route path="/flashcards" element={<ProtectedRoute><AppLayout><FlashcardsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/quiz" element={<ProtectedRoute><AppLayout><QuizPage /></AppLayout></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><AppLayout><ProgressPage /></AppLayout></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><AppLayout><NotificationsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/my-courses" element={<ProtectedRoute><AppLayout><CoursesPage /></AppLayout></ProtectedRoute>} />
      <Route path="/create-course" element={<ProtectedRoute><AppLayout><CreateCoursePage /></AppLayout></ProtectedRoute>} />
      <Route path="/students" element={<ProtectedRoute><AppLayout><StudentsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/stats" element={<ProtectedRoute><AppLayout><ProgressPage /></AppLayout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/"} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster position="top-right" toastOptions={{
          style: { background: 'var(--bg-raised)', color: 'var(--text-primary)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', fontFamily: 'var(--font-body)', fontSize: '14px' },
          success: { iconTheme: { primary: 'var(--jade)', secondary: 'var(--bg-void)' } },
          error: { iconTheme: { primary: 'var(--coral)', secondary: 'white' } },
        }} />
      </BrowserRouter>
    </AuthProvider>
  )
}
