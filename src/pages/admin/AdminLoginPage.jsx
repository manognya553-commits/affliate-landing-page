import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import {
  ShieldCheck,
  Lock,
  Mail,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldAlert,
  Building2,
} from 'lucide-react'

export default function AdminLoginPage() {
  const { signIn, user, role, signOut, isConfigured } = useAuth()
  const { lang, setLang } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isAffiliateLoggedIn = user && role !== 'admin'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const cleanEmail = email.trim()
    if (!cleanEmail) {
      setError(lang === 'te' ? 'దయచేసి ఇమెయిల్ నమోదు చేయండి.' : 'Please enter your administrator email.')
      return
    }

    if (!password) {
      setError(lang === 'te' ? 'దయచేసి పాస్‌వర్డ్ నమోదు చేయండి.' : 'Please enter your password.')
      return
    }

    setLoading(true)
    try {
      const res = await signIn({
        email: cleanEmail,
        password,
      })

      const roles = res?.roles || []
      const isAdmin = roles.includes('admin') || roles.includes('Admin')

      if (!isAdmin) {
        setError(
          lang === 'te'
            ? 'ఈ ఖాతాకు అడ్మినిస్ట్రేటర్ అధికారాలు లేవు. దయచేసి సూపర్ అడ్మిన్ ఖాతాతో లాగిన్ అవ్వండి.'
            : 'Access Denied: This account does not have administrator privileges. Please sign in with an authorized administrator account.'
        )
        return
      }

      const target = location.state?.from?.pathname
      if (target && target.startsWith('/admin')) {
        navigate(target, { replace: true })
      } else {
        navigate('/admin', { replace: true })
      }
    } catch (err) {
      console.error('Admin sign in error:', err)
      setError(err.message || 'Invalid administrator credentials. Please check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0E0B1E] text-white flex flex-col justify-between p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#6B3CFF] selection:text-white">
      {/* Top Header */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between py-3">
        <Link to="/" className="inline-flex items-center gap-2.5 no-underline group" aria-label="sBLOOM Home">
          <div className="w-9 h-9 rounded-xl bg-[#6B3CFF] flex items-center justify-center font-black text-white text-base shadow-md shadow-[#6B3CFF]/40 group-hover:scale-105 transition-transform">
            sB
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-white leading-none">
              sBLOOM
            </span>
            <span className="text-[10px] font-bold text-[#D6F36B] tracking-wider uppercase mt-1">
              Admin Control Portal
            </span>
          </div>
        </Link>

        {/* Language & Affiliate Portal Link */}
        <div className="flex items-center gap-3">
          <Link
            to="/app/login"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors no-underline"
          >
            <span>Affiliate Portal</span>
            <ArrowRight size={13} />
          </Link>

          <div className="inline-flex items-center bg-white/10 border border-white/10 rounded-full p-0.5">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all border-none cursor-pointer ${
                lang === 'en' ? 'bg-[#6B3CFF] text-white' : 'bg-transparent text-white/60 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('te')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all border-none cursor-pointer ${
                lang === 'te' ? 'bg-[#6B3CFF] text-white' : 'bg-transparent text-white/60 hover:text-white'
              }`}
            >
              తెలుగు
            </button>
          </div>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md mx-auto my-auto py-8">
        <div className="bg-[#1A152E] rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          {/* Accent top stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6B3CFF] via-[#9B51E0] to-[#D6F36B]" />

          {/* Icon Badge */}
          <div className="w-14 h-14 rounded-2xl bg-[#6B3CFF]/15 border border-[#6B3CFF]/30 text-[#D6F36B] flex items-center justify-center mb-6">
            <ShieldCheck size={28} />
          </div>

          <h1 className="text-2xl font-bold font-headline text-white mb-2">
            {lang === 'te' ? 'అడ్మినిస్ట్రేటర్ లాగిన్' : 'Administrator Sign In'}
          </h1>
          <p className="text-sm text-white/60 leading-relaxed mb-6">
            {lang === 'te'
              ? 'sBLOOM అడ్మినిస్ట్రేషన్ మరియు ఫైనాన్షియల్ మేనేజ్‌మెంట్ పోర్టల్.'
              : 'Sign in with your administrative account to access the operations, commissions, and invoicing hub.'}
          </p>

          {/* Active Affiliate Warning */}
          {isAffiliateLoggedIn && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
              <div className="flex items-start gap-2.5">
                <ShieldAlert size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-300">
                    Currently signed in as Affiliate
                  </p>
                  <p className="font-mono text-[11px] text-white/90 break-all mt-0.5">
                    {user?.email}
                  </p>
                  <p className="text-white/60 mt-1.5 leading-relaxed">
                    Signing in below with your admin credentials will switch your active session to Administrator.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium leading-relaxed">{error}</div>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                {lang === 'te' ? 'అడ్మిన్ ఇమెయిల్' : 'Admin Email'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@sbloom.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#6B3CFF] focus:ring-2 focus:ring-[#6B3CFF]/30 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/70 mb-1.5">
                {lang === 'te' ? 'పాస్‌వర్డ్' : 'Password'}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/40">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#6B3CFF] focus:ring-2 focus:ring-[#6B3CFF]/30 transition-all"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#6B3CFF] hover:bg-[#5827EB] active:scale-[0.99] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer border-none shadow-lg shadow-[#6B3CFF]/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{lang === 'te' ? 'ధృవీకరిస్తోంది...' : 'Authenticating...'}</span>
                </>
              ) : (
                <>
                  <span>{lang === 'te' ? 'అడ్మిన్ పోర్టల్‌లోకి లాగిన్ అవ్వండి' : 'Sign In to Admin Portal'}</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center gap-3 text-center">
            <p className="text-xs text-white/50">
              {lang === 'te'
                ? 'ఈ విభాగం కేవలం అనుమతి పొందిన sBLOOM నిర్వాహకులకు మాత్రమే.'
                : 'Restricted system. All administrative access is logged and audited.'}
            </p>
            <Link
              to="/app/login"
              className="text-xs font-medium text-[#D6F36B] hover:underline inline-flex items-center gap-1"
            >
              <span>{lang === 'te' ? 'అఫిలియేట్ పోర్టల్ లాగిన్' : 'Go to Affiliate Portal Sign In'}</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* Security Footer */}
      <div className="w-full max-w-5xl mx-auto py-4 text-center text-xs text-white/40">
        sBLOOM Administration & Financial System &copy; {new Date().getFullYear()} sBLOOM Technologies. All rights reserved.
      </div>
    </div>
  )
}

