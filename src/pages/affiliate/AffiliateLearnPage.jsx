import React, { useState, useEffect } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { useLanguage } from '../../context/useLanguage'
import { api } from '../../lib/api'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import KnowledgeCompanionSection from '../../components/features/KnowledgeCompanionSection'
import {
  BookOpen,
  HeartPulse,
  GraduationCap,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Search,
  UserCheck,
  Layers,
  FileText,
  Copy,
  Check,
  AlertCircle,
  HelpCircle,
  Clock,
  Compass,
} from 'lucide-react'

export default function AffiliateLearnPage() {
  const { lang } = useLanguage()
  const isTe = lang === 'te'
  const outletContext = useOutletContext()
  const openLeadDrawer = outletContext?.openLeadDrawer

  // Active expanded accordion item for the "Useful Information Available Now"
  const [expandedGuide, setExpandedGuide] = useState('how-it-works')
  const [copiedScript, setCopiedScript] = useState(null)

  // Real provider counts state
  const [providers, setProviders] = useState([])
  const [loadingProviders, setLoadingProviders] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function fetchProviders() {
      try {
        const res = await api.getProviders()
        if (isMounted && res) {
          const list = Array.isArray(res) ? res : res.data || []
          setProviders(list)
        }
      } catch (err) {
        console.warn('Could not fetch providers for sector count:', err)
      } finally {
        if (isMounted) setLoadingProviders(false)
      }
    }
    fetchProviders()
    return () => {
      isMounted = false
    }
  }, [])

  const handleCopyScript = (id, text) => {
    navigator.clipboard.writeText(text)
    setCopiedScript(id)
    setTimeout(() => setCopiedScript(null), 2500)
  }

  // Count active providers per official sector
  const healthcareCount = providers.filter(
    (p) => (p.sector || '').toLowerCase() === 'healthcare' && p.is_active !== false
  ).length
  const educationCount = providers.filter(
    (p) => (p.sector || '').toLowerCase() === 'education' && p.is_active !== false
  ).length
  const professionalCount = providers.filter(
    (p) =>
      ['professional_services', 'professional services', 'professional'].includes(
        (p.sector || '').toLowerCase()
      ) && p.is_active !== false
  ).length

  // Three Official Service Sectors
  const officialSectors = [
    {
      id: 'healthcare',
      title: isTe ? 'ఆరోగ్య సంరక్షణ' : 'Healthcare',
      badge: isTe ? 'హెల్త్‌కేర్ & క్లినిక్స్' : 'Healthcare & Diagnostics',
      icon: HeartPulse,
      themeColor: 'emerald',
      badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-700',
      description: isTe
        ? 'తగిన హెల్త్‌కేర్ సేవ కోసం చూస్తున్న వారిని సంబంధిత ప్రొవైడర్‌కు పరిచయం చేయండి. క్లినిక్‌లు, రోగనిర్ధారణ కేంద్రాలు, నిపుణుల సలహాలు మరియు రోగి అపాయింట్‌మెంట్ మార్గదర్శకాలు ఇందులో ఉంటాయి.'
        : 'Introduce someone looking for a suitable healthcare service to a relevant provider. Covers regional clinics, diagnostic centres, specialist consultations, and appointment booking.',
      knowledgeCapability: isTe
        ? 'నాలెడ్జ్ కంపానియన్ ద్వారా అఫిలియేట్లు ఈ రంగంలోని ప్రొవైడర్ సేవలు, క్లినిక్ అర్హతలు మరియు కన్సల్టేషన్ నిబంధనల గురించి ప్రశ్నలు అడిగి స్పష్టత పొందవచ్చు.'
        : 'Affiliates will be able to query specific healthcare provider offerings, clinic specializations, and patient consultation guidelines through the upcoming Knowledge Companion.',
      directoryLink: '/app/services?sector=healthcare',
      providerCount: healthcareCount,
    },
    {
      id: 'education',
      title: isTe ? 'విద్య & శిక్షణ' : 'Education',
      badge: isTe ? 'ఎడ్యుకేషన్ & అకాడమీలు' : 'Education & Academies',
      icon: GraduationCap,
      themeColor: 'blue',
      badgeClass: 'bg-blue-50 text-blue-800 border-blue-200',
      iconBg: 'bg-blue-100 text-blue-700',
      description: isTe
        ? 'విద్యార్థులు మరియు కుటుంబాలను సంబంధిత విద్యా సేవలతో అనుసంధానించండి. కోచింగ్ అకాడమీలు, పోటీ పరీక్షల శిక్షణ, స్కిల్ డెవలప్‌మెంట్ మరియు అడ్మిషన్ల వివరాలు ఇందులో ఉంటాయి.'
        : 'Connect students and families with relevant educational services. Covers coaching institutes, competitive exam academies, upskilling programmes, and student admissions.',
      knowledgeCapability: isTe
        ? 'నాలెడ్జ్ కంపానియన్ ద్వారా కోర్సు వివరాలు, ప్రవేశ అర్హతలు, బ్యాచ్ సమయాలు మరియు అకాడమీ ఆఫరింగ్స్ గురించి అఫిలియేట్లు ఎప్పటికప్పుడు సందేహాలను నివృత్తి చేసుకోవచ్చు.'
        : 'Affiliates will be able to clarify course curricula, admission criteria, batch schedules, and academy offerings in simple language through the upcoming Knowledge Companion.',
      directoryLink: '/app/services?sector=education',
      providerCount: educationCount,
    },
    {
      id: 'professional_services',
      title: isTe ? 'ప్రొఫెషనల్ & వ్యాపార సేవలు' : 'Professional Services',
      badge: isTe ? 'కార్పొరేట్ & ప్రొఫెషనల్' : 'Professional & Advisory',
      icon: Briefcase,
      themeColor: 'purple',
      badgeClass: 'bg-purple-50 text-purple-800 border-purple-200',
      iconBg: 'bg-purple-100 text-purple-700',
      description: isTe
        ? 'వ్యాపారాలు మరియు వ్యక్తులను వారి అవసరాలకు సరిపోయే సర్వీస్ ప్రొవైడర్లకు పరిచయం చేయండి. కార్పొరేట్ సలహా, పన్నులు (GST & IT), అకౌంటింగ్, చట్టపరమైన సేవలు మరియు డిజిటల్ సొల్యూషన్స్ ఇందులో ఉంటాయి.'
        : 'Introduce businesses and individuals to providers whose services may meet their needs. Covers corporate advisory, tax & compliance, accounting, legal services, and digital solutions.',
      knowledgeCapability: isTe
        ? 'నాలెడ్జ్ కంపానియన్ ద్వారా సర్వీస్ స్పెసిఫికేషన్లు, వ్యాపార అర్హతా ప్రమాణాలు మరియు ప్రొవైడర్ సేవా నిబంధనలను అఫిలియేట్లు క్షణాల్లో శోధించి తెలుసుకోవచ్చు.'
        : 'Affiliates will be able to access verified service specifications, business eligibility terms, and provider prerequisites in this sector through the upcoming Knowledge Companion.',
      directoryLink: '/app/services?sector=professional_services',
      providerCount: professionalCount,
    },
  ]

  // 7 Useful Information Guides Available Now
  const currentGuides = [
    {
      id: 'how-it-works',
      title: isTe ? 'sBLOOM అఫిలియేట్ ప్రోగ్రామ్ ఎలా పనిచేస్తుంది?' : 'How the sBLOOM Affiliate Programme Works',
      subtitle: isTe ? 'అనుమతి ఆధారిత పరిచయాల ప్రాథమిక సూత్రం' : 'The permission-first introduction principle',
      icon: Compass,
      content: [
        isTe
          ? 'sBLOOM ప్రజలను హెల్త్‌కేర్, విద్య మరియు ప్రొఫెషనల్ రంగాలలోని విశ్వసనీయ, ధృవీకరించబడిన సర్వీస్ ప్రొవైడర్లతో కలుపుతుంది.'
          : 'sBLOOM connects people with trusted, verified service providers across Healthcare, Education, and Professional Services.',
        isTe
          ? 'ఒక అఫిలియేట్‌గా, మీ పాత్ర స్నేహపూర్వక, అనుమతి ఆధారిత పరిచయాలను ప్రారంభించడం మాత్రమే. అమ్మకాల ఒత్తిడి లేదా కోల్డ్ పిచ్‌లు ఉండవు.'
          : 'As an affiliate, your role is to make friendly, permission-first introductions. There are no aggressive sales pitches, no quotas, and no pushy cold calls.',
        isTe
          ? 'ఎవరికైనా నిజంగా ఒక సేవ అవసరమని మీరు గమనించినప్పుడు మాత్రమే వారి అనుమతి తీసుకొని పరిచయం చేస్తారు.'
          : 'You introduce a service only when you genuinely identify that someone in your circle has a need and gives you clear permission to connect them.',
      ],
      action: {
        label: isTe ? 'సర్వీసెస్ కేటలాగ్ చూడండి' : 'Explore Service Providers',
        link: '/app/services',
      },
    },
    {
      id: 'explore-providers',
      title: isTe ? 'సర్వీస్ ప్రొవైడర్లను ఎలా అన్వేషించాలి?' : 'How to Explore Service Providers',
      subtitle: isTe ? 'ధృవీకరించబడిన భాగస్వాముల వివరాలు తెలుసుకోవడం' : 'Browsing verified network partners',
      icon: Search,
      content: [
        isTe
          ? 'పోర్టల్‌లోని "సర్వీసెస్" పేజీని సందర్శించి మా నెట్‌వర్క్‌లోని యాక్టివ్ ప్రొవైడర్లను చూడవచ్చు.'
          : 'Navigate to the "Services" directory in the portal to browse all active and publicly referable providers.',
        isTe
          ? 'రంగం (హెల్త్‌కేర్, విద్య, ప్రొఫెషనల్), నగరం లేదా సేవ పేరు ఆధారంగా ప్రొవైడర్లను సులభంగా ఫిల్టర్ చేయవచ్చు.'
          : 'Filter providers by sector (Healthcare, Education, Professional Services), city, or specialty keyword.',
        isTe
          ? 'ప్రతి ప్రొవైడర్ అందించే నిర్దిష్ట సేవలు, వివరాలు మరియు లొకేషన్ సమాచారాన్ని సమీక్షించండి.'
          : 'Review each provider profile, including their exact verified services, active locations, and service requirements.',
      ],
      action: {
        label: isTe ? 'ప్రొవైడర్ డైరెక్టరీ తెరవండి' : 'Open Providers Directory',
        link: '/app/services',
      },
    },
    {
      id: 'select-service',
      title: isTe ? 'సరైన ప్రొవైడర్ మరియు సర్వీసును ఎలా ఎంచుకోవాలి?' : 'How to Select the Correct Provider & Service',
      subtitle: isTe ? 'ఖచ్చితమైన అవసరానికి తగిన సేవను జత చేయడం' : 'Matching customer need to the exact offering',
      icon: Layers,
      content: [
        isTe
          ? 'రిఫరల్ సమర్పించేటప్పుడు, ముందుగా మీ కాంటాక్ట్‌కు సరిపోయే నిర్దిష్ట ప్రొవైడర్‌ను ఎంచుకోండి.'
          : 'In the Lead Submission Drawer, select the specific provider first from the searchable dropdown.',
        isTe
          ? 'ప్రొవైడర్‌ను ఎంచుకున్న తర్వాత, ఆ ప్రొవైడర్ అందించే నిర్దిష్ట సేవల జాబితా మాత్రమే కనిపిస్తుంది. వాటిలో సరైనదాన్ని ఎంచుకోండి.'
          : 'Once a provider is selected, only the active services offered by that provider will load. Select the exact service your customer needs.',
        isTe
          ? 'ప్రతి రిఫరల్ ఒక నిర్దిష్ట ప్రొవైడర్ మరియు ఒక నిర్దిష్ట సేవతో మాత్రమే అనుసంధానించబడి ఉంటుంది.'
          : 'Each referral is tied directly to one provider and one specific service, ensuring precise routing and attribution.',
      ],
      action: {
        label: isTe ? 'లీడ్ డ్రాయర్ పరిశీలించండి' : 'Open Lead Drawer',
        onClick: () => openLeadDrawer && openLeadDrawer(),
      },
    },
    {
      id: 'submit-referral',
      title: isTe ? 'రిఫరల్‌ను ఎలా సమర్పించాలి?' : 'How to Submit a Referral',
      subtitle: isTe ? 'స్టెప్-బై-స్టెప్ సమర్పణ విధానం' : 'Step-by-step submission workflow',
      icon: UserCheck,
      content: [
        isTe
          ? 'పోర్టల్ పైభాగంలో ఉన్న "+ రిఫరల్ సమర్పించండి" బటన్‌ను క్లిక్ చేసి లీడ్ డ్రాయర్ తెరవండి.'
          : 'Click "+ Refer Client Lead" or "Submit Referral" from anywhere in the portal to open the Lead Drawer.',
        isTe
          ? 'కస్టమర్ పేరు, మొబైల్ నంబర్ మరియు ప్రాంతం/నగరాన్ని నమోదు చేయండి (ఈ వివరాలు తప్పనిసరి).'
          : "Enter the customer's full name, valid mobile number, and city/locality (these fields are mandatory).",
        isTe
          ? 'ఎంచుకున్న సేవకు అవసరమైతే, కస్టమర్ సమస్య లేదా అవసరం గురించిన సంక్షిప్త వివరణను అందించండి.'
          : 'If the selected provider/service has configured requirement instructions, briefly describe what the customer needs help with.',
        isTe
          ? 'కస్టమర్ అనుమతి తీసుకున్నట్లు నిర్ధారించి రిఫరల్‌ను సమర్పించండి.'
          : "Confirm customer consent and click 'Submit Referral' to securely register the lead in your pipeline.",
      ],
      action: {
        label: isTe ? 'ఇప్పుడే రిఫరల్ చేయండి' : '+ Submit a Referral',
        onClick: () => openLeadDrawer && openLeadDrawer(),
      },
    },
    {
      id: 'customer-consent',
      title: isTe ? 'కస్టమర్ అనుమతి ఎందుకు తప్పనిసరి?' : 'Why Customer Consent is Necessary',
      subtitle: isTe ? 'నైతిక పరిచయాలు & గోప్యతా రక్షణ' : 'Ethical referrals, trust, and privacy',
      icon: ShieldCheck,
      content: [
        isTe
          ? 'మా ప్రాథమిక సూత్రం: "ముందుగా అడగండి, మీ పరిధిలో ఉండండి, నిజం చెప్పండి."'
          : 'Our core principle is: "Ask first, stay in your lane, tell the truth."',
        isTe
          ? 'కస్టమర్ వివరాలను సబ్‌మిట్ చేసే ముందు వారి స్పష్టమైన సమ్మతిని తప్పనిసరిగా తీసుకోవాలి. ఇది వారి గోప్యతను కాపాడుతుంది.'
          : 'Always obtain clear, explicit consent from the person before sharing their phone number or requirement.',
        isTe
          ? 'అనుమతి లేని లీడ్లు, కోల్డ్ స్పామ్ లేదా అవాస్తవ సమాచారాన్ని సమర్పించడం ప్రోగ్రామ్ నిబంధనలకు విరుద్ధం మరియు అవి అనర్హమైనవి.'
          : 'Unauthorized contacts, unsolicited numbers, or cold spam damage trust, violate programme rules, and will be disqualified.',
      ],
      action: {
        label: isTe ? 'మద్దతు & మార్గదర్శకాలు' : 'View Support Guidelines',
        link: '/app/support',
      },
    },
    {
      id: 'track-status',
      title: isTe ? 'రిఫరల్ స్థితిని ఎలా ట్రాక్ చేయాలి?' : 'How to Track Referral Status',
      subtitle: isTe ? 'లీడ్స్ పైప్‌లైన్ మరియు నిజ-సమయ అప్‌డేట్లు' : 'Real-time pipeline progression',
      icon: Clock,
      content: [
        isTe
          ? 'మీరు సమర్పించిన రిఫరల్స్ అన్నీ "లీడ్స్" పేజీలో నిజ-సమయంలో కనిపిస్తాయి.'
          : 'Every referral you submit appears immediately on your "Leads" pipeline page.',
        isTe
          ? 'స్టేటస్ దశలు: సమర్పించబడింది (Submitted) → సంప్రదించారు (Contacted) → అర్హత పొందింది (Qualified) → పూర్తయింది (Completed).'
          : 'Observe status progression through clear lifecycle stages: Submitted → Contacted → Qualified → Completed (or Disqualified).',
        isTe
          ? 'ప్రొవైడర్ లేదా అడ్మిన్ టీమ్ అప్‌డేట్ చేసిన స్టేటస్ నోట్స్ మరియు టైమ్‌స్టాంప్‌లను మీరు ఎప్పటికప్పుడు సమీక్షించవచ్చు.'
          : 'Review status timestamps, verification notes, and updates recorded as the provider processes the customer lead.',
      ],
      action: {
        label: isTe ? 'లీడ్స్ పైప్‌లైన్ తెరవండి' : 'View My Referrals',
        link: '/app/leads',
      },
    },
    {
      id: 'compensation-terms',
      title: isTe ? 'ప్రొవైడర్-నిర్దేశిత పరిహార నిబంధనలను అర్థం చేసుకోవడం' : 'Understanding Provider-Defined Terms',
      subtitle: isTe ? 'పారదర్శక నిబంధనలు, హామీ లేని ఆదాయాలు' : 'Transparent terms, no guaranteed income',
      icon: AlertCircle,
      content: [
        isTe
          ? 'ప్రతి రిఫరల్ యొక్క అర్హత మరియు పరిహారం సంబంధిత సర్వీస్ ప్రొవైడర్ యొక్క ఆమోదించబడిన నిబంధనలపై మాత్రమే ఆధారపడి ఉంటాయి.'
          : 'A referral’s eligibility, qualification milestones, and compensation depend entirely on the relevant service provider’s approved terms.',
        isTe
          ? 'sBLOOM ఎటువంటి సార్వత్రిక లేదా హామీ ఆదాయాలను ప్రకటించదు. ఏ పరిహారమూ స్వయంచాలకంగా హామీ ఇవ్వబడదు.'
          : 'sBLOOM does not publish universal commission rates or promise guaranteed income. Terms are defined per service by the provider.',
        isTe
          ? 'రిఫరల్ సమర్పించే ముందు సంబంధిత ప్రొవైడర్ సేవా నిబంధనలను పరిశీలించండి.'
          : 'Always review the specific terms and verification criteria defined by the provider before introducing potential customers.',
      ],
      action: {
        label: isTe ? 'ప్రోగ్రామ్ నిబంధనలు' : 'Review Programme Terms',
        link: '/app/support',
      },
    },
  ]

  // Permission-First Introduction Scripts from copy-deck.md
  const sampleScripts = [
    {
      sector: isTe ? 'హెల్త్‌కేర్ పరిచయం' : 'Healthcare Introduction',
      icon: HeartPulse,
      accent: 'border-emerald-200 bg-emerald-50/50',
      textEn:
        '“You said your mother needs a doctor. I know a service that might help. Would you like me to connect you?”',
      textTe:
        '“మీ అమ్మగారికి డాక్టర్ అవసరమని చెప్పారు కదా. నాకు తెలిసిన మంచి సర్వీస్ ఉంది. నేను వారిని మీకు పరిచయం చేయమంటారా?”',
    },
    {
      sector: isTe ? 'విద్య పరిచయం' : 'Education Introduction',
      icon: GraduationCap,
      accent: 'border-blue-200 bg-blue-50/50',
      textEn:
        '“You mentioned you’re looking for a coaching institute. I can introduce you to an institute that offers relevant programmes. Would you like to know more?”',
      textTe:
        '“మీరు కోచింగ్ ఇన్‌స్టిట్యూట్ కోసం చూస్తున్నట్లు చెప్పారు. సంబంధిత కోర్సులు అందించే మంచి సంస్థను నేను మీకు పరిచయం చేయగలను. మరిన్ని వివరాలు తెలుసుకోవాలనుకుంటున్నారా?”',
    },
    {
      sector: isTe ? 'ప్రొఫెషనల్ సేవలు పరిచయం' : 'Professional Services Introduction',
      icon: Briefcase,
      accent: 'border-purple-200 bg-purple-50/50',
      textEn:
        '“I know a service provider who may be able to help. Would you like an introduction?”',
      textTe:
        '“మీ వ్యాపార అవసరాలకు సహాయపడే సర్వీస్ ప్రొవైడర్ నాకు తెలుసు. నేను మీకు పరిచయం చేయమంటారా?”',
    },
  ]

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* 1. Page Header & Identity */}
      <div className="bg-white rounded-3xl border border-[#E8E2D8] p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle Brand Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6B3CFF] via-[#0E0B1E] to-[#D6F36B]" />

        <div className="max-w-3xl space-y-3">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B3CFF]/10 text-[#6B3CFF] text-xs font-bold uppercase tracking-wider">
            <BookOpen size={13} />
            <span>{isTe ? 'భాగస్వామి ఎనేబుల్‌మెంట్ అకాడమీ' : 'Partner Enablement Academy'}</span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#0E0B1E] tracking-tight leading-tight m-0">
            {isTe
              ? 'మెరుగైన అనుసంధానాలు చేయడానికి మీకు సహాయపడే జ్ఞానం.'
              : 'Knowledge that helps you make better connections.'}
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#575266] leading-relaxed font-sans max-w-2xl pt-1">
            {isTe
              ? 'సర్వీసులను అర్థం చేసుకోండి, మీ సందేహాలపై స్పష్టత పొందండి మరియు అర్థవంతమైన పరిచయాలు చేయడానికి విశ్వాసాన్ని పెంపొందించుకోండి.'
              : 'Understand the services, get clarity on your questions, and build the confidence to make meaningful introductions.'}
          </p>

          <div className="pt-2 flex items-center gap-4 text-xs text-[#575266] font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#6B3CFF]" />
              {isTe ? 'నాలెడ్జ్ & ఎనేబుల్‌మెంట్ సెంటర్' : 'Knowledge & Enablement Centre'}
            </span>
            <span className="text-[#E8E2D8]">•</span>
            <span>{isTe ? '3 అధికారిక రంగాలు' : '3 Official Sectors'}</span>
            <span className="text-[#E8E2D8]">•</span>
            <span>{isTe ? 'అనుమతి ఆధారిత విధానం' : 'Permission-First Model'}</span>
          </div>
        </div>
      </div>

      {/* 2. Main Feature — Knowledge Augmentation (Visual Highlight) */}
      <KnowledgeCompanionSection lang={lang} />

      {/* 3. Three Official Service Sectors */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#0E0B1E] tracking-tight">
              {isTe ? 'మూడు అధికారిక సర్వీస్ రంగాలు' : 'Three Official Service Sectors'}
            </h2>
            <p className="text-xs sm:text-sm text-[#575266] mt-1">
              {isTe
                ? 'నాలెడ్జ్ సిస్టమ్ అందుబాటులోకి వచ్చాక అఫిలియేట్లు ఈ మూడు రంగాలలోని సేవలపై పూర్తి అవగాహన పొందవచ్చు.'
                : 'Through the knowledge system, affiliates will be able to explore and understand services across all three official sectors.'}
            </p>
          </div>
          <Link
            to="/app/services"
            className="text-xs font-bold text-[#6B3CFF] hover:underline flex items-center gap-1 shrink-0"
          >
            <span>{isTe ? 'అన్ని ప్రొవైడర్లను చూడండి' : 'Browse All Providers'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {officialSectors.map((sector) => {
            const Icon = sector.icon
            return (
              <Card
                key={sector.id}
                variant="surface"
                padding="p-6"
                className="flex flex-col justify-between border-[#E8E2D8] hover:border-[#6B3CFF]/40 transition-all group"
              >
                <div className="space-y-4">
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl ${sector.iconBg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${sector.badgeClass}`}>
                      {sector.badge}
                    </span>
                  </div>

                  {/* Title & Core Description */}
                  <div>
                    <h3 className="text-lg font-bold font-serif text-[#0E0B1E]">
                      {sector.title}
                    </h3>
                    <p className="text-xs text-[#575266] mt-2 leading-relaxed font-sans">
                      {sector.description}
                    </p>
                  </div>

                  {/* Knowledge Companion Capability Note */}
                  <div className="p-3.5 rounded-xl bg-white border border-[#E8E2D8] space-y-1.5">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6B3CFF]">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isTe ? 'నాలెడ్జ్ అసిస్టెంట్ సపోర్ట్' : 'Knowledge Companion Scope'}</span>
                    </div>
                    <p className="text-[11px] text-[#575266] leading-relaxed">
                      {sector.knowledgeCapability}
                    </p>
                  </div>
                </div>

                {/* Footer Provider Info & Directory CTA */}
                <div className="pt-4 mt-4 border-t border-[#E8E2D8]/70 flex items-center justify-between">
                  <div className="text-[11px] text-[#575266]">
                    {!loadingProviders && sector.providerCount > 0 ? (
                      <span className="font-semibold text-emerald-700">
                        {sector.providerCount} {isTe ? 'యాక్టివ్ ప్రొవైడర్లు' : 'active providers'}
                      </span>
                    ) : (
                      <span>{isTe ? 'ధృవీకరించబడిన ప్రొవైడర్లు' : 'Verified providers'}</span>
                    )}
                  </div>

                  <Link
                    to={sector.directoryLink}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#6B3CFF] hover:text-[#0E0B1E] transition-colors"
                  >
                    <span>{isTe ? 'ప్రొవైడర్లను చూడండి' : 'Explore'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Sector Terms Disclaimer */}
        <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8E2D8] flex items-center gap-2.5 text-xs text-[#575266]">
          <ShieldCheck className="w-4 h-4 text-[#6B3CFF] shrink-0" />
          <span>
            {isTe
              ? 'రిఫరల్ యొక్క అర్హత మరియు పరిహారం సంబంధిత ప్రొవైడర్ నిబంధనలపై ఆధారపడి ఉంటాయి. ఏ ఆదాయమూ హామీ ఇవ్వబడదు.'
              : 'A referral’s eligibility and compensation depend on the relevant provider’s terms. No income is guaranteed.'}
          </span>
        </div>
      </div>

      {/* 4. Useful Information Available Now (7 Expandable Modules) */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#0E0B1E] tracking-tight">
            {isTe ? 'ఇప్పుడే అందుబాటులో ఉన్న ముఖ్య సమాచారం' : 'Useful Information Available Now'}
          </h2>
          <p className="text-xs sm:text-sm text-[#575266] mt-1">
            {isTe
              ? 'నాలెడ్జ్ అసిస్టెంట్ అనుసంధానం అయ్యే వరకు, పోర్టల్ ఫీచర్లు మరియు రిఫరల్ ప్రక్రియను అర్థం చేసుకోవడానికి ఈ ప్రాథమిక వనరులను ఉపయోగించండి.'
              : 'Until Knowledge Augmentation is integrated, use these essential guides to navigate the portal, explore providers, and submit referrals.'}
          </p>
        </div>

        <div className="space-y-3">
          {currentGuides.map((guide) => {
            const Icon = guide.icon
            const isExpanded = expandedGuide === guide.id

            return (
              <div
                key={guide.id}
                className={`rounded-2xl border transition-all ${
                  isExpanded
                    ? 'bg-white border-[#6B3CFF]/40 shadow-sm'
                    : 'bg-[#F3ECE1]/70 border-[#E8E2D8] hover:bg-white'
                }`}
              >
                {/* Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => setExpandedGuide(isExpanded ? null : guide.id)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left cursor-pointer bg-transparent border-none"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isExpanded
                          ? 'bg-[#6B3CFF] text-white'
                          : 'bg-white text-[#575266] border border-[#E8E2D8]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#0E0B1E]">
                        {guide.title}
                      </h3>
                      <p className="text-xs text-[#575266] mt-0.5">{guide.subtitle}</p>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-white/60 flex items-center justify-center text-[#575266] shrink-0">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {/* Expanded Content Area */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-[#E8E2D8]/60 space-y-4">
                    <div className="space-y-2 mt-2">
                      {guide.content.map((point, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-[#12101F]">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{point}</span>
                        </div>
                      ))}
                    </div>

                    {/* Quick action button */}
                    {guide.action && (
                      <div className="pt-2">
                        {guide.action.link ? (
                          <Link to={guide.action.link}>
                            <Button size="sm" variant="outline" rightIcon={ArrowRight}>
                              {guide.action.label}
                            </Button>
                          </Link>
                        ) : (
                          <Button
                            size="sm"
                            variant="primary"
                            rightIcon={ArrowRight}
                            onClick={guide.action.onClick}
                          >
                            {guide.action.label}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 5. Permission-First Introduction Examples (from copy-deck.md) */}
      <Card padding="p-6 sm:p-8" variant="surface" className="border-[#E8E2D8] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#E8E2D8]">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#6B3CFF] uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{isTe ? 'అనుమతి ఆధారిత సంభాషణ' : 'Permission-First Introductions'}</span>
            </div>
            <h3 className="text-xl font-bold font-serif text-[#0E0B1E] mt-1">
              {isTe ? 'ఒక పరిచయం ఎలా ఉంటుంది?' : 'What an introduction sounds like'}
            </h3>
            <p className="text-xs text-[#575266] mt-0.5">
              {isTe
                ? 'ఒక స్నేహపూర్వక, అనుమతి ఆధారిత సందేశం సరిపోతుంది. వివరాలు పంపే ముందు స్పష్టమైన అంగీకారం పొందండి.'
                : 'A friendly, permission-first message is all it takes. Always get a clear yes before any details are shared.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sampleScripts.map((sample, idx) => {
            const Icon = sample.icon
            const currentText = isTe ? sample.textTe : sample.textEn
            const isCopied = copiedScript === `sample-${idx}`

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border ${sample.accent} flex flex-col justify-between space-y-3 bg-white`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0E0B1E] flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-[#6B3CFF]" />
                      {sample.sector}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyScript(`sample-${idx}`, currentText)}
                      className="text-xs text-[#6B3CFF] hover:text-[#0E0B1E] flex items-center gap-1 font-semibold cursor-pointer bg-transparent border-none p-1"
                      title="Copy script"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600">{isTe ? 'కాపీ చేయబడింది' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{isTe ? 'కాపీ' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-xs text-[#575266] leading-relaxed italic bg-[#FAF7F2] p-3 rounded-xl border border-[#E8E2D8]">
                    {currentText}
                  </p>
                </div>

                <div className="text-[11px] text-[#575266] font-medium pt-1">
                  {isTe
                    ? 'నియమం: వివరాలను షేర్ చేయడానికి ముందు స్పష్టమైన "అవును" సమ్మతి ఉండాలి.'
                    : 'The rule: A clear yes before any details are shared.'}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
