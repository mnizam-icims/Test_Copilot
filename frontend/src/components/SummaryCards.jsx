import React from 'react'

const cards = [
  { key: 'total', label: 'Total Tickets', color: 'bg-slate-700 border-slate-600', textColor: 'text-slate-100', icon: '🎫' },
  { key: 'open', label: 'Open', color: 'bg-blue-900/40 border-blue-700', textColor: 'text-blue-300', icon: '🔵' },
  { key: 'inProgress', label: 'In Progress', color: 'bg-yellow-900/40 border-yellow-700', textColor: 'text-yellow-300', icon: '⚡' },
  { key: 'blocked', label: 'Blocked', color: 'bg-red-900/40 border-red-700', textColor: 'text-red-300', icon: '🚫' },
  { key: 'done', label: 'Done', color: 'bg-green-900/40 border-green-700', textColor: 'text-green-300', icon: '✅' },
]

export default function SummaryCards({ summary }) {
  const counts = {
    total: summary?.total ?? 0,
    open: summary?.open ?? 0,
    inProgress: summary?.inProgress ?? 0,
    blocked: summary?.blocked ?? 0,
    done: summary?.done ?? 0,
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {cards.map(({ key, label, color, textColor, icon }) => (
        <div key={key} className={`rounded-xl border p-4 ${color}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
            <span className="text-lg">{icon}</span>
          </div>
          <p className={`text-3xl font-bold ${textColor}`}>{counts[key]}</p>
        </div>
      ))}
    </div>
  )
}
