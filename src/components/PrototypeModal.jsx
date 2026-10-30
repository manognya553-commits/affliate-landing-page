import React, { useEffect, useRef } from 'react'
import { X, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function PrototypeModal({ isOpen, onClose, onNavigateHowItWorks, onNavigateFaqs }) {
  const modalRef = useRef(null)

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4 z-[99999] animate-[fadeIn_0.2s_ease-out]" onClick={onClose} role="presentation">
      <div
        className="bg-canvas text-ink w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-border p-6 sm:p-8 relative flex flex-col gap-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-canvas-subtle hover:bg-border/60 text-ink-muted hover:text-ink flex items-center justify-center transition-colors"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={18} aria-hidden="true" />
        </button>

        {/* Modal Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider text-brand-violet bg-brand-violet/10 border border-brand-violet/20 w-fit">
          <Sparkles size={14} className="text-brand-violet" aria-hidden="true" />
          <span>Free to Join</span>
        </div>

        {/* Modal Title */}
        <h3 id="modal-title" className="text-2xl sm:text-3xl font-headline font-bold text-ink">
          Express Your Interest
        </h3>

        {/* Modal Points */}
        <div className="space-y-3">
          <div className="flex items-start gap-2.5 text-sm text-ink-secondary">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
            <span><strong className="text-ink">100% Free:</strong> No registration fees or recurring platform costs.</span>
          </div>
          <div className="flex items-start gap-2.5 text-sm text-ink-secondary">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
            <span><strong className="text-ink">3 Launch Sectors:</strong> Healthcare, Education, and Professional Services.</span>
          </div>
          <div className="flex items-start gap-2.5 text-sm text-ink-secondary">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
            <span><strong className="text-ink">Clear Expectations:</strong> Provider-specific compensation terms apply; earnings are not guaranteed.</span>
          </div>
          <div className="flex items-start gap-2.5 text-sm text-ink-secondary">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" aria-hidden="true" />
            <span><strong className="text-ink">Tools & Support:</strong> Access service information and referral tracking tools upon rollout.</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            className="btn btn-primary text-sm py-3 px-6"
            onClick={onNavigateHowItWorks}
          >
            <span>Explore How It Works</span>
            <ArrowRight size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="btn btn-secondary text-sm py-3 px-5"
            onClick={onNavigateFaqs}
          >
            <span>Review FAQs</span>
          </button>
        </div>
      </div>
    </div>
  )
}
