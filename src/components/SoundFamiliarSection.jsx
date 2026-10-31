import React from 'react'
import {
  MessageSquare,
  Sparkles,
  Clock,
  Users2,
  ShieldCheck,
  HeartPulse,
  GraduationCap,
  Briefcase,
} from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

// Visual styling tokens for the 4 scenario question cards
const QUESTION_STYLES = [
  {
    icon: HeartPulse,
    badgeBg: 'bg-[#FF6B6B]/15',
    badgeText: 'text-[#C92A2A]',
    badgeBorder: 'border-[#FF6B6B]/30',
    avatarBg: '#FFF5F5',
    avatarColor: '#E03131',
    scenarioCode: 'SCENARIO 01 // HEALTHCARE',
  },
  {
    icon: GraduationCap,
    badgeBg: 'bg-[#16A34A]/15',
    badgeText: 'text-[#166534]',
    badgeBorder: 'border-[#16A34A]/30',
    avatarBg: '#F0FDF4',
    avatarColor: '#15803D',
    scenarioCode: 'SCENARIO 02 // EDUCATION',
  },
  {
    icon: Briefcase,
    badgeBg: 'bg-[#0D9488]/15',
    badgeText: 'text-[#115E59]',
    badgeBorder: 'border-[#0D9488]/30',
    avatarBg: '#F0FDFA',
    avatarColor: '#0F766E',
    scenarioCode: 'SCENARIO 03 // ADVISORY',
  },
  {
    icon: GraduationCap,
    badgeBg: 'bg-[#6B3CFF]/15',
    badgeText: 'text-[#5025D1]',
    badgeBorder: 'border-[#6B3CFF]/30',
    avatarBg: '#F5F3FF',
    avatarColor: '#6B3CFF',
    scenarioCode: 'SCENARIO 04 // LEARNING',
  },
]

// Icons for the 3 Why Join value pillars
const PILLAR_ICONS = [Clock, Users2, ShieldCheck]

export default function SoundFamiliarSection() {
  const { lang, copy } = useLanguage()
  const data = copy.soundFamiliar || {}
  const questions = data.questions || []
  const pillars = data.pillars || []

  return (
    <section
      id="why-join"
      className="relative bg-[#FAF7F2] scroll-mt-24 py-18 lg:py-28 overflow-hidden border-b border-[#12101F]/6"
      aria-label={data.headline || 'Why join'}
    >
      {/* Anchor alias so any link to #sound-familiar continues to work */}
      <span id="sound-familiar" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

      <div className="site-container flex flex-col gap-14 lg:gap-20">
        {/* Asymmetrical Editorial Narrative Grid (5:7 ratio on desktop) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-16 items-start">
          {/* Left Column: Sticky Editorial Storytelling */}
          <div data-reveal="heading" className="flex flex-col items-start gap-5 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/95 border border-[#12101F]/10 rounded-full shadow-2xs text-xs text-[#827C94]">
              <MessageSquare size={13} className="text-[#6B3CFF]" aria-hidden="true" />
              <span className="font-mono">01 // {data.eyebrow}</span>
            </div>

            <h2 className="section-heading font-bold text-[#12101F] tracking-tight m-0 font-headline">
              {(data.headline || '').split(' ').map((word, idx) => (
                <React.Fragment key={`sf-word-${idx}`}>
                  <span className="inline-block">{word}</span>{' '}
                </React.Fragment>
              ))}
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-[#575266] m-0 max-w-[540px]">
              {data.subheading}
            </p>

            {data.trustLine && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 border border-[#6B3CFF]/20 rounded-2xl sm:rounded-full text-xs sm:text-sm font-medium text-[#5025D1] shadow-2xs">
                <ShieldCheck size={16} className="text-[#6B3CFF] shrink-0" aria-hidden="true" />
                <span>{data.trustLine}</span>
              </div>
            )}

            {/* Editorial Bridge Quote Card */}
            <div className="w-full bg-white rounded-2xl p-5 sm:p-6 border border-[#12101F]/8 shadow-xs flex items-start gap-4 mt-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6B3CFF] to-[#FF4FA3] p-0.5 shrink-0 shadow-md shadow-[#6B3CFF]/20">
                <div className="w-full h-full bg-[#12101F] rounded-[10px] flex items-center justify-center text-white">
                  <Sparkles size={16} className="text-[#D6F36B]" aria-hidden="true" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-sm sm:text-[15px] leading-relaxed text-[#12101F] font-semibold m-0">
                  {data.conclusion}
                </p>
                <span className="text-[11px] font-mono text-[#6B3CFF] font-bold">
                  {lang === 'te' ? 'ఉచితంగా చేరండి · మీ మాటకు విలువ ఉంది' : 'Free to join · Your word carries weight'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Staggered Tactile Scenario Cards */}
          <div className="flex flex-col gap-4 sm:gap-5 w-full">
            {questions.map((q, idx) => {
              const style = QUESTION_STYLES[idx % QUESTION_STYLES.length]
              const Icon = style.icon

              return (
                <div
                  key={`q-${idx}`}
                  data-reveal="card"
                  className="corner-mark tilt-card bg-white border border-[#12101F]/10 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-[#6B3CFF]/35 transition-all duration-300 flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-center justify-between gap-2 pr-6">
                    <span className="font-mono text-[10.5px] font-bold tracking-wider text-[#827C94]">
                      {style.scenarioCode}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-bold border ${style.badgeBg} ${style.badgeText} ${style.badgeBorder}`}
                    >
                      <Icon size={11} aria-hidden="true" />
                      <span>{q.category}</span>
                    </span>
                  </div>

                  <div className="flex items-start gap-3.5 pt-1">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs border border-white"
                      style={{ backgroundColor: style.avatarBg, color: style.avatarColor }}
                      aria-hidden="true"
                    >
                      <span className="font-mono">{q.initial || '•'}</span>
                    </div>

                    <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                      <span className="text-xs font-semibold text-[#827C94]">{q.speaker}</span>
                      <p className="text-[15.5px] sm:text-[16.5px] font-bold leading-relaxed text-[#12101F] m-0 font-headline">
                        {q.text}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* 3 Why Join Core Value Pillars with Architectural Top Accent */}
        <div className="w-full flex flex-col items-center gap-8 pt-8 border-t border-[#12101F]/8">
          <div className="text-center max-w-[640px]">
            <h3 className="text-xl sm:text-2xl font-bold text-[#12101F] font-headline m-0">
              {lang === 'te' ? 'sBLOOM లో ఎందుకు చేరాలి?' : 'Why participate with sBLOOM?'}
            </h3>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {pillars.map((pillar, idx) => {
              const PillarIcon = PILLAR_ICONS[idx % PILLAR_ICONS.length]
              const accentGradient =
                idx === 0
                  ? 'bg-gradient-to-r from-[#6B3CFF] to-[#FF4FA3]'
                  : idx === 1
                  ? 'bg-gradient-to-r from-[#FF4FA3] to-[#D6F36B]'
                  : 'bg-gradient-to-r from-[#16A34A] to-[#0D9488]'

              return (
                <div
                  key={`pillar-${idx}`}
                  data-reveal="card"
                  className="corner-mark tilt-card bg-white/95 border border-[#12101F]/10 rounded-2xl p-6 shadow-xs hover:shadow-lg hover:border-[#6B3CFF]/30 transition-all duration-300 flex flex-col gap-3.5 relative overflow-hidden group"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 ${accentGradient}`} aria-hidden="true" />

                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#6B3CFF]/10 border border-[#6B3CFF]/20 flex items-center justify-center text-[#6B3CFF] shrink-0">
                      <PillarIcon size={18} aria-hidden="true" />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#827C94]">0{idx + 1} //</span>
                  </div>

                  <h4 className="text-lg font-bold text-[#12101F] font-headline m-0">
                    {pillar.title}
                  </h4>

                  <p className="text-sm leading-relaxed text-[#575266] m-0 flex-1">
                    {pillar.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

