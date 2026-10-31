import React from 'react'
import { ArrowRight, Sparkles, FileText } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

export default function FinalCtaSection({ onBecomeAffiliate, onOpenTerms }) {
  const { copy } = useLanguage()
  const data = copy.finalCta

  if (!data) return null

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
      className="relative py-20 lg:py-[112px] bg-[#FAF7F2] scroll-mt-24"
      aria-label={data.headline}
    >
      <div className="site-container">
        {/* Dark Stage Card per Design Plan Section 12 */}
        <div data-reveal="card" className="relative rounded-[32px] bg-[#0E0B1E] text-white p-10 sm:p-14 lg:p-20 overflow-hidden shadow-2xl flex flex-col items-center text-center gap-8">
          {/* Subtle Ambient Bloom Gradients */}
          <div
            className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#6B3CFF]/30 blur-[120px] pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#FF4FA3]/25 blur-[120px] pointer-events-none"
            aria-hidden="true"
          />

          {/* Eyebrow Pill */}
          <div className="relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs sm:text-sm font-mono text-white/80">
            <Sparkles size={14} className="text-[#D6F36B]" aria-hidden="true" />
            <span>sBLOOM Affiliate</span>
          </div>

          {/* Headline */}
          <h2 className="relative section-heading font-bold font-headline tracking-tight text-white m-0 max-w-3xl leading-[1.15]">
            {data.headline}
          </h2>

          {/* Subheading */}
          <p className="relative text-lg sm:text-xl text-white/70 max-w-xl m-0 leading-relaxed">
            {data.subheading}
          </p>

          {/* Action Row */}
          <div className="relative flex flex-col sm:flex-row items-center gap-5 mt-2">
            <button
              type="button"
              onClick={onBecomeAffiliate}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full font-bold text-base sm:text-lg bg-gradient-to-r from-[#6B3CFF] to-[#FF4FA3] text-white shadow-xl shadow-[#6B3CFF]/30 hover:shadow-2xl hover:shadow-[#6B3CFF]/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{data.primaryCta}</span>
              <ArrowRight size={18} />
            </button>

            {data.secondaryLink && (
              <a
                href="#terms"
                onClick={handleTermsClick}
                className="inline-flex items-center gap-2 text-sm sm:text-base text-white/70 hover:text-white underline underline-offset-4 transition-colors py-2 px-3"
              >
                <FileText size={16} />
                <span>{data.secondaryLink}</span>
              </a>
            )}
          </div>

          {/* Regulatory Disclaimer */}
          {data.disclaimer && (
            <p className="relative text-xs sm:text-sm text-white/55 max-w-xl m-0 leading-relaxed italic">
              {data.disclaimer}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
