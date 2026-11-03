import React, { useState, useEffect, useRef } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

export default function Navigation({ onBecomeAffiliate, onLogin }) {
  const { lang, setLang, copy } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  const drawerRef = useRef(null)
  const closeBtnRef = useRef(null)
  const hamburgerBtnRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track active section for indicator
  useEffect(() => {
    const sections = ['hero', 'why-join', 'how-it-works', 'who-can-join', 'earning', 'faq']
    const observers = []

    sections.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id)
            }
          })
        },
        { rootMargin: '-20% 0px -60% 0px' }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => {
      observers.forEach((obs) => obs.disconnect())
    }
  }, [])

  // Manage body scroll lock, Escape key, focus trapping, and focus restoration for mobile drawer
  useEffect(() => {
    if (!isMenuOpen) return

    const lastActive = document.activeElement
    const hamburgerBtn = hamburgerBtnRef.current
    document.body.style.overflow = 'hidden'

    // Move focus into the drawer close button on open
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus()
    }, 50)

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setIsMenuOpen(false)
        return
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) return

        const firstEl = focusables[0]
        const lastEl = focusables[focusables.length - 1]

        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault()
          lastEl.focus()
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault()
          firstEl.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
      // Return focus to the hamburger button that opened the menu
      if (hamburgerBtn && typeof hamburgerBtn.focus === 'function') {
        hamburgerBtn.focus()
      } else if (lastActive && typeof lastActive.focus === 'function') {
        lastActive.focus()
      }
    }
  }, [isMenuOpen])

  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  const handleCtaClick = (e) => {
    if (onBecomeAffiliate) {
      e.preventDefault()
      onBecomeAffiliate()
    }
    setIsMenuOpen(false)
  }

  return (
    <header className="fixed top-3.5 inset-x-0 z-[1000] px-4 sm:px-8 pointer-events-none transition-all duration-300">
      <div
        className={`pointer-events-auto max-w-[1240px] mx-auto rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 transition-all duration-300 border backdrop-blur-md ${
          isScrolled
            ? 'bg-white/92 border-[#12101F]/12 shadow-lg shadow-[#12101F]/6 py-2'
            : 'bg-white/80 border-[#12101F]/8 shadow-sm py-2.5'
        }`}
      >
        {/* Brand Wordmark */}
        <a href="#hero" className="inline-flex items-center gap-1 shrink-0 no-underline group" aria-label="sBLOOM Home">
          <span className="font-body text-[22px] font-black text-brand-violet leading-none transition-transform group-hover:scale-105">s</span>
          <span className="font-body text-[20px] font-black text-ink tracking-tight leading-none mr-2">BLOOM</span>
          <span className="hidden xl:inline-flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-wider text-brand-violet bg-brand-violet/[0.08] px-2.5 py-0.5 rounded-full border border-brand-violet/20">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-violet animate-pulse" aria-hidden="true" />
            <span>{copy.nav.brandSubtitle}</span>
          </span>
        </a>

        {/* 5 Desktop Nav Links (each strictly on one line) */}
        <nav className="hidden lg:flex items-center" aria-label="Primary Navigation">
          <ul className="flex items-center gap-6 list-none m-0 p-0">
            {copy.nav.links.map((link) => {
              const isActive = activeSection === link.id
              return (
                <li key={link.id} className="relative">
                  <a
                    href={link.href}
                    className={`text-[14px] font-semibold whitespace-nowrap px-1 py-1 transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? 'text-brand-violet font-bold'
                        : 'text-ink-secondary hover:text-ink'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && (
                      <span className="w-1 h-1 rounded-full bg-brand-violet animate-pulse" aria-hidden="true" />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Right Actions: Language Switcher & Pinned CTA */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Clear Two-Part Switch: EN and తె (Enlarged, crisp and readable) */}
          <div className="inline-flex items-center bg-ink/[0.06] border border-ink/10 rounded-full p-0.5 gap-0.5" role="group" aria-label="Language selection">
            <button
              type="button"
              className={`border-none px-3 text-[13px] font-bold rounded-full cursor-pointer transition-all duration-200 leading-none inline-flex items-center justify-center min-w-[40px] h-8 ${
                lang === 'en'
                  ? 'bg-white !text-brand-violet shadow-sm font-extrabold'
                  : 'bg-transparent text-ink-secondary hover:text-ink hover:bg-white/50'
              }`}
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
              title="Switch to English"
            >
              EN
            </button>
            <button
              type="button"
              className={`border-none px-3 text-[14px] font-telugu-sans font-bold rounded-full cursor-pointer transition-all duration-200 leading-none inline-flex items-center justify-center min-w-[56px] h-8 ${
                lang === 'te'
                  ? 'bg-white !text-brand-violet shadow-sm font-extrabold'
                  : 'bg-transparent text-ink-secondary hover:text-ink hover:bg-white/50'
              }`}
              onClick={() => setLang('te')}
              aria-pressed={lang === 'te'}
              title="తెలుగుకు మారండి"
            >
              తెలుగు
            </button>
          </div>

          {/* Login Link: rendered before CTA button */}
          <button type="button" onClick={onLogin} className="hidden lg:inline-flex text-[14.5px] font-semibold text-ink-secondary hover:text-brand-violet whitespace-nowrap px-2.5 py-1.5 transition-colors duration-200 bg-transparent border-none cursor-pointer">{lang === 'te' ? 'లాగిన్' : 'Login'}</button>

          {/* Pinned Primary CTA Button */}
          <button type="button" className="hidden lg:inline-flex items-center gap-2 bg-brand-violet hover:bg-brand-violet-hover text-white px-5 py-2.5 text-sm font-semibold rounded-full shadow-sm hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap shrink-0 border-none cursor-pointer" onClick={handleCtaClick}>
            <span>{copy.nav.cta}</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </button>

          {/* Mobile Hamburger Button */}
          <button
            ref={hamburgerBtnRef}
            type="button"
            className="flex lg:hidden w-9 h-9 rounded-full items-center justify-center text-ink bg-canvas-subtle hover:bg-border/60 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation-drawer"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-ink/45 backdrop-blur-sm z-[1050] pointer-events-auto transition-opacity"
          onClick={() => setIsMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Menu */}
      <div
        id="mobile-navigation-drawer"
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        className={`fixed top-0 right-0 w-[310px] h-screen bg-white p-6 z-[1100] shadow-2xl flex flex-col pointer-events-auto transition-all duration-300 ${
          isMenuOpen
            ? 'translate-x-0 opacity-100 visible'
            : 'translate-x-full opacity-0 invisible pointer-events-none'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-0.5">
            <span className="font-body text-[22px] font-extrabold text-brand-violet leading-none">s</span>
            <span className="font-body text-[20px] font-extrabold text-ink tracking-tight leading-none">BLOOM</span>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="w-9 h-9 rounded-full bg-canvas-subtle flex items-center justify-center text-ink hover:bg-border/60 transition-colors"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mobile Language Switcher */}
        <div className="flex mb-6">
          <div className="inline-flex items-center bg-ink/[0.06] border border-ink/10 rounded-full p-1 gap-1 w-full" role="group" aria-label="Language selection">
            <button
              type="button"
              className={`flex-1 h-9 rounded-full text-sm font-bold transition-all duration-200 ${
                lang === 'en' ? 'bg-white text-brand-violet shadow-sm font-extrabold' : 'text-ink-secondary'
              }`}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={`flex-1 h-9 rounded-full text-[14px] font-telugu-sans font-bold transition-all duration-200 ${
                lang === 'te' ? 'bg-white text-brand-violet shadow-sm font-extrabold' : 'text-ink-secondary'
              }`}
              onClick={() => setLang('te')}
            >
              తె
            </button>
          </div>
        </div>

        <nav aria-label="Mobile Navigation">
          <ul className="flex flex-col gap-4 list-none m-0 p-0 mb-8">
            {copy.nav.links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="text-base font-semibold text-ink hover:text-brand-violet transition-colors block py-1"
                  onClick={handleLinkClick}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <button type="button" className="w-full text-center py-2.5 text-sm font-semibold text-ink-secondary hover:text-brand-violet transition-colors bg-transparent border-none cursor-pointer" onClick={() => { setIsMenuOpen(false); if (onLogin) onLogin(); }}>{lang === 'te' ? 'లాగిన్' : 'Login'}</button>
          <button type="button" className="w-full inline-flex items-center justify-center gap-2 bg-brand-violet hover:bg-brand-violet-hover text-white px-5 py-3 text-sm font-semibold rounded-full shadow-sm transition-all border-none cursor-pointer" onClick={handleCtaClick}>
            <span>{copy.nav.cta}</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  )
}
