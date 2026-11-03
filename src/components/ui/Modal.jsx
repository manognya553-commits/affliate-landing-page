import React, { useEffect } from 'react'
import { X } from 'lucide-react'

/**
 * Reusable centered Modal dialog
 */
export default function Modal({
  isOpen = false,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-lg',
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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0E0B1E]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        className={`relative z-10 w-full ${maxWidth} bg-[#FAF7F2] text-[#12101F] rounded-2xl shadow-2xl border border-[#E8E2D8] overflow-hidden animate-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E8E2D8] bg-[#F3ECE1]/70 flex items-center justify-between">
          <h3 className="text-lg font-bold font-serif text-[#12101F]">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#575266] hover:text-[#12101F] hover:bg-black/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-[#E8E2D8] bg-[#F3ECE1]/70 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
