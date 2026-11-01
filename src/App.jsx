import React, { useEffect, useState } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './components/Navigation'
import HeroSection from './components/HeroSection'
import SoundFamiliarSection from './components/SoundFamiliarSection'
import ConversationCarouselSection from './components/ConversationCarouselSection'
import HowItWorksSection from './components/HowItWorksSection'
import PromisesSection from './components/PromisesSection'
import WhoCanJoinSection from './components/WhoCanJoinSection'
import WhatYouCanIntroduceSection from './components/WhatYouCanIntroduceSection'
import EarningSection from './components/EarningSection'
import FaqSection from './components/FaqSection'
import FinalCtaSection from './components/FinalCtaSection'
import ContactSection from './components/ContactSection'
import FooterSection from './components/FooterSection'
import ThreadLine from './components/ThreadLine'
import AffiliateAuthPage from './components/AffiliateAuthPage'
import { useLanguage } from './context/useLanguage'
import { initScrollReveals, initCardTilt } from './utils/motion'
import { SIGNUP_URL } from './config/links'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const { lang } = useLanguage()
  const [activeLegalModal, setActiveLegalModal] = useState(null) // 'terms' | 'privacy' | null

  // Route state initialized from window location
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname)
  const [authMode, setAuthMode] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    return params.get('mode') === 'signin' ? 'signin' : 'signup'
  })

  const isAuthPage = currentPath === '/affiliate/auth' || currentPath.startsWith('/affiliate/auth')

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
      const params = new URLSearchParams(window.location.search)
      setAuthMode(params.get('mode') === 'signin' ? 'signin' : 'signup')
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Client-side router navigation helper
  const navigate = (to) => {
    const [pathWithParams, hash] = to.split('#')
    const [path, search] = pathWithParams.split('?')
    const targetPath = path || '/'
    const targetSearch = search ? `?${search}` : ''
    const targetHash = hash ? `#${hash}` : ''
    const targetUrl = `${targetPath}${targetSearch}${targetHash}`

    window.history.pushState({}, '', targetUrl)
    setCurrentPath(targetPath)

    if (search) {
      const params = new URLSearchParams(targetSearch)
      setAuthMode(params.get('mode') === 'signin' ? 'signin' : 'signup')
    } else {
      setAuthMode('signup')
    }

    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 80)
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Initialize Lenis smooth scroll and connect with GSAP ScrollTrigger on landing page
  useEffect(() => {
    if (isAuthPage) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const updateLenis = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
    }
  }, [isAuthPage])

  // Initialize scroll reveals and card hover 3D tilt on landing page
  useEffect(() => {
    if (isAuthPage) return

    const cleanupReveals = initScrollReveals()
    const cleanupTilt = initCardTilt()

    // Refresh ScrollTrigger after web fonts load
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh()
      })
    }

    return () => {
      cleanupReveals()
      cleanupTilt()
    }
  }, [isAuthPage])

  // Refresh ScrollTrigger on language toggle after layout settles
  useEffect(() => {
    if (isAuthPage) return

    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 250)

    return () => clearTimeout(timer)
  }, [lang, isAuthPage])

  const handleBecomeAffiliate = (mode = 'signup') => {
    if (SIGNUP_URL && SIGNUP_URL.trim() !== '') {
      window.open(SIGNUP_URL, '_blank', 'noopener,noreferrer')
    } else {
      navigate(`/affiliate/auth?mode=${mode}`)
    }
  }

  // Render dedicated Affiliate Authentication Page when on /affiliate/auth route
  if (isAuthPage) {
    return <AffiliateAuthPage initialMode={authMode} onNavigate={navigate} />
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink font-body">
      {/* Navigation Header */}
      <Navigation onBecomeAffiliate={handleBecomeAffiliate} />

      {/* Main Content Area */}
      <main id="main-content" className="relative flex-1 flex flex-col">
        {/* Luminous Progressive Thread Line (desktop width 1025px and above) */}
        <ThreadLine />

        {/* Stage 1: Hero Section with Organic Blob and Luminous Thread */}
        <HeroSection onBecomeAffiliate={handleBecomeAffiliate} />

        {/* 1. “Why Join / Sound familiar?” Restored Programme Value Proposition */}
        <SoundFamiliarSection />

        {/* 2. Dedicated Three-Phone Conversation Carousel: What an introduction sounds like */}
        <ConversationCarouselSection />

        {/* 3. Four-Step Stepper with Dynamic Phone Mockups */}
        <HowItWorksSection onBecomeAffiliate={handleBecomeAffiliate} />

        {/* 3. Three Promise Cards: Ask first, Stay in your lane, Tell the truth */}
        <PromisesSection />

        {/* 1. Who Can Join: 5 cards, heading, subheading, closing line */}
        <WhoCanJoinSection />

        {/* 2. What You Can Introduce: 3 sector tiles, note */}
        <WhatYouCanIntroduceSection />

        {/* 3. Earning: 4 blocks, worked-example card, no-guarantee line */}
        <EarningSection />

        {/* 4. FAQ: 10 questions accordion */}
        <FaqSection />

        {/* 5. Final CTA: headline, subheading, primary CTA, secondary terms link */}
        <FinalCtaSection
          onBecomeAffiliate={handleBecomeAffiliate}
          onOpenTerms={() => setActiveLegalModal('terms')}
        />

        {/* 6. Contact: message form with honeypot, validation, submitContact */}
        <ContactSection />
      </main>

      {/* Footer Section */}
      <FooterSection
        activeModal={activeLegalModal}
        onOpenTerms={() => setActiveLegalModal('terms')}
        onOpenPrivacy={() => setActiveLegalModal('privacy')}
        onCloseModal={() => setActiveLegalModal(null)}
      />
    </div>
  )
}

export default App
