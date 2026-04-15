import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import StatusBadge from './StatusBadge'

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'BLOCKED', 'DONE']

const columns = [
  { key: 'title', label: 'Title', width: 'min-w-[200px]' },
  { key: 'assignee', label: 'Assignee', width: 'min-w-[120px]' },
  { key: 'priority', label: 'Priority', width: 'min-w-[90px]' },
  { key: 'severity', label: 'Severity', width: 'min-w-[90px]' },
  { key: 'status', label: 'Status', width: 'min-w-[130px]' },
  { key: 'testType', label: 'Test Type', width: 'min-w-[110px]' },
  { key: 'sprint', label: 'Sprint', width: 'min-w-[90px]' },
  { key: 'updatedAt', label: 'Updated', width: 'min-w-[110px]' },
]

export default function TicketTable({ tickets, onTicketClick, onStatusChange }) {
  if (tickets.length === 0) {
    return (
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
        <p className="text-slate-500 text-sm">No tickets found. Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider ${col.width}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="hover:bg-slate-700/30 transition group"
              >
                <td className="px-4 py-3">
                  <button
                    onClick={() => onTicketClick(ticket)}
                    className="text-left text-slate-200 hover:text-indigo-400 font-medium transition line-clamp-2 max-w-xs"
                  >
                    {ticket.title}
                  </button>
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {ticket.assignee?.name || '—'}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge type="priority" value={ticket.priority} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge type="severity" value={ticket.severity} />
                </td>
                <td className="px-4 py-3">
                  <select
                    value={ticket.status}
                    onChange={(e) => onStatusChange(ticket.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-slate-700 border border-slate-600 text-slate-200 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {ticket.testType?.replace('_', ' ') || '—'}
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs">
                  {ticket.sprintName || '—'}
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs">
                  {ticket.updatedAt
                    ? formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
