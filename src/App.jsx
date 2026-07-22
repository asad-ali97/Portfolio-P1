import { Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import PortfolioSite from '@/PortfolioSite'
import { LenisProvider } from '@/lib/LenisContext'
import { ThemeProvider } from '@/lib/ThemeContext'
import { AdminAuthProvider } from '@/lib/AdminAuthContext'
import ProtectedRoute from '@/components/admin/ProtectedRoute'
import AdminLogin from '@/pages/admin/Login'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminQueries from '@/pages/admin/Queries'

/**
 * Two independent apps share this router:
 *  - "/"       the public single-page portfolio (anchor-nav sections,
 *              Lenis smooth scroll — scoped here, not globally, since
 *              a table-heavy admin UI doesn't want eased scroll).
 *  - "/admin/*" the internship task's admin system: login, dashboard,
 *              contact query management — all protected except
 *              /admin/login.
 *
 * MotionConfig (global reduced-motion safety net) applies to both.
 */
function App() {
  return (
    <ThemeProvider>
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
                    path=""
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="queries"
                    element={
                      <ProtectedRoute>
                        <AdminQueries />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </AdminAuthProvider>
            }
          />
        </Routes>
      </MotionConfig>
    </ThemeProvider>
  )
}

export default App
