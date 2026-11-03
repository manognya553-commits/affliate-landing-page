import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import { getPortalCopy } from '../../i18n/portalTranslations'
import { ArrowRight, Lock, AlertCircle, CheckCircle2, Loader2, KeyRound } from 'lucide-react'

export default function ResetPasswordPage() {
  const { updatePassword, isConfigured } = useAuth()
  const { lang, setLang } = useLanguage()
  const copy = getPortalCopy(lang)
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [updated, setUpdated] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError(copy.auth.errPasswordShort)
      return
    }

    if (password !== confirmPassword) {
      setError(copy.auth.errPasswordsMatch)
      return
    }

    setLoading(true)
    try {
      await updatePassword(password)
      setUpdated(true)
      setTimeout(() => {
        navigate('/app/login')
      }, 2000)
    } catch (err) {
      console.error('Password update error:', err)
      setError(err.message || copy.common.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-body">
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between py-2">
        <Link to="/" className="inline-flex items-center gap-1 no-underline group" aria-label="sBLOOM Home">
          <span className="font-body text-[24px] font-black text-brand-violet leading-none transition-transform group-hover:scale-105">s</span>
          <span className="font-body text-[22px] font-black text-ink tracking-tight leading-none mr-2">BLOOM</span>
        </Link>

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

      <div className="w-full max-w-md mx-auto my-8">
        <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-[#12101F]/10 shadow-xl shadow-[#12101F]/4 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6B3CFF] to-[#D6F36B]" />

          {!isConfigured && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-2.5">
              <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
              <span>{copy.common.configNotice}</span>
            </div>
          )}

          {updated ? (
            <div className="text-center py-4 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-bold font-headline text-[#12101F] m-0">
                {copy.auth.passwordUpdated}
              </h2>
              <p className="text-sm text-[#575266] leading-relaxed m-0">
                Redirecting to login...
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-2 mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FAF7F2] border border-[#12101F]/10 rounded-full w-fit text-[11px] font-mono text-[#827C94]">
                  <KeyRound size={12} className="text-[#6B3CFF]" />
                  <span>{copy.auth.resetPasswordTitle}</span>
                </div>
                <h1 className="text-2xl sm:text-[28px] font-bold font-headline text-[#12101F] tracking-tight m-0">
                  {copy.auth.resetPasswordTitle}
                </h1>
                <p className="text-sm text-[#575266] m-0 leading-relaxed">
                  {copy.auth.resetPasswordSubtitle}
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
                  <label htmlFor="reset-pass" className="text-xs font-bold text-[#12101F] font-headline">
                    {copy.auth.passwordLabel}
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827C94]" />
                    <input
                      id="reset-pass"
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

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reset-confirm" className="text-xs font-bold text-[#12101F] font-headline">
                    {copy.auth.confirmPasswordLabel}
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827C94]" />
                    <input
                      id="reset-confirm"
                      type="password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder={copy.auth.confirmPasswordPlaceholder}
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
                      <span>{copy.auth.updatePasswordBtn}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
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
