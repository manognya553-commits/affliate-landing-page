import React, { useRef, useState, useEffect } from 'react'
import { HandHeart } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

export default function PromisesSection() {
  const { lang, copy } = useLanguage()
  const sectionRef = useRef(null)
  const [drawn, setDrawn] = useState(false)

  const items = copy.promises.items || []

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setDrawn(true)
          }
        })
      },
      { threshold: 0.25 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="promises"
      ref={sectionRef}
      className="relative pt-14 pb-12 lg:pt-20 lg:pb-16 bg-[#FAF7F2] overflow-hidden scroll-mt-24"
      aria-label="Our Three Promises"
    >
      <div className="site-container flex flex-col gap-10 sm:gap-12 items-center">
        {/* Section Header */}
        <div data-reveal="heading" className="text-center max-w-[820px] flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/90 border border-[#12101F]/10 rounded-full shadow-sm text-sm text-[#827C94]">
            <HandHeart size={14} className="text-[#6B3CFF]" aria-hidden="true" />
            <span className="font-mono">
              {lang === 'te' ? 'మా 3 ముఖ్యమైన రూల్స్' : 'Our core commitment'}
            </span>
          </div>

          <h2 className="section-heading font-bold text-[#12101F] tracking-tight m-0 font-headline">
            {copy.promises.headline.split(' ').map((word, idx) => (
              <React.Fragment key={`promise-h-${idx}`}>
                <span className="inline-block">{word}</span>
                {' '}
              </React.Fragment>
            ))}
          </h2>

          <p className="text-lg sm:text-xl leading-relaxed text-[#575266] max-w-[720px] m-0">
            {copy.promises.lead}
          </p>

          <span className="text-xs font-bold text-[#827C94] tracking-widest uppercase mt-1 font-mono">
            {copy.promises.subhead}
          </span>
        </div>

        {/* Three Tall Cards Grid with Self-Drawing Line-Art Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full" role="list">
          {items.map((item, idx) => {
            const bottomGradient =
              idx === 0
                ? 'bg-gradient-to-r from-[#6B3CFF] to-[#FF4FA3]'
                : idx === 1
                ? 'bg-gradient-to-r from-[#FF4FA3] to-[#6B3CFF]'
                : 'bg-gradient-to-r from-[#059669] to-[#D6F36B]'

            const iconBg =
              idx === 0
                ? 'bg-[#6B3CFF]/10'
                : idx === 1
                ? 'bg-[#FF4FA3]/10'
                : 'bg-[#059669]/10'

            return (
              <div
                key={idx}
                data-reveal="card"
                className="corner-mark relative rounded-[28px] card-depth tilt-card p-8 sm:p-10 flex flex-col gap-6 overflow-hidden group border border-[#12101F]/8"
                role="listitem"
              >
                <div className="flex items-center justify-between pr-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${iconBg}`} aria-hidden="true">
                    {idx === 0 && (
                      /* Ask first: Bold line-art shield & consent checkmark */
                      <svg viewBox="0 0 48 48" className={`w-11 h-11 overflow-visible ${drawn ? 'svg-drawn' : ''}`} fill="none">
                        <path
                          d="M 24 4 L 40 10 C 40 26, 24 42, 24 44 C 24 42, 8 26, 8 10 Z"
                          stroke="#6B3CFF"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="stroke-draw-path"
                        />
                        <path
                          d="M 16 23 L 22 29 L 33 17"
                          stroke="#FF4FA3"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="stroke-draw-path path-check"
                        />
                      </svg>
                    )}

                    {idx === 1 && (
                      /* Stay in your lane: Pathway boundaries and expert handoff compass */
                      <svg viewBox="0 0 48 48" className={`w-11 h-11 overflow-visible ${drawn ? 'svg-drawn' : ''}`} fill="none">
                        <path
                          d="M 12 40 L 18 8"
                          stroke="#FF4FA3"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          className="stroke-draw-path"
                        />
                        <path
                          d="M 36 40 L 30 8"
                          stroke="#FF4FA3"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          className="stroke-draw-path"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="12"
                          stroke="#6B3CFF"
                          strokeWidth="2.6"
                          className="stroke-draw-path"
                        />
                        <path
                          d="M 24 16 L 27 23 L 32 24 L 27 25 L 24 32 L 21 25 L 16 24 L 21 23 Z"
                          fill="rgba(107, 60, 255, 0.2)"
                          stroke="#6B3CFF"
                          strokeWidth="2"
                          strokeLinejoin="round"
                          className="stroke-draw-path path-check"
                        />
                      </svg>
                    )}

                    {idx === 2 && (
                      /* Tell the truth: Open book & balance star */
                      <svg viewBox="0 0 48 48" className={`w-11 h-11 overflow-visible ${drawn ? 'svg-drawn' : ''}`} fill="none">
                        <path
                          d="M 6 36 C 14 34, 20 37, 24 40 C 28 37, 34 34, 42 36 L 42 12 C 34 10, 28 13, 24 16 C 20 13, 14 10, 6 12 Z"
                          stroke="#059669"
                          strokeWidth="2.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="stroke-draw-path"
                        />
                        <path
                          d="M 24 16 L 24 40"
                          stroke="#059669"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          className="stroke-draw-path path-check"
                        />
                        <circle
                          cx="24"
                          cy="8"
                          r="3.5"
                          fill="#D6F36B"
                          stroke="#059669"
                          strokeWidth="2"
                          className="stroke-draw-path path-star"
                        />
                      </svg>
                    )}
                  </div>

                  <span className="text-xs font-bold text-[#827C94] tracking-wider font-mono">0{idx + 1} //</span>
                </div>

                <div className="flex flex-col gap-2.5 flex-1">
                  <h3 className="text-2xl font-bold text-[#12101F] leading-tight tracking-tight m-0 font-headline">{item.title}</h3>
                  <p className="text-base leading-relaxed text-[#575266] m-0">{item.description}</p>
                </div>

                <div className={`absolute bottom-0 left-0 right-0 h-1 opacity-90 ${bottomGradient}`} aria-hidden="true" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
