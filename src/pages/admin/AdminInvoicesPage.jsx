import React, { useState, useEffect, useCallback } from 'react'
import { api } from '../../lib/api'
import { useLanguage } from '../../context/useLanguage'
import {
  Receipt,
  FileText,
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Building2,
  User,
  CreditCard,
  Download,
  Calendar,
  Clock,
  Eye,
  Check,
  X,
  ArrowRight,
  Printer,
  DollarSign,
} from 'lucide-react'

export default function AdminInvoicesPage() {
  const { lang } = useLanguage()
  const [activeTab, setActiveTab] = useState('provider') // 'provider' | 'affiliate'

  // Provider Invoices State
  const [providerInvoices, setProviderInvoices] = useState([])
  const [provLoading, setProvLoading] = useState(false)
  const [showCreateProvModal, setShowCreateProvModal] = useState(false)
  const [providersList, setProvidersList] = useState([])
  const [selectedProviderId, setSelectedProviderId] = useState('')
  const [uninvoicedLedger, setUninvoicedLedger] = useState([])
  const [selectedLedgerIds, setSelectedLedgerIds] = useState([])
  const [provDueDate, setProvDueDate] = useState('')
  const [provGstin, setProvGstin] = useState('')
  const [provTaxRate, setProvTaxRate] = useState(0)
  const [createProvLoading, setCreateProvLoading] = useState(false)

  // Payment Recording for Provider Invoices
  const [payingInvoice, setPayingInvoice] = useState(null)
  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    payment_method: 'bank_transfer',
    payment_reference: '',
    notes: '',
  })
  const [payLoading, setPayLoading] = useState(false)

  // Affiliate Invoices State
  const [affiliateInvoices, setAffiliateInvoices] = useState([])
  const [affLoading, setAffLoading] = useState(false)

  // Payout Recording for Affiliate Invoices
  const [payoutInvoice, setPayoutInvoice] = useState(null)
  const [payoutForm, setPayoutForm] = useState({
    payout_reference: '',
    payout_method: 'bank_transfer',
    notes: '',
  })
  const [payoutLoading, setPayoutLoading] = useState(false)

  // Invoice Inspection Modal
  const [inspectingInvoice, setInspectingInvoice] = useState(null)
  const [inspectType, setInspectType] = useState('provider') // 'provider' | 'affiliate'

  // Fetch Provider Invoices
  const fetchProviderInvoices = useCallback(async () => {
    setProvLoading(true)
    try {
      const data = await api.getAdminProviderInvoices()
      setProviderInvoices(data || [])
    } catch (err) {
      console.error('Failed to load provider invoices:', err)
    } finally {
      setProvLoading(false)
    }
  }, [])

  // Fetch Affiliate Invoices
  const fetchAffiliateInvoices = useCallback(async () => {
    setAffLoading(true)
    try {
      const data = await api.getAdminAffiliateInvoices()
      setAffiliateInvoices(data || [])
    } catch (err) {
      console.error('Failed to load affiliate invoices:', err)
    } finally {
      setAffLoading(false)
    }
  }, [])

  // Load providers for invoice creation
  const fetchProviders = async () => {
    try {
      const res = await api.getAdminProviders()
      setProvidersList(res || [])
    } catch (err) {
      console.error('Failed to load providers:', err)
    }
  }

  useEffect(() => {
    fetchProviderInvoices()
    fetchAffiliateInvoices()
    fetchProviders()
  }, [fetchProviderInvoices, fetchAffiliateInvoices])

  // When selected provider changes in modal, load their uninvoiced ledger items
  useEffect(() => {
    if (!selectedProviderId) {
      setUninvoicedLedger([])
      setSelectedLedgerIds([])
      return
    }
    const loadUninvoiced = async () => {
      try {
        const data = await api.getAdminLedger({
          provider_id: selectedProviderId,
          status: 'eligible',
        })
        setUninvoicedLedger(data || [])
        setSelectedLedgerIds((data || []).map((i) => i.id))
      } catch (err) {
        console.error('Failed to load uninvoiced ledger:', err)
      }
    }
    loadUninvoiced()
  }, [selectedProviderId])

  // Create Provider Invoice
  const handleCreateProviderInvoice = async (e) => {
    e.preventDefault()
    if (!selectedProviderId || selectedLedgerIds.length === 0) {
      alert('Please select a provider and at least one referral transaction.')
      return
    }
    setCreateProvLoading(true)
    try {
      const payload = {
        provider_id: selectedProviderId,
        ledger_ids: selectedLedgerIds,
        due_date: provDueDate ? new Date(provDueDate).toISOString() : new Date(Date.now() + 15 * 86400000).toISOString(),
        provider_gstin: provGstin || null,
        tax_rate: Number(provTaxRate) || 0,
      }
      await api.createAdminProviderInvoice(payload)
      setShowCreateProvModal(false)
      setSelectedProviderId('')
      await fetchProviderInvoices()
    } catch (err) {
      alert(err.message || 'Failed to create provider invoice.')
    } finally {
      setCreateProvLoading(false)
    }
  }

  // Record Provider Payment
  const handleRecordProviderPayment = async (e) => {
    e.preventDefault()
    if (!payingInvoice) return
    setPayLoading(true)
    try {
      await api.recordProviderPayment(payingInvoice.id, {
        amount: Number(paymentForm.amount),
        payment_method: paymentForm.payment_method,
        payment_reference: paymentForm.payment_reference.trim(),
        notes: paymentForm.notes.trim() || null,
      })
      setPayingInvoice(null)
      setPaymentForm({ amount: '', payment_method: 'bank_transfer', payment_reference: '', notes: '' })
      await fetchProviderInvoices()
    } catch (err) {
      alert(err.message || 'Failed to record payment.')
    } finally {
      setPayLoading(false)
    }
  }

  // Cancel Provider Invoice
  const handleCancelProviderInvoice = async (invoiceId) => {
    const reason = window.prompt('Enter reason for cancelling this provider invoice:')
    if (!reason || !reason.trim()) return
    try {
      await api.cancelProviderInvoice(invoiceId, reason)
      await fetchProviderInvoices()
    } catch (err) {
      alert(err.message || 'Failed to cancel invoice.')
    }
  }

  // Approve Affiliate Invoice
  const handleApproveAffiliateInvoice = async (invoiceId) => {
    if (!window.confirm('Approve this affiliate invoice for settlement payout?')) return
    try {
      await api.approveAdminAffiliateInvoice(invoiceId)
      await fetchAffiliateInvoices()
    } catch (err) {
      alert(err.message || 'Failed to approve invoice.')
    }
  }

  // Reject Affiliate Invoice
  const handleRejectAffiliateInvoice = async (invoiceId) => {
    const reason = window.prompt('Enter reason for rejecting this affiliate invoice:')
    if (!reason || !reason.trim()) return
    try {
      await api.rejectAdminAffiliateInvoice(invoiceId, reason)
      await fetchAffiliateInvoices()
    } catch (err) {
      alert(err.message || 'Failed to reject invoice.')
    }
  }

  // Record Affiliate Payout
  const handleRecordAffiliatePayout = async (e) => {
    e.preventDefault()
    if (!payoutInvoice) return
    setPayoutLoading(true)
    try {
      await api.recordAdminAffiliatePayout(payoutInvoice.id, {
        payout_reference: payoutForm.payout_reference.trim(),
        payout_method: payoutForm.payout_method,
        notes: payoutForm.notes.trim() || null,
      })
      setPayoutInvoice(null)
      setPayoutForm({ payout_reference: '', payout_method: 'bank_transfer', notes: '' })
      await fetchAffiliateInvoices()
    } catch (err) {
      alert(err.message || 'Failed to record payout.')
    } finally {
      setPayoutLoading(false)
    }
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#12101F]/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6B3CFF]/10 text-[#6B3CFF] flex items-center justify-center">
            <Receipt size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-black font-headline text-[#12101F] tracking-tight">
              {lang === 'te' ? 'ఇన్‌వాయిస్ & చెల్లింపుల నిర్వహణ' : 'Invoice & Settlement Management'}
            </h1>
            <p className="text-xs text-[#575266] mt-0.5">
              {lang === 'te'
                ? 'సేవా ప్రొవైడర్లకు పంపే ఇన్‌వాయిస్‌లు మరియు అఫిలియేట్ల నుండి వచ్చే క్లెయిమ్‌ల పూర్తి నిర్వహణ.'
                : 'Bilateral invoicing system: sBLOOM bills Providers & Affiliates bill sBLOOM.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'provider' && (
            <button
              type="button"
              onClick={() => setShowCreateProvModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#5827EB] transition-all shadow-sm shadow-[#6B3CFF]/20 cursor-pointer border-none"
            >
              <Plus size={15} />
              <span>Bill a Service Provider</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#12101F]/10 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('provider')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-2 ${
            activeTab === 'provider'
              ? 'bg-[#0E0B1E] text-white shadow-sm'
              : 'bg-transparent text-[#575266] hover:text-[#12101F]'
          }`}
        >
          <Building2 size={14} />
          <span>Provider Invoices (sBLOOM &rarr; Providers)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {providerInvoices.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('affiliate')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-2 ${
            activeTab === 'affiliate'
              ? 'bg-[#0E0B1E] text-white shadow-sm'
              : 'bg-transparent text-[#575266] hover:text-[#12101F]'
          }`}
        >
          <User size={14} />
          <span>Affiliate Claims (Affiliates &rarr; sBLOOM)</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
            {affiliateInvoices.length}
          </span>
        </button>
      </div>

      {/* TAB 1: PROVIDER INVOICES */}
      {activeTab === 'provider' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#12101F]/10 shadow-xs overflow-hidden">
            {provLoading ? (
              <div className="p-12 text-center text-[#827C94]">
                <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#6B3CFF]" />
                <p className="text-xs">Loading provider invoices...</p>
              </div>
            ) : providerInvoices.length === 0 ? (
              <div className="p-12 text-center text-[#827C94]">
                <Receipt size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm font-bold text-[#12101F]">No provider invoices issued yet</p>
                <p className="text-xs mt-1">Generate an invoice to bill a provider for verified converted referrals.</p>
                <button
                  type="button"
                  onClick={() => setShowCreateProvModal(true)}
                  className="mt-3 px-4 py-2 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold border-none cursor-pointer"
                >
                  Create First Provider Invoice
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[#827C94] uppercase tracking-wider text-[10px] border-b border-[#12101F]/10">
                      <th className="py-3.5 px-4">Invoice #</th>
                      <th className="py-3.5 px-4">Service Provider</th>
                      <th className="py-3.5 px-4">Invoice Date / Due</th>
                      <th className="py-3.5 px-4 text-right">Subtotal</th>
                      <th className="py-3.5 px-4 text-right">Total Billed</th>
                      <th className="py-3.5 px-4 text-right">Amount Paid</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#12101F]/5 text-[#12101F]">
                    {providerInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#6B3CFF]">
                          {inv.invoice_number}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#12101F]">{inv.provider_name}</div>
                          {inv.provider_gstin && (
                            <div className="text-[10px] text-[#827C94]">GSTIN: {inv.provider_gstin}</div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-[#575266]">
                          <div>{new Date(inv.invoice_date).toLocaleDateString()}</div>
                          <div className="text-[10px] text-[#827C94]">
                            Due: {new Date(inv.due_date).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono">
                          ₹{inv.subtotal_amount?.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-bold text-[#12101F]">
                          ₹{inv.total_amount?.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">
                          ₹{inv.amount_paid?.toLocaleString('en-IN') || '0.00'}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              inv.status === 'paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : inv.status === 'partially_paid'
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : inv.status === 'cancelled'
                                ? 'bg-slate-100 text-slate-500'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {inv.status?.replace('_', ' ')}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setInspectingInvoice(inv)
                                setInspectType('provider')
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-[#12101F] hover:bg-slate-200 font-bold text-xs border-none cursor-pointer"
                            >
                              <Eye size={12} className="inline mr-1" /> View
                            </button>

                            {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setPayingInvoice(inv)
                                  setPaymentForm({
                                    amount: inv.total_amount - (inv.amount_paid || 0),
                                    payment_method: 'bank_transfer',
                                    payment_reference: '',
                                    notes: '',
                                  })
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs border-none cursor-pointer"
                              >
                                Record Pay
                              </button>
                            )}

                            {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                              <button
                                type="button"
                                onClick={() => handleCancelProviderInvoice(inv.id)}
                                className="px-2 py-1.5 rounded-lg bg-slate-100 text-red-600 hover:bg-red-50 text-xs font-bold border-none cursor-pointer"
                                title="Cancel Invoice"
                              >
                                <X size={12} />
                              </button>
                            )}
                          </div>
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

      {/* TAB 2: AFFILIATE INVOICES */}
      {activeTab === 'affiliate' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#12101F]/10 shadow-xs overflow-hidden">
            {affLoading ? (
              <div className="p-12 text-center text-[#827C94]">
                <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#6B3CFF]" />
                <p className="text-xs">Loading affiliate claims...</p>
              </div>
            ) : affiliateInvoices.length === 0 ? (
              <div className="p-12 text-center text-[#827C94]">
                <FileText size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm font-bold text-[#12101F]">No affiliate claims submitted yet</p>
                <p className="text-xs mt-1">Affiliates generate monthly invoices from their portal when eligible commissions accrue.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[#827C94] uppercase tracking-wider text-[10px] border-b border-[#12101F]/10">
                      <th className="py-3.5 px-4">Invoice #</th>
                      <th className="py-3.5 px-4">Affiliate Partner</th>
                      <th className="py-3.5 px-4">Billing Period</th>
                      <th className="py-3.5 px-4 text-right">Subtotal</th>
                      <th className="py-3.5 px-4 text-right">TDS (Tax)</th>
                      <th className="py-3.5 px-4 text-right">Net Payable</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#12101F]/5 text-[#12101F]">
                    {affiliateInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#6B3CFF]">
                          {inv.invoice_number}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#12101F]">{inv.affiliate_name}</div>
                          <div className="text-[11px] font-mono text-[#575266]">{inv.affiliate_email}</div>
                          {inv.bank_account_number && (
                            <div className="text-[10px] text-[#827C94]">
                              A/C: {inv.bank_account_number} • {inv.bank_ifsc}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-[#12101F]">
                          {inv.billing_period}
                          <div className="text-[10px] text-[#827C94]">
                            {new Date(inv.invoice_date).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono">
                          ₹{inv.subtotal_amount?.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono text-red-600">
                          -₹{inv.tds_amount?.toLocaleString('en-IN') || '0.00'}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-bold text-[#12101F]">
                          ₹{inv.total_payable?.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              inv.status === 'paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : inv.status === 'approved'
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : inv.status === 'rejected'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-amber-50 text-amber-800 border border-amber-200'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setInspectingInvoice(inv)
                                setInspectType('affiliate')
                              }}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 text-[#12101F] hover:bg-slate-200 font-bold text-xs border-none cursor-pointer"
                            >
                              <Eye size={12} className="inline mr-1" /> View
                            </button>

                            {inv.status === 'submitted' && (
                              <button
                                type="button"
                                onClick={() => handleApproveAffiliateInvoice(inv.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-[#6B3CFF] text-white hover:bg-[#5025D1] font-bold text-xs border-none cursor-pointer"
                              >
                                Approve
                              </button>
                            )}

                            {inv.status === 'approved' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setPayoutInvoice(inv)
                                  setPayoutForm({ payout_reference: '', payout_method: 'bank_transfer', notes: '' })
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs border-none cursor-pointer"
                              >
                                Payout
                              </button>
                            )}

                            {inv.status === 'submitted' && (
                              <button
                                type="button"
                                onClick={() => handleRejectAffiliateInvoice(inv.id)}
                                className="px-2 py-1.5 rounded-lg bg-slate-100 text-red-600 hover:bg-red-50 text-xs font-bold border-none cursor-pointer"
                                title="Reject Claim"
                              >
                                <X size={12} />
                              </button>
                            )}
                          </div>
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

      {/* GENERATE PROVIDER INVOICE MODAL */}
      {showCreateProvModal && (
        <div className="fixed inset-0 z-50 bg-[#0E0B1E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#12101F]/10 pb-4">
              <div>
                <h2 className="text-lg font-black font-headline text-[#12101F]">
                  Bill a Service Provider
                </h2>
                <p className="text-xs text-[#575266] mt-0.5">
                  Generate an official invoice for verified eligible referral transactions.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateProvModal(false)}
                className="w-8 h-8 rounded-lg text-[#827C94] hover:bg-slate-100 flex items-center justify-center border-none bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProviderInvoice} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                  Select Provider *
                </label>
                <select
                  value={selectedProviderId}
                  onChange={(e) => setSelectedProviderId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#12101F]/15 bg-white text-xs font-semibold text-[#12101F]"
                  required
                >
                  <option value="">Choose a Service Provider...</option>
                  {providersList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.sector})
                    </option>
                  ))}
                </select>
              </div>

              {selectedProviderId && (
                <>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                      Eligible Uninvoiced Transactions ({uninvoicedLedger.length})
                    </label>
                    {uninvoicedLedger.length === 0 ? (
                      <p className="text-xs text-amber-700 italic bg-amber-50 p-3 rounded-xl border border-amber-200">
                        No uninvoiced converted referrals found for this provider. Convert leads first.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-40 overflow-y-auto border border-[#12101F]/10 rounded-xl p-2 bg-slate-50">
                        {uninvoicedLedger.map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-[#12101F]/5 cursor-pointer hover:bg-purple-50/50"
                          >
                            <input
                              type="checkbox"
                              checked={selectedLedgerIds.includes(item.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLedgerIds([...selectedLedgerIds, item.id])
                                } else {
                                  setSelectedLedgerIds(selectedLedgerIds.filter((id) => id !== item.id))
                                }
                              }}
                              className="accent-[#6B3CFF]"
                            />
                            <div className="flex-1 flex justify-between items-center text-xs">
                              <div>
                                <span className="font-bold text-[#12101F]">{item.customer_name}</span>
                                <span className="text-[#827C94] text-[11px] ml-2">({item.service_name})</span>
                              </div>
                              <span className="font-mono font-bold text-blue-700">
                                ₹{item.provider_commission_amount?.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                        Payment Due Date
                      </label>
                      <input
                        type="date"
                        value={provDueDate}
                        onChange={(e) => setProvDueDate(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#12101F]/15 bg-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                        Provider GSTIN
                      </label>
                      <input
                        type="text"
                        placeholder="36AAAAA0000A1Z5"
                        value={provGstin}
                        onChange={(e) => setProvGstin(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#12101F]/15 bg-white text-xs font-mono uppercase"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-[#12101F]/10">
                <button
                  type="button"
                  onClick={() => setShowCreateProvModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#12101F]/15 bg-white text-xs font-bold text-[#575266] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createProvLoading || selectedLedgerIds.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#5827EB] cursor-pointer border-none shadow-md shadow-[#6B3CFF]/20 disabled:opacity-50"
                >
                  {createProvLoading ? 'Generating...' : 'Issue Provider Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD PROVIDER PAYMENT MODAL */}
      {payingInvoice && (
        <div className="fixed inset-0 z-50 bg-[#0E0B1E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#12101F]/10 pb-4">
              <div>
                <h2 className="text-lg font-black font-headline text-[#12101F]">
                  Record Provider Payment
                </h2>
                <p className="text-xs text-[#575266] mt-0.5">
                  Invoice: <span className="font-mono font-bold text-[#6B3CFF]">{payingInvoice.invoice_number}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPayingInvoice(null)}
                className="w-8 h-8 rounded-lg text-[#827C94] hover:bg-slate-100 flex items-center justify-center border-none bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRecordProviderPayment} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                  Payment Amount Received (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#12101F]/15 font-mono font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentForm.payment_method}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#12101F]/15 bg-white text-xs font-semibold"
                >
                  <option value="bank_transfer">Bank Transfer (NEFT / RTGS / IMPS)</option>
                  <option value="upi">UPI / QR</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                  Transaction Reference / UTR *
                </label>
                <input
                  type="text"
                  placeholder="e.g. UTR198273648127"
                  value={paymentForm.payment_reference}
                  onChange={(e) => setPaymentForm({ ...paymentForm, payment_reference: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#12101F]/15 font-mono text-xs uppercase"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayingInvoice(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#12101F]/15 bg-white text-xs font-bold text-[#575266] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={payLoading}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer border-none shadow-md"
                >
                  {payLoading ? 'Saving...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RECORD AFFILIATE PAYOUT MODAL */}
      {payoutInvoice && (
        <div className="fixed inset-0 z-50 bg-[#0E0B1E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#12101F]/10 pb-4">
              <div>
                <h2 className="text-lg font-black font-headline text-[#12101F]">
                  Record Affiliate Payout
                </h2>
                <p className="text-xs text-[#575266] mt-0.5">
                  Affiliate: <span className="font-bold text-[#12101F]">{payoutInvoice.affiliate_name}</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPayoutInvoice(null)}
                className="w-8 h-8 rounded-lg text-[#827C94] hover:bg-slate-100 flex items-center justify-center border-none bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-purple-900">Total Payable:</span>
                <span className="font-mono font-bold text-[#6B3CFF] text-sm">
                  ₹{payoutInvoice.total_payable?.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-[#575266]">
                <span>Bank Account:</span>
                <span className="font-mono font-semibold">{payoutInvoice.bank_account_number || 'N/A'}</span>
              </div>
              <div className="flex justify-between text-[#575266]">
                <span>IFSC:</span>
                <span className="font-mono font-semibold">{payoutInvoice.bank_ifsc || 'N/A'}</span>
              </div>
            </div>

            <form onSubmit={handleRecordAffiliatePayout} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                  Payout Reference / UTR Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. UTR998877665544"
                  value={payoutForm.payout_reference}
                  onChange={(e) => setPayoutForm({ ...payoutForm, payout_reference: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#12101F]/15 font-mono text-xs uppercase"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPayoutInvoice(null)}
                  className="px-4 py-2.5 rounded-xl border border-[#12101F]/15 bg-white text-xs font-bold text-[#575266] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={payoutLoading}
                  className="px-5 py-2.5 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#5025D1] cursor-pointer border-none shadow-md shadow-[#6B3CFF]/20"
                >
                  {payoutLoading ? 'Recording...' : 'Confirm Payout'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT INVOICE MODAL (PRINTABLE VIEW) */}
      {inspectingInvoice && (
        <div className="fixed inset-0 z-50 bg-[#0E0B1E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto print:p-0">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#12101F]/10 pb-4">
              <div className="flex items-center gap-2">
                <Receipt size={20} className="text-[#6B3CFF]" />
                <h2 className="text-base font-black font-headline text-[#12101F]">
                  Official Invoice Document
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 rounded-lg border border-[#12101F]/15 bg-white text-xs font-bold text-[#12101F] flex items-center gap-1 cursor-pointer"
                >
                  <Printer size={13} /> Print
                </button>
                <button
                  type="button"
                  onClick={() => setInspectingInvoice(null)}
                  className="w-8 h-8 rounded-lg text-[#827C94] hover:bg-slate-100 flex items-center justify-center border-none bg-transparent cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Printable Invoice Shell */}
            <div className="space-y-6 text-xs text-[#12101F]">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-extrabold text-xl text-[#6B3CFF]">sBLOOM Technologies</div>
                  <div className="text-[11px] text-[#575266] mt-0.5">
                    Affiliate Network Financial Operations
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-[#12101F]">
                    {inspectingInvoice.invoice_number}
                  </div>
                  <div className="text-[11px] text-[#827C94]">
                    Date: {new Date(inspectingInvoice.invoice_date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-[#12101F]/10">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#827C94]">
                    {inspectType === 'provider' ? 'Billed To (Provider):' : 'Billed By (Affiliate):'}
                  </div>
                  <div className="font-bold text-xs mt-1 text-[#12101F]">
                    {inspectType === 'provider' ? inspectingInvoice.provider_name : inspectingInvoice.affiliate_name}
                  </div>
                  <div className="text-[11px] text-[#575266]">
                    {inspectType === 'provider'
                      ? inspectingInvoice.billing_address || 'Registered Provider Partner'
                      : inspectingInvoice.affiliate_email}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#827C94]">
                    Payment Status:
                  </div>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-[#12101F]">
                    {inspectingInvoice.status}
                  </span>
                </div>
              </div>

              {/* Line Items */}
              {inspectingInvoice.items?.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-xs uppercase tracking-wider text-[#827C94]">
                    Referral Service Line Items
                  </div>
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-[#12101F]/10 text-[#827C94] uppercase text-[10px]">
                        <th className="py-2 px-3">Customer</th>
                        <th className="py-2 px-3">Service</th>
                        <th className="py-2 px-3 text-right">Transaction Base</th>
                        <th className="py-2 px-3 text-right">Commission</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#12101F]/5">
                      {inspectingInvoice.items.map((line) => (
                        <tr key={line.id}>
                          <td className="py-2 px-3 font-semibold">{line.customer_name}</td>
                          <td className="py-2 px-3 text-[#575266]">{line.service_name}</td>
                          <td className="py-2 px-3 text-right font-mono">
                            ₹{line.eligible_transaction_value?.toLocaleString('en-IN')}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-[#12101F]">
                            ₹{line.commission_amount?.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Financial Totals */}
              <div className="pt-4 border-t border-[#12101F]/10 flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#575266]">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{inspectingInvoice.subtotal_amount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#12101F] pt-2 border-t border-[#12101F]/10">
                    <span>Total Amount:</span>
                    <span className="font-mono text-[#6B3CFF]">
                      ₹{(inspectType === 'provider' ? inspectingInvoice.total_amount : inspectingInvoice.total_payable)?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
