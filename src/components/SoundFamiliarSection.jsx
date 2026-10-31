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

// Visual styling tokens for the 4 question cards
const QUESTION_STYLES = [
  {
    icon: HeartPulse,
    badgeBg: 'bg-[#FF6B6B]/15',
    badgeText: 'text-[#C92A2A]',
    badgeBorder: 'border-[#FF6B6B]/30',
    avatarBg: '#FFF5F5',
    avatarColor: '#E03131',
  },
  {
    icon: GraduationCap,
    badgeBg: 'bg-[#16A34A]/15',
    badgeText: 'text-[#166534]',
    badgeBorder: 'border-[#16A34A]/30',
    avatarBg: '#F0FDF4',
    avatarColor: '#15803D',
  },
  {
    icon: Briefcase,
    badgeBg: 'bg-[#0D9488]/15',
    badgeText: 'text-[#115E59]',
    badgeBorder: 'border-[#0D9488]/30',
    avatarBg: '#F0FDFA',
    avatarColor: '#0F766E',
  },
  {
    icon: GraduationCap,
    badgeBg: 'bg-[#6B3CFF]/15',
    badgeText: 'text-[#5025D1]',
    badgeBorder: 'border-[#6B3CFF]/30',
    avatarBg: '#F5F3FF',
    avatarColor: '#6B3CFF',
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
      className="relative bg-[#FAF7F2] scroll-mt-24 py-16 lg:py-24 overflow-hidden border-b border-[#12101F]/6"
      aria-label={data.headline || 'Why join'}
    >
      {/* Anchor alias so any link to #sound-familiar continues to work */}
      <span id="sound-familiar" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

      <div className="site-container flex flex-col items-center gap-12 lg:gap-16">
        {/* Section Header */}
        <div data-reveal="heading" className="text-center max-w-[820px] flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 border border-[#12101F]/10 rounded-full shadow-xs text-sm text-[#827C94]">
            <MessageSquare size={14} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">{data.eyebrow}</span>
          </div>

          <h2 className="section-heading font-bold text-[#12101F] tracking-tight m-0 font-headline">
            {(data.headline || '').split(' ').map((word, idx) => (
              <React.Fragment key={`sf-word-${idx}`}>
                <span className="inline-block">{word}</span>{' '}
              </React.Fragment>
            ))}
          </h2>

          <p className="text-lg sm:text-xl leading-relaxed text-[#575266] max-w-[760px] m-0">
            {data.subheading}
          </p>

          {data.trustLine && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#6B3CFF]/8 border border-[#6B3CFF]/20 rounded-full text-xs sm:text-sm font-medium text-[#5025D1]">
              <ShieldCheck size={14} className="text-[#6B3CFF]" aria-hidden="true" />
              <span>{data.trustLine}</span>
            </div>
          )}
        </div>

        {/* 4 Everyday Questions: 2x2 Grid on desktop */}
        <div className="w-full max-w-[980px] grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {questions.map((q, idx) => {
            const style = QUESTION_STYLES[idx % QUESTION_STYLES.length]
            const Icon = style.icon

            return (
              <div
                key={`q-${idx}`}
                data-reveal="card"
                className="tilt-card bg-white border border-[#12101F]/10 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-[#6B3CFF]/30 transition-all duration-300 flex flex-col justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs border border-white"
                    style={{ backgroundColor: style.avatarBg, color: style.avatarColor }}
                    aria-hidden="true"
                  >
                    <span className="font-mono">{q.initial || '•'}</span>
                  </div>

                  <div className="flex flex-col gap-1 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-[#827C94]">{q.speaker}</span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-mono font-bold border ${style.badgeBg} ${style.badgeText} ${style.badgeBorder}`}
                      >
                        <Icon size={11} aria-hidden="true" />
                        <span>{q.category}</span>
                      </span>
                    </div>

                    <p className="text-[15.5px] sm:text-[16.5px] font-semibold leading-relaxed text-[#12101F] m-0 pt-1">
                      {q.text}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Affiliate Heartfelt Bridge Callout */}
        <div
          data-reveal="heading"
          className="w-full max-w-[840px] bg-white border border-[#6B3CFF]/25 rounded-2xl p-5 sm:p-6 shadow-md shadow-[#6B3CFF]/5 flex flex-col sm:flex-row items-center gap-4 text-left"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6B3CFF] via-[#FF4FA3] to-[#D6F36B] p-0.5 shrink-0 shadow-md shadow-[#6B3CFF]/25">
            <div className="w-full h-full bg-[#12101F] rounded-[14px] flex items-center justify-center text-white">
              <Sparkles size={20} className="text-[#D6F36B]" aria-hidden="true" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-[15px] sm:text-[16.5px] leading-relaxed text-[#12101F] font-semibold m-0">
              {data.conclusion}
            </p>
            <span className="text-xs font-mono text-[#6B3CFF] font-medium">
              {lang === 'te' ? 'ఉచితంగా చేరండి · మీ మాటకు విలువ ఉంది' : 'Free to join · Your word carries weight'}
            </span>
          </div>
        </div>

        {/* 3 Why Join Core Value Pillars */}
        <div className="w-full max-w-[1100px] flex flex-col items-center gap-6 pt-4">
          <div className="text-center max-w-[600px]">
            <h3 className="text-xl sm:text-2xl font-bold text-[#12101F] font-headline m-0">
              {lang === 'te' ? 'sBLOOM లో ఎందుకు చేరాలి?' : 'Why participate with sBLOOM?'}
            </h3>
          </div>

          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
            {pillars.map((pillar, idx) => {
              const PillarIcon = PILLAR_ICONS[idx % PILLAR_ICONS.length]

              return (
                <div
                  key={`pillar-${idx}`}
                  data-reveal="card"
                  className="tilt-card bg-white/90 backdrop-blur-xs border border-[#12101F]/10 rounded-2xl p-6 shadow-xs hover:shadow-lg hover:border-[#6B3CFF]/30 transition-all duration-300 flex flex-col gap-3.5"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#6B3CFF]/10 border border-[#6B3CFF]/20 flex items-center justify-center text-[#6B3CFF] shrink-0">
                    <PillarIcon size={20} aria-hidden="true" />
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
