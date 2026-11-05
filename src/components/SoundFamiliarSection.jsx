import React from 'react'
import { MessageSquare } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'
import WhyJoinVideoExplainer from './WhyJoinVideoExplainer'

export default function SoundFamiliarSection() {
  const { copy } = useLanguage()
  const data = copy.soundFamiliar || {}

  return (
    <section
      id="why-join"
      className="relative bg-[#FAF7F2] scroll-mt-24 py-16 lg:py-24 overflow-hidden border-b border-[#12101F]/6"
      aria-label={data.heading || 'Why Join'}
    >
      <div className="site-container">
        {/* Narrative & Interactive Video Explainer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial Storytelling */}
          <div data-reveal="heading" className="flex flex-col items-start gap-5 max-w-[560px]">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/95 border border-[#12101F]/10 rounded-full shadow-2xs text-xs text-[#827C94]">
              <MessageSquare size={13} className="text-[#6B3CFF]" aria-hidden="true" />
              <span className="font-mono">{data.eyebrow}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#12101F] tracking-tight m-0 font-headline leading-[1.18]">
              {data.heading}
            </h2>

            <p className="text-base sm:text-lg lg:text-[19px] leading-relaxed text-[#575266] m-0">
              {data.description}
            </p>
          </div>

          {/* Right Column: Retained Interactive Video Explainer */}
          <div data-reveal="card" className="w-full">
            <WhyJoinVideoExplainer />
          </div>
        </div>
      </div>
    </section>
  )
}
