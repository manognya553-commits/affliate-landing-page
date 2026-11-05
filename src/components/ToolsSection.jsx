import React from 'react'
import { BookOpen, Compass, HelpCircle, Clock, Sparkles } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

const FEATURE_ICONS = [BookOpen, Compass, HelpCircle]

export default function ToolsSection() {
  const { copy } = useLanguage()
  const data = copy.tools || {}
  const features = data.features || []

  return (
    <section
      id="tools"
      className="relative pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 bg-[#FAF7F2] scroll-mt-24 border-b border-[#12101F]/6 overflow-hidden"
      aria-label={data.heading || 'Knowledge & Support'}
    >
      <div className="site-container flex flex-col items-center gap-12 lg:gap-14">
        {/* Section Header */}
        <div data-reveal="heading" className="text-center max-w-[820px] flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/95 border border-[#12101F]/10 rounded-full shadow-2xs text-xs text-[#827C94]">
            <Sparkles size={13} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">{data.eyebrow}</span>
          </div>

          <h2 className="section-heading font-bold text-[#12101F] tracking-tight m-0 font-headline leading-[1.2]">
            {data.heading}
          </h2>

          <p className="text-base sm:text-lg leading-relaxed text-[#575266] m-0 max-w-[680px]">
            {data.description}
          </p>
        </div>

        {/* 3 Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full" role="list">
          {features.map((feature, idx) => {
            const Icon = FEATURE_ICONS[idx % FEATURE_ICONS.length]

            return (
              <div
                key={`feature-${idx}`}
                data-reveal="card"
                className="relative bg-white rounded-[28px] card-depth p-8 sm:p-9 flex flex-col justify-between gap-6 border border-[#12101F]/8 transition-all duration-300 hover:border-[#6B3CFF]/30 hover:-translate-y-1 shadow-sm hover:shadow-md"
                role="listitem"
              >
                <div className="flex flex-col gap-5">
                  <div className="w-13 h-13 rounded-2xl bg-[#6B3CFF]/10 text-[#6B3CFF] border border-[#6B3CFF]/20 flex items-center justify-center">
                    <Icon size={24} aria-hidden="true" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-headline text-xl sm:text-2xl font-bold text-[#12101F] tracking-tight m-0">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-[#575266] m-0">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Clear Availability Note Banner */}
        {data.availabilityNote && (
          <div
            data-reveal="card"
            className="w-full max-w-3xl bg-white/90 border border-[#6B3CFF]/25 rounded-2xl p-4 sm:p-5 flex items-center gap-3.5 shadow-2xs text-[#575266]"
          >
            <div className="w-9 h-9 rounded-xl bg-[#6B3CFF]/10 text-[#6B3CFF] flex items-center justify-center shrink-0">
              <Clock size={18} aria-hidden="true" />
            </div>
            <p className="text-xs sm:text-sm leading-relaxed m-0 font-medium">
              {data.availabilityNote}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
