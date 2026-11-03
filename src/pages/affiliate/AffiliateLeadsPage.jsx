import React, { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import { getPortalText } from '../../i18n/portalTranslations'
import {
  Users,
  Search,
  Filter,
  PlusCircle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  X,
  Sparkles,
  RefreshCw,
  Building2,
  GraduationCap,
  HeartPulse,
} from 'lucide-react'

export default function AffiliateLeadsPage() {
  const { user } = useAuth()
  const { lang } = useLanguage()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

  // Referral form state inside modal
  const [clientName, setClientName] = useState('')
  const [clientMobile, setClientMobile] = useState('')
  const [clientCity, setClientCity] = useState('')
  const [selectedSector, setSelectedSector] = useState('healthcare')
  const [clientNeed, setClientNeed] = useState('')
  const [consentGiven, setConsentGiven] = useState(false)

  const t = (path) => getPortalText(lang, path)
  const partnerId = `SBL-${(user?.id || '882199').slice(0, 8).toUpperCase()}`

  const fetchReferrals = async () => {
    try {
      setLoading(true)
      const data = await api.getAffiliateReferrals(selectedStatus)
      setReferrals(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load referrals:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReferrals()
  }, [selectedStatus])

  const filteredReferrals = referrals.filter((item) => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return true
    return (
      item.client_name?.toLowerCase().includes(query) ||
      item.service_category?.toLowerCase().includes(query) ||
      item.client_city?.toLowerCase().includes(query)
    )
  })

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

      // Reset form
      setClientName('')
      setClientMobile('')
      setClientCity('')
      setClientNeed('')
      setConsentGiven(false)

      // Refresh list
      await fetchReferrals()

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
      {/* 1. Page Header */}
      <div className="bg-white rounded-3xl border border-[#12101F]/10 p-8 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6B3CFF] via-[#8E51FF] to-[#D6F36B]" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B3CFF]/10 text-[#6B3CFF] text-xs font-bold uppercase tracking-wider">
              <Sparkles size={13} />
              <span>{lang === 'te' ? 'రిఫరల్ పైప్‌లైన్' : 'Partner Referral Pipeline'}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0E0B1E] tracking-tight leading-tight m-0">
              {t('referrals.title')}
            </h1>

            <p className="text-sm sm:text-base text-[#575266] leading-relaxed m-0">
              {t('referrals.subtitle')}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSubmitError('')
              setSubmitSuccess('')
              setModalOpen(true)
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#6B3CFF] hover:bg-[#582CD6] text-white font-bold text-sm shadow-md shadow-[#6B3CFF]/25 hover:shadow-lg transition-all cursor-pointer border-none shrink-0"
          >
            <PlusCircle size={18} />
            <span>{t('referrals.submitBtn')}</span>
          </button>
        </div>
      </div>

      {/* 2. Permission-First Principle Notice Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs sm:text-sm flex items-start gap-3 shadow-2xs">
        <ShieldAlert size={20} className="text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">
            {t('referrals.consentNoticeTitle')}
          </span>
          <p className="m-0 text-amber-900 leading-relaxed text-xs">
            {t('referrals.consentNoticeDesc')}
          </p>
        </div>
      </div>

      {/* 3. Search Bar and Status Filters */}
      <div className="bg-white rounded-3xl border border-[#12101F]/10 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#575266]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'te' ? 'క్లయింట్ లేదా సర్వీస్ ద్వారా వెతకండి...' : 'Search by client name or category...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/50 text-sm text-[#0E0B1E] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] box-border"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: t('referrals.filterAll') },
              { id: 'pending', label: t('referrals.filterPending') },
              { id: 'contacted', label: t('referrals.filterContacted') },
              { id: 'qualified', label: t('referrals.filterQualified') },
              { id: 'converted', label: t('referrals.filterConverted') },
              { id: 'rejected', label: t('referrals.filterRejected') },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                  selectedStatus === tab.id
                    ? 'bg-[#6B3CFF] text-white border-[#6B3CFF]'
                    : 'bg-white text-[#575266] border-[#12101F]/15 hover:bg-black/5'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Referrals Pipeline Table */}
      <div className="bg-white rounded-3xl border border-[#12101F]/10 shadow-sm overflow-hidden">
        {filteredReferrals.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#FAF7F2] text-[#6B3CFF] flex items-center justify-center mx-auto shadow-inner">
              <Users size={32} />
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="font-serif font-bold text-lg text-[#0E0B1E] m-0">
                {t('referrals.emptyTitle')}
              </h3>
              <p className="text-xs sm:text-sm text-[#575266] leading-relaxed m-0">
                {t('referrals.emptyDesc')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSubmitError('')
                setSubmitSuccess('')
                setModalOpen(true)
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6B3CFF] hover:bg-[#582CD6] text-white font-bold text-xs shadow-sm transition-all cursor-pointer border-none"
            >
              <PlusCircle size={15} />
              <span>{t('referrals.submitBtn')}</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2]/80 border-b border-[#12101F]/10 text-[#575266] uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-6">{t('referrals.colRef')}</th>
                  <th className="py-3.5 px-6">{t('referrals.colClient')}</th>
                  <th className="py-3.5 px-6">{t('referrals.colCategory')}</th>
                  <th className="py-3.5 px-6">{t('referrals.colDate')}</th>
                  <th className="py-3.5 px-6">{t('referrals.colStatus')}</th>
                  <th className="py-3.5 px-6">{t('referrals.colProvider')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#12101F]/5 text-[#0E0B1E]">
                {filteredReferrals.map((item) => (
                  <tr key={item.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#6B3CFF]">
                      SBL-REF-{item.id.slice(0, 6).toUpperCase()}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-[#0E0B1E]">{item.client_name}</div>
                      <div className="text-[11px] text-[#575266]">{item.client_city}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-[#6B3CFF] text-[11px] font-semibold capitalize">
                        {getSectorIcon(item.service_category)}
                        <span>{item.service_category}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[#575266]">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="py-4 px-6 text-[#575266]">
                      {item.admin_notes || t('referrals.providerTermsStandard')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Referral Submission Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#12101F]/15 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#12101F]/10 pb-4">
              <div>
                <span className="text-xs font-bold text-[#6B3CFF] uppercase tracking-wider">
                  {partnerId}
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#0E0B1E] m-0">
                  {t('referrals.modalTitle')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-[#575266] hover:bg-[#FAF7F2] cursor-pointer border-none"
              >
                <X size={20} />
              </button>
            </div>

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

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#12101F]/10 flex items-start gap-2.5">
                <input
                  id="leads-consent"
                  type="checkbox"
                  required
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[#6B3CFF] focus:ring-[#6B3CFF] cursor-pointer"
                />
                <label htmlFor="leads-consent" className="text-xs text-[#575266] leading-relaxed cursor-pointer">
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
