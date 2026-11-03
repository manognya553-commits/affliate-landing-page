import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import { getPortalText } from '../../i18n/portalTranslations'
import {
  Search,
  Filter,
  HeartPulse,
  GraduationCap,
  Building2,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Info,
  CheckCircle2,
  X,
  ShieldAlert,
  RefreshCw,
  MailCheck,
  MapPin,
  Check,
} from 'lucide-react'

export default function AffiliateServicesPage() {
  const { lang } = useLanguage()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const [providers, setProviders] = useState([])
  const [loadingProviders, setLoadingProviders] = useState(true)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalSector, setModalSector] = useState('healthcare')
  const [selectedProviderId, setSelectedProviderId] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientMobile, setClientMobile] = useState('')
  const [clientCity, setClientCity] = useState('')
  const [clientNeed, setClientNeed] = useState('')
  const [consentGiven, setConsentGiven] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

  const t = (path) => getPortalText(lang, path)

  const isEmailVerified = Boolean(user?.email_verified_at)

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setLoadingProviders(true)
        const data = await api.getProviders({ active_only: true })
        if (Array.isArray(data)) {
          setProviders(data)
        }
      } catch (err) {
        console.error('Failed to load service providers:', err)
      } finally {
        setLoadingProviders(false)
      }
    }
    fetchProviders()
  }, [])

  const defaultServices = [
    {
      id: 'healthcare-consultation',
      category: 'healthcare',
      title: t('services.healthcareTitle'),
      badge: t('services.badgeHealthcare'),
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: HeartPulse,
      iconColor: 'bg-emerald-50 text-emerald-600',
      description: t('services.healthcareDesc'),
      eligibility: t('services.healthcareCriteria'),
      terms: t('services.healthcareTerms'),
    },
    {
      id: 'education-programs',
      category: 'education',
      title: t('services.educationTitle'),
      badge: t('services.badgeEducation'),
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: GraduationCap,
      iconColor: 'bg-blue-50 text-blue-600',
      description: t('services.educationDesc'),
      eligibility: t('services.educationCriteria'),
      terms: t('services.educationTerms'),
    },
    {
      id: 'professional-advisory',
      category: 'professional',
      title: t('services.professionalTitle'),
      badge: t('services.badgeProfessional'),
      badgeColor: 'bg-purple-50 text-[#6B3CFF] border-purple-200',
      icon: Building2,
      iconColor: 'bg-purple-50 text-[#6B3CFF]',
      description: t('services.professionalDesc'),
      eligibility: t('services.professionalCriteria'),
      terms: t('services.professionalTerms'),
    },
  ]

  // Filter dynamic providers
  const filteredProviders = providers.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.sector === selectedCategory
    const matchesQuery =
      p.provider_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.service_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.city && p.city.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCat && matchesQuery
  })

  // Filter fallback launch sectors
  const filteredServices = defaultServices.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleOpenModal = (cat, providerId = '') => {
    setModalSector(cat)
    setSelectedProviderId(providerId)
    setSubmitError('')
    setSubmitSuccess('')
    setModalOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!consentGiven) {
      setSubmitError(
        lang === 'te'
          ? 'క్లయింట్ స్పష్టమైన అనుమతిని తప్పనిసరిగా నిర్ధారించాలి.'
          : 'You must confirm that the client gave explicit permission.'
      )
      return
    }

    if (!isEmailVerified) {
      setSubmitError(
        lang === 'te'
          ? 'రిఫరల్ సమర్పించే ముందు మీ ఈమెయిల్‌ను ధృవీకరించండి.'
          : 'Please verify your email address before submitting referrals.'
      )
      return
    }

    try {
      setSubmitting(true)
      setSubmitError('')
      setSubmitSuccess('')

      await api.submitAffiliateReferral({
        client_name: clientName.trim(),
        client_mobile: clientMobile.trim(),
        client_city: clientCity.trim(),
        service_category: modalSector,
        context_note: clientNeed.trim(),
        consent_confirmed: true,
        provider_id: selectedProviderId ? parseInt(selectedProviderId, 10) : null,
      })

      setSubmitSuccess(
        lang === 'te'
          ? 'రిఫరల్ విజయవంతంగా సమర్పించబడింది!'
          : 'Referral submitted successfully to the pipeline.'
      )

      setClientName('')
      setClientMobile('')
      setClientCity('')
      setClientNeed('')
      setConsentGiven(false)

      setTimeout(() => {
        setModalOpen(false)
        setSubmitSuccess('')
      }, 1500)
    } catch (err) {
      console.error('Submission failed:', err)
      setSubmitError(err.message || 'Failed to submit referral.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <div className="bg-white rounded-3xl border border-[#12101F]/10 p-8 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6B3CFF] via-[#8E51FF] to-[#D6F36B]" />

        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B3CFF]/10 text-[#6B3CFF] text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} />
            <span>{lang === 'te' ? 'ఆమోదించబడిన రంగాలు' : 'Approved Launch Sectors'}</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0E0B1E] tracking-tight leading-tight m-0">
            {t('services.title')}
          </h1>

          <p className="text-sm sm:text-base text-[#575266] leading-relaxed m-0">
            {t('services.subtitle')}
          </p>
        </div>
      </div>

      {/* 2. Provider-Defined Terms Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs sm:text-sm flex items-start gap-3 shadow-2xs">
        <Info size={20} className="text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold block">
            {lang === 'te' ? 'ప్రొవైడర్ నిబంధనల విధానం:' : 'Provider-Defined Terms Policy:'}
          </span>
          <p className="m-0 text-amber-900 leading-relaxed text-xs">
            {t('services.providerTermsNotice')}
          </p>
        </div>
      </div>

      {/* 3. Search Bar and Category Filter Pills */}
      <div className="bg-white rounded-3xl border border-[#12101F]/10 p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#575266]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('services.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/50 text-sm text-[#0E0B1E] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] box-border"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                selectedCategory === 'all'
                  ? 'bg-[#6B3CFF] text-white border-[#6B3CFF]'
                  : 'bg-white text-[#575266] border-[#12101F]/15 hover:bg-black/5'
              }`}
            >
              {t('services.filterAll')}
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('healthcare')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                selectedCategory === 'healthcare'
                  ? 'bg-[#6B3CFF] text-white border-[#6B3CFF]'
                  : 'bg-white text-[#575266] border-[#12101F]/15 hover:bg-black/5'
              }`}
            >
              {t('services.filterHealthcare')}
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('education')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                selectedCategory === 'education'
                  ? 'bg-[#6B3CFF] text-white border-[#6B3CFF]'
                  : 'bg-white text-[#575266] border-[#12101F]/15 hover:bg-black/5'
              }`}
            >
              {t('services.filterEducation')}
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory('professional')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                selectedCategory === 'professional'
                  ? 'bg-[#6B3CFF] text-white border-[#6B3CFF]'
                  : 'bg-white text-[#575266] border-[#12101F]/15 hover:bg-black/5'
              }`}
            >
              {t('services.filterProfessional')}
            </button>
          </div>
        </div>
      </div>

      {/* 4. Service Providers / Sectors Directory */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[#0E0B1E] m-0">
            {lang === 'te' ? 'ధృవీకరించబడిన సర్వీస్ ప్రొవైడర్లు' : 'Accredited Service Providers'}
          </h2>
          <span className="text-xs text-[#575266]">
            {filteredProviders.length > 0
              ? `${filteredProviders.length} ${lang === 'te' ? 'ప్రొవైడర్లు అందుబాటులో ఉన్నారు' : 'providers available'}`
              : `${filteredServices.length} ${lang === 'te' ? 'రంగాలు అందుబాటులో ఉన్నాయి' : 'sectors available'}`}
          </span>
        </div>

        {loadingProviders ? (
          <div className="bg-white rounded-3xl border border-[#12101F]/10 p-12 text-center text-[#575266] text-sm flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin text-[#6B3CFF]" />
            <span>{t('common.loading')}</span>
          </div>
        ) : filteredProviders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((prov) => {
              const sectorColor =
                prov.sector === 'healthcare'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : prov.sector === 'education'
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-purple-50 text-[#6B3CFF] border-purple-200'

              const sectorIcon =
                prov.sector === 'healthcare' ? (
                  <HeartPulse size={18} className="text-emerald-600" />
                ) : prov.sector === 'education' ? (
                  <GraduationCap size={18} className="text-blue-600" />
                ) : (
                  <Building2 size={18} className="text-[#6B3CFF]" />
                )

              return (
                <div
                  key={prov.id}
                  className="bg-white rounded-3xl border border-[#12101F]/10 p-6 shadow-sm flex flex-col justify-between hover:border-[#6B3CFF]/40 hover:shadow-md transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border capitalize ${sectorColor}`}>
                        {prov.sector}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {prov.is_sample && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            {lang === 'te' ? 'శాంపిల్' : 'Sample'}
                          </span>
                        )}
                        <div className="w-8 h-8 rounded-xl bg-[#FAF7F2] border border-[#12101F]/5 flex items-center justify-center">
                          {sectorIcon}
                        </div>
                      </div>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#0E0B1E] m-0">
                      {prov.provider_name}
                    </h3>

                    {prov.city && (
                      <div className="inline-flex items-center gap-1 text-[11px] text-[#575266]">
                        <MapPin size={12} className="text-[#6B3CFF]" />
                        <span>{prov.city}{prov.state ? `, ${prov.state}` : ''}</span>
                      </div>
                    )}

                    <p className="text-xs text-[#575266] leading-relaxed m-0">
                      {prov.service_description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-[#12101F]/10">
                      {prov.qualification_criteria && (
                        <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#12101F]/5 text-xs space-y-1">
                          <span className="font-bold text-[#0E0B1E] block">
                            {lang === 'te' ? 'అర్హత షరతులు:' : 'Eligibility:'}
                          </span>
                          <span className="text-[#575266] block leading-relaxed text-[11px]">
                            {prov.qualification_criteria}
                          </span>
                        </div>
                      )}

                      <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs space-y-1">
                        <span className="font-bold text-[#6B3CFF] block">
                          {lang === 'te' ? 'పరిహార విధానం:' : 'Compensation Terms:'}
                        </span>
                        <span className="text-[#575266] block leading-relaxed text-[11px]">
                          {prov.compensation_terms || (lang === 'te' ? 'ప్రొవైడర్-నిర్వచించిన నిబంధనలు వర్తిస్తాయి.' : 'Provider-defined independent terms apply.')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 mt-4 border-t border-[#12101F]/10">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(prov.sector, String(prov.id))}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#6B3CFF] hover:bg-[#582CD6] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer border-none"
                    >
                      <span>{t('services.introduceBtn')}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Fallback Sector Cards if no DB providers */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredServices.map((svc) => {
              const IconComponent = svc.icon
              return (
                <div
                  key={svc.id}
                  className="bg-white rounded-3xl border border-[#12101F]/10 p-6 shadow-sm flex flex-col justify-between hover:border-[#6B3CFF]/40 hover:shadow-md transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${svc.badgeColor}`}>
                        {svc.badge}
                      </span>
                      <div className={`w-9 h-9 rounded-xl ${svc.iconColor} flex items-center justify-center`}>
                        <IconComponent size={20} />
                      </div>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-[#0E0B1E] m-0">
                      {svc.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#575266] leading-relaxed m-0">
                      {svc.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-[#12101F]/10">
                      <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#12101F]/5 text-xs space-y-1">
                        <span className="font-bold text-[#0E0B1E] block">
                          {lang === 'te' ? 'అర్హత షరతులు:' : 'Eligibility Conditions:'}
                        </span>
                        <span className="text-[#575266] block leading-relaxed">
                          {svc.eligibility}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 text-xs space-y-1">
                        <span className="font-bold text-[#6B3CFF] block">
                          {lang === 'te' ? 'పరిహార విధానం:' : 'Compensation Terms:'}
                        </span>
                        <span className="text-[#575266] block leading-relaxed">
                          {svc.terms}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-[#12101F]/10">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(svc.category)}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#6B3CFF] hover:bg-[#582CD6] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer border-none"
                    >
                      <span>{t('services.introduceBtn')}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 5. Integration Notice Card */}
      <div className="bg-white rounded-3xl border border-[#12101F]/10 p-6 shadow-sm flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-[#6B3CFF]/10 text-[#6B3CFF] flex items-center justify-center shrink-0 mt-0.5">
          <ShieldCheck size={20} />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold text-[#0E0B1E] block">
            {lang === 'te' ? 'ప్రత్యక్ష డేటాబేస్ అనుసంధానం' : 'Live Provider Directory Integration'}
          </span>
          <p className="text-xs text-[#575266] m-0 leading-relaxed">
            {lang === 'te'
              ? 'ఈ డైరెక్టరీ డేటాబేస్ నుండి లైవ్ ప్రొవైడర్ రికార్డులను ప్రదర్శిస్తుంది. అనుబంధ భాగస్వాములు అనుమతితో క్లయింట్‌లను నేరుగా ప్రొవైడర్‌కు సూచించవచ్చు.'
              : 'This directory displays live provider records from the database. Affiliates introduce potential clients with prior consent; provider-specific terms govern all referral compensation.'}
          </p>
        </div>
      </div>

      {/* 6. Introduce Client Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 border border-black/10 shadow-2xl relative my-8 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#12101F]/60 hover:text-[#12101F] hover:bg-black/5 transition-colors cursor-pointer border-none bg-transparent"
            >
              <X size={20} />
            </button>

            <div className="space-y-1.5 pb-5 mb-5 border-b border-[#12101F]/10">
              <span className="text-xs font-bold text-[#6B3CFF] uppercase tracking-wider block">
                {lang === 'te' ? 'క్లయింట్ సిఫార్సు' : 'Service Client Recommendation'}
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#0E0B1E] m-0">
                {t('referrals.modalTitle')}
              </h2>
            </div>

            {/* Email Verification Warning if unverified */}
            {!isEmailVerified && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-950 text-xs flex items-start gap-3 mb-5">
                <AlertCircle size={18} className="text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">
                    {lang === 'te' ? 'ఈమెయిల్ ధృవీకరణ అవసరం' : 'Email Verification Required'}
                  </span>
                  <span className="text-amber-900 leading-relaxed block">
                    {lang === 'te'
                      ? 'రిఫరల్ సమర్పించే ముందు మీ ఈమెయిల్‌ను ధృవీకరించాలి.'
                      : 'You must verify your email address before submitting referrals into the pipeline.'}
                  </span>
                  <Link
                    to="/app/verify-email"
                    className="inline-block mt-1 font-bold text-[#6B3CFF] hover:underline"
                  >
                    {lang === 'te' ? 'ఈమెయిల్ ధృవీకరణ పేజీకి వెళ్లండి →' : 'Go to Email Verification →'}
                  </Link>
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3 mb-5">
              <ShieldAlert size={18} className="text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold block">{t('referrals.consentNoticeTitle')}</span>
                <span className="text-amber-800 leading-relaxed block">{t('referrals.consentNoticeDesc')}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#0E0B1E] mb-1">
                  {t('referrals.clientName')} *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder={t('referrals.clientNamePlaceholder')}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/50 text-sm text-[#0E0B1E] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] box-border"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E0B1E] mb-1">
                    {t('referrals.clientMobile')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={clientMobile}
                    onChange={(e) => setClientMobile(e.target.value)}
                    placeholder={t('referrals.clientMobilePlaceholder')}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/50 text-sm text-[#0E0B1E] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] box-border"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E0B1E] mb-1">
                    {t('referrals.clientCity')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                    placeholder={t('referrals.clientCityPlaceholder')}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/50 text-sm text-[#0E0B1E] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] box-border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#0E0B1E] mb-1">
                    {t('referrals.serviceCategory')} *
                  </label>
                  <select
                    value={modalSector}
                    onChange={(e) => setModalSector(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/50 text-sm text-[#0E0B1E] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] box-border"
                  >
                    <option value="healthcare">Healthcare & Diagnostics</option>
                    <option value="education">Education & Career Development</option>
                    <option value="professional">Professional & Business Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0E0B1E] mb-1">
                    {lang === 'te' ? 'లక్ష్య ప్రొవైడర్ (ఐచ్ఛికం)' : 'Target Provider (Optional)'}
                  </label>
                  <select
                    value={selectedProviderId}
                    onChange={(e) => setSelectedProviderId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/50 text-sm text-[#0E0B1E] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] box-border"
                  >
                    <option value="">
                      {lang === 'te' ? 'సాధారణ రంగ రిఫరల్ (ప్రొవైడర్ పేర్కొనబడలేదు)' : 'General Sector Referral (No provider)'}
                    </option>
                    {providers
                      .filter((p) => p.sector === modalSector)
                      .map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.provider_name} ({p.city || 'AP/Telangana'})
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0E0B1E] mb-1">
                  {t('referrals.clientNeed')} *
                </label>
                <textarea
                  required
                  rows={3}
                  value={clientNeed}
                  onChange={(e) => setClientNeed(e.target.value)}
                  placeholder={t('referrals.clientNeedPlaceholder')}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#12101F]/15 bg-[#FAF7F2]/50 text-sm text-[#0E0B1E] focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] box-border leading-relaxed"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#12101F]/10 flex items-start gap-2.5">
                <input
                  id="svc-consent"
                  type="checkbox"
                  required
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-[#6B3CFF] focus:ring-[#6B3CFF] cursor-pointer"
                />
                <label htmlFor="svc-consent" className="text-xs text-[#575266] leading-relaxed cursor-pointer">
                  {t('referrals.consentCheckbox')}
                </label>
              </div>

              {submitError && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                  <AlertCircle size={15} className="shrink-0 text-amber-700" />
                  <span>{submitError}</span>
                </div>
              )}

              {submitSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-700" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#12101F]/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-[#12101F]/15 bg-white text-xs font-semibold text-[#575266] hover:bg-black/5 transition-colors cursor-pointer"
                >
                  {t('referrals.closeBtn')}
                </button>
                <button
                  type="submit"
                  disabled={submitting || !isEmailVerified}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6B3CFF] hover:bg-[#582CD6] text-white text-xs font-bold transition-all shadow-md shadow-[#6B3CFF]/20 cursor-pointer border-none disabled:opacity-50"
                >
                  {submitting && <RefreshCw size={13} className="animate-spin" />}
                  <span>{t('referrals.submitModalBtn')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
