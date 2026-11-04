import React, { useState, useEffect, useCallback } from 'react'
import { api } from '../../lib/api'
import { useLanguage } from '../../context/useLanguage'
import {
  Users,
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Ban,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Eye,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  X,
  CreditCard,
  TrendingUp,
  Receipt,
  FileText,
  UserCheck,
  HelpCircle,
} from 'lucide-react'

export default function AdminAffiliatesPage() {
  const { lang } = useLanguage()
  const [affiliates, setAffiliates] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [verifiedFilter, setVerifiedFilter] = useState('all')
  const [cityFilter, setCityFilter] = useState('')

  // Detail Modal
  const [selectedUser, setSelectedUser] = useState(null)
  const [detailData, setDetailData] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Fetch affiliates list
  const fetchAffiliates = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = { limit: 100, offset: 0 }
      if (statusFilter !== 'all') params.status = statusFilter
      if (verifiedFilter !== 'all') params.verified = verifiedFilter
      if (searchTerm.trim()) params.search = searchTerm.trim()
      if (cityFilter.trim()) params.city = cityFilter.trim()

      const res = await api.getAdminAffiliates(params)
      setAffiliates(res?.items || [])
      setTotalCount(res?.total || 0)
    } catch (err) {
      console.error('Failed to fetch affiliates:', err)
      setError(err.message || 'Failed to load affiliates directory')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, verifiedFilter, searchTerm, cityFilter])

  useEffect(() => {
    fetchAffiliates()
  }, [fetchAffiliates])

  // Open detail modal
  const handleOpenDetail = async (user) => {
    setSelectedUser(user)
    setDetailLoading(true)
    try {
      const data = await api.getAdminAffiliateDetail(user.id)
      setDetailData(data)
    } catch (err) {
      console.error('Failed to load affiliate detail:', err)
      setDetailData(null)
    } finally {
      setDetailLoading(false)
    }
  }

  // Quick Status Actions
  const handleApprove = async (userId) => {
    if (!window.confirm('Approve this affiliate account?')) return
    setActionLoading(true)
    try {
      await api.approveAffiliate(userId)
      await fetchAffiliates()
      if (selectedUser?.id === userId) {
        const data = await api.getAdminAffiliateDetail(userId)
        setDetailData(data)
      }
    } catch (err) {
      alert(err.message || 'Action failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSuspend = async (userId) => {
    const reason = window.prompt('Enter reason for suspension:')
    if (!reason || !reason.trim()) return
    setActionLoading(true)
    try {
      await api.suspendAffiliate(userId, reason)
      await fetchAffiliates()
      if (selectedUser?.id === userId) {
        const data = await api.getAdminAffiliateDetail(userId)
        setDetailData(data)
      }
    } catch (err) {
      alert(err.message || 'Action failed')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReinstate = async (userId) => {
    if (!window.confirm('Reinstate this affiliate account to approved status?')) return
    setActionLoading(true)
    try {
      await api.reinstateAffiliate(userId)
      await fetchAffiliates()
      if (selectedUser?.id === userId) {
        const data = await api.getAdminAffiliateDetail(userId)
        setDetailData(data)
      }
    } catch (err) {
      alert(err.message || 'Action failed')
    } finally {
      setActionLoading(false)
    }
  }

  // Aggregate stats
  const approvedCount = affiliates.filter((a) => a.status === 'approved').length
  const pendingCount = affiliates.filter((a) => a.status === 'pending' || a.status === 'info_requested').length
  const verifiedCount = affiliates.filter((a) => a.email_verified).length
  const suspendedCount = affiliates.filter((a) => a.status === 'suspended' || a.status === 'rejected').length

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} />
            {lang === 'te' ? 'ఆమోదించబడింది' : 'Approved'}
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={12} />
            {lang === 'te' ? 'పరిశీలనలో ఉంది' : 'Pending'}
          </span>
        )
      case 'info_requested':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <HelpCircle size={12} />
            {lang === 'te' ? 'వివరాలు కోరబడ్డాయి' : 'Info Requested'}
          </span>
        )
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
            <Ban size={12} />
            {lang === 'te' ? 'తాత్కాలిక నిలిపివేత' : 'Suspended'}
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300">
            <X size={12} />
            {lang === 'te' ? 'తిరస్కరించబడింది' : 'Rejected'}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#12101F]/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6B3CFF]/10 text-[#6B3CFF] flex items-center justify-center">
              <Users size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black font-headline text-[#12101F] tracking-tight">
                {lang === 'te' ? 'అఫిలియేట్ నిర్వహణ' : 'Affiliate Management Directory'}
              </h1>
              <p className="text-xs text-[#575266] mt-0.5">
                {lang === 'te'
                  ? 'నమోదైన అఫిలియేట్ భాగస్వాములు, ఖాతా స్థితి, కమిషన్లు మరియు చెల్లింపుల సమగ్ర సమాచారం.'
                  : 'Comprehensive directory of registered affiliates, account standing, earnings, and payment ledger.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={api.getAffiliatesCsvUrl({ status: statusFilter, city: cityFilter })}
            download
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#12101F]/15 text-[#12101F] text-xs font-bold hover:bg-slate-50 transition-all shadow-sm no-underline"
          >
            <Download size={15} />
            <span>{lang === 'te' ? 'CSV డౌన్‌లోడ్' : 'Export Directory CSV'}</span>
          </a>
          <button
            type="button"
            onClick={fetchAffiliates}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#5827EB] transition-all shadow-sm shadow-[#6B3CFF]/20 cursor-pointer border-none"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>{lang === 'te' ? 'రిఫ్రెష్' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#12101F]/10 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#827C94]">
            {lang === 'te' ? 'మొత్తం అఫిలియేట్లు' : 'Total Registered'}
          </div>
          <div className="text-2xl font-black text-[#12101F] mt-1">{totalCount}</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {approvedCount} {lang === 'te' ? 'ఆమోదించబడినవి' : 'active partners'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#12101F]/10 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#827C94]">
            {lang === 'te' ? 'ఈమెయిల్ వెరిఫైడ్' : 'Email Verified'}
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1">{verifiedCount}</div>
          <div className="text-[11px] text-[#575266] mt-1">
            {totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0}% verification rate
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#12101F]/10 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#827C94]">
            {lang === 'te' ? 'పరిశీలనలో ఉన్నవి' : 'Pending Review'}
          </div>
          <div className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</div>
          <div className="text-[11px] text-[#575266] mt-1">
            {lang === 'te' ? 'పరిశీలన అవసరం' : 'Requires admin action'}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#12101F]/10 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#827C94]">
            {lang === 'te' ? 'నిలిపివేత / తిరస్కరణ' : 'Suspended / Rejected'}
          </div>
          <div className="text-2xl font-black text-red-600 mt-1">{suspendedCount}</div>
          <div className="text-[11px] text-[#575266] mt-1">
            {lang === 'te' ? 'నిలిపివేయబడిన ఖాతాలు' : 'Restricted access'}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#12101F]/10 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#827C94]">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={
              lang === 'te'
                ? 'పేరు, ఈమెయిల్, మొబైల్ లేదా నగరం ద్వారా శోధించండి...'
                : 'Search by affiliate name, email, mobile, or city...'
            }
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-[#12101F]/10 text-xs text-[#12101F] placeholder-[#827C94] focus:outline-none focus:border-[#6B3CFF] focus:bg-white transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={15} className="text-[#827C94] hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-[#12101F]/10 text-xs font-semibold text-[#12101F] focus:outline-none focus:border-[#6B3CFF]"
          >
            <option value="all">{lang === 'te' ? 'అన్ని స్థితులు' : 'All Statuses'}</option>
            <option value="approved">{lang === 'te' ? 'ఆమోదించబడింది (Approved)' : 'Approved'}</option>
            <option value="pending">{lang === 'te' ? 'పరిశీలనలో ఉంది (Pending)' : 'Pending'}</option>
            <option value="info_requested">{lang === 'te' ? 'సమాచారం కోరబడింది' : 'Info Requested'}</option>
            <option value="suspended">{lang === 'te' ? 'సస్పెండ్ చేయబడింది' : 'Suspended'}</option>
            <option value="rejected">{lang === 'te' ? 'తిరస్కరించబడింది' : 'Rejected'}</option>
          </select>

          {/* Email Verified Filter */}
          <select
            value={verifiedFilter}
            onChange={(e) => setVerifiedFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-[#12101F]/10 text-xs font-semibold text-[#12101F] focus:outline-none focus:border-[#6B3CFF]"
          >
            <option value="all">{lang === 'te' ? 'వెరిఫికేషన్: అన్నీ' : 'Verification: All'}</option>
            <option value="true">{lang === 'te' ? 'ధృవీకరించబడింది' : 'Verified'}</option>
            <option value="false">{lang === 'te' ? 'ధృవీకరించబడలేదు' : 'Unverified'}</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-[#12101F]/10 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#827C94]">
            <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#6B3CFF]" />
            <p className="text-xs font-medium">{lang === 'te' ? 'లోడ్ అవుతోంది...' : 'Loading directory...'}</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 bg-red-50/50">
            <AlertCircle size={24} className="mx-auto mb-2" />
            <p className="text-xs font-bold">{error}</p>
          </div>
        ) : affiliates.length === 0 ? (
          <div className="p-12 text-center text-[#827C94]">
            <Users size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm font-bold text-[#12101F]">
              {lang === 'te' ? 'అఫిలియేట్లు కనుగొనబడలేదు' : 'No affiliates found'}
            </p>
            <p className="text-xs mt-1">
              {lang === 'te' ? 'మీ శోధన ప్రమాణాలను మార్చి ప్రయత్నించండి.' : 'Try adjusting your filters or search terms.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-[#12101F]/10 text-[#827C94] font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">{lang === 'te' ? 'అఫిలియేట్' : 'Affiliate Partner'}</th>
                  <th className="py-3.5 px-4">{lang === 'te' ? 'సంప్రదింపు / నగరం' : 'Contact / City'}</th>
                  <th className="py-3.5 px-4">{lang === 'te' ? 'ఖాతా స్థితి' : 'Account Status'}</th>
                  <th className="py-3.5 px-4 text-center">{lang === 'te' ? 'రెఫరల్స్' : 'Referrals'}</th>
                  <th className="py-3.5 px-4 text-right">{lang === 'te' ? 'కమిషన్ ఆదాయం' : 'Eligible Comm.'}</th>
                  <th className="py-3.5 px-4 text-right">{lang === 'te' ? 'చెల్లించాల్సినది' : 'Outstanding'}</th>
                  <th className="py-3.5 px-4 text-center">{lang === 'te' ? 'చర్య' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#12101F]/5 text-[#12101F]">
                {affiliates.map((aff) => (
                  <tr key={aff.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Partner Name & Email */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#12101F] text-xs flex items-center gap-1.5">
                        <span>{aff.full_name}</span>
                        {aff.email_verified && (
                          <span title="Email Verified" className="text-emerald-600">
                            <ShieldCheck size={13} />
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-[#575266]">{aff.email}</div>
                    </td>

                    {/* Contact & City */}
                    <td className="py-3 px-4 text-[#575266]">
                      <div className="flex items-center gap-1">
                        <MapPin size={11} className="text-[#827C94]" />
                        <span>{aff.city || 'N/A'}{aff.area ? `, ${aff.area}` : ''}</span>
                      </div>
                      {aff.mobile && (
                        <div className="flex items-center gap-1 font-mono text-[11px] text-[#827C94] mt-0.5">
                          <Phone size={11} />
                          <span>{aff.mobile}</span>
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4">{getStatusBadge(aff.status)}</td>

                    {/* Referrals */}
                    <td className="py-3 px-4 text-center">
                      <div className="font-bold text-[#12101F]">{aff.total_referrals}</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">
                        {aff.converted_referrals} {lang === 'te' ? 'కన్వర్టెడ్' : 'converted'}
                      </div>
                    </td>

                    {/* Eligible Commission */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-[#12101F]">
                      ₹{aff.eligible_commission?.toLocaleString('en-IN') || '0.00'}
                    </td>

                    {/* Outstanding Payment */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">
                      ₹{aff.outstanding_payment?.toLocaleString('en-IN') || '0.00'}
                    </td>

                    {/* Action Button */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(aff)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#6B3CFF]/10 text-[#6B3CFF] hover:bg-[#6B3CFF] hover:text-white transition-all font-bold text-xs cursor-pointer border-none"
                      >
                        <Eye size={13} />
                        <span>{lang === 'te' ? 'వివరాలు' : 'View'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Affiliate Detail Drawer / Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-[#0E0B1E]/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#12101F]/10 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#6B3CFF] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-[#6B3CFF]/30">
                  {selectedUser.full_name?.charAt(0) || 'A'}
                </div>
                <div>
                  <h2 className="text-lg font-black font-headline text-[#12101F]">
                    {selectedUser.full_name}
                  </h2>
                  <p className="font-mono text-xs text-[#575266]">{selectedUser.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="w-9 h-9 rounded-xl hover:bg-slate-200 flex items-center justify-center text-[#827C94] hover:text-[#12101F] border-none bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {detailLoading ? (
                <div className="py-12 text-center text-[#827C94]">
                  <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#6B3CFF]" />
                  <p className="text-xs">Loading affiliate profile and financials...</p>
                </div>
              ) : detailData ? (
                <>
                  {/* Account Standing & Governance Bar */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-[#12101F]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#827C94]">
                        Account Standing
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        {getStatusBadge(detailData.status)}
                        {detailData.email_verified && (
                          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                            <ShieldCheck size={14} /> Verified
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {detailData.status !== 'approved' && (
                        <button
                          type="button"
                          onClick={() => handleApprove(detailData.user_id)}
                          disabled={actionLoading}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 border-none cursor-pointer"
                        >
                          Approve Account
                        </button>
                      )}
                      {detailData.status === 'approved' && (
                        <button
                          type="button"
                          onClick={() => handleSuspend(detailData.user_id)}
                          disabled={actionLoading}
                          className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 border-none cursor-pointer"
                        >
                          Suspend Account
                        </button>
                      )}
                      {detailData.status === 'suspended' && (
                        <button
                          type="button"
                          onClick={() => handleReinstate(detailData.user_id)}
                          disabled={actionLoading}
                          className="px-3 py-1.5 rounded-lg bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#5025D1] border-none cursor-pointer"
                        >
                          Reinstate Account
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Financial Balance Summary */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-purple-900">
                        Eligible Commission
                      </div>
                      <div className="text-lg font-black text-[#6B3CFF] mt-1 font-mono">
                        ₹{detailData.eligible_commission?.toLocaleString('en-IN') || '0.00'}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                        Outstanding Payable
                      </div>
                      <div className="text-lg font-black text-amber-700 mt-1 font-mono">
                        ₹{detailData.outstanding_payment?.toLocaleString('en-IN') || '0.00'}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">
                        Converted Referrals
                      </div>
                      <div className="text-lg font-black text-emerald-700 mt-1">
                        {detailData.converted_referrals} / {detailData.total_referrals}
                      </div>
                    </div>
                  </div>

                  {/* Profile & Promotion Info */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#12101F]">
                      Profile Details & Promotion Plan
                    </h3>
                    <div className="p-4 rounded-2xl bg-white border border-[#12101F]/10 text-xs space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[#827C94]">Occupation:</span>{' '}
                          <span className="font-semibold text-[#12101F]">{detailData.occupation || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-[#827C94]">Location:</span>{' '}
                          <span className="font-semibold text-[#12101F]">
                            {detailData.city || 'N/A'}{detailData.area ? `, ${detailData.area}` : ''}
                          </span>
                        </div>
                      </div>
                      {detailData.promotion_plan && (
                        <div className="pt-2 border-t border-[#12101F]/5">
                          <span className="text-[#827C94] block mb-1">Promotion Strategy:</span>
                          <p className="text-[#575266] italic bg-slate-50 p-2.5 rounded-lg border border-[#12101F]/5">
                            "{detailData.promotion_plan}"
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Settlement & Banking Information */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#12101F] flex items-center gap-1.5">
                      <CreditCard size={14} className="text-[#6B3CFF]" />
                      <span>Bank Settlement Details</span>
                    </h3>
                    <div className="p-4 rounded-2xl bg-slate-50 border border-[#12101F]/10 text-xs space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-[#827C94]">Bank Name:</span>{' '}
                          <span className="font-semibold text-[#12101F]">{detailData.bank_name || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="text-[#827C94]">Account Number:</span>{' '}
                          <span className="font-mono font-semibold text-[#12101F]">
                            {detailData.bank_account_number || 'Not provided'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#827C94]">IFSC Code:</span>{' '}
                          <span className="font-mono font-semibold text-[#12101F]">
                            {detailData.bank_ifsc || 'Not provided'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#827C94]">UPI ID:</span>{' '}
                          <span className="font-mono font-semibold text-[#12101F]">{detailData.upi_id || 'Not provided'}</span>
                        </div>
                        <div>
                          <span className="text-[#827C94]">PAN Number:</span>{' '}
                          <span className="font-mono font-semibold text-[#12101F]">{detailData.pan_number || 'Not provided'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Referrals by this Affiliate */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#12101F]">
                      Referral Introductions ({detailData.referral_history?.length || 0})
                    </h3>
                    {detailData.referral_history?.length === 0 ? (
                      <p className="text-xs text-[#827C94] italic">No referrals submitted yet.</p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {detailData.referral_history.map((ref) => (
                          <div
                            key={ref.id}
                            className="p-3 rounded-xl bg-white border border-[#12101F]/10 flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-bold text-[#12101F]">{ref.client_name}</div>
                              <div className="text-[11px] text-[#575266]">
                                {ref.provider_name} • {ref.service_name}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-[#12101F]">
                                {ref.status}
                              </span>
                              {ref.conversion_value && (
                                <div className="text-[11px] font-mono font-bold text-emerald-600 mt-0.5">
                                  ₹{ref.conversion_value.toLocaleString('en-IN')}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
