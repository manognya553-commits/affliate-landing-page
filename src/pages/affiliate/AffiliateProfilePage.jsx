import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { getPortalText } from '../../i18n/portalTranslations';

export default function AffiliateProfilePage() {
  const { profile, user, updateProfile, refreshProfile } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [city, setCity] = useState(profile?.city || '');
  const [area, setArea] = useState(profile?.area || '');
  const [occupation, setOccupation] = useState(profile?.occupation || '');
  const [promotionPlan, setPromotionPlan] = useState(profile?.promotion_plan || '');
  const [preferredLanguage, setPreferredLanguage] = useState(profile?.preferred_language || language || 'en');

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const t = (path) => getPortalText(language, path);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setCity(profile.city || '');
      setArea(profile.area || '');
      setOccupation(profile.occupation || '');
      setPromotionPlan(profile.promotion_plan || '');
      setPreferredLanguage(profile.preferred_language || 'en');
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const { error } = await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        city: city.trim(),
        area: area.trim(),
        occupation: occupation.trim(),
        promotion_plan: promotionPlan.trim(),
        preferred_language: preferredLanguage,
      });

      if (error) throw error;

      if (preferredLanguage !== language) {
        setLanguage(preferredLanguage);
      }

      await refreshProfile();
      setSuccessMsg(t('shell.profile.savedSuccess'));
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setErrorMsg(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="font-heading font-extrabold text-2xl md:text-3xl text-[#0E0B1E] tracking-tight">
          {t('shell.profile.title')}
        </h1>
        <p className="text-sm md:text-base text-[#0E0B1E]/70 mt-1">
          {t('shell.profile.subtitle')}
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-black/10 p-8 shadow-sm space-y-6">
        {/* Read-only account info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#FAF7F2] border border-black/5 text-xs">
          <div>
            <label className="text-[#0E0B1E]/60 uppercase font-bold tracking-wider">{t('auth.email')}</label>
            <p className="font-semibold text-sm text-[#0E0B1E] mt-0.5">{user?.email || profile?.email}</p>
            <p className="text-[11px] text-[#0E0B1E]/50 mt-0.5">Account email is managed securely</p>
          </div>
          <div>
            <label className="text-[#0E0B1E]/60 uppercase font-bold tracking-wider">Account Status</label>
            <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px] tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
              {profile?.status === 'suspended' ? 'suspended' : 'active'}
            </div>
          </div>
        </div>

        {/* Editable fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/75 mb-1.5">
              {t('onboarding.fullNameLabel')} *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-black/15 bg-white text-sm focus:border-[#6B3CFF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/75 mb-1.5">
              {t('onboarding.phoneLabel')}
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +91 98765 43210"
              className="w-full px-4 py-2.5 rounded-xl border border-black/15 bg-white text-sm focus:border-[#6B3CFF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/75 mb-1.5">
              {t('onboarding.cityLabel')} *
            </label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-black/15 bg-white text-sm focus:border-[#6B3CFF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/75 mb-1.5">
              {t('onboarding.areaLabel')} *
            </label>
            <input
              type="text"
              required
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-black/15 bg-white text-sm focus:border-[#6B3CFF] focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/75 mb-1.5">
            {t('onboarding.occupationLabel')} *
          </label>
          <input
            type="text"
            required
            value={occupation}
            onChange={(e) => setOccupation(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-black/15 bg-white text-sm focus:border-[#6B3CFF] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/75 mb-1.5">
            {t('onboarding.planLabel')} *
          </label>
          <textarea
            rows={4}
            required
            value={promotionPlan}
            onChange={(e) => setPromotionPlan(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-black/15 bg-white text-sm focus:border-[#6B3CFF] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/75 mb-1.5">
            {t('auth.preferredLanguage')}
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="prefLang"
                value="en"
                checked={preferredLanguage === 'en'}
                onChange={() => setPreferredLanguage('en')}
                className="w-4 h-4 text-[#6B3CFF]"
              />
              <span>English (en)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm">
              <input
                type="radio"
                name="prefLang"
                value="te"
                checked={preferredLanguage === 'te'}
                onChange={() => setPreferredLanguage('te')}
                className="w-4 h-4 text-[#6B3CFF]"
              />
              <span>తెలుగు (te)</span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-black/10 flex items-center justify-between">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-[#6B3CFF] text-white font-semibold text-sm hover:bg-[#592be0] transition-colors disabled:opacity-60 shadow-sm"
          >
            {saving ? t('common.loading') : t('shell.profile.saveBtn')}
          </button>
        </div>
      </form>
    </div>
  );
}
