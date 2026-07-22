import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight, CheckCircle2, Clock, Inbox } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import StatCard from '@/components/admin/StatCard'
import ContactsTable from '@/components/admin/ContactsTable'
import ContactDetail from '@/components/admin/ContactDetail'
import Card from '@/components/ui/Card'
import { apiFetch } from '@/lib/api'
import { useToast } from '@/lib/ToastContext'

function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const { success, error: toastError } = useToast()

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

  async function reloadStats() {
    const data = await apiFetch('/api/admin/stats', { auth: true })
    setStats(data)
    return data
  }

  async function handleStatusChange(id, status) {
    const previousStats = stats
    const previousSelected = selected

    setStats((prev) => {
      if (!prev) return prev
      const recentContacts = prev.recentContacts.map((c) =>
        c.id === id ? { ...c, status } : c
      )
      return { ...prev, recentContacts }
    })
    if (selected?.id === id) {
      setSelected((prev) => (prev ? { ...prev, status } : prev))
    }

    setIsUpdating(true)
    try {
      await apiFetch(`/api/admin/contacts?id=${id}`, {
        method: 'PATCH',
        body: { status },
        auth: true,
      })
      await reloadStats()
      success(`Status updated to ${status}.`)
    } catch (err) {
      setStats(previousStats)
      setSelected(previousSelected)
      toastError(err.message || 'Could not update status.')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-heading text-2xl font-semibold text-text">Dashboard</h1>
            <p className="mt-1 text-sm text-muted">Overview of incoming contact queries.</p>
          </div>
          <Link
            to="/admin/contacts"
            className="inline-flex items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-text"
          >
            View all queries
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        {error && (
          <p role="alert" className="flex items-center gap-2 text-sm text-primary">
            <AlertCircle size={16} aria-hidden="true" />
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-md bg-surface" />
            ))}
          </div>
        ) : (
          stats && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatCard
                  label="Total Contacts"
                  value={stats.totalContacts}
                  icon={Inbox}
                  accent="primary"
                  description="All submissions received"
                />
                <StatCard
                  label="Pending Queries"
                  value={stats.pendingContacts}
                  icon={Clock}
                  accent="primary"
                  description="Awaiting a response"
                />
                <StatCard
                  label="Resolved Queries"
                  value={stats.resolvedContacts}
                  icon={CheckCircle2}
                  accent="secondary"
                  description="Done, completed, or resolved"
                />
              </div>

              <Card hoverable={false} className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="font-heading text-lg font-semibold text-text">Recent Contacts</h2>
                  <p className="text-xs text-muted">Latest 5 submissions</p>
                </div>
                <ContactsTable
                  contacts={stats.recentContacts}
                  onView={setSelected}
                  emptyMessage="No contacts yet — submissions will appear here."
                />
              </Card>
            </>
          )
        )}
      </div>

      <ContactDetail
        contact={selected}
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
        isUpdating={isUpdating}
      />
    </AdminLayout>
  )
}

export default AdminDashboard
