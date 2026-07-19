import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import ContactsTable from '@/components/admin/ContactsTable'
import Card from '@/components/ui/Card'
import { apiFetch } from '@/lib/api'

function AdminQueries() {
  const [contacts, setContacts] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    apiFetch('/api/admin/contacts', { auth: true })
      .then((data) => {
        if (!cancelled) setContacts(data.contacts)
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

  async function handleStatusChange(id, status) {
    const previous = contacts
    // Optimistic update — snap back on failure.
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))

    try {
      await apiFetch(`/api/admin/contacts?id=${id}`, { method: 'PATCH', body: { status }, auth: true })
    } catch (err) {
      setContacts(previous)
      setError(err.message)
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-text">Contact Queries</h1>
          <p className="mt-1 text-sm text-muted">
            All Contact Us submissions. Update status as you work through them.
          </p>
        </div>

        {error && (
          <p role="alert" className="flex items-center gap-2 text-sm text-primary">
            <AlertCircle size={16} aria-hidden="true" />
            {error}
          </p>
        )}

        <Card hoverable={false}>
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted">Loading queries…</p>
          ) : (
            <ContactsTable contacts={contacts} editable onStatusChange={handleStatusChange} />
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}

export default AdminQueries
