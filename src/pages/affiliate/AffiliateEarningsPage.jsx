import React, { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useLanguage } from '../../context/useLanguage'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Table from '../../components/ui/Table'
import StatusBadge from '../../components/ui/StatusBadge'
import Input from '../../components/ui/Input'
import DemoDataNotice from '../../components/ui/DemoDataNotice'
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
  HeartPulse,
  GraduationCap,
  Sparkles,
  Lock,
  Save,
} from 'lucide-react'

export default function AffiliateEarningsPage() {
  const { lang } = useLanguage()

  const [metrics, setMetrics] = useState({
    active_referrals: 0,
    converted_introductions: 0,
    verified_pipeline: 0,
    performance_ratio: 0.0,
  })
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

  // Itemized transaction ledger
  const transactions = [
    {
      id: 'TXN-202610-8812',
      client: 'Apex Coaching Academy',
      service: 'WhatsApp Automation & Ads',
      dealSize: '₹1,20,000',
      rate: '20%',
      grossCommission: '₹24,000',
      tds: '₹1,200',
      netPayout: '₹22,800',
      status: 'Paid',
      date: '10 Oct 2026',
    },
    {
      id: 'TXN-202610-9104',
      client: 'Sunrise Multi-Specialty Clinic',
      service: 'Website Redesign & SEO',
      dealSize: '₹1,90,000',
      rate: '20%',
      grossCommission: '₹38,000',
      tds: '₹1,900',
      netPayout: '₹36,100',
      status: 'Processing',
      date: '10 Nov 2026 (Scheduled)',
    },
    {
      id: 'TXN-202611-0142',
      client: 'Elite Dental Care Hospital',
      service: 'WhatsApp Cloud API',
      dealSize: '₹85,000',
      rate: '20%',
      grossCommission: '₹17,000',
      tds: '₹850',
      netPayout: '₹16,150',
      status: 'Pending',
      date: 'In Discovery Verification',
    },
  ]

  const loadData = async () => {
    try {
      setLoading(true)
      const [metricsRes, profileRes] = await Promise.all([
        api.getAffiliateMetrics(),
        api.getAffiliateProfile(),
      ])

      if (metricsRes) setMetrics(metricsRes)
      if (profileRes) {
        setProfile(profileRes)
        setBankName(profileRes.bank_name || '')
        setAccountNumber(profileRes.bank_account_number || '')
        setIfsc(profileRes.bank_ifsc || '')
        setUpiId(profileRes.upi_id || '')
        setPanNumber(profileRes.pan_number || '')
      }
    } catch (err) {
      console.error('Failed to load earnings & settlement data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSaveSettlement = async (e) => {
    e.preventDefault()
    setSavingBank(true)
    setSaveSuccess('')
    setSaveError('')

    try {
      const updated = await api.updateAffiliateProfile({
        bank_name: bankName.trim() || null,
        bank_account_number: accountNumber.trim() || null,
        bank_ifsc: ifsc.trim().toUpperCase() || null,
        upi_id: upiId.trim() || null,
        pan_number: panNumber.trim().toUpperCase() || null,
      })
      setProfile(updated)
      setSaveSuccess(
        lang === 'te'
          ? 'బ్యాంక్ మరియు చెల్లింపు వివరాలు విజయవంతంగా భద్రపరచబడ్డాయి.'
          : 'Settlement and banking details updated successfully.'
      )
      setTimeout(() => setSaveSuccess(''), 4000)
    } catch (err) {
      setSaveError(err.message || 'Failed to update settlement details.')
    } finally {
      setSavingBank(false)
    }
  }

  const transactionColumns = [
    {
      header: 'Txn ID & Date',
      key: 'id',
      render: (item) => (
        <div>
          <span className="font-mono font-bold text-xs text-[#12101F] block">{item.id}</span>
          <span className="text-[11px] text-[#575266]">{item.date}</span>
        </div>
      ),
    },
    {
      header: 'Client & Service',
      key: 'client',
      render: (item) => (
        <div>
          <span className="font-semibold text-xs text-[#12101F] block">{item.client}</span>
          <span className="text-[11px] text-[#6B3CFF] font-medium">{item.service}</span>
        </div>
      ),
    },
    {
      header: 'Deal Size / Rate',
      key: 'dealSize',
      render: (item) => (
        <span className="text-xs text-[#12101F]">
          {item.dealSize} <span className="text-[#575266]">({item.rate})</span>
        </span>
      ),
    },
    {
      header: 'Gross / TDS (5%)',
      key: 'grossCommission',
      render: (item) => (
        <div className="text-xs">
          <span className="font-semibold text-[#12101F]">{item.grossCommission}</span>
          <span className="text-rose-600 block text-[11px]">TDS: -{item.tds}</span>
        </div>
      ),
    },
    {
      header: 'Net Payout',
      key: 'netPayout',
      render: (item) => (
        <span className="font-bold text-emerald-600 text-xs sm:text-sm">
          {item.netPayout}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (item) => <StatusBadge status={item.status} size="sm" />,
    },
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E8E2D8] pb-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#0E0B1E] tracking-tight">
            {lang === 'te' ? 'కమీషన్ లెడ్జర్ & సెటిల్మెంట్' : 'Commission Ledger & Settlements'}
          </h1>
          <p className="text-sm text-[#575266] max-w-2xl mt-1 leading-relaxed">
            {lang === 'te'
              ? 'ధృవీకరించబడిన క్లయింట్ ఒప్పందాల కమీషన్ వివరాలు, 5% TDS పన్ను మినహాయింపు మరియు బ్యాంక్ సెటిల్మెంట్ స్థితి.'
              : 'Audit accrued commission settlements, statutory Section 194H tax withholding, and manage your disbursement bank accounts.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#D6F36B] text-[#0E0B1E]">
            Next Payout: 10 Nov 2026
          </span>
        </div>
      </div>

      {/* 2. Four Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="p-5" variant="surface">
          <span className="text-xs font-semibold text-[#575266] uppercase tracking-wider block">
            Cleared Balance
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-serif text-[#12101F] block mt-1">
            ₹36,100
          </span>
          <span className="text-xs text-emerald-600 font-medium mt-1 block">
            ✓ Scheduled for 10 Nov payout
          </span>
        </Card>

        <Card padding="p-5" variant="surface">
          <span className="text-xs font-semibold text-[#575266] uppercase tracking-wider block">
            Pending Conversion
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-serif text-amber-600 block mt-1">
            ₹16,150
          </span>
          <span className="text-xs text-[#575266] mt-1 block">
            Tied to Qualified discovery deals
          </span>
        </Card>

        <Card padding="p-5" variant="surface">
          <span className="text-xs font-semibold text-[#575266] uppercase tracking-wider block">
            Lifetime Paid Out
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-serif text-emerald-700 block mt-1">
            ₹22,800
          </span>
          <span className="text-xs text-[#575266] mt-1 block">
            Disbursed with banking UTR
          </span>
        </Card>

        <Card padding="p-5" variant="surface">
          <span className="text-xs font-semibold text-[#575266] uppercase tracking-wider block">
            Section 194H TDS Withheld
          </span>
          <span className="text-2xl sm:text-3xl font-bold font-serif text-rose-600 block mt-1">
            ₹3,100
          </span>
          <span className="text-xs text-[#575266] mt-1 block">
            Quarterly Form 16A certificates
          </span>
        </Card>
      </div>

      {/* 3. Statutory Tax Compliance Card */}
      <div className="rounded-2xl bg-[#6B3CFF]/5 border border-[#6B3CFF]/20 p-5 flex items-start gap-4 shadow-2xs">
        <ShieldCheck className="w-6 h-6 text-[#6B3CFF] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-[#12101F]">
          <p className="font-bold text-sm text-[#0E0B1E]">
            Statutory Section 194H Tax Compliance (Indian Income Tax Act)
          </p>
          <p className="text-[#575266] leading-relaxed">
            In compliance with statutory Indian tax laws, all affiliate commission and brokerage disbursements are subject to a standard <strong>5% Tax Deducted at Source (TDS)</strong> under Section 194H. Our accounts team submits these deposits directly to the IT Department using your registered PAN, allowing you to claim full tax credits on your annual Form 26AS.
          </p>
        </div>
      </div>

      {/* 4. Itemized Transaction Ledger & Settlement Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Transaction Ledger */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-serif text-[#12101F]">
              Itemized Deal Conversion Ledger
            </h2>
            <span className="text-xs text-[#575266]">3 Verified Transactions</span>
          </div>

          <Table
            columns={transactionColumns}
            data={transactions}
            emptyMessage="No converted transactions yet."
          />
        </div>

        {/* Right Column: Settlement Banking Form */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold font-serif text-[#12101F]">
            Settlement & Banking Details
          </h2>

          <Card padding="p-6" variant="surface" className="space-y-4">
            {saveSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                <span>{saveSuccess}</span>
              </div>
            )}

            {saveError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0 text-rose-600" />
                <span>{saveError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSettlement} className="space-y-3.5">
              <Input
                label="Payout UPI Handle (Fastest)"
                placeholder="partner@okaxis or name@upi"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                helperText="Direct instant transfer rail on 10th of every month."
              />

              <Input
                label="Bank Name"
                placeholder="State Bank of India / HDFC Bank"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
              />

              <Input
                label="Bank Account Number"
                placeholder="000000000000"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="IFSC Code"
                  placeholder="SBIN0001234"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                />

                <Input
                  label="PAN Number"
                  placeholder="ABCDE1234F"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  helperText="Required for Section 194H TDS"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  className="w-full"
                  isLoading={savingBank}
                  leftIcon={Save}
                >
                  Save Settlement Profile
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      <DemoDataNotice />
    </div>
  )
}
