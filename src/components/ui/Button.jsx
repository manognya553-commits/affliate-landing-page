import React from 'react'

/**
 * Reusable sBLOOM Button component
 * Variants: primary | secondary | outline | ghost | lime | danger
 * Sizes: sm | md | lg
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  disabled,
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 select-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]'

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  }

  const variantStyles = {
    primary:
      'bg-[#6B3CFF] hover:bg-[#582CD6] text-white shadow-sm shadow-[#6B3CFF]/30 border border-transparent',
    secondary:
      'bg-[#F3ECE1] hover:bg-[#E8E2D8] text-[#12101F] border border-[#E8E2D8]',
    outline:
      'bg-transparent hover:bg-[#F3ECE1] text-[#12101F] border border-[#E8E2D8] hover:border-[#575266]/30',
    ghost:
      'bg-transparent hover:bg-black/5 text-[#575266] hover:text-[#12101F] border border-transparent',
    lime:
      'bg-[#D6F36B] hover:bg-[#B8DB3D] text-[#0E0B1E] font-bold shadow-sm border border-transparent',
    danger:
      'bg-rose-600 hover:bg-rose-700 text-white shadow-sm border border-transparent',
  }

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        LeftIcon && <LeftIcon className="w-4 h-4 shrink-0" />
      )}
      <span>{children}</span>
      {!isLoading && RightIcon && <RightIcon className="w-4 h-4 shrink-0" />}
    </button>
  )
}
