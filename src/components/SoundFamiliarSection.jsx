import React, { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MessageSquare, Sparkles } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

gsap.registerPlugin(ScrollTrigger)

export default function SoundFamiliarSection() {
  const { lang, copy } = useLanguage()
  const sectionRef = useRef(null)
  const pinWrapperRef = useRef(null)
  const [visibleCount, setVisibleCount] = useState(1)
  const [showConclusion, setShowConclusion] = useState(false)

  const questions = copy.soundFamiliar.questions || []
  const replyLine = copy.soundFamiliar.reply || (lang === 'te' ? '“అవును, నేను పరిచయం చేస్తాను.”' : '“Yes, let me introduce you.”')

  // Avatar configs for alternating questions (1 left, 2 right, 3 left, 4 right)
  const avatarConfigs = [
    { initial: 'P', label: 'Parent', bg: '#EEF2FF', color: '#4F46E5', side: 'left' },
    { initial: 'N', label: 'Neighbor', bg: '#FFF1F2', color: '#E11D48', side: 'right' },
    { initial: 'C', label: 'Cousin', bg: '#FEF3C7', color: '#D97706', side: 'left' },
    { initial: 'S', label: 'Student', bg: '#ECFDF5', color: '#059669', side: 'right' },
  ]

  useEffect(() => {
    const section = sectionRef.current
    const wrapper = pinWrapperRef.current
    if (!section || !wrapper) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Pinned 4-step progressive reveal on scroll ONLY when viewport is tall enough
      mm.add('(min-width: 1025px) and (min-height: 780px)', () => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: '+=2400',
          pin: wrapper,
          anticipatePin: 1,
          scrub: 0.4,
          onUpdate: (self) => {
            const p = self.progress

            if (p < 0.18) {
              setVisibleCount(1)
              setShowConclusion(false)
            } else if (p < 0.36) {
              setVisibleCount(2)
              setShowConclusion(false)
            } else if (p < 0.54) {
              setVisibleCount(3)
              setShowConclusion(false)
            } else if (p < 0.72) {
              setVisibleCount(4)
              setShowConclusion(false)
            } else if (p < 0.88) {
              setVisibleCount(5) // 4 questions + reply bubble
              setShowConclusion(false)
            } else {
              setVisibleCount(5)
              setShowConclusion(true) // fade in closing reflection callout
            }
          },
        })
      })

      // Short screens and mobile/tablet: Show all questions naturally without scroll trapping
      mm.add('(max-width: 1024px), (max-height: 779px)', () => {
        setVisibleCount(5)
        setShowConclusion(true)
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="sound-familiar"
      ref={sectionRef}
      className="relative bg-[#FAF7F2] scroll-mt-24 py-16 pin:py-0"
      aria-label="Sound familiar?"
    >
      <div
        ref={pinWrapperRef}
        className="relative w-full flex flex-col items-center px-4 pt-8 pb-10 overflow-visible
                   pin:h-screen pin:justify-start pin:pt-[96px] pin:pb-4 pin:overflow-hidden"
      >
        <div className="site-container max-w-[1100px] flex flex-col items-center gap-5 w-full">
          {/* Section Header */}
          <div className="text-center max-w-[820px] flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 border border-[#12101F]/10 rounded-full shadow-sm text-sm text-[#827C94]">
              <MessageSquare size={13} className="text-[#6B3CFF]" aria-hidden="true" />
              <span className="font-mono">
                {lang === 'te' ? 'రోజువారీ సంభాషణలు' : 'Sound familiar?'}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] text-[#12101F] tracking-tight m-0 font-headline">
              {copy.soundFamiliar.headline.split(' ').map((word, idx) => (
                <React.Fragment key={`sf-word-${idx}`}>
                  <span className="inline-block">{word}</span>
                  {' '}
                </React.Fragment>
              ))}
            </h2>
          </div>

          {/* Central Portrait Phone Mockup that fits viewport */}
          <div className="flex flex-col items-center gap-5 w-full">
            <div
              className="w-full max-w-[400px] min-h-[440px] pin:h-[clamp(440px,calc(100svh-330px),580px)]
                         bg-[#FAF7F2] border-[10px] border-[#1A162B] rounded-[44px] shadow-2xl shadow-[#12101F]/10
                         flex flex-col p-3.5 sm:p-4 relative"
              role="region"
              aria-label="Everyday conversations simulation"
            >
              {/* Phone Status Notch */}
              <div className="flex items-center justify-between px-1.5 pb-2.5 border-b border-[#12101F]/10">
                <span className="text-[11px] font-bold text-[#12101F] font-mono">9:41</span>
                <div className="w-14 h-1.5 bg-[#E8E2D8] rounded-full" />
                <span className="text-[10.5px] font-bold text-[#6B3CFF] bg-[#6B3CFF]/10 px-2 py-0.5 rounded-full font-mono">
                  {visibleCount >= 5
                    ? (lang === 'te' ? 'సమాధానం పంపబడింది' : 'Replied')
                    : (lang === 'te' ? `${visibleCount} / 4 ప్రశ్నలు` : `${visibleCount} of 4`)}
                </span>
              </div>

              {/* Chat Messages Feed: Alternating Left/Right with Avatars + Reply Bubble */}
              <div className="flex-1 flex flex-col gap-3 justify-center py-2.5 px-1" role="feed" aria-label="Questions and reply list">
                {questions.map((question, idx) => {
                  const isVisible = idx < visibleCount
                  const cfg = avatarConfigs[idx % avatarConfigs.length]
                  const isLeft = cfg.side === 'left'

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-2.5 w-full transition-all duration-300 ${
                        isLeft ? 'flex-row justify-start' : 'flex-row-reverse justify-start'
                      } ${
                        isVisible
                          ? 'opacity-100 translate-y-0 scale-100 visible'
                          : 'opacity-0 translate-y-3 scale-95 pointer-events-none invisible'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm border border-white/80"
                        style={{ background: cfg.bg, color: cfg.color }}
                        aria-hidden="true"
                        title={cfg.label}
                      >
                        <span className="text-xs font-bold font-mono">{cfg.initial}</span>
                      </div>

                      <div
                        className={`relative max-w-[82%] bg-white border border-[#12101F]/10 px-3.5 py-2.5 shadow-sm transition-all ${
                          isLeft ? 'rounded-[18px] rounded-bl-[4px]' : 'rounded-[18px] rounded-br-[4px]'
                        }`}
                      >
                        <p className="text-[13.5px] font-semibold leading-relaxed text-[#12101F] m-0">{question}</p>
                      </div>
                    </div>
                  )
                })}

                {/* Reply Bubble after the 4th Question */}
                <div
                  className={`flex items-center gap-2.5 w-full transition-all duration-300 flex-row-reverse justify-start mt-0.5 ${
                    visibleCount >= 5
                      ? 'opacity-100 translate-y-0 scale-100 visible'
                      : 'opacity-0 translate-y-3 scale-95 pointer-events-none invisible'
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-gradient-to-br from-[#6B3CFF] via-[#FF4FA3] to-[#D6F36B] text-white shadow-md shadow-[#6B3CFF]/30 border-none"
                    aria-hidden="true"
                    title="You (Affiliate)"
                  >
                    <Sparkles size={13} strokeWidth={2.4} />
                  </div>

                  <div className="relative max-w-[82%] rounded-[18px] rounded-br-[4px] bg-gradient-to-br from-[#6B3CFF] to-[#4F28D9] border border-[#6B3CFF]/30 shadow-lg shadow-[#6B3CFF]/25 px-3.5 py-2.5 text-white">
                    <p className="text-[13.5px] font-bold leading-relaxed text-white m-0">{replyLine}</p>
                  </div>
                </div>
              </div>

              {/* Stepper Dot Indicators: 4 Question dots + Divider + 1 Reply dot */}
              <div className="flex justify-center items-center gap-1.5 pt-1.5" aria-hidden="true">
                {[0, 1, 2, 3].map((dotIdx) => (
                  <span
                    key={dotIdx}
                    className={`h-1.5 rounded-[3px] transition-all duration-200 ${
                      dotIdx < Math.min(visibleCount, 4) ? 'w-4 bg-[#6B3CFF]' : 'w-1.5 bg-[#12101F]/15'
                    }`}
                  />
                ))}
                <span className="mx-1 h-3 w-px bg-[#12101F]/15" />
                <span
                  className={`h-1.5 rounded-[3px] transition-all duration-200 ${
                    visibleCount >= 5 ? 'w-4 bg-gradient-to-r from-[#6B3CFF] to-[#FF4FA3]' : 'w-1.5 bg-[#12101F]/15'
                  }`}
                />
              </div>

              {/* Home indicator bar */}
              <div className="w-28 h-1 bg-[#1A162B] rounded-full mx-auto mt-2 opacity-30" aria-hidden="true" />
            </div>

            {/* Closing Line Callout (Fades in smoothly after the reply bubble arrives) */}
            <div
              className={`max-w-[680px] bg-white/95 border border-[#6B3CFF]/25 rounded-2xl px-6 py-4 shadow-xl shadow-[#12101F]/5 text-center transition-all duration-500 ${
                showConclusion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
              }`}
            >
              <div className="flex items-center gap-3 justify-center">
                <Sparkles size={18} className="text-[#6B3CFF] shrink-0" aria-hidden="true" />
                <p className="text-base leading-relaxed text-[#12101F] font-medium m-0">
                  {copy.soundFamiliar.conclusion}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
