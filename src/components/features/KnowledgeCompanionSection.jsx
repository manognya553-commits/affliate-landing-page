import React from 'react'
import {
  Sparkles,
  BookOpen,
  HelpCircle,
  Search,
  UserCheck,
  Layers,
  Cpu,
  ShieldCheck,
  Languages,
} from 'lucide-react'

/**
 * KnowledgeCompanionSection
 * 
 * Modular highlight component introducing the upcoming Knowledge Augmentation feature.
 * Prepared for future integration by the Knowledge Augmentation engineering team.
 * 
 * NOTE FOR INTEGRATION TEAM:
 * - This container provides a clean modular boundary.
 * - Mount your interactive Knowledge Engine / Assistant inside the designated
 *   slot container below once the backend and client interfaces are ready.
 * - Do not remove the status pill or foundational capability cards.
 */
export default function KnowledgeCompanionSection({ lang = 'en' }) {
  const isTe = lang === 'te'

  const capabilities = [
    {
      id: 'understand',
      icon: BookOpen,
      title: isTe ? 'సర్వీసులను అర్థం చేసుకోండి' : 'Understand Services',
      description: isTe
        ? 'ప్రొవైడర్ ఆఫరింగ్స్, కీలక ఫీచర్లు మరియు ఉద్దేశించిన కస్టమర్ల ప్రయోజనాల గురించి సమగ్రంగా తెలుసుకోండి.'
        : 'Learn about provider offerings, key features, and intended customer profiles with verified clarity.',
      tag: isTe ? 'అవగాహన' : 'Insight',
    },
    {
      id: 'questions',
      icon: HelpCircle,
      title: isTe ? 'సందేహాలు నివృత్తి చేసుకోండి' : 'Ask Questions',
      description: isTe
        ? 'సర్వీసుల గురించిన మీ సందేహాలను సరళమైన భాషలో ఎప్పుడైనా అడిగి స్పష్టత పొందండి.'
        : 'Clarify doubts about provider services, terms, and requirements in simple, everyday language.',
      tag: isTe ? 'స్పష్టత' : 'Clarity',
    },
    {
      id: 'explore',
      icon: Search,
      title: isTe ? 'నాలెడ్జ్ అన్వేషించండి' : 'Explore Knowledge',
      description: isTe
        ? 'ప్రొవైడర్లు, వారి నైపుణ్యాలు మరియు ప్రత్యేక సేవల గురించిన సమాచారాన్ని సులభంగా యాక్సెస్ చేయండి.'
        : 'Access relevant, verified information about providers, specializations, and service eligibility.',
      tag: isTe ? 'అన్వేషణ' : 'Discovery',
    },
    {
      id: 'prepare',
      icon: UserCheck,
      title: isTe ? 'పరిచయాలకు సిద్ధం కాండి' : 'Prepare for Introductions',
      description: isTe
        ? 'సంభావ్య కస్టమర్‌ను కనెక్ట్ చేయడానికి ముందు ఆ సేవ వారి అవసరానికి సరిపోతుందో లేదో ముందే నిర్ధారించుకోండి.'
        : 'Understand services thoroughly before connecting a potential customer to ensure a genuine, high-trust fit.',
      tag: isTe ? 'సంసిద్ధత' : 'Readiness',
    },
    {
      id: 'continuous',
      icon: Layers,
      title: isTe ? 'నిరంతరం నేర్చుకోండి' : 'Learn Continuously',
      description: isTe
        ? 'sBLOOM నెట్‌వర్క్‌లో కొత్త ప్రొవైడర్లు మరియు సేవలు జోడించబడుతున్న కొద్దీ నాలెడ్జ్‌ను ఎప్పటికప్పుడు పొందండి.'
        : 'Access knowledge in one central place as our verified provider network and service catalog expands.',
      tag: isTe ? 'అభివృద్ధి' : 'Growth',
    },
  ]

  return (
    <section
      aria-label="Knowledge Augmentation Feature"
      className="relative overflow-hidden rounded-3xl bg-[#0E0B1E] border border-white/10 text-white p-6 sm:p-8 lg:p-10 shadow-xl"
    >
      {/* Ambient background glow accents */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#6B3CFF]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#D6F36B]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Status Indicator */}
      <div className="relative z-10 max-w-3xl space-y-4">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-[#D6F36B]/40 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D6F36B] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D6F36B]" />
          </span>
          <span className="text-xs font-bold text-[#D6F36B] tracking-wide uppercase">
            {isTe ? 'త్వరలో రాబోతోంది — నాలెడ్జ్ అసిస్టెంట్' : 'Coming Soon — Knowledge Assistant'}
          </span>
        </div>

        {/* Section Headline */}
        <div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-white tracking-tight">
            {isTe ? 'మీ నాలెడ్జ్ కంపానియన్' : 'Your Knowledge Companion'}
          </h2>
          <p className="text-sm sm:text-base text-[#FAF7F2]/80 mt-2.5 leading-relaxed font-sans">
            {isTe
              ? 'సర్వీసును అర్థం చేసుకోవడం కష్టం కాకూడదు. మా త్వరలో రాబోయే నాలెడ్జ్ అసిస్టెంట్ మీకు ప్రొవైడర్ సేవలను అన్వేషించడానికి, వారు ఏమి అందిస్తున్నారో అర్థం చేసుకోవడానికి, ప్రశ్నలు అడగడానికి మరియు మీకు మార్గదర్శకత్వం అవసరమైనప్పుడు సందేహాలను నివృత్తి చేసుకోవడానికి సహాయపడుతుంది.'
              : "Understanding a service shouldn't be difficult. Our upcoming knowledge assistant will help you explore provider services, understand what they offer, ask questions, and clarify doubts whenever you need guidance."}
          </p>
        </div>
      </div>

      {/* 5 Core Capabilities Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-8">
        {capabilities.map((cap) => {
          const Icon = cap.icon
          return (
            <div
              key={cap.id}
              className="flex flex-col justify-between p-4 rounded-2xl bg-white/[0.06] border border-white/10 hover:border-[#6B3CFF]/50 hover:bg-white/[0.09] transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#6B3CFF]/30 border border-[#6B3CFF]/40 text-[#D6F36B] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-[#FAF7F2]/60 border border-white/5">
                    {cap.tag}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-[#D6F36B] transition-colors leading-snug">
                  {cap.title}
                </h3>
                <p className="text-xs text-[#FAF7F2]/70 mt-1.5 leading-relaxed">
                  {cap.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Integration Mount Slot Container (Architectural placeholder for Knowledge Augmentation Team) */}
      <div
        id="knowledge-engine-slot"
        data-integration-target="sbloom-knowledge-augmentation"
        className="relative z-10 mt-8 rounded-2xl border border-dashed border-[#6B3CFF]/50 bg-gradient-to-r from-[#181432]/90 via-[#0E0B1E]/95 to-[#181432]/90 p-5 sm:p-6"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#6B3CFF]/20 border border-[#6B3CFF]/40 text-[#D6F36B] flex items-center justify-center shrink-0">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold font-mono text-[#D6F36B] tracking-wide">
                  {isTe ? 'సిస్టమ్ సిద్ధంగా ఉంది · ఇంటిగ్రేషన్ దశలో ఉంది' : 'SYSTEM PREPARED · INTEGRATION IN PROGRESS'}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/70 font-mono">
                  Module Slot #KA-01
                </span>
              </div>
              <p className="text-xs text-[#FAF7F2]/80 mt-1 max-w-2xl leading-relaxed">
                {isTe
                  ? 'నాలెడ్జ్ ఆగ్మెంటేషన్ వ్యవస్థను ప్రత్యేక ఇంజనీరింగ్ బృందం అభివృద్ధి చేస్తోంది. అనుసంధానం పూర్తయిన తర్వాత, అఫిలియేట్లు ఈ విభాగాని నుండే నేరుగా ప్రొవైడర్ సమాచారాన్ని శోధించవచ్చు మరియు సందేహాలు అడగవచ్చు.'
                  : 'The Knowledge Augmentation system is currently in active development by our core intelligence team. Once connected, affiliates will be able to query provider insights, service prerequisites, and introduction tips directly within this interactive space.'}
              </p>
            </div>
          </div>

          {/* Planned Features Indicator Badges */}
          <div className="flex flex-wrap md:flex-col lg:flex-row items-start md:items-end lg:items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-[#FAF7F2]/70 font-mono">
              <Languages className="w-3.5 h-3.5 text-[#D6F36B]" />
              <span>English & Telugu</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[11px] text-[#FAF7F2]/70 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Provider-Verified Data</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
