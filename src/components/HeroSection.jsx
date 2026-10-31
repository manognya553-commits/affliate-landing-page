import React from 'react'
import { ArrowUpRight, ArrowDown, Sparkles, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'
import LivingNetworkVisualizer from './LivingNetworkVisualizer'

export default function HeroSection({ onBecomeAffiliate }) {
  const { lang, copy } = useLanguage()

  const handleCtaClick = (e) => {
    if (onBecomeAffiliate) {
      e.preventDefault()
      onBecomeAffiliate()
    }
  }

  return (
    <section
      id="hero"
      className="relative min-h-0 lg:min-h-[760px] lg:max-h-[940px] h-auto lg:h-screen flex items-center pt-28 pb-14 lg:pt-28 lg:pb-8 overflow-visible lg:overflow-hidden box-border bg-[radial-gradient(circle_at_70%_40%,rgba(107,60,255,0.07)_0%,rgba(255,79,163,0.04)_35%,rgba(214,243,107,0.03)_65%,transparent_80%)] scroll-mt-24"
      aria-label="sBLOOM Affiliate Programme Hero"
    >
      <div className="site-container relative grid grid-cols-1 lg:grid-cols-[1.15fr_0.95fr] items-center gap-10 lg:gap-14">
        {/* Left Column: Copy & Value Proposition */}
        <div className="flex flex-col items-start gap-4 sm:gap-5 max-w-[680px] z-[2]">
          {/* Eyebrow with Telemetry coordinate style */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 border border-ink/10 rounded-full shadow-xs text-ink-muted">
            <Sparkles size={13} className="text-brand-violet" aria-hidden="true" />
            <span className="font-mono text-xs">{copy.hero.eyebrow}</span>
          </div>

          {/* Headline with Bloom Gradient Accent (split by whole words only) */}
          <h1 className="font-headline text-3xl sm:text-5xl lg:text-[52px] font-bold leading-[1.12] text-ink tracking-tight m-0">
            {copy.hero.headlineLead.split(' ').map((word, idx) => (
              <React.Fragment key={`lead-${idx}`}>
                <span className="headline-word">{word}</span>{' '}
              </React.Fragment>
            ))}
            <span className="text-bloom-gradient font-headline inline">
              {copy.hero.headlineAccent.split(' ').map((word, idx) => (
                <React.Fragment key={`acc-${idx}`}>
                  <span className="headline-word">
                    {lang === 'te' ? word : <em>{word}</em>}
                  </span>{' '}
                </React.Fragment>
              ))}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-[17px] leading-relaxed text-ink-secondary m-0 max-w-[600px]">
            {copy.hero.subheading}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mt-1">
            <a
              href="#contact"
              className="btn btn-primary w-full sm:w-auto px-7 py-3.5 text-sm sm:text-[15px] font-semibold rounded-full shadow-md hover:shadow-violet-glow hover:-translate-y-0.5 transition-all duration-200"
              onClick={handleCtaClick}
            >
              <span>{copy.hero.primaryCta}</span>
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>

            <a
              href="#how-it-works"
              className="btn btn-secondary w-full sm:w-auto px-6 py-3.5 text-sm sm:text-[14.5px] font-semibold rounded-full shadow-sm hover:-translate-y-0.5 transition-all duration-200"
            >
              <span>{copy.hero.secondaryCta}</span>
              <ArrowDown size={16} aria-hidden="true" />
            </a>
          </div>

          {/* 4-Item Trust Row Chips (telemetry styled) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-4 mt-1 border-t border-ink/10 w-full" role="list" aria-label="Programme Highlights">
            {copy.hero.trustRow.map((chip, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 bg-white/90 border border-ink/10 rounded-full px-2.5 sm:px-3 py-1.5 text-xs sm:text-[12.5px] font-medium text-ink-secondary shadow-2xs hover:bg-white hover:border-brand-violet/30 hover:-translate-y-0.5 transition-all duration-200 justify-start"
                role="listitem"
              >
                <CheckCircle2 size={14} className="text-brand-violet" aria-hidden="true" />
                <span>{chip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Custom Living Network Visualizer */}
        <div className="relative flex items-center justify-center w-full mt-4 lg:mt-0">
          <LivingNetworkVisualizer />
        </div>
      </div>
    </section>
  )
}


