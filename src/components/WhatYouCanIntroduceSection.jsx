import React from 'react'
import { Layers, GraduationCap, HeartPulse, Building2, Info } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

const TILE_CONFIG = [
  {
    icon: GraduationCap,
    accentBg: 'bg-[#16A34A]/10',
    accentBorder: 'border-[#16A34A]/25',
    accentText: 'text-[#16A34A]',
    accentBar: 'bg-gradient-to-r from-[#16A34A] to-[#D6F36B]',
    glowColor: 'from-[#16A34A]/15 to-transparent',
    categoryCode: '01 · LEARNING',
  },
  {
    icon: HeartPulse,
    accentBg: 'bg-[#FF4FA3]/10',
    accentBorder: 'border-[#FF4FA3]/25',
    accentText: 'text-[#FF4FA3]',
    accentBar: 'bg-gradient-to-r from-[#FF4FA3] to-[#FF6B6B]',
    glowColor: 'from-[#FF4FA3]/15 to-transparent',
    categoryCode: '02 · CARE',
  },
  {
    icon: Building2,
    accentBg: 'bg-[#0D9488]/10',
    accentBorder: 'border-[#0D9488]/25',
    accentText: 'text-[#0D9488]',
    accentBar: 'bg-gradient-to-r from-[#0D9488] to-[#059669]',
    glowColor: 'from-[#0D9488]/15 to-transparent',
    categoryCode: '03 · ADVISORY',
  },
]

export default function WhatYouCanIntroduceSection() {
  const { copy } = useLanguage()
  const data = copy.whatYouCanIntroduce

  if (!data) return null

  const tiles = data.tiles || []

  return (
    <section
      id="what-you-can-introduce"
      className="relative pt-14 pb-14 sm:pt-16 sm:pb-16 lg:pt-20 lg:pb-24 bg-[#F3EEFF] scroll-mt-24 overflow-hidden"
      aria-label={data.headline}
    >
      {/* Soft Gradient Fade: White to Soft Violet (80px tall, smooth boundary) */}
      <div
        className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-[#FFFFFF] to-[#F3EEFF] pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Decorative Network Connection Thread across the 3 sectors (desktop only) */}
      <div className="hidden lg:block absolute top-[52%] left-1/2 -translate-x-1/2 w-[85%] max-w-5xl h-0.5 bg-gradient-to-r from-transparent via-[#6B3CFF]/20 to-transparent pointer-events-none -z-0" aria-hidden="true" />

      <div className="site-container relative z-10 flex flex-col gap-10 sm:gap-12 items-center">
        {/* Section Header */}
        <div data-reveal="heading" className="text-center max-w-[840px] flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/95 border border-[#6B3CFF]/15 rounded-full shadow-sm text-sm text-[#827C94]">
            <Layers size={14} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">{data.eyebrow}</span>
          </div>

          <h2 className="section-heading font-bold text-[#12101F] tracking-tight m-0 font-headline">
            {data.headline}
          </h2>

          <p className="text-lg sm:text-xl leading-relaxed text-[#575266] max-w-[780px] m-0">
            {data.subheading}
          </p>
        </div>

        {/* 3 Sector Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full" role="list">
          {tiles.map((tile, idx) => {
            const config = TILE_CONFIG[idx % TILE_CONFIG.length]
            const Icon = config.icon

            return (
              <div
                key={`introduce-tile-${idx}`}
                data-reveal="card"
                className="relative bg-white rounded-[28px] card-depth tilt-card p-6 sm:p-8 lg:p-9 flex flex-col justify-between gap-6 overflow-hidden group border border-[#12101F]/8 hover:border-[#6B3CFF]/30 transition-all duration-300"
                role="listitem"
              >
                {/* Sector Accent Top Line */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${config.accentBar}`} />

                {/* Subtle Sector Ambient Glow on Hover */}
                <div
                  className={`absolute top-0 right-0 w-48 h-48 rounded-full bg-gradient-to-bl ${config.glowColor} pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity duration-300 -z-0`}
                  aria-hidden="true"
                />

                <div className="relative z-10 flex items-center justify-between">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 shadow-xs ${config.accentBg} ${config.accentBorder}`}
                    aria-hidden="true"
                  >
                    <Icon size={28} className={config.accentText} />
                  </div>

                  <span className="font-mono text-xs font-bold text-[#827C94] tracking-wider">
                    {config.categoryCode}
                  </span>
                </div>

                <div className="relative z-10 flex flex-col gap-3">
                  <h3 className="text-2xl font-bold font-headline text-[#12101F] tracking-tight m-0">
                    {tile.title}
                  </h3>
                  <p className="text-[16px] sm:text-[17px] text-[#575266] leading-relaxed m-0">
                    {tile.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Note Box */}
        {data.note && (
          <div data-reveal="extra" className="flex items-center gap-3.5 px-6 sm:px-8 py-4 sm:py-5 bg-white border border-[#6B3CFF]/25 rounded-2xl text-sm sm:text-base text-[#12101F] font-medium shadow-md shadow-[#6B3CFF]/5 max-w-2xl text-center">
            <Info size={20} className="text-[#6B3CFF] shrink-0" aria-hidden="true" />
            <span className="leading-relaxed">{data.note}</span>
          </div>
        )}
      </div>
    </section>
  )
}

