import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { useLanguage } from '../../context/useLanguage'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Table from '../../components/ui/Table'
import StatusBadge from '../../components/ui/StatusBadge'
import Input from '../../components/ui/Input'
import {
  Wallet,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Info,
  Building2,
  Save,
  Receipt,
  FileText,
  RefreshCw,
  Coins,
} from 'lucide-react'

export default function AffiliateEarningsPage() {
  const { lang } = useLanguage()

  const [financeSummary, setFinanceSummary] = useState({
    eligible_commission: 0,
    uninvoiced_commission: 0,
    invoiced_commission: 0,
    paid_commission: 0,
    outstanding_balance: 0,
  })
  const [uninvoicedItems, setUninvoicedItems] = useState([])
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Bank Form State
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [ifsc, setIfsc] = useState('')
  const [upiId, setUpiId] = useState('')
  const [panNumber, setPanNumber] = useState('')
  const [savingBank, setSavingBank] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState('')
  const [saveError, setSaveError] = useState('')

  // Invoice Generation State
  const [generatingInvoice, setGeneratingInvoice] = useState(false)
  const [invoiceSuccess, setInvoiceSuccess] = useState('')
  const [invoiceError, setInvoiceError] = useState('')

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      const [summaryRes, uninvoicedRes, profileRes] = await Promise.all([
        api.getAffiliateFinanceSummary(),
        api.getAffiliateUninvoicedCommissions(),
        api.getAffiliateProfile(),
      ])

      if (summaryRes) setFinanceSummary(summaryRes)
      if (uninvoicedRes) setUninvoicedItems(uninvoicedRes)
      if (profileRes) {
        setProfile(profileRes)
        setBankName(profileRes.bank_name || '')
        setAccountNumber(profileRes.bank_account_number || '')
        setIfsc(profileRes.bank_ifsc || '')
        setUpiId(profileRes.upi_id || '')
        setPanNumber(profileRes.pan_number || '')
      }
    } catch (err) {
      console.error('Failed to load affiliate earnings:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleSaveBankDetails = async (e) => {
    e.preventDefault()
    setSavingBank(true)
    setSaveSuccess('')
    setSaveError('')

    try {
      await api.updateAffiliateProfile({
        bank_name: bankName.trim() || null,
        bank_account_number: accountNumber.trim() || null,
        bank_ifsc: ifsc.trim().toUpperCase() || null,
        upi_id: upiId.trim() || null,
        pan_number: panNumber.trim().toUpperCase() || null,
      })
      setSaveSuccess(
        lang === 'te'
          ? 'బ్యాంక్ మరియు చెల్లింపు వివరాలు విజయవంతంగా భద్రపరచబడ్డాయి.'
          : 'Bank and settlement details successfully updated.'
      )
      setTimeout(() => setSaveSuccess(''), 4000)
    } catch (err) {
      setSaveError(err.message || 'Failed to update payment details.')
    } finally {
      setSavingBank(false)
    }
  }

  const handleGenerateInvoice = async () => {
    if (uninvoicedItems.length === 0) return
    const now = new Date()
    const billingPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    if (!window.confirm(`Generate official monthly invoice for period ${billingPeriod} totaling ₹${financeSummary.uninvoiced_commission.toLocaleString('en-IN')}?`)) {
      return
    }

    setGeneratingInvoice(true)
    setInvoiceError('')
    setInvoiceSuccess('')
    try {
      const res = await api.generateAffiliateInvoice({
        billing_period: billingPeriod,
        bank_name: bankName || null,
        bank_account_number: accountNumber || null,
        bank_ifsc: ifsc || null,
        upi_id: upiId || null,
        pan_number: panNumber || null,
      })

      setInvoiceSuccess(`Invoice ${res.invoice_number} submitted to sBLOOM for settlement!`)
      await loadData()
      setTimeout(() => setInvoiceSuccess(''), 5000)
    } catch (err) {
      console.error('Invoice generation failed:', err)
      setInvoiceError(err.message || 'Failed to generate monthly invoice.')
    } finally {
      setGeneratingInvoice(false)
    }
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#12101F]/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6B3CFF]/10 text-[#6B3CFF] flex items-center justify-center">
              <Wallet size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black font-headline text-[#12101F] tracking-tight">
                {lang === 'te' ? 'ఆదాయం & కమిషన్ సెటిల్‌మెంట్' : 'Earnings & Commission Settlement'}
              </h1>
              <p className="text-xs text-[#575266] mt-0.5">
                {lang === 'te'
                  ? 'మీ విజయవంతమైన రెఫరల్స్, ఆర్జించిన కమిషన్ మరియు బ్యాంక్ సెటిల్‌మెంట్ వివరాలు.'
                  : 'Track your eligible earnings, generated invoices, and direct bank disbursement status.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/app/invoices"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#12101F]/15 text-[#12101F] text-xs font-bold hover:bg-slate-50 transition-all shadow-xs no-underline"
          >
            <Receipt size={14} />
            <span>{lang === 'te' ? 'ఇన్‌వాయిస్‌లు చూడండి' : 'View Invoices'}</span>
          </Link>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#5827EB] transition-all shadow-sm shadow-[#6B3CFF]/20 cursor-pointer border-none"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>{lang === 'te' ? 'రిఫ్రెష్' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {invoiceSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span className="font-semibold">{invoiceSuccess}</span>
        </div>
      )}

      {invoiceError && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
          <AlertCircle size={16} className="text-red-500 shrink-0" />
          <span className="font-semibold">{invoiceError}</span>
        </div>
      )}

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Eligible Commission */}
        <div className="bg-white p-5 rounded-2xl border border-[#12101F]/10 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#827C94]">
            {lang === 'te' ? 'మొత్తం ఆర్జించిన కమిషన్' : 'Total Commission Earned'}
          </div>
          <div className="text-2xl font-black text-[#12101F] mt-1 font-mono">
            ₹{financeSummary.eligible_commission?.toLocaleString('en-IN') || '0.00'}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {lang === 'te' ? 'ధృవీకరించబడిన కన్వర్షన్స్' : 'Verified customer conversions'}
          </div>
        </div>

        {/* 2. Uninvoiced Ready to Claim */}
        <div className="bg-purple-50/70 p-5 rounded-2xl border border-purple-200 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-900">
            {lang === 'te' ? 'ఇన్‌వాయిస్ చేయదగిన మొత్తం' : 'Ready to Invoice (Unclaimed)'}
          </div>
          <div className="text-2xl font-black text-[#6B3CFF] mt-1 font-mono">
            ₹{financeSummary.uninvoiced_commission?.toLocaleString('en-IN') || '0.00'}
          </div>
          <div className="text-[11px] text-purple-700 mt-1">
            {uninvoicedItems.length} {lang === 'te' ? 'కన్వర్షన్స్ సిద్ధంగా ఉన్నాయి' : 'conversions available'}
          </div>
        </div>

        {/* 3. Invoiced Under Settlement */}
        <div className="bg-white p-5 rounded-2xl border border-[#12101F]/10 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#827C94]">
            {lang === 'te' ? 'ఇన్‌వాయిస్ చేయబడిన మొత్తం' : 'Invoiced & Processing'}
          </div>
          <div className="text-2xl font-black text-blue-700 mt-1 font-mono">
            ₹{financeSummary.invoiced_commission?.toLocaleString('en-IN') || '0.00'}
          </div>
          <div className="text-[11px] text-[#575266] mt-1">
            {lang === 'te' ? 'పరిశీలన మరియు ఆమోదంలో ఉంది' : 'Submitted invoice claims'}
          </div>
        </div>

        {/* 4. Total Disbursed to Bank */}
        <div className="bg-white p-5 rounded-2xl border border-[#12101F]/10 shadow-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#827C94]">
            {lang === 'te' ? 'బ్యాంకుకు చెల్లించబడినది' : 'Total Disbursed (Paid)'}
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">
            ₹{financeSummary.paid_commission?.toLocaleString('en-IN') || '0.00'}
          </div>
          <div className="text-[11px] text-[#575266] mt-1">
            {lang === 'te' ? 'నేరుగా బ్యాంకు ఖాతాకు చేరింది' : 'Transferred to your bank'}
          </div>
        </div>
      </div>

      {/* Uninvoiced Earnings Action Card */}
      {uninvoicedItems.length > 0 && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#6B3CFF]/10 via-[#FAF7F2] to-emerald-50/40 border border-[#6B3CFF]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#6B3CFF] text-white">
              <Coins size={11} />
              <span>Earnings Settlement</span>
            </div>
            <h3 className="text-base font-black text-[#12101F] font-headline">
              {lang === 'te' ? 'మీ కమిషన్ ఇన్‌వాయిస్‌ను సమర్పించండి' : 'Submit Monthly Invoice for Disbursal'}
            </h3>
            <p className="text-xs text-[#575266] leading-relaxed max-w-xl">
              You have <strong className="text-[#12101F]">{uninvoicedItems.length} verified referral conversion(s)</strong> totaling{' '}
              <strong className="text-[#6B3CFF] font-mono">₹{financeSummary.uninvoiced_commission.toLocaleString('en-IN')}</strong> ready for settlement. Generating your invoice submits it directly to sBLOOM for review and payment.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateInvoice}
            disabled={generatingInvoice}
            className="px-6 py-3 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#5827EB] active:scale-[0.99] transition-all shadow-lg shadow-[#6B3CFF]/25 cursor-pointer border-none flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
          >
            {generatingInvoice ? (
              <>
                <RefreshCw size={14} className="animate-spin" />
                <span>Generating Invoice...</span>
              </>
            ) : (
              <>
                <span>Generate Monthly Invoice</span>
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      )}

      {/* Uninvoiced Conversions Table */}
      <div className="bg-white rounded-2xl border border-[#12101F]/10 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-[#12101F]/10 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#12101F] uppercase tracking-wider">
              {lang === 'te' ? 'కన్వర్షన్ మరియు కమిషన్ లెడ్జర్' : 'Eligible Referral Conversions'}
            </h3>
            <p className="text-xs text-[#575266] mt-0.5">
              Service introductions that converted successfully and generated affiliate commissions.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-[#827C94]">
            <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#6B3CFF]" />
            <p className="text-xs font-medium">Loading commission transactions...</p>
          </div>
        ) : uninvoicedItems.length === 0 ? (
          <div className="p-12 text-center text-[#827C94]">
            <Coins size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm font-bold text-[#12101F]">No pending uninvoiced conversions</p>
            <p className="text-xs mt-1">When leads you submit convert with providers, your commissions will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[#827C94] uppercase tracking-wider text-[10px] border-b border-[#12101F]/10">
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Service Provider</th>
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-4 text-right">Transaction Value</th>
                  <th className="py-3 px-4 text-center">Affiliate Share</th>
                  <th className="py-3 px-4 text-right">Your Commission</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#12101F]/5 text-[#12101F]">
                {uninvoicedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-[#12101F]">
                      {item.customer_name}
                    </td>
                    <td className="py-3 px-4 text-[#575266] font-medium">
                      {item.provider_name}
                    </td>
                    <td className="py-3 px-4 text-[#575266]">
                      {item.service_name}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#575266]">
                      ₹{item.eligible_transaction_value?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#6B3CFF]">
                      {item.affiliate_commission_rate ? `${item.affiliate_commission_rate}%` : 'Standard'}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600">
                      ₹{item.affiliate_commission_amount?.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                        Ready to Invoice
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bank & Payment Settlement Form */}
      <div className="bg-white rounded-3xl border border-[#12101F]/10 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-[#12101F]/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#6B3CFF] flex items-center justify-center">
            <Landmark size={20} />
          </div>
          <div>
            <h2 className="text-base font-black font-headline text-[#12101F]">
              {lang === 'te' ? 'బ్యాంక్ సెటిల్‌మెంట్ ఖాతా వివరాలు' : 'Bank Settlement & Payment Details'}
            </h2>
            <p className="text-xs text-[#575266] mt-0.5">
              Direct bank transfer (NEFT/RTGS/IMPS) and UPI details used for monthly affiliate commission disbursals.
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span className="font-semibold">{saveSuccess}</span>
          </div>
        )}

        {saveError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-500 shrink-0" />
            <span className="font-semibold">{saveError}</span>
          </div>
        )}

        <form onSubmit={handleSaveBankDetails} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                Bank Name
              </label>
              <input
                type="text"
                placeholder="e.g. State Bank of India, HDFC Bank"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#12101F]/15 bg-white text-xs font-semibold text-[#12101F] focus:outline-none focus:border-[#6B3CFF]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                Account Number
              </label>
              <input
                type="text"
                placeholder="e.g. 000123456789"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#12101F]/15 bg-white text-xs font-mono font-semibold text-[#12101F] focus:outline-none focus:border-[#6B3CFF]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                placeholder="e.g. SBIN0001234"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#12101F]/15 bg-white text-xs font-mono font-semibold text-[#12101F] focus:outline-none focus:border-[#6B3CFF]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                UPI ID (Optional)
              </label>
              <input
                type="text"
                placeholder="username@okhdfcbank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#12101F]/15 bg-white text-xs font-mono text-[#12101F] focus:outline-none focus:border-[#6B3CFF]"
              />
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#827C94] mb-1">
                PAN Number (Tax Compliance)
              </label>
              <input
                type="text"
                placeholder="ABCDE1234F"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#12101F]/15 bg-white text-xs font-mono uppercase font-semibold text-[#12101F] focus:outline-none focus:border-[#6B3CFF]"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingBank}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#5827EB] active:scale-[0.99] transition-all shadow-md shadow-[#6B3CFF]/20 cursor-pointer border-none disabled:opacity-50"
            >
              <Save size={14} />
              <span>{savingBank ? 'Saving...' : 'Save Bank Details'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
