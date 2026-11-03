import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getPortalText } from '../../i18n/portalTranslations';

export default function AffiliateStatusPage() {
  const { profile, user, signOut, updateProfile, submitForReview, refreshProfile, status } = useAuth();
  const { language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  // For info_requested editable fields
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [city, setCity] = useState(profile?.city || '');
  const [area, setArea] = useState(profile?.area || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [occupation, setOccupation] = useState(profile?.occupation || '');
  const [promotionPlan, setPromotionPlan] = useState(profile?.promotion_plan || '');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const t = (path) => getPortalText(language, path);

  const handleSignOut = async () => {
    await signOut();
    navigate('/app/login');
  };

  const handleResubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 1. Update editable profile details first
      const { error: updateErr } = await updateProfile({
        full_name: fullName.trim(),
        city: city.trim(),
        area: area.trim(),
        phone: phone.trim() || null,
        occupation: occupation.trim(),
        promotion_plan: promotionPlan.trim(),
      });
      if (updateErr) throw updateErr;

      // 2. Call submit_for_review() RPC to move status from 'info_requested' back to 'pending'
      const { error: rpcErr } = await submitForReview();
      if (rpcErr) throw rpcErr;

      setSuccessMsg(t('status.resubmitSuccess'));
      await refreshProfile();
    } catch (err) {
      console.error('Failed to resubmit application:', err);
      setErrorMsg(err.message || 'Failed to submit updates. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0E0B1E] flex flex-col justify-between">
      {/* Top bar */}
      <header className="border-b border-black/10 bg-white/80 backdrop-blur-md px-6 py-4 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-heading font-extrabold text-2xl tracking-tight text-[#0E0B1E] group-hover:text-[#6B3CFF] transition-colors">
              sBLOOM
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#6B3CFF]/10 text-[#6B3CFF] font-semibold">
              {t('shell.brandSubtitle')}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <div className="flex items-center rounded-lg bg-[#FAF7F2] p-1 border border-black/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  language === 'en' ? 'bg-[#6B3CFF] text-white shadow-sm' : 'text-[#0E0B1E]/70 hover:text-[#0E0B1E]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('te')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  language === 'te' ? 'bg-[#6B3CFF] text-white shadow-sm' : 'text-[#0E0B1E]/70 hover:text-[#0E0B1E]'
                }`}
              >
                తెలుగు
              </button>
            </div>

            <button
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-lg border border-black/15 text-xs font-medium text-[#0E0B1E]/80 hover:bg-black/5 hover:text-[#0E0B1E] transition-colors"
            >
              {t('status.signOut')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10">
        {/* Status Header Badge Card */}
        <div className="bg-white rounded-3xl border border-black/10 shadow-sm p-8 md:p-10 mb-8">
          {status === 'pending' && (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                {t('status.pendingBadge')}
              </div>
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-[#0E0B1E] tracking-tight">
                {t('status.pendingTitle')}
              </h1>
              <p className="text-base md:text-lg text-[#0E0B1E]/75 leading-relaxed max-w-2xl">
                {t('status.pendingLead')}
              </p>
              <p className="text-sm text-[#0E0B1E]/60">
                {t('status.pendingSub')}
              </p>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={async () => {
                    await refreshProfile();
                    if (profile?.status === 'approved') {
                      navigate('/app');
                    }
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#6B3CFF] text-white font-semibold text-sm hover:bg-[#592be0] transition-colors shadow-sm"
                >
                  {t('status.checkStatusBtn')}
                </button>
                <Link
                  to="/"
                  className="px-5 py-2.5 rounded-xl border border-black/15 text-sm font-semibold text-[#0E0B1E]/80 hover:bg-black/5 transition-colors"
                >
                  {t('status.browseLanding')}
                </Link>
              </div>
            </div>
          )}

          {status === 'info_requested' && (
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-900 border border-sky-200 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                {t('status.infoRequestedBadge')}
              </div>

              <div>
                <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-[#0E0B1E] tracking-tight">
                  {t('status.infoRequestedTitle')}
                </h1>
                <p className="mt-2 text-base md:text-lg text-[#0E0B1E]/75 leading-relaxed">
                  {t('status.infoRequestedLead')}
                </p>
              </div>

              {profile?.info_request_note && (
                <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200/80">
                  <h3 className="font-semibold text-sm text-amber-900 flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {t('status.reviewerNoteHeading')}
                  </h3>
                  <p className="text-sm text-amber-950 font-medium whitespace-pre-wrap leading-relaxed">
                    {profile.info_request_note}
                  </p>
                </div>
              )}

              {successMsg && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  {errorMsg}
                </div>
              )}

              {/* Form to update info and call submit_for_review() */}
              <form onSubmit={handleResubmit} className="space-y-4 pt-4 border-t border-black/10">
                <h3 className="font-heading font-bold text-lg text-[#0E0B1E]">
                  {t('status.infoUpdatePrompt')}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0E0B1E]/70 mb-1">
                      {t('onboarding.fullNameLabel')}
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 bg-white text-sm focus:border-[#6B3CFF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0E0B1E]/70 mb-1">
                      {t('onboarding.phoneLabel')}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 bg-white text-sm focus:border-[#6B3CFF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0E0B1E]/70 mb-1">
                      {t('onboarding.cityLabel')}
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 bg-white text-sm focus:border-[#6B3CFF] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#0E0B1E]/70 mb-1">
                      {t('onboarding.areaLabel')}
                    </label>
                    <input
                      type="text"
                      required
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 bg-white text-sm focus:border-[#6B3CFF] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0E0B1E]/70 mb-1">
                    {t('onboarding.occupationLabel')}
                  </label>
                  <input
                    type="text"
                    required
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 bg-white text-sm focus:border-[#6B3CFF] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#0E0B1E]/70 mb-1">
                    {t('onboarding.planLabel')}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={promotionPlan}
                    onChange={(e) => setPromotionPlan(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 bg-white text-sm focus:border-[#6B3CFF] focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-3 rounded-xl bg-[#6B3CFF] text-white font-semibold text-sm hover:bg-[#592be0] transition-colors disabled:opacity-60 shadow-sm"
                  >
                    {saving ? t('common.loading') : t('status.resubmitBtn')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {status === 'rejected' && (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-100 text-red-800 border border-red-200 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                {t('status.rejectedBadge')}
              </div>
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-[#0E0B1E] tracking-tight">
                {t('status.rejectedTitle')}
              </h1>
              <p className="text-base md:text-lg text-[#0E0B1E]/75 leading-relaxed max-w-2xl">
                {t('status.rejectedLead')}
              </p>

              {profile?.rejection_reason && (
                <div className="p-5 rounded-2xl bg-red-50/80 border border-red-200 text-sm">
                  <h3 className="font-semibold text-red-900 mb-1">
                    {t('status.rejectionReasonHeading')}
                  </h3>
                  <p className="text-red-800 whitespace-pre-wrap">
                    {profile.rejection_reason}
                  </p>
                </div>
              )}

              <p className="text-sm text-[#0E0B1E]/60 pt-2">
                {t('status.rejectedHelp')}
              </p>
            </div>
          )}

          {status === 'suspended' && (
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gray-200 text-gray-800 border border-gray-300 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-gray-600" />
                {t('status.suspendedBadge')}
              </div>
              <h1 className="font-heading font-extrabold text-3xl md:text-4xl text-[#0E0B1E] tracking-tight">
                {t('status.suspendedTitle')}
              </h1>
              <p className="text-base md:text-lg text-[#0E0B1E]/75 leading-relaxed max-w-2xl">
                {t('status.suspendedLead')}
              </p>
              <p className="text-sm text-[#0E0B1E]/60 pt-2">
                {t('status.suspendedHelp')}
              </p>
            </div>
          )}
        </div>

        {/* Application Summary Box */}
        <div className="bg-white/80 rounded-2xl border border-black/10 p-6 md:p-8 space-y-4">
          <h2 className="font-heading font-bold text-lg text-[#0E0B1E]">
            {t('status.summaryHeading')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-[#0E0B1E]/60 uppercase font-semibold">{t('onboarding.fullNameLabel')}</p>
              <p className="font-medium text-[#0E0B1E] mt-0.5">{profile?.full_name || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[#0E0B1E]/60 uppercase font-semibold">{t('auth.email')}</p>
              <p className="font-medium text-[#0E0B1E] mt-0.5">{user?.email || profile?.email || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[#0E0B1E]/60 uppercase font-semibold">{t('onboarding.phoneLabel')}</p>
              <p className="font-medium text-[#0E0B1E] mt-0.5">{profile?.phone || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[#0E0B1E]/60 uppercase font-semibold">{t('onboarding.cityLabel')}</p>
              <p className="font-medium text-[#0E0B1E] mt-0.5">{profile?.city || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[#0E0B1E]/60 uppercase font-semibold">{t('onboarding.areaLabel')}</p>
              <p className="font-medium text-[#0E0B1E] mt-0.5">{profile?.area || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[#0E0B1E]/60 uppercase font-semibold">{t('onboarding.occupationLabel')}</p>
              <p className="font-medium text-[#0E0B1E] mt-0.5">{profile?.occupation || '—'}</p>
            </div>
          </div>

          {profile?.promotion_plan && (
            <div className="pt-3 border-t border-black/10">
              <p className="text-xs text-[#0E0B1E]/60 uppercase font-semibold mb-1">{t('onboarding.planLabel')}</p>
              <p className="text-sm text-[#0E0B1E]/80 whitespace-pre-wrap">{profile.promotion_plan}</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 py-6 text-center text-xs text-[#0E0B1E]/60">
        sBLOOM Affiliate Programme • Step 1 Foundation
      </footer>
    </div>
  );
}
