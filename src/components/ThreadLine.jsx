import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * ThreadLine component (Pass 2):
 * - File: src/components/ThreadLine.jsx
 * - Selectors: .thread-line-track (container/track) and .thread-line-progress (drawn line)
 * - Thin 2px gradient line (violet to magenta to lime) drawn progressively as the page scrolls.
 * - Positioned in the page margin at desktop width 1025px and above (fixed at max(24px, calc(50vw - 640px))).
 * - 45% opacity background track + 100% luminous drawn line with glow.
 * - aria-hidden="true" and pointer-events: none. Strictly never overlaps cards or text.
 * - Respects prefers-reduced-motion.
 */
export default function ThreadLine() {
  const lineRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lineEl = lineRef.current
    if (!lineEl) return

    if (prefersReducedMotion) {
      lineEl.style.transform = 'scaleY(1)'
      return
    }

    const tween = gsap.to(lineEl, {
      scaleY: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '#main-content',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.4,
      },
    })

    return () => {
      if (tween.scrollTrigger) {
        tween.scrollTrigger.kill()
      }
      tween.kill()
    }
  }, [])

  return (
    <div
      className="thread-line-track"
      aria-hidden="true"
    >
      {/* Progressively Drawn Gradient Thread Line */}
      <div
        ref={lineRef}
        className="thread-line-progress"
      />
    </div>
  )
}
