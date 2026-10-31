import React, { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check, ArrowRight, ShieldCheck, ToggleRight, ListOrdered, Sparkles } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

gsap.registerPlugin(ScrollTrigger)

export default function HowItWorksSection({ onBecomeAffiliate }) {
  const { lang, copy } = useLanguage()
  const sectionRef = useRef(null)
  const pinWrapperRef = useRef(null)
  const [activeStep, setActiveStep] = useState(0)

  const stepsData = copy.howItWorks.steps || []

  // Pin section for about 1 viewport per step using GSAP ScrollTrigger
  useEffect(() => {
    const section = sectionRef.current
    const wrapper = pinWrapperRef.current
    if (!section || !wrapper) return

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      // Desktop: Pinned 4-step walkthrough on scroll (only when viewport is tall enough)
      mm.add('(min-width: 1025px) and (min-height: 780px)', () => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: '+=2800', // ~1 viewport per step across 4 steps
          pin: wrapper,
          anticipatePin: 1,
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress
            const stepIdx = Math.min(3, Math.floor(p * 4))
            setActiveStep(stepIdx)
          },
        })
      })

      // Short screens, tablet & mobile: natural scrolling without scroll trapping
      mm.add('(max-width: 1024px), (max-height: 779px)', () => {})
    }, section)

    return () => ctx.revert()
  }, [])

  // Generic Mockup Labels strictly aligned with docs/ui-sample-text.md
  const mockupText = {
    en: {
      step1: {
        badge: 'Sign up',
        title: 'Tell us about yourself',
        subtitle: 'Takes about two minutes • Free to join',
        field1: 'Full name',
        val1: 'Ananya Sharma',
        field2: 'Email',
        val2: 'ananya@example.com',
        field3: 'City and state',
        val3: 'Hyderabad, Telangana',
        btn: 'Continue',
        footer: 'Free. No payment asked.',
      },
      step2: {
        badge: 'Service Brief',
        title: 'Service Brief',
        sector: 'Healthcare & Wellness',
        subtitle: 'Simple plain-language guidance',
        col1Header: 'What to say',
        col1Text: 'Explain the core clinic or consultation service in plain words.',
        col2Header: 'What not to say',
        col2Text: 'No medical, legal or financial advice. Let the provider advise.',
        tag: 'No memorisation needed',
      },
      step3: {
        badge: 'Introduction',
        title: 'New Introduction',
        contact: 'Radha K. • Clinic Consultation',
        toggleLabel: '“They said yes”',
        toggleStatus: 'Permission Confirmed',
        btn: 'Pass on referral to sBLOOM',
        note: 'You introduce. The provider takes it from there.',
      },
      step4: {
        badge: 'Terms',
        title: 'Provider Terms & Status',
        subtitle: 'Check qualifying conditions under provider terms',
        items: [
          { label: 'Introduction Submitted', status: 'Submitted', time: '10m ago', color: '#6B3CFF' },
          { label: 'Provider Evaluation', status: 'In review', time: 'Today', color: '#FF4FA3' },
          { label: 'Terms Qualified', status: 'Eligible', time: 'Terms met', color: '#10B981' },
        ],
        footer: 'Compensation depends on provider terms and referral eligibility.',
      },
    },
    te: {
      step1: {
        badge: 'నమోదు',
        title: 'మీ గురించి మాకు చెప్పండి',
        subtitle: 'రెండు నిమిషాలు పడుతుంది • పూర్తిగా ఉచితం',
        field1: 'పూర్తి పేరు',
        val1: 'అనన్య శర్మ',
        field2: 'ఈమెయిల్',
        val2: 'ananya@example.com',
        field3: 'నగరం మరియు రాష్ట్రం',
        val3: 'హైదరాబాద్, తెలంగాణ',
        btn: 'కొనసాగించండి',
        footer: 'ఉచితం. చెల్లింపు అవసరం లేదు.',
      },
      step2: {
        badge: 'సేవా వివరణ',
        title: 'సేవా వివరణ',
        sector: 'ఆరోగ్యం & సంరక్షణ',
        subtitle: 'సులభమైన సాధారణ మార్గదర్శకాలు',
        col1Header: 'ఏమి చెప్పవచ్చు',
        col1Text: 'సేవ గురించి సాధారణ మాటల్లో వివరించండి.',
        col2Header: 'ఏమి చెప్పకూడదు',
        col2Text: 'వైద్య లేదా చట్టపరమైన సలహాలు ఇవ్వవద్దు.',
        tag: 'బట్టీ పట్టాల్సిన అవసరం లేదు',
      },
      step3: {
        badge: 'పరిచయం',
        title: 'కొత్త పరిచయం',
        contact: 'రాధ కె. • క్లినిక్ సంప్రదింపు',
        toggleLabel: '“వారు అంగీకరించారు”',
        toggleStatus: 'అంగీకారం ధృవీకరించబడింది',
        btn: 'రిఫరల్ sBLOOM కు పంపండి',
        note: 'మీరు పరిచయం చేయండి. అక్కడి నుండి సంస్థ చూసుకుంటుంది.',
      },
      step4: {
        badge: 'నిబంధనలు',
        title: 'ప్రొవైడర్ నిబంధనలు & అర్హత',
        subtitle: 'నిబంధనల ప్రకారం అర్హతను పరిశీలించండి',
        items: [
          { label: 'పరిచయం సమర్పించబడింది', status: 'సమర్పించబడింది', time: '10 నిమిషాల క్రితం', color: '#6B3CFF' },
          { label: 'ప్రొవైడర్ పరిశీలన', status: 'పురోగతిలో ఉంది', time: 'ఈరోజు', color: '#FF4FA3' },
          { label: 'అర్హత షరతులు', status: 'అర్హత సాధించింది', time: 'నిబంధనల ప్రకారం', color: '#10B981' },
        ],
        footer: 'పరిహారం ప్రొవైడర్ నిబంధనలు మరియు రిఫరల్ అర్హతపై ఆధారపడి ఉంటుంది.',
      },
    },
  }

  const currentMockup = mockupText[lang] || mockupText.en

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative bg-[#FAF7F2] scroll-mt-24 py-12 lg:py-20 pin:py-0"
      aria-label="How it works"
    >
      <div
        ref={pinWrapperRef}
        className="relative w-full flex flex-col items-center px-4 pt-0 pb-0 overflow-visible
                   pin:h-screen pin:justify-start pin:pt-[96px] pin:pb-4 pin:overflow-visible"
      >
        <div className="site-container flex flex-col gap-5 pin:gap-6 w-full">
          {/* Section Header */}
          <div data-reveal="heading" className="text-left max-w-[680px] flex flex-col items-start gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 border border-[#12101F]/10 rounded-full shadow-sm text-sm text-[#827C94]">
              <ListOrdered size={14} className="text-[#6B3CFF]" aria-hidden="true" />
              <span className="font-mono">{copy.howItWorks.eyebrow}</span>
            </div>

            <h2 className="section-heading font-bold text-[#12101F] tracking-tight m-0 font-headline">
              {copy.howItWorks.headline.split(' ').map((word, idx) => (
                <React.Fragment key={`hiw-word-${idx}`}>
                  <span className="inline-block">{word}</span>
                  {' '}
                </React.Fragment>
              ))}
            </h2>

            {copy.howItWorks.subheading && (
              <p className="text-base sm:text-lg text-[#575266] m-0 leading-relaxed max-w-[620px]">
                {copy.howItWorks.subheading}
              </p>
            )}
          </div>

          {/* Stepper Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] items-center gap-8 lg:gap-12 relative w-full">
            {/* Left Column: Stepper List with Highlighted Active Step */}
            <div data-reveal="card" className="relative flex flex-col gap-3.5 pl-1.5" role="tablist" aria-label="Four steps">
              {stepsData.map((step, idx) => {
                const isSelected = activeStep === idx
                const isCompleted = idx < activeStep

                return (
                  <div
                    key={idx}
                    role="tab"
                    id={`step-tab-${idx}`}
                    aria-selected={isSelected}
                    aria-controls={`step-panel-${idx}`}
                    tabIndex={0}
                    className={`relative flex items-start gap-4 p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-white border-[#6B3CFF]/40 shadow-xl shadow-[#6B3CFF]/10'
                        : 'bg-white/60 border-[#12101F]/5 hover:bg-white/95 hover:border-[#6B3CFF]/30 hover:shadow-md'
                    }`}
                    onClick={() => setActiveStep(idx)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        setActiveStep(idx)
                      }
                    }}
                  >
                    <div className="shrink-0 flex items-center justify-center relative z-[2]">
                      <div
                        className={`w-8 h-8 rounded-full border-2 text-xs font-bold flex items-center justify-center transition-all font-mono ${
                          isSelected
                            ? 'bg-[#6B3CFF] border-[#6B3CFF] text-white shadow-md shadow-[#6B3CFF]/35'
                            : isCompleted
                            ? 'bg-[#6B3CFF]/15 border-[#6B3CFF] text-[#6B3CFF]'
                            : 'bg-white border-[#12101F]/15 text-[#827C94]'
                        }`}
                      >
                        {isCompleted ? <Check size={14} strokeWidth={3} /> : step.number}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 relative z-[2]">
                      <h3 className="text-lg font-bold text-[#12101F] leading-tight m-0 font-headline tracking-tight">{step.title}</h3>
                      <p className={`text-sm leading-relaxed text-[#575266] m-0 ${isSelected ? '' : 'pinshort:hidden'}`}>
                        {step.description}
                      </p>
                    </div>

                    {/* Timeline Connector segment centered to circle (left: 34.5px) */}
                    {idx < stepsData.length - 1 && (
                      <span
                        aria-hidden="true"
                        className={`hidden sm:block absolute z-[1] left-[34.5px] top-[52px] -bottom-[26px] w-[3px] rounded-full transition-colors duration-300 ${
                          idx < activeStep ? 'bg-gradient-to-b from-[#6B3CFF] to-[#FF4FA3]' : 'bg-[#12101F]/10'
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Right Column: Dynamic Phone Mockup Changing Per Step */}
            <div data-reveal="card" className="flex justify-center w-full">
              <div
                className="w-full max-w-[340px] h-[450px] pin:h-[clamp(380px,calc(100svh-280px),450px)] bg-white
                           border-[9px] border-[#1A162B] rounded-[40px] shadow-2xl shadow-[#12101F]/10
                           flex flex-col p-3 sm:p-3.5 box-border overflow-hidden"
                role="tabpanel"
                id={`step-panel-${activeStep}`}
                aria-labelledby={`step-tab-${activeStep}`}
              >
                {/* Phone Chrome Notch with Step Badge */}
                <div className="flex items-center justify-between px-1 pb-2.5 border-b border-[#12101F]/10">
                  <span className="text-[10px] font-bold text-[#12101F] font-mono">9:41</span>
                  <div className="w-12 h-1 bg-[#E8E2D8] rounded-full" />
                  <span className="text-[9.5px] font-bold text-[#6B3CFF] bg-[#6B3CFF]/10 px-2 py-0.5 rounded-full font-mono">
                    {activeStep === 0
                      ? currentMockup.step1.badge
                      : activeStep === 1
                      ? currentMockup.step2.badge
                      : activeStep === 2
                      ? currentMockup.step3.badge
                      : currentMockup.step4.badge}
                  </span>
                </div>

                {/* Dynamic Inner Screen */}
                <div className="flex-1 flex flex-col justify-between py-3 overflow-y-auto">
                  {activeStep === 0 && (
                    <div className="flex flex-col h-full justify-between gap-2.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-[#12101F]">{currentMockup.step1.title}</span>
                        <span className="text-[11px] text-[#827C94]">{currentMockup.step1.subtitle}</span>
                      </div>

                      <div className="flex flex-col gap-2 my-1">
                        <div className="flex flex-col gap-0.5">
                          <label className="text-[10px] font-semibold text-[#575266]">{currentMockup.step1.field1}</label>
                          <div className="bg-[#FAF7F2] border border-[#12101F]/10 rounded-lg px-2.5 py-1.5 text-xs text-[#12101F]">{currentMockup.step1.val1}</div>
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <label className="text-[10px] font-semibold text-[#575266]">{currentMockup.step1.field2}</label>
                          <div className="bg-[#FAF7F2] border border-[#12101F]/10 rounded-lg px-2.5 py-1.5 text-xs text-[#12101F]">{currentMockup.step1.val2}</div>
                        </div>

                        <div className="flex flex-col gap-0.5">
                          <label className="text-[10px] font-semibold text-[#575266]">{currentMockup.step1.field3}</label>
                          <div className="bg-[#FAF7F2] border border-[#12101F]/10 rounded-lg px-2.5 py-1.5 text-xs text-[#12101F]">{currentMockup.step1.val3}</div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="w-full bg-[#6B3CFF] hover:bg-[#582CD6] text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#6B3CFF]/20"
                        onClick={() => onBecomeAffiliate && onBecomeAffiliate()}
                      >
                        <span>{currentMockup.step1.btn}</span>
                        <ArrowRight size={14} />
                      </button>
                      <span className="text-[10px] text-center text-[#827C94] font-mono block">{currentMockup.step1.footer}</span>
                    </div>
                  )}

                  {activeStep === 1 && (
                    <div className="flex flex-col h-full justify-start gap-3">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-[#FF6B6B]/15 text-[#FF6B6B] px-1.5 py-0.5 rounded font-mono whitespace-nowrap">{currentMockup.step2.sector}</span>
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-[#D6F36B]/40 text-[#12101F] px-1.5 py-0.5 rounded font-mono whitespace-nowrap">{currentMockup.step2.tag}</span>
                        </div>
                        <span className="text-sm font-bold text-[#12101F]">{currentMockup.step2.title}</span>
                        <span className="text-[11px] text-[#827C94]">{currentMockup.step2.subtitle}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 my-2">
                        <div className="bg-[#ECFDF5] border border-[#10B981]/20 p-2 rounded-lg flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-[#059669] uppercase font-mono">{currentMockup.step2.col1Header}</span>
                          <p className="text-[10.5px] leading-tight text-[#12101F] m-0">{currentMockup.step2.col1Text}</p>
                        </div>

                        <div className="bg-[#FEF2F2] border border-[#EF4444]/20 p-2 rounded-lg flex flex-col gap-1">
                          <span className="text-[10px] font-bold text-[#DC2626] uppercase font-mono">{currentMockup.step2.col2Header}</span>
                          <p className="text-[10.5px] leading-tight text-[#12101F] m-0">{currentMockup.step2.col2Text}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#12101F]/10 p-2 rounded-lg text-[10.5px] text-[#575266] mt-auto">
                        <ShieldCheck size={16} className="text-[#059669] shrink-0" />
                        <span>{lang === 'te' ? 'సేవా సంస్థ పూర్తి వివరాలను అందిస్తుంది' : 'The provider explains full details'}</span>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="flex flex-col h-full justify-between gap-2.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-[#12101F]">{currentMockup.step3.title}</span>
                        <span className="text-[11px] text-[#827C94]">{currentMockup.step3.contact}</span>
                      </div>

                      <div className="flex items-center justify-between p-2.5 bg-[#FAF7F2] border border-[#12101F]/10 rounded-xl my-2">
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-[#12101F]">{currentMockup.step3.toggleLabel}</span>
                          <span className="text-[10px] text-[#10B981] font-semibold font-mono">{currentMockup.step3.toggleStatus}</span>
                        </div>
                        <div className="text-[#10B981]">
                          <ToggleRight size={28} className="text-[#10B981]" />
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mt-auto">
                        <button type="button" className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#10B981]/20">
                          <span>{currentMockup.step3.btn}</span>
                          <ArrowRight size={14} />
                        </button>
                        <p className="text-[10px] text-center text-[#827C94] m-0">{currentMockup.step3.note}</p>
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="flex flex-col h-full justify-between gap-2.5">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-bold text-[#12101F]">{currentMockup.step4.title}</span>
                        <span className="text-[11px] text-[#827C94]">{currentMockup.step4.subtitle}</span>
                      </div>

                      <div className="flex flex-col gap-2 my-2">
                        {currentMockup.step4.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 bg-[#FAF7F2] border border-[#12101F]/5 rounded-lg text-xs">
                            <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                            <div className="flex-1 flex flex-col">
                              <span className="text-[11px] font-semibold text-[#12101F]">{item.label}</span>
                              <span className="text-[9.5px] text-[#827C94] font-mono">{item.status}</span>
                            </div>
                            <span className="text-[9.5px] text-[#827C94] font-mono shrink-0">{item.time}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#6B3CFF]/10 to-[#FF4FA3]/10 border border-[#6B3CFF]/20 p-2 rounded-xl text-[10.5px] text-[#6B3CFF] font-semibold">
                        <Sparkles size={16} className="text-[#6B3CFF] shrink-0" />
                        <span className="text-[10px] font-mono">{currentMockup.step4.footer}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Step Dots on Phone */}
                <div className="flex justify-center gap-1.5 pt-2 border-t border-[#12101F]/5">
                  {stepsData.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      type="button"
                      aria-label={`Go to step ${dotIdx + 1}`}
                      className={`h-1.5 rounded-full transition-all ${activeStep === dotIdx ? 'w-5 bg-[#6B3CFF]' : 'w-1.5 bg-[#12101F]/15'}`}
                      onClick={() => setActiveStep(dotIdx)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
