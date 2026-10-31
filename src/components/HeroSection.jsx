import React from 'react'
import { ArrowUpRight, ArrowDown, Sparkles, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'
import FloatingOrbsCanvas from './FloatingOrbsCanvas'

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
      className="relative min-h-0 lg:min-h-[720px] lg:max-h-[900px] h-auto lg:h-screen flex items-center pt-28 pb-12 lg:pt-24 lg:pb-6 overflow-visible lg:overflow-hidden box-border bg-[radial-gradient(circle_at_75%_35%,rgba(107,60,255,0.06)_0%,rgba(255,79,163,0.035)_35%,rgba(214,243,107,0.025)_65%,transparent_80%)] scroll-mt-24"
      aria-label="sBLOOM Affiliate Programme Hero"
    >
      {/* SVG Clip Path Definition for True Organic Blob */}
      <svg width="0" height="0" className="absolute w-0 h-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <defs>
          <clipPath id="heroOrganicBlobClip" clipPathUnits="objectBoundingBox">
            <path d="M 0.26 0.05 C 0.46 -0.04, 0.74 -0.01, 0.89 0.16 C 1.02 0.32, 1.01 0.65, 0.90 0.84 C 0.79 1.01, 0.46 1.02, 0.27 0.95 C 0.08 0.88, -0.03 0.71, 0.01 0.48 C 0.04 0.25, 0.09 0.12, 0.26 0.05 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="site-container relative grid grid-cols-1 lg:grid-cols-[1.18fr_0.92fr] items-center gap-10">
        {/* Left Column: Copy & Value Proposition */}
        <div className="flex flex-col items-start gap-4 max-w-[660px] z-[2]">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 border border-ink/10 rounded-full shadow-sm text-ink-muted">
            <Sparkles size={13} className="text-brand-violet" aria-hidden="true" />
            <span className="font-mono text-xs">{copy.hero.eyebrow}</span>
          </div>

          {/* Headline with Bloom Gradient Accent (split by whole words only) */}
          <h1 className="font-headline text-3xl sm:text-5xl 2xl:text-[46px] font-bold leading-[1.1] text-ink tracking-tight m-0">
            {copy.hero.headlineLead.split(' ').map((word, idx) => (
              <React.Fragment key={`lead-${idx}`}>
                <span className="headline-word">{word}</span>
                {' '}
              </React.Fragment>
            ))}
            <span className="text-bloom-gradient font-headline inline">
              {copy.hero.headlineAccent.split(' ').map((word, idx) => (
                <React.Fragment key={`acc-${idx}`}>
                  <span className="headline-word">
                    {lang === 'te' ? word : <em>{word}</em>}
                  </span>
                  {' '}
                </React.Fragment>
              ))}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-[16.5px] leading-relaxed text-ink-secondary m-0 max-w-[580px]">
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

          {/* 4-Item Trust Row Chips (wraps neatly inside the left column and divider line) */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-3.5 mt-1 border-t border-ink/10 w-full" role="list" aria-label="Programme Highlights">
            {copy.hero.trustRow.map((chip, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 bg-white/85 border border-ink/10 rounded-full px-2.5 sm:px-3 py-1.5 text-xs sm:text-[12.5px] font-medium text-ink-secondary shadow-sm hover:bg-white hover:border-brand-violet/30 hover:-translate-y-0.5 transition-all duration-200 justify-start"
                role="listitem"
              >
                <CheckCircle2 size={14} className="text-brand-violet" aria-hidden="true" />
                <span>{chip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Organic Blob Video with Floating Chat Bubbles & 3D Orbs Behind */}
        <div className="relative flex items-center justify-center min-h-[340px] sm:min-h-[400px] lg:min-h-[480px] w-full mt-4 lg:mt-0">
          {/* Video Container with True Organic Blob Mask & Floating Chat Bubbles */}
          <div className="relative w-[280px] h-[280px] sm:w-[320px] sm:h-[320px] lg:w-[360px] lg:h-[360px] flex items-center justify-center z-[2]">
            {/* 3D Orb Network Backdrop (Anchored directly to video blob container so orbs always center perfectly on the blob) */}
            <div className="absolute -inset-28 sm:-inset-32 lg:-inset-36 z-[1] pointer-events-none" aria-hidden="true">
              <FloatingOrbsCanvas />
            </div>

            {/* Organic SVG Blob Container */}
            {/* Organic SVG Blob Container with Authentic Community Warmth */}
            <div className="relative w-[270px] h-[270px] sm:w-[310px] sm:h-[310px] lg:w-[340px] lg:h-[340px] rounded-[38%] overflow-hidden blob-clip-organic shadow-2xl z-[2] group">
              <img
                src="/assets/hero-community.jpg"
                alt="Everyday trusted conversations between community members"
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-violet/20 via-transparent to-transparent pointer-events-none" aria-hidden="true" />
            </div>

            {/* Glowing Organic Border Outline */}
            <svg className="absolute -inset-2 w-[296px] h-[296px] sm:w-[336px] sm:h-[336px] lg:w-[376px] lg:h-[376px] pointer-events-none z-[3]" viewBox="0 0 340 340" aria-hidden="true">
              <path
                d="M 88.4 17 C 156.4 -13.6, 251.6 -3.4, 302.6 54.4 C 346.8 108.8, 343.4 221, 306 285.6 C 268.6 343.4, 156.4 346.8, 91.8 323 C 27.2 299.2, -10.2 241.4, 3.4 163.2 C 13.6 85, 30.6 40.8, 88.4 17 Z"
                fill="none"
                stroke="url(#contourGradient)"
                strokeWidth="2.5"
              />
              <defs>
                <linearGradient id="contourGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6B3CFF" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#FF4FA3" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#D6F36B" stopOpacity="0.7" />
                </linearGradient>
              </defs>
            </svg>

            {/* Floating Chat Bubble 1: Question (Clear of blob figures and orbs) */}
            <div
              className={`absolute ${
                lang === 'te'
                  ? '-left-3 -top-6 sm:-left-6 sm:-top-6 lg:-left-8 lg:-top-6 max-w-[240px]'
                  : '-left-4 -top-6 sm:-left-6 sm:-top-5 lg:-left-8 lg:-top-4 max-w-[180px] sm:max-w-[210px]'
              } bg-white/95 backdrop-blur-md border border-ink/10 rounded-2xl rounded-bl-sm p-3 sm:p-3.5 shadow-lg z-[4] animate-[float_4s_ease-in-out_infinite]`}
              aria-label="Conversation Question"
            >
              <span className="block text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-ink-muted mb-1">
                {copy.hero.bubbles.askSpeaker || 'Neighbor'}
              </span>
              <p className={`font-semibold text-ink leading-snug m-0 ${lang === 'te' ? '!text-[13px] text-[13px]' : 'text-xs sm:text-[14px]'}`}>
                {copy.hero.bubbles.ask}
              </p>
            </div>

            {/* Floating Chat Bubble 2: Response (Below-right of the blob so it does not cover the blob figures) */}
            <div
              className={`absolute ${
                lang === 'te'
                  ? '-right-2 -bottom-10 sm:-right-4 sm:-bottom-12 lg:-right-6 lg:-bottom-12 w-[250px]'
                  : '-right-3 -bottom-5 sm:-right-6 sm:-bottom-4 lg:-right-8 lg:-bottom-2 max-w-[200px] sm:max-w-[230px]'
              } bg-white/95 backdrop-blur-md border border-brand-violet/25 rounded-2xl rounded-tr-sm p-3 sm:p-3.5 shadow-lg z-[4] animate-[float_4s_ease-in-out_2s_infinite]`}
              aria-label="Conversation Introduction"
            >
              <span className="block text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider text-brand-violet mb-1">
                {copy.hero.bubbles.replySpeaker || 'You (Affiliate)'}
              </span>
              <p className={`font-semibold text-ink leading-snug m-0 ${lang === 'te' ? '!text-[13px] text-[13px]' : 'text-xs sm:text-[14px]'}`}>
                {copy.hero.bubbles.reply}
              </p>
            </div>

            {/* Thin Luminous Connecting Thread Linking Bubble 1 and Bubble 2 */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-[3] opacity-85"
              viewBox="0 0 380 340"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d={lang === 'te' ? 'M 60 20 C 180 10, 270 140, 310 290' : 'M 70 30 C 180 5, 270 120, 290 270'}
                stroke="url(#threadGradient)"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeDasharray="4 4"
              />
              <defs>
                <linearGradient id="threadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6B3CFF" />
                  <stop offset="50%" stopColor="#FF4FA3" />
                  <stop offset="100%" stopColor="#D6F36B" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </section>
  )
}

