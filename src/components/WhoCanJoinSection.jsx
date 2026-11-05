import React from 'react'
import { Users, HeartHandshake, GraduationCap, Store, Briefcase, Sparkles } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

const PERSONA_CONFIGS = [
  {
    icon: HeartHandshake,
    accentBg: 'bg-[#6B3CFF]/10 text-[#6B3CFF] border-[#6B3CFF]/20',
    topBar: 'bg-gradient-to-r from-[#6B3CFF] to-[#8B5CF6]',
  },
  {
    icon: GraduationCap,
    accentBg: 'bg-[#16A34A]/10 text-[#16A34A] border-[#16A34A]/20',
    topBar: 'bg-gradient-to-r from-[#16A34A] to-[#D6F36B]',
  },
  {
    icon: Store,
    accentBg: 'bg-[#FF4FA3]/10 text-[#FF4FA3] border-[#FF4FA3]/20',
    topBar: 'bg-gradient-to-r from-[#FF4FA3] to-[#FF6B6B]',
  },
  {
    icon: Briefcase,
    accentBg: 'bg-[#0D9488]/10 text-[#0D9488] border-[#0D9488]/20',
    topBar: 'bg-gradient-to-r from-[#0D9488] to-[#059669]',
  },
  {
    icon: Sparkles,
    accentBg: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20',
    topBar: 'bg-gradient-to-r from-[#F59E0B] to-[#FBBF24]',
  },
]

export default function WhoCanJoinSection() {
  const { copy } = useLanguage()
  const data = copy.whoCanJoin || {}
  const cards = data.cards || []

  return (
    <section
      id="who-can-join"
      className="relative pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 bg-white scroll-mt-24 border-b border-[#12101F]/6 overflow-hidden"
      aria-label={data.heading || 'Who Can Join'}
    >
      <div className="site-container flex flex-col items-center gap-12 lg:gap-14">
        {/* Section Header */}
        <div data-reveal="heading" className="text-center max-w-[820px] flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF7F2] border border-[#12101F]/10 rounded-full shadow-2xs text-xs text-[#827C94]">
            <Users size={14} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">{data.eyebrow}</span>
          </div>

          <h2 className="section-heading font-bold text-[#12101F] tracking-tight m-0 font-headline leading-[1.2]">
            {data.heading}
          </h2>

          <p className="text-base sm:text-lg leading-relaxed text-[#575266] m-0 max-w-[600px]">
            {data.description}
          </p>
        </div>

        {/* 5 Inclusive Persona Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 w-full max-w-5xl" role="list">
          {cards.map((card, idx) => {
            const config = PERSONA_CONFIGS[idx % PERSONA_CONFIGS.length]
            const Icon = config.icon

            return (
              <div
                key={`persona-${card.id || idx}`}
                data-reveal="card"
                className="relative bg-[#FAF7F2] rounded-[28px] card-depth p-7 sm:p-8 flex flex-col justify-between gap-5 border border-[#12101F]/8 hover:border-[#6B3CFF]/30 transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-md overflow-hidden group"
                role="listitem"
              >
                {/* Accent Top Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${config.topBar}`} />

                <div className="flex flex-col gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${config.accentBg}`}>
                    <Icon size={22} aria-hidden="true" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-headline text-xl sm:text-2xl font-bold text-[#12101F] tracking-tight m-0">
                      {card.title}
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-[#575266] m-0">
                      {card.description}
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
