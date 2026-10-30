import React, { useState, useEffect } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'
import { LOGIN_URL } from '../config/links'

export default function Navigation({ onBecomeAffiliate }) {
  const { lang, setLang, copy } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isMenuOpen])

  // Prevent body scroll when mobile drawer open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
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
        className={`pointer-events-auto max-w-[1200px] mx-auto rounded-full px-3.5 sm:px-6 py-2 flex items-center justify-between gap-4 transition-all duration-200 border bg-white ${
          isScrolled
            ? 'border-[#D5CCBD] shadow-lg'
            : 'border-[#E8E2D8] shadow-md'
        }`}
      >
        {/* Brand Wordmark */}
        <a href="#hero" className="inline-flex items-center gap-0.5 shrink-0 no-underline" aria-label="sBLOOM Home">
          <span className="font-body text-[22px] font-extrabold text-brand-violet leading-none">s</span>
          <span className="font-body text-[20px] font-extrabold text-ink tracking-tight leading-none mr-2">BLOOM</span>
          <span className="hidden xl:inline-block font-mono text-[11px] font-bold uppercase tracking-wider text-brand-violet bg-brand-violet/10 px-2.5 py-0.5 rounded-full border border-brand-violet/20">
            {copy.nav.brandSubtitle}
          </span>
        </a>

        {/* 5 Desktop Nav Links (each strictly on one line) */}
        <nav className="hidden lg:flex items-center" aria-label="Primary Navigation">
          <ul className="flex items-center gap-5 list-none m-0 p-0">
            {copy.nav.links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="text-[14.5px] font-semibold text-ink-secondary hover:text-brand-violet whitespace-nowrap px-1 py-1.5 transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
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
              className={`border-none px-3 text-[14px] font-telugu-sans font-bold rounded-full cursor-pointer transition-all duration-200 leading-none inline-flex items-center justify-center min-w-[42px] h-8 ${
                lang === 'te'
                  ? 'bg-white !text-brand-violet shadow-sm font-extrabold'
                  : 'bg-transparent text-ink-secondary hover:text-ink hover:bg-white/50'
              }`}
              onClick={() => setLang('te')}
              aria-pressed={lang === 'te'}
              title="తెలుగుకు మారండి"
            >
              తె
            </button>
          </div>

          {/* Optional Login Link: rendered before CTA button, hidden when LOGIN_URL is empty */}
          {LOGIN_URL && LOGIN_URL.trim() !== '' && (
            <a
              href={LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex text-[14.5px] font-semibold text-ink-secondary hover:text-brand-violet whitespace-nowrap px-2 py-1.5 transition-colors duration-200"
            >
              {lang === 'te' ? 'లాగిన్' : 'Login'}
            </a>
          )}

          {/* Pinned Primary CTA Button */}
          <a
            href="#contact"
            className="hidden lg:inline-flex items-center gap-2 bg-brand-violet hover:bg-brand-violet-hover text-white px-5 py-2.5 text-sm font-semibold rounded-full shadow-sm hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap shrink-0"
            onClick={handleCtaClick}
          >
            <span>{copy.nav.cta}</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="flex lg:hidden w-9 h-9 rounded-full items-center justify-center text-ink bg-canvas-subtle hover:bg-border/60 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
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
        className={`fixed top-0 right-0 w-[310px] h-screen bg-white p-6 z-[1100] shadow-2xl flex flex-col pointer-events-auto transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-0.5">
            <span className="font-body text-[22px] font-extrabold text-brand-violet leading-none">s</span>
            <span className="font-body text-[20px] font-extrabold text-ink tracking-tight leading-none">BLOOM</span>
          </div>
          <button
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
          {LOGIN_URL && LOGIN_URL.trim() !== '' && (
            <a
              href={LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-center py-2 text-sm font-semibold text-ink-secondary hover:text-brand-violet transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {lang === 'te' ? 'లాగిన్' : 'Login'}
            </a>
          )}
          <a
            href="#contact"
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-violet hover:bg-brand-violet-hover text-white px-5 py-3 text-sm font-semibold rounded-full shadow-sm transition-all"
            onClick={handleCtaClick}
          >
            <span>{copy.nav.cta}</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  )
}
