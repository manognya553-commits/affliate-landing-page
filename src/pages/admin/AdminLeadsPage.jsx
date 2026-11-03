import React, { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useLanguage } from '../../context/useLanguage'
import { getPortalText } from '../../i18n/portalTranslations'
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  FileText,
  X,
  Phone,
  MapPin,
  Building2,
  GraduationCap,
  HeartPulse,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Download,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const SECTOR_TERMS = {
  healthcare: {
    en: 'Provider Terms: Specialist Consultation & Diagnostic Introductions. Verification window: 14 business days.',
    te: 'సేవా నిబంధనలు: స్పెషలిస్ట్ సంప్రదింపులు మరియు డయాగ్నస్టిక్స్ పరిచయాలు. ధృవీకరణ గడువు: 14 పనిదినాలు.',
  },
  education: {
    en: 'Provider Terms: Higher Education & Specialized Course Counseling. Verification upon verified enrollment.',
    te: 'సేవా నిబంధనలు: ఉన్నత విద్య మరియు కోర్సు కౌన్సెలింగ్. ప్రవేశం ధృవీకరించబడిన తర్వాత వర్తిస్తుంది.',
  },
  professional: {
    en: 'Provider Terms: Corporate Advisory & Taxation Services. Engagement terms established directly per provider.',
    te: 'సేవా నిబంధనలు: కార్పొరేట్ సలహా మరియు పన్ను సేవలు. ప్రొవైడర్ నేరుగా నిర్ణయించే నిబంధనలు.',
  },
}

export default function AdminLeadsPage() {
  const { lang } = useLanguage()

  const [referrals, setReferrals] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedSector, setSelectedSector] = useState('all')

  // Selected lead for detail/action modal
  const [selectedLead, setSelectedLead] = useState(null)
  const [actionModalOpen, setActionModalOpen] = useState(false)
  const [targetStatus, setTargetStatus] = useState(null)
  const [adminNotes, setAdminNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionSuccess, setActionSuccess] = useState('')

  const t = (path) => getPortalText(lang, path)

  const fetchLeads = async (pageToFetch = page) => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getAdminReferrals({
        status: selectedStatus !== 'all' ? selectedStatus : null,
        sector: selectedSector !== 'all' ? selectedSector : null,
        search: searchQuery.trim() || null,
        limit: pageSize,
        offset: (pageToFetch - 1) * pageSize,
      })
      if (Array.isArray(data)) {
        setReferrals(data)
        setTotalCount(data.totalCount !== undefined ? data.totalCount : data.length)
      } else {
        setReferrals([])
        setTotalCount(0)
      }
    } catch (err) {
      console.error('Failed to fetch admin referrals:', err)
      setError(err.message || 'Failed to load referral leads.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPage(1)
    fetchLeads(1)
  }, [selectedStatus, selectedSector])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
    fetchLeads(1)
  }

  const exportCSV = () => {
    if (referrals.length === 0) return
    const headers = ['Ref ID', 'Client Name', 'City', 'Mobile', 'Sector', 'Target Provider', 'Affiliate', 'Status', 'Date']
    const rows = referrals.map((r) => [
      `SBL-REF-${r.id.slice(0, 8)}`,
      `"${(r.client_name || '').replace(/"/g, '""')}"`,
      `"${(r.client_city || '').replace(/"/g, '""')}"`,
      r.client_mobile || '',
      r.service_category || '',
      `"${(r.provider_name || '').replace(/"/g, '""')}"`,
      r.affiliate_email || '',
      r.status || '',
      new Date(r.created_at).toISOString().split('T')[0],
    ])
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `sbloom_referrals_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOpenAction = (lead, newStatus) => {
    setSelectedLead(lead)
    setTargetStatus(newStatus)
    setAdminNotes(lead.admin_notes || '')
    setActionSuccess('')
    setActionModalOpen(true)
  }

  const handleConfirmStatusUpdate = async () => {
    if (!selectedLead || !targetStatus) return

    try {
      setActionLoading(true)
      setError(null)
      const updated = await api.updateAdminReferralStatus(selectedLead.id, {
        status: targetStatus,
        admin_notes: adminNotes.trim() || null,
      })

      setActionSuccess(t('admin.leads.updateSuccess'))
      // Update in local list
      setReferrals((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      )
      setSelectedLead(updated)
      setTimeout(() => {
        setActionModalOpen(false)
        setActionSuccess('')
      }, 1400)
    } catch (err) {
      console.error('Failed to update referral status:', err)
      setError(err.message || 'Failed to update referral status.')
    } finally {
      setActionLoading(false)
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

  const statusFilters = [
    { id: 'all', label: t('admin.leads.filterAll') },
    { id: 'pending', label: t('admin.leads.filterPending') },
    { id: 'contacted', label: t('admin.leads.filterContacted') },
    { id: 'qualified', label: t('admin.leads.filterQualified') },
    { id: 'converted', label: t('admin.leads.filterConverted') },
    { id: 'rejected', label: t('admin.leads.filterRejected') },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <div className="bg-white rounded-3xl border border-[#12101F]/10 p-8 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6B3CFF] via-[#8E51FF] to-[#D6F36B]" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B3CFF]/10 text-[#6B3CFF] text-xs font-bold uppercase tracking-wider">
              <Users size={13} />
              <span>{lang === 'te' ? 'లీడ్ నిర్వహణ' : 'Lead Governance & Operations'}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0E0B1E] tracking-tight leading-tight m-0">
              {t('admin.leads.title')}
            </h1>

            <p className="text-sm sm:text-base text-[#575266] leading-relaxed m-0">
              {t('admin.leads.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={exportCSV}
              disabled={loading || referrals.length === 0}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#12101F]/15 hover:bg-[#FAF7F2] text-[#0E0B1E] font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Download size={14} className="text-[#6B3CFF]" />
              <span>{lang === 'te' ? 'CSV డౌన్‌లోడ్' : 'Export CSV'}</span>
            </button>

            <button
              type="button"
              onClick={() => fetchLeads(page)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B3CFF] hover:bg-[#582CD6] text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>{lang === 'te' ? 'రిఫ్రెష్' : 'Refresh'}</span>
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

      {/* 2. Search & Filter Bar */}
      <div className="bg-white rounded-3xl border border-[#12101F]/10 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#575266]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('admin.leads.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/50 text-sm text-[#0E0B1E] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] box-border"
            />
          </form>

          {/* Sector Filter Dropdown & Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-[#12101F]/15 bg-[#FAF7F2]/60 text-[#0E0B1E] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]"
            >
              <option value="all">{lang === 'te' ? 'అన్ని రంగాలు' : 'All Sectors'}</option>
              <option value="healthcare">Healthcare & Diagnostics</option>
              <option value="education">Education & Career</option>
              <option value="professional">Professional Services</option>
            </select>

            <div className="flex flex-wrap items-center gap-1.5">
              {statusFilters.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                    selectedStatus === tab.id
                      ? 'bg-[#6B3CFF] text-white border-[#6B3CFF] shadow-xs'
                      : 'bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] text-[#575266] border-transparent'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Central Referral Management Table */}
      <div className="bg-white rounded-3xl border border-[#12101F]/10 shadow-sm overflow-hidden">
        {referrals.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FAF7F2] text-[#575266] flex items-center justify-center mx-auto">
              <FileText size={24} />
            </div>
            <h3 className="font-serif font-bold text-base text-[#0E0B1E] m-0">
              {t('admin.leads.emptyState')}
            </h3>
            <p className="text-xs text-[#575266] max-w-md mx-auto m-0">
              {lang === 'te'
                ? 'ఎంచుకున్న ఫిల్టర్ లేదా శోధన పదానికి సరిపోయే రికార్డులు లేవు.'
                : 'No referrals matched the query. Try adjusting your status filter or search parameters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#FAF7F2]/80 border-b border-[#12101F]/10 text-[#575266] uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-6">{t('admin.leads.refId')}</th>
                  <th className="py-3.5 px-6">{t('admin.leads.client')}</th>
                  <th className="py-3.5 px-6">{t('admin.leads.contact')}</th>
                  <th className="py-3.5 px-6">{t('admin.leads.sector')}</th>
                  <th className="py-3.5 px-6">{t('admin.leads.affiliate')}</th>
                  <th className="py-3.5 px-6">{t('admin.leads.date')}</th>
                  <th className="py-3.5 px-6">{t('admin.leads.status')}</th>
                  <th className="py-3.5 px-6 text-right">{t('admin.leads.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#12101F]/5 text-[#0E0B1E]">
                {referrals.map((lead) => (
                  <tr key={lead.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                    {/* Ref ID */}
                    <td className="py-4 px-6 font-mono font-bold text-[#6B3CFF]">
                      SBL-REF-{lead.id.slice(0, 6).toUpperCase()}
                    </td>

                    {/* Client Details */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-sm text-[#0E0B1E] flex items-center gap-1.5">
                        <span>{lead.client_name}</span>
                        {lead.consent_confirmed && (
                          <span
                            title="Permission Confirmed"
                            className="inline-flex items-center text-emerald-600"
                          >
                            <ShieldCheck size={14} />
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#575266] flex items-center gap-1 mt-0.5">
                        <MapPin size={11} />
                        <span>{lead.client_city}</span>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-4 px-6 font-mono text-[11px]">
                      <div className="flex items-center gap-1.5 text-[#0E0B1E]">
                        <Phone size={12} className="text-[#575266]" />
                        <span>{lead.client_mobile}</span>
                      </div>
                    </td>

                    {/* Sector & Provider */}
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 text-[#6B3CFF] text-[11px] font-semibold capitalize mb-1">
                        {getSectorIcon(lead.service_category)}
                        <span>{lead.service_category}</span>
                      </div>
                      {lead.provider_name && (
                        <div className="text-[11px] font-semibold text-[#0E0B1E] flex items-center gap-1">
                          <Building2 size={11} className="text-[#6B3CFF]" />
                          <span>{lead.provider_name}</span>
                        </div>
                      )}
                      <div className="text-[10px] text-[#575266] max-w-[200px] truncate" title={SECTOR_TERMS[lead.service_category]?.[lang]}>
                        {SECTOR_TERMS[lead.service_category]?.[lang]}
                      </div>
                    </td>

                    {/* Affiliate */}
                    <td className="py-4 px-6">
                      <div className="font-medium text-[#0E0B1E]">
                        {lead.affiliate_name || lead.affiliate_email?.split('@')[0] || 'Partner'}
                      </div>
                      <div className="text-[11px] text-[#575266] font-mono">{lead.affiliate_email}</div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-[#575266]">
                      {new Date(lead.created_at).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      {getStatusBadge(lead.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {lead.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => handleOpenAction(lead, 'contacted')}
                            className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 text-[11px] font-semibold transition-colors cursor-pointer border-none"
                          >
                            {t('admin.leads.markContacted')}
                          </button>
                        )}
                        {lead.status === 'contacted' && (
                          <button
                            type="button"
                            onClick={() => handleOpenAction(lead, 'qualified')}
                            className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-semibold transition-colors cursor-pointer border-none"
                          >
                            {t('admin.leads.markQualified')}
                          </button>
                        )}
                        {lead.status === 'qualified' && (
                          <button
                            type="button"
                            onClick={() => handleOpenAction(lead, 'converted')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold transition-colors cursor-pointer border-none"
                          >
                            {t('admin.leads.markConverted')}
                          </button>
                        )}
                        {lead.status !== 'rejected' && lead.status !== 'converted' && (
                          <button
                            type="button"
                            onClick={() => handleOpenAction(lead, 'rejected')}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 text-[11px] font-semibold transition-colors cursor-pointer border-none"
                          >
                            {t('admin.leads.markRejected')}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLead(lead)
                            setTargetStatus(lead.status)
                            setAdminNotes(lead.admin_notes || '')
                            setActionModalOpen(true)
                          }}
                          className="px-2.5 py-1 rounded-lg border border-[#12101F]/15 hover:bg-[#FAF7F2] text-[#0E0B1E] text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          {lang === 'te' ? 'వివరాలు' : 'Inspect'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        {totalCount > 0 && (
          <div className="p-4 border-t border-[#12101F]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#575266] bg-[#FAF7F2]/40">
            <div>
              {lang === 'te'
                ? `మొత్తం ${totalCount} లో ${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, totalCount)} చూపిస్తోంది`
                : `Showing ${(page - 1) * pageSize + 1} to ${Math.min(page * pageSize, totalCount)} of ${totalCount} referrals`}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => {
                  const newPage = page - 1
                  setPage(newPage)
                  fetchLeads(newPage)
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#12101F]/15 bg-white hover:bg-black/5 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <ChevronLeft size={14} />
                <span>{lang === 'te' ? 'మునుపటి' : 'Previous'}</span>
              </button>

              <span className="font-semibold px-2 text-[#0E0B1E]">
                {page} / {Math.max(1, Math.ceil(totalCount / pageSize))}
              </span>

              <button
                type="button"
                disabled={page * pageSize >= totalCount || loading}
                onClick={() => {
                  const newPage = page + 1
                  setPage(newPage)
                  fetchLeads(newPage)
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#12101F]/15 bg-white hover:bg-black/5 disabled:opacity-40 transition-colors cursor-pointer"
              >
                <span>{lang === 'te' ? 'తరువాతి' : 'Next'}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Action & Detail Modal with Confirmation Step */}
      {actionModalOpen && selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#12101F]/15 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#12101F]/10 pb-4">
              <div>
                <span className="text-[11px] font-bold text-[#6B3CFF] uppercase tracking-wider font-mono">
                  SBL-REF-{selectedLead.id.slice(0, 8).toUpperCase()}
                </span>
                <h3 className="font-serif font-bold text-2xl text-[#0E0B1E] m-0">
                  {t('admin.leads.confirmTitle')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActionModalOpen(false)}
                className="p-2 rounded-xl text-[#575266] hover:bg-[#FAF7F2] cursor-pointer border-none"
              >
                <X size={20} />
              </button>
            </div>

            {/* Client Context Information Card */}
            <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#12101F]/10 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-xs text-[#575266]">{t('admin.leads.client')}</div>
                  <div className="font-bold text-base text-[#0E0B1E]">{selectedLead.client_name}</div>
                </div>
                <div>
                  <div className="text-xs text-[#575266]">{t('admin.leads.contact')}</div>
                  <div className="font-mono text-sm font-semibold text-[#0E0B1E]">{selectedLead.client_mobile}</div>
                </div>
                <div>
                  <div className="text-xs text-[#575266]">{t('admin.leads.sector')}</div>
                  <div className="font-semibold text-xs text-[#6B3CFF] capitalize">
                    {selectedLead.service_category}
                  </div>
                </div>
              </div>

              {/* Context Note from Affiliate */}
              <div>
                <div className="text-xs font-bold text-[#575266] mb-1">
                  {t('admin.leads.viewNote')}
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#12101F]/10 text-xs text-[#0E0B1E] leading-relaxed">
                  "{selectedLead.context_note}"
                </div>
              </div>

              {/* Explicit Permission Indicator */}
              <div className="flex items-center gap-2 text-xs text-emerald-800 font-semibold bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0" />
                <span>
                  {lang === 'te'
                    ? 'క్లయింట్ స్పష్టమైన అనుమతి నిర్ధారించబడింది (పరిచయం చేయడానికి ముందస్తు సమ్మతి).'
                    : 'Explicit client permission verified: Client agreed to this service introduction.'}
                </span>
              </div>
            </div>

            {/* Provider Terms Notice */}
            <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 text-xs text-purple-950 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-[#6B3CFF]">
                <FileText size={14} />
                <span>{t('admin.leads.providerTerms')}</span>
              </div>
              <p className="m-0 leading-relaxed text-[11px] text-[#575266]">
                {SECTOR_TERMS[selectedLead.service_category]?.[lang]}
              </p>
            </div>

            {/* Status Change Selector & Admin Notes */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#575266] mb-2">
                  {lang === 'te' ? 'లక్ష్య స్థితి (Target Status)' : 'Transition Referral Status to:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {['pending', 'contacted', 'qualified', 'converted', 'rejected'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setTargetStatus(st)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer border ${
                        targetStatus === st
                          ? 'bg-[#6B3CFF] text-white border-[#6B3CFF] shadow-xs'
                          : 'bg-white hover:bg-[#FAF7F2] text-[#575266] border-[#12101F]/15'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#575266] mb-2">
                  {t('admin.leads.adminNotesLabel')}
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder={t('admin.leads.adminNotesPlaceholder')}
                  className="w-full p-3 rounded-xl border border-[#12101F]/15 bg-white text-xs text-[#0E0B1E] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] box-border"
                />
              </div>
            </div>

            {actionSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>{actionSuccess}</span>
              </div>
            )}

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#12101F]/10">
              <button
                type="button"
                onClick={() => setActionModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-[#12101F]/15 text-[#575266] hover:bg-[#FAF7F2] text-xs font-semibold cursor-pointer"
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                onClick={handleConfirmStatusUpdate}
                disabled={actionLoading}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6B3CFF] hover:bg-[#582CD6] text-white text-xs font-bold shadow-md shadow-[#6B3CFF]/25 cursor-pointer border-none disabled:opacity-50"
              >
                {actionLoading && <RefreshCw size={13} className="animate-spin" />}
                <span>
                  {lang === 'te' ? 'మార్పులను నిర్ధారించండి' : 'Confirm Status Update'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
