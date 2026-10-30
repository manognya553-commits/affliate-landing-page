import React from 'react'
import { Users, HeartHandshake, GraduationCap, Store, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

const CARD_ICONS = [HeartHandshake, GraduationCap, Store, Briefcase, Sparkles]
const ACCENT_COLORS = [
  { bg: 'bg-[#6B3CFF]/10', text: 'text-[#6B3CFF]', border: 'border-[#6B3CFF]/20' },
  { bg: 'bg-[#16A34A]/10', text: 'text-[#16A34A]', border: 'border-[#16A34A]/20' },
  { bg: 'bg-[#FF4FA3]/10', text: 'text-[#FF4FA3]', border: 'border-[#FF4FA3]/20' },
  { bg: 'bg-[#0D9488]/10', text: 'text-[#0D9488]', border: 'border-[#0D9488]/20' },
  { bg: 'bg-[#E11D48]/10', text: 'text-[#E11D48]', border: 'border-[#E11D48]/20' },
]

export default function WhoCanJoinSection() {
  const { copy } = useLanguage()
  const data = copy.whoCanJoin

  if (!data) return null

  const cards = data.cards || []

  return (
    <section
      id="who-can-join"
      className="relative py-24 lg:py-32 bg-[#FAF7F2] border-t border-[#12101F]/10 scroll-mt-24"
      aria-label={data.headline}
    >
      <div className="site-container flex flex-col gap-14 items-center">
        {/* Section Header */}
        <div className="text-center max-w-[820px] flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 border border-[#12101F]/10 rounded-full shadow-sm text-sm text-[#827C94]">
            <Users size={14} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">{data.eyebrow}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-[#12101F] tracking-tight m-0 font-headline">
            {data.headline}
          </h2>

          <p className="text-lg sm:text-xl leading-relaxed text-[#575266] max-w-[760px] m-0">
            {data.subheading}
          </p>
        </div>

        {/* 5 Cards Grid: 3 on row 1, 2 centered on row 2, each spanning 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 sm:gap-8 w-full" role="list">
          {cards.map((card, idx) => {
            const Icon = CARD_ICONS[idx % CARD_ICONS.length]
            const accent = ACCENT_COLORS[idx % ACCENT_COLORS.length]
            const gridPlacement =
              idx === 3
                ? 'md:col-span-1 lg:col-start-2 lg:col-span-2'
                : idx === 4
                ? 'md:col-span-2 md:w-1/2 md:mx-auto lg:w-full lg:mx-0 lg:col-span-2'
                : 'md:col-span-1 lg:col-span-2'

            return (
              <div
                key={`who-card-${idx}`}
                className={`relative bg-white border border-[#12101F]/10 rounded-3xl p-7 sm:p-8 flex flex-col gap-5 shadow-xl shadow-[#12101F]/5 hover:-translate-y-1 hover:border-[#6B3CFF]/30 hover:shadow-2xl hover:shadow-[#6B3CFF]/10 transition-all duration-300 group ${gridPlacement}`}
                role="listitem"
              >
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-105 ${accent.bg} ${accent.border}`}
                    aria-hidden="true"
                  >
                    <Icon size={24} className={accent.text} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold font-headline text-[#12101F] m-0">
                    {card.title}
                  </h3>
                  <p className="text-[15px] sm:text-[16px] text-[#575266] leading-relaxed m-0">
                    {card.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Closing Line Banner */}
        {data.closing && (
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-white border border-[#6B3CFF]/20 rounded-full shadow-md text-sm sm:text-base font-medium text-[#12101F] text-center max-w-3xl">
            <CheckCircle2 size={20} className="text-[#6B3CFF] shrink-0" aria-hidden="true" />
            <span>{data.closing}</span>
          </div>
        )}
      </div>
    </section>
  )
}
