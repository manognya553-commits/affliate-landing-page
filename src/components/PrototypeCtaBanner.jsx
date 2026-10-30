import React from 'react'
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react'

export default function PrototypeCtaBanner() {
  const highlights = [
    {
      title: '100% Free to Join',
      desc: 'No sign-up charges, upfront fees, or recurring subscriptions.',
      icon: Sparkles,
    },
    {
      title: '3 Launch Sectors',
      desc: 'Focus on Healthcare, Education, and Professional Services.',
      icon: HeartHandshake,
    },
    {
      title: 'Knowledge Platform',
      desc: 'Understand participating services thoroughly before introducing.',
      icon: ShieldCheck,
    },
    {
      title: 'Status Visibility',
      desc: 'Follow introduced referrals and provider terms in one place.',
      icon: CheckCircle2,
    },
  ]

  return (
    <section id="express-interest" className="py-20 bg-canvas border-t border-border scroll-mt-24" aria-labelledby="cta-banner-title">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8">
        <div className="bg-white border border-border rounded-3xl p-8 sm:p-14 shadow-md max-w-5xl mx-auto flex flex-col gap-10">
          {/* Card Header */}
          <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider text-brand-violet bg-brand-violet/10 border border-brand-violet/20">
              <Sparkles size={14} className="text-brand-violet" aria-hidden="true" />
              <span>Affiliate Programme</span>
            </div>
            <h2 id="cta-banner-title" className="text-3xl sm:text-5xl font-headline font-bold text-ink tracking-tight">
              Ready to connect? Express Your Interest.
            </h2>
            <p className="text-base sm:text-lg text-ink-secondary leading-relaxed max-w-2xl">
              Join an ecosystem of professionals creating trusted introductions across Healthcare, Education,
              and Professional Services. Participation is free and supported by clear service information.
            </p>
          </div>

          {/* 4 Highlights Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" role="list">
            {highlights.map((h, i) => {
              const IconComp = h.icon
              return (
                <div key={i} className="p-5 rounded-2xl bg-canvas-subtle/70 border border-border flex flex-col gap-3" role="listitem">
                  <div className="w-10 h-10 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center shrink-0 border border-brand-violet/15" aria-hidden="true">
                    <IconComp size={20} />
                  </div>
                  <div>
                    <h3 className="text-base font-headline font-bold text-ink mb-1">{h.title}</h3>
                    <p className="text-xs sm:text-sm text-ink-secondary leading-relaxed m-0">{h.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Notice Box */}
          <div className="bg-brand-violet/5 border border-brand-violet/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-xl text-center md:text-left">
              <h3 className="text-xl font-headline font-bold text-ink mb-2">Connect with confidence</h3>
              <p className="text-sm text-ink-secondary leading-relaxed m-0">
                Applicants are among the first to access service information, introduction guidelines, and tracking tools upon launch rollout.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <a href="#how-it-works" className="btn btn-primary text-sm py-3 px-6">
                <span>Explore How It Works</span>
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a href="#faqs" className="btn btn-secondary text-sm py-3 px-5">
                <span>Review FAQs</span>
              </a>
            </div>
          </div>

          {/* Microcopy */}
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-ink-muted">
            <CheckCircle2 size={15} className="text-emerald-500 shrink-0" aria-hidden="true" />
            <p className="m-0">
              Free to join. Provider-specific compensation terms apply. Earnings are not guaranteed.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
