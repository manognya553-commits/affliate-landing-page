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
    pillBg: 'bg-[#16A34A]/15 text-[#16A34A]',
  },
  {
    icon: HeartPulse,
    accentBg: 'bg-[#FF4FA3]/10',
    accentBorder: 'border-[#FF4FA3]/25',
    accentText: 'text-[#FF4FA3]',
    accentBar: 'bg-gradient-to-r from-[#FF4FA3] to-[#FF6B6B]',
    pillBg: 'bg-[#FF4FA3]/15 text-[#FF4FA3]',
  },
  {
    icon: Building2,
    accentBg: 'bg-[#0D9488]/10',
    accentBorder: 'border-[#0D9488]/25',
    accentText: 'text-[#0D9488]',
    accentBar: 'bg-gradient-to-r from-[#0D9488] to-[#059669]',
    pillBg: 'bg-[#0D9488]/15 text-[#0D9488]',
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
      className="relative py-24 lg:py-32 bg-white border-t border-[#12101F]/10 scroll-mt-24"
      aria-label={data.headline}
    >
      <div className="site-container flex flex-col gap-14 items-center">
        {/* Section Header */}
        <div className="text-center max-w-[820px] flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF7F2] border border-[#12101F]/10 rounded-full shadow-sm text-sm text-[#827C94]">
            <Layers size={14} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">{data.eyebrow}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-[#12101F] tracking-tight m-0 font-headline">
            {data.headline}
          </h2>

          <p className="text-lg sm:text-xl leading-relaxed text-[#575266] max-w-[760px] m-0">
            {data.subheading}
          </p>
        </div>

        {/* 3 Sector Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full" role="list">
          {tiles.map((tile, idx) => {
            const config = TILE_CONFIG[idx % TILE_CONFIG.length]
            const Icon = config.icon

            return (
              <div
                key={`introduce-tile-${idx}`}
                className="relative bg-[#FAF7F2] border border-[#12101F]/10 rounded-3xl p-8 sm:p-10 flex flex-col gap-6 shadow-xl shadow-[#12101F]/5 hover:-translate-y-1.5 hover:shadow-2xl hover:border-[#6B3CFF]/30 transition-all duration-300 overflow-hidden group"
                role="listitem"
              >
                {/* Sector Accent Top Line */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${config.accentBar}`} />

                <div className="flex items-center">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-105 ${config.accentBg} ${config.accentBorder}`}
                    aria-hidden="true"
                  >
                    <Icon size={28} className={config.accentText} />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h3 className="text-2xl font-bold font-headline text-[#12101F] m-0">
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
          <div className="flex items-center gap-3 px-6 py-4 bg-[#FAF7F2] border border-[#6B3CFF]/20 rounded-2xl text-sm sm:text-base text-[#12101F] font-medium shadow-sm max-w-2xl text-center">
            <Info size={20} className="text-[#6B3CFF] shrink-0" aria-hidden="true" />
            <span>{data.note}</span>
          </div>
        )}
      </div>
    </section>
  )
}
