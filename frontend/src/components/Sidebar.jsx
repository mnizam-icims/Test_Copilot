import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/tickets', label: 'Tickets', icon: '🎫' },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-60 min-h-screen bg-slate-800 border-r border-slate-700 flex flex-col">
      <div className="px-5 py-5 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-lg shrink-0">
            🧪
          </div>
          <span className="font-bold text-slate-100 text-sm leading-tight">
            QA Command<br />Center
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700'
              }`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-slate-700">
        {user && (
          <div className="mb-3">
            <p className="text-xs text-slate-500 mb-0.5">Signed in as</p>
            <p className="text-sm font-medium text-slate-200 truncate">{user.name || user.email}</p>
            {user.role && (
              <span className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</span>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition"
        >
          <span>🚪</span>
          Sign out
        </button>
      </div>
    </aside>
  )
}
