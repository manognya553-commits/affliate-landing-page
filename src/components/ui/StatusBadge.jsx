import React from 'react'

/**
 * Reusable sBLOOM StatusBadge with colored semantic indicator
 */
export default function StatusBadge({ status = 'Pending', size = 'sm', className = '' }) {
  const norm = String(status || '').toLowerCase()

  const config = {
    pending: {
      label: 'Pending',
      bg: 'bg-amber-500/10 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      pulse: true,
    },
    contacted: {
      label: 'Contacted',
      bg: 'bg-blue-500/10 text-blue-700 border-blue-200',
      dot: 'bg-blue-500',
      pulse: false,
    },
    qualified: {
      label: 'Qualified',
      bg: 'bg-purple-500/10 text-purple-700 border-purple-200',
      dot: 'bg-purple-500',
      pulse: false,
    },
    converted: {
      label: 'Converted',
      bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      pulse: false,
    },
    rejected: {
      label: 'Rejected',
      bg: 'bg-rose-500/10 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
      pulse: false,
    },
    paid: {
      label: 'Paid',
      bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      pulse: false,
    },
    processing: {
      label: 'Processing',
      bg: 'bg-indigo-500/10 text-indigo-700 border-indigo-200',
      dot: 'bg-indigo-500',
      pulse: true,
    },
    approved: {
      label: 'Approved',
      bg: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
      dot: 'bg-emerald-500',
      pulse: false,
    },
  }

  const current = config[norm] || {
    label: status,
    bg: 'bg-slate-500/10 text-slate-700 border-slate-200',
    dot: 'bg-slate-400',
    pulse: false,
  }

  const sizeClass =
    size === 'sm' ? 'px-2.5 py-0.5 text-xs gap-1.5' : 'px-3 py-1 text-sm gap-2'

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${current.bg} ${sizeClass} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {current.pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${current.dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${current.dot}`} />
      </span>
      <span>{current.label}</span>
    </span>
  )
}
