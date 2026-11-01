import React from 'react'
import {
  TrendingUp,
  SlidersHorizontal,
  CheckCircle2,
  Receipt,
  Landmark,
  Calendar,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

const BLOCK_ICONS = [SlidersHorizontal, CheckCircle2, Receipt, Landmark]

export default function EarningSection() {
  const { lang, copy } = useLanguage()
  const data = copy.earning

  if (!data) return null

  const blocks = data.blocks || []
  const example = data.example

  // Three-Stage Flow Nodes strictly from copy-deck.md Section 2
  const flowStages = [
    {
      step: '01',
      title: lang === 'te' ? 'సరైన పరిచయం' : 'Relevant Introduction',
      desc:
        lang === 'te'
          ? 'అవసరం ఉన్న వాళ్లను వాళ్ల పర్మిషన్‌తోనే పరిచయం చేయండి.'
          : 'Notice a genuine need and connect them with permission.',
      tag: lang === 'te' ? 'పర్మిషన్‌తో' : 'Consent Confirmed',
      color: '#6B3CFF',
    },
    {
      step: '02',
      title: lang === 'te' ? 'ప్రొవైడర్ రివ్యూ' : 'Provider Terms Evaluation',
      desc:
        lang === 'te'
          ? 'ప్రొవైడర్ తమ కండిషన్స్ ప్రకారం చెక్ చేస్తారు.'
          : 'The applicable service provider evaluates under their specific terms.',
      tag: lang === 'te' ? 'రివ్యూ' : 'Provider Review',
      color: '#FF4FA3',
    },
    {
      step: '03',
      title: lang === 'te' ? 'రిజల్ట్ వస్తే సంపాదన' : 'Qualified Opportunity',
      desc:
        lang === 'te'
          ? 'కండిషన్స్ సరిపోతే, ప్రొవైడర్ షెడ్యూల్ ప్రకారం పేమెంట్.'
          : 'When conditions are met, potential compensation applies per terms.',
      tag: lang === 'te' ? 'గ్యారెంటీ లేదు' : 'Terms Apply · No Guarantee',
      color: '#D6F36B',
    },
  ]

  return (
    <section
      id="earning"
      className="relative pt-20 pb-20 sm:pt-24 sm:pb-24 lg:pt-28 lg:pb-32 bg-[#0E0B1E] text-white scroll-mt-24 overflow-hidden"
      aria-label={data.headline}
    >
      {/* Soft Gradient Fade: Soft Violet to Dark Stage (80px tall) */}
      <div
        className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-[#F3EEFF] to-[#0E0B1E] pointer-events-none z-10"
        aria-hidden="true"
      />

      {/* Atmospheric Blurred Gradient Blooms behind dark stage */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 pointer-events-none overflow-hidden -z-0" aria-hidden="true">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[#6B3CFF] opacity-[0.18] blur-[120px]" />
        <div className="absolute top-12 right-1/4 w-80 h-80 rounded-full bg-[#FF4FA3] opacity-[0.15] blur-[100px]" />
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-[#D6F36B] opacity-[0.14] blur-[90px]" />
      </div>

      <div className="site-container relative z-10 flex flex-col gap-12 sm:gap-16 items-center">
        {/* Section Header */}
        <div data-reveal="heading" className="text-center max-w-[840px] flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/15 rounded-full shadow-sm text-xs sm:text-sm text-[#C4B5FD]">
            <TrendingUp size={14} className="text-[#D6F36B]" aria-hidden="true" />
            <span className="font-mono">03 // {data.eyebrow}</span>
          </div>

          <h2 className="section-heading font-bold text-white tracking-tight m-0 font-headline">
            {data.headline}
          </h2>

          <p className="text-base sm:text-lg leading-relaxed text-white/85 max-w-[760px] m-0">
            {data.subheading}
          </p>
        </div>

        {/* Three-Party Referral & Qualification Flow Diagram */}
        <div
          data-reveal="card"
          className="w-full max-w-5xl bg-[#161226]/90 border border-white/12 rounded-[32px] p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden"
          role="region"
          aria-label={lang === 'te' ? 'రెఫరల్ & ఎర్నింగ్ ప్రాసెస్' : 'Referral & Qualification Flow'}
        >
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute -top-24 right-0 w-80 h-80 bg-gradient-to-bl from-[#6B3CFF]/25 via-transparent to-transparent pointer-events-none -z-0" aria-hidden="true" />

          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#D6F36B]" aria-hidden="true" />
                <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                  {lang === 'te' ? 'రెఫరల్ & ఎర్నింగ్ ప్రాసెస్' : 'Referral & Qualification Flow'}
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#C4B5FD] bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
                {lang === 'te' ? 'ప్రొవైడర్ కండిషన్స్ వర్తిస్తాయి' : 'Provider-Specific Terms'}
              </span>
            </div>

            {/* 3 Connected Stage Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
              {flowStages.map((stage, idx) => (
                <div
                  key={`flow-${idx}`}
                  className="bg-[#1C1730] border border-white/10 rounded-2xl p-5 flex flex-col justify-between gap-4 relative group hover:border-white/25 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="w-8 h-8 rounded-xl font-mono text-xs font-bold flex items-center justify-center border"
                      style={{
                        backgroundColor: stage.color + '20',
                        borderColor: stage.color + '45',
                        color: stage.color,
                      }}
                    >
                      {stage.step}
                    </span>

                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/5 text-[#C4B5FD] border border-white/8">
                      {stage.tag}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-base sm:text-lg font-bold text-white font-headline m-0">
                      {stage.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] leading-relaxed text-white/75 m-0">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4 Earning Feature Blocks with Architectural Indices */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full" role="list">
          {blocks.map((block, idx) => {
            const Icon = BLOCK_ICONS[idx % BLOCK_ICONS.length]

            return (
              <div
                key={`earning-block-${idx}`}
                data-reveal="card"
                className="corner-mark relative rounded-[28px] card-dark-depth tilt-card p-6 sm:p-7 flex flex-col gap-4 overflow-hidden group"
                role="listitem"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-11 h-11 rounded-2xl bg-[#6B3CFF]/20 border border-[#6B3CFF]/35 text-[#D6F36B] flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
                    aria-hidden="true"
                  >
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#C4B5FD] pr-3">
                    0{idx + 1} //
                  </span>
                </div>

                <div className="flex flex-col gap-2">
                  <h3 className="text-lg sm:text-xl font-bold font-headline text-white m-0 leading-snug min-h-[2.8em] flex items-start">
                    {block.title}
                  </h3>
                  <p className="text-[14px] sm:text-[14.5px] text-white/80 leading-relaxed m-0">
                    {block.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Worked Example Card: Intro and footnote shown; rows & total hidden per specification */}
        {example && (
          <div
            data-reveal="extra"
            className="w-full max-w-4xl bg-[#161226] border border-[#6B3CFF]/35 rounded-[28px] card-dark-depth tilt-card p-7 sm:p-9 flex flex-col gap-4"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#6B3CFF]/25 text-[#D6F36B] flex items-center justify-center" aria-hidden="true">
                <Calendar size={18} />
              </div>
              <span className="font-headline font-bold text-lg sm:text-xl text-white">
                {example.title}
              </span>
            </div>

            <p className="text-base sm:text-[17px] text-white/95 leading-relaxed m-0 font-medium">
              {example.intro}
            </p>

            {example.footnote && (
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed italic m-0 pt-3 border-t border-white/10">
                {example.footnote}
              </p>
            )}
          </div>
        )}

        {/* Regulatory Caution / No Guarantee */}
        {(data.caution || data.noGuarantee) && (
          <div
            data-reveal="extra"
            className="w-full max-w-4xl flex items-center gap-3 p-5 bg-amber-500/10 border border-amber-400/30 rounded-2xl text-amber-100 text-sm sm:text-base font-medium shadow-sm"
          >
            <ShieldAlert size={22} className="text-amber-400 shrink-0" aria-hidden="true" />
            <span className="leading-relaxed text-amber-100">{data.caution || data.noGuarantee}</span>
          </div>
        )}
      </div>
    </section>
  )
}

