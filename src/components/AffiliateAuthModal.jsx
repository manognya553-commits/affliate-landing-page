import React, { useState, useEffect, useRef } from 'react'
import { X, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, UserCheck, Lock, Phone, User, MapPin, Building2 } from 'lucide-react'
import { useLanguage } from '../context/useLanguage'

export default function AffiliateAuthModal({ isOpen, onClose, initialMode = 'register', onNavigateHowItWorks }) {
  const { lang } = useLanguage()
  const modalRef = useRef(null)
  const [mode, setMode] = useState(initialMode) // 'register' | 'login'
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    location: '',
    persona: 'homemaker',
    agreed: false,
  })
  const [loginData, setLoginData] = useState({
    identifier: '',
    passcode: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  

  // Close on Escape key & manage scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.mobile.trim() || !formData.location.trim()) {
      setError(lang === 'te' ? 'దయచేసి అవసరమైన వివరాలను నమోదు చేయండి.' : 'Please fill in all required fields.')
      return
    }
    if (!formData.agreed) {
      setError(lang === 'te' ? 'దయచేసి ప్రోగ్రామ్ కండిషన్స్‌కు అంగీకరించండి.' : 'Please agree to the programme terms to proceed.')
      return
    }
    setError('')
    setSubmitted(true)
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    if (!loginData.identifier.trim()) {
      setError(lang === 'te' ? 'దయచేసి మీ మొబైల్ నంబర్ లేదా ఈమెయిల్ ఇవ్వండి.' : 'Please enter your mobile number or email.')
      return
    }
    setError('')
    setSubmitted(true)
  }

  const text = {
    en: {
      badge: '100% Free · No sales background required',
      registerTitle: 'Become an sBLOOM Affiliate',
      registerSubtitle: 'Turn your connections into referral opportunities. Start in minutes.',
      loginTitle: 'Affiliate Sign In',
      loginSubtitle: 'Access your referrals, service briefs, and provider terms.',
      tabRegister: 'Become an affiliate',
      tabLogin: 'Sign in',
      nameLabel: 'Full Name',
      namePlaceholder: 'Your full name',
      mobileLabel: 'Mobile Number (WhatsApp preferred)',
      mobilePlaceholder: '10-digit mobile number',
      locationLabel: 'City and State',
      locationPlaceholder: 'e.g. Hyderabad, Telangana or Vijayawada, AP',
      personaLabel: 'Your Primary Circle / Background',
      personas: [
        { id: 'homemaker', label: 'Homemaker (Neighbours & family network)' },
        { id: 'shopowner', label: 'Shop Owner / Local Business' },
        { id: 'student', label: 'Student / College Circle' },
        { id: 'professional', label: 'Working Professional' },
        { id: 'community', label: 'Community Connector / Other' },
      ],
      consentText: 'I agree to the sBLOOM affiliate programme terms and referral evaluation guidelines.',
      btnRegister: 'Complete Registration →',
      btnLogin: 'Sign In to Dashboard →',
      switchLogin: 'Already registered as an affiliate? Sign in here',
      switchRegister: 'New to sBLOOM? Become an affiliate for free',
      loginIdLabel: 'Registered Mobile Number or Email',
      loginIdPlaceholder: 'Mobile or email',
      loginPassLabel: 'PIN or One-Time Passcode',
      loginPassPlaceholder: 'Enter PIN or leave blank for OTP',
      successTitle: 'Welcome to sBLOOM!',
      successMsg: 'Your affiliate registration is confirmed. Our onboarding team will send your access details via WhatsApp/SMS.',
      successNext: 'Explore How It Works',
      closeBtn: 'Close',
    },
    te: {
      badge: '100% ఫ్రీ · సేల్స్ ఎక్స్‌పీరియన్స్ అక్కర్లేదు',
      registerTitle: 'sBLOOM అఫిలియేట్ అవ్వండి',
      registerSubtitle: 'మీ పరిచయాలతో సంపాదన అవకాశాన్ని పొందండి. నిమిషాల్లో చేరండి.',
      loginTitle: 'అఫిలియేట్ లాగిన్',
      loginSubtitle: 'మీ రెఫరల్స్, సర్వీస్ వివరాలు మరియు ప్రొవైడర్ కండిషన్స్ చూడండి.',
      tabRegister: 'అఫిలియేట్ అవ్వండి',
      tabLogin: 'లాగిన్',
      nameLabel: 'పూర్తి పేరు',
      namePlaceholder: 'మీ పూర్తి పేరు',
      mobileLabel: 'మొబైల్ నంబర్ (WhatsApp)',
      mobilePlaceholder: '10 అంకెల మొబైల్ నంబర్',
      locationLabel: 'నగరం, రాష్ట్రం',
      locationPlaceholder: 'ఉదా: హైదరాబాద్, తెలంగాణ లేదా విజయవాడ, AP',
      personaLabel: 'మీ నేపథ్యం / పరిచయాలు',
      personas: [
        { id: 'homemaker', label: 'హోమ్‌మేకర్ (చుట్టుపక్కల & ఫ్యామిలీ పరిచయాలు)' },
        { id: 'shopowner', label: 'షాప్ ఓనర్ / స్థానిక వ్యాపారం' },
        { id: 'student', label: 'స్టూడెంట్ / కాలేజ్ గ్రూప్స్' },
        { id: 'professional', label: 'ఉద్యోగి / వర్కింగ్ ప్రొఫెషనల్' },
        { id: 'community', label: 'కమ్యూనిటీ / ఇతర పరిచయాలు' },
      ],
      consentText: 'నేను sBLOOM అఫిలియేట్ ప్రోగ్రామ్ నిబంధనలు మరియు రెఫరల్ రూల్స్‌కు అంగీకరిస్తున్నాను.',
      btnRegister: 'రిజిస్ట్రేషన్ పూర్తి చేయండి →',
      btnLogin: 'డ్యాష్‌బోర్డ్‌లోకి లాగిన్ అవ్వండి →',
      switchLogin: 'ఇప్పటికే అఫిలియేట్‌గా ఉన్నారా? ఇక్కడ లాగిన్ అవ్వండి',
      switchRegister: 'కొత్తవారా? ఉచితంగా అఫిలియేట్ అవ్వండి',
      loginIdLabel: 'మొబైల్ నంబర్ లేదా ఈమెయిల్',
      loginIdPlaceholder: 'మొబైల్ నంబర్ లేదా ఈమెయిల్',
      loginPassLabel: 'పిన్ (PIN) లేదా OTP',
      loginPassPlaceholder: 'పిన్ ఎంటర్ చేయండి లేదా OTP పొందండి',
      successTitle: 'స్వాగతం! మీరు sBLOOM అఫిలియేట్ అయ్యారు',
      successMsg: 'మీ వివరాలు నమోదయ్యాయి. తదుపరి స్టెప్స్ మరియు వివరాలు మీకు WhatsApp/SMS ద్వారా అందుతాయి.',
      successNext: 'ఇది ఎలా పనిచేస్తుందో చూడండి',
      closeBtn: 'ముగించండి',
    },
  }

  const t = text[lang] || text.en

  return (
    <div
      className="fixed inset-0 bg-[#12101F]/70 backdrop-blur-sm flex items-center justify-center p-4 z-[99999] animate-[fadeIn_0.2s_ease-out]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="bg-white text-[#12101F] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-[#12101F]/10 p-6 sm:p-8 relative flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FAF7F2] hover:bg-[#12101F]/10 text-[#575266] hover:text-[#12101F] flex items-center justify-center transition-colors cursor-pointer"
          onClick={onClose}
          aria-label="Close dialog"
        >
          <X size={18} aria-hidden="true" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center text-center gap-4 py-6" role="status" aria-live="polite">
            <div className="w-16 h-16 rounded-full bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
              <CheckCircle2 size={36} />
            </div>
            <h3 id="auth-modal-title" className="text-2xl font-bold font-headline text-[#12101F]">
              {t.successTitle}
            </h3>
            <p className="text-sm sm:text-base text-[#575266] leading-relaxed max-w-sm">
              {t.successMsg}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
              {onNavigateHowItWorks && (
                <button
                  type="button"
                  className="btn btn-primary flex-1 py-3 text-sm justify-center"
                  onClick={() => {
                    onClose()
                    onNavigateHowItWorks()
                  }}
                >
                  <span>{t.successNext}</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
              )}
              <button
                type="button"
                className="btn btn-secondary py-3 text-sm justify-center px-6"
                onClick={onClose}
              >
                <span>{t.closeBtn}</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Modal Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold text-[#6B3CFF] bg-[#6B3CFF]/10 border border-[#6B3CFF]/20 w-fit">
              <Sparkles size={14} className="text-[#6B3CFF]" aria-hidden="true" />
              <span>{t.badge}</span>
            </div>

            {/* Title & Subtitle */}
            <div className="flex flex-col gap-1">
              <h3 id="auth-modal-title" className="text-2xl sm:text-3xl font-headline font-bold text-[#12101F] tracking-tight m-0">
                {mode === 'register' ? t.registerTitle : t.loginTitle}
              </h3>
              <p className="text-xs sm:text-sm text-[#575266] leading-relaxed m-0">
                {mode === 'register' ? t.registerSubtitle : t.loginSubtitle}
              </p>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-[#FAF7F2] p-1 rounded-full border border-[#12101F]/8 gap-1" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'register'}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-white text-[#6B3CFF] shadow-xs'
                    : 'text-[#575266] hover:text-[#12101F]'
                }`}
                onClick={() => {
                  setMode('register')
                  setError('')
                }}
              >
                {t.tabRegister}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === 'login'}
                className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-white text-[#6B3CFF] shadow-xs'
                    : 'text-[#575266] hover:text-[#12101F]'
                }`}
                onClick={() => {
                  setMode('login')
                  setError('')
                }}
              >
                {t.tabLogin}
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
                {error}
              </div>
            )}

            {mode === 'register' ? (
              <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4" noValidate>
                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#12101F] flex items-center gap-1.5 font-headline">
                    <User size={13} className="text-[#6B3CFF]" />
                    <span>{t.nameLabel} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t.namePlaceholder}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#12101F]/12 rounded-xl text-sm text-[#12101F] focus:outline-none focus:border-[#6B3CFF] focus:bg-white transition-all"
                  />
                </div>

                {/* Mobile */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#12101F] flex items-center gap-1.5 font-headline">
                    <Phone size={13} className="text-[#6B3CFF]" />
                    <span>{t.mobileLabel} *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder={t.mobilePlaceholder}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#12101F]/12 rounded-xl text-sm text-[#12101F] focus:outline-none focus:border-[#6B3CFF] focus:bg-white transition-all"
                  />
                </div>

                {/* City & State */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#12101F] flex items-center gap-1.5 font-headline">
                    <MapPin size={13} className="text-[#6B3CFF]" />
                    <span>{t.locationLabel} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder={t.locationPlaceholder}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#12101F]/12 rounded-xl text-sm text-[#12101F] focus:outline-none focus:border-[#6B3CFF] focus:bg-white transition-all"
                  />
                </div>

                {/* Persona Circle */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#12101F] flex items-center gap-1.5 font-headline">
                    <Building2 size={13} className="text-[#6B3CFF]" />
                    <span>{t.personaLabel}</span>
                  </label>
                  <select
                    value={formData.persona}
                    onChange={(e) => setFormData({ ...formData, persona: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#12101F]/12 rounded-xl text-sm text-[#12101F] focus:outline-none focus:border-[#6B3CFF] focus:bg-white transition-all"
                  >
                    {t.personas.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Consent Checkbox */}
                <label className="flex items-start gap-2.5 text-xs text-[#575266] cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={formData.agreed}
                    onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                    className="mt-0.5 rounded border-[#12101F]/20 text-[#6B3CFF] focus:ring-[#6B3CFF]"
                  />
                  <span>{t.consentText}</span>
                </label>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-full py-3.5 text-sm font-semibold justify-center rounded-full shadow-md mt-1 cursor-pointer"
                >
                  <span>{t.btnRegister}</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </button>

                <p className="text-center text-xs text-[#827C94] m-0">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login')
                      setError('')
                    }}
                    className="text-[#6B3CFF] hover:underline font-semibold bg-transparent border-none p-0 cursor-pointer"
                  >
                    {t.switchLogin}
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4" noValidate>
                {/* Identifier */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#12101F] flex items-center gap-1.5 font-headline">
                    <UserCheck size={13} className="text-[#6B3CFF]" />
                    <span>{t.loginIdLabel} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={loginData.identifier}
                    onChange={(e) => setLoginData({ ...loginData, identifier: e.target.value })}
                    placeholder={t.loginIdPlaceholder}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#12101F]/12 rounded-xl text-sm text-[#12101F] focus:outline-none focus:border-[#6B3CFF] focus:bg-white transition-all"
                  />
                </div>

                {/* Passcode / PIN */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-[#12101F] flex items-center gap-1.5 font-headline">
                    <Lock size={13} className="text-[#6B3CFF]" />
                    <span>{t.loginPassLabel}</span>
                  </label>
                  <input
                    type="password"
                    value={loginData.passcode}
                    onChange={(e) => setLoginData({ ...loginData, passcode: e.target.value })}
                    placeholder={t.loginPassPlaceholder}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#12101F]/12 rounded-xl text-sm text-[#12101F] focus:outline-none focus:border-[#6B3CFF] focus:bg-white transition-all"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary w-full py-3.5 text-sm font-semibold justify-center rounded-full shadow-md mt-1 cursor-pointer"
                >
                  <span>{t.btnLogin}</span>
                  <ArrowRight size={16} aria-hidden="true" />
                </button>

                <p className="text-center text-xs text-[#827C94] m-0">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register')
                      setError('')
                    }}
                    className="text-[#6B3CFF] hover:underline font-semibold bg-transparent border-none p-0 cursor-pointer"
                  >
                    {t.switchRegister}
                  </button>
                </p>
              </form>
            )}

            <div className="flex items-center justify-center gap-2 pt-2 border-t border-[#12101F]/8 text-[11px] text-[#827C94]">
              <ShieldCheck size={14} className="text-[#16A34A] shrink-0" aria-hidden="true" />
              <span>{lang === 'te' ? 'మీ వివరాలు సురక్షితం · అనధికార మెసేజ్లు ఉండవు' : 'Your details are safe · No unsolicited contact'}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
