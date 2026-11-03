import React from 'react'

/**
 * Reusable Select dropdown
 */
export default function Select({
  label,
  error,
  helperText,
  options = [],
  className = '',
  id,
  required,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-[#12101F] tracking-wide"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        <select
          id={selectId}
          required={required}
          className={`block w-full rounded-xl border bg-white/80 px-3.5 py-2.5 text-sm text-[#12101F] transition-all duration-200 outline-none focus:bg-white focus:ring-2 focus:ring-[#6B3CFF]/20 focus:border-[#6B3CFF] ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
              : 'border-[#E8E2D8] hover:border-[#575266]/30'
          } ${className}`}
          {...props}
        >
          {options.map((opt, idx) => (
            <option key={opt.value ?? idx} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-[#575266]">{helperText}</p>
      )}
    </div>
  )
}
