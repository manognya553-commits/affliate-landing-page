import React from 'react'
import { Sparkles, MessageSquareHeart, Compass, ArrowUpRight, ShieldAlert } from 'lucide-react'

export default function ParticipantsSection() {
  const capabilities = [
    {
      title: 'Recognise when someone may need a service.',
      description: 'Understand personal or business requirements naturally within your day-to-day conversations and relationships.',
      icon: Compass,
      iconColor: 'text-brand-violet',
      iconBg: 'bg-brand-violet/10',
    },
    {
      title: 'Communicate confidently and build trust.',
      description: 'Engage with people transparently, listen to their needs, and share recommendations with credibility and care.',
      icon: MessageSquareHeart,
      iconColor: 'text-brand-magenta',
      iconBg: 'bg-brand-magenta/10',
    },
    {
      title: 'Make relevant introductions that can create business opportunities.',
      description: 'Connect prospective clients with participating providers when there is a genuine, mutually beneficial fit.',
      icon: ArrowUpRight,
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50',
    },
  ]

  return (
    <section id="participants" className="py-20 bg-canvas border-t border-border scroll-mt-24" aria-labelledby="participants-title">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider text-brand-violet bg-brand-violet/10 border border-brand-violet/20">
            <Sparkles size={13} className="text-brand-violet" aria-hidden="true" />
            <span>Open Participation</span>
          </div>
          <h2 id="participants-title" className="text-3xl sm:text-4xl font-headline font-bold text-ink tracking-tight">
            Who Can Become an sBLOOM Affiliate?
          </h2>
          <p className="text-xl sm:text-2xl font-headline font-medium text-brand-violet">
            Anyone who can make meaningful connections.
          </p>
        </div>

        {/* Central Capability Showcase Card */}
        <div className="bg-white border border-border rounded-3xl p-8 sm:p-12 shadow-sm max-w-5xl mx-auto flex flex-col gap-10">
          <p className="text-lg sm:text-xl text-ink leading-relaxed font-body text-center max-w-3xl mx-auto m-0">
            You don't need a specific job title or professional background. If you can understand people's needs,
            build trust, and connect potential customers with relevant services, you can express your interest
            in the sBLOOM Affiliate Programme.
          </p>

          {/* 3 Core Capability Points */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list">
            {capabilities.map((item, index) => {
              const IconComp = item.icon
              return (
                <div key={index} className="bg-canvas-subtle/60 border border-border rounded-2xl p-6 flex flex-col gap-4 shadow-sm" role="listitem">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg} ${item.iconColor}`}
                    aria-hidden="true"
                  >
                    <IconComp size={24} />
                  </div>
                  <h3 className="text-lg font-headline font-bold text-ink leading-snug">{item.title}</h3>
                  <p className="text-sm text-ink-secondary leading-relaxed m-0">{item.description}</p>
                </div>
              )
            })}
          </div>

          {/* Closing Inclusive Note */}
          <div className="flex items-start sm:items-center gap-3.5 p-5 bg-canvas-subtle border border-border rounded-xl text-sm text-ink-secondary">
            <ShieldAlert size={20} className="text-brand-violet shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
            <p className="m-0 leading-relaxed">
              The programme is not limited to any particular profession or demographic. Provider-specific terms apply, and earnings are not guaranteed.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
