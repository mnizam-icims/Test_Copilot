import React from 'react'

const statusColors = {
  OPEN: 'bg-blue-900/50 text-blue-300 border-blue-700',
  IN_PROGRESS: 'bg-yellow-900/50 text-yellow-300 border-yellow-700',
  BLOCKED: 'bg-red-900/50 text-red-300 border-red-700',
  DONE: 'bg-green-900/50 text-green-300 border-green-700',
}

const priorityColors = {
  LOW: 'bg-slate-700/50 text-slate-400 border-slate-600',
  MEDIUM: 'bg-blue-900/50 text-blue-300 border-blue-700',
  HIGH: 'bg-orange-900/50 text-orange-300 border-orange-700',
  CRITICAL: 'bg-red-900/50 text-red-300 border-red-700',
}

const severityColors = {
  TRIVIAL: 'bg-slate-700/50 text-slate-400 border-slate-600',
  MINOR: 'bg-green-900/50 text-green-300 border-green-700',
  MAJOR: 'bg-orange-900/50 text-orange-300 border-orange-700',
  CRITICAL: 'bg-red-900/50 text-red-300 border-red-700',
}

const colorMap = {
  status: statusColors,
  priority: priorityColors,
  severity: severityColors,
}

export default function StatusBadge({ type = 'status', value }) {
  if (!value) return null
  const colors = colorMap[type] || statusColors
  const cls = colors[value] || 'bg-slate-700/50 text-slate-400 border-slate-600'
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${cls}`}>
      {value.replace('_', ' ')}
    </span>
  )
}
