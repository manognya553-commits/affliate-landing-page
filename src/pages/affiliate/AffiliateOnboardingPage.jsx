import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import { getPortalCopy } from '../../i18n/portalTranslations'
import {
  User,
  MapPin,
  Building,
  Phone,
  Briefcase,
  FileText,
  Save,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  LogOut,
} from 'lucide-react'

export default function AffiliateOnboardingPage() {
  const { profile, updateProfile, submitProfile, signOut, loading: authLoading } = useAuth()
  const { lang, setLang } = useLanguage()
  const copy = getPortalCopy(lang)
  const navigate = useNavigate()

  // Helper to map UI occupation ids to backend DB choices
  const toDbOccupation = (id) => {
    if (id === 'tutor_educator') return 'tutor'
    if (id === 'community_leader') return 'community_connector'
    return id
  }

  // Form State initialized from profile (Save & Resume)
  const [fullName, setFullName] = useState('')
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [phone, setPhone] = useState('')
  const [occupation, setOccupation] = useState('')
  const [promotionPlan, setPromotionPlan] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  const [savingDraft, setSavingDraft] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Prepopulate from existing profile row
  useEffect(() => {
    if (profile) {
      if (profile.full_name) setFullName(profile.full_name)
      if (profile.city) setCity(profile.city)
      if (profile.area) setArea(profile.area)
      if (profile.mobile) setPhone(profile.mobile)
      if (profile.occupation) setOccupation(profile.occupation)
      if (profile.promotion_plan) setPromotionPlan(profile.promotion_plan)
      if (profile.terms_accepted_at) setTermsAccepted(true)
    }
  }, [profile])

  // Clear toast after 4 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 4000)
      return () => clearTimeout(timer)
    }
  }, [toastMessage])

  // Save draft without completing/enforcing required terms
  const handleSaveDraft = async () => {
    setErrorMessage('')
    setSavingDraft(true)
    try {
      await updateProfile({
        full_name: fullName.trim() || null,
        city: city.trim() || null,
        area: area.trim() || null,
        mobile: phone.trim() || null,
        occupation: occupation || null,
        promotion_plan: promotionPlan.trim() || null,
      })
      setToastMessage(copy.onboarding.draftSavedMsg)
    } catch (err) {
      console.error('Save draft error:', err)
      setErrorMessage(err.message || copy.common.error)
    } finally {
      setSavingDraft(false)
    }
  }

  // Complete and submit for review (auto-activates in backend)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    // Validate all required onboarding fields
    if (
      !fullName.trim() ||
      !city.trim() ||
      !area.trim() ||
      !occupation.trim() ||
      !promotionPlan.trim() ||
      !termsAccepted
    ) {
      setErrorMessage(copy.onboarding.validationErrorMsg)
      return
    }

    setSubmitting(true)
    try {
      await submitProfile({
        full_name: fullName.trim(),
        city: city.trim(),
        area: area.trim(),
        mobile: phone.trim() || null,
        occupation: toDbOccupation(occupation),
        promotion_plan: promotionPlan.trim(),
        terms_accepted: true,
        terms_version: 1,
      })
      navigate('/app', { replace: true })
    } catch (err) {
      console.error('Submit onboarding error:', err)
      setErrorMessage(err.message || copy.common.error)
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#6B3CFF]" size={32} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-body">
      {/* Top Bar with brand, language switch and logout */}
      <div className="max-w-3xl mx-auto flex items-center justify-between pb-6 mb-6 border-b border-[#12101F]/10">
        <Link to="/" className="inline-flex items-center gap-1 no-underline group" aria-label="sBLOOM Home">
          <span className="font-body text-[22px] font-black text-brand-violet leading-none">s</span>
          <span className="font-body text-[20px] font-black text-ink tracking-tight leading-none mr-2">BLOOM</span>
          <span className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-brand-violet bg-brand-violet/[0.08] px-2.5 py-0.5 rounded-full border border-brand-violet/20">
            {copy.onboarding.badge}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="inline-flex items-center bg-white border border-[#12101F]/10 rounded-full p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all border-none cursor-pointer ${
                lang === 'en' ? 'bg-[#6B3CFF] text-white' : 'bg-transparent text-[#827C94]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('te')}
              className={`px-3 py-1 rounded-full text-xs font-bold font-telugu-sans transition-all border-none cursor-pointer ${
                lang === 'te' ? 'bg-[#6B3CFF] text-white' : 'bg-transparent text-[#827C94]'
              }`}
            >
              తెలుగు
            </button>
          </div>

          <Link
            to="/app"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-white bg-[#6B3CFF] hover:bg-[#5025D1] transition-all no-underline shadow-xs"
          >
            <span>{lang === 'te' ? 'పోర్టల్ →' : 'Portal →'}</span>
          </Link>

          <button
            type="button"
            onClick={signOut}
            title={copy.common.logout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-[#827C94] hover:text-[#12101F] bg-white border border-[#12101F]/10 hover:bg-black/5 transition-all cursor-pointer"
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">{copy.common.logout}</span>
          </button>
        </div>
      </div>

      {/* Main Form Container */}
      <div className="max-w-3xl mx-auto">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-[#16A34A]/10 border border-[#16A34A]/30 text-[#166534] text-sm flex items-center gap-2.5 shadow-md">
            <CheckCircle2 size={18} className="shrink-0 text-[#16A34A]" />
            <span className="font-medium">{toastMessage}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2.5">
            <AlertCircle size={18} className="shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="bg-white rounded-[32px] p-6 sm:p-10 lg:p-12 border border-[#12101F]/10 shadow-xl shadow-[#12101F]/4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6B3CFF] via-[#FF4FA3] to-[#D6F36B]" />

          {/* Header */}
          <div className="flex flex-col gap-2 pb-8 mb-8 border-b border-[#12101F]/10">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF7F2] border border-[#12101F]/10 rounded-full w-fit text-xs font-mono text-[#827C94]">
                <Sparkles size={13} className="text-[#6B3CFF]" />
                <span>Step 1 // Profile Onboarding</span>
              </div>
              <Link
                to="/app"
                className="inline-flex sm:hidden items-center gap-1.5 text-xs font-bold text-[#6B3CFF] no-underline hover:underline"
              >
                <span>{lang === 'te' ? 'పోర్టల్‌కి వెళ్లండి →' : 'Skip to Portal →'}</span>
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-headline text-[#12101F] tracking-tight m-0">
              {copy.onboarding.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-1">
              <p className="text-sm sm:text-base text-[#575266] m-0 leading-relaxed max-w-lg">
                {copy.onboarding.subtitle}
              </p>
              <Link
                to="/app"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6B3CFF] text-white text-xs sm:text-sm font-bold no-underline hover:bg-[#5025D1] transition-all shadow-md shrink-0"
              >
                <span>{lang === 'te' ? 'నేరుగా పోర్టల్‌కి వెళ్లండి →' : 'Go directly to Portal →'}</span>
              </Link>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* 1. Full Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="onb-fullname" className="text-xs font-bold text-[#12101F] font-headline flex items-center justify-between">
                <span>{copy.onboarding.fullNameLabel} <span className="text-[#6B3CFF]">*</span></span>
                <span className="text-[11px] font-normal text-[#827C94]">{copy.common.required}</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827C94]" />
                <input
                  id="onb-fullname"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={copy.onboarding.fullNamePlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/40 text-sm text-[#12101F] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] focus:bg-white transition-all box-border"
                />
              </div>
            </div>

            {/* 2. City & Area (2-column on desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="onb-city" className="text-xs font-bold text-[#12101F] font-headline">
                  {copy.onboarding.cityLabel} <span className="text-[#6B3CFF]">*</span>
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827C94]" />
                  <input
                    id="onb-city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={copy.onboarding.cityPlaceholder}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/40 text-sm text-[#12101F] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] focus:bg-white transition-all box-border"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="onb-area" className="text-xs font-bold text-[#12101F] font-headline">
                  {copy.onboarding.areaLabel} <span className="text-[#6B3CFF]">*</span>
                </label>
                <div className="relative">
                  <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827C94]" />
                  <input
                    id="onb-area"
                    type="text"
                    required
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder={copy.onboarding.areaPlaceholder}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/40 text-sm text-[#12101F] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] focus:bg-white transition-all box-border"
                  />
                </div>
              </div>
            </div>

            {/* 3. Mobile Number (Optional) */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="onb-phone" className="text-xs font-bold text-[#12101F] font-headline flex items-center justify-between">
                <span>{copy.onboarding.phoneLabel}</span>
                <span className="text-[11px] font-normal text-[#827C94]">{copy.common.optional}</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827C94]" />
                <input
                  id="onb-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={copy.onboarding.phonePlaceholder}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/40 text-sm text-[#12101F] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] focus:bg-white transition-all box-border"
                />
              </div>
              <p className="text-[11px] text-[#827C94] m-0">{copy.onboarding.phoneHelp}</p>
            </div>

            {/* 4. Occupation */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="onb-occupation" className="text-xs font-bold text-[#12101F] font-headline">
                {copy.onboarding.occupationLabel} <span className="text-[#6B3CFF]">*</span>
              </label>
              <div className="relative">
                <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827C94]" />
                <select
                  id="onb-occupation"
                  required
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/40 text-sm text-[#12101F] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] focus:bg-white transition-all appearance-none cursor-pointer box-border"
                >
                  <option value="" disabled>
                    {copy.onboarding.occupationPlaceholder}
                  </option>
                  {copy.onboarding.occupations.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 5. Promotion Plan */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="onb-plan" className="text-xs font-bold text-[#12101F] font-headline flex items-center justify-between">
                <span>{copy.onboarding.promotionPlanLabel} <span className="text-[#6B3CFF]">*</span></span>
                <span className="text-[11px] font-normal text-[#827C94]">{copy.common.required}</span>
              </label>
              <textarea
                id="onb-plan"
                rows={4}
                required
                value={promotionPlan}
                onChange={(e) => setPromotionPlan(e.target.value)}
                placeholder={copy.onboarding.promotionPlanPlaceholder}
                className="w-full p-3.5 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/40 text-sm text-[#12101F] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] focus:bg-white transition-all leading-relaxed box-border"
              />
            </div>

            {/* 6. Terms Checkbox with link to /app/terms */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#12101F]/10 flex items-start gap-3 mt-2">
              <input
                id="onb-terms"
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-gray-300 text-[#6B3CFF] focus:ring-[#6B3CFF] cursor-pointer"
              />
              <label htmlFor="onb-terms" className="text-xs leading-relaxed text-[#575266] cursor-pointer">
                <span>{copy.onboarding.termsLabel}</span>{' '}
                <Link
                  to="/app/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#6B3CFF] hover:underline inline-flex items-center gap-1"
                >
                  <FileText size={12} />
                  <span>{copy.onboarding.termsLinkText}</span>
                </Link>
              </label>
            </div>

            {/* Action Buttons: Save & Resume + Submit */}
            <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 border-t border-[#12101F]/10">
              <button
                type="button"
                disabled={savingDraft || submitting}
                onClick={handleSaveDraft}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#12101F]/20 bg-white hover:bg-black/5 text-[#12101F] font-headline font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {savingDraft ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>{copy.common.saving}</span>
                  </>
                ) : (
                  <>
                    <Save size={15} />
                    <span>{copy.onboarding.saveDraftBtn}</span>
                  </>
                )}
              </button>

              <button
                type="submit"
                disabled={submitting || savingDraft}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#6B3CFF] to-[#5025D1] hover:from-[#5025D1] hover:to-[#3F1BB5] text-white font-headline font-bold text-sm shadow-md shadow-[#6B3CFF]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>{copy.common.loading}</span>
                  </>
                ) : (
                  <>
                    <span>{copy.onboarding.submitBtn}</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
