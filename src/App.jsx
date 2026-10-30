import React, { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './components/Navigation'
import HeroSection from './components/HeroSection'
import SoundFamiliarSection from './components/SoundFamiliarSection'
import HowItWorksSection from './components/HowItWorksSection'
import PromisesSection from './components/PromisesSection'
import WhoCanJoinSection from './components/WhoCanJoinSection'
import WhatYouCanIntroduceSection from './components/WhatYouCanIntroduceSection'
import EarningSection from './components/EarningSection'
import FaqSection from './components/FaqSection'
import FinalCtaSection from './components/FinalCtaSection'
import ContactSection from './components/ContactSection'
import FooterSection from './components/FooterSection'
import { SIGNUP_URL } from './config/links'

gsap.registerPlugin(ScrollTrigger)

function App() {
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

  const handleBecomeAffiliate = () => {
    if (SIGNUP_URL && SIGNUP_URL.trim() !== '') {
      window.open(SIGNUP_URL, '_blank', 'noopener,noreferrer')
    } else {
      const contactEl = document.getElementById('contact')
      if (contactEl) {
        contactEl.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.location.hash = '#contact'
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink font-body">
      {/* Navigation Header */}
      <Navigation onBecomeAffiliate={handleBecomeAffiliate} />

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 flex flex-col">
        {/* Stage 1: Hero Section with Organic Blob and Luminous Thread */}
        <HeroSection onBecomeAffiliate={handleBecomeAffiliate} />

        {/* Stage 2 Story Sections */}
        {/* 1. “Sound familiar?” Simulated Community Chat */}
        <SoundFamiliarSection />

        {/* 2. Four-Step Stepper with Dynamic Phone Mockups */}
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
        <FinalCtaSection onBecomeAffiliate={handleBecomeAffiliate} />

        {/* 6. Contact: message form with honeypot, validation, submitContact */}
        <ContactSection />
      </main>

      {/* Footer Section */}
      <FooterSection />
    </div>
  )
}

export default App
