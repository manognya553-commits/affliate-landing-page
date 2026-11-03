import React from 'react'

/**
 * Reusable accessible Input container with focus ring and error states
 */
export default function Input({
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  id,
  required,
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-[#12101F] tracking-wide"
        >
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#575266]">
            <LeftIcon className="h-4 w-4" />
          </div>
        )}
        <input
          id={inputId}
          required={required}
          className={`block w-full rounded-xl border bg-white/80 px-3.5 py-2.5 text-sm text-[#12101F] placeholder-[#575266]/60 transition-all duration-200 outline-none focus:bg-white focus:ring-2 focus:ring-[#6B3CFF]/20 focus:border-[#6B3CFF] ${
            LeftIcon ? 'pl-10' : ''
          } ${RightIcon ? 'pr-10' : ''} ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
              : 'border-[#E8E2D8] hover:border-[#575266]/30'
          } ${className}`}
          {...props}
        />
        {RightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#575266]">
            <RightIcon className="h-4 w-4" />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-[#575266]">{helperText}</p>
      )}
    </div>
  )
}
