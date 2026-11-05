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
import WhatYouCanIntroduceSection from './components/WhatYouCanIntroduceSection'
import ToolsSection from './components/ToolsSection'
import WhoCanJoinSection from './components/WhoCanJoinSection'
import EarningSection from './components/EarningSection'
import FaqSection from './components/FaqSection'
import FinalCtaSection from './components/FinalCtaSection'
import ContactSection from './components/ContactSection'
import FooterSection from './components/FooterSection'
import ThreadLine from './components/ThreadLine'
import ContinuousParticleNetwork from './components/ContinuousParticleNetwork'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from './context/useLanguage'
import { initScrollReveals, initCardTilt } from './utils/motion'

gsap.registerPlugin(ScrollTrigger)

function App() {
  const navigate = useNavigate()
  const { lang } = useLanguage()
  const [activeLegalModal, setActiveLegalModal] = useState(null) // 'terms' | 'privacy' | null

  // Initialize Lenis smooth scroll and connect with GSAP ScrollTrigger
  useEffect(() => {
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
  }, [])

  // Initialize scroll reveals and card hover 3D tilt
  useEffect(() => {
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
  }, [])

  // Refresh ScrollTrigger on language toggle after layout settles
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 250)

    return () => clearTimeout(timer)
  }, [lang])

  const handleBecomeAffiliate = () => {
    navigate('/app/signup')
  }

  const handleSignIn = () => {
    navigate('/app/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink font-body">
      {/* Navigation Header */}
      <Navigation
        onBecomeAffiliate={handleBecomeAffiliate}
        onLogin={handleSignIn}
      />

      {/* Main Content Area */}
      <main id="main-content" className="relative flex-1 flex flex-col">
        {/* Luminous Progressive Thread Line (desktop width 1025px and above) */}
        <ThreadLine />

        {/* Combined Hero and Why Join Universe with continuous animated particle network background */}
        <div id="hero-whyjoin-universe" className="relative">
          <ContinuousParticleNetwork containerId="hero-whyjoin-universe" />
          <HeroSection onBecomeAffiliate={handleBecomeAffiliate} />
          <SoundFamiliarSection />
        </div>

        {/* Section 4: How It Works — Three Simple Steps */}
        <HowItWorksSection onBecomeAffiliate={handleBecomeAffiliate} />

        {/* Section 5: What An Introduction Sounds Like (Conversation Cards) */}
        <ConversationCarouselSection />

        {/* Section 5: Three Promise Cards: Ask first, Stay in your lane, Tell the truth */}
        <PromisesSection />

        {/* Section 6: Three Sector Offerings: Healthcare, Education, Professional Services */}
        <WhatYouCanIntroduceSection />

        {/* Section 7: Knowledge Platform & Tracking Tools */}
        <ToolsSection />

        {/* Section 8: Who Can Join (Audience Profiles & CTA) */}
        <WhoCanJoinSection onBecomeAffiliate={handleBecomeAffiliate} />

        {/* Section 9: Earning & Compensation Transparency */}
        <EarningSection />

        {/* Section 10: Frequently Asked Questions */}
        <FaqSection />

        {/* Section 11: Final CTA */}
        <FinalCtaSection
          onBecomeAffiliate={handleBecomeAffiliate}
          onOpenTerms={() => setActiveLegalModal('terms')}
        />

        {/* Section 12: Contact Form (For Questions & Enquiries) */}
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
