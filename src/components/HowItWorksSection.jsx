import React from 'react'
import {
  ListOrdered,
  Search,
  UserCheck,
  TrendingUp,
  BookOpen,
} from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

const STEP_ICONS = [Search, UserCheck, TrendingUp]

const STEP_STYLES = [
  {
    numBg: 'bg-[#6B3CFF]/10 text-[#6B3CFF] border-[#6B3CFF]/25',
    accentBorder: 'hover:border-[#6B3CFF]/40',
    topBar: 'bg-gradient-to-r from-[#6B3CFF] to-[#8B5CF6]',
    iconColor: 'text-[#6B3CFF]',
    glowBg: 'from-[#6B3CFF]/10 to-transparent',
  },
  {
    numBg: 'bg-[#FF4FA3]/10 text-[#FF4FA3] border-[#FF4FA3]/25',
    accentBorder: 'hover:border-[#FF4FA3]/40',
    topBar: 'bg-gradient-to-r from-[#FF4FA3] to-[#FF6B6B]',
    iconColor: 'text-[#FF4FA3]',
    glowBg: 'from-[#FF4FA3]/10 to-transparent',
  },
  {
    numBg: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/25',
    accentBorder: 'hover:border-[#10B981]/40',
    topBar: 'bg-gradient-to-r from-[#10B981] to-[#D6F36B]',
    iconColor: 'text-[#10B981]',
    glowBg: 'from-[#10B981]/10 to-transparent',
  },
]

export default function HowItWorksSection() {
  const { copy } = useLanguage()
  const data = copy.howItWorks || {}
  const steps = data.steps || []

  return (
    <section
      id="how-it-works"
      className="relative pt-16 pb-20 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 bg-[#FAF7F2] scroll-mt-24 border-b border-[#12101F]/6 overflow-hidden"
      aria-label={data.heading || 'How It Works'}
    >
      <div className="site-container flex flex-col items-center gap-12 lg:gap-16">
        {/* Section Heading */}
        <div data-reveal="heading" className="text-center max-w-[760px] flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/95 border border-[#12101F]/10 rounded-full shadow-2xs text-xs text-[#827C94]">
            <ListOrdered size={14} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">{data.eyebrow}</span>
          </div>

          <h2 className="section-heading font-bold text-[#12101F] tracking-tight m-0 font-headline">
            {data.heading}
          </h2>
        </div>

        {/* 3 Step Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full" role="list">
          {steps.map((step, idx) => {
            const style = STEP_STYLES[idx % STEP_STYLES.length]
            const Icon = STEP_ICONS[idx % STEP_ICONS.length]

            return (
              <div
                key={`how-step-${idx}`}
                data-reveal="card"
                className={`relative bg-white rounded-[28px] card-depth p-8 sm:p-9 flex flex-col justify-between gap-6 border border-[#12101F]/8 ${style.accentBorder} transition-all duration-300 overflow-hidden group hover:-translate-y-1 shadow-sm hover:shadow-md`}
                role="listitem"
              >
                {/* Accent Top Line */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${style.topBar}`} />

                {/* Subtle Radial Ambient Glow on Hover */}
                <div
                  className={`absolute top-0 right-0 w-44 h-44 rounded-full bg-gradient-to-bl ${style.glowBg} pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-300`}
                  aria-hidden="true"
                />

                <div className="relative z-10 flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-base border ${style.numBg}`}>
                      {step.number || `0${idx + 1}`}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] flex items-center justify-center border border-[#12101F]/6">
                      <Icon size={20} className={style.iconColor} aria-hidden="true" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <h3 className="font-headline text-xl sm:text-2xl font-bold text-[#12101F] tracking-tight m-0">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-[#575266] m-0">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Supporting Line */}
        {data.supportingLine && (
          <div
            data-reveal="card"
            className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/95 border border-[#6B3CFF]/20 rounded-full shadow-xs text-sm sm:text-[15px] font-medium text-[#5025D1] text-center"
          >
            <BookOpen size={16} className="text-[#6B3CFF] shrink-0" aria-hidden="true" />
            <span>{data.supportingLine}</span>
          </div>
        )}
      </div>
    </section>
  )
}
