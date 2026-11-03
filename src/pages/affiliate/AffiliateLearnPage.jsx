import React, { useState } from 'react'
import { useLanguage } from '../../context/useLanguage'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import {
  BookOpen,
  HeartPulse,
  GraduationCap,
  MessageSquare,
  Globe2,
  Download,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  FileText,
  Copy,
  Check,
} from 'lucide-react'

export default function AffiliateLearnPage() {
  const { lang } = useLanguage()
  const [activeModule, setActiveModule] = useState('healthcare')
  const [copiedScript, setCopiedScript] = useState(null)

  const handleCopyScript = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedScript(id)
    setTimeout(() => setCopiedScript(null), 2500)
  }

  const modules = [
    {
      id: 'healthcare',
      title: 'Regional Clinics & Hospitals',
      icon: HeartPulse,
      badge: 'Healthcare & Diagnostics',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      pitchAngle: 'Automate Patient Appointments & Eliminate Manual Reception Calls',
      solutions: ['WhatsApp Business API', 'Local Google SEO', 'Website Speed & Trust'],
      avgDeal: '₹95,000 – ₹2,40,000',
      avgCommission: '₹19,000 – ₹48,000 (20%)',
      pains: [
        'Receptionist overwhelmed with manual phone calls and missing high-value consultation bookings.',
        'Patients waiting in long lines with no automated token system or WhatsApp reminders.',
        'Competitor diagnostics centers outranking them on Google Maps for local searches.',
      ],
      scriptEn: `Doctor / Sir, I noticed your clinic currently takes appointment bookings primarily through manual phone calls. Many top clinics across Hyderabad and Vijayawada have switched to automated WhatsApp booking via official WhatsApp Cloud API, which confirms slots 24/7 without receptionist delays. sBLOOM specializes in implementing this complete patient system. Would you be open to a 15-minute walkthrough of how it works?`,
      scriptTe: `డాక్టర్ గారు / సార్, మీ క్లినిక్‌లో అపాయింట్‌మెంట్స్ ఇప్పటికీ మాన్యువల్ ఫోన్ కాల్స్ ద్వారానే జరుగుతున్నాయని గమనించాను. ప్రస్తుతం హైదరాబాద్ మరియు విజయవాడలోని అగ్రశ్రేణి క్లినిక్స్ అధికారిక WhatsApp Cloud API ద్వారా 24/7 ఆటోమేటెడ్ అపాయింట్‌మెంట్ సిస్టమ్‌ను వాడుతున్నాయి. sBLOOM ఈ పూర్తి హెల్త్‌కేర్ ఆటోమేషన్ సిస్టమ్‌ను అందిస్తుంది. ఇది మీ క్లినిక్‌కి ఎలా ఉపయోగపడుతుందో 15 నిమిషాల డెమో చూడడానికి మీకు అనుకూలంగా ఉంటుందా?`,
    },
    {
      id: 'education',
      title: 'Institutes & Coaching Academies',
      icon: GraduationCap,
      badge: 'Education & Upskilling',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      pitchAngle: 'High-Intent Student Admissions & Automated Fee Inquiry Funnels',
      solutions: ['Meta Ads Funnels', 'Google Search Ads', 'WhatsApp Counseling Bot'],
      avgDeal: '₹80,000 – ₹1,80,000',
      avgCommission: '₹12,000 – ₹27,000 (15%)',
      pains: [
        'Spending heavily on generic flyers or paper ads with zero measurable attribution.',
        'High drop-off rate of student inquiries during admission season due to delayed counseling responses.',
        'Lack of local search dominance when parents search for top institutes in their locality.',
      ],
      scriptEn: `Director Sir, admission season inquiry volume is high, but students often join another institute if they do not receive prompt counseling details. sBLOOM builds high-performance WhatsApp counseling bots coupled with hyper-targeted Meta Ads for regional coaching academies that boost lead conversion by over 3x. Would you like to review their education case studies?`,
      scriptTe: `డైరెక్టర్ గారు, అడ్మిషన్ల సీజన్‌లో వచ్చే స్టూడెంట్ ఎంక్వైరీస్‌కి సత్వరమే సరైన సమాచారం ఇవ్వకపోతే వేరే ఇన్‌స్టిట్యూట్‌కి వెళ్లిపోయే అవకాశం ఉంది. sBLOOM ప్రత్యేకంగా ఎడ్యుకేషన్ అకాడమీల కోసం హై-పర్ఫార్మెన్స్ WhatsApp కౌన్సిలింగ్ బాట్స్ మరియు టార్గెటెడ్ యాడ్స్‌ను ఏర్పాటు చేస్తుంది. ఈ సిస్టమ్ మీ అడ్మిషన్లను ఎలా రెట్టింపు చేస్తుందో పరిశీలించడానికి మీకు ఆసక్తి ఉందా?`,
    },
    {
      id: 'whatsapp-compliance',
      title: 'WhatsApp Business API Guide',
      icon: MessageSquare,
      badge: 'API & Meta Verification',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      pitchAngle: 'Official Green Tick Verification & Interactive Message Catalogues',
      solutions: ['Meta Business Manager Verification', 'Pre-Approved Templates', 'Cloud API'],
      avgDeal: '₹60,000 – ₹1,20,000',
      avgCommission: '₹12,000 – ₹24,000 (20%)',
      pains: [
        'Fear of regular WhatsApp numbers getting permanently banned for bulk broadcast.',
        'Unable to send multi-product catalogs, payment links, or appointment booking buttons.',
        'Needing multi-agent shared inbox across multiple clinic or branch managers.',
      ],
      scriptEn: `Sir, using standard WhatsApp for business outreach carries a severe risk of permanent number ban. With official Meta Cloud API through sBLOOM, your number is 100% compliant, gets official green tick eligibility, and lets multiple staff members handle customer chats simultaneously from one official number.`,
      scriptTe: `సార్, సాధారణ వాట్సాప్ ద్వారా పెద్ద ఎత్తున మెసేజ్‌లు పంపితే నంబర్ శాశ్వతంగా బ్యాన్ అయ్యే ప్రమాదం ఉంది. sBLOOM ద్వారా అధికారిక Meta Cloud API వాడితే మీ నంబర్ పూర్తి సురక్షితంగా ఉంటుంది, గ్రీన్ టిక్ లభిస్తుంది మరియు మీ సిబ్బంది అంతా ఒకే నంబర్‌తో ఒకే సమయంలో కస్టమర్లతో మాట్లాడవచ్చు.`,
    },
    {
      id: 'vernacular',
      title: 'Vernacular Outreach Playbook',
      icon: Globe2,
      badge: 'Regional Scripting',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      pitchAngle: 'Telugu, Tamil & Kannada Local Business Rapport & Trust',
      solutions: ['Vernacular WhatsApp Audio Notes', 'Regional Case Studies', 'Local Trust Building'],
      avgDeal: '₹75,000 – ₹1,50,000',
      avgCommission: '₹15,000 – ₹30,000 (20%)',
      pains: [
        'Local business owners in tier-2 and tier-3 cities finding corporate English pitches intimidating.',
        'Lack of relatable regional examples showing digital growth in their own districts.',
        'Difficulty demonstrating digital marketing ROI to traditional business proprietors.',
      ],
      scriptEn: `Key Best Practice: Send a short 30-second Telugu voice note first explaining that you are a local digital partner affiliated with sBLOOM in Hyderabad, before sharing a formal link. Regional business owners are 4x more responsive to native voice messages than cold text blasts.`,
      scriptTe: `ముఖ్యమైన వ్యూహం: ముందుగా మీ సొంత గొంతుతో 30 సెకన్ల ఆడియో మెసేజ్ పంపండి: "నమస్తే సార్, నేను మీ స్థానిక డిజిటల్ గ్రోత్ పార్టనర్‌ని...". తెలుగు ఆడియో సందేశాలకు స్థానిక వ్యాపారవేత్తలు టెక్స్ట్ మెసేజ్ల కంటే 4 రెట్లు వేగంగా స్పందిస్తారు.`,
    },
  ]

  const current = modules.find((m) => m.id === activeModule) || modules[0]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E8E2D8]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#12101F] tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-[#6B3CFF]" />
            <span>{lang === 'te' ? 'భాగస్వామి అకాడమీ & సేల్స్ గైడ్స్' : 'Partner Enablement Academy'}</span>
          </h1>
          <p className="text-sm text-[#575266] mt-1">
            {lang === 'te'
              ? 'దక్షిణ భారతదేశ వ్యాపారాలకు డిజిటల్ సొల్యూషన్స్‌ను విజయవంతంగా పరిచయం చేయడానికి ఆచరణాత్మక గైడ్లు మరియు పిచ్ స్క్రిప్టులు'
              : 'Proven playbooks, objection handling scripts, and vernacular outreach strategies for South Indian enterprise deals.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#D6F36B] text-[#0E0B1E]">
            4 Core Modules
          </span>
        </div>
      </div>

      {/* Module Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {modules.map((mod) => {
          const Icon = mod.icon
          const isActive = mod.id === activeModule
          return (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isActive
                  ? 'border-[#6B3CFF] bg-white shadow-md ring-2 ring-[#6B3CFF]/20'
                  : 'border-[#E8E2D8] bg-[#F3ECE1]/70 hover:bg-white hover:border-[#575266]/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isActive ? 'bg-[#6B3CFF] text-white' : 'bg-white text-[#575266] border border-[#E8E2D8]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${mod.badgeColor}`}>
                    {mod.badge.split('&')[0]}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-[#12101F] leading-snug">{mod.title}</h3>
                <p className="text-xs text-[#575266] mt-1 line-clamp-2">{mod.pitchAngle}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E8E2D8]/60 flex items-center justify-between text-xs font-semibold text-[#6B3CFF]">
                <span>{isActive ? 'Active Module' : 'View Module'}</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          )
        })}
      </div>

      {/* Active Module Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Pain Points & Pitch Angles */}
        <div className="lg:col-span-2 space-y-5">
          <Card padding="p-6" variant="surface" className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#E8E2D8]">
              <div>
                <span className={`text-xs font-bold uppercase px-2.5 py-1 rounded-full border ${current.badgeColor}`}>
                  {current.badge}
                </span>
                <h2 className="text-xl font-bold font-serif text-[#12101F] mt-2">
                  {current.title} — Deal Strategy
                </h2>
                <p className="text-xs text-[#575266] mt-0.5 font-medium">
                  Core Proposition: {current.pitchAngle}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[11px] text-[#575266] block">Average Deal Value</span>
                <span className="font-serif font-bold text-lg text-[#12101F]">{current.avgDeal}</span>
                <span className="text-xs text-emerald-600 block font-semibold">{current.avgCommission}</span>
              </div>
            </div>

            {/* Pain Points Solved */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#575266]">
                Top 3 Client Pain Points to Address in First Conversation:
              </h4>
              <div className="space-y-2">
                {current.pains.map((pain, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/70 border border-[#E8E2D8] text-xs text-[#12101F]">
                    <span className="w-5 h-5 rounded-full bg-[#6B3CFF]/10 text-[#6B3CFF] font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{pain}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Ready Pitch Scripts */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#575266]">
                Ready-to-Use Client Pitch Scripts:
              </h4>

              {/* English Script */}
              <div className="p-4 rounded-xl bg-white border border-[#E8E2D8] space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#12101F] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#6B3CFF]" />
                    English Introduction Script
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={copiedScript === `${current.id}-en` ? Check : Copy}
                    onClick={() => handleCopyScript(`${current.id}-en`, current.scriptEn)}
                  >
                    {copiedScript === `${current.id}-en` ? 'Copied' : 'Copy'}
                  </Button>
                </div>
                <p className="text-xs text-[#575266] leading-relaxed italic bg-[#FAF7F2] p-3 rounded-lg border border-[#E8E2D8]">
                  "{current.scriptEn}"
                </p>
              </div>

              {/* Telugu Script */}
              <div className="p-4 rounded-xl bg-white border border-[#E8E2D8] space-y-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#12101F] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#6B3CFF]" />
                    తెలుగు పరిచయ సంభాషణ (Telugu Script)
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={copiedScript === `${current.id}-te` ? Check : Copy}
                    onClick={() => handleCopyScript(`${current.id}-te`, current.scriptTe)}
                  >
                    {copiedScript === `${current.id}-te` ? 'కాపీ చేయబడింది' : 'కాపీ'}
                  </Button>
                </div>
                <p className="text-xs text-[#575266] leading-relaxed italic bg-[#FAF7F2] p-3 rounded-lg border border-[#E8E2D8] font-sans">
                  "{current.scriptTe}"
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Key Solutions & Resources */}
        <div className="space-y-4">
          <Card padding="p-6" variant="surface" className="space-y-4">
            <h3 className="font-bold font-serif text-base text-[#12101F]">
              Recommended Service Bundles
            </h3>
            <p className="text-xs text-[#575266]">
              When pitching this sector, bundle these core solutions together to maximize average deal value:
            </p>
            <div className="space-y-2">
              {current.solutions.map((sol, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2.5 rounded-xl bg-white/80 border border-[#E8E2D8] text-xs font-semibold text-[#12101F]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{sol}</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E8E2D8] space-y-2">
              <span className="text-xs font-bold text-[#12101F] block">Downloadable Playbook</span>
              <p className="text-xs text-[#575266]">
                Complete 1-page PDF summary with objection responses for regional decision-makers.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                leftIcon={Download}
                onClick={() => alert(`Downloaded playbook: ${current.title}`)}
              >
                Download Sector Playbook PDF
              </Button>
            </div>
          </Card>

          <Card padding="p-6" variant="dark" className="space-y-3">
            <div className="flex items-center gap-2 text-[#D6F36B]">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Expert Partner Tip</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              Always mention the <strong>60-day attribution lock</strong>. Once you submit a client via the Lead Drawer, any contract closed within 60 days guarantees your commission credit.
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
