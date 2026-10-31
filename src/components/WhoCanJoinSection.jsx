import React from 'react'
import { Users, CheckCircle2, Store, Briefcase, Sparkles, HeartHandshake, GraduationCap } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

// Visual configuration for each persona profile (combining human-centred photography & restrained network graphics)
const PERSONA_CONFIGS = [
  {
    type: 'photo',
    image: '/assets/persona-homemaker.jpg',
    alt: 'Friendly South Indian homemaker in a bright home living room',
    fallbackIcon: HeartHandshake,
    accentBg: 'bg-[#6B3CFF]/10',
    accentBorder: 'border-[#6B3CFF]/20',
    accentText: 'text-[#6B3CFF]',
    glowColor: 'from-[#6B3CFF]/15 to-transparent',
    tag: 'Community & Family',
  },
  {
    type: 'photo',
    image: '/assets/persona-student.jpg',
    alt: 'Energetic South Indian college student on a university campus',
    fallbackIcon: GraduationCap,
    accentBg: 'bg-[#16A34A]/10',
    accentBorder: 'border-[#16A34A]/20',
    accentText: 'text-[#16A34A]',
    glowColor: 'from-[#16A34A]/15 to-transparent',
    tag: 'Campus & Peers',
  },
  {
    type: 'avatar',
    fallbackIcon: Store,
    accentBg: 'bg-[#FF4FA3]/10',
    accentBorder: 'border-[#FF4FA3]/20',
    accentText: 'text-[#FF4FA3]',
    avatarGradient: 'from-[#FF4FA3] to-[#E11D48]',
    glowColor: 'from-[#FF4FA3]/15 to-transparent',
    tag: 'Daily Customers',
  },
  {
    type: 'avatar',
    fallbackIcon: Briefcase,
    accentBg: 'bg-[#0D9488]/10',
    accentBorder: 'border-[#0D9488]/20',
    accentText: 'text-[#0D9488]',
    avatarGradient: 'from-[#0D9488] to-[#059669]',
    glowColor: 'from-[#0D9488]/15 to-transparent',
    tag: 'Workplace & Alumni',
  },
  {
    type: 'avatar',
    fallbackIcon: Sparkles,
    accentBg: 'bg-[#8B5CF6]/10',
    accentBorder: 'border-[#8B5CF6]/20',
    accentText: 'text-[#8B5CF6]',
    avatarGradient: 'from-[#6B3CFF] via-[#FF4FA3] to-[#D6F36B]',
    glowColor: 'from-[#6B3CFF]/15 to-transparent',
    tag: 'Trusted Circles',
  },
]

export default function WhoCanJoinSection() {
  const { copy } = useLanguage()
  const data = copy.whoCanJoin

  if (!data) return null

  const cards = data.cards || []

  return (
    <section
      id="who-can-join"
      className="relative pt-12 sm:pt-16 lg:pt-20 pb-16 sm:pb-20 lg:pb-24 bg-white scroll-mt-24 overflow-hidden"
      aria-label={data.headline}
    >
      {/* Soft Gradient Fade: Cream to White (80px tall, smooth boundary) */}
      <div
        className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-[#FAF7F2] to-[#FFFFFF] pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Atmospheric Blurred Gradient Shapes behind heading */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 pointer-events-none overflow-hidden -z-0" aria-hidden="true">
        <div className="absolute top-4 left-1/4 w-80 h-80 rounded-full bg-[#6B3CFF] opacity-[0.14] blur-[95px]" />
        <div className="absolute top-12 right-1/4 w-72 h-72 rounded-full bg-[#FF4FA3] opacity-[0.13] blur-[90px]" />
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-[#D6F36B] opacity-[0.16] blur-[80px]" />
      </div>

      <div className="site-container relative z-10 flex flex-col gap-10 sm:gap-12 lg:gap-14 items-center">
        {/* Section Header */}
        <div data-reveal="heading" className="text-center max-w-[840px] flex flex-col items-center gap-3.5 sm:gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF7F2] border border-[#12101F]/10 rounded-full shadow-sm text-sm text-[#827C94]">
            <Users size={14} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">{data.eyebrow}</span>
          </div>

          <h2 className="section-heading font-bold text-[#12101F] tracking-tight m-0 font-headline">
            {data.headline}
          </h2>

          <p className="text-lg sm:text-xl leading-relaxed text-[#575266] max-w-[780px] m-0">
            {data.subheading}
          </p>
        </div>

        {/* 5 Cards Grid: 3 on row 1, 2 centered on row 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-5 sm:gap-6 lg:gap-8 w-full" role="list">
          {cards.map((card, idx) => {
            const config = PERSONA_CONFIGS[idx % PERSONA_CONFIGS.length]
            const Icon = config.fallbackIcon

            const gridPlacement =
              idx === 3
                ? 'md:col-span-1 lg:col-start-2 lg:col-span-2'
                : idx === 4
                ? 'md:col-span-2 md:w-1/2 md:mx-auto lg:w-full lg:mx-0 lg:col-span-2'
                : 'md:col-span-1 lg:col-span-2'

            return (
              <div
                key={`who-card-${idx}`}
                data-reveal="card"
                className={`relative rounded-[28px] card-depth tilt-card p-5 sm:p-6 lg:p-8 flex flex-col justify-between overflow-hidden group bg-white border border-[#12101F]/10 hover:border-[#6B3CFF]/30 transition-all duration-300 ${gridPlacement}`}
                role="listitem"
              >
                {/* Subtle Ambient Radial Glow on Hover */}
                <div
                  className={`absolute top-0 right-0 w-44 h-44 rounded-full bg-gradient-to-bl ${config.glowColor} pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity duration-300 -z-0`}
                  aria-hidden="true"
                />

                {/* Card Top: Portrait / Avatar & Restrained Network Indicator */}
                <div className="relative z-10 flex items-center justify-between gap-3 mb-6">
                  {config.type === 'photo' && config.image ? (
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-md shadow-[#12101F]/10 shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={config.image}
                        alt={config.alt}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 ring-1 ring-black/10 rounded-2xl pointer-events-none" />
                    </div>
                  ) : (
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-transform duration-300 group-hover:scale-105 shrink-0 shadow-sm ${config.accentBg} ${config.accentBorder}`}
                      aria-hidden="true"
                    >
                      <Icon size={28} className={config.accentText} />
                    </div>
                  )}

                  {/* Restrained Network Link Badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF7F2] border border-[#12101F]/10 rounded-full text-[11px] font-mono text-[#827C94] shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6B3CFF] animate-pulse" aria-hidden="true" />
                    <span>0{idx + 1}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="relative z-10 flex flex-col gap-2.5">
                  <h3 className="text-xl sm:text-2xl font-bold font-headline text-[#12101F] tracking-tight m-0">
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
          <div data-reveal="extra" className="inline-flex items-center gap-3 px-5 py-3.5 sm:px-6 sm:py-4 bg-[#FAF7F2] border border-[#6B3CFF]/20 rounded-2xl sm:rounded-full shadow-md text-sm sm:text-base font-medium text-[#12101F] text-center max-w-3xl">
            <CheckCircle2 size={20} className="text-[#6B3CFF] shrink-0" aria-hidden="true" />
            <span>{data.closing}</span>
          </div>
        )}
      </div>
    </section>
  )
}

