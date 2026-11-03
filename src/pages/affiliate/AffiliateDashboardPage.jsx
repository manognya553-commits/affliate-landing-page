import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import { getPortalText } from '../../i18n/portalTranslations'
import {
  Users,
  CheckCircle2,
  TrendingUp,
  Award,
  PlusCircle,
  Copy,
  Check,
  Building2,
  GraduationCap,
  HeartPulse,
  ArrowRight,
  ShieldAlert,
  X,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react'

export default function AffiliateDashboardPage() {
  const { profile, user, refreshProfile } = useAuth()
  const { lang } = useLanguage()

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSector, setSelectedSector] = useState('healthcare')
  const [copiedLink, setCopiedLink] = useState(false)
  const [verifyingEmail, setVerifyingEmail] = useState(false)

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

  // Live metrics and recent referrals state
  const [metrics, setMetrics] = useState({
    active_referrals: 0,
    converted_introductions: 0,
    verified_pipeline: 0,
    performance_ratio: 0.0,
  })
  const [recentReferrals, setRecentReferrals] = useState([])
  const [loading, setLoading] = useState(true)

  // Referral form state inside modal
  const [clientName, setClientName] = useState('')
  const [clientMobile, setClientMobile] = useState('')
  const [clientCity, setClientCity] = useState('')
  const [clientNeed, setClientNeed] = useState('')
  const [consentGiven, setConsentGiven] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

  const t = (path) => getPortalText(lang, path)

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Partner'
  const partnerId = `SBL-${(user?.id || '882199').slice(0, 8).toUpperCase()}`

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

  const handleOpenModal = (sector = 'healthcare') => {
    setSelectedSector(sector)
    setSubmitError('')
    setSubmitSuccess('')
    setModalOpen(true)
  }

  const handleSubmitReferral = async (e) => {
    e.preventDefault()
    if (!consentGiven) {
      setSubmitError(
        lang === 'te'
          ? 'క్లయింట్ స్పష్టమైన అనుమతిని తప్పనిసరిగా నిర్ధారించాలి.'
          : 'You must confirm that the client gave explicit permission.'
      )
      return
    }

    try {
      setSubmitting(true)
      setSubmitError('')
      setSubmitSuccess('')

      await api.submitAffiliateReferral({
        client_name: clientName.trim(),
        client_mobile: clientMobile.trim(),
        client_city: clientCity.trim(),
        service_category: selectedSector,
        context_note: clientNeed.trim(),
        consent_confirmed: true,
      })

      setSubmitSuccess(
        lang === 'te'
          ? 'రిఫరల్ విజయవంతంగా సమర్పించబడింది!'
          : 'Referral submitted successfully to the pipeline.'
      )

      setClientName('')
      setClientMobile('')
      setClientCity('')
      setClientNeed('')
      setConsentGiven(false)

      await loadDashboardData()

      setTimeout(() => {
        setModalOpen(false)
        setSubmitSuccess('')
      }, 1500)
    } catch (err) {
      console.error('Submission failed:', err)
      setSubmitError(err.message || 'Failed to submit referral.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Elegant Welcome Hero Banner */}
      <div className="bg-white rounded-3xl border border-[#12101F]/10 p-8 md:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle accent border */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6B3CFF] via-[#8E51FF] to-[#D6F36B]" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('shell.topbar.statusApproved')}</span>
              <span className="text-[#12101F]/40 font-mono">| {partnerId}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#0E0B1E] tracking-tight leading-tight m-0">
              {lang === 'te'
                ? `స్వాగతం, ${displayName}!`
                : `Welcome, ${displayName}!`}
            </h1>

            <p className="text-sm sm:text-base text-[#575266] leading-relaxed max-w-2xl m-0">
              {t('dashboard.heroSubtitle')}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenModal('healthcare')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#6B3CFF] hover:bg-[#582CD6] text-white font-bold text-sm shadow-md shadow-[#6B3CFF]/25 hover:shadow-lg transition-all cursor-pointer border-none"
            >
              <PlusCircle size={18} />
              <span>{t('dashboard.submitReferralBtn')}</span>
            </button>

            <button
              type="button"
              onClick={copyPartnerLink}
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-white border border-[#12101F]/15 hover:bg-black/5 text-[#0E0B1E] font-semibold text-sm transition-all cursor-pointer shadow-2xs"
            >
              {copiedLink ? (
                <>
                  <Check size={16} className="text-emerald-600" />
                  <span className="text-emerald-700 font-bold">{t('shell.topbar.linkCopied')}</span>
                </>
              ) : (
                <>
                  <Copy size={16} className="text-[#6B3CFF]" />
                  <span>{t('dashboard.copyPartnerLinkBtn')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Email Verification Pending Banner if unverified */}
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
                  : `Your account email (${user.email}) is not yet verified. Please verify your email to unlock client referral submissions.`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleVerifyEmail}
            disabled={verifyingEmail}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shrink-0 shadow-xs cursor-pointer border-none disabled:opacity-60"
          >
            <span>{verifyingEmail ? (lang === 'te' ? 'ధృవీకరిస్తోంది...' : 'Verifying...') : (lang === 'te' ? 'ఇప్పుడే ధృవీకరించండి' : 'Verify Email Now')}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* 2. Four Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Active Referrals */}
        <div className="bg-white rounded-2xl border border-[#12101F]/10 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#575266] uppercase tracking-wider">
              {t('dashboard.metrics.activeReferrals')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#6B3CFF] flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-serif font-bold text-[#0E0B1E]">
              {loading ? '—' : metrics.active_referrals || 0}
            </div>
            <p className="text-[11px] text-[#575266] m-0">
              {metrics.active_referrals > 0
                ? `${metrics.active_referrals} ${lang === 'te' ? 'క్రియాశీల రిఫరల్స్' : 'active submissions'}`
                : t('dashboard.metrics.zeroDesc')}
            </p>
          </div>
        </div>

        {/* Card 2: Converted Introductions */}
        <div className="bg-white rounded-2xl border border-[#12101F]/10 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#575266] uppercase tracking-wider">
              {t('dashboard.metrics.convertedIntroductions')}
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
              {lang === 'te' ? 'సేవ పూర్తయిన క్లయింట్లు' : 'Verified completed engagements'}
            </p>
          </div>
        </div>

        {/* Card 3: Verified Pipeline */}
        <div className="bg-white rounded-2xl border border-[#12101F]/10 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#575266] uppercase tracking-wider">
              {t('dashboard.metrics.verifiedPipeline')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-serif font-bold text-[#0E0B1E]">
              {loading ? '—' : metrics.verified_pipeline || 0}
            </div>
            <p className="text-[11px] text-amber-800 m-0">
              {lang === 'te' ? 'ధృవీకరించబడిన దశలో ఉన్నవి' : 'In active provider follow-up'}
            </p>
          </div>
        </div>

        {/* Card 4: Performance Ratio */}
        <div className="bg-white rounded-2xl border border-[#12101F]/10 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-[#575266] uppercase tracking-wider">
              {t('dashboard.metrics.performanceRatio')}
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Award size={16} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-serif font-bold text-[#0E0B1E]">
              {loading ? '—' : `${metrics.performance_ratio || 0}%`}
            </div>
            <p className="text-[11px] text-[#575266] m-0">
              {t('dashboard.metrics.standardTier')}
            </p>
          </div>
        </div>
      </div>

      {/* 2b. Detailed Referral Status Breakdown */}
      <div className="bg-white rounded-2xl border border-[#12101F]/10 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0E0B1E] m-0">
              {lang === 'te' ? 'రిఫరల్ స్థితి వివరాలు' : 'Live Referral Pipeline Breakdown'}
            </h3>
            <p className="text-[11px] text-[#575266] m-0 mt-0.5">
              {lang === 'te'
                ? `మొత్తం సమర్పించిన రిఫరల్స్: ${metrics.total_referrals || 0}`
                : `Total pipeline submissions: ${metrics.total_referrals || 0}`}
            </p>
          </div>
          <Link
            to="/app/leads"
            className="text-xs font-bold text-[#6B3CFF] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{lang === 'te' ? 'వివరమైన జాబితా →' : 'View all leads →'}</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#12101F]/5">
            <span className="text-[10px] uppercase font-bold text-[#575266] block">
              {lang === 'te' ? 'పెండింగ్' : 'Pending'}
            </span>
            <span className="text-xl font-serif font-bold text-[#0E0B1E] block mt-1">
              {loading ? '—' : metrics.pending_referrals || 0}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
            <span className="text-[10px] uppercase font-bold text-blue-800 block">
              {lang === 'te' ? 'సంప్రదించారు' : 'Contacted'}
            </span>
            <span className="text-xl font-serif font-bold text-blue-950 block mt-1">
              {loading ? '—' : metrics.contacted_referrals || 0}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">
              {lang === 'te' ? 'అర్హత సాధించినవి' : 'Qualified'}
            </span>
            <span className="text-xl font-serif font-bold text-amber-950 block mt-1">
              {loading ? '—' : metrics.qualified_referrals || 0}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">
              {lang === 'te' ? 'మార్పిడి చెందినవి' : 'Converted'}
            </span>
            <span className="text-xl font-serif font-bold text-emerald-950 block mt-1">
              {loading ? '—' : metrics.converted_referrals || 0}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100">
            <span className="text-[10px] uppercase font-bold text-rose-800 block">
              {lang === 'te' ? 'తిరస్కరించబడినవి' : 'Rejected'}
            </span>
            <span className="text-xl font-serif font-bold text-rose-950 block mt-1">
              {loading ? '—' : metrics.rejected_referrals || 0}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Recent Partner Referral Submissions Table */}
      <div className="bg-white rounded-3xl border border-[#12101F]/10 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 mb-5 border-b border-[#12101F]/10 gap-3">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#0E0B1E] m-0">
              {t('dashboard.recentSubmissionsTitle')}
            </h2>
            <p className="text-xs text-[#575266] mt-0.5 m-0">
              {t('dashboard.recentSubmissionsSubtitle')}
            </p>
          </div>
          <Link
            to="/app/leads"
            className="text-xs font-bold text-[#6B3CFF] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{lang === 'te' ? 'అన్ని లీడ్స్ చూడండి' : 'View all referrals'}</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Table / Empty State */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#12101F]/10 text-[11px] font-bold uppercase tracking-wider text-[#575266]">
                <th className="py-3 px-4">{t('dashboard.colClient')}</th>
                <th className="py-3 px-4">{t('dashboard.colCategory')}</th>
                <th className="py-3 px-4">{t('dashboard.colDate')}</th>
                <th className="py-3 px-4">{t('dashboard.colStatus')}</th>
                <th className="py-3 px-4 text-right">{t('dashboard.colActions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#12101F]/5 text-xs text-[#0E0B1E]">
              {recentReferrals.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 px-4 text-center">
                    <div className="max-w-md mx-auto flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] border border-[#12101F]/10 flex items-center justify-center text-[#575266]">
                        <FileText size={22} />
                      </div>
                      <p className="text-sm font-bold text-[#0E0B1E] m-0">
                        {t('dashboard.noSubmissions')}
                      </p>
                      <p className="text-xs text-[#575266] m-0 leading-relaxed">
                        {t('dashboard.noSubmissionsDesc')}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleOpenModal('healthcare')}
                        className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#582CD6] transition-colors cursor-pointer border-none"
                      >
                        <PlusCircle size={14} />
                        <span>{t('dashboard.submitReferralBtn')}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                recentReferrals.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-sm text-[#0E0B1E]">{item.client_name}</div>
                      <div className="text-[11px] text-[#575266]">{item.client_city}</div>
                    </td>
                    <td className="py-3.5 px-4 capitalize font-medium text-[#6B3CFF]">
                      {item.service_category}
                    </td>
                    <td className="py-3.5 px-4 text-[#575266]">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize bg-purple-50 text-[#6B3CFF] border border-purple-200">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/app/leads"
                        className="text-xs font-bold text-[#6B3CFF] hover:underline"
                      >
                        {lang === 'te' ? 'పైప్‌లైన్ చూడండి' : 'View Pipeline'}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Top Services Ready for Introduction (3 Approved Sectors) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0E0B1E] m-0">
              {t('dashboard.servicesSectionTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-[#575266] mt-0.5 m-0">
              {t('dashboard.servicesSectionSubtitle')}
            </p>
          </div>
          <Link
            to="/app/services"
            className="text-xs font-bold text-[#6B3CFF] hover:underline inline-flex items-center gap-1"
          >
            <span>{lang === 'te' ? 'పూర్తి క్యాటలాగ్ చూడండి' : 'Browse full directory'}</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Sector 1: Healthcare */}
          <div className="bg-white rounded-3xl border border-[#12101F]/10 p-6 shadow-sm flex flex-col justify-between hover:border-[#6B3CFF]/40 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {t('services.badgeHealthcare')}
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <HeartPulse size={18} />
                </div>
              </div>

              <h3 className="font-serif text-lg font-bold text-[#0E0B1E] m-0">
                {t('services.healthcareTitle')}
              </h3>

              <p className="text-xs text-[#575266] leading-relaxed m-0">
                {t('services.healthcareDesc')}
              </p>

              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#12101F]/5 text-[11px] space-y-1">
                <span className="font-bold text-[#0E0B1E] block">
                  {lang === 'te' ? 'అర్హత షరతులు:' : 'Eligibility Conditions:'}
                </span>
                <span className="text-[#575266] block leading-normal">
                  {t('services.healthcareCriteria')}
                </span>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[#12101F]/10 flex items-center justify-between">
              <span className="text-[11px] text-[#575266]">
                {lang === 'te' ? 'ప్రొవైడర్ నిబంధనలు' : 'Provider terms apply'}
              </span>
              <button
                type="button"
                onClick={() => handleOpenModal('healthcare')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#6B3CFF] hover:underline cursor-pointer bg-transparent border-none p-0"
              >
                <span>{t('services.introduceBtn')}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Sector 2: Education */}
          <div className="bg-white rounded-3xl border border-[#12101F]/10 p-6 shadow-sm flex flex-col justify-between hover:border-[#6B3CFF]/40 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {t('services.badgeEducation')}
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <GraduationCap size={18} />
                </div>
              </div>

              <h3 className="font-serif text-lg font-bold text-[#0E0B1E] m-0">
                {t('services.educationTitle')}
              </h3>

              <p className="text-xs text-[#575266] leading-relaxed m-0">
                {t('services.educationDesc')}
              </p>

              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#12101F]/5 text-[11px] space-y-1">
                <span className="font-bold text-[#0E0B1E] block">
                  {lang === 'te' ? 'అర్హత షరతులు:' : 'Eligibility Conditions:'}
                </span>
                <span className="text-[#575266] block leading-normal">
                  {t('services.educationCriteria')}
                </span>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[#12101F]/10 flex items-center justify-between">
              <span className="text-[11px] text-[#575266]">
                {lang === 'te' ? 'ప్రొవైడర్ నిబంధనలు' : 'Provider terms apply'}
              </span>
              <button
                type="button"
                onClick={() => handleOpenModal('education')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#6B3CFF] hover:underline cursor-pointer bg-transparent border-none p-0"
              >
                <span>{t('services.introduceBtn')}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Sector 3: Professional Services */}
          <div className="bg-white rounded-3xl border border-[#12101F]/10 p-6 shadow-sm flex flex-col justify-between hover:border-[#6B3CFF]/40 transition-all">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-[#6B3CFF] border border-purple-200">
                  {t('services.badgeProfessional')}
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#6B3CFF] flex items-center justify-center">
                  <Building2 size={18} />
                </div>
              </div>

              <h3 className="font-serif text-lg font-bold text-[#0E0B1E] m-0">
                {t('services.professionalTitle')}
              </h3>

              <p className="text-xs text-[#575266] leading-relaxed m-0">
                {t('services.professionalDesc')}
              </p>

              <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#12101F]/5 text-[11px] space-y-1">
                <span className="font-bold text-[#0E0B1E] block">
                  {lang === 'te' ? 'అర్హత షరతులు:' : 'Eligibility Conditions:'}
                </span>
                <span className="text-[#575266] block leading-normal">
                  {t('services.professionalCriteria')}
                </span>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[#12101F]/10 flex items-center justify-between">
              <span className="text-[11px] text-[#575266]">
                {lang === 'te' ? 'ప్రొవైడర్ నిబంధనలు' : 'Provider terms apply'}
              </span>
              <button
                type="button"
                onClick={() => handleOpenModal('professional')}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#6B3CFF] hover:underline cursor-pointer bg-transparent border-none p-0"
              >
                <span>{t('services.introduceBtn')}</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Submit Referral Modal with Permission Principle & Real Integration Status */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-black/10 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#12101F]/60 hover:text-[#12101F] hover:bg-black/5 transition-colors cursor-pointer border-none bg-transparent"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="space-y-1.5 pb-5 mb-5 border-b border-[#12101F]/10">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B3CFF] uppercase tracking-wider">
                <Sparkles size={13} />
                <span>sBLOOM Referral Gateway</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[#0E0B1E] m-0">
                {t('referrals.modalTitle')}
              </h2>
            </div>

            {/* Ask First Consent Alert */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 mb-5">
              <ShieldAlert size={18} className="text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">{t('referrals.consentNoticeTitle')}</span>
                <span className="text-amber-800 leading-relaxed block">{t('referrals.consentNoticeDesc')}</span>
              </div>
            </div>

            {/* Submission Form */}
            <form onSubmit={handleSubmitReferral} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0E0B1E] mb-1">
                  {t('referrals.clientName')} *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder={t('referrals.clientNamePlaceholder')}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/50 text-sm text-[#0E0B1E] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] box-border"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E0B1E] mb-1">
                    {t('referrals.clientMobile')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientMobile}
                    onChange={(e) => setClientMobile(e.target.value)}
                    placeholder={t('referrals.clientMobilePlaceholder')}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/50 text-sm text-[#0E0B1E] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] box-border"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E0B1E] mb-1">
                    {t('referrals.clientCity')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                    placeholder={t('referrals.clientCityPlaceholder')}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/50 text-sm text-[#0E0B1E] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] box-border"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0E0B1E] mb-1">
                  {t('referrals.serviceCategory')} *
                </label>
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/50 text-sm text-[#0E0B1E] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] box-border"
                >
                  <option value="healthcare">Healthcare & Diagnostics</option>
                  <option value="education">Education & Career Development</option>
                  <option value="professional">Professional & Business Services</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0E0B1E] mb-1">
                  {t('referrals.clientNeed')} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={clientNeed}
                  onChange={(e) => setClientNeed(e.target.value)}
                  placeholder={t('referrals.clientNeedPlaceholder')}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/50 text-sm text-[#0E0B1E] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] box-border leading-relaxed"
                />
              </div>

              {/* Consent Checkbox */}
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#12101F]/10 flex items-start gap-2.5">
                <input
                  id="modal-consent"
                  type="checkbox"
                  required
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[#6B3CFF] focus:ring-[#6B3CFF] cursor-pointer"
                />
                <label htmlFor="modal-consent" className="text-xs text-[#575266] leading-relaxed cursor-pointer">
                  {t('referrals.consentCheckbox')}
                </label>
              </div>

              {submitError && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-amber-700" />
                  <span>{submitError}</span>
                </div>
              )}

              {submitSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-700" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              {/* Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#12101F]/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#12101F]/15 bg-white text-xs font-semibold text-[#575266] hover:bg-black/5 transition-colors cursor-pointer"
                >
                  {t('referrals.closeBtn')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6B3CFF] hover:bg-[#582CD6] text-white text-xs font-bold transition-all shadow-md shadow-[#6B3CFF]/20 cursor-pointer border-none disabled:opacity-50"
                >
                  {submitting && <RefreshCw size={13} className="animate-spin" />}
                  <span>{t('referrals.submitModalBtn')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
