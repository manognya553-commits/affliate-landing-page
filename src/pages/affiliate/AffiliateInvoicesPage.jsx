import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import StatusBadge from '../../components/ui/StatusBadge'
import Button from '../../components/ui/Button'
import {
  FileText,
  Download,
  Landmark,
  Calendar,
  ShieldCheck,
  Check,
  CheckCircle2,
  Receipt,
  RefreshCw,
  Printer,
  Eye,
  X,
  ArrowRight,
  Clock,
} from 'lucide-react'

export default function AffiliateInvoicesPage() {
  const { user } = useAuth()
  const { lang } = useLanguage()

  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [inspectingInvoice, setInspectingInvoice] = useState(null)

  const partnerCode = `SBL-${(user?.id || '882199').slice(0, 8).toUpperCase()}`

  const fetchInvoices = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.getAffiliateInvoices()
      setInvoices(data || [])
    } catch (err) {
      console.error('Failed to fetch affiliate invoices:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={11} />
            {lang === 'te' ? 'చెల్లించబడింది' : 'Paid'}
          </span>
        )
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
            <Check size={11} />
            {lang === 'te' ? 'ఆమోదించబడింది' : 'Approved'}
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
            <X size={11} />
            {lang === 'te' ? 'తిరస్కరించబడింది' : 'Rejected'}
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            <Clock size={11} />
            {lang === 'te' ? 'పరిశీలనలో ఉంది' : 'Submitted'}
          </span>
        )
    }
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#12101F]/10 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6B3CFF]/10 text-[#6B3CFF] flex items-center justify-center">
              <Receipt size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-black font-headline text-[#12101F] tracking-tight">
                {lang === 'te' ? 'అఫిలియేట్ ఇన్‌వాయిస్‌లు' : 'My Invoices & Settlements'}
              </h1>
              <p className="text-xs text-[#575266] mt-0.5">
                {lang === 'te'
                  ? 'మీరు సమర్పించిన నెలవారీ ఇన్‌వాయిస్‌లు, ఆమోద స్థితి మరియు UTR రిఫరెన్స్ వివరాలు.'
                  : 'Official tax-compliant invoice records, disbursal statements, and banking UTR references.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/app/earnings"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#5827EB] transition-all shadow-sm shadow-[#6B3CFF]/20 no-underline"
          >
            <span>{lang === 'te' ? 'ఆదాయం డాష్‌బోర్డ్' : 'View Earnings'}</span>
            <ArrowRight size={14} />
          </Link>
          <button
            type="button"
            onClick={fetchInvoices}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white border border-[#12101F]/15 text-[#12101F] text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Partner Info Banner */}
      <div className="bg-white p-5 rounded-2xl border border-[#12101F]/10 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#827C94]">
            Affiliate Partner Identification
          </div>
          <div className="font-mono font-bold text-sm text-[#12101F] mt-0.5">{partnerCode}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#827C94]">
            Registered Account
          </div>
          <div className="font-semibold text-xs text-[#12101F] mt-0.5">{user?.email}</div>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-[#827C94]">
            Disbursal Cycle
          </div>
          <div className="text-xs font-bold text-emerald-600 mt-0.5">Monthly Cycle (Net 15)</div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl border border-[#12101F]/10 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-[#827C94]">
            <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-[#6B3CFF]" />
            <p className="text-xs">Loading invoice records...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center text-[#827C94]">
            <FileText size={32} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm font-bold text-[#12101F]">No invoices submitted yet</p>
            <p className="text-xs mt-1">
              When your referral leads convert, visit the Earnings page to generate and submit your invoice.
            </p>
            <Link
              to="/app/earnings"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold no-underline"
            >
              <span>Go to Earnings Page</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-[#827C94] uppercase tracking-wider text-[10px] border-b border-[#12101F]/10">
                  <th className="py-3.5 px-4">Invoice #</th>
                  <th className="py-3.5 px-4">Billing Period</th>
                  <th className="py-3.5 px-4">Submission Date</th>
                  <th className="py-3.5 px-4 text-right">Subtotal</th>
                  <th className="py-3.5 px-4 text-right">TDS (5%)</th>
                  <th className="py-3.5 px-4 text-right">Net Payable</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#12101F]/5 text-[#12101F]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#6B3CFF]">
                      {inv.invoice_number}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#12101F]">
                      {inv.billing_period}
                    </td>

                    <td className="py-3.5 px-4 text-[#575266]">
                      {new Date(inv.invoice_date).toLocaleDateString()}
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

                    <td className="py-3.5 px-4 text-center">{getStatusBadge(inv.status)}</td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => setInspectingInvoice(inv)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-[#12101F] hover:bg-slate-200 font-bold text-xs border-none cursor-pointer"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* INSPECT INVOICE MODAL */}
      {inspectingInvoice && (
        <div className="fixed inset-0 z-50 bg-[#0E0B1E]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto print:p-0">
            <div className="flex items-center justify-between border-b border-[#12101F]/10 pb-4">
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-[#6B3CFF]" />
                <h2 className="text-base font-black font-headline text-[#12101F]">
                  Affiliate Invoice Statement
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

            <div className="space-y-6 text-xs text-[#12101F]">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-extrabold text-xl text-[#6B3CFF]">sBLOOM Technologies</div>
                  <div className="text-[11px] text-[#575266] mt-0.5">
                    Affiliate Partner Commission Disbursement
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-sm text-[#12101F]">
                    {inspectingInvoice.invoice_number}
                  </div>
                  <div className="text-[11px] text-[#827C94]">
                    Period: {inspectingInvoice.billing_period}
                  </div>
                  <div className="text-[11px] text-[#827C94]">
                    Date: {new Date(inspectingInvoice.invoice_date).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Settlement Banking Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-[#12101F]/10 grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#827C94]">
                    Affiliate Payee:
                  </div>
                  <div className="font-bold text-xs mt-0.5">{inspectingInvoice.affiliate_name}</div>
                  <div className="font-mono text-[11px] text-[#575266]">{inspectingInvoice.affiliate_email}</div>
                  {inspectingInvoice.pan_number && (
                    <div className="font-mono text-[10px] text-[#827C94] mt-1">PAN: {inspectingInvoice.pan_number}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#827C94]">
                    Disbursement Account:
                  </div>
                  <div className="font-mono text-xs font-semibold text-[#12101F] mt-0.5">
                    {inspectingInvoice.bank_account_number || inspectingInvoice.upi_id || 'On File'}
                  </div>
                  <div className="text-[11px] text-[#575266]">{inspectingInvoice.bank_name || ''} {inspectingInvoice.bank_ifsc ? `(${inspectingInvoice.bank_ifsc})` : ''}</div>
                  {inspectingInvoice.payout_reference && (
                    <div className="mt-2 text-emerald-700 font-mono text-[11px] font-bold">
                      UTR: {inspectingInvoice.payout_reference}
                    </div>
                  )}
                </div>
              </div>

              {/* Line Items */}
              {inspectingInvoice.items?.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-xs uppercase tracking-wider text-[#827C94]">
                    Referral Line Items
                  </div>
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-[#12101F]/10 text-[#827C94] uppercase text-[10px]">
                        <th className="py-2 px-3">Customer</th>
                        <th className="py-2 px-3">Provider / Service</th>
                        <th className="py-2 px-3 text-right">Commission</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#12101F]/5">
                      {inspectingInvoice.items.map((line) => (
                        <tr key={line.id}>
                          <td className="py-2 px-3 font-semibold">{line.customer_name}</td>
                          <td className="py-2 px-3 text-[#575266]">
                            {line.provider_name} • {line.service_name}
                          </td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-emerald-600">
                            ₹{line.commission_amount?.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Totals */}
              <div className="pt-4 border-t border-[#12101F]/10 flex justify-end">
                <div className="w-64 space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#575266]">
                    <span>Subtotal:</span>
                    <span className="font-mono">₹{inspectingInvoice.subtotal_amount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-red-600">
                    <span>TDS Withholding:</span>
                    <span className="font-mono">-₹{inspectingInvoice.tds_amount?.toLocaleString('en-IN') || '0.00'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#12101F] pt-2 border-t border-[#12101F]/10">
                    <span>Net Disbursed:</span>
                    <span className="font-mono text-emerald-700">
                      ₹{inspectingInvoice.total_payable?.toLocaleString('en-IN')}
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
