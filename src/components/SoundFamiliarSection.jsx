import React from 'react'
import {
  MessageSquare,
  Sparkles,
  Clock,
  Users2,
  ShieldCheck,
} from 'lucide-react'
import { useLanguage } from '../context/useLanguage'
import WhyJoinVideoExplainer from './WhyJoinVideoExplainer'
import WhyJoinNetworkCanvas from './WhyJoinNetworkCanvas'

// Icons for the 3 Why Join value pillars
const PILLAR_ICONS = [Clock, Users2, ShieldCheck]

export default function SoundFamiliarSection() {
  const { lang, copy } = useLanguage()
  const data = copy.soundFamiliar || {}
  const pillars = data.pillars || []

  return (
    <section
      id="why-join"
      className="relative bg-[#FAF7F2] scroll-mt-24 py-18 lg:py-28 overflow-hidden border-b border-[#12101F]/6"
      aria-label={data.headline || 'Why join'}
    >
      {/* Restrained Network Motif connecting from Hero */}
      <WhyJoinNetworkCanvas />

      {/* Anchor alias so any link to #sound-familiar continues to work */}
      <span id="sound-familiar" className="absolute -top-24 pointer-events-none" aria-hidden="true" />

      <div className="site-container relative z-10 flex flex-col gap-14 lg:gap-20">
        {/* Asymmetrical Editorial Narrative Grid (balanced desktop ratio) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.15fr] gap-10 lg:gap-14 items-center">
          {/* Left Column: Sticky Editorial Storytelling */}
          <div data-reveal="heading" className="flex flex-col items-start gap-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/95 border border-[#12101F]/10 rounded-full shadow-2xs text-xs text-[#827C94]">
              <MessageSquare size={13} className="text-[#6B3CFF]" aria-hidden="true" />
              <span className="font-mono">01 // {data.eyebrow}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[#12101F] tracking-tight m-0 font-headline leading-[1.15]">
              {data.headline}
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
                  {lang === 'te' ? 'చేరడం ఫ్రీ · మీ మాటకు విలువ ఉంది' : 'Free to join · Your word carries weight'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Why Join / Affiliate Role & Benefits Interactive Video Explainer */}
          <div data-reveal="card" className="w-full">
            <WhyJoinVideoExplainer />
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

