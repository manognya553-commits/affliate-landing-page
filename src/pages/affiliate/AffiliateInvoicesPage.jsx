import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import Card from '../../components/ui/Card'
import Table from '../../components/ui/Table'
import StatusBadge from '../../components/ui/StatusBadge'
import Button from '../../components/ui/Button'
import DemoDataNotice from '../../components/ui/DemoDataNotice'
import { FileText, Download, Landmark, Calendar, ShieldCheck, Check, CheckCircle2 } from 'lucide-react'

export default function AffiliateInvoicesPage() {
  const { profile, user } = useAuth()
  const { lang } = useLanguage()
  const [downloadingId, setDownloadingId] = useState(null)
  const [downloadSuccess, setDownloadSuccess] = useState('')

  const partnerCode = `SBL-${(user?.id || '882199').slice(0, 8).toUpperCase()}`

  // Sample verified invoice records
  const invoices = [
    {
      id: 'INV-2026-10-0914',
      period: '01 Oct 2026 – 31 Oct 2026',
      date: '10 Nov 2026',
      grossAmount: '₹40,000',
      tds: '₹2,000',
      netAmount: '₹38,000',
      rail: 'UPI Handle',
      utr: 'UTR-UPI2630981124',
      status: 'Paid',
    },
    {
      id: 'INV-2026-09-0822',
      period: '01 Sep 2026 – 30 Sep 2026',
      date: '10 Oct 2026',
      grossAmount: '₹25,000',
      tds: '₹1,250',
      netAmount: '₹23,750',
      rail: 'Bank NEFT',
      utr: 'UTR-SBIN2628491021',
      status: 'Paid',
    },
  ]

  const handleDownload = (invoiceId) => {
    setDownloadingId(invoiceId)
    setTimeout(() => {
      setDownloadingId(null)
      setDownloadSuccess(`Invoice ${invoiceId} statement generated and downloaded.`)
      setTimeout(() => setDownloadSuccess(''), 3500)
    }, 800)
  }

  const columns = [
    {
      header: 'Invoice #',
      key: 'id',
      render: (item) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#6B3CFF]" />
          <span className="font-mono font-bold text-[#12101F] text-xs">{item.id}</span>
        </div>
      ),
    },
    {
      header: 'Settlement Period',
      key: 'period',
      render: (item) => <span className="text-xs text-[#575266]">{item.period}</span>,
    },
    {
      header: 'Disbursement Date',
      key: 'date',
      render: (item) => <span className="text-xs font-medium text-[#12101F]">{item.date}</span>,
    },
    {
      header: 'Gross / TDS (5%)',
      key: 'grossAmount',
      render: (item) => (
        <div className="text-xs">
          <span className="font-medium text-[#12101F]">{item.grossAmount}</span>
          <span className="text-rose-600 block text-[11px]">TDS: -{item.tds}</span>
        </div>
      ),
    },
    {
      header: 'Net Disbursed',
      key: 'netAmount',
      render: (item) => (
        <span className="font-bold text-emerald-600 text-sm">{item.netAmount}</span>
      ),
    },
    {
      header: 'Rail & UTR Reference',
      key: 'utr',
      render: (item) => (
        <div className="text-xs">
          <span className="text-[#12101F] font-medium block">{item.rail}</span>
          <span className="font-mono text-[11px] text-[#575266]">{item.utr}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (item) => <StatusBadge status={item.status} size="sm" />,
    },
    {
      header: 'Action',
      key: 'action',
      align: 'right',
      render: (item) => (
        <Button
          size="sm"
          variant="outline"
          leftIcon={downloadingId === item.id ? null : Download}
          isLoading={downloadingId === item.id}
          onClick={() => handleDownload(item.id)}
        >
          Download PDF
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E8E2D8]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#12101F] tracking-tight">
            {lang === 'te' ? 'పన్ను రసీదులు & స్టేట్‌మెంట్లు' : 'Tax Invoices & Statements'}
          </h1>
          <p className="text-sm text-[#575266] mt-1">
            {lang === 'te'
              ? 'నెలవారీ కమీషన్ చెల్లింపుల అధికారిక రసీదులు మరియు TDS స్టేట్‌మెంట్లు'
              : 'Download monthly commission settlement receipts, GST tax statements, and banking UTR references.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-xl bg-[#F3ECE1] border border-[#E8E2D8] text-xs">
            <span className="text-[#575266]">Partner Code: </span>
            <span className="font-mono font-bold text-[#12101F]">{partnerCode}</span>
          </div>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="p-5" variant="surface">
          <span className="text-xs font-semibold text-[#575266] uppercase tracking-wider block">
            Net Paid Out (FY 2026-27)
          </span>
          <span className="text-2xl font-bold font-serif text-[#12101F] block mt-1">
            ₹61,750
          </span>
          <span className="text-xs text-emerald-600 font-medium mt-1 block">
            ✓ 2 Settlements Cleared
          </span>
        </Card>

        <Card padding="p-5" variant="surface">
          <span className="text-xs font-semibold text-[#575266] uppercase tracking-wider block">
            TDS Deposited (Sec 194H)
          </span>
          <span className="text-2xl font-bold font-serif text-rose-600 block mt-1">
            ₹3,250
          </span>
          <span className="text-xs text-[#575266] mt-1 block">
            Form 16A quarterly certificates
          </span>
        </Card>

        <Card padding="p-5" variant="surface">
          <span className="text-xs font-semibold text-[#575266] uppercase tracking-wider block">
            Active Payout Rail
          </span>
          <span className="text-lg font-bold text-[#12101F] block mt-1">
            {profile?.upi_id || 'UPI: partner@okhdfc'}
          </span>
          <span className="text-xs text-[#575266] mt-1 block">
            Direct instant transfer
          </span>
        </Card>

        <Card padding="p-5" variant="surface">
          <span className="text-xs font-semibold text-[#575266] uppercase tracking-wider block">
            Next Settlement Date
          </span>
          <span className="text-2xl font-bold font-serif text-[#6B3CFF] block mt-1">
            10 Nov 2026
          </span>
          <span className="text-xs text-[#575266] mt-1 block">
            Monthly batch disbursement
          </span>
        </Card>
      </div>

      {/* Statutory Section 194H Info */}
      <div className="rounded-xl bg-[#6B3CFF]/5 border border-[#6B3CFF]/20 p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#6B3CFF] shrink-0 mt-0.5" />
        <div className="text-xs text-[#12101F] space-y-1">
          <p className="font-semibold text-[#0E0B1E]">
            Statutory Section 194H Tax Withholding Compliance
          </p>
          <p className="text-[#575266] leading-relaxed">
            As mandated by the Indian Income Tax Act, a statutory 5% Tax Deducted at Source (TDS) is deducted from all gross affiliate commissions. Form 16A certificates are generated quarterly and credited directly to your PAN.
          </p>
        </div>
      </div>

      {/* Invoices Data Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold font-serif text-[#12101F]">
            Settlement Statement History
          </h2>
          <span className="text-xs text-[#575266]">{invoices.length} Statements available</span>
        </div>

        <Table
          columns={columns}
          data={invoices}
          emptyMessage="No settlement statements issued yet. Commission invoices are generated on the 10th of each calendar month."
        />
      </div>

      <DemoDataNotice />
    </div>
  )
}
