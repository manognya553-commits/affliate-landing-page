import React, { useState } from 'react'
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
  Info,
  CheckCircle2,
  Lock,
  UserPlus,
  LogIn,
  ShieldCheck,
  Building2,
  Phone,
  Mail,
  User,
  MapPin,
} from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

export default function AffiliateAuthPage({ initialMode = 'signup', onNavigate }) {
  const { lang, setLang, copy } = useLanguage()
  const authCopy = copy.auth || {}

  const [prevInitialMode, setPrevInitialMode] = useState(initialMode)
  const [mode, setMode] = useState(initialMode === 'signin' ? 'signin' : 'signup')
  const [showPassword, setShowPassword] = useState(false)
  const [noticeMessage, setNoticeMessage] = useState(null)

  // Form states
  const [signInData, setSignInData] = useState({
    identifier: '',
    password: '',
  })

  const [signUpData, setSignUpData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    location: '',
    sector: 'Healthcare',
    consent: false,
  })

  // Adjust state during render when initialMode prop changes (React recommended pattern)
  if (prevInitialMode !== initialMode) {
    setPrevInitialMode(initialMode)
    setMode(initialMode === 'signin' ? 'signin' : 'signup')
    setNoticeMessage(null)
  }

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setNoticeMessage(null)
    const newUrl = `/affiliate/auth?mode=${newMode}`
    window.history.pushState({ mode: newMode }, '', newUrl)
  }

  const handleSignInSubmit = (e) => {
    e.preventDefault()
    // Honest development state feedback: do NOT fake login or invent backend
    setNoticeMessage({
      type: 'info',
      text:
        authCopy.mockAttemptNotice ||
        'The affiliate portal backend is currently in development. Account access will open with the full portal release.',
    })
  }

  const handleSignUpSubmit = (e) => {
    e.preventDefault()
    // Honest development state feedback: do NOT fake registration or invent database
    setNoticeMessage({
      type: 'info',
      text:
        authCopy.mockAttemptNotice ||
        'The affiliate portal backend is currently in development. Direct registration will open with the full portal release.',
    })
  }

  const handleBackToLanding = (e) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate('/')
    } else {
      window.location.href = '/'
    }
  }

  const handleContactLink = (e) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate('/#contact')
    } else {
      window.location.href = '/#contact'
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#12101F] font-body relative overflow-x-hidden">
      {/* Background ambient lighting */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6B3CFF]/8 rounded-full blur-[140px] pointer-events-none -z-0"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-[#FF4FA3]/7 rounded-full blur-[140px] pointer-events-none -z-0"
        aria-hidden="true"
      />

      {/* Header bar */}
      <header className="w-full border-b border-[#12101F]/8 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <a
            href="/"
            onClick={handleBackToLanding}
            className="inline-flex items-center gap-1 shrink-0 no-underline group"
            aria-label="sBLOOM Home"
          >
            <span className="font-body text-[22px] font-black text-brand-violet leading-none transition-transform group-hover:scale-105">
              s
            </span>
            <span className="font-body text-[20px] font-black text-ink tracking-tight leading-none mr-2">
              BLOOM
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-brand-violet bg-brand-violet/[0.08] px-2.5 py-0.5 rounded-full border border-brand-violet/20">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-violet animate-pulse" aria-hidden="true" />
              <span>{authCopy.portalTitle || 'Affiliate Portal'}</span>
            </span>
          </a>

          {/* Right actions: Back to landing & Language Switcher */}
          <div className="flex items-center gap-3">
            <a
              href="/"
              onClick={handleBackToLanding}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#575266] hover:text-brand-violet transition-colors py-1.5 px-3 rounded-full hover:bg-black/5"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              <span>{authCopy.backToHome || 'Back to landing page'}</span>
            </a>

            {/* Language Switcher */}
            <div
              className="inline-flex items-center bg-ink/[0.06] border border-ink/10 rounded-full p-0.5 gap-0.5"
              role="group"
              aria-label="Language selection"
            >
              <button
                type="button"
                className={`border-none px-2.5 sm:px-3 text-[12px] sm:text-[13px] font-bold rounded-full cursor-pointer transition-all duration-200 leading-none inline-flex items-center justify-center min-w-[34px] sm:min-w-[38px] h-7 sm:h-8 ${
                  lang === 'en'
                    ? 'bg-white !text-brand-violet shadow-sm font-extrabold'
                    : 'bg-transparent text-ink-secondary hover:text-ink hover:bg-white/50'
                }`}
                onClick={() => setLang('en')}
                aria-pressed={lang === 'en'}
                title="Switch to English"
              >
                EN
              </button>
              <button
                type="button"
                className={`border-none px-2.5 sm:px-3 text-[13px] sm:text-[14px] font-telugu-sans font-bold rounded-full cursor-pointer transition-all duration-200 leading-none inline-flex items-center justify-center min-w-[36px] sm:min-w-[40px] h-7 sm:h-8 ${
                  lang === 'te'
                    ? 'bg-white !text-brand-violet shadow-sm font-extrabold'
                    : 'bg-transparent text-ink-secondary hover:text-ink hover:bg-white/50'
                }`}
                onClick={() => setLang('te')}
                aria-pressed={lang === 'te'}
                title="తెలుగుకు మారండి"
              >
                తె
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 relative z-10">
        <div className="w-full max-w-[540px] flex flex-col gap-6">
          {/* Honest Portal Development Notice Banner */}
          <div
            className="w-full rounded-2xl bg-white border border-[#12101F]/10 p-5 shadow-sm relative overflow-hidden"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-xl bg-brand-violet/10 text-brand-violet flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={18} />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <div className="inline-flex items-center gap-2">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-brand-violet bg-brand-violet/[0.08] px-2 py-0.5 rounded-full border border-brand-violet/20">
                    {authCopy.devNoticeBadge || 'Portal in Development'}
                  </span>
                </div>
                <h2 className="text-sm sm:text-[15px] font-bold text-[#12101F] font-headline m-0">
                  {authCopy.devNoticeTitle || 'Affiliate Portal Coming Soon'}
                </h2>
                <p className="text-xs sm:text-[13px] text-[#575266] leading-relaxed m-0">
                  {authCopy.devNoticeDesc ||
                    'Account sign-in and direct registration are currently being prepared for launch. Authentication and the affiliate dashboard will open soon.'}
                </p>
                <div className="pt-1.5 flex items-center gap-1.5 text-xs text-ink-secondary">
                  <span>{authCopy.devNoticeHelp || 'Have a question before we launch?'}</span>
                  <a
                    href="/#contact"
                    onClick={handleContactLink}
                    className="font-semibold text-brand-violet hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>{authCopy.contactLink || 'Ask a question'}</span>
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Auth Card */}
          <div className="w-full bg-white rounded-3xl p-6 sm:p-9 shadow-xl border border-[#12101F]/8 flex flex-col gap-6">
            {/* Segmented Mode Switcher */}
            <div
              className="w-full bg-[#FAF7F2] p-1.5 rounded-2xl border border-[#12101F]/8 flex items-center gap-1"
              role="tablist"
              aria-label="Authentication mode"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signup'}
                aria-controls="auth-signup-panel"
                id="auth-signup-tab"
                onClick={() => handleModeChange('signup')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  mode === 'signup'
                    ? 'bg-[#6B3CFF] text-white shadow-md shadow-[#6B3CFF]/20'
                    : 'text-[#575266] hover:text-[#12101F] hover:bg-black/5'
                }`}
              >
                <UserPlus size={16} />
                <span>{authCopy.signUpTab || 'Become an affiliate'}</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={mode === 'signin'}
                aria-controls="auth-signin-panel"
                id="auth-signin-tab"
                onClick={() => handleModeChange('signin')}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                  mode === 'signin'
                    ? 'bg-[#6B3CFF] text-white shadow-md shadow-[#6B3CFF]/20'
                    : 'text-[#575266] hover:text-[#12101F] hover:bg-black/5'
                }`}
              >
                <LogIn size={16} />
                <span>{authCopy.signInTab || 'Sign in'}</span>
              </button>
            </div>

            {/* Mode Header */}
            <div className="flex flex-col gap-1 text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold font-headline text-[#12101F] m-0">
                {mode === 'signup'
                  ? authCopy.signUpHeading || 'Create your affiliate account'
                  : authCopy.signInHeading || 'Sign in to your account'}
              </h1>
              <p className="text-xs sm:text-sm text-[#575266] m-0 leading-relaxed">
                {mode === 'signup'
                  ? authCopy.signUpSubheading ||
                    'Join our trusted service advisory network — it’s free to join'
                  : authCopy.signInSubheading ||
                    'Enter your credentials to access your affiliate dashboard'}
              </p>
            </div>

            {/* Notification alert on submit attempt */}
            {noticeMessage && (
              <div
                className="flex items-start gap-2.5 p-3.5 bg-brand-violet/10 border border-brand-violet/20 rounded-xl text-brand-violet text-xs sm:text-sm font-medium leading-relaxed"
                role="status"
              >
                <Info size={16} className="shrink-0 mt-0.5" />
                <span>{noticeMessage.text}</span>
              </div>
            )}

            {/* Panel: Sign Up (Become an Affiliate) */}
            {mode === 'signup' && (
              <form
                id="auth-signup-panel"
                role="tabpanel"
                aria-labelledby="auth-signup-tab"
                onSubmit={handleSignUpSubmit}
                className="flex flex-col gap-4"
              >
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-name" className="text-xs sm:text-sm font-bold text-[#12101F]">
                    {authCopy.fields?.name || 'Full name'} <span className="text-brand-violet">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827C94]" />
                    <input
                      id="signup-name"
                      type="text"
                      required
                      value={signUpData.fullName}
                      onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                      placeholder={authCopy.fields?.namePlaceholder || 'Your full name'}
                      className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#12101F]/15 rounded-xl text-[#12101F] placeholder:text-[#827C94] text-sm focus:outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 transition-all"
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-mobile" className="text-xs sm:text-sm font-bold text-[#12101F]">
                    {authCopy.fields?.mobile || 'Mobile number (WhatsApp preferred)'}{' '}
                    <span className="text-brand-violet">*</span>
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827C94]" />
                    <input
                      id="signup-mobile"
                      type="tel"
                      required
                      value={signUpData.mobile}
                      onChange={(e) => setSignUpData({ ...signUpData, mobile: e.target.value })}
                      placeholder={authCopy.fields?.mobilePlaceholder || '10-digit mobile number'}
                      className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#12101F]/15 rounded-xl text-[#12101F] placeholder:text-[#827C94] text-sm focus:outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 transition-all"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-email" className="text-xs sm:text-sm font-bold text-[#12101F]">
                    {authCopy.fields?.email || 'Email address'}{' '}
                    <span className="text-brand-violet">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827C94]" />
                    <input
                      id="signup-email"
                      type="email"
                      required
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      placeholder={authCopy.fields?.emailPlaceholder || 'name@example.com'}
                      className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#12101F]/15 rounded-xl text-[#12101F] placeholder:text-[#827C94] text-sm focus:outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 transition-all"
                    />
                  </div>
                </div>

                {/* City and State */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-location" className="text-xs sm:text-sm font-bold text-[#12101F]">
                    {authCopy.fields?.location || 'City and state'}
                  </label>
                  <div className="relative">
                    <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827C94]" />
                    <input
                      id="signup-location"
                      type="text"
                      value={signUpData.location}
                      onChange={(e) => setSignUpData({ ...signUpData, location: e.target.value })}
                      placeholder={authCopy.fields?.locationPlaceholder || 'e.g., Hyderabad, Telangana'}
                      className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#12101F]/15 rounded-xl text-[#12101F] placeholder:text-[#827C94] text-sm focus:outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 transition-all"
                    />
                  </div>
                </div>

                {/* Preferred Sector */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-sector" className="text-xs sm:text-sm font-bold text-[#12101F]">
                    {authCopy.fields?.sectors || 'Which areas do your people ask you about?'}
                  </label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827C94] pointer-events-none" />
                    <select
                      id="signup-sector"
                      value={signUpData.sector}
                      onChange={(e) => setSignUpData({ ...signUpData, sector: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#12101F]/15 rounded-xl text-[#12101F] text-sm focus:outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 transition-all cursor-pointer"
                    >
                      {(authCopy.fields?.sectorsOptions || [
                        'Healthcare',
                        'Education',
                        'Professional services',
                        'Not sure yet',
                      ]).map((opt, idx) => (
                        <option key={idx} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Consent checkbox */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    id="signup-consent"
                    type="checkbox"
                    required
                    checked={signUpData.consent}
                    onChange={(e) => setSignUpData({ ...signUpData, consent: e.target.checked })}
                    className="mt-1 w-4 h-4 rounded border-gray-300 text-brand-violet focus:ring-brand-violet cursor-pointer"
                  />
                  <label htmlFor="signup-consent" className="text-xs text-[#575266] leading-relaxed cursor-pointer">
                    {authCopy.fields?.consent ||
                      'I agree to be contacted by sBLOOM about the affiliate programme, and to my details being used for this purpose.'}
                  </label>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-bold text-sm bg-[#6B3CFF] hover:bg-[#582CD6] text-white shadow-lg shadow-[#6B3CFF]/25 hover:shadow-xl hover:shadow-[#6B3CFF]/35 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <UserPlus size={16} />
                  <span>{authCopy.signUpBtn || 'Create affiliate account'}</span>
                </button>

                <p className="text-center text-[11px] text-[#827C94] m-0">
                  {authCopy.noPaymentNote || 'Free. No payment is asked at this stage.'}
                </p>

                {/* Switcher to Sign In */}
                <div className="text-center pt-2 border-t border-[#12101F]/8 text-xs text-[#575266]">
                  <span>{authCopy.switchToSignInPrompt || 'Already an affiliate?'} </span>
                  <button
                    type="button"
                    onClick={() => handleModeChange('signin')}
                    className="font-bold text-brand-violet hover:underline cursor-pointer border-none bg-transparent p-0"
                  >
                    {authCopy.switchToSignInAction || 'Sign in'}
                  </button>
                </div>
              </form>
            )}

            {/* Panel: Sign In (Existing Affiliates) */}
            {mode === 'signin' && (
              <form
                id="auth-signin-panel"
                role="tabpanel"
                aria-labelledby="auth-signin-tab"
                onSubmit={handleSignInSubmit}
                className="flex flex-col gap-4"
              >
                {/* Identifier */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signin-identifier" className="text-xs sm:text-sm font-bold text-[#12101F]">
                    {authCopy.fields?.identifier || 'Email or Mobile number'}{' '}
                    <span className="text-brand-violet">*</span>
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827C94]" />
                    <input
                      id="signin-identifier"
                      type="text"
                      required
                      value={signInData.identifier}
                      onChange={(e) => setSignInData({ ...signInData, identifier: e.target.value })}
                      placeholder={authCopy.fields?.identifierPlaceholder || 'name@example.com or 98765 43210'}
                      className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#12101F]/15 rounded-xl text-[#12101F] placeholder:text-[#827C94] text-sm focus:outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="signin-password" className="text-xs sm:text-sm font-bold text-[#12101F]">
                      {authCopy.fields?.password || 'Password'}{' '}
                      <span className="text-brand-violet">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#827C94]" />
                    <input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      placeholder={authCopy.fields?.passwordPlaceholder || 'Enter your password'}
                      className="w-full pl-10 pr-11 py-3 bg-[#FAF7F2] border border-[#12101F]/15 rounded-xl text-[#12101F] placeholder:text-[#827C94] text-sm focus:outline-none focus:border-brand-violet focus:ring-2 focus:ring-brand-violet/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#827C94] hover:text-[#12101F] p-1 border-none bg-transparent cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full mt-2 inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-bold text-sm bg-[#6B3CFF] hover:bg-[#582CD6] text-white shadow-lg shadow-[#6B3CFF]/25 hover:shadow-xl hover:shadow-[#6B3CFF]/35 active:scale-[0.99] transition-all cursor-pointer"
                >
                  <LogIn size={16} />
                  <span>{authCopy.signInBtn || 'Sign in'}</span>
                </button>

                {/* Security trust badge */}
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#827C94] pt-1">
                  <ShieldCheck size={14} className="text-[#16A34A]" />
                  <span>Protected affiliate sign-in</span>
                </div>

                {/* Switcher to Sign Up */}
                <div className="text-center pt-2 border-t border-[#12101F]/8 text-xs text-[#575266]">
                  <span>{authCopy.switchToSignUpPrompt || 'Don’t have an affiliate account?'} </span>
                  <button
                    type="button"
                    onClick={() => handleModeChange('signup')}
                    className="font-bold text-brand-violet hover:underline cursor-pointer border-none bg-transparent p-0"
                  >
                    {authCopy.switchToSignUpAction || 'Become an affiliate'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Quick trust row below card */}
          <div className="flex items-center justify-center gap-4 text-xs text-[#827C94]">
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 size={13} className="text-brand-violet" />
              <span>Free to join</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 size={13} className="text-brand-violet" />
              <span>No sales required</span>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <CheckCircle2 size={13} className="text-brand-violet" />
              <span>Full privacy</span>
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-xs text-[#827C94] border-t border-[#12101F]/6 bg-white/50">
        <p className="m-0">
          © 2026 sBLOOM. {copy.footer?.descriptor || 'A network of service advisers'}.
        </p>
      </footer>
    </div>
  )
}
