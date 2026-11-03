import React, { useEffect } from 'react'
import { X } from 'lucide-react'

/**
 * Reusable slide-over Drawer component with ESC listener and backdrop blur
 */
export default function Drawer({
  isOpen = false,
  onClose,
  title,
  subtitle,
  children,
  footer,
  width = 'max-w-xl',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0E0B1E]/50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div
        className={`relative z-10 w-full ${width} bg-[#FAF7F2] text-[#12101F] shadow-2xl flex flex-col h-full border-l border-[#E8E2D8] animate-in slide-in-from-right duration-300`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8E2D8] bg-[#F3ECE1]/80 flex items-center justify-between shrink-0">
          <div>
            {title && (
              <h2 className="text-xl font-bold font-serif text-[#12101F] tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-[#575266] mt-0.5">{subtitle}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#575266] hover:text-[#12101F] hover:bg-black/5 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[#E8E2D8] bg-[#F3ECE1]/80 flex items-center justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
