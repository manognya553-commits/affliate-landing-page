import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import { getPortalCopy } from '../../i18n/portalTranslations'
import { ArrowRight, Mail, AlertCircle, CheckCircle2, Loader2, KeyRound } from 'lucide-react'

export default function ForgotPasswordPage() {
  const { resetPassword, isConfigured } = useAuth()
  const { lang, setLang } = useLanguage()
  const copy = getPortalCopy(lang)

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setError(copy.auth.errEmailInvalid)
      return
    }

    setLoading(true)
    try {
      await resetPassword(email.trim())
      setSent(true)
    } catch (err) {
      console.error('Password reset request error:', err)
      setError(err.message || copy.common.error)
    } finally {
      setLoading(false)
    }
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
            onClick={() => setLang('en')}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all border-none cursor-pointer ${
              lang === 'en' ? 'bg-[#6B3CFF] text-white' : 'bg-transparent text-[#827C94] hover:text-[#12101F]'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang('te')}
            className={`px-3 py-1 rounded-full text-xs font-bold font-telugu-sans transition-all border-none cursor-pointer ${
              lang === 'te' ? 'bg-[#6B3CFF] text-white' : 'bg-transparent text-[#827C94] hover:text-[#12101F]'
            }`}
          >
            తెలుగు
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md mx-auto my-8">
        <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-[#12101F]/10 shadow-xl shadow-[#12101F]/4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6B3CFF] to-[#D6F36B]" />

          {!isConfigured && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
              <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <span>{copy.common.configNotice}</span>
            </div>
          )}

          {sent ? (
            <div className="text-center py-4 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-bold font-headline text-[#12101F] m-0">
                {copy.auth.resetSentTitle}
              </h2>
              <p className="text-sm text-[#575266] leading-relaxed m-0">
                {copy.auth.resetSentMessage.replace('{email}', email)}
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
              <div className="flex flex-col gap-2 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF7F2] border border-[#12101F]/10 rounded-full w-fit text-[11px] font-mono text-[#827C94]">
                  <KeyRound size={12} className="text-[#6B3CFF]" />
                  <span>{copy.auth.forgotPasswordLink}</span>
                </div>
                <h1 className="text-2xl sm:text-[28px] font-bold font-headline text-[#12101F] tracking-tight m-0">
                  {copy.auth.forgotTitle}
                </h1>
                <p className="text-sm text-[#575266] m-0 leading-relaxed">
                  {copy.auth.forgotSubtitle}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="forgot-email" className="text-xs font-bold text-[#12101F] font-headline">
                    {copy.auth.emailLabel}
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827C94]" />
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={copy.auth.emailPlaceholder}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/50 text-sm text-[#12101F] placeholder:text-[#827C94] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] focus:bg-white transition-all box-border"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-3 w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#6B3CFF] to-[#5025D1] hover:from-[#5025D1] text-white font-headline font-bold text-sm shadow-md shadow-[#6B3CFF]/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>{copy.common.loading}</span>
                    </>
                  ) : (
                    <>
                      <span>{copy.auth.sendResetBtn}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

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

      <div className="w-full max-w-md mx-auto text-center py-2 text-[11px] text-[#827C94]">
        <span>© 2026 sBLOOM. All rights reserved.</span>
      </div>
    </div>
  )
}
