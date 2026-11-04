import React, { useState, useEffect, useCallback } from 'react'
import { api } from '../../lib/api'
import { useLanguage } from '../../context/useLanguage'
import {
  Coins,
  TrendingUp,
  FileSpreadsheet,
  Download,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Building2,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownLeft,
  Filter,
  Search,
  Percent,
  Clock,
  Check,
  X,
  CreditCard,
  FileText,
} from 'lucide-react'

export default function AdminFinancePage() {
  const { lang } = useLanguage()
  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'agreements' | 'ledger'

  // Summary State
  const [summary, setSummary] = useState(null)
  const [summaryLoading, setSummaryLoading] = useState(true)

  // Agreements State
  const [agreements, setAgreements] = useState([])
  const [agreementsLoading, setAgreementsLoading] = useState(false)
  const [showCreateAgreementModal, setShowCreateAgreementModal] = useState(false)
  const [providersList, setProvidersList] = useState([])

  // Ledger State
  const [ledgerItems, setLedgerItems] = useState([])
  const [ledgerLoading, setLedgerLoading] = useState(false)
  const [ledgerStatusFilter, setLedgerStatusFilter] = useState('all')

  // Create Agreement Form State
  const [newAgreement, setNewAgreement] = useState({
    provider_id: '',
    service_id: '',
    agreement_type: 'percentage',
    provider_rate: 40,
    affiliate_rate: 20,
    sbloom_share_rate: 20,
    provider_fixed_amount: '',
    affiliate_fixed_amount: '',
    sbloom_fixed_amount: '',
    calculation_basis: 'transaction_value',
    eligibility_trigger: 'on_conversion',
    notes: '',
  })
  const [createAgrLoading, setCreateAgrLoading] = useState(false)
  const [createAgrError, setCreateAgrError] = useState('')

  // Fetch Financial Overview
  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true)
    try {
      const data = await api.getAdminFinanceSummary()
      setSummary(data)
    } catch (err) {
      console.error('Failed to load finance summary:', err)
    } finally {
      setSummaryLoading(false)
    }
  }, [])

  // Fetch Agreements
  const fetchAgreements = useCallback(async () => {
    setAgreementsLoading(true)
    try {
      const data = await api.getAdminAgreements()
      setAgreements(data || [])
    } catch (err) {
      console.error('Failed to load agreements:', err)
    } finally {
      setAgreementsLoading(false)
    }
  }, [])

  // Fetch Ledger
  const fetchLedger = useCallback(async () => {
    setLedgerLoading(true)
    try {
      const params = {}
      if (ledgerStatusFilter !== 'all') params.status = ledgerStatusFilter
      const data = await api.getAdminLedger(params)
      setLedgerItems(data || [])
    } catch (err) {
      console.error('Failed to load ledger:', err)
    } finally {
      setLedgerLoading(false)
    }
  }, [ledgerStatusFilter])

  // Fetch Providers for Agreement form
  const fetchProviders = async () => {
    try {
      const res = await api.getAdminProviders()
      setProvidersList(res || [])
    } catch (err) {
      console.error('Failed to load providers:', err)
    }
  }

  useEffect(() => {
    fetchSummary()
    fetchProviders()
  }, [fetchSummary])

  useEffect(() => {
    if (activeTab === 'agreements') fetchAgreements()
    if (activeTab === 'ledger') fetchLedger()
  }, [activeTab, fetchAgreements, fetchLedger])

  // Handle Create Agreement Submission
  const handleCreateAgreement = async (e) => {
    e.preventDefault()
    setCreateAgrError('')

    if (!newAgreement.provider_id) {
      setCreateAgrError('Please select a service provider.')
      return
    }

    if (newAgreement.agreement_type === 'percentage') {
      const prov = Number(newAgreement.provider_rate) || 0
      const aff = Number(newAgreement.affiliate_rate) || 0
      const sbloom = Number(newAgreement.sbloom_share_rate) || 0

      if (prov <= 0 || aff <= 0 || sbloom <= 0) {
        setCreateAgrError('All percentage rates must be greater than 0%.')
        return
      }

      if (Math.round((aff + sbloom) * 100) !== Math.round(prov * 100)) {
        setCreateAgrError(
          `Split mismatch: Affiliate Share (${aff}%) + sBLOOM Share (${sbloom}%) = ${aff + sbloom}%, which does not equal Provider Rate (${prov}%).`
        )
        return
      }
    }

    setCreateAgrLoading(true)
    try {
      const payload = {
        provider_id: newAgreement.provider_id,
        service_id: newAgreement.service_id || null,
        agreement_type: newAgreement.agreement_type,
        provider_rate: newAgreement.agreement_type === 'percentage' ? Number(newAgreement.provider_rate) : null,
        affiliate_rate: newAgreement.agreement_type === 'percentage' ? Number(newAgreement.affiliate_rate) : null,
        sbloom_share_rate: newAgreement.agreement_type === 'percentage' ? Number(newAgreement.sbloom_share_rate) : null,
        provider_fixed_amount: newAgreement.agreement_type === 'fixed' ? Number(newAgreement.provider_fixed_amount) : null,
        affiliate_fixed_amount: newAgreement.agreement_type === 'fixed' ? Number(newAgreement.affiliate_fixed_amount) : null,
        sbloom_fixed_amount: newAgreement.agreement_type === 'fixed' ? Number(newAgreement.sbloom_fixed_amount) : null,
        calculation_basis: newAgreement.calculation_basis,
        eligibility_trigger: newAgreement.eligibility_trigger,
        notes: newAgreement.notes || null,
      }

      await api.createAdminAgreement(payload)
      setShowCreateAgreementModal(false)
      await fetchAgreements()
    } catch (err) {
      console.error('Failed to create agreement:', err)
      setCreateAgrError(err.message || 'Failed to save agreement.')
    } finally {
      setCreateAgrLoading(false)
    }
  }

  // Handle Ledger Item Status Change (Dispute / Reversal)
  const handleUpdateLedgerStatus = async (ledgerId, newStatus) => {
    const reason = window.prompt(`Enter reason for marking this transaction as ${newStatus}:`)
    if (!reason || !reason.trim()) return

    try {
      await api.updateAdminLedgerStatus(ledgerId, newStatus, reason)
      await fetchLedger()
      await fetchSummary()
    } catch (err) {
      alert(err.message || 'Failed to update transaction status.')
    }
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#12101F]/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6B3CFF]/10 text-[#6B3CFF] flex items-center justify-center">
            <Coins size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black font-headline text-[#12101F] tracking-tight">
              {lang === 'te' ? 'కమిషన్ & ఫైనాన్స్ కేంద్రం' : 'Commission & Financial Management'}
            </h1>
            <p className="text-xs text-[#575266] mt-0.5">
              {lang === 'te'
                ? 'సేవా ప్రొవైడర్ల ఒప్పందాలు, కమిషన్ విభజన నియమాలు మరియు ఆర్థిక లెడ్జర్ నిర్వహణ.'
                : 'Commercial terms, commission splits, provider receivables, and affiliate payouts.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'ledger' && (
            <a
              href={api.getLedgerCsvUrl({ status: ledgerStatusFilter })}
              download
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#12101F]/15 text-[#12101F] text-xs font-bold hover:bg-slate-50 transition-all shadow-sm no-underline"
            >
              <Download size={14} />
              <span>Export Ledger CSV</span>
            </a>
          )}
          {activeTab === 'agreements' && (
            <button
              type="button"
              onClick={() => setShowCreateAgreementModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#5827EB] transition-all shadow-sm shadow-[#6B3CFF]/20 cursor-pointer border-none"
            >
              <Plus size={15} />
              <span>New Commission Agreement</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#12101F]/10 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#0E0B1E] text-white shadow-sm'
              : 'bg-transparent text-[#575266] hover:text-[#12101F]'
          }`}
        >
          {lang === 'te' ? 'ఫైనాన్షియల్ డాష్‌బోర్డ్' : 'Financial Dashboard'}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('agreements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
            activeTab === 'agreements'
              ? 'bg-[#0E0B1E] text-white shadow-sm'
              : 'bg-transparent text-[#575266] hover:text-[#12101F]'
          }`}
        >
          {lang === 'te' ? 'కమిషన్ ఒప్పందాలు' : 'Commission Agreements'}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('ledger')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer ${
            activeTab === 'ledger'
              ? 'bg-[#0E0B1E] text-white shadow-sm'
              : 'bg-transparent text-[#575266] hover:text-[#12101F]'
          }`}
        >
          {lang === 'te' ? 'కమిషన్ లెడ్జర్' : 'Transaction Ledger'}
        </button>
      </div>

      {/* TAB 1: FINANCIAL OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {summaryLoading ? (
            <div className="p-12 text-center text-[#827C94]">
              <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#6B3CFF]" />
              <p className="text-xs">Loading financial figures...</p>
            </div>
          ) : summary ? (
            <>
              {/* Financial KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* 1. Provider Receivables */}
                <div className="bg-white p-6 rounded-2xl border border-[#12101F]/10 shadow-xs relative overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                    <ArrowDownLeft size={20} />
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#827C94]">
                    Provider Receivables (Total Agreed)
                  </div>
                  <div className="text-2xl font-black text-[#12101F] mt-1 font-mono">
                    ₹{summary.provider_commission_eligible?.toLocaleString('en-IN') || '0.00'}
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#12101F]/5 text-xs flex justify-between items-center">
                    <span className="text-[#575266]">Collected from Providers:</span>
                    <span className="font-mono font-bold text-emerald-600">
                      ₹{summary.provider_commission_collected?.toLocaleString('en-IN') || '0.00'}
                    </span>
                  </div>
                  <div className="mt-1 text-xs flex justify-between items-center">
                    <span className="text-[#575266]">Outstanding Receivables:</span>
                    <span className="font-mono font-bold text-amber-700">
                      ₹{summary.provider_receivables_outstanding?.toLocaleString('en-IN') || '0.00'}
                    </span>
                  </div>
                </div>

                {/* 2. Affiliate Payables */}
                <div className="bg-white p-6 rounded-2xl border border-[#12101F]/10 shadow-xs relative overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6B3CFF] flex items-center justify-center mb-4">
                    <ArrowUpRight size={20} />
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#827C94]">
                    Affiliate Commissions (Payables)
                  </div>
                  <div className="text-2xl font-black text-[#12101F] mt-1 font-mono">
                    ₹{summary.affiliate_commission_earned?.toLocaleString('en-IN') || '0.00'}
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#12101F]/5 text-xs flex justify-between items-center">
                    <span className="text-[#575266]">Paid to Affiliates:</span>
                    <span className="font-mono font-bold text-emerald-600">
                      ₹{summary.affiliate_commission_paid?.toLocaleString('en-IN') || '0.00'}
                    </span>
                  </div>
                  <div className="mt-1 text-xs flex justify-between items-center">
                    <span className="text-[#575266]">Outstanding Payables:</span>
                    <span className="font-mono font-bold text-purple-700">
                      ₹{summary.affiliate_payables_outstanding?.toLocaleString('en-IN') || '0.00'}
                    </span>
                  </div>
                </div>

                {/* 3. sBLOOM Retained Margin */}
                <div className="bg-[#0E0B1E] text-white p-6 rounded-2xl border border-white/10 shadow-lg relative overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-[#6B3CFF]/20 text-[#D6F36B] flex items-center justify-center mb-4">
                    <TrendingUp size={20} />
                  </div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white/50">
                    sBLOOM Retained Commission
                  </div>
                  <div className="text-2xl font-black text-white mt-1 font-mono">
                    ₹{summary.sbloom_retained_commission?.toLocaleString('en-IN') || '0.00'}
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 text-xs flex justify-between items-center">
                    <span className="text-white/60">Net Realized Retained:</span>
                    <span className="font-mono font-bold text-[#D6F36B]">
                      ₹{summary.sbloom_net_retained?.toLocaleString('en-IN') || '0.00'}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-white/40">
                    Calculated from actual collected collections less affiliate disbursements
                  </div>
                </div>
              </div>

              {/* Monthly Financial Breakdown */}
              <div className="bg-white p-6 rounded-2xl border border-[#12101F]/10 shadow-xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#12101F] flex items-center gap-2">
                  <Calendar size={16} className="text-[#6B3CFF]" />
                  <span>Monthly Commission Performance</span>
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-[#827C94] uppercase tracking-wider text-[10px] border-b border-[#12101F]/10">
                        <th className="py-3 px-4">Billing Month</th>
                        <th className="py-3 px-4 text-right">Provider Commission (Gross)</th>
                        <th className="py-3 px-4 text-right">Affiliate Share (Net)</th>
                        <th className="py-3 px-4 text-right">sBLOOM Retained</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#12101F]/5 font-mono">
                      {summary.month_breakdown?.map((m) => (
                        <tr key={m.month} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-sans font-bold text-[#12101F]">{m.month}</td>
                          <td className="py-3 px-4 text-right text-blue-700">₹{m.provider_commission.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4 text-right text-purple-700">₹{m.affiliate_commission.toLocaleString('en-IN')}</td>
                          <td className="py-3 px-4 text-right text-emerald-700 font-bold">₹{m.sbloom_retained.toLocaleString('en-IN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Provider-Wise Breakdown */}
              <div className="bg-white p-6 rounded-2xl border border-[#12101F]/10 shadow-xs space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#12101F] flex items-center gap-2">
                  <Building2 size={16} className="text-[#6B3CFF]" />
                  <span>Provider Commission Breakdown</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {summary.provider_breakdown?.map((p) => (
                    <div key={p.provider_id} className="p-4 rounded-xl border border-[#12101F]/10 bg-slate-50/50">
                      <div className="font-bold text-[#12101F] text-sm">{p.provider_name}</div>
                      <div className="text-[11px] text-[#575266] uppercase tracking-wider mt-0.5">
                        Sector: {p.sector}
                      </div>
                      <div className="mt-3 text-xs flex justify-between">
                        <span className="text-[#827C94]">Total Referrals:</span>
                        <span className="font-semibold text-[#12101F]">{p.total_referrals} ({p.converted_referrals} converted)</span>
                      </div>
                      <div className="mt-1 text-xs flex justify-between">
                        <span className="text-[#827C94]">Total Commission:</span>
                        <span className="font-mono font-bold text-emerald-600">₹{p.total_commission_eligible.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* TAB 2: COMMISSION AGREEMENTS */}
      {activeTab === 'agreements' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#12101F]/10 shadow-xs overflow-hidden">
            {agreementsLoading ? (
              <div className="p-12 text-center text-[#827C94]">
                <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#6B3CFF]" />
                <p className="text-xs">Loading commission agreements...</p>
              </div>
            ) : agreements.length === 0 ? (
              <div className="p-12 text-center text-[#827C94]">
                <FileSpreadsheet size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm font-bold text-[#12101F]">No commission agreements configured</p>
                <button
                  type="button"
                  onClick={() => setShowCreateAgreementModal(true)}
                  className="mt-3 px-4 py-2 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold border-none cursor-pointer"
                >
                  Create First Agreement
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[#827C94] uppercase tracking-wider text-[10px] border-b border-[#12101F]/10">
                      <th className="py-3.5 px-4">Provider / Service</th>
                      <th className="py-3.5 px-4">Agreement Model</th>
                      <th className="py-3.5 px-4 text-center">Provider Rate</th>
                      <th className="py-3.5 px-4 text-center">Affiliate Share</th>
                      <th className="py-3.5 px-4 text-center">sBLOOM Share</th>
                      <th className="py-3.5 px-4">Effective Date</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#12101F]/5 text-[#12101F]">
                    {agreements.map((agr) => (
                      <tr key={agr.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#12101F] text-xs">{agr.provider_name}</div>
                          <div className="text-[11px] text-[#575266]">
                            {agr.service_name ? `Service: ${agr.service_name}` : 'All Provider Services (Default)'}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="capitalize font-medium text-[#12101F]">{agr.agreement_type}</span>
                          <div className="text-[10px] text-[#827C94]">Trigger: {agr.eligibility_trigger}</div>
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono font-bold text-blue-700">
                          {agr.agreement_type === 'percentage' ? `${agr.provider_rate}%` : `₹${agr.provider_fixed_amount}`}
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono font-bold text-purple-700">
                          {agr.agreement_type === 'percentage' ? `${agr.affiliate_rate}%` : `₹${agr.affiliate_fixed_amount}`}
                        </td>

                        <td className="py-3.5 px-4 text-center font-mono font-bold text-emerald-700">
                          {agr.agreement_type === 'percentage' ? `${agr.sbloom_share_rate}%` : `₹${agr.sbloom_fixed_amount}`}
                        </td>

                        <td className="py-3.5 px-4 text-[#575266]">
                          {new Date(agr.effective_date).toLocaleDateString()}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              agr.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-[#575266]'
                            }`}
                          >
                            {agr.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: COMMISSION LEDGER */}
      {activeTab === 'ledger' && (
        <div className="space-y-6">
          {/* Status Filter */}
          <div className="bg-white p-4 rounded-2xl border border-[#12101F]/10 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={15} className="text-[#827C94]" />
              <span className="text-xs font-bold text-[#827C94] uppercase tracking-wider">Status Filter:</span>
              <select
                value={ledgerStatusFilter}
                onChange={(e) => setLedgerStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-[#12101F]/10 text-xs font-semibold text-[#12101F]"
              >
                <option value="all">All Transaction Statuses</option>
                <option value="eligible">Eligible (Uninvoiced)</option>
                <option value="invoiced_to_provider">Invoiced to Provider</option>
                <option value="collected_from_provider">Collected from Provider</option>
                <option value="invoiced_by_affiliate">Invoiced by Affiliate</option>
                <option value="paid_to_affiliate">Paid to Affiliate</option>
                <option value="disputed">Disputed</option>
                <option value="reversed">Reversed</option>
              </select>
            </div>

            <div className="text-xs text-[#827C94]">
              Showing <span className="font-bold text-[#12101F]">{ledgerItems.length}</span> ledger records
            </div>
          </div>

          {/* Ledger Table */}
          <div className="bg-white rounded-2xl border border-[#12101F]/10 shadow-xs overflow-hidden">
            {ledgerLoading ? (
              <div className="p-12 text-center text-[#827C94]">
                <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#6B3CFF]" />
                <p className="text-xs">Loading ledger transactions...</p>
              </div>
            ) : ledgerItems.length === 0 ? (
              <div className="p-12 text-center text-[#827C94]">
                <Coins size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm font-bold text-[#12101F]">No ledger transactions found</p>
                <p className="text-xs mt-1">Conversions recorded on qualified leads will appear here automatically.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[#827C94] uppercase tracking-wider text-[10px] border-b border-[#12101F]/10">
                      <th className="py-3 px-4">Date / Customer</th>
                      <th className="py-3 px-4">Provider / Service</th>
                      <th className="py-3 px-4">Affiliate</th>
                      <th className="py-3 px-4 text-right">Transaction Value</th>
                      <th className="py-3 px-4 text-right">Provider Comm.</th>
                      <th className="py-3 px-4 text-right">Affiliate Share</th>
                      <th className="py-3 px-4 text-right">sBLOOM Margin</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#12101F]/5 text-[#12101F]">
                    {ledgerItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#12101F]">{item.customer_name || 'Client'}</div>
                          <div className="text-[10px] text-[#827C94]">
                            {new Date(item.created_at).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-[#12101F]">{item.provider_name}</div>
                          <div className="text-[10px] text-[#575266]">{item.service_name}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-medium text-[#12101F]">{item.affiliate_name || 'Affiliate'}</div>
                          <div className="text-[10px] font-mono text-[#827C94]">{item.affiliate_email}</div>
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-bold text-[#12101F]">
                          ₹{item.eligible_transaction_value?.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-bold text-blue-700">
                          ₹{item.provider_commission_amount?.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-bold text-purple-700">
                          ₹{item.affiliate_commission_amount?.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700">
                          ₹{item.sbloom_retained_amount?.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              item.status === 'eligible'
                                ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                : item.status === 'invoiced_to_provider'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : item.status === 'collected_from_provider'
                                ? 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                                : item.status === 'paid_to_affiliate'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}
                          >
                            {item.status?.replace(/_/g, ' ')}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-center">
                          {item.status !== 'reversed' && item.status !== 'disputed' && (
                            <button
                              type="button"
                              onClick={() => handleUpdateLedgerStatus(item.id, 'disputed')}
                              className="px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 hover:bg-red-100 hover:text-red-700 transition-all border-none cursor-pointer"
                            >
                              Dispute
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE AGREEMENT MODAL */}
      {showCreateAgreementModal && (
        <div className="fixed inset-0 z-50 bg-[#0E0B1E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-[#12101F]/10 pb-4">
              <div>
                <h2 className="text-lg font-black font-headline text-[#12101F]">
                  New Commission Agreement
                </h2>
                <p className="text-xs text-[#575266] mt-0.5">
                  Configure provider commission terms and affiliate-sBLOOM sharing split.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateAgreementModal(false)}
                className="w-8 h-8 rounded-lg text-[#827C94] hover:bg-slate-100 flex items-center justify-center border-none bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {createAgrError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <div>{createAgrError}</div>
              </div>
            )}

            <form onSubmit={handleCreateAgreement} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                  Service Provider *
                </label>
                <select
                  value={newAgreement.provider_id}
                  onChange={(e) => setNewAgreement({ ...newAgreement, provider_id: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#12101F]/15 bg-white text-xs font-semibold text-[#12101F]"
                  required
                >
                  <option value="">Select a Service Provider...</option>
                  {providersList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sector})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                  Agreement Model
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewAgreement({ ...newAgreement, agreement_type: 'percentage' })}
                    className={`py-2 rounded-xl font-bold border ${
                      newAgreement.agreement_type === 'percentage'
                        ? 'bg-[#6B3CFF] text-white border-[#6B3CFF]'
                        : 'bg-slate-50 text-[#575266] border-[#12101F]/10'
                    }`}
                  >
                    Percentage Split (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAgreement({ ...newAgreement, agreement_type: 'fixed' })}
                    className={`py-2 rounded-xl font-bold border ${
                      newAgreement.agreement_type === 'fixed'
                        ? 'bg-[#6B3CFF] text-white border-[#6B3CFF]'
                        : 'bg-slate-50 text-[#575266] border-[#12101F]/10'
                    }`}
                  >
                    Fixed Amounts (₹)
                  </button>
                </div>
              </div>

              {newAgreement.agreement_type === 'percentage' ? (
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
                  <div className="font-bold text-xs text-purple-950">
                    Commission Sharing Split Calculator
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#827C94] mb-1">
                        Provider Total (%)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        max="100"
                        value={newAgreement.provider_rate}
                        onChange={(e) => setNewAgreement({ ...newAgreement, provider_rate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-[#12101F]/15 bg-white font-mono font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#827C94] mb-1">
                        Affiliate Share (%)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        max="100"
                        value={newAgreement.affiliate_rate}
                        onChange={(e) => setNewAgreement({ ...newAgreement, affiliate_rate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-[#12101F]/15 bg-white font-mono font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#827C94] mb-1">
                        sBLOOM Share (%)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="1"
                        max="100"
                        value={newAgreement.sbloom_share_rate}
                        onChange={(e) => setNewAgreement({ ...newAgreement, sbloom_share_rate: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-[#12101F]/15 bg-white font-mono font-bold"
                        required
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-[#575266]">
                    Example: Provider pays <strong>40%</strong> total commission. Affiliate gets <strong>20%</strong>, sBLOOM retains <strong>20%</strong>.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
                  <div className="font-bold text-xs text-purple-950">Fixed Commission Amounts (₹)</div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#827C94] mb-1">
                        Provider Total (₹)
                      </label>
                      <input
                        type="number"
                        value={newAgreement.provider_fixed_amount}
                        onChange={(e) => setNewAgreement({ ...newAgreement, provider_fixed_amount: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-[#12101F]/15 bg-white font-mono font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#827C94] mb-1">
                        Affiliate Share (₹)
                      </label>
                      <input
                        type="number"
                        value={newAgreement.affiliate_fixed_amount}
                        onChange={(e) => setNewAgreement({ ...newAgreement, affiliate_fixed_amount: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-[#12101F]/15 bg-white font-mono font-bold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-[#827C94] mb-1">
                        sBLOOM Share (₹)
                      </label>
                      <input
                        type="number"
                        value={newAgreement.sbloom_fixed_amount}
                        onChange={(e) => setNewAgreement({ ...newAgreement, sbloom_fixed_amount: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-[#12101F]/15 bg-white font-mono font-bold"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateAgreementModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#12101F]/15 bg-white text-xs font-bold text-[#575266] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createAgrLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#5827EB] cursor-pointer border-none shadow-md shadow-[#6B3CFF]/20"
                >
                  {createAgrLoading ? 'Saving...' : 'Save Agreement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

