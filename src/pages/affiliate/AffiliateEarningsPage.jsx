import React, { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useLanguage } from '../../context/useLanguage'
import { getPortalText } from '../../i18n/portalTranslations'
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
  RefreshCw,
  Lock,
} from 'lucide-react'

export default function AffiliateEarningsPage() {
  const { lang } = useLanguage()

  const [metrics, setMetrics] = useState({
    active_referrals: 0,
    converted_introductions: 0,
    verified_pipeline: 0,
    performance_ratio: 0.0,
  })
  const [convertedLeads, setConvertedLeads] = useState([])
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

  const t = (path) => getPortalText(lang, path)

  const loadData = async () => {
    try {
      setLoading(true)
      const [metricsRes, referralsRes, profileRes] = await Promise.all([
        api.getAffiliateMetrics(),
        api.getAffiliateReferrals('converted'),
        api.getAffiliateProfile(),
      ])

      if (metricsRes) setMetrics(metricsRes)
      if (Array.isArray(referralsRes)) setConvertedLeads(referralsRes)
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
    } catch (err) {
      setSaveError(err.message || 'Failed to update settlement details.')
    } finally {
      setSavingBank(false)
    }
  }

  const getSectorIcon = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'healthcare':
        return <HeartPulse size={15} className="text-[#6B3CFF]" />
      case 'education':
        return <GraduationCap size={15} className="text-[#6B3CFF]" />
      case 'professional':
        return <Building2 size={15} className="text-[#6B3CFF]" />
      default:
        return <Sparkles size={15} className="text-[#6B3CFF]" />
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-black/10 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B3CFF]">
            {lang === 'te' ? 'రిఫరల్ పరిహారం మరియు సెటిల్మెంట్' : 'Referral Attribution & Settlement'}
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0E0B1E] tracking-tight mt-1">
            {lang === 'te' ? 'పరిహార నిబంధనలు & ఆదాయాలు' : 'Compensation & Payout Tracking'}
          </h1>
          <p className="text-sm text-[#0E0B1E]/70 max-w-2xl mt-1 leading-relaxed">
            {lang === 'te'
              ? 'ప్రతి సేవా ప్రొవైడర్ తమ సొంత నిబంధనల ప్రకారం పరిహారాన్ని నిర్ణయిస్తారు. మీ ధృవీకరించబడిన పరిచయాలు మరియు సెటిల్మెంట్ వివరాలు ఇక్కడ ఉంటాయి.'
              : 'Each authorized service provider defines its own compensation schedule. Track verified introductions and manage your settlement details securely.'}
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-[#6B3CFF] flex items-center justify-center">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-2xl font-black text-[#0E0B1E]">
              {loading ? '...' : metrics.converted_introductions}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/50">
              {lang === 'te' ? 'ధృవీకరించబడిన పరిచయాలు' : 'Verified Conversions'}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="text-base font-bold text-emerald-700">
              {profile?.bank_account_number || profile?.upi_id
                ? (lang === 'te' ? 'వివరాలు నమోదు చేయబడ్డాయి' : 'Account Configured')
                : (lang === 'te' ? 'నమోదు కాలేదు' : 'Action Required')}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/50">
              {lang === 'te' ? 'సెటిల్మెంట్ స్థితి' : 'Settlement Profile'}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-black/10 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-base font-bold text-[#0E0B1E]">
              {lang === 'te' ? 'ప్రొవైడర్ గడువు ప్రకారం' : 'Provider Term Cycle'}
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/50">
              {lang === 'te' ? 'ధృవీకరణ: 14–30 పనిదినాలు' : 'Net 14–30 Business Days'}
            </div>
          </div>
        </div>
      </div>

      {/* Provider Model Explanation Note */}
      <div className="p-5 rounded-2xl bg-[#0E0B1E] text-white flex items-start gap-4 shadow-md">
        <Info size={22} className="text-[#D6F36B] shrink-0 mt-0.5" />
        <div className="space-y-1 text-sm leading-relaxed">
          <p className="font-bold text-[#D6F36B]">
            {lang === 'te' ? 'ప్రొవైడర్-నిర్దిష్ట పరిహార విధానం' : 'Provider-Defined Compensation Policy'}
          </p>
          <p className="text-white/80 text-xs sm:text-sm">
            {lang === 'te'
              ? 'sBLOOM ఒక నాలెడ్జ్-ఆధారిత పరిచయ నెట్‌వర్క్. మేము ఎలాంటి కల్పిత కమీషన్ శాతాలను లేదా స్థిర ఆదాయ హామీలను ఇవ్వము. ప్రతి సేవా ప్రొవైడర్ సంప్రదింపు నిబంధనల ప్రకారం పరిహారాన్ని నేరుగా సెటిల్ చేస్తుంది.'
              : 'sBLOOM operates strictly on an honest referral attribution model. We do not advertise fabricated commission rates or guaranteed earnings. Compensation terms are provider-defined and disbursed following verified engagement completion.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Settlement & Banking Information Form */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-black/10 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Landmark size={20} className="text-[#6B3CFF]" />
              <h2 className="text-lg font-bold text-[#0E0B1E]">
                {lang === 'te' ? 'బ్యాంక్ & UPI సెటిల్మెంట్ వివరాలు' : 'Bank & Settlement Details'}
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <Lock size={11} />
              {lang === 'te' ? 'రక్షితం' : 'Encrypted'}
            </span>
          </div>

          {saveSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{saveSuccess}</span>
            </div>
          )}

          {saveError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{saveError}</span>
            </div>
          )}

          <form onSubmit={handleSaveSettlement} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/60 mb-1.5">
                {lang === 'te' ? 'బ్యాంక్ పేరు' : 'Bank Name'}
              </label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                placeholder="State Bank of India / HDFC Bank"
                className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/60 mb-1.5">
                  {lang === 'te' ? 'ఖాతా సంఖ్య' : 'Account Number'}
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="000000000000"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/60 mb-1.5">
                  {lang === 'te' ? 'IFSC కోడ్' : 'IFSC Code'}
                </label>
                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  placeholder="SBIN0001234"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/60 mb-1.5">
                  {lang === 'te' ? 'UPI ID (ఐచ్ఛికం)' : 'UPI ID (Optional)'}
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@okaxis"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/60 mb-1.5">
                  {lang === 'te' ? 'పాన్ సంఖ్య (PAN)' : 'PAN Card Number'}
                </label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingBank}
                className="w-full py-3 px-6 rounded-xl bg-[#6B3CFF] text-white font-semibold text-sm hover:bg-[#592be0] transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {savingBank ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <span>{lang === 'te' ? 'వివరాలను సేవ్ చేయండి' : 'Save Settlement Details'}</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Converted Leads Tracking List */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-black/10 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0E0B1E]">
              {lang === 'te' ? 'ధృవీకరించబడిన మార్పిడులు' : 'Verified Introductions'}
            </h2>
            <span className="text-xs font-bold text-[#6B3CFF] bg-[#6B3CFF]/10 px-2.5 py-1 rounded-full">
              {convertedLeads.length} {lang === 'te' ? 'మొత్తం' : 'Total'}
            </span>
          </div>

          {convertedLeads.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-black/5 text-black/40 flex items-center justify-center mx-auto">
                <Clock size={22} />
              </div>
              <p className="text-sm font-semibold text-[#0E0B1E]/70">
                {lang === 'te' ? 'ఇంకా మార్పిడులు పూర్తి కాలేదు' : 'No Converted Introductions Yet'}
              </p>
              <p className="text-xs text-[#0E0B1E]/50 max-w-sm mx-auto leading-relaxed">
                {lang === 'te'
                  ? 'మీరు సమర్పించిన రిఫరల్స్ సేవా ప్రొవైడర్ ద్వారా ధృవీకరించబడిన తర్వాత, అవి ఇక్కడ కనిపిస్తాయి.'
                  : 'When your introduced clients complete their consultation and meet provider criteria, they will be listed here for settlement tracking.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {convertedLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 rounded-2xl border border-black/10 bg-[#FAF7F2]/50 hover:bg-[#FAF7F2] transition-colors flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#0E0B1E]">
                        {lead.client_name}
                      </span>
                      <span className="text-xs text-[#0E0B1E]/50">
                        • {lead.client_city}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#0E0B1E]/70">
                      {getSectorIcon(lead.service_category)}
                      <span className="capitalize">{lead.service_category}</span>
                      {lead.provider_name && (
                        <span>— <span className="font-semibold text-[#0E0B1E]">{lead.provider_name}</span></span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 size={12} />
                      {lang === 'te' ? 'ధృవీకరించబడింది' : 'Converted'}
                    </span>
                    <div className="text-[10px] text-[#0E0B1E]/40 mt-1 font-mono">
                      {new Date(lead.updated_at || lead.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
