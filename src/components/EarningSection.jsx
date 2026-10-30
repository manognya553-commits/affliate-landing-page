import React from 'react'
import { TrendingUp, SlidersHorizontal, CheckCircle2, Receipt, Landmark, Calendar, ShieldAlert } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

const BLOCK_ICONS = [SlidersHorizontal, CheckCircle2, Receipt, Landmark]

export default function EarningSection() {
  const { copy } = useLanguage()
  const data = copy.earning

  if (!data) return null

  const blocks = data.blocks || []
  const example = data.example

  return (
    <section
      id="earning"
      className="relative py-24 lg:py-32 bg-[#FAF7F2] border-t border-[#12101F]/10 scroll-mt-24"
      aria-label={data.headline}
    >
      <div className="site-container flex flex-col gap-14 items-center">
        {/* Section Header */}
        <div className="text-center max-w-[820px] flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 border border-[#12101F]/10 rounded-full shadow-sm text-sm text-[#827C94]">
            <TrendingUp size={14} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">{data.eyebrow}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-[#12101F] tracking-tight m-0 font-headline">
            {data.headline}
          </h2>

          <p className="text-lg sm:text-xl leading-relaxed text-[#575266] max-w-[760px] m-0">
            {data.subheading}
          </p>
        </div>

        {/* 4 Earning Feature Blocks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full" role="list">
          {blocks.map((block, idx) => {
            const Icon = BLOCK_ICONS[idx % BLOCK_ICONS.length]

            return (
              <div
                key={`earning-block-${idx}`}
                className="relative bg-white border border-[#12101F]/10 rounded-3xl p-7 flex flex-col gap-4 shadow-xl shadow-[#12101F]/5 hover:-translate-y-1 hover:border-[#6B3CFF]/30 hover:shadow-2xl hover:shadow-[#6B3CFF]/10 transition-all duration-300 group"
                role="listitem"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-2xl bg-[#6B3CFF]/10 border border-[#6B3CFF]/15 text-[#6B3CFF] flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                    aria-hidden="true"
                  >
                    <Icon size={22} />
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#827C94]">
                    0{idx + 1}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-lg sm:text-xl font-bold font-headline text-[#12101F] m-0 leading-snug min-h-[2.8em] flex items-start">
                    {block.title}
                  </h3>
                  <p className="text-[14.5px] sm:text-[15px] text-[#575266] leading-relaxed m-0">
                    {block.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Worked Example Card: Intro and footnote shown; rows & total hidden per specification */}
        {example && (
          <div className="w-full max-w-4xl bg-gradient-to-br from-white to-[#FAF7F2] border border-[#6B3CFF]/25 rounded-3xl p-8 sm:p-10 shadow-xl shadow-[#6B3CFF]/5 flex flex-col gap-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#6B3CFF]/10 text-[#6B3CFF] flex items-center justify-center" aria-hidden="true">
                <Calendar size={18} />
              </div>
              <span className="font-headline font-bold text-lg sm:text-xl text-[#12101F]">
                {example.title}
              </span>
            </div>

            <p className="text-base sm:text-lg text-[#12101F] leading-relaxed m-0 font-medium">
              {example.intro}
            </p>

            {/* Note: rows and total are hidden until real verified amounts are provided */}

            {example.footnote && (
              <p className="text-xs sm:text-sm text-[#827C94] leading-relaxed italic m-0 pt-4 border-t border-[#12101F]/10">
                {example.footnote}
              </p>
            )}
          </div>
        )}

        {/* No Guarantee Regulatory Line */}
        {data.noGuarantee && (
          <div className="w-full max-w-4xl flex items-center gap-3 p-5 bg-amber-500/10 border border-amber-500/25 rounded-2xl text-amber-950 text-sm sm:text-base font-medium shadow-sm">
            <ShieldAlert size={22} className="text-amber-700 shrink-0" aria-hidden="true" />
            <span className="leading-relaxed">{data.noGuarantee}</span>
          </div>
        )}
      </div>
    </section>
  )
}
