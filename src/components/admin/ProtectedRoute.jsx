import PropTypes from 'prop-types'
import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '@/lib/AdminAuthContext'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAdminAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ProtectedRoute
