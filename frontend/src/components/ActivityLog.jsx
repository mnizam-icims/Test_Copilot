import React from 'react'
import { formatDistanceToNow } from 'date-fns'

const actionColors = {
  created: 'border-green-500',
  updated: 'border-indigo-500',
  status_changed: 'border-yellow-500',
  assigned: 'border-blue-500',
  deleted: 'border-red-500',
  commented: 'border-slate-500',
}

const actionLabels = {
  created: '✨ Created',
  updated: '✏️ Updated',
  status_changed: '🔄 Status changed',
  assigned: '👤 Assigned',
  deleted: '🗑️ Deleted',
  commented: '💬 Comment',
}

function formatChange(activity) {
  if (activity.oldValue && activity.newValue) {
    return (
      <span className="text-slate-400">
        <span className="line-through text-slate-500">{activity.oldValue}</span>
        {' → '}
        <span className="text-slate-300">{activity.newValue}</span>
      </span>
    )
  }
  if (activity.newValue) {
    return <span className="text-slate-300">{activity.newValue}</span>
  }
  if (activity.field) {
    return <span className="text-slate-400">{activity.field} changed</span>
  }
  return null
}

export default function ActivityLog({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <p className="text-slate-500 text-xs italic">No activity recorded yet.</p>
    )
  }

  return (
    <div className="space-y-3">
      {activities.map((activity, index) => {
        const action = activity.action || 'updated'
        const borderColor = actionColors[action] || 'border-slate-500'
        const label = actionLabels[action] || action

        return (
          <div
            key={activity.id || index}
            className={`pl-3 border-l-2 ${borderColor}`}
          >
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-medium text-slate-300">
                  {activity.user?.name || activity.userName || 'System'}
                </span>
                <span className="text-xs text-slate-500">{label}</span>
                {formatChange(activity) && (
                  <span className="text-xs">{formatChange(activity)}</span>
                )}
              </div>
              <span className="text-xs text-slate-600 shrink-0">
                {activity.createdAt
                  ? formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })
                  : ''}
              </span>
            </div>
            {activity.comment && (
              <p className="text-xs text-slate-400 mt-1 italic">"{activity.comment}"</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
