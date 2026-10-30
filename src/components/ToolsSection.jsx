import React, { useState } from 'react'
import { BookOpen, ShieldCheck, Compass, Layers, FileCheck, Eye } from 'lucide-react'

export default function ToolsSection() {
  const [activeTab, setActiveTab] = useState('knowledge')

  const capabilities = [
    {
      title: 'Understanding Services',
      description:
        'Access information on participating services before making recommendations, so you can connect people knowledgeably when a relevant need arises.',
      icon: BookOpen,
    },
    {
      title: 'Guidance on Making Connections',
      description:
        'Reference practical guidelines to ensure introductions are always relevant, transparent, and permission-based.',
      icon: Compass,
    },
    {
      title: 'Visibility of Provider Terms',
      description:
        'Review each participating provider’s independent terms and conditions before introducing prospective clients.',
      icon: ShieldCheck,
    },
  ]

  return (
    <section id="tools" className="py-20 bg-canvas border-t border-border scroll-mt-24" aria-labelledby="tools-title">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider text-brand-violet bg-brand-violet/10 border border-brand-violet/20">
            <span>Knowledge Platform & Tracking Tools</span>
          </div>
          <h2 id="tools-title" className="text-3xl sm:text-4xl font-headline font-bold text-ink tracking-tight">
            The knowledge and tools to connect with confidence.
          </h2>
          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed">
            The sBLOOM Affiliate Programme provides a knowledge platform to help affiliates understand participating services,
            alongside referral tracking tools to follow introduced referrals.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left Column: Core High-Level Capabilities */}
          <div className="flex flex-col gap-6">
            <span className="font-mono text-xs uppercase tracking-wider text-brand-violet font-semibold">Planned Support</span>
            <h3 className="text-2xl sm:text-3xl font-headline font-bold text-ink">Designed to help you connect thoughtfully</h3>
            <p className="text-base text-ink-secondary leading-relaxed">
              You are not expected to sell or guess. Your role is simply to recognise when someone has a genuine need
              and make a relevant introduction, supported by clear service information.
            </p>

            <div className="space-y-4 pt-2">
              {capabilities.map((item, idx) => {
                const IconComponent = item.icon
                return (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-canvas-subtle border border-border">
                    <div className="w-10 h-10 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center shrink-0 border border-brand-violet/15" aria-hidden="true">
                      <IconComponent size={22} />
                    </div>
                    <div>
                      <h4 className="text-base font-headline font-bold text-ink mb-1">{item.title}</h4>
                      <p className="text-sm text-ink-secondary leading-relaxed m-0">{item.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Platform Interface Card */}
          <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
            {/* Card Meta Bar */}
            <div className="flex items-center justify-between pb-5 border-b border-border/60 mb-6">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-ink-muted">
                <Eye size={14} className="text-brand-violet" aria-hidden="true" />
                <span>Interface Overview</span>
              </div>
              <span className="text-xs font-mono text-ink-muted">Platform Tools</span>
            </div>

            {/* Interactive Tabs within Preview */}
            <div className="flex gap-2 p-1.5 bg-canvas-subtle rounded-xl mb-6" role="tablist" aria-label="Preview Views">
              <button
                type="button"
                role="tab"
                id="tab-knowledge"
                aria-selected={activeTab === 'knowledge'}
                aria-controls="panel-knowledge"
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'knowledge' ? 'bg-white text-brand-violet shadow-sm' : 'text-ink-secondary hover:text-ink'
                }`}
                onClick={() => setActiveTab('knowledge')}
              >
                <Layers size={14} aria-hidden="true" />
                <span>Knowledge Platform</span>
              </button>
              <button
                type="button"
                role="tab"
                id="tab-tracking"
                aria-selected={activeTab === 'tracking'}
                aria-controls="panel-tracking"
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === 'tracking' ? 'bg-white text-brand-violet shadow-sm' : 'text-ink-secondary hover:text-ink'
                }`}
                onClick={() => setActiveTab('tracking')}
              >
                <FileCheck size={14} aria-hidden="true" />
                <span>Referral Tracking</span>
              </button>
            </div>

            {/* Tab 1: Service Knowledge Preview */}
            {activeTab === 'knowledge' && (
              <div id="panel-knowledge" role="tabpanel" aria-labelledby="tab-knowledge" className="p-5 bg-canvas-subtle/70 rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs uppercase px-2.5 py-1 bg-white rounded-full text-brand-violet border border-brand-violet/20 font-semibold">Service Overview</span>
                  <span className="text-xs font-mono text-ink-muted">Verified Provider</span>
                </div>
                <div className="text-base font-headline font-bold text-ink mb-3">Understanding Participating Offerings</div>
                <div className="space-y-2.5 text-xs sm:text-sm text-ink-secondary">
                  <div className="flex flex-col sm:flex-row gap-1">
                    <span className="font-semibold text-ink sm:w-36 shrink-0">Service Focus:</span>
                    <span>Clear understanding of what the service provides and who it is designed for.</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1">
                    <span className="font-semibold text-ink sm:w-36 shrink-0">Introduction Guidance:</span>
                    <span>Guidelines for making relevant, permission-based introductions.</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1">
                    <span className="font-semibold text-ink sm:w-36 shrink-0">Provider Terms:</span>
                    <span>Visibility into independent terms established by each participating provider.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Referral Status Tracking Concept */}
            {activeTab === 'tracking' && (
              <div id="panel-tracking" role="tabpanel" aria-labelledby="tab-tracking" className="p-5 bg-canvas-subtle/70 rounded-2xl border border-border">
                <span className="block text-xs font-mono text-ink-muted mb-4 uppercase tracking-wider">
                  Live status progression:
                </span>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-brand-violet shrink-0 ring-4 ring-brand-violet/20" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-ink">Introduction Recorded</span>
                      <span className="text-xs text-ink-muted">Referral details logged on platform</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-brand-magenta shrink-0 ring-4 ring-brand-magenta/20" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-ink">Under Provider Review</span>
                      <span className="text-xs text-ink-muted">Participating provider evaluates referral fit</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 ring-4 ring-emerald-500/20" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-ink">Status Visibility</span>
                      <span className="text-xs text-ink-muted">Follow progress subject to provider-specific terms</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Note */}
            <div className="mt-6 pt-5 border-t border-border/60 text-xs text-ink-muted leading-relaxed">
              <p className="m-0">
                Participating service providers, distinct service scopes, and individual referral terms are established independently
                by each participating provider and accessible via the knowledge platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
