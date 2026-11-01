import React, { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Check, ArrowRight, ShieldCheck, ToggleRight, ListOrdered, Sparkles } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

gsap.registerPlugin(ScrollTrigger)

export default function HowItWorksSection({ onBecomeAffiliate }) {
  const { lang, copy } = useLanguage()
  const sectionRef = useRef(null)
  const stepRefs = useRef([])
  const [activeStep, setActiveStep] = useState(0)

  const stepsData = copy.howItWorks?.steps || []

  // Initialize ScrollTrigger and IntersectionObserver for reliable scroll progression
  useEffect(() => {
    const section = sectionRef.current
    if (!section || stepsData.length === 0) return

    const triggers = []

    const ctx = gsap.context(() => {
      // For each step panel, set up an activation zone at 50%-55% of viewport
      stepRefs.current.forEach((el, idx) => {
        if (!el) return
        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 55%',
          end: 'bottom 55%',
          onEnter: () => setActiveStep(idx),
          onEnterBack: () => setActiveStep(idx),
        })
        triggers.push(st)
      })
    }, section)

    // Fast, lightweight IntersectionObserver fallback for mobile and instant threshold detection
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-step-index'))
            if (!isNaN(idx)) {
              setActiveStep(idx)
            }
          }
        })
      },
      {
        rootMargin: '-30% 0px -40% 0px',
        threshold: 0.15,
      }
    )

    stepRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    // Refresh triggers after fonts/images load
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 200)

    return () => {
      clearTimeout(refreshTimer)
      triggers.forEach((st) => st.kill())
      ctx.revert()
      observer.disconnect()
    }
  }, [stepsData.length, lang])

  const handleStepClick = (idx) => {
    setActiveStep(idx)
    const targetEl = stepRefs.current[idx]
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

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
        badge: 'జాయిన్ అవ్వడం',
        title: 'మీ డీటెయిల్స్ చెప్పండి',
        subtitle: 'జస్ట్ 2 నిమిషాలు • చేరడం ఫ్రీ',
        field1: 'పూర్తి పేరు',
        val1: 'అనన్య శర్మ',
        field2: 'ఈమెయిల్',
        val2: 'ananya@example.com',
        field3: 'సిటీ, స్టేట్',
        val3: 'హైదరాబాద్, తెలంగాణ',
        btn: 'ముందుకు వెళ్లండి',
        footer: 'చేరడం ఫ్రీ. ఒక్క రూపాయి కట్టక్కర్లేదు.',
      },
      step2: {
        badge: 'సర్వీస్ డీటెయిల్స్',
        title: 'సర్వీస్ డీటెయిల్స్',
        sector: 'హెల్త్‌కేర్ & వెల్‌నెస్',
        subtitle: 'సింపుల్ మాటల్లో గైడెన్స్',
        col1Header: 'ఏం చెప్పాలి',
        col1Text: 'సర్వీస్ గురించి మామూలు మాటల్లో చెప్పండి.',
        col2Header: 'ఏం చెప్పకూడదు',
        col2Text: 'సలహాలు ఇవ్వకండి. ప్రొవైడర్ చూసుకుంటారు.',
        tag: 'బట్టీ పట్టక్కర్లేదు',
      },
      step3: {
        badge: 'పరిచయం',
        title: 'కొత్త పరిచయం',
        contact: 'రాధ కె. • డాక్టర్ కన్సల్టేషన్',
        toggleLabel: '“వాళ్లు ఓకే అన్నారు”',
        toggleStatus: 'పర్మిషన్ తీసుకున్నాం',
        btn: 'డీటెయిల్స్ sBLOOM కి పంపండి',
        note: 'మీరు పరిచయం చేయండి, మిగతాది వాళ్లే చూసుకుంటారు.',
      },
      step4: {
        badge: 'కండిషన్స్',
        title: 'ప్రొవైడర్ కండిషన్స్ & స్టేటస్',
        subtitle: 'కండిషన్స్ ప్రకారం ఎలిజిబిలిటీ చెక్',
        items: [
          { label: 'పరిచయం పంపించాం', status: 'సబ్‌మిట్ అయింది', time: '10 నిమిషాల క్రితం', color: '#6B3CFF' },
          { label: 'ప్రొవైడర్ రివ్యూ', status: 'రివ్యూలో ఉంది', time: 'ఈరోజు', color: '#FF4FA3' },
          { label: 'ఎలిజిబిలిటీ', status: 'ఎలిజిబుల్ అయింది', time: 'రూల్స్ సరిపోయాయి', color: '#10B981' },
        ],
        footer: 'ప్రొవైడర్ కండిషన్స్ ప్రకారం రిజల్ట్ వస్తేనే సంపాదన.',
      },
    },
  }

  const currentMockup = mockupText[lang] || mockupText.en
  const progressRatio = stepsData.length > 1 ? activeStep / (stepsData.length - 1) : 0

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="relative bg-[#FAF7F2] scroll-mt-24 py-16 lg:py-24 border-b border-[#12101F]/6 overflow-visible"
      aria-label="How it works"
    >
      <div className="site-container flex flex-col gap-10 lg:gap-14 w-full">
        {/* Section Header */}
        <div data-reveal="heading" className="text-left max-w-[720px] flex flex-col items-start gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 border border-[#12101F]/10 rounded-full shadow-sm text-sm text-[#827C94]">
            <ListOrdered size={14} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">{copy.howItWorks.eyebrow}</span>
          </div>

          <h2 className="section-heading font-bold text-[#12101F] tracking-tight m-0 font-headline">
            {copy.howItWorks.headline}
          </h2>

          {copy.howItWorks.subheading && (
            <p className="text-base sm:text-lg text-[#575266] m-0 leading-relaxed max-w-[640px]">
              {copy.howItWorks.subheading}
            </p>
          )}
        </div>

        {/* Two-Column Sticky Walkthrough Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-16 items-start relative w-full">
          {/* Left Column: Sequence of 4 Step Panels */}
          <div className="relative flex flex-col pl-4 sm:pl-6" role="tablist" aria-label="Four steps">
            {/* Illuminated Vertical Progress Rail */}
            <div
              className="absolute left-[33px] sm:left-[41px] top-12 bottom-16 w-[3px] bg-[#12101F]/10 -z-0 rounded-full overflow-hidden"
              aria-hidden="true"
            >
              <div
                className="w-full bg-gradient-to-b from-[#6B3CFF] via-[#FF4FA3] to-[#D6F36B] transition-all duration-500 ease-out rounded-full shadow-sm"
                style={{ height: `${progressRatio * 100}%` }}
              />
            </div>

            {stepsData.map((step, idx) => {
              const isSelected = activeStep === idx
              const isCompleted = idx < activeStep

              return (
                <div
                  key={idx}
                  ref={(el) => (stepRefs.current[idx] = el)}
                  data-step-index={idx}
                  role="tab"
                  id={`step-tab-${idx}`}
                  aria-selected={isSelected}
                  aria-controls={`step-panel-${idx}`}
                  tabIndex={0}
                  onClick={() => handleStepClick(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleStepClick(idx)
                    }
                  }}
                  className={`relative flex items-start gap-4 sm:gap-6 p-6 sm:p-8 rounded-3xl border cursor-pointer transition-all duration-300 my-4 lg:my-6 min-h-[220px] lg:min-h-[280px] flex-col justify-center ${
                    isSelected
                      ? 'bg-white border-[#6B3CFF]/50 shadow-xl shadow-[#6B3CFF]/12 translate-x-1 sm:translate-x-2'
                      : isCompleted
                      ? 'bg-white/80 border-[#12101F]/10 opacity-80 hover:opacity-100 hover:bg-white'
                      : 'bg-white/50 border-[#12101F]/8 opacity-60 hover:opacity-90 hover:bg-white/70'
                  }`}
                >
                  <div className="flex items-center gap-4 w-full">
                    {/* Step Number Circle */}
                    <div className="shrink-0 flex items-center justify-center relative z-[2]">
                      <div
                        className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 text-sm font-bold flex items-center justify-center transition-all duration-300 font-mono ${
                          isSelected
                            ? 'bg-[#6B3CFF] border-[#6B3CFF] text-white shadow-lg shadow-[#6B3CFF]/35 scale-110 ring-4 ring-[#6B3CFF]/20'
                            : isCompleted
                            ? 'bg-[#6B3CFF] border-[#6B3CFF] text-white shadow-sm'
                            : 'bg-white border-[#12101F]/15 text-[#827C94]'
                        }`}
                      >
                        {isCompleted ? <Check size={16} strokeWidth={3} /> : step.number}
                      </div>
                    </div>

                    {/* Step Header */}
                    <div className="flex flex-col gap-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-[#827C94] tracking-wider">
                          STEP 0{idx + 1} //
                        </span>
                        {isSelected && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#D6F36B]/40 text-[#12101F] border border-[#D6F36B]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-pulse" aria-hidden="true" />
                            ACTIVE
                          </span>
                        )}
                        {isCompleted && (
                          <span className="text-[10px] font-mono font-bold text-[#6B3CFF]">
                            COMPLETED
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#12101F] leading-tight m-0 font-headline tracking-tight">
                        {step.title}
                      </h3>
                    </div>
                  </div>

                  {/* Step Description */}
                  <p className="text-sm sm:text-base leading-relaxed text-[#575266] m-0 pl-14 sm:pl-17">
                    {step.description}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Right Column: Sticky Visual Stage with Phone Mockup */}
          <div className="relative w-full lg:sticky lg:top-28 lg:self-start flex flex-col items-center justify-center pt-2 lg:pt-6 pb-6">
            <div
              className="w-full max-w-[340px] sm:max-w-[360px] h-[480px] sm:h-[500px] bg-white
                         border-[10px] border-[#1A162B] rounded-[44px] shadow-2xl shadow-[#12101F]/15
                         flex flex-col p-3.5 box-border overflow-hidden transition-all duration-300"
              role="tabpanel"
              id={`step-panel-${activeStep}`}
              aria-labelledby={`step-tab-${activeStep}`}
            >
              {/* Phone Chrome Notch with Step Badge */}
              <div className="flex items-center justify-between px-2 pb-3 border-b border-[#12101F]/10">
                <span className="text-[10px] font-bold text-[#12101F] font-mono">9:41</span>
                <div className="w-12 h-1 bg-[#E8E2D8] rounded-full" />
                <span className="text-[9.5px] font-bold text-[#6B3CFF] bg-[#6B3CFF]/10 px-2.5 py-0.5 rounded-full font-mono">
                  {activeStep === 0
                    ? currentMockup.step1.badge
                    : activeStep === 1
                    ? currentMockup.step2.badge
                    : activeStep === 2
                    ? currentMockup.step3.badge
                    : currentMockup.step4.badge}
                </span>
              </div>

              {/* Dynamic Inner Screen with smooth crossfade */}
              <div className="flex-1 flex flex-col justify-between py-3.5 overflow-y-auto transition-opacity duration-300">
                {activeStep === 0 && (
                  <div className="flex flex-col h-full justify-between gap-3 animate-fade-in">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-[#12101F] font-headline">
                        {currentMockup.step1.title}
                      </span>
                      <span className="text-[11px] text-[#827C94]">{currentMockup.step1.subtitle}</span>
                    </div>

                    <div className="flex flex-col gap-2 my-1">
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[10px] font-semibold text-[#575266]">
                          {currentMockup.step1.field1}
                        </label>
                        <div className="bg-[#FAF7F2] border border-[#12101F]/10 rounded-lg px-2.5 py-1.5 text-xs text-[#12101F]">
                          {currentMockup.step1.val1}
                        </div>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <label className="text-[10px] font-semibold text-[#575266]">
                          {currentMockup.step1.field2}
                        </label>
                        <div className="bg-[#FAF7F2] border border-[#12101F]/10 rounded-lg px-2.5 py-1.5 text-xs text-[#12101F]">
                          {currentMockup.step1.val2}
                        </div>
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <label className="text-[10px] font-semibold text-[#575266]">
                          {currentMockup.step1.field3}
                        </label>
                        <div className="bg-[#FAF7F2] border border-[#12101F]/10 rounded-lg px-2.5 py-1.5 text-xs text-[#12101F]">
                          {currentMockup.step1.val3}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="w-full bg-[#6B3CFF] hover:bg-[#582CD6] text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#6B3CFF]/20 cursor-pointer"
                      onClick={() => onBecomeAffiliate && onBecomeAffiliate('signup')}
                    >
                      <span>{currentMockup.step1.btn}</span>
                      <ArrowRight size={14} />
                    </button>
                    <span className="text-[10px] text-center text-[#827C94] font-mono block">
                      {currentMockup.step1.footer}
                    </span>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="flex flex-col h-full justify-start gap-3 animate-fade-in">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex flex-wrap items-center gap-1.5 mb-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-[#FF6B6B]/15 text-[#FF6B6B] px-1.5 py-0.5 rounded font-mono whitespace-nowrap">
                          {currentMockup.step2.sector}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider bg-[#D6F36B]/40 text-[#12101F] px-1.5 py-0.5 rounded font-mono whitespace-nowrap">
                          {currentMockup.step2.tag}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-[#12101F] font-headline">
                        {currentMockup.step2.title}
                      </span>
                      <span className="text-[11px] text-[#827C94]">{currentMockup.step2.subtitle}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 my-2">
                      <div className="bg-[#ECFDF5] border border-[#10B981]/20 p-2.5 rounded-lg flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-[#059669] uppercase font-mono">
                          {currentMockup.step2.col1Header}
                        </span>
                        <p className="text-[10.5px] leading-tight text-[#12101F] m-0">
                          {currentMockup.step2.col1Text}
                        </p>
                      </div>

                      <div className="bg-[#FEF2F2] border border-[#EF4444]/20 p-2.5 rounded-lg flex flex-col gap-1">
                        <span className="text-[10px] font-bold text-[#DC2626] uppercase font-mono">
                          {currentMockup.step2.col2Header}
                        </span>
                        <p className="text-[10.5px] leading-tight text-[#12101F] m-0">
                          {currentMockup.step2.col2Text}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#FAF7F2] border border-[#12101F]/10 p-2 rounded-lg text-[10.5px] text-[#575266] mt-auto">
                      <ShieldCheck size={16} className="text-[#059669] shrink-0" />
                      <span>
                        {lang === 'te'
                          ? 'ఫుల్ డీటెయిల్స్ వాళ్లే చెబుతారు'
                          : 'The provider explains full details'}
                      </span>
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="flex flex-col h-full justify-between gap-3 animate-fade-in">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-[#12101F] font-headline">
                        {currentMockup.step3.title}
                      </span>
                      <span className="text-[11px] text-[#827C94]">{currentMockup.step3.contact}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#FAF7F2] border border-[#12101F]/10 rounded-xl my-2">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#12101F]">
                          {currentMockup.step3.toggleLabel}
                        </span>
                        <span className="text-[10px] text-[#10B981] font-semibold font-mono">
                          {currentMockup.step3.toggleStatus}
                        </span>
                      </div>
                      <div className="text-[#10B981]">
                        <ToggleRight size={28} className="text-[#10B981]" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 mt-auto">
                      <button
                        type="button"
                        className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-[#10B981]/20 cursor-pointer"
                      >
                        <span>{currentMockup.step3.btn}</span>
                        <ArrowRight size={14} />
                      </button>
                      <p className="text-[10px] text-center text-[#827C94] m-0">
                        {currentMockup.step3.note}
                      </p>
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="flex flex-col h-full justify-between gap-3 animate-fade-in">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-bold text-[#12101F] font-headline">
                        {currentMockup.step4.title}
                      </span>
                      <span className="text-[11px] text-[#827C94]">{currentMockup.step4.subtitle}</span>
                    </div>

                    <div className="flex flex-col gap-2 my-1">
                      {currentMockup.step4.items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 bg-[#FAF7F2] border border-[#12101F]/5 rounded-lg text-xs"
                        >
                          <div
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: item.color }}
                          />
                          <div className="flex-1 flex flex-col">
                            <span className="text-[11px] font-semibold text-[#12101F]">{item.label}</span>
                            <span className="text-[9.5px] text-[#827C94] font-mono">{item.status}</span>
                          </div>
                          <span className="text-[9.5px] text-[#827C94] font-mono shrink-0">
                            {item.time}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 bg-gradient-to-r from-[#6B3CFF]/10 to-[#FF4FA3]/10 border border-[#6B3CFF]/20 p-2.5 rounded-xl text-[10.5px] text-[#6B3CFF] font-semibold mt-auto">
                      <Sparkles size={16} className="text-[#6B3CFF] shrink-0" />
                      <span className="text-[10px] font-mono leading-tight">
                        {currentMockup.step4.footer}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Step Indicator Dots on Phone */}
              <div className="flex justify-center gap-1.5 pt-2.5 border-t border-[#12101F]/5">
                {stepsData.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    type="button"
                    aria-label={`Go to step ${dotIdx + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer border-none p-0 ${
                      activeStep === dotIdx ? 'w-6 bg-[#6B3CFF]' : 'w-2 bg-[#12101F]/15 hover:bg-[#12101F]/30'
                    }`}
                    onClick={() => handleStepClick(dotIdx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
