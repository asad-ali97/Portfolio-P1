import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle2, Clock, Inbox } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import StatCard from '@/components/admin/StatCard'
import ContactsTable from '@/components/admin/ContactsTable'
import Card from '@/components/ui/Card'
import { apiFetch } from '@/lib/api'

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    apiFetch('/api/admin/stats', { auth: true })
      .then((data) => {
        if (!cancelled) setStats(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err.message)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-text">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Overview of incoming contact queries.</p>
        </div>

        {error && (
          <p role="alert" className="flex items-center gap-2 text-sm text-primary">
            <AlertCircle size={16} aria-hidden="true" />
            {error}
          </p>
        )}

        {isLoading ? (
          <p className="text-sm text-muted">Loading stats…</p>
        ) : (
          stats && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard label="Total Contacts" value={stats.totalContacts} icon={Inbox} accent="primary" />
                <StatCard label="Pending" value={stats.pendingContacts} icon={Clock} accent="primary" />
                <StatCard
                  label="Resolved / Completed"
                  value={stats.resolvedContacts}
                  icon={CheckCircle2}
                  accent="secondary"
                />
              </div>

              <Card hoverable={false} className="flex flex-col gap-4">
                <h2 className="font-heading text-lg font-semibold text-text">Recent Contacts</h2>
                <ContactsTable contacts={stats.recentContacts} />
              </Card>
            </>
          )
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
