import React from 'react'
import { HeartPulse, GraduationCap, Briefcase, Check } from 'lucide-react'

export default function SectorsSection() {
  const sectors = [
    {
      id: 'healthcare',
      title: 'Healthcare',
      subtitle: 'Human-centred connections',
      description:
        'Connect individuals, families, and organisations with relevant healthcare and wellness services when trusted support and care are needed.',
      iconColor: 'text-[#FF6B6B]',
      iconBg: 'bg-[#FF6B6B]/10',
      borderHover: 'hover:border-[#FF6B6B]/40',
      icon: HeartPulse,
      highlights: [
        'Introductions to verified healthcare providers',
        'Respectful, permission-based referral process',
        'Clear service guidance and audience fit',
      ],
    },
    {
      id: 'education',
      title: 'Education',
      subtitle: 'Knowledge & growth opportunities',
      description:
        'Help learners, students, and professionals discover relevant educational institutions, skill enhancement courses, and academic programmes.',
      iconColor: 'text-brand-violet',
      iconBg: 'bg-brand-violet/10',
      borderHover: 'hover:border-brand-violet/40',
      icon: GraduationCap,
      highlights: [
        'Opportunities across institutions and learning paths',
        'Guidance on learner and programme fit',
        'Transparent provider terms and guidelines',
      ],
    },
    {
      id: 'professional-services',
      title: 'Professional Services',
      subtitle: 'Expertise-driven partnerships',
      description:
        'Connect businesses, entrepreneurs, and clients with qualified advisory, consulting, and professional expertise to support their operational growth.',
      iconColor: 'text-teal-600',
      iconBg: 'bg-teal-50',
      borderHover: 'hover:border-teal-500/40',
      icon: Briefcase,
      highlights: [
        'Business and commercial advisory connections',
        'Clear overview of service scope and client requirements',
        'Independent provider compensation terms',
      ],
    },
  ]

  return (
    <section id="sectors" className="py-20 bg-canvas-subtle/50 border-t border-border scroll-mt-24" aria-labelledby="sectors-title">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider text-brand-violet bg-brand-violet/10 border border-brand-violet/20">
            <span>Confirmed Launch Sectors</span>
          </div>
          <h2 id="sectors-title" className="text-3xl sm:text-4xl font-headline font-bold text-ink tracking-tight">
            Different services. Different needs. One connected network.
          </h2>
          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed">
            The sBLOOM Affiliate Programme launches across three vital sectors where genuine personal
            and professional connections make an immediate difference.
          </p>
        </div>

        {/* Sectors 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8" role="list">
          {sectors.map((sector) => {
            const IconComponent = sector.icon
            return (
              <div
                key={sector.id}
                className={`bg-white border border-border rounded-3xl p-8 flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${sector.borderHover}`}
                role="listitem"
              >
                <div className="flex items-center justify-between mb-6">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${sector.iconBg} ${sector.iconColor}`}
                    aria-hidden="true"
                  >
                    <IconComponent size={28} />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-wider px-3 py-1 bg-canvas-subtle rounded-full text-ink-muted border border-border">
                    Launch Sector
                  </span>
                </div>

                <h3 className="text-2xl font-headline font-bold text-ink mb-1">{sector.title}</h3>
                <span className="text-xs font-mono uppercase tracking-wider text-ink-muted mb-4">{sector.subtitle}</span>

                <p className="text-sm sm:text-base text-ink-secondary leading-relaxed mb-6 flex-1">{sector.description}</p>

                <ul className="space-y-3 pt-6 border-t border-border/60 list-none m-0 p-0" aria-label={`Highlights for ${sector.title}`}>
                  {sector.highlights.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-secondary">
                      <Check size={16} className="text-brand-violet shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Operational Boundary Disclaimer */}
        <div className="mt-12 p-6 bg-white border border-border rounded-2xl text-xs sm:text-sm text-ink-secondary leading-relaxed">
          <p className="m-0">
            <strong className="text-ink">Programme Scope Note:</strong> Healthcare, Education, and Professional Services represent the confirmed launch sectors.
            Specific participating service providers, distinct service scopes, and individual referral terms are established independently
            by each participating provider and will be accessible via the knowledge platform.
          </p>
        </div>
      </div>
    </section>
  )
}
