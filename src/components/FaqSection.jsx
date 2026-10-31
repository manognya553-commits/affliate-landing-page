import React, { useState } from 'react'
import { HelpCircle, ChevronDown } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

export default function FaqSection() {
  const { copy } = useLanguage()
  const data = copy.faq

  // Accordion state: first item open by default per requirement
  const [openIndex, setOpenIndex] = useState(0)

  if (!data) return null

  const items = data.items || []

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx))
  }

  return (
    <section
      id="faq"
      className="relative pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-28 bg-[#FAF7F2] scroll-mt-24"
      aria-label={data.headline}
    >
      {/* Soft Gradient Fade: Dark Stage to Warm Cream (80px tall, no hard edge) */}
      <div
        className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-[#0E0B1E] to-[#FAF7F2] pointer-events-none z-10"
        aria-hidden="true"
      />

      <div className="site-container relative z-10 flex flex-col gap-10 sm:gap-12 items-center">
        {/* Section Header */}
        <div data-reveal="heading" className="text-center max-w-[820px] flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 border border-[#12101F]/10 rounded-full shadow-sm text-sm text-[#827C94]">
            <HelpCircle size={14} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">{data.eyebrow}</span>
          </div>

          <h2 className="section-heading font-bold text-[#12101F] tracking-tight m-0 font-headline">
            {data.headline}
          </h2>
        </div>

        {/* Accordion of 10 questions */}
        <div className="w-full max-w-4xl flex flex-col gap-4" role="region" aria-label={data.headline}>
          {items.map((item, idx) => {
            const isOpen = openIndex === idx

            return (
              <div
                key={`faq-item-${idx}`}
                data-reveal="faq-row"
                className={`rounded-[28px] card-depth bg-white transition-all duration-300 ${
                  isOpen
                    ? 'ring-2 ring-[#6B3CFF]/40 border-transparent shadow-lg'
                    : 'hover:border-[#6B3CFF]/30'
                }`}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left font-headline font-bold text-lg sm:text-xl text-[#12101F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B3CFF] rounded-2xl transition-colors cursor-pointer"
                  onClick={() => toggle(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      toggle(idx)
                    }
                  }}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-btn-${idx}`}
                >
                  <span className="pr-6 leading-snug">{item.question}</span>
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-[#6B3CFF]/10 text-[#6B3CFF]' : 'bg-black/5 text-[#827C94]'
                    }`}
                    aria-hidden="true"
                  >
                    <ChevronDown
                      size={20}
                      className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-btn-${idx}`}
                    className="px-6 sm:px-7 pb-6 sm:pb-7 pt-1 text-[16px] sm:text-[17px] text-[#575266] leading-relaxed border-t border-[#12101F]/5"
                  >
                    <p className="m-0 leading-relaxed whitespace-pre-line">{item.answer}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
