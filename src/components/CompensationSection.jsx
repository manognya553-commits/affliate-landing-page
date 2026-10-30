import React from 'react'
import { Building2, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react'

export default function CompensationSection() {
  const principles = [
    {
      title: 'Provider-Determined Terms',
      description:
        'Each participating service provider independently establishes its own compensation terms and conditions for introduced referrals.',
      icon: Building2,
    },
    {
      title: 'Free Participation',
      description:
        'Joining the sBLOOM Affiliate Programme is completely free. There are no registration fees, platform charges, or hidden subscriptions.',
      icon: Sparkles,
    },
    {
      title: 'Clear Information Before Introducing',
      description:
        'Affiliates have visibility into each participating provider’s independent terms through the planned platform before making introductions.',
      icon: CheckCircle2,
    },
  ]

  return (
    <section id="compensation" className="py-20 bg-canvas-subtle border-t border-border scroll-mt-24" aria-labelledby="compensation-title">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider text-brand-violet bg-brand-violet/10 border border-brand-violet/20">
            <span>Compensation Overview</span>
          </div>
          <h2 id="compensation-title" className="text-3xl sm:text-4xl font-headline font-bold text-ink tracking-tight">
            How Compensation Works
          </h2>
          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed">
            Transparent expectations are fundamental to trust. Each participating provider independently determines its own compensation terms, and earnings are not guaranteed.
          </p>
        </div>

        {/* 3 Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10" role="list">
          {principles.map((item, idx) => {
            const IconComponent = item.icon
            return (
              <div
                key={idx}
                className="bg-white border border-border rounded-2xl p-8 flex flex-col shadow-sm hover:shadow-md hover:-translate-y-1 hover:border-border-hover transition-all duration-300"
                role="listitem"
              >
                <div
                  className="w-12 h-12 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center mb-5 border border-brand-violet/15"
                  aria-hidden="true"
                >
                  <IconComponent size={24} />
                </div>
                <h3 className="text-xl font-headline font-bold text-ink mb-2 leading-snug">{item.title}</h3>
                <p className="text-[15px] text-ink-secondary leading-relaxed m-0">{item.description}</p>
              </div>
            )
          })}
        </div>

        {/* Prominent Trust & Regulatory Banner */}
        <div className="bg-white border border-border border-l-4 border-l-brand-violet rounded-xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert size={20} className="text-brand-violet shrink-0" aria-hidden="true" />
            <span className="text-base font-bold text-ink font-headline">Provider-Specific Terms • Earnings Not Guaranteed</span>
          </div>
          <p className="text-[14.5px] text-ink-secondary leading-relaxed m-0">
            Joining the sBLOOM Affiliate Programme is completely free. Each participating provider independently determines
            its own compensation terms. Earnings are not guaranteed, and expressing interest does not guarantee compensation.
          </p>
        </div>
      </div>
    </section>
  )
}
