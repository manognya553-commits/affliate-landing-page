import React, { useState } from 'react'
import { HelpCircle, ChevronDown } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

export default function FaqSection() {
  const { copy } = useLanguage()
  const data = copy.faq || {}
  const items = data.items || []

  // Accordion state: first item open by default
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = (idx) => {
    setOpenIndex((prev) => (prev === idx ? -1 : idx))
  }

  return (
    <section
      id="faq"
      className="relative pt-18 pb-18 sm:pt-24 sm:pb-24 lg:pt-28 lg:pb-32 bg-[#FAF7F2] scroll-mt-24 border-b border-[#12101F]/6"
      aria-label={data.heading || 'FAQ'}
    >
      <div className="site-container grid grid-cols-1 lg:grid-cols-[1fr_1.8fr] gap-10 lg:gap-16 items-start">
        {/* Left Column: Title & Info */}
        <div data-reveal="heading" className="flex flex-col items-start gap-4 lg:sticky lg:top-28">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/95 border border-[#12101F]/10 rounded-full shadow-2xs text-xs text-[#827C94]">
            <HelpCircle size={13} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">{data.eyebrow}</span>
          </div>

          <h2 className="section-heading font-bold text-[#12101F] tracking-tight m-0 font-headline leading-[1.2]">
            {data.heading}
          </h2>
        </div>

        {/* Right Column: Clean Accordion */}
        <div className="w-full flex flex-col gap-3.5" role="region" aria-label={data.heading}>
          {items.map((item, idx) => {
            const isOpen = openIndex === idx

            return (
              <div
                key={`faq-item-${idx}`}
                data-reveal="faq-row"
                className={`rounded-[22px] card-depth bg-white transition-all duration-300 border ${
                  isOpen
                    ? 'border-[#6B3CFF]/40 shadow-md shadow-[#6B3CFF]/5'
                    : 'border-[#12101F]/8 hover:border-[#6B3CFF]/25'
                }`}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-headline font-bold text-base sm:text-lg text-[#12101F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B3CFF] rounded-[22px] transition-colors cursor-pointer gap-4"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                  id={`faq-btn-${idx}`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <span className="font-mono text-xs font-bold text-[#827C94] shrink-0">
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}.
                    </span>
                    <span className="leading-snug">{item.question}</span>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'bg-[#6B3CFF]/10 text-[#6B3CFF] rotate-180' : 'bg-black/5 text-[#827C94]'
                    }`}
                    aria-hidden="true"
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-btn-${idx}`}
                    className="px-5 sm:px-6 pb-5 sm:pb-6 pt-0 text-sm sm:text-base leading-relaxed text-[#575266] border-t border-[#12101F]/5 mt-1"
                  >
                    <p className="m-0 pt-3">{item.answer}</p>
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
