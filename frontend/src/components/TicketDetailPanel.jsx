import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { updateTicket, getTicketActivity } from '../api/tickets'
import ActivityLog from './ActivityLog'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  status: z.string().min(1),
  priority: z.string().min(1),
  severity: z.string().min(1),
  testType: z.string().optional(),
  sprintName: z.string().optional(),
  playwrightTestFile: z.string().optional(),
  testCaseId: z.string().optional(),
  blockedReason: z.string().optional(),
})

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'BLOCKED', 'DONE']
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const SEVERITY_OPTIONS = ['TRIVIAL', 'MINOR', 'MAJOR', 'CRITICAL']
const TEST_TYPE_OPTIONS = ['REGRESSION', 'SMOKE', 'EXPLORATORY', 'AUTOMATION']

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(value || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <button
      type="button"
      onClick={handleCopy}
      className="ml-2 text-xs px-2 py-0.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded transition"
    >
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

const inputClass =
  'w-full bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
const labelClass = 'block text-xs font-medium text-slate-400 mb-1'

export default function TicketDetailPanel({ ticket, onClose, onUpdate }) {
  const [saving, setSaving] = useState(false)
  const [activities, setActivities] = useState([])
  const [activitiesLoading, setActivitiesLoading] = useState(true)

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: ticket.title || '',
      description: ticket.description || '',
      status: ticket.status || 'OPEN',
      priority: ticket.priority || 'MEDIUM',
      severity: ticket.severity || 'MINOR',
      testType: ticket.testType || '',
      sprintName: ticket.sprintName || '',
      playwrightTestFile: ticket.playwrightTestFile || '',
      testCaseId: ticket.testCaseId || '',
      blockedReason: ticket.blockedReason || '',
    },
  })

  const watchedStatus = watch('status')
  const watchedPlaywrightFile = watch('playwrightTestFile')
  const watchedTestCaseId = watch('testCaseId')

  useEffect(() => {
    reset({
      title: ticket.title || '',
      description: ticket.description || '',
      status: ticket.status || 'OPEN',
      priority: ticket.priority || 'MEDIUM',
      severity: ticket.severity || 'MINOR',
      testType: ticket.testType || '',
      sprintName: ticket.sprintName || '',
      playwrightTestFile: ticket.playwrightTestFile || '',
      testCaseId: ticket.testCaseId || '',
      blockedReason: ticket.blockedReason || '',
    })
  }, [ticket, reset])

  useEffect(() => {
    setActivitiesLoading(true)
    getTicketActivity(ticket.id)
      .then((res) => setActivities(res.data))
      .catch(() => setActivities([]))
      .finally(() => setActivitiesLoading(false))
  }, [ticket.id])

  const onSubmit = async (data) => {
    setSaving(true)
    try {
      const payload = { ...data }
      if (payload.status !== 'BLOCKED') delete payload.blockedReason
      const res = await updateTicket(ticket.id, payload)
      toast.success('Ticket updated')
      onUpdate(res.data)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex">
      <div
        className="flex-1 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="w-full max-w-xl bg-slate-800 border-l border-slate-700 overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700 sticky top-0 bg-slate-800 z-10">
          <h2 className="font-semibold text-slate-100 text-base">Ticket Details</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 transition p-1 rounded-lg hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 px-5 py-5 space-y-4">
          <div>
            <label className={labelClass}>Title</label>
            <input type="text" {...register('title')} className={inputClass} />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className={inputClass + ' resize-none'}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Status</label>
              <select {...register('status')} className={inputClass}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Priority</label>
              <select {...register('priority')} className={inputClass}>
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Severity</label>
              <select {...register('severity')} className={inputClass}>
                {SEVERITY_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Test Type</label>
              <select {...register('testType')} className={inputClass}>
                <option value="">None</option>
                {TEST_TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelClass}>Sprint</label>
            <input type="text" {...register('sprintName')} className={inputClass} placeholder="e.g. Sprint 12" />
          </div>

          <div>
            <label className={labelClass}>Playwright Test File</label>
            <div className="flex items-center">
              <input type="text" {...register('playwrightTestFile')} className={inputClass} placeholder="tests/example.spec.ts" />
              <CopyButton value={watchedPlaywrightFile} />
            </div>
          </div>

          <div>
            <label className={labelClass}>Test Case ID</label>
            <div className="flex items-center">
              <input type="text" {...register('testCaseId')} className={inputClass} placeholder="TC-001" />
              <CopyButton value={watchedTestCaseId} />
            </div>
          </div>

          {watchedStatus === 'BLOCKED' && (
            <div>
              <label className={labelClass}>Blocked Reason</label>
              <textarea
                {...register('blockedReason')}
                rows={2}
                className={inputClass + ' resize-none border-red-700/50'}
                placeholder="Describe why this ticket is blocked…"
              />
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-400 hover:text-slate-100 mr-2 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !isDirty}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
            >
              {saving && (
                <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>

        <div className="px-5 pb-6 border-t border-slate-700 pt-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-3">Activity Log</h3>
          {activitiesLoading ? (
            <p className="text-slate-500 text-xs">Loading…</p>
          ) : (
            <ActivityLog activities={activities} />
          )}
        </div>
      </div>
    </div>
  )
}
