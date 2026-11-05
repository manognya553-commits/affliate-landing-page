import React from 'react'
import { TrendingUp, FileCheck2, UserCheck, CheckCircle, ShieldAlert } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

const STEP_ICONS = [FileCheck2, UserCheck, CheckCircle]

export default function EarningSection() {
  const { copy } = useLanguage()
  const data = copy.earning || {}
  const steps = data.steps || []

  return (
    <section
      id="earning"
      className="relative pt-20 pb-20 sm:pt-24 sm:pb-24 lg:pt-28 lg:pb-32 bg-[#0E0B1E] text-white scroll-mt-24 overflow-hidden border-b border-white/10"
      aria-label={data.heading || 'How Earning Works'}
    >
      {/* Ambient Gradient Glows */}
      <div className="absolute top-10 left-1/4 w-80 h-80 rounded-full bg-[#6B3CFF]/20 blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 rounded-full bg-[#FF4FA3]/15 blur-[120px] pointer-events-none" aria-hidden="true" />

      <div className="site-container relative z-10 flex flex-col gap-12 sm:gap-14 items-center">
        {/* Section Header */}
        <div data-reveal="heading" className="text-center max-w-[840px] flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/15 rounded-full shadow-2xs text-xs text-[#D6F36B]">
            <TrendingUp size={14} className="text-[#D6F36B]" aria-hidden="true" />
            <span className="font-mono">{data.eyebrow}</span>
          </div>

          <h2 className="section-heading font-bold text-white tracking-tight m-0 font-headline leading-[1.2]">
            {data.heading}
          </h2>
        </div>

        {/* 3 Steps Horizontal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full max-w-5xl" role="list">
          {steps.map((step, idx) => {
            const Icon = STEP_ICONS[idx % STEP_ICONS.length]

            const colors = [
              {
                iconBg: 'bg-[#6B3CFF]/20 text-[#C4B5FD] border-[#6B3CFF]/30',
                topBar: 'bg-gradient-to-r from-[#6B3CFF] to-[#8B5CF6]',
              },
              {
                iconBg: 'bg-[#FF4FA3]/20 text-[#FFA3D0] border-[#FF4FA3]/30',
                topBar: 'bg-gradient-to-r from-[#FF4FA3] to-[#FF6B6B]',
              },
              {
                iconBg: 'bg-[#10B981]/20 text-[#A7F3D0] border-[#10B981]/30',
                topBar: 'bg-gradient-to-r from-[#10B981] to-[#D6F36B]',
              },
            ][idx % 3]

            return (
              <div
                key={`earn-step-${idx}`}
                data-reveal="card"
                className="relative bg-[#161226]/90 border border-white/12 rounded-[28px] p-7 sm:p-8 flex flex-col justify-between gap-6 hover:border-white/25 transition-all duration-300 hover:-translate-y-1 shadow-xl overflow-hidden group"
                role="listitem"
              >
                {/* Accent Top Bar */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 ${colors.topBar}`} />

                <div className="flex flex-col gap-5">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${colors.iconBg}`}>
                      <Icon size={22} aria-hidden="true" />
                    </div>
                    <span className="font-mono text-xs font-bold text-white/50 tracking-wider">
                      {step.step || `0${idx + 1}`}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2.5">
                    <h3 className="font-headline text-xl sm:text-2xl font-bold text-white tracking-tight m-0">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-white/75 m-0">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Disclaimer Note */}
        {data.disclaimer && (
          <div
            data-reveal="card"
            className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-white/5 border border-white/10 rounded-full text-xs sm:text-sm text-white/70 max-w-xl text-center"
          >
            <ShieldAlert size={15} className="text-[#D6F36B] shrink-0" aria-hidden="true" />
            <span>{data.disclaimer}</span>
          </div>
        )}
      </div>
    </section>
  )
}
