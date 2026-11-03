import React from 'react'
import { Navigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Loader2, ShieldAlert } from 'lucide-react'
import { useLanguage } from '../../context/useLanguage'
import { getPortalCopy } from '../../i18n/portalTranslations'

export function LoadingSpinner() {
  const { lang } = useLanguage()
  const copy = getPortalCopy(lang)
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#6B3CFF]/10 flex items-center justify-center text-[#6B3CFF] mb-4 animate-spin">
        <Loader2 size={24} />
      </div>
      <p className="font-mono text-xs uppercase tracking-wider text-[#827C94]">
        {copy.common.loading}
      </p>
    </div>
  )
}

/**
 * Checks if an affiliate's onboarding is complete.
 * Required fields: full_name, city, area, occupation, promotion_plan, terms_accepted_at
 */
export function isProfileComplete(profile) {
  if (!profile) return false
  return Boolean(
    profile.full_name?.trim() &&
      profile.city?.trim() &&
      profile.area?.trim() &&
      profile.occupation?.trim() &&
      profile.promotion_plan?.trim() &&
      profile.terms_accepted_at
  )
}

/**
 * Gate 1: Requires user to be logged in. If not, redirects to /app/login
 */
export function RequireAuth({ children }) {
  const { session, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingSpinner />
  if (!session) {
    return <Navigate to="/app/login" state={{ from: location }} replace />
  }
  return children
}

/**
/**
 * Gate 2: Direct portal access for affiliates.
 * Only suspended accounts are redirected to /app/status.
 */
export function RequireApprovedAffiliate({ children }) {
  const { session, loading, role, status } = useAuth()
  if (loading) return <LoadingSpinner />
  if (!session) return <Navigate to="/app/login" replace />

  // Admins can view affiliate views
  if (role === 'admin') return children

  if (status === 'suspended' || status === 'rejected') {
    return <Navigate to="/app/status" replace />
  }

  return children
}

/**
 * Gate 3: For /app/onboarding.
 * Onboarding is optional profile setup; users can directly access /app or view this page.
 */
export function RequireIncompleteOnboarding({ children }) {
  const { session, loading } = useAuth()
  if (loading) return <LoadingSpinner />
  if (!session) return <Navigate to="/app/login" replace />

  return children
}

/**
 * Gate 4: For /app/status.
 * If status is approved or draft, redirect to /app.
 */
export function RequireStatusGate({ children }) {
  const { session, loading, role, status } = useAuth()
  if (loading) return <LoadingSpinner />
  if (!session) return <Navigate to="/app/login" replace />

  if (status !== 'suspended' && status !== 'rejected' && role !== 'admin') {
    return <Navigate to="/app" replace />
  }

  return children
}

/**
 * Gate 5: Requires role === 'admin'.
 */
export function RequireAdmin({ children }) {
  const { session, loading, role } = useAuth()
  const { lang } = useLanguage()

  if (loading) return <LoadingSpinner />
  if (!session) return <Navigate to="/app/login" replace />

  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-red-200 shadow-xl text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <ShieldAlert size={28} />
          </div>
          <h2 className="text-xl font-bold font-headline text-[#12101F]">
            {lang === 'te' ? 'అడ్మిన్ అనుమతి లేదు' : 'Access Restricted'}
          </h2>
          <p className="text-sm text-[#575266] leading-relaxed">
            {lang === 'te'
              ? 'ఈ విభాగాన్ని యాక్సెస్ చేయడానికి అడ్మినిస్ట్రేటర్ అధికారాలు అవసరం.'
              : 'You need administrator privileges to view this section.'}
          </p>
          <Link
            to="/app"
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6B3CFF] text-white text-sm font-semibold hover:bg-[#5025D1] transition-all no-underline"
          >
            {lang === 'te' ? 'అఫిలియేట్ పోర్టల్‌కు వెళ్లండి' : 'Go to Affiliate Portal'}
          </Link>
        </div>
      </div>
    )
  }

  return children
}

/**
 * Gate 6: Redirect authenticated users away from Login / Signup
 */
export function RedirectIfAuthenticated({ children }) {
  const { session, loading, role, status } = useAuth()
  if (loading) return <LoadingSpinner />
  if (!session) return children

  if (role === 'admin') {
    return <Navigate to="/admin" replace />
  }

  if (status === 'suspended' || status === 'rejected') {
    return <Navigate to="/app/status" replace />
  }

  return <Navigate to="/app" replace />
}
