import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { getPortalText } from '../../i18n/portalTranslations';

export default function ComingSoonPage() {
  const { language } = useLanguage();
  const location = useLocation();

  const t = (path) => getPortalText(language, path);

  const getSectionName = () => {
    const path = location.pathname;
    if (path.includes('/services')) return t('shell.nav.services');
    if (path.includes('/learn')) return t('shell.nav.learn');
    if (path.includes('/leads')) return t('shell.nav.leads');
    if (path.includes('/earnings')) return t('shell.nav.earnings');
    if (path.includes('/invoices')) return t('shell.nav.invoices');
    if (path.includes('/support')) return t('shell.nav.support');
    return 'Feature';
  };

  return (
    <div className="max-w-2xl mx-auto py-12 text-center space-y-6 animate-in fade-in duration-200">
      <div className="w-16 h-16 rounded-3xl bg-[#6B3CFF]/10 text-[#6B3CFF] flex items-center justify-center mx-auto">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <div className="space-y-2">
        <span className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100 text-amber-800">
          {t('shell.comingSoon.badge')}
        </span>
        <h1 className="font-heading font-extrabold text-3xl text-[#0E0B1E]">
          {getSectionName()} — {t('shell.comingSoon.title')}
        </h1>
        <p className="text-base text-[#0E0B1E]/70 max-w-lg mx-auto leading-relaxed">
          {t('shell.comingSoon.description')}
        </p>
      </div>

      <div className="pt-4">
        <Link
          to="/app"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#6B3CFF] text-white font-semibold text-sm hover:bg-[#592be0] transition-colors shadow-sm"
        >
          ← {t('shell.comingSoon.returnDashboard')}
        </Link>
      </div>
    </div>
  );
}
