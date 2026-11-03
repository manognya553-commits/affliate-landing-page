import React, { useState } from 'react'
import { BookOpen, ShieldCheck, Compass, Layers, FileCheck, Eye } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

export default function ToolsSection() {
  const { lang, copy } = useLanguage()
  const [activeTab, setActiveTab] = useState('knowledge')

  const text = {
    en: {
      eyebrow: 'Knowledge Platform & Tracking Tools',
      title: 'The knowledge and tools to connect with confidence.',
      subtitle:
        'The sBLOOM Affiliate Programme provides a knowledge platform to help affiliates understand participating services, alongside referral tracking tools to follow introduced referrals.',
      supportLabel: 'Affiliate Support',
      connectTitle: 'Designed to help you connect thoughtfully',
      connectDesc:
        'You are not expected to sell or guess. Your role is simply to recognise when someone has a genuine need and make a relevant introduction, supported by clear service information.',
      capabilities: [
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
      ],
      overviewLabel: 'Interface Overview',
      toolsLabel: 'Platform Tools',
      tabKnowledge: 'Knowledge Platform',
      tabTracking: 'Referral Tracking',
      serviceOverview: 'Service Overview',
      verifiedProvider: 'Verified Provider',
      cardTitle: 'Understanding Participating Offerings',
      focusLabel: 'Service Focus:',
      focusDesc: 'Clear understanding of what the service provides and who it is designed for.',
      guidanceLabel: 'Introduction Guidance:',
      guidanceDesc: 'Guidelines for making relevant, permission-based introductions.',
      termsLabel: 'Provider Terms:',
      termsDesc: 'Visibility into independent terms established by each participating provider.',
      statusProgression: 'Live status progression:',
      status1: 'Introduction Recorded',
      status1Desc: 'Referral details logged on platform',
      status2: 'Under Provider Review',
      status2Desc: 'Participating provider evaluates referral fit',
      status3: 'Status Visibility',
      status3Desc: 'Follow progress subject to provider-specific terms',
      footerNote:
        'Participating service providers, distinct service scopes, and individual referral terms are established independently by each participating provider and accessible via the knowledge platform.',
    },
    te: {
      eyebrow: 'నాలెడ్జ్, సపోర్ట్ & టూల్స్',
      title: 'రిఫరల్ చేసే ముందు ప్రాసెస్ అర్థం చేసుకోండి',
      subtitle:
        'సెక్టర్లు, రిఫరల్ ప్రాసెస్, ప్రొవైడర్ నిబంధనలు అర్థం చేసుకోవడానికి గైడెన్స్ మరియు టూల్స్ అందించాలని ఉద్దేశం.',
      supportLabel: 'అఫిలియేట్ సపోర్ట్',
      connectTitle: 'రిఫరల్ చేసే ముందు ప్రాసెస్ అర్థం చేసుకోండి',
      connectDesc:
        'సెక్టర్లు, రిఫరల్ ప్రాసెస్, ప్రొవైడర్ నిబంధనలు అర్థం చేసుకోవడానికి గైడెన్స్ మరియు టూల్స్ అందించాలని ఉద్దేశం.',
      capabilities: [
        {
          title: 'సర్వీస్ వివరాలు తెలుసుకోవడం',
          description:
            'సెక్టర్లు మరియు సర్వీస్ వివరాలు ముందే తెలుసుకోండి.',
          icon: BookOpen,
        },
        {
          title: 'రిఫరల్ స్టేటస్ చూడడం (ప్లాన్ చేసిన ఫీచర్)',
          description:
            'మీరు పంపిన రిఫరల్స్ ఏ దశలో ఉన్నాయో ట్రాక్ చేయండి.',
          icon: Compass,
        },
        {
          title: 'ప్రొవైడర్ నిబంధనలు చూడడం',
          description:
            'ప్రతి సర్వీస్ ప్రొవైడర్ నిబంధనలను ముందే క్లియర్‌గా చూసుకోండి.',
          icon: ShieldCheck,
        },
      ],
      overviewLabel: 'ఇంటర్‌ఫేస్ వివరాలు',
      toolsLabel: 'ప్లాట్‌ఫామ్ టూల్స్',
      tabKnowledge: 'నాలెడ్జ్ ప్లాట్‌ఫామ్',
      tabTracking: 'రిఫరల్ స్టేటస్ (ప్లాన్ చేసిన ఫీచర్)',
      serviceOverview: 'సర్వీస్ వివరాలు',
      verifiedProvider: 'సర్వీస్ ప్రొవైడర్',
      cardTitle: 'సర్వీస్ వివరాలు తెలుసుకోవడం',
      focusLabel: 'సర్వీస్ వివరాలు:',
      focusDesc: 'సర్వీస్ వివరాలు తెలుసుకోవడం మరియు అర్థం చేసుకోవడం.',
      guidanceLabel: 'రిఫరల్ ప్రాసెస్:',
      guidanceDesc: 'అనుమతితో మాత్రమే సరైన ప్రొవైడర్లకు పరిచయం చేయడం.',
      termsLabel: 'ప్రొవైడర్ నిబంధనలు:',
      termsDesc: 'ప్రతి ప్రొవైడర్ నిబంధనలు ముందే చూడడం.',
      statusProgression: 'రిఫరల్ స్టేటస్ చూడడం (ప్లాన్ చేసిన ఫీచర్):',
      status1: 'పరిచయం నమోదైంది',
      status1Desc: 'మీరు పంపిన వివరాలు నమోదయ్యాయి',
      status2: 'పరిశీలనలో ఉంది',
      status2Desc: 'ప్రొవైడర్ నిబంధనల ప్రకారం పరిశీలన',
      status3: 'అర్హత స్థితి',
      status3Desc: 'ప్రొవైడర్ నిబంధనల ప్రకారం పురోగతి',
      footerNote:
        'ఇంకా లైవ్ కాని ఫీచర్లను “ప్లాన్ చేసినవి” అని మాత్రమే చెప్పాలి.',
    },
  }

  const t = text[lang] || text.en

  return (
    <section id="tools" className="py-20 bg-canvas border-t border-border scroll-mt-24" aria-labelledby="tools-title">
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 flex flex-col items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider text-brand-violet bg-brand-violet/10 border border-brand-violet/20">
            <span>{t.eyebrow}</span>
          </div>
          <h2 id="tools-title" className="text-3xl sm:text-4xl font-headline font-bold text-ink tracking-tight">
            {t.title}
          </h2>
          <p className="text-base sm:text-lg text-ink-secondary leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left Column: Core High-Level Capabilities */}
          <div className="flex flex-col gap-6">
            <span className="font-mono text-xs uppercase tracking-wider text-brand-violet font-semibold">{t.supportLabel}</span>
            <h3 className="text-2xl sm:text-3xl font-headline font-bold text-ink">{t.connectTitle}</h3>
            <p className="text-base text-ink-secondary leading-relaxed">
              {t.connectDesc}
            </p>

            <div className="space-y-4 pt-2">
              {t.capabilities.map((item, idx) => {
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
                <span>{t.overviewLabel}</span>
              </div>
              <span className="text-xs font-mono text-ink-muted">{t.toolsLabel}</span>
            </div>

            {/* Interactive Tabs */}
            <div className="flex gap-2 p-1.5 bg-canvas-subtle rounded-xl mb-6" role="tablist" aria-label="Platform Views">
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
                <span>{t.tabKnowledge}</span>
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
                <span>{t.tabTracking}</span>
              </button>
            </div>

            {/* Tab 1: Service Knowledge */}
            {activeTab === 'knowledge' && (
              <div id="panel-knowledge" role="tabpanel" aria-labelledby="tab-knowledge" className="p-5 bg-canvas-subtle/70 rounded-2xl border border-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs uppercase px-2.5 py-1 bg-white rounded-full text-brand-violet border border-brand-violet/20 font-semibold">{t.serviceOverview}</span>
                  <span className="text-xs font-mono text-ink-muted">{t.verifiedProvider}</span>
                </div>
                <div className="text-base font-headline font-bold text-ink mb-3">{t.cardTitle}</div>
                <div className="space-y-2.5 text-xs sm:text-sm text-ink-secondary">
                  <div className="flex flex-col sm:flex-row gap-1">
                    <span className="font-semibold text-ink sm:w-36 shrink-0">{t.focusLabel}</span>
                    <span>{t.focusDesc}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1">
                    <span className="font-semibold text-ink sm:w-36 shrink-0">{t.guidanceLabel}</span>
                    <span>{t.guidanceDesc}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-1">
                    <span className="font-semibold text-ink sm:w-36 shrink-0">{t.termsLabel}</span>
                    <span>{t.termsDesc}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Referral Status Tracking */}
            {activeTab === 'tracking' && (
              <div id="panel-tracking" role="tabpanel" aria-labelledby="tab-tracking" className="p-5 bg-canvas-subtle/70 rounded-2xl border border-border">
                <span className="block text-xs font-mono text-ink-muted mb-4 uppercase tracking-wider">
                  {t.statusProgression}
                </span>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-brand-violet shrink-0 ring-4 ring-brand-violet/20" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-ink">{t.status1}</span>
                      <span className="text-xs text-ink-muted">{t.status1Desc}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-brand-magenta shrink-0 ring-4 ring-brand-magenta/20" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-ink">{t.status2}</span>
                      <span className="text-xs text-ink-muted">{t.status2Desc}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0 ring-4 ring-emerald-500/20" />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-ink">{t.status3}</span>
                      <span className="text-xs text-ink-muted">{t.status3Desc}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Note */}
            <div className="mt-6 pt-5 border-t border-border/60 text-xs text-ink-muted leading-relaxed">
              <p className="m-0">
                {t.footerNote}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
