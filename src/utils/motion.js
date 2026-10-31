import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Initializes scroll reveals for headings, cards, FAQ rows, and contact card.
 * - Fade up 24px over 0.6s, once.
 * - Cards in Who can join, What you can introduce, Earning, Promises, and How it works stagger by 80ms on desktop.
 * - Hidden starting state is set strictly from JavaScript, not CSS (content stays visible if JS fails).
 * - Elements already in or above the viewport on initial load are never hidden.
 * - Animates only transform and opacity (no layout shift).
 * - Respects prefers-reduced-motion.
 */
export function initScrollReveals() {
  if (typeof window === 'undefined') return () => {}

  // 1. Accessibility: respects prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    return () => {}
  }

  // 2. Fallback: if IntersectionObserver is not supported, do not hide elements
  if (!('IntersectionObserver' in window)) {
    return () => {}
  }

  // 3. Collect all reveal targets across the page
  const headings = Array.from(document.querySelectorAll('[data-reveal="heading"]'))
  const cards = Array.from(
    document.querySelectorAll(
      '[data-reveal="card"], [data-reveal="contact-card"], [data-reveal="extra"]'
    )
  )
  const faqRows = Array.from(document.querySelectorAll('#faq [data-reveal="faq-row"]'))

  const allRevealElements = [...headings, ...cards, ...faqRows]
  if (allRevealElements.length === 0) return () => {}

  // 4. Viewport threshold check: elements already visible (or above viewport) must NOT be hidden
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight
  const elementsToAnimate = []

  allRevealElements.forEach((el) => {
    const rect = el.getBoundingClientRect()
    // If the top is already well within or above the viewport, mark visible immediately
    if (rect.top < viewportHeight * 0.88 && rect.bottom > 0) {
      el.style.opacity = '1'
      el.style.transform = 'none'
    } else {
      // Set initial hidden starting state strictly in JavaScript
      el.style.opacity = '0'
      el.style.transform = 'translate3d(0, 24px, 0)'
      el.style.willChange = 'opacity, transform'
      elementsToAnimate.push(el)
    }
  })

  // Group counters for desktop 80ms stagger
  const groupCounters = new Map()

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        // Check if intersecting or already scrolled past
        if (!entry.isIntersecting && entry.boundingClientRect.top > 0) return

        const el = entry.target
        obs.unobserve(el)

        // Calculate stagger delay for cards within the same section
        let delay = 0
        const isCard = el.matches('[data-reveal="card"]')
        const parentSection = el.closest(
          '#who-can-join, #what-you-can-introduce, #earning, #promises, #how-it-works, #why-join, #conversations'
        )

        if (isCard && parentSection) {
          const currentCount = groupCounters.get(parentSection) || 0
          const isDesktop = window.innerWidth >= 768
          if (isDesktop) {
            delay = (currentCount % 3) * 0.08 // 80ms stagger on desktop
          }
          groupCounters.set(parentSection, currentCount + 1)
        }

        // Animate smoothly: fade up 24px over 0.6s
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: delay,
          ease: 'power3.out',
          clearProps: 'transform,willChange',
          onComplete: () => {
            el.style.opacity = '1'
          },
        })
      })
    },
    {
      root: null,
      rootMargin: '0px 0px -40px 0px', // trigger smoothly as element enters viewport
      threshold: [0, 0.1],
    }
  )

  elementsToAnimate.forEach((el) => observer.observe(el))

  // Safety timer: after 3.5s, ensure no element remains stuck at opacity 0
  const safetyTimeout = setTimeout(() => {
    elementsToAnimate.forEach((el) => {
      if (getComputedStyle(el).opacity !== '1') {
        gsap.to(el, {
          y: 0,
          opacity: 1,
          duration: 0.3,
          clearProps: 'transform,willChange',
        })
      }
    })
  }, 3500)

  return () => {
    clearTimeout(safetyTimeout)
    observer.disconnect()
  }
}

/**
 * Initializes card hover 3D tilt (max 4 degrees) with a 4px lift.
 * Only attached on devices with a fine pointer (mouse/trackpad).
 * Disabled if prefers-reduced-motion is active.
 * Animates only transform.
 */
export function initCardTilt() {
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!hasFinePointer || prefersReduced) {
    return () => {}
  }

  const cards = document.querySelectorAll('.tilt-card')
  const cleanups = []

  cards.forEach((card) => {
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const percentX = (x - centerX) / centerX
      const percentY = (y - centerY) / centerY

      const maxTilt = 4
      const rotateX = (-percentY * maxTilt).toFixed(2)
      const rotateY = (percentX * maxTilt).toFixed(2)

      card.style.transform = `perspective(1000px) translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
    }

    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) translateY(0px) rotateX(0deg) rotateY(0deg)'
      setTimeout(() => {
        if (!card.matches(':hover')) {
          card.style.transform = ''
        }
      }, 250)
    }

    card.addEventListener('mousemove', handleMouseMove, { passive: true })
    card.addEventListener('mouseleave', handleMouseLeave, { passive: true })

    cleanups.push(() => {
      card.removeEventListener('mousemove', handleMouseMove)
      card.removeEventListener('mouseleave', handleMouseLeave)
      card.style.transform = ''
    })
  })

  return () => {
    cleanups.forEach((fn) => fn())
  }
}
