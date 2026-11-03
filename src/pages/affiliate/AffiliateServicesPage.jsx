import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import {
  Search,
  Filter,
  MessageSquare,
  Globe,
  TrendingUp,
  SearchCheck,
  Share2,
  Calculator,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Building2,
  Check,
  Layers,
} from 'lucide-react'

export default function AffiliateServicesPage() {
  const { lang } = useLanguage()
  const { user } = useAuth()
  const outletContext = useOutletContext()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Calculator State
  const [calcServiceId, setCalcServiceId] = useState('whatsapp')
  const [calcVolume, setCalcVolume] = useState(3)

  // 5 Verified Promotional Services from 02-frontend-design.md
  const servicesCatalog = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Automation',
      tagline: 'Official Meta WhatsApp Cloud API Integration',
      category: 'healthcare',
      icon: MessageSquare,
      iconColor: 'bg-emerald-50 text-emerald-600',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      commissionRate: '20%',
      avgPayout: '₹18,500',
      avgContract: '₹92,500',
      numericAvgPayout: 18500,
      cookieDuration: '60 Days',
      description:
        'End-to-end appointment automation, instant fee inquiries, patient triage, and multi-agent customer support for healthcare clinics, diagnostics centers, and education academies.',
      features: [
        'Official Meta Cloud API & Green Tick verification support',
        '24/7 automated booking and consultation slot confirmation',
        'Multi-agent shared team inbox across clinic branches',
        'Automated appointment reminders eliminating no-shows',
      ],
      targetSectors: ['Healthcare', 'Education', 'Professional Services'],
    },
    {
      id: 'website',
      name: 'Website Building & Redesign',
      tagline: 'High-Performance Conversion-Optimized Responsive Web',
      category: 'professional',
      icon: Globe,
      iconColor: 'bg-indigo-50 text-indigo-600',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      commissionRate: '25%',
      avgPayout: '₹24,000',
      avgContract: '₹96,000',
      numericAvgPayout: 24000,
      cookieDuration: '60 Days',
      description:
        'Bespoke web applications and redesigns built desktop-first at 1440px with sub-second page loads, mobile responsiveness, and regional bilingual language support.',
      features: [
        'Sub-second page speeds with Core Web Vitals optimization',
        'Bilingual English & Telugu regional interface options',
        'Integrated lead capture forms and WhatsApp click-to-chat',
        'Enterprise security and SSL certificate included',
      ],
      targetSectors: ['All Sectors', 'Hospitals', 'Consultancies'],
    },
    {
      id: 'seo',
      name: 'Search Engine Optimization (SEO)',
      tagline: 'Dominant Local Google Maps & Regional Search Ranking',
      category: 'healthcare',
      icon: SearchCheck,
      iconColor: 'bg-purple-50 text-purple-600',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      commissionRate: '20%',
      avgPayout: '₹15,000',
      avgContract: '₹75,000',
      numericAvgPayout: 15000,
      cookieDuration: '60 Days',
      description:
        'Local SEO mastery for clinics, diagnostic centers, and regional academies to capture high-intent patients and students searching on Google in their district.',
      features: [
        'Google Business Profile (GBP) top 3 map-pack dominance',
        'Local citation building and patient review acquisition strategy',
        'Technical on-page schema markup and doctor profile indexing',
        'Monthly organic search ranking and caller attribution report',
      ],
      targetSectors: ['Healthcare', 'Local Retail', 'Education'],
    },
    {
      id: 'google-ads',
      name: 'Google Ads & Search PPC',
      tagline: 'High-Intent Search & Remarketing Campaign Management',
      category: 'education',
      icon: TrendingUp,
      iconColor: 'bg-blue-50 text-blue-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      commissionRate: '15%',
      avgPayout: '₹12,000',
      avgContract: '₹80,000',
      numericAvgPayout: 12000,
      cookieDuration: '60 Days',
      description:
        'Laser-targeted Google search ads bidding on exact intent keywords (e.g. "pediatrician near me", "best NEET coaching in Hyderabad") with negative keyword sculpting.',
      features: [
        'High-intent search keyword discovery & competitor analysis',
        'Strict negative-keyword filtering to eliminate wasted ad spend',
        'Conversion tracking integrated with client phone lines and WhatsApp',
        'Dedicated landing page A/B testing for maximum lead volume',
      ],
      targetSectors: ['Education', 'Healthcare', 'Financial Advisory'],
    },
    {
      id: 'meta-ads',
      name: 'Meta Ads & Social Funnels',
      tagline: 'Hyper-Targeted Patient & Student Acquisition Funnels',
      category: 'education',
      icon: Share2,
      iconColor: 'bg-rose-50 text-rose-600',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      commissionRate: '15%',
      avgPayout: '₹10,500',
      avgContract: '₹70,000',
      numericAvgPayout: 10500,
      cookieDuration: '60 Days',
      description:
        'High-converting video and carousel ads across Instagram & Facebook targeting specific demographic radiuses, parents, and prospective students.',
      features: [
        'Geo-fenced radius targeting around clinics and campuses',
        'Native Instant Lead forms connected directly to client CRM',
        'Creative copywriting tailored in English and Telugu',
        'Retargeting funnels for website and Instagram profile visitors',
      ],
      targetSectors: ['Education', 'Cosmetic Clinics', 'Lifestyle Brands'],
    },
  ]

  // Filter logic
  const filteredServices = servicesCatalog.filter((srv) => {
    const matchesCat =
      selectedCategory === 'all' ||
      srv.category === selectedCategory ||
      srv.targetSectors.some((s) => s.toLowerCase().includes(selectedCategory.toLowerCase()))

    const matchesQuery =
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.tagline.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCat && matchesQuery
  })

  // Calculator computations
  const currentCalcService =
    servicesCatalog.find((s) => s.id === calcServiceId) || servicesCatalog[0]
  const grossEstimate = currentCalcService.numericAvgPayout * calcVolume
  const tdsDeduction = grossEstimate * 0.05 // Statutory Section 194H 5% TDS
  const netEstimate = grossEstimate - tdsDeduction

  const handleReferService = (serviceName) => {
    if (outletContext?.openLeadDrawer) {
      outletContext.openLeadDrawer(serviceName)
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Header Hero Banner */}
      <div className="bg-white rounded-3xl border border-[#12101F]/10 p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6B3CFF] via-[#FF4FA3] to-[#D6F36B]" />

        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B3CFF]/10 text-[#6B3CFF] text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>{lang === 'te' ? 'ఆమోదించబడిన సర్వీసెస్ కేటలాగ్' : 'Verified Promotional Catalog'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0E0B1E] tracking-tight leading-tight m-0">
            {lang === 'te' ? 'ప్రమోషనల్ సర్వీసెస్ & కమీషన్ రేట్లు' : 'Promotional Services Catalog'}
          </h1>

          <p className="text-sm sm:text-base text-[#575266] leading-relaxed m-0">
            {lang === 'te'
              ? 'దక్షిణ భారతదేశంలోని క్లినిక్‌లు, ఇన్‌స్టిట్యూట్‌లు మరియు వ్యాపారాల కోసం అత్యున్నత విలువ కలిగిన 5 డిజిటల్ సొల్యూషన్స్‌ను రిఫర్ చేయండి.'
              : 'Refer verified high-ticket digital growth services across South India. Earn 15% – 25% transparent commission with 60-day attribution lock.'}
          </p>
        </div>
      </div>

      {/* 2. Interactive Commission Calculator Widget */}
      <Card padding="p-6 md:p-8" variant="surface" className="border-2 border-[#6B3CFF]/20 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#E8E2D8]">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#6B3CFF]">
              <Calculator className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Interactive Commission Calculator
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#12101F]">
              Estimate Your Monthly Partner Earnings
            </h2>
            <p className="text-xs text-[#575266]">
              Select a promotional service and your expected client introductions per month.
            </p>
          </div>

          {/* Service Selector & Slider */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div>
              <label className="text-[11px] font-semibold text-[#575266] block mb-1">
                Select Service
              </label>
              <select
                value={calcServiceId}
                onChange={(e) => setCalcServiceId(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-[#E8E2D8] bg-white text-xs font-semibold text-[#12101F] outline-none focus:ring-2 focus:ring-[#6B3CFF]"
              >
                {servicesCatalog.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.commissionRate})
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:w-48">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-[#575266]">
                  Closed Deals / Month
                </label>
                <span className="text-xs font-bold text-[#6B3CFF]">{calcVolume}</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={calcVolume}
                onChange={(e) => setCalcVolume(parseInt(e.target.value, 10))}
                className="w-full accent-[#6B3CFF] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Real-time Calculation Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-white/70 border border-[#E8E2D8]">
            <span className="text-xs text-[#575266] block">Gross Commission</span>
            <span className="text-2xl font-bold font-serif text-[#12101F] block mt-1">
              ₹{grossEstimate.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-[#575266] block mt-0.5">
              Based on {calcVolume} deals at {currentCalcService.commissionRate}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white/70 border border-[#E8E2D8]">
            <span className="text-xs text-[#575266] block">Section 194H TDS (5%)</span>
            <span className="text-2xl font-bold font-serif text-rose-600 block mt-1">
              -₹{tdsDeduction.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-[#575266] block mt-0.5">
              Statutory tax deposited to your PAN
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#6B3CFF]/10 border border-[#6B3CFF]/30">
            <span className="text-xs font-bold text-[#6B3CFF] block uppercase tracking-wider">
              Net Monthly Payout
            </span>
            <span className="text-2xl sm:text-3xl font-bold font-serif text-[#6B3CFF] block mt-1">
              ₹{netEstimate.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-[#12101F]/80 block mt-0.5">
              Disbursed on 10th of following month
            </span>
          </div>
        </div>
      </Card>

      {/* 3. Search and Category Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Services' },
            { id: 'healthcare', label: 'Healthcare & Clinics' },
            { id: 'education', label: 'Education & Academies' },
            { id: 'professional', label: 'Professional Services' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                selectedCategory === cat.id
                  ? 'bg-[#12101F] text-white border-[#12101F] shadow-xs'
                  : 'bg-white text-[#575266] border-[#E8E2D8] hover:border-[#12101F]/30 hover:text-[#12101F]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#575266]" />
          <input
            type="text"
            placeholder="Search services or features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E8E2D8] bg-white text-xs text-[#12101F] placeholder-[#575266]/60 outline-none focus:ring-2 focus:ring-[#6B3CFF]"
          />
        </div>
      </div>

      {/* 4. 5 Verified Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((srv) => {
          const Icon = srv.icon
          return (
            <Card
              key={srv.id}
              padding="p-6"
              variant="surface"
              hoverable
              className="flex flex-col justify-between border-[#E8E2D8] relative group"
            >
              <div>
                {/* Header Icon + Commission Pill */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${srv.iconColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-[#6B3CFF] text-white shadow-xs">
                      {srv.commissionRate} Commission
                    </span>
                    <span className="block text-[11px] text-[#575266] font-medium mt-0.5">
                      Avg: {srv.avgPayout}
                    </span>
                  </div>
                </div>

                {/* Title & Tagline */}
                <h3 className="text-lg font-bold font-serif text-[#12101F] leading-snug">
                  {srv.name}
                </h3>
                <p className="text-xs font-semibold text-[#6B3CFF] mt-0.5 mb-2.5">
                  {srv.tagline}
                </p>
                <p className="text-xs text-[#575266] leading-relaxed mb-4">
                  {srv.description}
                </p>

                {/* Feature Bullets */}
                <div className="space-y-1.5 pt-3 border-t border-[#E8E2D8] mb-5">
                  {srv.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#12101F]">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-[11px] leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Metadata & Submit Action */}
              <div className="pt-4 border-t border-[#E8E2D8] space-y-3">
                <div className="flex items-center justify-between text-[11px] text-[#575266]">
                  <span>Attribution Lock: <strong className="text-[#12101F]">{srv.cookieDuration}</strong></span>
                  <span>Avg Contract: <strong className="text-[#12101F]">{srv.avgContract}</strong></span>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  rightIcon={ArrowRight}
                  onClick={() => handleReferService(srv.name)}
                >
                  Submit Lead for this Service
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredServices.length === 0 && (
        <div className="py-12 text-center text-[#575266]">
          <p className="text-sm">No services found matching your filter criteria.</p>
        </div>
      )}
    </div>
  )
}
