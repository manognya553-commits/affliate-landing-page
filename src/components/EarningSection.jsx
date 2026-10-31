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
      className="relative pt-16 pb-16 sm:pt-20 sm:pb-20 lg:pt-24 lg:pb-28 bg-[#0E0B1E] text-white scroll-mt-24 overflow-hidden"
      aria-label={data.headline}
    >
      {/* Soft Gradient Fade: Soft Violet to Dark Stage (80px tall, no hard edge) */}
      <div
        className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-[#F3EEFF] to-[#0E0B1E] pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Soft Blurred Gradient Shapes behind heading on dark stage (aria-hidden) */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 pointer-events-none overflow-hidden -z-0" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-[#6B3CFF] opacity-[0.20] blur-[100px]" />
        <div className="absolute top-10 right-1/4 w-72 h-72 rounded-full bg-[#FF4FA3] opacity-[0.18] blur-[90px]" />
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#D6F36B] opacity-[0.18] blur-[85px]" />
      </div>

      <div className="site-container relative z-10 flex flex-col gap-10 sm:gap-12 items-center">
        {/* Section Header */}
        <div data-reveal="heading" className="text-center max-w-[820px] flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/15 rounded-full shadow-sm text-sm text-[#C4B5FD]">
            <TrendingUp size={14} className="text-[#D6F36B]" aria-hidden="true" />
            <span className="font-mono">{data.eyebrow}</span>
          </div>

          <h2 className="section-heading font-bold text-white tracking-tight m-0 font-headline">
            {data.headline}
          </h2>

          <p className="text-lg sm:text-xl leading-relaxed text-white/90 max-w-[760px] m-0">
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
                data-reveal="card"
                className="relative rounded-[28px] card-dark-depth tilt-card p-7 sm:p-8 flex flex-col gap-4 overflow-hidden group"
                role="listitem"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-2xl bg-[#6B3CFF]/20 border border-[#6B3CFF]/35 text-[#D6F36B] flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                    aria-hidden="true"
                  >
                    <Icon size={22} />
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#C4B5FD]">
                    0{idx + 1}
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-lg sm:text-xl font-bold font-headline text-white m-0 leading-snug min-h-[2.8em] flex items-start">
                    {block.title}
                  </h3>
                  <p className="text-[14.5px] sm:text-[15px] text-white/85 leading-relaxed m-0">
                    {block.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Worked Example Card: Intro and footnote shown; rows & total hidden per specification */}
        {example && (
          <div
            data-reveal="extra"
            className="w-full max-w-4xl bg-[#161226] border border-[#6B3CFF]/35 rounded-[28px] card-dark-depth tilt-card p-8 sm:p-10 flex flex-col gap-5"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#6B3CFF]/25 text-[#D6F36B] flex items-center justify-center" aria-hidden="true">
                <Calendar size={18} />
              </div>
              <span className="font-headline font-bold text-lg sm:text-xl text-white">
                {example.title}
              </span>
            </div>

            <p className="text-base sm:text-lg text-white/95 leading-relaxed m-0 font-medium">
              {example.intro}
            </p>

            {/* Note: rows and total are hidden until real verified amounts are provided */}

            {example.footnote && (
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed italic m-0 pt-4 border-t border-white/10">
                {example.footnote}
              </p>
            )}
          </div>
        )}

        {/* Regulatory Caution / No Guarantee */}
        {(data.caution || data.noGuarantee) && (
          <div
            data-reveal="extra"
            className="w-full max-w-4xl flex items-center gap-3 p-5 bg-amber-500/10 border border-amber-400/30 rounded-2xl text-amber-100 text-sm sm:text-base font-medium shadow-sm"
          >
            <ShieldAlert size={22} className="text-amber-400 shrink-0" aria-hidden="true" />
            <span className="leading-relaxed text-amber-100">{data.caution || data.noGuarantee}</span>
          </div>
        )}
      </div>
    </section>
  )
}
