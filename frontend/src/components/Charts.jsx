import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

const PRIORITY_COLORS = {
  CRITICAL: '#ef4444',
  HIGH: '#f97316',
  MEDIUM: '#3b82f6',
  LOW: '#94a3b8',
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm">
        <p className="text-slate-300 font-medium">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="mt-0.5">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

const PieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm">
        <p style={{ color: payload[0].payload.fill }} className="font-medium">
          {payload[0].name}: {payload[0].value}
        </p>
      </div>
    )
  }
  return null
}

export default function Charts({ summary }) {
  const assigneeData = summary?.assigneeWorkload || []
  const priorityRaw = summary?.byPriority || {}
  const priorityData = Object.entries(priorityRaw).map(([name, value]) => ({
    name,
    value,
    fill: PRIORITY_COLORS[name] || '#94a3b8',
  }))

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
        <h2 className="text-base font-semibold text-slate-200 mb-4">Tickets by Assignee</h2>
        {assigneeData.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-10">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={assigneeData} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={{ stroke: '#475569' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="ticketCount" name="Tickets" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 p-5">
        <h2 className="text-base font-semibold text-slate-200 mb-4">Tickets by Priority</h2>
        {priorityData.length === 0 ? (
          <p className="text-slate-500 text-sm text-center py-10">No data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={priorityData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {priorityData.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
              <Legend
                formatter={(value) => (
                  <span style={{ color: '#94a3b8', fontSize: 12 }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
