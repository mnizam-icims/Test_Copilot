import React, { useEffect, useState, useCallback } from 'react'
import Layout from '../components/Layout'
import FilterBar from '../components/FilterBar'
import TicketTable from '../components/TicketTable'
import CreateTicketModal from '../components/CreateTicketModal'
import TicketDetailPanel from '../components/TicketDetailPanel'
import { getTickets, updateTicket } from '../api/tickets'
import { exportCSV, exportPDF } from '../api/export'
import toast from 'react-hot-toast'

export default function Tickets() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    assigneeId: '',
    status: '',
    priority: '',
    sprintName: '',
    testType: '',
  })
  const [showCreate, setShowCreate] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [exporting, setExporting] = useState('')

  const loadTickets = useCallback(() => {
    setLoading(true)
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== '')
    )
    // Backend expects `sprint` query param for sprintName filter
    if (params.sprintName) {
      params.sprint = params.sprintName
      delete params.sprintName
    }
    getTickets(params)
      .then((res) => setTickets(res.data))
      .catch(() => toast.error('Failed to load tickets'))
      .finally(() => setLoading(false))
  }, [filters])

  useEffect(() => {
    loadTickets()
  }, [loadTickets])

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      const res = await updateTicket(ticketId, { status: newStatus })
      setTickets((prev) =>
        prev.map((t) => (t.id === ticketId ? { ...t, ...res.data } : t))
      )
      toast.success('Status updated')
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleTicketUpdate = (updated) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    )
    setSelectedTicket(updated)
  }

  const handleExportCSV = async () => {
    setExporting('csv')
    try {
      await exportCSV()
      toast.success('CSV exported')
    } catch {
      toast.error('Export failed')
    } finally {
      setExporting('')
    }
  }

  const handleExportPDF = async () => {
    setExporting('pdf')
    try {
      await exportPDF()
      toast.success('PDF exported')
    } catch {
      toast.error('Export failed')
    } finally {
      setExporting('')
    }
  }

  return (
    <Layout>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Tickets</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {loading ? '…' : `${tickets.length} ticket${tickets.length !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={exporting === 'csv'}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-200 rounded-lg text-sm transition"
            >
              📄 {exporting === 'csv' ? 'Exporting…' : 'CSV'}
            </button>
            <button
              onClick={handleExportPDF}
              disabled={exporting === 'pdf'}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-200 rounded-lg text-sm transition"
            >
              📋 {exporting === 'pdf' ? 'Exporting…' : 'PDF'}
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition"
            >
              + New Ticket
            </button>
          </div>
        </div>

        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : (
          <TicketTable
            tickets={tickets}
            onTicketClick={setSelectedTicket}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>

      {showCreate && (
        <CreateTicketModal
          onClose={() => setShowCreate(false)}
          onCreated={(ticket) => {
            setTickets((prev) => [ticket, ...prev])
            setShowCreate(false)
          }}
        />
      )}

      {selectedTicket && (
        <TicketDetailPanel
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onUpdate={handleTicketUpdate}
        />
      )}
    </Layout>
  )
}
