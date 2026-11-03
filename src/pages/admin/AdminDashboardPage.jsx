import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { useLanguage } from '../../context/useLanguage'
import { getPortalText } from '../../i18n/portalTranslations'
import {
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  FileText,
  AlertCircle,
  Building2,
  GraduationCap,
  HeartPulse,
  RefreshCw,
} from 'lucide-react'

export default function AdminDashboardPage() {
  const { lang } = useLanguage()

  const [metrics, setMetrics] = useState({
    pending: 0,
    info_requested: 0,
    approved: 0,
    total: 0,
    total_referrals: 0,
    pending_referrals: 0,
    converted_referrals: 0,
  })
  const [recentReferrals, setRecentReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const t = (path) => getPortalText(lang, path)

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [summaryRes, leadsRes] = await Promise.all([
        api.getAdminSummary(),
        api.getAdminReferrals({ limit: 5 }),
      ])

      if (summaryRes) {
        setMetrics(summaryRes)
      }
      if (Array.isArray(leadsRes)) {
        setRecentReferrals(leadsRes)
      }
    } catch (err) {
      console.error('Failed to load admin overview:', err)
      setError(err.message || 'Could not load administrative overview data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const getSectorIcon = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'healthcare':
        return <HeartPulse size={14} className="text-[#6B3CFF]" />
      case 'education':
        return <GraduationCap size={14} className="text-[#6B3CFF]" />
      case 'professional':
        return <Building2 size={14} className="text-[#6B3CFF]" />
      default:
        return <FileText size={14} className="text-[#6B3CFF]" />
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            {lang === 'te' ? 'సమీక్షలో ఉంది' : 'Pending Review'}
          </span>
        )
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
            <Clock size={12} />
            {lang === 'te' ? 'సంప్రదించినవి' : 'Contacted'}
          </span>
        )
      case 'qualified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-800 border border-purple-200">
            <Sparkles size={12} />
            {lang === 'te' ? 'అర్హత పొందినవి' : 'Qualified'}
          </span>
        )
      case 'converted':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle2 size={12} />
            {lang === 'te' ? 'విజయవంతమైనవి' : 'Converted'}
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-200">
            <AlertCircle size={12} />
            {lang === 'te' ? 'తిరస్కరించినవి' : 'Rejected'}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Page Header with Refresh */}
      <div className="bg-white rounded-3xl border border-[#12101F]/10 p-8 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6B3CFF] via-[#8E51FF] to-[#D6F36B]" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B3CFF]/10 text-[#6B3CFF] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck size={13} />
              <span>{lang === 'te' ? 'అడ్మినిస్ట్రేషన్ కన్సోల్' : 'Administration Console'}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0E0B1E] tracking-tight leading-tight m-0">
              {t('admin.overview.title')}
            </h1>

            <p className="text-sm sm:text-base text-[#575266] leading-relaxed m-0">
              {t('admin.overview.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#12101F]/15 hover:bg-[#FAF7F2] text-[#0E0B1E] font-semibold text-xs transition-colors cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>{lang === 'te' ? 'రిఫ్రెష్' : 'Refresh Metrics'}</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-center gap-3">
          <AlertCircle size={18} className="shrink-0 text-amber-700" />
          <span>{error}</span>
        </div>
      )}

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Registered Affiliates */}
        <div className="bg-white rounded-3xl border border-[#12101F]/10 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#575266]">
              {lang === 'te' ? 'నమోదైన అఫిలియేట్లు' : 'Registered Affiliates'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6B3CFF] flex items-center justify-center">
              <Users size={18} />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-4xl font-bold text-[#0E0B1E] font-serif tracking-tight">
              {loading ? '—' : (metrics.registered_affiliates ?? metrics.total ?? 0)}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#575266] mt-1.5">
              <span className="text-emerald-700 font-semibold">
                {metrics.verified_affiliates ?? 0} {lang === 'te' ? 'ధృవీకరించబడినవి' : 'verified'}
              </span>
              <span>•</span>
              <span className="text-amber-700">
                {metrics.unverified_affiliates ?? 0} {lang === 'te' ? 'ధృవీకరించనివి' : 'unverified'}
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Account Statuses */}
        <div className="bg-white rounded-3xl border border-[#12101F]/10 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#575266]">
              {lang === 'te' ? 'ఖాతా స్థితి' : 'Account Statuses'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 size={18} />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-4xl font-bold text-[#0E0B1E] font-serif tracking-tight">
              {loading ? '—' : (metrics.active_accounts ?? metrics.approved ?? 0)}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#575266] mt-1.5">
              <span className="text-emerald-700 font-semibold">{lang === 'te' ? 'క్రియాశీల' : 'active'}</span>
              <span>•</span>
              <span className="text-amber-800">{metrics.suspended_accounts ?? 0} {lang === 'te' ? 'నిలిపివేసినవి' : 'suspended'}</span>
              <span>•</span>
              <span className="text-rose-700">{metrics.rejected_accounts ?? 0} {lang === 'te' ? 'తిరస్కరించినవి' : 'rejected'}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Total Referrals */}
        <div className="bg-white rounded-3xl border border-[#12101F]/10 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#575266]">
              {t('admin.overview.totalReferrals')}
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText size={18} />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-4xl font-bold text-[#0E0B1E] font-serif tracking-tight">
              {loading ? '—' : (metrics.total_referrals ?? 0)}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#575266] mt-1.5">
              <span className="text-amber-800 font-semibold">{metrics.pending_referrals ?? 0} pending</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">{metrics.converted_referrals ?? 0} converted</span>
            </div>
          </div>
        </div>

        {/* Card 4: Service Providers */}
        <div className="bg-white rounded-3xl border border-[#12101F]/10 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#575266]">
              {lang === 'te' ? 'సర్వీస్ ప్రొవైడర్లు' : 'Service Providers'}
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#6B3CFF] flex items-center justify-center">
              <Building2 size={18} />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-4xl font-bold text-[#0E0B1E] font-serif tracking-tight">
              {loading ? '—' : (metrics.total_providers ?? 0)}
            </div>
            <div className="flex items-center gap-2 text-xs text-[#575266] mt-1.5">
              <span className="text-emerald-700 font-semibold">
                {metrics.active_providers ?? metrics.total_providers ?? 0} {lang === 'te' ? 'క్రియాశీలం' : 'active listings'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2b. Detailed Referral Status Pipeline Bar */}
      <div className="bg-white rounded-3xl border border-[#12101F]/10 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0E0B1E] m-0">
              {lang === 'te' ? 'సిస్టమ్ రిఫరల్ పైప్‌లైన్ స్థితి' : 'System-wide Referral Status Breakdown'}
            </h3>
            <p className="text-[11px] text-[#575266] m-0 mt-0.5">
              {lang === 'te'
                ? `మొత్తం రిఫరల్స్: ${metrics.total_referrals ?? 0}`
                : `Real-time database metrics across all sectors: ${metrics.total_referrals ?? 0} introductions`}
            </p>
          </div>
          <Link
            to="/admin/leads"
            className="text-xs font-bold text-[#6B3CFF] hover:underline inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{lang === 'te' ? 'లీడ్ మేనేజ్‌మెంట్‌కి వెళ్లండి →' : 'Go to Lead Management →'}</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#12101F]/5">
            <span className="text-[10px] uppercase font-bold text-[#575266] block">
              {lang === 'te' ? 'పెండింగ్' : 'Pending Review'}
            </span>
            <span className="text-2xl font-serif font-bold text-[#0E0B1E] block mt-1">
              {loading ? '—' : metrics.pending_referrals ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
            <span className="text-[10px] uppercase font-bold text-sky-800 block">
              {lang === 'te' ? 'సంప్రదించారు' : 'Contacted'}
            </span>
            <span className="text-2xl font-serif font-bold text-sky-950 block mt-1">
              {loading ? '—' : metrics.contacted_referrals ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50/60 border border-purple-100">
            <span className="text-[10px] uppercase font-bold text-purple-800 block">
              {lang === 'te' ? 'అర్హత సాధించినవి' : 'Qualified'}
            </span>
            <span className="text-2xl font-serif font-bold text-purple-950 block mt-1">
              {loading ? '—' : metrics.qualified_referrals ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">
              {lang === 'te' ? 'మార్పిడి చెందినవి' : 'Converted'}
            </span>
            <span className="text-2xl font-serif font-bold text-emerald-950 block mt-1">
              {loading ? '—' : metrics.converted_referrals ?? 0}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-100">
            <span className="text-[10px] uppercase font-bold text-rose-800 block">
              {lang === 'te' ? 'తిరస్కరించబడినవి' : 'Rejected'}
            </span>
            <span className="text-2xl font-serif font-bold text-rose-950 block mt-1">
              {loading ? '—' : metrics.rejected_referrals ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Operational Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/leads"
          className="group p-6 rounded-3xl bg-white border border-[#12101F]/10 hover:border-[#6B3CFF] shadow-sm hover:shadow-md transition-all flex items-center justify-between no-underline"
        >
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-[#6B3CFF]">
              {lang === 'te' ? 'లీడ్ మేనేజ్‌మెంట్' : 'Referral Pipeline'}
            </div>
            <h3 className="font-serif font-bold text-lg text-[#0E0B1E] m-0 group-hover:text-[#6B3CFF] transition-colors">
              {t('admin.overview.goToLeads')}
            </h3>
            <p className="text-xs text-[#575266] m-0">
              {lang === 'te'
                ? 'క్లయింట్ వివరాలు సమీక్షించండి మరియు స్థితిని మార్చండి'
                : 'Review submissions, mark contacted, qualify, and convert.'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#6B3CFF]/10 text-[#6B3CFF] flex items-center justify-center group-hover:bg-[#6B3CFF] group-hover:text-white transition-all shrink-0">
            <ArrowRight size={18} />
          </div>
        </Link>

        <Link
          to="/admin/approvals"
          className="group p-6 rounded-3xl bg-white border border-[#12101F]/10 hover:border-[#6B3CFF] shadow-sm hover:shadow-md transition-all flex items-center justify-between no-underline"
        >
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-purple-600">
              {lang === 'te' ? 'అఫిలియేట్ గవర్నెన్స్' : 'Partner Governance'}
            </div>
            <h3 className="font-serif font-bold text-lg text-[#0E0B1E] m-0 group-hover:text-[#6B3CFF] transition-colors">
              {t('admin.overview.goToApprovals')}
            </h3>
            <p className="text-xs text-[#575266] m-0">
              {lang === 'te'
                ? 'అఫిలియేట్ దరఖాస్తులు, ప్రమోషన్ ప్లాన్స్ మరియు ఆడిట్ లాగ్స్'
                : 'Inspect applicant profiles, promotion strategies, and audit history.'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:bg-[#6B3CFF] group-hover:text-white transition-all shrink-0">
            <ArrowRight size={18} />
          </div>
        </Link>

        <Link
          to="/admin/providers"
          className="group p-6 rounded-3xl bg-white border border-[#12101F]/10 hover:border-[#6B3CFF] shadow-sm hover:shadow-md transition-all flex items-center justify-between no-underline"
        >
          <div className="space-y-1">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              {lang === 'te' ? 'ప్రొవైడర్ల డైరెక్టరీ' : 'Providers Directory'}
            </div>
            <h3 className="font-serif font-bold text-lg text-[#0E0B1E] m-0 group-hover:text-[#6B3CFF] transition-colors">
              {lang === 'te' ? 'ప్రొవైడర్ల నిర్వహణ' : 'Manage Providers'}
            </h3>
            <p className="text-xs text-[#575266] m-0">
              {lang === 'te'
                ? 'రంగాలు, ప్రొవైడర్ వివరాలు మరియు స్వతంత్ర నిబంధనల నిర్వహణ'
                : 'Maintain accredited providers across Healthcare, Education, and Professional Services.'}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:bg-[#6B3CFF] group-hover:text-white transition-all shrink-0">
            <ArrowRight size={18} />
          </div>
        </Link>
      </div>

      {/* 4. Recent Referral Submissions Table */}
      <div className="bg-white rounded-3xl border border-[#12101F]/10 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-[#12101F]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif font-bold text-xl text-[#0E0B1E] m-0">
              {t('admin.overview.recentSubmissions')}
            </h2>
            <p className="text-xs text-[#575266] mt-1 m-0">
              {lang === 'te'
                ? 'లైవ్ డేటాబేస్ నుండి ఇటీవలి 5 రిఫరల్ సమర్పణలు'
                : 'Latest 5 client introductions from the PostgreSQL database.'}
            </p>
          </div>

          <Link
            to="/admin/leads"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6B3CFF] hover:text-[#582CD6] no-underline"
          >
            <span>{lang === 'te' ? 'అన్ని లీడ్స్ చూడండి' : 'View all in Lead Management'}</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentReferrals.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#575266] flex items-center justify-center mx-auto">
              <FileText size={24} />
            </div>
            <h3 className="font-serif font-bold text-base text-[#0E0B1E] m-0">
              {t('admin.overview.noReferralsYet')}
            </h3>
            <p className="text-xs text-[#575266] max-w-md mx-auto m-0">
              {lang === 'te'
                ? 'అఫిలియేట్లు తమ పోర్టల్ ద్వారా క్లయింట్లను పరిచయం చేసినప్పుడు ఇక్కడ కనిపిస్తాయి.'
                : 'Referrals submitted by accredited affiliates will appear here in real-time.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2]/80 border-b border-[#12101F]/10 text-[#575266] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-6">{t('admin.leads.refId')}</th>
                  <th className="py-3 px-6">{t('admin.overview.clientLabel')}</th>
                  <th className="py-3 px-6">{t('admin.overview.sectorLabel')}</th>
                  <th className="py-3 px-6">{t('admin.leads.affiliate')}</th>
                  <th className="py-3 px-6">{t('admin.overview.dateLabel')}</th>
                  <th className="py-3 px-6">{t('admin.overview.statusLabel')}</th>
                  <th className="py-3 px-6 text-right">{t('admin.leads.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#12101F]/5 text-[#0E0B1E]">
                {recentReferrals.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#6B3CFF]">
                      SBL-REF-{item.id.slice(0, 6).toUpperCase()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-sm text-[#0E0B1E]">{item.client_name}</div>
                      <div className="text-[11px] text-[#575266]">{item.client_city}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-[#6B3CFF] text-[11px] font-semibold capitalize">
                        {getSectorIcon(item.service_category)}
                        <span>{item.service_category}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-[#0E0B1E]">
                        {item.affiliate_name || item.affiliate_email?.split('@')[0] || 'Affiliate'}
                      </div>
                      <div className="text-[11px] text-[#575266] font-mono">{item.affiliate_email}</div>
                    </td>
                    <td className="py-4 px-6 text-[#575266]">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        to="/admin/leads"
                        className="inline-flex items-center gap-1 text-[#6B3CFF] font-semibold hover:underline no-underline"
                      >
                        <span>{lang === 'te' ? 'సమీక్షించండి' : 'Review'}</span>
                        <ArrowRight size={13} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
