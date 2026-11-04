import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import {
  User,
  ShieldCheck,
  Bell,
  Landmark,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Save,
  Globe,
  Sparkles,
} from 'lucide-react'

export default function AffiliateProfilePage() {
  const { profile, user, updateProfile, refreshProfile } = useAuth()
  const { lang, setLang } = useLanguage()

  const partnerId = `SBL-${(user?.id || '882199').slice(0, 8).toUpperCase()}`

  // Profile Form States
  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [phone, setPhone] = useState(profile?.phone || '')
  const [city, setCity] = useState(profile?.city || '')
  const [area, setArea] = useState(profile?.area || '')
  const [occupation, setOccupation] = useState(profile?.occupation || 'Tech & Digital Creators')
  const [preferredLanguage, setPreferredLanguage] = useState(profile?.preferred_language || lang || 'en')

  // Settlement States
  const [upiId, setUpiId] = useState(profile?.upi_id || '')
  const [bankName, setBankName] = useState(profile?.bank_name || '')
  const [accountNumber, setAccountNumber] = useState(profile?.bank_account_number || '')
  const [ifsc, setIfsc] = useState(profile?.bank_ifsc || '')
  const [panNumber, setPanNumber] = useState(profile?.pan_number || '')

  // Notification Toggles
  const [notifyWhatsapp, setNotifyWhatsapp] = useState(true)
  const [notifyEmail, setNotifyEmail] = useState(true)

  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [copiedId, setCopiedId] = useState(false)

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setPhone(profile.phone || '')
      setCity(profile.city || '')
      setArea(profile.area || '')
      setOccupation(profile.occupation || 'Tech & Digital Creators')
      setPreferredLanguage(profile.preferred_language || lang || 'en')
      setUpiId(profile.upi_id || '')
      setBankName(profile.bank_name || '')
      setAccountNumber(profile.bank_account_number || '')
      setIfsc(profile.bank_ifsc || '')
      setPanNumber(profile.pan_number || '')
    }
  }, [profile])

  const copyCode = () => {
    navigator.clipboard.writeText(partnerId)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2200)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccessMsg('')
    setErrorMsg('')

    try {
      await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        city: city.trim(),
        area: area.trim(),
        occupation: occupation.trim(),
        preferred_language: preferredLanguage,
        upi_id: upiId.trim() || null,
        bank_name: bankName.trim() || null,
        bank_account_number: accountNumber.trim() || null,
        bank_ifsc: ifsc.trim().toUpperCase() || null,
        pan_number: panNumber.trim().toUpperCase() || null,
      })

      if (preferredLanguage !== lang) {
        setLang(preferredLanguage)
      }

      await refreshProfile()
      setSuccessMsg(
        lang === 'te'
          ? 'మీ ప్రొఫైల్ మరియు సెట్టింగ్స్ విజయవంతంగా భద్రపరచబడ్డాయి!'
          : 'Your partner profile and settings have been saved successfully!'
      )
      setTimeout(() => setSuccessMsg(''), 4000)
    } catch (err) {
      console.error('Failed to update profile:', err)
      setErrorMsg(err.message || 'Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200 max-w-5xl mx-auto">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E8E2D8] pb-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-[#0E0B1E] tracking-tight">
            {lang === 'te' ? 'భాగస్వామి ప్రొఫైల్ & సెట్టింగ్స్' : 'Partner Profile & Settings'}
          </h1>
          <p className="text-sm text-[#575266] max-w-2xl mt-1 leading-relaxed">
            {lang === 'te'
              ? 'మీ అట్రిబ్యూషన్ కోడ్, సంప్రదింపు వివరాలు మరియు కమీషన్ చెల్లింపు సెట్టింగ్‌లను నిర్వహించండి.'
              : 'Manage your referral credentials, disbursement rails, and communication alert channels.'}
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle size={16} className="text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 2. Account Credentials & Referral Code Card */}
        <Card padding="p-6" variant="surface" className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
            <div className="flex items-center gap-2 text-[#12101F]">
              <ShieldCheck className="w-5 h-5 text-[#6B3CFF]" />
              <h2 className="font-serif font-bold text-base">
                Account Credentials & Attribution Code
              </h2>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active Partner
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-[#E8E2D8]">
              <span className="text-[11px] font-semibold text-[#575266] uppercase tracking-wider block">
                Partner Referral Code
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono font-bold text-base text-[#6B3CFF]">
                  {partnerId}
                </span>
                <button
                  type="button"
                  onClick={copyCode}
                  className="p-1 rounded-lg hover:bg-black/5 text-[#575266] hover:text-[#12101F] transition-colors cursor-pointer border-none bg-transparent"
                >
                  {copiedId ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
              <span className="text-[10px] text-[#575266] mt-1 block">
                Locked with client introductions for 60 days
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E8E2D8]">
              <span className="text-[11px] font-semibold text-[#575266] uppercase tracking-wider block">
                Registered Email
              </span>
              <span className="font-medium text-xs text-[#12101F] block mt-1 truncate">
                {user?.email}
              </span>
              <span className="text-[10px] text-emerald-600 mt-1 block font-semibold">
                ✓ Verified Account
              </span>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E8E2D8]">
              <span className="text-[11px] font-semibold text-[#575266] uppercase tracking-wider block">
                Account Role
              </span>
              <span className="font-bold text-xs text-[#12101F] block mt-1 uppercase">
                {user?.role || 'Affiliate Partner'}
              </span>
              <span className="text-[10px] text-[#575266] mt-1 block">
                Pan-India Enterprise Partner
              </span>
            </div>
          </div>
        </Card>

        {/* 3. Partner Profile Details */}
        <Card padding="p-6" variant="surface" className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8E2D8]">
            <User className="w-5 h-5 text-[#6B3CFF]" />
            <h2 className="font-serif font-bold text-base text-[#12101F]">
              Partner Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name / Brand Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <Input
              label="Phone / WhatsApp Contact"
              required
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Input
              label="City"
              required
              placeholder="Hyderabad / Vijayawada / Bangalore"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <Select
              label="Promotion Sector / Category"
              required
              options={[
                { value: 'Tech & Digital Creators', label: 'Tech & Digital Creators' },
                { value: 'Healthcare & Clinics', label: 'Healthcare & Clinics' },
                { value: 'Education & Coaching', label: 'Education & Coaching' },
                { value: 'Professional & Financial Services', label: 'Professional & Financial Services' },
                { value: 'General Agency', label: 'General Agency / Consultancy' },
              ]}
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#12101F] block mb-2">
              Preferred Interface Language
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#12101F]">
                <input
                  type="radio"
                  name="prefLang"
                  value="en"
                  checked={preferredLanguage === 'en'}
                  onChange={() => setPreferredLanguage('en')}
                  className="w-4 h-4 text-[#6B3CFF]"
                />
                <span>English (Default)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#12101F]">
                <input
                  type="radio"
                  name="prefLang"
                  value="te"
                  checked={preferredLanguage === 'te'}
                  onChange={() => setPreferredLanguage('te')}
                  className="w-4 h-4 text-[#6B3CFF]"
                />
                <span>తెలుగు (Draft Telugu UI)</span>
              </label>
            </div>
          </div>
        </Card>

        {/* 4. Disbursement & Settlement Settings */}
        <Card padding="p-6" variant="surface" className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8E2D8]">
            <Landmark className="w-5 h-5 text-[#6B3CFF]" />
            <h2 className="font-serif font-bold text-base text-[#12101F]">
              Disbursement & Payout Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Payout UPI Handle (Instant Transfer)"
              placeholder="partner@okhdfcbank"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              helperText="Disbursed automatically on 10th of every month."
            />

            <Input
              label="PAN Number (Required for Section 194H TDS)"
              placeholder="ABCDE1234F"
              value={panNumber}
              onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
              helperText="Enables Form 16A tax credit filing."
            />

            <Input
              label="Bank Name"
              placeholder="State Bank of India / HDFC"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />

            <Input
              label="Bank Account Number"
              placeholder="000000000000"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />

            <Input
              label="IFSC Code"
              placeholder="SBIN0001234"
              value={ifsc}
              onChange={(e) => setIfsc(e.target.value.toUpperCase())}
            />
          </div>
        </Card>

        {/* 5. Notification Alert Channels */}
        <Card padding="p-6" variant="surface" className="space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E8E2D8]">
            <Bell className="w-5 h-5 text-[#6B3CFF]" />
            <h2 className="font-serif font-bold text-base text-[#12101F]">
              Notification Preferences
            </h2>
          </div>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E8E2D8] cursor-pointer">
              <div>
                <span className="text-xs font-bold text-[#12101F] block">
                  WhatsApp Deal & Progression Alerts
                </span>
                <span className="text-[11px] text-[#575266]">
                  Receive real-time notifications when a referred lead is contacted or converted.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyWhatsapp}
                onChange={(e) => setNotifyWhatsapp(e.target.checked)}
                className="w-4 h-4 text-[#6B3CFF] rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#E8E2D8] cursor-pointer">
              <div>
                <span className="text-xs font-bold text-[#12101F] block">
                  Monthly Payout Statements via Email
                </span>
                <span className="text-[11px] text-[#575266]">
                  Receive an official invoice statement and UTR reference on the 10th of every month.
                </span>
              </div>
              <input
                type="checkbox"
                checked={notifyEmail}
                onChange={(e) => setNotifyEmail(e.target.checked)}
                className="w-4 h-4 text-[#6B3CFF] rounded"
              />
            </label>
          </div>
        </Card>

        {/* Save Action */}
        <div className="flex items-center justify-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={saving}
            leftIcon={Save}
          >
            Save Profile & Settlement Settings
          </Button>
        </div>
      </form>
    </div>
  )
}
