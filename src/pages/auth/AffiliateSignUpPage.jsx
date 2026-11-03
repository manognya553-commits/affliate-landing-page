import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import { getPortalCopy } from '../../i18n/portalTranslations'
import { Sparkles, ArrowRight, Mail, Lock, AlertCircle, CheckCircle2, Globe, Loader2 } from 'lucide-react'

export default function AffiliateSignUpPage() {
  const { signUp, isConfigured } = useAuth()
  const { lang, setLang } = useLanguage()
  const copy = getPortalCopy(lang)
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [preferredLanguage, setPreferredLanguage] = useState(lang)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [verificationSent, setVerificationSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError(copy.auth.errEmailInvalid)
      return
    }

    if (password.length < 8) {
      setError(copy.auth.errPasswordShort)
      return
    }

    setLoading(true)
    try {
      const data = await signUp({
        email: email.trim(),
        password,
        preferredLanguage,
      })

      // FastAPI returns MeResponse with { user: ..., roles: [...] } and sets httpOnly session cookies
      if (data?.user) {
        navigate('/app')
      } else {
        setVerificationSent(true)
      }
    } catch (err) {
      console.error('Sign up error:', err)
      setError(err.message || copy.common.error)
    } finally {
      setLoading(false)
    }
  }

  const handleLangToggle = (newLang) => {
    setLang(newLang)
    setPreferredLanguage(newLang)
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-body">
      {/* Top Header */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <Link to="/" className="inline-flex items-center gap-1 no-underline group" aria-label="sBLOOM Home">
          <span className="font-body text-[24px] font-black text-brand-violet leading-none transition-transform group-hover:scale-105">s</span>
          <span className="font-body text-[22px] font-black text-ink tracking-tight leading-none mr-2">BLOOM</span>
          <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10.5px] font-bold uppercase tracking-wider text-brand-violet bg-brand-violet/[0.08] px-2.5 py-0.5 rounded-full border border-brand-violet/20">
            {copy.shell.brandSubtitle}
          </span>
        </Link>

        {/* Language Switch */}
        <div className="inline-flex items-center bg-white border border-[#12101F]/10 rounded-full p-0.5 shadow-2xs">
          <button
            type="button"
            onClick={() => handleLangToggle('en')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all border-none cursor-pointer ${
              lang === 'en' ? 'bg-[#6B3CFF] text-white' : 'bg-transparent text-[#827C94] hover:text-[#12101F]'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => handleLangToggle('te')}
            className={`px-3 py-1 rounded-full text-xs font-bold font-telugu-sans transition-all border-none cursor-pointer ${
              lang === 'te' ? 'bg-[#6B3CFF] text-white' : 'bg-transparent text-[#827C94] hover:text-[#12101F]'
            }`}
          >
            తెలుగు
          </button>
        </div>
      </div>

      {/* Main Sign-Up Card */}
      <div className="w-full max-w-md mx-auto my-8">
        <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-[#12101F]/10 shadow-xl shadow-[#12101F]/4 relative overflow-hidden">
          {/* Subtle gradient accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6B3CFF] via-[#FF4FA3] to-[#D6F36B]" />

          {/* Missing config notice if .env not set */}
          {!isConfigured && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
              <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <span>{copy.common.configNotice}</span>
            </div>
          )}

          {verificationSent ? (
            <div className="text-center py-4 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-bold font-headline text-[#12101F] m-0">
                {copy.auth.verificationSentTitle}
              </h2>
              <p className="text-sm text-[#575266] leading-relaxed m-0">
                {copy.auth.verificationSentMessage.replace('{email}', email)}
              </p>
              <Link
                to="/app/login"
                className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#6B3CFF] text-white text-sm font-semibold hover:bg-[#5025D1] transition-all no-underline"
              >
                <span>{copy.auth.loginBtn}</span>
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex flex-col gap-2 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF7F2] border border-[#12101F]/10 rounded-full w-fit text-[11px] font-mono text-[#827C94]">
                  <Sparkles size={12} className="text-[#6B3CFF]" />
                  <span>{copy.onboarding.badge}</span>
                </div>
                <h1 className="text-2xl sm:text-[28px] font-bold font-headline text-[#12101F] tracking-tight m-0">
                  {copy.auth.signUpTitle}
                </h1>
                <p className="text-sm text-[#575266] m-0 leading-relaxed">
                  {copy.auth.signUpSubtitle}
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-email" className="text-xs font-bold text-[#12101F] font-headline">
                    {copy.auth.emailLabel} <span className="text-[#6B3CFF]">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827C94]" />
                    <input
                      id="signup-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={copy.auth.emailPlaceholder}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/50 text-sm text-[#12101F] placeholder:text-[#827C94] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] focus:bg-white transition-all box-border"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-password" className="text-xs font-bold text-[#12101F] font-headline">
                    {copy.auth.passwordLabel} <span className="text-[#6B3CFF]">*</span>
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827C94]" />
                    <input
                      id="signup-password"
                      type="password"
                      required
                      minLength={8}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={copy.auth.passwordPlaceholder}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/50 text-sm text-[#12101F] placeholder:text-[#827C94] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] focus:bg-white transition-all box-border"
                    />
                  </div>
                </div>

                {/* Language Preference */}
                <div className="flex flex-col gap-1.5 pt-1">
                  <label className="text-xs font-bold text-[#12101F] font-headline">
                    {copy.auth.preferredLanguageLabel}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPreferredLanguage('en')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        preferredLanguage === 'en'
                          ? 'border-[#6B3CFF] bg-[#6B3CFF]/5 text-[#6B3CFF] font-bold'
                          : 'border-[#12101F]/15 bg-white text-[#575266]'
                      }`}
                    >
                      <Globe size={13} />
                      <span>English</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreferredLanguage('te')}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 font-telugu-sans transition-all cursor-pointer ${
                        preferredLanguage === 'te'
                          ? 'border-[#6B3CFF] bg-[#6B3CFF]/5 text-[#6B3CFF] font-bold'
                          : 'border-[#12101F]/15 bg-white text-[#575266]'
                      }`}
                    >
                      <Globe size={13} />
                      <span>తెలుగు</span>
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-3 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#6B3CFF] to-[#5025D1] hover:from-[#5025D1] hover:to-[#3F1BB5] text-white font-headline font-bold text-sm shadow-md shadow-[#6B3CFF]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{copy.common.loading}</span>
                    </>
                  ) : (
                    <>
                      <span>{copy.auth.signUpBtn}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Footer Links */}
              <div className="mt-8 pt-6 border-t border-[#12101F]/10 flex flex-col items-center gap-3 text-center">
                <Link
                  to="/app/login"
                  className="text-xs font-semibold text-[#6B3CFF] hover:underline no-underline"
                >
                  {copy.auth.haveAccount}
                </Link>
                <Link
                  to="/"
                  className="text-xs text-[#827C94] hover:text-[#12101F] transition-colors no-underline"
                >
                  {copy.auth.backToHome}
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Microcopy footer */}
      <div className="w-full max-w-md mx-auto text-center py-2 text-[11px] text-[#827C94]">
        <span>© 2026 sBLOOM. All rights reserved.</span>
      </div>
    </div>
  )
}
