import React from 'react'
import { Layers, HeartPulse, GraduationCap, Building2, MapPin } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

const SECTOR_CONFIGS = [
  {
    icon: HeartPulse,
    accentBg: 'bg-[#FF4FA3]/10',
    accentBorder: 'border-[#FF4FA3]/25',
    accentText: 'text-[#FF4FA3]',
    accentBar: 'bg-gradient-to-r from-[#FF4FA3] to-[#FF6B6B]',
    glowColor: 'from-[#FF4FA3]/15 to-transparent',
  },
  {
    icon: GraduationCap,
    accentBg: 'bg-[#16A34A]/10',
    accentBorder: 'border-[#16A34A]/25',
    accentText: 'text-[#16A34A]',
    accentBar: 'bg-gradient-to-r from-[#16A34A] to-[#D6F36B]',
    glowColor: 'from-[#16A34A]/15 to-transparent',
  },
  {
    icon: Building2,
    accentBg: 'bg-[#0D9488]/10',
    accentBorder: 'border-[#0D9488]/25',
    accentText: 'text-[#0D9488]',
    accentBar: 'bg-gradient-to-r from-[#0D9488] to-[#059669]',
    glowColor: 'from-[#0D9488]/15 to-transparent',
  },
]

export default function WhatYouCanIntroduceSection() {
  const { copy } = useLanguage()
  const data = copy.whatYouCanIntroduce || {}
  const areas = data.areas || []

  return (
    <section
      id="what-you-can-introduce"
      className="relative pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 bg-[#F3EEFF] scroll-mt-24 overflow-hidden border-b border-[#12101F]/6"
      aria-label={data.heading || 'Three Areas Where You Can Make Introductions'}
    >
      <div className="site-container relative z-10 flex flex-col gap-12 sm:gap-14 items-center">
        {/* Section Header */}
        <div data-reveal="heading" className="text-center max-w-[840px] flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/95 border border-[#6B3CFF]/15 rounded-full shadow-2xs text-xs text-[#827C94]">
            <Layers size={14} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">{data.eyebrow}</span>
          </div>

          <h2 className="section-heading font-bold text-[#12101F] tracking-tight m-0 font-headline leading-[1.2]">
            {data.heading}
          </h2>
        </div>

        {/* 3 Distinct Sector Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full" role="list">
          {areas.map((area, idx) => {
            const config = SECTOR_CONFIGS[idx % SECTOR_CONFIGS.length]
            const Icon = config.icon

            return (
              <div
                key={`area-${area.id || idx}`}
                data-reveal="card"
                className="relative bg-white rounded-[28px] card-depth p-8 sm:p-9 flex flex-col justify-between gap-6 overflow-hidden group border border-[#12101F]/8 hover:border-[#6B3CFF]/30 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md"
                role="listitem"
              >
                {/* Sector Accent Top Line */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${config.accentBar}`} />

                {/* Subtle Radial Glow */}
                <div
                  className={`absolute top-0 right-0 w-44 h-44 rounded-full bg-gradient-to-bl ${config.glowColor} pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity duration-300`}
                  aria-hidden="true"
                />

                <div className="relative z-10 flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-13 h-13 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 shadow-2xs ${config.accentBg} ${config.accentBorder}`}
                      aria-hidden="true"
                    >
                      <Icon size={24} className={config.accentText} />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-headline text-2xl font-bold text-[#12101F] tracking-tight m-0">
                      {area.title}
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-[#575266] m-0">
                      {area.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Location Variation Note */}
        {data.note && (
          <div
            data-reveal="card"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 border border-[#12101F]/10 rounded-full text-xs sm:text-sm font-medium text-[#575266] shadow-2xs"
          >
            <MapPin size={14} className="text-[#6B3CFF] shrink-0" aria-hidden="true" />
            <span>{data.note}</span>
          </div>
        )}
      </div>
    </section>
  )
}
