import React, { useEffect, useState } from 'react'
import { getUsers } from '../api/users'

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'BLOCKED', 'DONE']
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const TEST_TYPE_OPTIONS = ['REGRESSION', 'SMOKE', 'EXPLORATORY', 'AUTOMATION']

export default function FilterBar({ filters, onFilterChange }) {
  const [users, setUsers] = useState([])

  useEffect(() => {
    getUsers()
      .then((res) => setUsers(res.data))
      .catch(() => {})
  }, [])

  const handleClear = () => {
    onFilterChange('assigneeId', '')
    onFilterChange('status', '')
    onFilterChange('priority', '')
    onFilterChange('sprintName', '')
    onFilterChange('testType', '')
  }

  const selectClass =
    'bg-slate-900 border border-slate-600 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition'

  const hasActiveFilters = Object.values(filters).some((v) => v !== '')

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1 min-w-[140px]">
          <label className="text-xs text-slate-400 font-medium">Assignee</label>
          <select
            className={selectClass}
            value={filters.assigneeId}
            onChange={(e) => onFilterChange('assigneeId', e.target.value)}
          >
            <option value="">All assignees</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[130px]">
          <label className="text-xs text-slate-400 font-medium">Status</label>
          <select
            className={selectClass}
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[130px]">
          <label className="text-xs text-slate-400 font-medium">Priority</label>
          <select
            className={selectClass}
            value={filters.priority}
            onChange={(e) => onFilterChange('priority', e.target.value)}
          >
            <option value="">All priorities</option>
            {PRIORITY_OPTIONS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[120px]">
          <label className="text-xs text-slate-400 font-medium">Sprint</label>
          <input
            type="text"
            className={selectClass}
            value={filters.sprintName}
            onChange={(e) => onFilterChange('sprintName', e.target.value)}
            placeholder="e.g. Sprint 12"
          />
        </div>

        <div className="flex flex-col gap-1 min-w-[150px]">
          <label className="text-xs text-slate-400 font-medium">Test Type</label>
          <select
            className={selectClass}
            value={filters.testType}
            onChange={(e) => onFilterChange('testType', e.target.value)}
          >
            <option value="">All types</option>
            {TEST_TYPE_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClear}
            className="px-3 py-2 text-sm text-slate-400 hover:text-slate-100 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
          >
            ✕ Clear
          </button>
        )}
      </div>
    </div>
  )
}
