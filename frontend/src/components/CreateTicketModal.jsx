import React, { useEffect, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { createTicket } from '../api/tickets'
import { getUsers } from '../api/users'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  assigneeId: z.string().optional(),
  priority: z.string().min(1, 'Priority is required'),
  severity: z.string().min(1, 'Severity is required'),
  status: z.string().min(1, 'Status is required'),
  testType: z.string().optional(),
  sprint: z.string().optional(),
  playwrightTestFile: z.string().optional(),
  testCaseId: z.string().optional(),
  blockedReason: z.string().optional(),
})

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'BLOCKED', 'DONE']
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
const SEVERITY_OPTIONS = ['TRIVIAL', 'MINOR', 'MAJOR', 'CRITICAL']
const TEST_TYPE_OPTIONS = ['REGRESSION', 'SMOKE', 'EXPLORATORY', 'AUTOMATION']

const inputClass =
  'w-full bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition'
const labelClass = 'block text-xs font-medium text-slate-400 mb-1'

export default function CreateTicketModal({ onClose, onCreated }) {
  const [users, setUsers] = useState([])
  const [submitting, setSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      assigneeId: '',
      priority: 'MEDIUM',
      severity: 'MINOR',
      status: 'OPEN',
      testType: '',
      sprint: '',
      playwrightTestFile: '',
      testCaseId: '',
      blockedReason: '',
    },
  })

  const watchedStatus = useWatch({ control, name: 'status' })

  useEffect(() => {
    getUsers()
      .then((res) => setUsers(res.data))
      .catch(() => {})
  }, [])

  const onSubmit = async (data) => {
    setSubmitting(true)
    try {
      const payload = { ...data }
      if (payload.status !== 'BLOCKED') delete payload.blockedReason
      if (!payload.assigneeId) delete payload.assigneeId
      const res = await createTicket(payload)
      toast.success('Ticket created!')
      onCreated(res.data)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create ticket')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-slate-100">New Ticket</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-100 transition p-1 rounded-lg hover:bg-slate-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto px-6 py-5 space-y-4 flex-1">
          <div>
            <label className={labelClass}>Title <span className="text-red-400">*</span></label>
            <input type="text" {...register('title')} className={inputClass} placeholder="Describe the issue…" />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title.message}</p>}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className={inputClass + ' resize-none'}
              placeholder="Steps to reproduce, expected vs actual…"
            />
          </div>

          <div>
            <label className={labelClass}>Assignee</label>
            <select {...register('assigneeId')} className={inputClass}>
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Status <span className="text-red-400">*</span></label>
              <select {...register('status')} className={inputClass}>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
              {errors.status && <p className="mt-1 text-xs text-red-400">{errors.status.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Priority <span className="text-red-400">*</span></label>
              <select {...register('priority')} className={inputClass}>
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              {errors.priority && <p className="mt-1 text-xs text-red-400">{errors.priority.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Severity <span className="text-red-400">*</span></label>
              <select {...register('severity')} className={inputClass}>
                {SEVERITY_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.severity && <p className="mt-1 text-xs text-red-400">{errors.severity.message}</p>}
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
            <input type="text" {...register('sprint')} className={inputClass} placeholder="e.g. Sprint 12" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Playwright Test File</label>
              <input type="text" {...register('playwrightTestFile')} className={inputClass} placeholder="tests/example.spec.ts" />
            </div>
            <div>
              <label className={labelClass}>Test Case ID</label>
              <input type="text" {...register('testCaseId')} className={inputClass} placeholder="TC-001" />
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
        </form>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-700 bg-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-400 hover:text-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            form=""
            disabled={submitting}
            onClick={handleSubmit(onSubmit)}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition flex items-center gap-2"
          >
            {submitting && (
              <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            {submitting ? 'Creating…' : 'Create Ticket'}
          </button>
        </div>
      </div>
    </div>
  )
}
