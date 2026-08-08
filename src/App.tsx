import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom"
import { AuthProvider, useAuth } from "./hooks/useAuth"
import { LanguageProvider, useLanguage } from "./i18n/LanguageContext"
import LanguageSwitcher from "./components/LanguageSwitcher"
import DemoBanner from "./components/DemoBanner"
import LandingPage from "./pages/LandingPage"
import HubPage from "./pages/HubPage"
import LoginPage from "./pages/LoginPage"
import AdminLoginPage from "./pages/AdminLoginPage"
import RegisterPage from "./pages/RegisterPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import ResetPasswordPage from "./pages/ResetPasswordPage"
import DashboardPage from "./pages/DashboardPage"
import PatientDashboard from "./pages/PatientDashboard"
import PatientDetail from "./pages/PatientDetail"
import SharePage from "./pages/SharePage"
import AuditLogPage from "./pages/AuditLogPage"
import AdminPage from "./pages/AdminPage"
import NotFoundPage from "./pages/NotFoundPage"
import FaqPage from "./pages/FaqPage"
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"
import PatientGuidePage from "./pages/PatientGuidePage"
import ProGuidePage from "./pages/ProGuidePage"

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, isLoading } = useAuth()
  if (isLoading) return <div className="loading">Chargement...</div>
  if (!user) return <Navigate to="/login" />
  if (roles && !roles.includes(user.role)) return <Navigate to="/hub" />
  return <>{children}</>
}

function DemoNavbar() {
  const { user, logout } = useAuth()
  const { t } = useLanguage()

  if (!user) return null

  return (
    <div className="demo-nav">
      <div className="demo-nav-inner">
        <Link to="/hub" className="demo-nav-brand">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          EasyHealth
        </Link>
        <div className="demo-nav-links">
          <Link to="/dashboard">{t("nav.home")}</Link>
          <Link to="/hub">{t("demo.hub_screens")}</Link>
        </div>
        <div className="demo-nav-right">
          <LanguageSwitcher />
          <span className="demo-user-chip">{user.prenom} {user.nom}</span>
          <button onClick={logout} className="btn btn-ghost btn-sm">{t("nav.logout")}</button>
        </div>
      </div>
    </div>
  )
}

function App() {
  const location = useLocation()
  const isHub = location.pathname === "/hub"

  return (
    <LanguageProvider>
      <AuthProvider>
        <div className="app">
          <DemoBanner />
          {!isHub && <DemoNavbar />}
          <Routes>
            <Route path="/hub" element={<HubPage />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/adminlogin" element={<AdminLoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/patients" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
            <Route path="/patients/:id" element={<ProtectedRoute roles={["medecin", "infirmier", "admin"]}><PatientDetail /></ProtectedRoute>} />
            <Route path="/share/:id" element={<ProtectedRoute roles={["medecin", "infirmier", "patient"]}><SharePage /></ProtectedRoute>} />
            <Route path="/audit" element={<ProtectedRoute roles={["admin"]}><AuditLogPage /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminPage /></ProtectedRoute>} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/guide-patient" element={<PatientGuidePage />} />
            <Route path="/guide-pro" element={<ProGuidePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
