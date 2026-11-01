import React, { useState, useEffect, useRef, useCallback } from 'react'
import { X, ShieldCheck, FileText } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

export default function FooterSection({
  activeModal: controlledModal,
  onOpenTerms,
  onOpenPrivacy,
  onCloseModal,
}) {
  const { lang, copy } = useLanguage()
  const [internalModal, setInternalModal] = useState(null)
  const isControlled = controlledModal !== undefined
  const activeModal = isControlled ? controlledModal : internalModal

  const modalRef = useRef(null)
  const closeBtnRef = useRef(null)

  const handleOpenTerms = (e) => {
    e.preventDefault()
    if (onOpenTerms) onOpenTerms()
    else setInternalModal('terms')
  }

  const handleOpenPrivacy = (e) => {
    e.preventDefault()
    if (onOpenPrivacy) onOpenPrivacy()
    else setInternalModal('privacy')
  }

  const handleClose = useCallback(() => {
    if (onCloseModal) onCloseModal()
    else setInternalModal(null)
  }, [onCloseModal])

  // Handle focus management, keyboard trap, and body scroll lock when modal is open
  useEffect(() => {
    if (!activeModal) return

    const lastActive = document.activeElement
    document.body.style.overflow = 'hidden'

    // Focus the close button once modal mounts
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus()
    }, 50)

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleClose()
        return
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) return

        const firstEl = focusables[0]
        const lastEl = focusables[focusables.length - 1]

        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault()
          lastEl.focus()
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      if (lastActive && typeof lastActive.focus === 'function') {
        lastActive.focus()
      }
    }
  }, [activeModal, handleClose])

  return (
    <footer className="bg-[#0E0B1E] text-white/70 pt-16 pb-12 mt-auto border-t border-white/10" aria-label="Footer">
      <div className="site-container flex flex-col gap-10">
        {/* Top / Main Footer Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start flex-wrap gap-8">
          <div className="flex flex-col gap-2">
            <a href="#hero" className="inline-flex items-center font-headline text-2xl font-bold tracking-tight text-white no-underline" aria-label="sBLOOM Home">
              <span className="text-[#C4B5FD] italic font-extrabold mr-0.5">s</span>
              <span className="text-white">BLOOM</span>
            </a>
            <p className="text-sm text-white/55 m-0">{copy.footer.descriptor}</p>
          </div>

          <div className="flex flex-col sm:items-end items-start gap-4">
            <div className="flex items-center gap-3">
              <a href="#terms" onClick={handleOpenTerms} className="inline-flex items-center gap-1.5 text-sm text-white/85 no-underline transition-colors hover:text-[#D6F36B]">
                <FileText size={15} aria-hidden="true" />
                <span>{copy.footer.termsLink}</span>
              </a>
              <span className="text-white/25 text-[10px]" aria-hidden="true">•</span>
              <a href="#privacy" onClick={handleOpenPrivacy} className="inline-flex items-center gap-1.5 text-sm text-white/85 no-underline transition-colors hover:text-[#D6F36B]">
                <ShieldCheck size={15} aria-hidden="true" />
                <span>{copy.footer.privacyLink}</span>
              </a>
            </div>

            {/* Footer contact row is hidden until real details exist (logged in docs/open-items.md) */}
            {copy.footer.contactDetails && (
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/20 px-3.5 py-1.5 rounded-lg text-xs text-white/60" aria-label="Contact Information">
                <span className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-[10px] tracking-wider uppercase">Contact</span>
                <span>{copy.footer.contactDetails}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Microcopy & Year */}
        <div className="flex flex-col sm:flex-row justify-between items-center flex-wrap gap-4 pt-6 border-t border-white/10 text-xs text-white/50">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] text-[#C4B5FD]/80">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D6F36B] animate-pulse" aria-hidden="true" />
            <span>sBLOOM AFFILIATE PROGRAMME // ACTIVE</span>
          </div>

          <p className="m-0 font-mono text-[11px]">
            © 2026 sBLOOM. All rights reserved.
          </p>
        </div>
      </div>

      {/* Clean Modal for Terms / Privacy */}
      {activeModal && (
        <div className="fixed inset-0 bg-[#0E0B1E]/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-[fadeIn_0.2s_ease-out]" onClick={handleClose} role="presentation">
          <div
            ref={modalRef}
            className="bg-[#FAF7F2] text-[#12101F] w-full max-w-[560px] rounded-3xl shadow-2xl overflow-hidden border border-[#E8E2D8]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="footer-modal-heading"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center px-6 py-5 border-b border-[#E8E2D8] bg-white">
              <h3 id="footer-modal-heading" className="font-headline text-lg font-bold text-[#12101F] m-0">
                {activeModal === 'terms' ? copy.footer.termsLink : copy.footer.privacyLink}
              </h3>
              <button
                ref={closeBtnRef}
                type="button"
                className="text-[#827C94] hover:text-[#12101F] hover:bg-black/5 p-1 rounded-lg transition-all"
                onClick={handleClose}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              {activeModal === 'terms' ? (
                <div className="bg-white border border-[#12101F]/10 rounded-2xl p-6 shadow-sm">
                  <p className="text-sm sm:text-base text-[#575266] m-0 leading-relaxed">{copy.footer.legalPlaceholder}</p>
                </div>
              ) : (
                <div className="bg-white border border-[#12101F]/10 rounded-2xl p-6 shadow-sm">
                  <p className="text-sm sm:text-base text-[#575266] m-0 leading-relaxed">
                    {lang === 'te'
                      ? 'మీ డీటెయిల్స్ మా వద్దే సేఫ్‌గా ఉంటాయి. మీతో మాట్లాడటానికి తప్ప వేరే ఎవరికీ మీ డీటెయిల్స్ ఇవ్వము.'
                      : 'Your details stay with the programme and are used only to communicate with you about your application. We never share your personal information with third parties.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}
