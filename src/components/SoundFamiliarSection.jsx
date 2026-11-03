import React from 'react'
import {
  MessageSquare,
  Users2,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { useLanguage } from '../context/useLanguage'
import WhyJoinVideoExplainer from './WhyJoinVideoExplainer'

const BENEFIT_ICONS = [Users2, Clock, TrendingUp, ShieldCheck]

export default function SoundFamiliarSection() {
  const { lang, copy } = useLanguage()
  const data = copy.soundFamiliar || {}
  const benefits = data.benefits || [
    {
      number: '01',
      title: lang === 'te' ? 'మీ పరిచయాలను లీడ్స్గా మార్చండి' : 'Turn connections into leads',
      description:
        lang === 'te'
          ? 'మీకు తెలిసిన వాళ్లను సరైన ప్రొవైడర్కు పరిచయం చేస్తే అది లీడ్ అవుతుంది.'
          : 'Introduce people you know to the right provider and it becomes a lead.',
    },
    {
      number: '02',
      title: lang === 'te' ? 'ప్రాసెస్ చాలా సింపుల్' : 'Simple process',
      description:
        lang === 'te'
          ? 'అవసరం ఉన్నవాళ్లను గుర్తించి, అనుమతి తీసుకుని పరిచయం చేయండి. అంతే.'
          : 'Notice a need, get their permission, and introduce them. That’s all.',
    },
    {
      number: '03',
      title: lang === 'te' ? 'సంపాదన అవకాశం' : 'Earning opportunity',
      description:
        lang === 'te'
          ? 'రిఫరల్ అర్హత ఉంటే ప్రొవైడర్ నిబంధనల ప్రకారం చెల్లింపు ఉండొచ్చు.'
          : 'If the referral qualifies, compensation may apply under provider terms.',
    },
    {
      number: '04',
      title: lang === 'te' ? 'చేరడం ఉచితం' : 'Free to join',
      description:
        lang === 'te'
          ? 'ఎలాంటి ఫీజు లేదు. సేల్స్ అనుభవం కూడా అవసరం లేదు.'
          : 'No fees of any kind. No sales experience needed.',
    },
  ]

  return (
    <section
      id="why-join"
      className="relative bg-[#FAF7F2] scroll-mt-24 py-16 lg:py-24 overflow-hidden border-b border-[#12101F]/6"
      aria-label={data.headline || 'Why join'}
    >
      <div className="site-container flex flex-col gap-14 lg:gap-18">
        {/* Narrative & Interactive Video Explainer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.15fr] gap-10 lg:gap-14 items-center">
          {/* Left Column: Editorial Storytelling */}
          <div data-reveal="heading" className="flex flex-col items-start gap-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/95 border border-[#12101F]/10 rounded-full shadow-2xs text-xs text-[#827C94]">
              <MessageSquare size={13} className="text-[#6B3CFF]" aria-hidden="true" />
              <span className="font-mono">01 // {data.eyebrow}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#12101F] tracking-tight m-0 font-headline leading-[1.2]">
              {data.headline}
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-[#575266] m-0 max-w-[540px] whitespace-pre-line">
              {data.subheading}
            </p>

            {data.trustLine && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 border border-[#6B3CFF]/20 rounded-2xl sm:rounded-full text-xs sm:text-sm font-medium text-[#5025D1] shadow-2xs">
                <ShieldCheck size={16} className="text-[#6B3CFF] shrink-0" aria-hidden="true" />
                <span>{data.trustLine}</span>
              </div>
            )}
          </div>

          {/* Right Column: Why Join Interactive Video Explainer */}
          <div data-reveal="card" className="w-full">
            <WhyJoinVideoExplainer />
          </div>
        </div>

        {/* All Four Benefits Grid (01, 02, 03, 04) */}
        <div className="w-full flex flex-col items-center gap-8 pt-4 border-t border-[#12101F]/8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full pb-2">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-[#12101F] font-headline m-0">
                {lang === 'te' ? 'నాలుగు ముఖ్యమైన ప్రయోజనాలు' : 'Four Core Benefits'}
              </h3>
              <p className="text-sm text-[#575266] m-0 mt-1">
                {lang === 'te'
                  ? 'మీ పరిచయాలు ఇప్పటికే ఉన్నాయి. వాటిని లీడ్స్గా మార్చుకోవడం సులభం.'
                  : 'Everything you need to turn everyday connections into qualified leads.'}
              </p>
            </div>
            <span className="font-mono text-xs text-[#827C94] bg-white px-3 py-1.5 rounded-full border border-[#12101F]/10">
              04 Benefits //
            </span>
          </div>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6" role="list">
            {benefits.map((benefit, idx) => {
              const Icon = BENEFIT_ICONS[idx % BENEFIT_ICONS.length]
              const accentGradient =
                idx === 0
                  ? 'bg-gradient-to-r from-[#6B3CFF] to-[#FF4FA3]'
                  : idx === 1
                  ? 'bg-gradient-to-r from-[#FF4FA3] to-[#D6F36B]'
                  : idx === 2
                  ? 'bg-gradient-to-r from-[#16A34A] to-[#0D9488]'
                  : 'bg-gradient-to-r from-[#6B3CFF] to-[#16A34A]'

              return (
                <div
                  key={`benefit-${idx}`}
                  data-reveal="card"
                  className="corner-mark tilt-card bg-white border border-[#12101F]/10 rounded-2xl p-6 shadow-xs hover:shadow-lg hover:border-[#6B3CFF]/30 transition-all duration-300 flex flex-col justify-between gap-4 relative overflow-hidden group"
                  role="listitem"
                >
                  <div className={`absolute top-0 left-0 right-0 h-1 ${accentGradient}`} aria-hidden="true" />

                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-[#6B3CFF]/10 border border-[#6B3CFF]/20 flex items-center justify-center text-[#6B3CFF] shrink-0">
                      <Icon size={20} aria-hidden="true" />
                    </div>
                    <span className="font-mono text-xs font-bold text-[#827C94]">0{idx + 1} //</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h4 className="text-lg font-bold text-[#12101F] font-headline m-0 leading-snug">
                      {benefit.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-[#575266] m-0">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Closing Line Banner */}
          {data.closing && (
            <div data-reveal="extra" className="inline-flex items-center gap-3 px-5 py-3.5 sm:px-6 sm:py-4 bg-white border border-[#6B3CFF]/20 rounded-2xl sm:rounded-full shadow-xs text-sm sm:text-base font-medium text-[#12101F] text-center max-w-3xl mt-2">
              <CheckCircle2 size={20} className="text-[#6B3CFF] shrink-0" aria-hidden="true" />
              <span>{data.closing}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
