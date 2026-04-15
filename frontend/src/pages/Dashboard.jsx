import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import SummaryCards from '../components/SummaryCards'
import Charts from '../components/Charts'
import ActivityLog from '../components/ActivityLog'
import { getSummary } from '../api/dashboard'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSummary()
      .then((res) => setSummary(res.data))
      .catch(() => toast.error('Failed to load dashboard data'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <Layout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-0.5">Overview of QA ticket activity</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          </div>
        ) : (
          <>
            <SummaryCards summary={summary} />
            <Charts summary={summary} />
            <div>
              <h2 className="text-lg font-semibold text-slate-200 mb-3">Recent Activity</h2>
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                <ActivityLog activities={summary?.recentActivity || []} />
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
