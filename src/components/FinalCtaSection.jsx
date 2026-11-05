import React from 'react'
import { ArrowRight, Sparkles, FileText } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

export default function FinalCtaSection({ onBecomeAffiliate, onOpenTerms }) {
  const { copy } = useLanguage()
  const data = copy.finalCta || {}

  const handleTermsClick = (e) => {
    e.preventDefault()
    if (onOpenTerms) {
      onOpenTerms()
    } else {
      const termsTrigger = document.querySelector('footer a[href*="terms"]')
      if (termsTrigger) {
        termsTrigger.click()
      }
    }
  }

  return (
    <section
      id="final-cta"
      className="relative py-20 lg:py-28 bg-[#FAF7F2] scroll-mt-24 border-b border-[#12101F]/6"
      aria-label={data.heading || 'Final CTA'}
    >
      <div className="site-container">
        {/* Dark Stage Card per Design Plan */}
        <div
          data-reveal="card"
          className="relative rounded-[36px] bg-[#0E0B1E] text-white p-10 sm:p-14 lg:p-20 overflow-hidden shadow-2xl flex flex-col items-center text-center gap-7 border border-white/12"
        >
          {/* Subtle Ambient Bloom Gradients */}
          <div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#6B3CFF]/25 blur-[120px] pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#FF4FA3]/20 blur-[120px] pointer-events-none"
            aria-hidden="true"
          />

          {/* Heading */}
          <h2 className="relative section-heading font-bold font-headline tracking-tight text-white m-0 max-w-2xl leading-[1.18]">
            {data.heading}
          </h2>

          {/* Description */}
          <p className="relative text-base sm:text-lg text-white/75 max-w-xl m-0 leading-relaxed">
            {data.description}
          </p>

          {/* Action Row */}
          <div className="relative flex flex-col sm:flex-row items-center gap-4 mt-2">
            <button
              type="button"
              onClick={onBecomeAffiliate}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full font-bold text-base sm:text-lg bg-[#6B3CFF] hover:bg-[#5025D1] text-white shadow-xl shadow-[#6B3CFF]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border-none"
            >
              <span>{data.primaryCta}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </button>

            {data.secondaryLink && (
              <a
                href="#terms"
                onClick={handleTermsClick}
                className="inline-flex items-center gap-2 text-sm sm:text-base text-white/75 hover:text-white underline underline-offset-4 transition-colors py-2 px-3 font-mono text-xs"
              >
                <FileText size={15} aria-hidden="true" />
                <span>{data.secondaryLink}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
