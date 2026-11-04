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
  Ban,
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
  const [showCreateAffModal, setShowCreateAffModal] = useState(false)
  const [affiliatesList, setAffiliatesList] = useState([])
  const [selectedAffiliateId, setSelectedAffiliateId] = useState('')
  const [affUninvoicedLedger, setAffUninvoicedLedger] = useState([])
  const [selectedAffLedgerIds, setSelectedAffLedgerIds] = useState([])
  const [affBillingPeriod, setAffBillingPeriod] = useState(new Date().toISOString().slice(0, 7))
  const [affTdsRate, setAffTdsRate] = useState(5.0)
  const [affBankName, setAffBankName] = useState('')
  const [affAccountNum, setAffAccountNum] = useState('')
  const [affIfsc, setAffIfsc] = useState('')
  const [affUpi, setAffUpi] = useState('')
  const [affPan, setAffPan] = useState('')
  const [affNotes, setAffNotes] = useState('')
  const [createAffLoading, setCreateAffLoading] = useState(false)

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

  // Load affiliates for invoice creation
  const fetchAffiliates = async () => {
    try {
      const res = await api.getAdminAffiliates({ limit: 100 })
      setAffiliatesList(res?.items || [])
    } catch (err) {
      console.error('Failed to load affiliates list:', err)
    }
  }

  useEffect(() => {
    fetchProviderInvoices()
    fetchAffiliateInvoices()
    fetchProviders()
    fetchAffiliates()
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

  // When selected affiliate changes in modal, load their uninvoiced eligible ledger items & settlement details
  useEffect(() => {
    if (!selectedAffiliateId) {
      setAffUninvoicedLedger([])
      setSelectedAffLedgerIds([])
      setAffBankName('')
      setAffAccountNum('')
      setAffIfsc('')
      setAffUpi('')
      setAffPan('')
      return
    }
    const loadAffiliateData = async () => {
      try {
        const [ledgerData, detailData] = await Promise.all([
          api.getAdminLedger({ affiliate_user_id: selectedAffiliateId, status: 'eligible' }),
          api.getAdminAffiliateDetail(selectedAffiliateId).catch(() => null),
        ])
        setAffUninvoicedLedger(ledgerData || [])
        setSelectedAffLedgerIds((ledgerData || []).map((i) => i.id))
        if (detailData?.profile) {
          setAffBankName(detailData.profile.bank_name || '')
          setAffAccountNum(detailData.profile.bank_account_number || '')
          setAffIfsc(detailData.profile.bank_ifsc || '')
          setAffUpi(detailData.profile.upi_id || '')
          setAffPan(detailData.profile.pan_number || '')
        }
      } catch (err) {
        console.error('Failed to load affiliate ledger and profile:', err)
      }
    }
    loadAffiliateData()
  }, [selectedAffiliateId])

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

  // Create Affiliate Payout Invoice
  const handleCreateAffiliateInvoice = async (e) => {
    e.preventDefault()
    if (!selectedAffiliateId || selectedAffLedgerIds.length === 0) {
      alert('Please select an affiliate partner and at least one eligible commission.')
      return
    }
    setCreateAffLoading(true)
    try {
      const payload = {
        affiliate_user_id: selectedAffiliateId,
        billing_period: affBillingPeriod || new Date().toISOString().slice(0, 7),
        ledger_ids: selectedAffLedgerIds,
        tds_rate: Number(affTdsRate) || 0,
        bank_name: affBankName.trim() || null,
        bank_account_number: affAccountNum.trim() || null,
        bank_ifsc: affIfsc.trim().toUpperCase() || null,
        upi_id: affUpi.trim() || null,
        pan_number: affPan.trim().toUpperCase() || null,
        notes: affNotes.trim() || null,
      }
      await api.createAdminAffiliateInvoice(payload)
      setShowCreateAffModal(false)
      setSelectedAffiliateId('')
      setSelectedAffLedgerIds([])
      setAffNotes('')
      await fetchAffiliateInvoices()
    } catch (err) {
      alert(err.message || 'Failed to generate affiliate payout invoice.')
    } finally {
      setCreateAffLoading(false)
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

  // Cancel Affiliate Invoice
  const handleCancelAffiliateInvoice = async (invoiceId) => {
    const reason = window.prompt('Enter reason for cancelling this affiliate payout invoice:')
    if (!reason || !reason.trim()) return
    try {
      await api.cancelAdminAffiliateInvoice(invoiceId, reason)
      await fetchAffiliateInvoices()
    } catch (err) {
      alert(err.message || 'Failed to cancel affiliate invoice.')
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

  // Calculate live affiliate modal totals
  const selectedAffLedgerItems = affUninvoicedLedger.filter((item) => selectedAffLedgerIds.includes(item.id))
  const affSubtotal = selectedAffLedgerItems.reduce((acc, item) => acc + (Number(item.affiliate_commission_amount) || 0), 0)
  const affTdsAmount = roundToTwo(affSubtotal * ((Number(affTdsRate) || 0) / 100))
  const affTotalPayable = roundToTwo(affSubtotal - affTdsAmount)

  function roundToTwo(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100
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
                ? 'సేవా ప్రొవైడర్లకు పంపే ఇన్‌వాయిస్‌లు మరియు అఫిలియేట్లకు ఇచ్చే చెల్లింపు ఇన్‌వాయిస్‌ల పూర్తి నిర్వహణ.'
                : 'Manage provider billing invoices (sBLOOM → Providers) and affiliate payout invoices (sBLOOM → Affiliates).'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'provider' ? (
            <button
              type="button"
              onClick={() => setShowCreateProvModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#5827EB] transition-all shadow-sm shadow-[#6B3CFF]/20 cursor-pointer border-none"
            >
              <Plus size={15} />
              <span>Bill a Service Provider</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowCreateAffModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#5827EB] transition-all shadow-sm shadow-[#6B3CFF]/20 cursor-pointer border-none"
            >
              <Plus size={15} />
              <span>Generate Affiliate Invoice</span>
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
          <span>Affiliate Payout Invoices (sBLOOM &rarr; Affiliates)</span>
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
                <FileText size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm font-bold text-[#12101F]">No provider invoices generated yet</p>
                <p className="text-xs mt-1">Select a service provider to bill them for converted referrals.</p>
                <button
                  type="button"
                  onClick={() => setShowCreateProvModal(true)}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold border-none cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Create First Provider Invoice</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[#827C94] uppercase tracking-wider text-[10px] border-b border-[#12101F]/10">
                      <th className="py-3.5 px-4">Invoice #</th>
                      <th className="py-3.5 px-4">Service Provider</th>
                      <th className="py-3.5 px-4">Issue & Due Date</th>
                      <th className="py-3.5 px-4 text-right">Subtotal</th>
                      <th className="py-3.5 px-4 text-right">GST / Tax</th>
                      <th className="py-3.5 px-4 text-right">Total Invoiced</th>
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

                        <td className="py-3.5 px-4 font-bold text-[#12101F]">
                          {inv.provider_name}
                          {inv.provider_gstin && (
                            <div className="text-[10px] font-mono text-[#827C94] font-normal">
                              GSTIN: {inv.provider_gstin}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-[#575266]">
                          <div>{new Date(inv.invoice_date).toLocaleDateString()}</div>
                          {inv.due_date && (
                            <div className="text-[10px] text-[#827C94]">
                              Due: {new Date(inv.due_date).toLocaleDateString()}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono">
                          ₹{inv.subtotal_amount?.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono text-[#575266]">
                          ₹{inv.tax_amount?.toLocaleString('en-IN') || '0.00'}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-bold text-[#12101F]">
                          ₹{inv.total_amount?.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-semibold">
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
                                    amount: (inv.total_amount - (inv.amount_paid || 0)).toString(),
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

      {/* TAB 2: AFFILIATE PAYOUT INVOICES */}
      {activeTab === 'affiliate' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#12101F]/10 shadow-xs overflow-hidden">
            {affLoading ? (
              <div className="p-12 text-center text-[#827C94]">
                <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#6B3CFF]" />
                <p className="text-xs">Loading affiliate payout invoices...</p>
              </div>
            ) : affiliateInvoices.length === 0 ? (
              <div className="p-12 text-center text-[#827C94]">
                <FileText size={32} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm font-bold text-[#12101F]">No affiliate payout invoices issued yet</p>
                <p className="text-xs mt-1">
                  Generate an official monthly payout invoice when an affiliate partner has verified converted referrals.
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreateAffModal(true)}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold border-none cursor-pointer shadow-sm shadow-[#6B3CFF]/20"
                >
                  <Plus size={14} />
                  <span>Generate Affiliate Invoice</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-[#827C94] uppercase tracking-wider text-[10px] border-b border-[#12101F]/10">
                      <th className="py-3.5 px-4">Invoice #</th>
                      <th className="py-3.5 px-4">Affiliate Partner</th>
                      <th className="py-3.5 px-4">Period & Issue Date</th>
                      <th className="py-3.5 px-4 text-right">Subtotal</th>
                      <th className="py-3.5 px-4 text-right">TDS (5%)</th>
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
                              A/C: {inv.bank_account_number} • {inv.bank_ifsc || 'IFSC on file'}
                            </div>
                          )}
                          {inv.payout_reference && (
                            <div className="text-[10px] font-mono text-emerald-700 font-semibold mt-0.5">
                              UTR: {inv.payout_reference}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-semibold text-[#12101F]">
                          {inv.billing_period}
                          <div className="text-[10px] text-[#827C94] font-normal">
                            Issued: {new Date(inv.invoice_date).toLocaleDateString()}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono">
                          ₹{inv.subtotal_amount?.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono text-red-600">
                          -₹{inv.tds_amount?.toLocaleString('en-IN') || '0.00'}
                        </td>

                        <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700">
                          ₹{inv.total_payable?.toLocaleString('en-IN')}
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              inv.status === 'paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : inv.status === 'cancelled'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : 'bg-purple-50 text-purple-700 border border-purple-200'
                            }`}
                          >
                            {inv.status === 'paid' ? 'Paid / Disbursed' : inv.status === 'cancelled' ? 'Cancelled' : 'Issued (Pending Payout)'}
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

                            {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                              <button
                                type="button"
                                onClick={() => {
                                  setPayoutInvoice(inv)
                                  setPayoutForm({ payout_reference: '', payout_method: 'bank_transfer', notes: '' })
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-xs border-none cursor-pointer"
                              >
                                Record Payout
                              </button>
                            )}

                            {inv.status !== 'paid' && inv.status !== 'cancelled' && (
                              <button
                                type="button"
                                onClick={() => handleCancelAffiliateInvoice(inv.id)}
                                className="px-2 py-1.5 rounded-lg bg-slate-100 text-red-600 hover:bg-red-50 text-xs font-bold border-none cursor-pointer"
                                title="Cancel Payout Invoice"
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

      {/* GENERATE AFFILIATE PAYOUT INVOICE MODAL */}
      {showCreateAffModal && (
        <div className="fixed inset-0 z-50 bg-[#0E0B1E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#12101F]/10 pb-4">
              <div>
                <h2 className="text-lg font-black font-headline text-[#12101F]">
                  Generate Affiliate Payout Invoice
                </h2>
                <p className="text-xs text-[#575266] mt-0.5">
                  Compile verified referral commissions into an official tax-compliant payout invoice for an affiliate partner.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowCreateAffModal(false)}
                className="w-8 h-8 rounded-lg text-[#827C94] hover:bg-slate-100 flex items-center justify-center border-none bg-transparent cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateAffiliateInvoice} className="space-y-5 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                  Select Affiliate Partner *
                </label>
                <select
                  value={selectedAffiliateId}
                  onChange={(e) => setSelectedAffiliateId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#12101F]/15 bg-white text-xs font-semibold text-[#12101F]"
                  required
                >
                  <option value="">Choose an Affiliate Partner...</option>
                  {affiliatesList.map((aff) => (
                    <option key={aff.id} value={aff.id}>
                      {aff.full_name} ({aff.email}) — {aff.city || 'Location unlisted'}
                    </option>
                  ))}
                </select>
              </div>

              {selectedAffiliateId && (
                <>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block font-bold uppercase tracking-wider text-[#827C94]">
                        Eligible Uninvoiced Conversions ({affUninvoicedLedger.length})
                      </label>
                      {affUninvoicedLedger.length > 0 && (
                        <div className="text-[11px] text-[#575266]">
                          <button
                            type="button"
                            onClick={() => setSelectedAffLedgerIds(affUninvoicedLedger.map((i) => i.id))}
                            className="text-[#6B3CFF] hover:underline font-bold mr-2 border-none bg-transparent cursor-pointer"
                          >
                            Select All
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedAffLedgerIds([])}
                            className="text-[#827C94] hover:underline border-none bg-transparent cursor-pointer"
                          >
                            Deselect
                          </button>
                        </div>
                      )}
                    </div>

                    {affUninvoicedLedger.length === 0 ? (
                      <p className="text-xs text-amber-800 italic bg-amber-50 p-4 rounded-2xl border border-amber-200">
                        This affiliate partner has no eligible uninvoiced referral commissions at this time. Only converted leads generate payable commissions.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-48 overflow-y-auto border border-[#12101F]/10 rounded-2xl p-2.5 bg-slate-50">
                        {affUninvoicedLedger.map((item) => (
                          <label
                            key={item.id}
                            className="flex items-center gap-3 p-2.5 rounded-xl bg-white border border-[#12101F]/5 cursor-pointer hover:bg-purple-50/50 transition-colors"
                          >
                            <input
                              type="checkbox"
                              checked={selectedAffLedgerIds.includes(item.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedAffLedgerIds([...selectedAffLedgerIds, item.id])
                                } else {
                                  setSelectedAffLedgerIds(selectedAffLedgerIds.filter((id) => id !== item.id))
                                }
                              }}
                              className="accent-[#6B3CFF] w-4 h-4 cursor-pointer"
                            />
                            <div className="flex-1 flex justify-between items-center">
                              <div>
                                <div className="font-bold text-[#12101F]">{item.customer_name}</div>
                                <div className="text-[11px] text-[#575266]">
                                  {item.provider_name} • {item.service_name}
                                </div>
                                <div className="text-[10px] text-[#827C94]">
                                  Eligible Base: ₹{Number(item.eligible_transaction_value)?.toLocaleString('en-IN')} (Share: {item.affiliate_commission_rate ? `${item.affiliate_commission_rate}%` : 'Agreed'})
                                </div>
                              </div>
                              <span className="font-mono font-bold text-emerald-700 text-sm">
                                ₹{Number(item.affiliate_commission_amount)?.toLocaleString('en-IN')}
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Period and TDS Rate */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                        Billing Period (YYYY-MM) *
                      </label>
                      <input
                        type="month"
                        value={affBillingPeriod}
                        onChange={(e) => setAffBillingPeriod(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-[#12101F]/15 bg-white text-xs font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                        TDS Withholding Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={affTdsRate}
                        onChange={(e) => setAffTdsRate(e.target.value)}
                        placeholder="5.0"
                        className="w-full px-3 py-2 rounded-xl border border-[#12101F]/15 bg-white text-xs font-mono font-semibold"
                      />
                    </div>
                  </div>

                  {/* Financial Calculation Box */}
                  <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2">
                    <div className="flex justify-between items-center text-xs text-[#575266]">
                      <span>Selected Commission Subtotal ({selectedAffLedgerIds.length} item{selectedAffLedgerIds.length === 1 ? '' : 's'}):</span>
                      <span className="font-mono font-bold text-[#12101F]">₹{affSubtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-red-600">
                      <span>TDS Withholding ({affTdsRate}%):</span>
                      <span className="font-mono font-semibold">-₹{affTdsAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-black text-[#12101F] pt-2 border-t border-purple-200">
                      <span>Net Payout to Affiliate:</span>
                      <span className="font-mono text-emerald-700 text-base">₹{affTotalPayable.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Affiliate Settlement Banking Details (prefilled & editable) */}
                  <div className="space-y-3 pt-2 border-t border-[#12101F]/10">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#827C94]">
                      Affiliate Registered Settlement Details
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#827C94] mb-1">Bank Name</label>
                        <input
                          type="text"
                          value={affBankName}
                          onChange={(e) => setAffBankName(e.target.value)}
                          placeholder="e.g. State Bank of India"
                          className="w-full px-3 py-2 rounded-xl border border-[#12101F]/15 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#827C94] mb-1">Account Number</label>
                        <input
                          type="text"
                          value={affAccountNum}
                          onChange={(e) => setAffAccountNum(e.target.value)}
                          placeholder="Bank Account Number"
                          className="w-full px-3 py-2 rounded-xl border border-[#12101F]/15 font-mono text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#827C94] mb-1">IFSC Code</label>
                        <input
                          type="text"
                          value={affIfsc}
                          onChange={(e) => setAffIfsc(e.target.value)}
                          placeholder="e.g. SBIN0001234"
                          className="w-full px-3 py-2 rounded-xl border border-[#12101F]/15 font-mono uppercase text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase font-bold text-[#827C94] mb-1">UPI ID</label>
                        <input
                          type="text"
                          value={affUpi}
                          onChange={(e) => setAffUpi(e.target.value)}
                          placeholder="username@bank"
                          className="w-full px-3 py-2 rounded-xl border border-[#12101F]/15 font-mono text-xs"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase font-bold text-[#827C94] mb-1">PAN Number</label>
                        <input
                          type="text"
                          value={affPan}
                          onChange={(e) => setAffPan(e.target.value)}
                          placeholder="ABCDE1234F"
                          className="w-full px-3 py-2 rounded-xl border border-[#12101F]/15 font-mono uppercase text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                      Admin Notes / Disbursal Instructions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={affNotes}
                      onChange={(e) => setAffNotes(e.target.value)}
                      placeholder="Add any specific settlement notes or verification references..."
                      className="w-full px-3 py-2 rounded-xl border border-[#12101F]/15 text-xs"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-[#12101F]/10">
                <button
                  type="button"
                  onClick={() => setShowCreateAffModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#12101F]/15 bg-white text-xs font-bold text-[#575266] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createAffLoading || selectedAffLedgerIds.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#5827EB] cursor-pointer border-none shadow-md shadow-[#6B3CFF]/20 disabled:opacity-50"
                >
                  {createAffLoading ? 'Issuing Invoice...' : 'Issue Payout Invoice to Affiliate'}
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
                  Record Affiliate Disbursal Payout
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
                <span className="text-purple-900">Total Net Payable:</span>
                <span className="font-mono font-bold text-emerald-700 text-sm">
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
              {payoutInvoice.pan_number && (
                <div className="flex justify-between text-[#575266]">
                  <span>PAN:</span>
                  <span className="font-mono font-semibold">{payoutInvoice.pan_number}</span>
                </div>
              )}
            </div>

            <form onSubmit={handleRecordAffiliatePayout} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                  Payout Method
                </label>
                <select
                  value={payoutForm.payout_method}
                  onChange={(e) => setPayoutForm({ ...payoutForm, payout_method: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#12101F]/15 bg-white text-xs font-semibold"
                >
                  <option value="bank_transfer">Direct Bank Transfer (NEFT / RTGS / IMPS)</option>
                  <option value="upi">UPI / Instant Disbursal</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                  Disbursal Reference / Banking UTR *
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

              <div>
                <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                  Disbursal Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Settlement reference or batch note"
                  value={payoutForm.notes}
                  onChange={(e) => setPayoutForm({ ...payoutForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#12101F]/15 text-xs"
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
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 cursor-pointer border-none shadow-md"
                >
                  {payoutLoading ? 'Recording Disbursal...' : 'Confirm Disbursal Payout'}
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
                  {inspectType === 'provider' ? 'Provider Billing Invoice' : 'Affiliate Commission Settlement Invoice'}
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
                    Affiliate Network Financial Operations & Settlements
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-[#12101F]">
                    {inspectingInvoice.invoice_number}
                  </div>
                  <div className="text-[11px] text-[#827C94]">
                    Period: {inspectingInvoice.billing_period || 'N/A'}
                  </div>
                  <div className="text-[11px] text-[#827C94]">
                    Issue Date: {new Date(inspectingInvoice.invoice_date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-[#12101F]/10">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#827C94]">
                    {inspectType === 'provider' ? 'Billed To (Provider):' : 'Issued To (Affiliate Partner):'}
                  </div>
                  <div className="font-bold text-xs mt-1 text-[#12101F]">
                    {inspectType === 'provider' ? inspectingInvoice.provider_name : inspectingInvoice.affiliate_name}
                  </div>
                  <div className="text-[11px] text-[#575266]">
                    {inspectType === 'provider'
                      ? inspectingInvoice.billing_address || 'Registered Service Provider Partner'
                      : inspectingInvoice.affiliate_email}
                  </div>
                  {inspectType === 'affiliate' && inspectingInvoice.pan_number && (
                    <div className="text-[10px] font-mono text-[#827C94] mt-0.5">
                      PAN: {inspectingInvoice.pan_number}
                    </div>
                  )}
                  {inspectType === 'affiliate' && inspectingInvoice.bank_account_number && (
                    <div className="text-[10px] text-[#827C94] mt-0.5">
                      Bank A/C: {inspectingInvoice.bank_account_number} ({inspectingInvoice.bank_ifsc || 'IFSC on file'})
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#827C94]">
                    Settlement Status:
                  </div>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      inspectingInvoice.status === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : inspectingInvoice.status === 'cancelled'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}
                  >
                    {inspectingInvoice.status === 'paid' ? 'Paid / Disbursed' : inspectingInvoice.status}
                  </span>
                  {inspectingInvoice.payout_reference && (
                    <div className="text-[11px] font-mono text-emerald-700 font-bold mt-1">
                      UTR: {inspectingInvoice.payout_reference}
                    </div>
                  )}
                </div>
              </div>

              {/* Line Items */}
              {inspectingInvoice.items?.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-xs uppercase tracking-wider text-[#827C94]">
                    Verified Referral Commission Line Items
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
                  {inspectType === 'affiliate' && inspectingInvoice.tds_amount > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>TDS Withholding ({inspectingInvoice.tds_rate || 5}%):</span>
                      <span className="font-mono">-₹{inspectingInvoice.tds_amount?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  {inspectType === 'provider' && inspectingInvoice.tax_amount > 0 && (
                    <div className="flex justify-between text-[#575266]">
                      <span>GST / Tax:</span>
                      <span className="font-mono">₹{inspectingInvoice.tax_amount?.toLocaleString('en-IN')}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-sm text-[#12101F] pt-2 border-t border-[#12101F]/10">
                    <span>{inspectType === 'provider' ? 'Total Invoiced:' : 'Net Disbursed / Payable:'}</span>
                    <span className="font-mono text-emerald-700">
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
