import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../../lib/api'
import { useLanguage } from '../../context/useLanguage'
import { useAuth } from '../../context/AuthContext'
import { CheckCircle2, AlertCircle, RefreshCw, Mail, ArrowRight, ShieldCheck } from 'lucide-react'

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { lang } = useLanguage()
  const { user, refreshProfile } = useAuth()

  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [resendEmail, setResendEmail] = useState(user?.email || '')
  const [resending, setResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)
  const [verifyingSelf, setVerifyingSelf] = useState(false)

  useEffect(() => {
    let isMounted = true

    async function executeVerification() {
      // If user's email is already verified, show success directly
      if (user?.email_verified_at) {
        if (isMounted) {
          setLoading(false)
          setSuccess(true)
        }
        return
      }

      if (!token) {
        if (isMounted) {
          setLoading(false)
          setErrorMessage(
            lang === 'te'
              ? 'ధృవీకరణ టోకెన్ లేదు లేదా లింక్ అసంపూర్ణంగా ఉంది.'
              : 'Verification token is missing or incomplete.'
          )
        }
        return
      }

      try {
        setLoading(true)
        await api.verifyEmail(token)
        if (isMounted) {
          setSuccess(true)
          setErrorMessage('')
          if (refreshProfile) await refreshProfile()
        }
      } catch (err) {
        if (isMounted) {
          setSuccess(false)
          setErrorMessage(
            err.message ||
              (lang === 'te'
                ? 'ఈ ధృవీకరణ లింక్ చెల్లదు, గడువు ముగిసింది లేదా ఇప్పటికే ఉపయోగించబడింది.'
                : 'This verification link is invalid, expired, or has already been used.')
          )
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    executeVerification()

    return () => {
      isMounted = false
    }
  }, [token, lang, user, refreshProfile])

  const handleVerifyDirectly = async () => {
    try {
      setVerifyingSelf(true)
      await api.verifySelf()
      if (refreshProfile) await refreshProfile()
      setSuccess(true)
      setErrorMessage('')
    } catch (err) {
      setErrorMessage(err.message || 'Failed to verify email directly.')
    } finally {
      setVerifyingSelf(false)
    }
  }

  const handleResend = async (e) => {
    e.preventDefault()
    if (!resendEmail || !resendEmail.trim()) return

    try {
      setResending(true)
      await api.resendVerification(resendEmail.trim())
      setResendSuccess(true)
    } catch (err) {
      setErrorMessage(err.message || 'Failed to resend verification email.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0E0B1E] flex flex-col justify-center items-center px-4 py-12">
      {/* Brand Logo Header */}
      <div className="mb-8 text-center">
        <Link to="/" className="inline-flex items-center gap-3 no-underline group">
          <div className="w-10 h-10 rounded-xl bg-[#6B3CFF] flex items-center justify-center font-black text-white text-lg shadow-md shadow-[#6B3CFF]/30 group-hover:scale-105 transition-transform">
            sB
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[#0E0B1E]">
            sBLOOM
          </span>
        </Link>
        <p className="text-xs font-semibold tracking-wider uppercase text-[#0E0B1E]/50 mt-1">
          {lang === 'te' ? 'అఫిలియేట్ ప్రోగ్రామ్ ఇమెయిల్ ధృవీకరణ' : 'Affiliate Programme Email Verification'}
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-black/10 p-8 shadow-xl shadow-black/5 text-center">
        {loading ? (
          <div className="py-8 space-y-4">
            <RefreshCw size={44} className="text-[#6B3CFF] animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-[#0E0B1E]">
              {lang === 'te' ? 'మీ ఇమెయిల్ను ధృవీకరిస్తున్నాము...' : 'Verifying your email...'}
            </h2>
            <p className="text-sm text-[#0E0B1E]/60">
              {lang === 'te'
                ? 'దయచేసి వేచి ఉండండి, మీ అకౌంట్ ధృవీకరణ పూర్తవుతోంది.'
                : 'Please wait a moment while we confirm your affiliate account credentials.'}
            </p>
          </div>
        ) : success ? (
          <div className="py-6 space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 size={36} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[#0E0B1E]">
                {lang === 'te' ? 'ఇమెయిల్ విజయవంతంగా ధృవీకరించబడింది!' : 'Email Verified Successfully!'}
              </h2>
              <p className="text-sm text-[#0E0B1E]/70 mt-2 leading-relaxed">
                {lang === 'te'
                  ? 'మీ sBLOOM అఫిలియేట్ అకౌంట్ ఇప్పుడు పూర్తిగా ధృవీకరించబడింది. మీరు ఇప్పుడు క్లయింట్ రిఫరల్స్ను సమర్పించవచ్చు.'
                  : 'Your sBLOOM affiliate account is now fully verified. You can now submit client referrals and access all platform features.'}
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/app"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-[#6B3CFF] text-white font-semibold text-sm hover:bg-[#592be0] transition-colors shadow-md shadow-[#6B3CFF]/30 no-underline"
              >
                <span>{lang === 'te' ? 'అఫిలియేట్ డ్యాష్బోర్డుకు వెళ్లండి' : 'Go to Affiliate Dashboard'}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertCircle size={36} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0E0B1E]">
                {lang === 'te' ? 'ధృవీకరణ సాధ్యం కాలేదు' : 'Verification Unsuccessful'}
              </h2>
              <p className="text-sm text-[#0E0B1E]/70 mt-2 leading-relaxed">
                {errorMessage}
              </p>
            </div>

            {user ? (
              <div className="pt-2 space-y-4">
                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-left text-xs text-[#0E0B1E]/80">
                  <span className="font-bold block text-sm text-[#0E0B1E] mb-1">
                    {lang === 'te' ? 'లాగిన్ అయిన ఖాతా:' : 'Signed in as:'}
                  </span>
                  <span className="font-mono font-semibold text-[#6B3CFF]">{user.email}</span>
                </div>

                <button
                  type="button"
                  onClick={handleVerifyDirectly}
                  disabled={verifyingSelf}
                  className="w-full py-3.5 px-6 rounded-xl bg-[#6B3CFF] text-white font-bold text-sm hover:bg-[#592be0] transition-colors shadow-md shadow-[#6B3CFF]/30 flex items-center justify-center gap-2 cursor-pointer border-none disabled:opacity-50"
                >
                  {verifyingSelf ? (
                    <RefreshCw size={16} className="animate-spin" />
                  ) : (
                    <>
                      <span>{lang === 'te' ? 'ఖాతాను ఇప్పుడే ధృవీకరించండి' : 'Verify My Account Now'}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            ) : resendSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium text-left">
                {lang === 'te'
                  ? 'కొత్త ధృవీకరణ లింక్ పంపబడింది. దయచేసి మీ ఇన్‌బాక్స్ మరియు స్పామ్ ఫోల్డర్ను తనిఖీ చేయండి.'
                  : 'A new verification link has been sent if this account exists. Please check your inbox and spam folder.'}
              </div>
            ) : (
              <form onSubmit={handleResend} className="pt-2 text-left space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/60">
                  {lang === 'te' ? 'కొత్త లింక్ పంపించడానికి మీ ఇమెయిల్ను నమోదు చేయండి:' : 'Request a new link for your email:'}
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-[#0E0B1E]/40" />
                  <input
                    type="email"
                    required
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={resending}
                  className="w-full py-3 rounded-xl bg-[#0E0B1E] text-white font-semibold text-xs uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {resending ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <span>{lang === 'te' ? 'కొత్త లింక్ పంపండి' : 'Resend Verification Link'}</span>
                  )}
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-black/10">
              <Link
                to="/app/login"
                className="text-xs font-semibold text-[#6B3CFF] hover:underline"
              >
                ← {lang === 'te' ? 'లాగిన్ పేజీకి తిరిగి వెళ్లండి' : 'Return to Login'}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
