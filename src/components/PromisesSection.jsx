import React, { useRef, useState, useEffect } from 'react'
import { HandHeart, ShieldCheck, Compass, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

const PROMISE_ICONS = [ShieldCheck, Compass, CheckCircle2]

export default function PromisesSection() {
  const { copy } = useLanguage()
  const data = copy.promises || {}
  const promises = data.promises || []

  return (
    <section
      id="promises"
      className="relative pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 bg-[#FAF7F2] overflow-hidden scroll-mt-24 border-b border-[#12101F]/6"
      aria-label={data.heading || 'Three Important Promises'}
    >
      <div className="site-container flex flex-col gap-12 sm:gap-14 items-center">
        {/* Section Header */}
        <div data-reveal="heading" className="text-center max-w-[820px] flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 border border-[#12101F]/10 rounded-full shadow-2xs text-xs text-[#827C94]">
            <HandHeart size={14} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">{data.eyebrow}</span>
          </div>

          <h2 className="section-heading font-bold text-[#12101F] tracking-tight m-0 font-headline leading-[1.2]">
            {data.heading}
          </h2>
        </div>

        {/* Three Clean Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full" role="list">
          {promises.map((promise, idx) => {
            const Icon = PROMISE_ICONS[idx % PROMISE_ICONS.length]

            const colors = [
              {
                iconBg: 'bg-[#6B3CFF]/10 text-[#6B3CFF] border-[#6B3CFF]/20',
                topBar: 'bg-gradient-to-r from-[#6B3CFF] to-[#8B5CF6]',
                accentBorder: 'hover:border-[#6B3CFF]/40',
              },
              {
                iconBg: 'bg-[#FF4FA3]/10 text-[#FF4FA3] border-[#FF4FA3]/20',
                topBar: 'bg-gradient-to-r from-[#FF4FA3] to-[#FF6B6B]',
                accentBorder: 'hover:border-[#FF4FA3]/40',
              },
              {
                iconBg: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
                topBar: 'bg-gradient-to-r from-[#10B981] to-[#D6F36B]',
                accentBorder: 'hover:border-[#10B981]/40',
              },
            ][idx % 3]

            return (
              <div
                key={`promise-${idx}`}
                data-reveal="card"
                className={`relative bg-white rounded-[28px] card-depth p-8 sm:p-9 flex flex-col justify-between gap-6 overflow-hidden group border border-[#12101F]/8 ${colors.accentBorder} transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md`}
                role="listitem"
              >
                {/* Accent Top Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${colors.topBar}`} />

                <div className="relative z-10 flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <div className={`w-13 h-13 rounded-2xl flex items-center justify-center border ${colors.iconBg}`}>
                      <Icon size={24} aria-hidden="true" />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#827C94] tracking-wider">
                      {promise.number || `0${idx + 1}`}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <h3 className="font-headline text-xl sm:text-2xl font-bold text-[#12101F] tracking-tight m-0">
                      {promise.title}
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-[#575266] m-0">
                      {promise.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
