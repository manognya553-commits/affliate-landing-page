import React, { useRef, useState, useEffect, useCallback } from 'react'
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  HeartPulse,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  Pause,
  Play,
} from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

// Sector theme definitions for visual accents and icons
const SECTOR_THEMES = {
  healthcare: {
    accentColor: '#FF6B6B',
    accentBorder: 'border-[#FF6B6B]/30',
    accentBg: 'bg-[#FF6B6B]/10',
    accentText: 'text-[#E03131]',
    badgeBg: 'bg-[#FF6B6B]/15',
    badgeText: 'text-[#C92A2A]',
    glowColor: 'from-[#FF6B6B]/15 via-[#FF4FA3]/10 to-transparent',
    icon: HeartPulse,
    callerBg: '#FFF5F5',
    callerColor: '#E03131',
  },
  education: {
    accentColor: '#16A34A',
    accentBorder: 'border-[#16A34A]/30',
    accentBg: 'bg-[#16A34A]/10',
    accentText: 'text-[#15803D]',
    badgeBg: 'bg-[#16A34A]/15',
    badgeText: 'text-[#166534]',
    glowColor: 'from-[#16A34A]/15 via-[#D6F36B]/10 to-transparent',
    icon: GraduationCap,
    callerBg: '#F0FDF4',
    callerColor: '#15803D',
  },
  professional: {
    accentColor: '#0D9488',
    accentBorder: 'border-[#0D9488]/30',
    accentBg: 'bg-[#0D9488]/10',
    accentText: 'text-[#0F766E]',
    badgeBg: 'bg-[#0D9488]/15',
    badgeText: 'text-[#115E59]',
    glowColor: 'from-[#0D9488]/15 via-[#2DD4BF]/10 to-transparent',
    icon: Briefcase,
    callerBg: '#F0FDFA',
    callerColor: '#0F766E',
  },
}

export default function ConversationCarouselSection() {
  const { lang, copy } = useLanguage()
  const data = copy.conversations || {}
  const sectors = data.sectors || []

  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const scrollContainerRef = useRef(null)
  const isProgrammaticScrollRef = useRef(false)

  // Determine reduced motion preference
  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Scroll smoothly to a specific card index
  const scrollToCard = useCallback(
    (index) => {
      const container = scrollContainerRef.current
      if (!container || sectors.length === 0) return

      const safeIndex = Math.max(0, Math.min(index, sectors.length - 1))
      setActiveIndex(safeIndex)

      const card = container.children[safeIndex]
      if (!card) return

      isProgrammaticScrollRef.current = true

      // Center the target card inside the container
      const containerWidth = container.clientWidth
      const cardWidth = card.clientWidth
      const cardLeft = card.offsetLeft
      const targetScrollLeft = cardLeft - (containerWidth - cardWidth) / 2

      container.scrollTo({
        left: targetScrollLeft,
        behavior: isReducedMotion ? 'auto' : 'smooth',
      })

      // Re-enable scroll listener after animation completes
      setTimeout(
        () => {
          isProgrammaticScrollRef.current = false
        },
        isReducedMotion ? 50 : 450
      )
    },
    [sectors.length, isReducedMotion]
  )

  // Automatic carousel rotation every 4 seconds
  useEffect(() => {
    if (isReducedMotion || isPaused || sectors.length <= 1) return

    const intervalId = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIndex = (prev + 1) % sectors.length
        scrollToCard(nextIndex)
        return nextIndex
      })
    }, 4000)

    return () => clearInterval(intervalId)
  }, [isPaused, isReducedMotion, sectors.length, scrollToCard, lang])

  // Center the active card on initial mount or language toggle
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToCard(activeIndex)
    }, 150)
    return () => clearTimeout(timer)
  }, [lang, activeIndex, scrollToCard])

  // Listen to manual scrolling / touch swiping to update active index
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    let rafId = null

    const handleScroll = () => {
      if (isProgrammaticScrollRef.current) return

      if (rafId) cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        const containerCenter = container.scrollLeft + container.clientWidth / 2
        let closestIndex = 0
        let closestDistance = Infinity

        Array.from(container.children).forEach((child, idx) => {
          const childCenter = child.offsetLeft + child.clientWidth / 2
          const distance = Math.abs(containerCenter - childCenter)
          if (distance < closestDistance) {
            closestDistance = distance
            closestIndex = idx
          }
        })

        setActiveIndex((prev) => (prev !== closestIndex ? closestIndex : prev))
      })
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      container.removeEventListener('scroll', handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [sectors.length])

  // Keyboard navigation for carousel
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      scrollToCard(activeIndex - 1)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      scrollToCard(activeIndex + 1)
    } else if (e.key === 'Home') {
      e.preventDefault()
      scrollToCard(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      scrollToCard(sectors.length - 1)
    }
  }

  return (
    <section
      id="conversations"
      className="relative bg-white scroll-mt-24 py-16 lg:py-24 overflow-hidden border-b border-[#12101F]/6"
      aria-label={data.headline || 'What an introduction sounds like'}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsPaused(false)
        }
      }}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => {
        // Resume after 2 seconds of inactivity
        setTimeout(() => setIsPaused(false), 2000)
      }}
    >
      <div className="site-container flex flex-col items-center gap-8 lg:gap-10">
        {/* Section Header */}
        <div data-reveal="heading" className="text-center max-w-[820px] flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FAF7F2] border border-[#12101F]/10 rounded-full shadow-2xs text-sm text-[#827C94]">
            <Sparkles size={14} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">{data.eyebrow}</span>
          </div>

          <h2 className="section-heading font-bold text-[#12101F] tracking-tight m-0 font-headline">
            {(data.headline || '').split(' ').map((word, idx) => (
              <React.Fragment key={`conv-word-${idx}`}>
                <span className="inline-block">{word}</span>{' '}
              </React.Fragment>
            ))}
          </h2>

          <p className="text-lg sm:text-xl leading-relaxed text-[#575266] max-w-[760px] m-0">
            {data.subheading}
          </p>
        </div>

        {/* Carousel Toolbar: Sector Tabs + Auto-Rotate Indicator + Arrow Controls */}
        <div
          data-reveal="heading"
          className="flex flex-wrap items-center justify-between gap-4 w-full max-w-[920px] px-2"
        >
          {/* Sector Tabs */}
          <div
            role="tablist"
            aria-label={lang === 'te' ? 'రంగాలు' : 'Sectors'}
            className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FAF7F2] border border-[#12101F]/10 rounded-full shadow-2xs"
          >
            {sectors.map((sector, idx) => {
              const isSelected = activeIndex === idx
              const theme = SECTOR_THEMES[sector.id] || SECTOR_THEMES.healthcare
              const Icon = theme.icon

              return (
                <button
                  key={sector.id}
                  role="tab"
                  id={`conv-tab-${idx}`}
                  aria-selected={isSelected}
                  aria-controls={`conv-phone-${idx}`}
                  tabIndex={0}
                  onClick={() => scrollToCard(idx)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B3CFF] ${
                    isSelected
                      ? 'bg-[#12101F] text-white shadow-xs'
                      : 'text-[#575266] hover:text-[#12101F] hover:bg-black/5'
                  }`}
                >
                  <Icon
                    size={14}
                    className={isSelected ? 'text-[#D6F36B]' : 'text-[#827C94]'}
                    aria-hidden="true"
                  />
                  <span>{sector.name}</span>
                </button>
              )
            })}
          </div>

          {/* Navigation Controls: Pause status + Previous/Next Arrows */}
          <div className="flex items-center gap-2.5" role="group" aria-label="Carousel navigation">
            {/* Auto-rotation pause/play badge */}
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={
                isPaused
                  ? lang === 'te'
                    ? 'ఆటో-రొటేషన్‌ను కొనసాగించండి'
                    : 'Resume auto-rotation'
                  : lang === 'te'
                    ? 'ఆటో-రొటేషన్‌ను పాజ్ చేయండి'
                    : 'Pause auto-rotation'
              }
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border border-[#12101F]/10 bg-white text-[#827C94] hover:text-[#12101F] transition-all"
            >
              {isPaused ? (
                <>
                  <Play size={11} className="text-[#16A34A]" aria-hidden="true" />
                  <span>{lang === 'te' ? 'పాజ్ చేయబడింది' : 'Paused'}</span>
                </>
              ) : (
                <>
                  <Pause size={11} className="text-[#6B3CFF]" aria-hidden="true" />
                  <span>4s</span>
                </>
              )}
            </button>

            {/* Previous Arrow Button */}
            <button
              type="button"
              onClick={() => scrollToCard(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label={lang === 'te' ? 'మునుపటి సంభాషణ' : 'Previous conversation'}
              className="w-9 h-9 rounded-full bg-white border border-[#12101F]/10 flex items-center justify-center text-[#12101F] shadow-xs transition-all duration-200 hover:bg-[#FAF7F2] hover:border-[#6B3CFF]/40 disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B3CFF]"
            >
              <ChevronLeft size={16} aria-hidden="true" />
            </button>

            {/* Counter */}
            <span className="text-xs font-mono font-bold text-[#827C94] px-0.5" aria-live="polite">
              0{activeIndex + 1} / 0{sectors.length}
            </span>

            {/* Next Arrow Button */}
            <button
              type="button"
              onClick={() => scrollToCard(activeIndex + 1)}
              disabled={activeIndex === sectors.length - 1}
              aria-label={lang === 'te' ? 'తదుపరి సంభాషణ' : 'Next conversation'}
              className="w-9 h-9 rounded-full bg-white border border-[#12101F]/10 flex items-center justify-center text-[#12101F] shadow-xs transition-all duration-200 hover:bg-[#FAF7F2] hover:border-[#6B3CFF]/40 disabled:opacity-35 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B3CFF]"
            >
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Smartphone Screens Track (Desktop: Prominent Center + Peeking Neighbours, Mobile: 1 Phone at a time) */}
        <div
          data-reveal="card"
          ref={scrollContainerRef}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label={lang === 'te' ? 'సెక్టార్ సంభాషణ స్క్రీన్లు' : 'Sector message screens carousel'}
          className="w-full flex items-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-none py-6 px-4 sm:px-12 lg:justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B3CFF]/40 rounded-[44px]"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {sectors.map((sector, idx) => {
            const isSelected = activeIndex === idx
            const theme = SECTOR_THEMES[sector.id] || SECTOR_THEMES.healthcare

            return (
              <div
                key={sector.id}
                id={`conv-phone-${idx}`}
                role="tabpanel"
                aria-labelledby={`conv-tab-${idx}`}
                onClick={() => {
                  if (!isSelected) scrollToCard(idx)
                }}
                className={`w-[86vw] max-w-[320px] sm:max-w-[335px] h-[510px] shrink-0 snap-center rounded-[40px] bg-white border-[8px] border-[#1A162B] transition-all duration-300 relative flex flex-col justify-between overflow-hidden shadow-2xl ${
                  isSelected
                    ? 'scale-100 opacity-100 ring-4 ring-[#6B3CFF]/20 shadow-2xl z-10'
                    : 'scale-[0.88] opacity-50 hover:opacity-80 shadow-md cursor-pointer z-0'
                }`}
              >
                {/* Sector Ambient Radial Glow Header */}
                <div
                  className={`absolute top-0 right-0 w-64 h-40 bg-gradient-to-bl ${theme.glowColor} pointer-events-none -z-0`}
                  aria-hidden="true"
                />

                {/* Top Notch & Status Bar */}
                <div className="relative z-10 px-4 pt-3 pb-2 border-b border-[#12101F]/8 flex items-center justify-between gap-2 bg-white/80 backdrop-blur-xs">
                  <span className="text-[11px] font-mono font-bold text-[#12101F]">9:41</span>

                  {/* Sleek Dynamic Island / Notch */}
                  <div className="w-16 h-3 bg-[#1A162B] rounded-full mx-auto" aria-hidden="true" />

                  {/* Sector Pill Badge */}
                  <div
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border"
                    style={{
                      backgroundColor: theme.accentColor + '18',
                      borderColor: theme.accentColor + '40',
                      color: theme.accentColor,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ backgroundColor: theme.accentColor }}
                      aria-hidden="true"
                    />
                    <span>{sector.code}</span>
                  </div>
                </div>

                {/* Illustrative Scenario Disclaimer Bar */}
                <div className="relative z-10 px-3 py-1 bg-[#FAF7F2] border-b border-[#12101F]/5 flex items-center justify-center gap-1.5 text-[10.5px] text-[#827C94]">
                  <Sparkles size={11} className="text-[#6B3CFF] shrink-0" aria-hidden="true" />
                  <span className="font-medium">{data.disclaimer}</span>
                </div>

                {/* Messaging Conversation Interior (Affiliate Initiates) */}
                <div className="relative z-10 p-3.5 sm:p-4 flex flex-col gap-3.5 flex-1 justify-center bg-radial from-white via-white to-[#FAF7F2]/40">
                  {/* Message 1: Contact (Neighbour / Friend / Business Owner) */}
                  <div className="flex items-start gap-2.5 max-w-[95%]">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs border border-white"
                      style={{ backgroundColor: theme.callerBg, color: theme.callerColor }}
                      aria-hidden="true"
                    >
                      <span className="font-mono">{sector.contactInitial}</span>
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                      <div className="flex items-center justify-between text-[11px] px-1 text-[#827C94]">
                        <span className="font-semibold text-[#575266]">{sector.contactRole}</span>
                        <span className="font-mono text-[10px]">{sector.contactTime}</span>
                      </div>

                      <div className="bg-[#FAF7F2] border border-[#12101F]/8 rounded-2xl rounded-tl-xs p-3 shadow-2xs">
                        <p className="text-[13px] sm:text-[13.5px] leading-snug text-[#12101F] font-semibold m-0">
                          {sector.contactMessage}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message 2: Affiliate's Permission-First Response */}
                  <div className="flex items-start gap-2.5 max-w-[95%] self-end flex-row-reverse">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-[#6B3CFF]/30 bg-gradient-to-br from-[#6B3CFF] via-[#FF4FA3] to-[#D6F36B]"
                      aria-hidden="true"
                    >
                      <Sparkles size={14} strokeWidth={2.4} />
                    </div>

                    <div className="flex flex-col gap-1 w-full items-end">
                      <div className="flex items-center justify-between w-full text-[11px] px-1 text-[#827C94] flex-row-reverse">
                        <span className="font-semibold text-[#6B3CFF]">{sector.affiliateRole}</span>
                        <span className="font-mono text-[10px]">{sector.affiliateTime}</span>
                      </div>

                      <div className="bg-gradient-to-br from-[#6B3CFF] to-[#4F28D9] text-white rounded-2xl rounded-tr-xs p-3 shadow-md shadow-[#6B3CFF]/20 border border-[#6B3CFF]/30">
                        <p className="text-[13px] sm:text-[13.5px] leading-snug text-white font-medium m-0">
                          {sector.affiliateMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Device Screen Footer & Permission Status */}
                <div className="relative z-10 px-3.5 py-2 bg-[#FAF7F2] border-t border-[#12101F]/8 flex items-center justify-center gap-1.5 text-center">
                  <ShieldCheck size={14} className="text-[#16A34A] shrink-0" aria-hidden="true" />
                  <span className="text-[11px] font-semibold text-[#575266] tracking-tight">
                    {sector.consentTag}
                  </span>
                </div>

                {/* Device Home Bar */}
                <div className="w-24 h-1 bg-[#1A162B] rounded-full mx-auto my-1.5 opacity-25" aria-hidden="true" />
              </div>
            )
          })}
        </div>

        {/* Carousel Visual Rule Callout */}
        <div data-reveal="extra" className="flex flex-col items-center gap-4 max-w-[820px] w-full px-4 text-center">
          <div className="w-full bg-[#FAF7F2] border border-[#6B3CFF]/25 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
            <CheckCircle2 size={18} className="text-[#16A34A] shrink-0" aria-hidden="true" />
            <p className="text-sm sm:text-base leading-relaxed text-[#12101F] font-medium m-0">
              {data.rule}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
