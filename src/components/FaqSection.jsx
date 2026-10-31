import React, { useState } from 'react'
import { HelpCircle, ChevronDown } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

export default function FaqSection() {
  const { lang, copy } = useLanguage()
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
      className="relative pt-18 pb-18 sm:pt-24 sm:pb-24 lg:pt-28 lg:pb-32 bg-[#FAF7F2] scroll-mt-24 border-b border-[#12101F]/6"
      aria-label={data.headline}
    >
      {/* Soft Gradient Fade: Dark Stage to Warm Cream (80px tall) */}
      <div
        className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-[#0E0B1E] to-[#FAF7F2] pointer-events-none z-10"
        aria-hidden="true"
      />

      <div className="site-container relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10 lg:gap-16 items-start">
        {/* Left Sticky Column: Section Title & Information */}
        <div data-reveal="heading" className="flex flex-col items-start gap-4 lg:sticky lg:top-28">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 border border-[#12101F]/10 rounded-full shadow-2xs text-xs text-[#827C94]">
            <HelpCircle size={13} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">04 // {data.eyebrow}</span>
          </div>

          <h2 className="section-heading font-bold text-[#12101F] tracking-tight m-0 font-headline">
            {data.headline}
          </h2>

          <p className="text-base sm:text-lg leading-relaxed text-[#575266] m-0 max-w-[420px]">
            {lang === 'te'
              ? 'ప్రోగ్రామ్‌లో చేరడం, పరిచయం చేయడం మరియు పరిహారం గురించిన పూర్తి వివరాలు.'
              : 'Clear answers on joining the network, making introductions, and how provider compensation works.'}
          </p>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#6B3CFF] hover:underline pt-2"
          >
            <span>{lang === 'te' ? 'ఇతర సందేహాలు ఉన్నాయా? సంప్రదించండి →' : 'Still have questions? Get in touch →'}</span>
          </a>
        </div>

        {/* Right Column: Accordion of questions */}
        <div className="w-full flex flex-col gap-3.5" role="region" aria-label={data.headline}>
          {items.map((item, idx) => {
            const isOpen = openIndex === idx

            return (
              <div
                key={`faq-item-${idx}`}
                data-reveal="faq-row"
                className={`rounded-[24px] card-depth bg-white transition-all duration-300 border ${
                  isOpen
                    ? 'border-[#6B3CFF]/45 shadow-lg shadow-[#6B3CFF]/8'
                    : 'border-[#12101F]/8 hover:border-[#6B3CFF]/30'
                }`}
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left font-headline font-bold text-base sm:text-lg text-[#12101F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6B3CFF] rounded-[24px] transition-colors cursor-pointer gap-4"
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
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <span className="font-mono text-xs font-bold text-[#827C94] shrink-0">
                      Q.0{idx + 1 < 10 ? `0${idx + 1}` : idx + 1} //
                    </span>
                    <span className="leading-snug">{item.question}</span>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-[#6B3CFF]/10 text-[#6B3CFF]' : 'bg-black/5 text-[#827C94]'
                    }`}
                    aria-hidden="true"
                  >
                    <ChevronDown
                      size={18}
                      className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    role="region"
                    aria-labelledby={`faq-btn-${idx}`}
                    className="px-5 sm:px-6 pb-6 pt-1 text-[15px] sm:text-[16px] text-[#575266] leading-relaxed border-t border-[#12101F]/6"
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
