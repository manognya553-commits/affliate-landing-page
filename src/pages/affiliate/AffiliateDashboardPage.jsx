import React, { useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Table from '../../components/ui/Table'
import StatusBadge from '../../components/ui/StatusBadge'
import DemoDataNotice from '../../components/ui/DemoDataNotice'
import {
  Users,
  CheckCircle2,
  TrendingUp,
  Award,
  PlusCircle,
  Copy,
  Check,
  Building2,
  HeartPulse,
  GraduationCap,
  ArrowRight,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  Inbox,
  MessageSquare,
  Globe,
  SearchCheck,
} from 'lucide-react'

export default function AffiliateDashboardPage() {
  const { profile, user, refreshProfile, apiHealth } = useAuth()
  const { lang } = useLanguage()
  const outletContext = useOutletContext()

  const [copiedLink, setCopiedLink] = useState(false)
  const [verifyingEmail, setVerifyingEmail] = useState(false)
  const [metrics, setMetrics] = useState({
    active_referrals: 0,
    converted_introductions: 0,
    verified_pipeline: 0,
    performance_ratio: 0.0,
  })
  const [recentReferrals, setRecentReferrals] = useState([])
  const [loading, setLoading] = useState(true)

  const partnerId = `SBL-${(user?.id || '882199').slice(0, 8).toUpperCase()}`
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Partner'

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [metricsRes, referralsRes] = await Promise.all([
        api.getAffiliateMetrics(),
        api.getAffiliateReferrals(),
      ])
      if (metricsRes) setMetrics(metricsRes)
      if (Array.isArray(referralsRes)) setRecentReferrals(referralsRes.slice(0, 5))
    } catch (err) {
      console.error('Failed to load affiliate dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const copyPartnerLink = () => {
    const link = `${window.location.origin}/?ref=${partnerId}`
    navigator.clipboard.writeText(link)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2200)
  }

  const handleVerifyEmail = async () => {
    try {
      setVerifyingEmail(true)
      await api.verifySelf()
      await refreshProfile()
    } catch (err) {
      console.error('Verify email error:', err)
    } finally {
      setVerifyingEmail(false)
    }
  }

  const handleOpenReferralDrawer = (serviceName = null) => {
    if (outletContext?.openLeadDrawer) {
      outletContext.openLeadDrawer(serviceName)
    }
  }

  // Recent leads columns for Table
  const leadColumns = [
    {
      header: 'Reference ID',
      key: 'id',
      render: (item) => (
        <span className="font-mono font-bold text-xs text-[#12101F]">
          {item.reference_number || `SBL-${String(item.id || '').slice(0, 6).toUpperCase()}`}
        </span>
      ),
    },
    {
      header: 'Client / Business',
      key: 'client_name',
      render: (item) => (
        <div>
          <span className="font-semibold text-xs text-[#12101F] block">{item.client_name}</span>
          <span className="text-[11px] text-[#575266]">{item.client_city || 'Regional Client'}</span>
        </div>
      ),
    },
    {
      header: 'Sector',
      key: 'service_category',
      render: (item) => (
        <span className="text-xs capitalize font-medium text-[#575266]">
          {item.service_category || 'Healthcare'}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (item) => <StatusBadge status={item.status || 'Pending'} size="sm" />,
    },
    {
      header: 'Submission Date',
      key: 'created_at',
      render: (item) => (
        <span className="text-xs text-[#575266]">
          {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Today'}
        </span>
      ),
    },
  ]

  // Top 3 Promotional Catalog Highlights
  const catalogHighlights = [
    {
      id: 'srv-whatsapp',
      name: 'WhatsApp Automation',
      rate: '20% Commission',
      avg: 'Avg ₹18,500',
      icon: MessageSquare,
      color: 'bg-emerald-50 text-emerald-600',
      description: 'Official Meta Cloud API booking and inquiry automation for regional clinics & institutes.',
    },
    {
      id: 'srv-website',
      name: 'Website Building & Redesign',
      rate: '25% Commission',
      avg: 'Avg ₹24,000',
      icon: Globe,
      color: 'bg-indigo-50 text-indigo-600',
      description: 'Conversion-optimized responsive web development with sub-second page performance.',
    },
    {
      id: 'srv-seo',
      name: 'Search Engine Optimization (SEO)',
      rate: '20% Commission',
      avg: 'Avg ₹15,000',
      icon: SearchCheck,
      color: 'bg-purple-50 text-purple-600',
      description: 'Dominant local Google Maps 3-pack ranking for healthcare and regional businesses.',
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {/* 1. Hero Welcome Banner */}
      <div className="bg-white rounded-3xl border border-[#12101F]/10 p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6B3CFF] via-[#8E51FF] to-[#D6F36B]" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Approved Partner</span>
              <span className="text-[#12101F]/40 font-mono">| {partnerId}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#0E0B1E] tracking-tight leading-tight m-0">
              {lang === 'te' ? `స్వాగతం, ${displayName}!` : `Welcome, ${displayName}!`}
            </h1>

            <p className="text-sm sm:text-base text-[#575266] leading-relaxed max-w-2xl m-0">
              {lang === 'te'
                ? 'మీ అఫిలియేట్ డాష్‌బోర్డ్‌లో క్లయింట్ రిఫరల్స్, పైప్‌లైన్ మరియు కమీషన్ చెల్లింపుల పూర్తి వివరాలు ఇక్కడ ఉన్నాయి.'
                : 'Track your client referral introductions, deal progression, and accrued commission settlements with 60-day attribution lock.'}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="primary"
              size="md"
              leftIcon={PlusCircle}
              onClick={() => handleOpenReferralDrawer()}
            >
              + Refer a Client
            </Button>

            <Button
              variant="outline"
              size="md"
              leftIcon={copiedLink ? Check : Copy}
              onClick={copyPartnerLink}
            >
              {copiedLink ? 'Link Copied!' : 'Copy Partner Link'}
            </Button>
          </div>
        </div>
      </div>

      {/* Email Verification Banner if unverified */}
      {user && !user.email_verified_at && (
        <div className="bg-amber-50 border border-amber-300 rounded-3xl p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs sm:text-sm text-amber-950 shadow-sm animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
              <AlertCircle size={20} />
            </div>
            <div className="space-y-0.5">
              <span className="font-bold text-sm block text-amber-950">
                {lang === 'te' ? 'ఈమెయిల్ ధృవీకరణ అవసరం' : 'Email Verification Pending'}
              </span>
              <p className="text-amber-800 text-xs m-0 leading-relaxed">
                {lang === 'te'
                  ? `మీ ఖాతా ఈమెయిల్ (${user.email}) ఇంకా ధృవీకరించబడలేదు. రిఫరల్స్ సమర్పించడానికి మీ ఈమెయిల్‌ను ధృవీకరించండి.`
                  : `Your account email (${user.email}) is pending confirmation. Verify in 1 click to unlock deal introductions.`}
              </p>
            </div>
          </div>
          <Button
            variant="lime"
            size="sm"
            isLoading={verifyingEmail}
            onClick={handleVerifyEmail}
          >
            Verify Email Now
          </Button>
        </div>
      )}

      {/* 2. Four Key Statistical Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Pipeline Volume */}
        <Card padding="p-5" variant="surface" className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#575266] uppercase tracking-wider">
              Total Pipeline Volume
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#6B3CFF] flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-serif font-bold text-[#0E0B1E]">
              {loading ? '—' : `₹${(metrics.verified_pipeline || 0).toLocaleString('en-IN')}`}
            </div>
            <p className="text-[11px] text-[#575266] m-0">
              Active verified deals in progress
            </p>
          </div>
        </Card>

        {/* Card 2: Active Leads */}
        <Card padding="p-5" variant="surface" className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#575266] uppercase tracking-wider">
              Active Referral Leads
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-serif font-bold text-[#0E0B1E]">
              {loading ? '—' : metrics.active_referrals || 0}
            </div>
            <p className="text-[11px] text-[#575266] m-0">
              Pending & Qualified client accounts
            </p>
          </div>
        </Card>

        {/* Card 3: Converted Deals */}
        <Card padding="p-5" variant="surface" className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#575266] uppercase tracking-wider">
              Converted Deals
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-serif font-bold text-[#0E0B1E]">
              {loading ? '—' : metrics.converted_introductions || 0}
            </div>
            <p className="text-[11px] text-[#575266] m-0">
              Closed service agreements
            </p>
          </div>
        </Card>

        {/* Card 4: Estimated Accrued Commission */}
        <Card padding="p-5" variant="surface" className="flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#575266] uppercase tracking-wider">
              Accrued Commission
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#D6F36B]/40 text-[#0E0B1E] flex items-center justify-center">
              <Award size={16} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-serif font-bold text-[#6B3CFF]">
              {loading
                ? '—'
                : `₹${(Math.round((metrics.verified_pipeline || 0) * 0.2)).toLocaleString('en-IN')}`}
            </div>
            <p className="text-[11px] text-[#575266] m-0">
              Settlement on 10th of following month
            </p>
          </div>
        </Card>
      </div>

      {/* 3. Catalog Highlights: Top 3 Services */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#12101F]">
              Promotional Catalog Highlights
            </h2>
            <p className="text-xs text-[#575266]">
              Top 3 verified services for rapid South Indian client referral.
            </p>
          </div>

          <Link to="/app/services">
            <Button variant="ghost" size="sm" rightIcon={ArrowRight}>
              View All 5 Services
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {catalogHighlights.map((srv) => {
            const Icon = srv.icon
            return (
              <Card
                key={srv.id}
                padding="p-6"
                variant="surface"
                hoverable
                className="flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${srv.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#6B3CFF] text-white">
                      {srv.rate}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#12101F] leading-snug">
                    {srv.name}
                  </h3>
                  <p className="text-xs text-[#575266] mt-1.5 leading-relaxed">
                    {srv.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E8E2D8] mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#12101F]">{srv.avg}</span>
                  <Button
                    size="sm"
                    variant="primary"
                    rightIcon={ArrowRight}
                    onClick={() => handleOpenReferralDrawer(srv.name)}
                  >
                    Refer Deal
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {/* 4. Recent Referral Leads Table & Honest Empty State */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-serif text-[#12101F]">
              Recent Referral Leads
            </h2>
            <p className="text-xs text-[#575266]">
              Your most recent enterprise introductions and discovery statuses.
            </p>
          </div>

          <Link to="/app/leads">
            <Button variant="outline" size="sm" rightIcon={ArrowRight}>
              View Full Pipeline
            </Button>
          </Link>
        </div>

        {recentReferrals.length === 0 && !loading ? (
          <Card padding="p-12" variant="surface" className="text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#6B3CFF]/10 text-[#6B3CFF] flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold font-serif text-[#12101F]">
              No referral leads registered yet
            </h3>
            <p className="text-xs text-[#575266] max-w-md mx-auto mt-1 mb-6 leading-relaxed">
              Submit your first enterprise client deal using the Lead Drawer. Attribution is locked to your partner code for 60 days.
            </p>
            <Button
              variant="primary"
              size="md"
              leftIcon={PlusCircle}
              onClick={() => handleOpenReferralDrawer()}
            >
              Refer Your First Client
            </Button>
          </Card>
        ) : (
          <Table
            columns={leadColumns}
            data={recentReferrals}
            emptyMessage="No referral leads registered yet."
          />
        )}
      </div>

      <DemoDataNotice />
    </div>
  )
}
