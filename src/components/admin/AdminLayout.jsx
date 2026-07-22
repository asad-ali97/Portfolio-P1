import PropTypes from 'prop-types'
import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ListChecks, LogOut } from 'lucide-react'
import { useAdminAuth } from '@/lib/AdminAuthContext'

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/contacts', label: 'Contact Queries', icon: ListChecks, end: false },
]

function AdminLayout({ children }) {
  const { profile, logout } = useAdminAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-background text-text">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-surface/40 md:flex">
        <div className="border-b border-border px-6 py-5">
          <p className="font-heading text-lg font-semibold">
            Asad Ali<span className="font-mono text-primary">_</span>
          </p>
          <p className="mt-0.5 text-xs text-muted">Admin Dashboard</p>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:bg-surface hover:text-text'
                }`
              }
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <p className="truncate px-3 text-xs text-muted">{profile?.email}</p>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-muted transition-colors duration-200 hover:bg-surface hover:text-primary"
          >
            <LogOut size={18} aria-hidden="true" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        {/* Mobile topbar */}
        <header className="flex items-center justify-between border-b border-border px-4 py-3 md:hidden">
          <p className="font-heading font-semibold">Admin</p>
          <div className="flex items-center gap-3">
            {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                aria-label={label}
                className={({ isActive }) => (isActive ? 'text-primary' : 'text-muted')}
              >
                <Icon size={20} aria-hidden="true" />
              </NavLink>
            ))}
            <button type="button" onClick={handleLogout} aria-label="Log out" className="text-muted">
              <LogOut size={20} aria-hidden="true" />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  )
}

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AdminLayout
