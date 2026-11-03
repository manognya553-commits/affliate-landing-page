import React from 'react'

/**
 * Reusable sBLOOM Card component
 * Variants: surface | canvas | dark | outline
 */
export default function Card({
  children,
  variant = 'surface',
  hoverable = false,
  padding = 'p-6',
  className = '',
  ...props
}) {
  const variantStyles = {
    surface: 'bg-[#F3ECE1] border border-[#E8E2D8] text-[#12101F] shadow-sm',
    canvas: 'bg-[#FAF7F2] border border-[#E8E2D8] text-[#12101F]',
    dark: 'bg-[#0E0B1E] border border-white/10 text-white shadow-lg',
    admin: 'bg-[#181432] border border-white/10 text-white shadow-md',
    outline: 'bg-white/80 backdrop-blur-md border border-[#E8E2D8] text-[#12101F] shadow-sm',
  }

  const hoverStyles = hoverable
    ? 'hover:-translate-y-1 hover:shadow-md transition-all duration-200 cursor-pointer'
    : ''

  return (
    <div
      className={`rounded-2xl ${padding} ${variantStyles[variant] || variantStyles.surface} ${hoverStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
