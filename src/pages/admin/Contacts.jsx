import { useEffect, useMemo, useState } from 'react'
import { AlertCircle, Search } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import ContactsTable from '@/components/admin/ContactsTable'
import ContactDetail from '@/components/admin/ContactDetail'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { apiFetch } from '@/lib/api'
import { useToast } from '@/lib/ToastContext'
import { isResolvedStatus } from '@/lib/contactStatus'

const PAGE_SIZE = 8

function AdminContacts() {
  const [contacts, setContacts] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState('newest')
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const { success, error: toastError } = useToast()

  function updateSearch(value) {
    setSearch(value)
    setPage(1)
  }

  function updateStatusFilter(value) {
    setStatusFilter(value)
    setPage(1)
  }

  function updateSortOrder(value) {
    setSortOrder(value)
    setPage(1)
  }

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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()

    let list = contacts.filter((contact) => {
      if (statusFilter === 'pending' && contact.status !== 'pending') return false
      if (statusFilter === 'resolved' && !isResolvedStatus(contact.status)) return false

      if (!q) return true
      return [contact.name, contact.email, contact.subject, contact.message]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q))
    })

    list = [...list].sort((a, b) => {
      const aTime = new Date(a.createdAt).getTime()
      const bTime = new Date(b.createdAt).getTime()
      return sortOrder === 'newest' ? bTime - aTime : aTime - bTime
    })

    return list
  }, [contacts, search, statusFilter, sortOrder])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  async function handleStatusChange(id, status) {
    const previous = contacts
    const previousSelected = selected
    setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)))
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
      success(`Status updated to ${status}.`)
    } catch (err) {
      setContacts(previous)
      setSelected(previousSelected)
      toastError(err.message || 'Could not update status.')
      setError(err.message)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-text">Contact Queries</h1>
          <p className="mt-1 text-sm text-muted">
            Search, filter, and update Contact Us submissions. Open a row to read the full message.
          </p>
        </div>

        {error && (
          <p role="alert" className="flex items-center gap-2 text-sm text-primary">
            <AlertCircle size={16} aria-hidden="true" />
            {error}
          </p>
        )}

        <Card hoverable={false} className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full lg:max-w-sm">
              <span className="sr-only">Search contacts</span>
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => updateSearch(event.target.value)}
                placeholder="Search name, email, subject…"
                className="h-11 w-full rounded-md border border-border-strong bg-background pl-9 pr-3 text-sm text-text placeholder:text-muted focus:border-secondary focus:outline-none"
              />
            </label>

            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(event) => updateStatusFilter(event.target.value)}
                aria-label="Filter by status"
                className="h-11 rounded-md border border-border-strong bg-background px-3 text-sm text-text focus:border-secondary focus:outline-none"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={sortOrder}
                onChange={(event) => updateSortOrder(event.target.value)}
                aria-label="Sort by date"
                className="h-11 rounded-md border border-border-strong bg-background px-3 text-sm text-text focus:border-secondary focus:outline-none"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3 py-2" aria-busy="true" aria-label="Loading contacts">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-md bg-background/80" />
              ))}
            </div>
          ) : (
            <>
              <ContactsTable
                contacts={pageItems}
                editable
                onStatusChange={handleStatusChange}
                onView={setSelected}
                emptyMessage={
                  contacts.length === 0
                    ? 'No contact queries yet.'
                    : 'No contacts match your search or filters.'
                }
              />

              {filtered.length > PAGE_SIZE && (
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <p className="text-xs text-muted">
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                    {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      disabled={currentPage <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      Previous
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      disabled={currentPage >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
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

export default AdminContacts
