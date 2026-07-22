import { Navigate, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import PortfolioSite from '@/PortfolioSite'
import { LenisProvider } from '@/lib/LenisContext'
import { ThemeProvider } from '@/lib/ThemeContext'
import { ToastProvider } from '@/lib/ToastContext'
import { AdminAuthProvider } from '@/lib/AdminAuthContext'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import AdminLogin from '@/pages/admin/Login'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminContacts from '@/pages/admin/Contacts'

/**
 * Two independent apps share this router:
 *  - "/"       the public single-page portfolio (anchor-nav sections,
 *              Lenis smooth scroll — scoped here, not globally, since
 *              a table-heavy admin UI doesn't want eased scroll).
 *  - "/admin/*" the internship task's admin system: login, dashboard,
 *              contact query management — all protected except
 *              /admin/login.
 *
 * Canonical admin routes: /admin/dashboard, /admin/contacts.
 * Legacy /admin and /admin/queries redirect for old bookmarks.
 *
 * MotionConfig (global reduced-motion safety net) applies to both.
 */
function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <MotionConfig reducedMotion="user">
          <Routes>
            <Route
              path="/"
              element={
                <LenisProvider>
                  <PortfolioSite />
                </LenisProvider>
              }
            />

            <Route
              path="/admin/*"
              element={
                <AdminAuthProvider>
                  <Routes>
                    <Route path="login" element={<AdminLogin />} />
                    <Route
                      path="dashboard"
                      element={
                        <ProtectedRoute>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="contacts"
                      element={
                        <ProtectedRoute>
                          <AdminContacts />
                        </ProtectedRoute>
                      }
                    />
                    {/* Legacy aliases — preserve existing bookmarks */}
                    <Route path="" element={<Navigate to="dashboard" replace />} />
                    <Route path="queries" element={<Navigate to="contacts" replace />} />
                  </Routes>
                </AdminAuthProvider>
              }
            />
          </Routes>
        </MotionConfig>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
