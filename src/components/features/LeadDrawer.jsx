import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import Drawer from '../ui/Drawer'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Textarea from '../ui/Textarea'
import {
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Search,
  Info,
  ShieldCheck,
  Briefcase,
  GraduationCap,
  HeartPulse,
  ChevronDown,
  ArrowRight,
  ExternalLink,
} from 'lucide-react'

const SECTOR_ICONS = {
  healthcare: HeartPulse,
  education: GraduationCap,
  professional: Briefcase,
}

const SECTOR_LABELS = {
  healthcare: { en: 'Healthcare', te: 'వైద్యం & ఆరోగ్యం' },
  education: { en: 'Education', te: 'విద్య & కోర్సులు' },
  professional: { en: 'Professional Services', te: 'వ్యాపార & వృత్తిపరమైన సేవలు' },
}

export default function LeadDrawer({
  isOpen = false,
  onClose,
  onSuccess,
  initialProviderId = null,
  initialServiceId = null,
}) {
  const { user } = useAuth()
  const { lang } = useLanguage()
  const navigate = useNavigate()

  // Providers & Services Data from live API
  const [providers, setProviders] = useState([])
  const [loadingProviders, setLoadingProviders] = useState(false)
  const [providerFetchError, setProviderFetchError] = useState('')

  // Form selections
  const [providerSearch, setProviderSearch] = useState('')
  const [selectedProviderId, setSelectedProviderId] = useState('')
  const [selectedServiceId, setSelectedServiceId] = useState('')

  // Customer Details
  const [clientName, setClientName] = useState('')
  const [clientMobile, setClientMobile] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientLocation, setClientLocation] = useState('')

  // Requirement & Consent
  const [requirementDescription, setRequirementDescription] = useState('')
  const [consentConfirmed, setConsentConfirmed] = useState(false)

  // Status & Submission
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [submittedLead, setSubmittedLead] = useState(null)

  // Fetch active providers when drawer opens
  useEffect(() => {
    if (!isOpen) return

    let isMounted = true
    const fetchProviders = async () => {
      try {
        setLoadingProviders(true)
        setProviderFetchError('')
        const data = await api.getProviders()
        if (isMounted) {
          const list = Array.isArray(data) ? data.filter((p) => p.is_active) : []
          setProviders(list)

          // If initialProviderId or initialServiceId passed
          if (initialProviderId) {
            const matchedProv = list.find((p) => p.id === initialProviderId)
            if (matchedProv) {
              setSelectedProviderId(matchedProv.id)
              if (initialServiceId) {
                const matchedSrv = (matchedProv.services || []).find((s) => s.id === initialServiceId && s.is_active)
                if (matchedSrv) setSelectedServiceId(matchedSrv.id)
              }
            }
          } else if (initialServiceId) {
            // Find provider that offers this service
            const matchedProv = list.find((p) =>
              (p.services || []).some((s) => s.id === initialServiceId || s.service_name.toLowerCase().includes(String(initialServiceId).toLowerCase()))
            )
            if (matchedProv) {
              setSelectedProviderId(matchedProv.id)
              const matchedSrv = (matchedProv.services || []).find((s) => s.id === initialServiceId || s.service_name.toLowerCase().includes(String(initialServiceId).toLowerCase()))
              if (matchedSrv) setSelectedServiceId(matchedSrv.id)
            }
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Failed to load active service providers:', err)
          setProviderFetchError(lang === 'te' ? 'సేవా ప్రొవైడర్ల వివరాలను లోడ్ చేయడం సాధ్యం కాలేదు.' : 'Failed to load verified service providers.')
        }
      } finally {
        if (isMounted) setLoadingProviders(false)
      }
    }

    fetchProviders()

    return () => {
      isMounted = false
    }
  }, [isOpen, initialProviderId, initialServiceId, lang])

  // Current selected provider object
  const currentProvider = useMemo(() => {
    return providers.find((p) => p.id === selectedProviderId) || null
  }, [providers, selectedProviderId])

  // Services of the selected provider
  const availableServices = useMemo(() => {
    if (!currentProvider || !Array.isArray(currentProvider.services)) return []
    return currentProvider.services.filter((s) => s.is_active)
  }, [currentProvider])

  // Current selected service object
  const currentService = useMemo(() => {
    return availableServices.find((s) => s.id === selectedServiceId) || null
  }, [availableServices, selectedServiceId])

  // Filtered providers for searchable picker
  const filteredProviders = useMemo(() => {
    if (!providerSearch.trim()) return providers
    const q = providerSearch.toLowerCase().trim()
    return providers.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        (p.area && p.area.toLowerCase().includes(q)) ||
        p.sector.toLowerCase().includes(q)
    )
  }, [providers, providerSearch])

  // Handle provider selection change
  const handleProviderSelect = (providerId) => {
    setSelectedProviderId(providerId)
    // Clear previously selected service when provider changes
    setSelectedServiceId('')
    setFormError('')
  }

  const resetForm = () => {
    setSelectedProviderId('')
    setSelectedServiceId('')
    setProviderSearch('')
    setClientName('')
    setClientMobile('')
    setClientEmail('')
    setClientLocation('')
    setRequirementDescription('')
    setConsentConfirmed(false)
    setFormError('')
    setSubmittedLead(null)
  }

  const handleClose = () => {
    resetForm()
    onClose?.()
  }

  // Mobile number validation: Indian 10 digits or standard international
  const validateMobile = (mobile) => {
    const cleaned = mobile.replace(/[\s\-\(\)]/g, '')
    // e.g. 9876543210 or +919876543210 or 09876543210
    const re = /^(\+?\d{1,4})?[6-9]\d{9}$/
    return re.test(cleaned) || cleaned.length >= 10
  }

  // Optional email format validation
  const validateEmail = (email) => {
    if (!email) return true
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email.trim())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    // 1. Validate Provider
    if (!selectedProviderId || !currentProvider) {
      setFormError(
        lang === 'te'
          ? 'దయచేసి ఒక సేవా ప్రొవైడర్‌ను ఎంచుకోండి.'
          : 'Please select a verified service provider from the network.'
      )
      return
    }

    // 2. Validate Service
    if (!selectedServiceId || !currentService) {
      setFormError(
        lang === 'te'
          ? 'దయచేసి ఎంచుకున్న ప్రొవైడర్ నుండి అవసరమైన సర్వీస్‌ను ఎంచుకోండి.'
          : 'Please select the specific service required from this provider.'
      )
      return
    }

    // 3. Validate Customer Details
    if (!clientName.trim() || clientName.trim().length < 2) {
      setFormError(
        lang === 'te'
          ? 'దయచేసి సంప్రదించాల్సిన కస్టమర్ పూర్తి పేరు నమోదు చేయండి.'
          : 'Please enter the potential customer name (minimum 2 characters).'
      )
      return
    }

    if (!clientMobile.trim() || !validateMobile(clientMobile)) {
      setFormError(
        lang === 'te'
          ? 'దయచేసి చెల్లుబాటు అయ్యే 10 అంకెల మొబైల్ నంబరును నమోదు చేయండి.'
          : 'Please provide a valid contact mobile number (e.g. +91 98765 43210).'
      )
      return
    }

    if (clientEmail.trim() && !validateEmail(clientEmail)) {
      setFormError(
        lang === 'te'
          ? 'దయచేసి చెల్లుబాటు అయ్యే ఇమెయిల్ చిరునామా నమోదు చేయండి లేదా ఖాళీగా ఉంచండి.'
          : 'Please enter a valid email address, or leave it empty.'
      )
      return
    }

    if (!clientLocation.trim() || clientLocation.trim().length < 2) {
      setFormError(
        lang === 'te'
          ? 'దయచేసి కస్టమర్ ప్రాంతం లేదా నగరాన్ని నమోదు చేయండి.'
          : 'Please enter the customer’s area, city, or locality.'
      )
      return
    }

    // 4. Validate Requirement Description (Conditional)
    if (currentService.requirement_description_required) {
      if (!requirementDescription.trim() || requirementDescription.trim().length < 10) {
        setFormError(
          lang === 'te'
            ? 'ఈ సర్వీస్ కోసం కస్టమర్ అవసరాన్ని కనీసం 10 అక్షరాలలో వివరించడం తప్పనిసరి.'
            : `A brief description of the customer's requirement (minimum 10 characters) is required by ${currentProvider.name} for this service.`
        )
        return
      }
    }

    // 5. Validate Mandatory Consent
    if (!consentConfirmed) {
      setFormError(
        lang === 'te'
          ? 'క్లయింట్ సంప్రదింపు అనుమతి ధృవీకరణ చెక్‌బాక్స్‌ను తప్పనిసరిగా ఎంచుకోవాలి.'
          : 'You must confirm explicit customer permission before submitting this referral.'
      )
      return
    }

    try {
      setSubmitting(true)

      const payload = {
        provider_id: selectedProviderId,
        service_id: selectedServiceId,
        client_name: clientName.trim(),
        client_mobile: clientMobile.trim(),
        client_email: clientEmail.trim() || null,
        client_city: clientLocation.trim(),
        service_category: currentProvider.sector,
        context_note: requirementDescription.trim() || null,
        consent_confirmed: true,
      }

      const res = await api.submitAffiliateReferral(payload)
      setSubmittedLead({
        id: res.id,
        referenceNumber: `SBL-REF-${String(res.id).slice(0, 8).toUpperCase()}`,
        clientName: res.client_name,
        providerName: res.provider_name || currentProvider.name,
        serviceName: res.service_name || currentService.service_name,
      })

      onSuccess?.(res)
    } catch (err) {
      console.error('Referral submission failed:', err)
      setFormError(err.message || 'Failed to submit referral. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderSuccessState = () => (
    <div className="py-8 px-2 sm:px-4 text-center space-y-6 animate-in fade-in duration-300">
      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center shadow-sm">
        <CheckCircle2 size={36} className="text-emerald-600" />
      </div>

      <div className="space-y-2">
        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#6B3CFF]/10 text-[#6B3CFF]">
          {lang === 'te' ? 'రిఫరల్ విజయవంతంగా సమర్పించబడింది' : 'Referral Submitted'}
        </span>
        <h3 className="text-2xl font-bold font-serif text-[#0E0B1E]">
          {lang === 'te' ? 'కస్టమర్ పరిచయం విజయవంతంగా నమోదైంది' : 'Potential Customer Referred'}
        </h3>
        <p className="text-sm text-[#575266] max-w-md mx-auto leading-relaxed">
          {lang === 'te'
            ? 'మీరు సమర్పించిన కస్టమర్ వివరాలు సంబంధిత సేవా ప్రొవైడర్‌కు సురక్షితంగా పంపబడ్డాయి. వారు నేరుగా సంప్రదించి ఫాలో-అప్ చేస్తారు.'
            : `The potential customer's details have been forwarded to ${submittedLead?.providerName}. The provider's coordination team will directly follow up on this enquiry.`}
        </p>
      </div>

      {/* Referral Reference Box */}
      <div className="p-4 rounded-2xl bg-white border border-[#12101F]/10 text-left max-w-md mx-auto space-y-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#12101F]/10 pb-2.5">
          <span className="text-xs text-[#575266] font-medium">
            {lang === 'te' ? 'రిఫరెన్స్ ఐడీ' : 'Reference ID'}
          </span>
          <span className="font-mono font-bold text-xs text-[#6B3CFF] bg-[#6B3CFF]/10 px-2 py-0.5 rounded">
            {submittedLead?.referenceNumber}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[#575266] block">{lang === 'te' ? 'కస్టమర్' : 'Customer'}</span>
            <span className="font-semibold text-[#0E0B1E]">{submittedLead?.clientName}</span>
          </div>
          <div>
            <span className="text-[#575266] block">{lang === 'te' ? 'సర్వీస్' : 'Service'}</span>
            <span className="font-semibold text-[#0E0B1E] truncate block">{submittedLead?.serviceName}</span>
          </div>
          <div className="col-span-2">
            <span className="text-[#575266] block">{lang === 'te' ? 'ప్రొవైడర్' : 'Service Provider'}</span>
            <span className="font-semibold text-[#0E0B1E]">{submittedLead?.providerName}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button
          variant="primary"
          onClick={() => {
            handleClose()
            navigate('/app/leads')
          }}
          className="w-full sm:w-auto"
        >
          <span>{lang === 'te' ? 'లీడ్స్ పైప్‌లైన్‌లో చూడండి' : 'View in Referral Pipeline'}</span>
          <ArrowRight size={15} />
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            resetForm()
          }}
          className="w-full sm:w-auto"
        >
          {lang === 'te' ? 'మరొక రిఫరల్ సమర్పించండి' : 'Refer Another Customer'}
        </Button>
      </div>
    </div>
  )

  return (
    <Drawer
      isOpen={isOpen}
      onClose={handleClose}
      title={lang === 'te' ? 'కస్టమర్‌ను రిఫర్ చేయండి' : 'Refer a Potential Customer'}
      subtitle={
        lang === 'te'
          ? 'సేవ అవసరమైన వారిని మా నెట్‌వర్క్‌లోని సరైన సర్వీస్ ప్రొవైడర్‌తో అనుసంధానించండి.'
          : 'Connect someone who needs a service with the right provider in our network.'
      }
      width="max-w-2xl"
    >
      {submittedLead ? (
        renderSuccessState()
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 pb-6">
          {formError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
              <AlertCircle size={16} className="text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium leading-relaxed">{formError}</div>
            </div>
          )}

          {/* ================================================================ */}
          {/* SECTION 1: SELECT SERVICE PROVIDER */}
          {/* ================================================================ */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#12101F]/10 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#0E0B1E] flex items-center gap-1.5">
                <Building2 size={14} className="text-[#6B3CFF]" />
                <span>
                  {lang === 'te' ? '1. సర్వీస్ ప్రొవైడర్‌ను ఎంచుకోండి' : '1. Select Service Provider'} *
                </span>
              </label>
              {currentProvider && (
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {lang === 'te' ? 'ఎంపికైంది' : 'Selected'}
                </span>
              )}
            </div>

            {loadingProviders ? (
              <div className="py-4 text-center text-xs text-[#575266]">
                {lang === 'te' ? 'ప్రొవైడర్ల జాబితాను లోడ్ చేస్తోంది...' : 'Loading verified providers from directory...'}
              </div>
            ) : providerFetchError ? (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {providerFetchError}
              </div>
            ) : (
              <div className="space-y-2.5">
                {/* Searchable input for filtering providers */}
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#575266]" />
                  <input
                    type="text"
                    value={providerSearch}
                    onChange={(e) => setProviderSearch(e.target.value)}
                    placeholder={
                      lang === 'te'
                        ? 'ప్రొవైడర్ పేరు, నగరం లేదా సెక్టార్ ద్వారా వెతకండి...'
                        : 'Search by provider name, sector, or city...'
                    }
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#12101F]/15 bg-[#FBF9F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]/30 transition-all text-[#0E0B1E]"
                  />
                </div>

                {/* Provider Selection Dropdown / Card List */}
                <div className="max-h-52 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {filteredProviders.length === 0 ? (
                    <div className="py-4 text-center text-xs text-[#575266]">
                      {lang === 'te' ? 'ప్రొవైడర్లు ఏవీ కనుగొనబడలేదు.' : 'No active providers match your search.'}
                    </div>
                  ) : (
                    filteredProviders.map((prov) => {
                      const isSelected = selectedProviderId === prov.id
                      const SectorIcon = SECTOR_ICONS[prov.sector] || Building2
                      const sectorText =
                        SECTOR_LABELS[prov.sector]?.[lang === 'te' ? 'te' : 'en'] || prov.sector

                      return (
                        <div
                          key={prov.id}
                          onClick={() => handleProviderSelect(prov.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                            isSelected
                              ? 'border-[#6B3CFF] bg-[#6B3CFF]/5 shadow-sm ring-1 ring-[#6B3CFF]'
                              : 'border-[#12101F]/10 bg-[#FAF7F2] hover:bg-white hover:border-[#12101F]/20'
                          }`}
                        >
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-xs text-[#0E0B1E]">
                                {prov.name}
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white border border-[#12101F]/10 text-[#575266]">
                                <SectorIcon size={11} className="text-[#6B3CFF]" />
                                <span>{sectorText}</span>
                              </span>
                            </div>
                            <div className="text-[11px] text-[#575266] flex items-center gap-1">
                              <MapPin size={11} className="text-[#575266] shrink-0" />
                              <span>{prov.city}{prov.area ? `, ${prov.area}` : ''}</span>
                            </div>
                          </div>

                          <div className="shrink-0 mt-0.5">
                            <input
                              type="radio"
                              name="provider_radio"
                              checked={isSelected}
                              onChange={() => handleProviderSelect(prov.id)}
                              className="w-4 h-4 text-[#6B3CFF] focus:ring-[#6B3CFF] cursor-pointer"
                            />
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ================================================================ */}
          {/* SECTION 2: SELECT SERVICE */}
          {/* ================================================================ */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#12101F]/10 space-y-3.5 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#0E0B1E] flex items-center gap-1.5">
                <Sparkles size={14} className="text-[#6B3CFF]" />
                <span>
                  {lang === 'te' ? '2. అవసరమైన సర్వీస్‌ను ఎంచుకోండి' : '2. Select Service Required'} *
                </span>
              </label>
              {currentService && (
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {lang === 'te' ? 'సర్వీస్ ఎంపికైంది' : '1 Service Selected'}
                </span>
              )}
            </div>

            {!selectedProviderId ? (
              <div className="p-4 rounded-xl bg-[#FAF7F2] border border-dashed border-[#12101F]/15 text-center text-xs text-[#575266]">
                {lang === 'te'
                  ? 'ప్రొవైడర్ అందుబాటులో ఉన్న సేవలను చూడటానికి పైన ఒక సర్వీస్ ప్రొవైడర్‌ను ఎంచుకోండి.'
                  : 'Please select a service provider above to view their available services.'}
              </div>
            ) : availableServices.length === 0 ? (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs">
                {lang === 'te'
                  ? 'ఈ ప్రొవైడర్‌కు ప్రస్తుతం క్రియాశీలక సేవలు అందుబాటులో లేవు.'
                  : 'No active services are currently listed for this provider.'}
              </div>
            ) : (
              <div className="space-y-2.5">
                {availableServices.map((srv) => {
                  const isSelected = selectedServiceId === srv.id

                  return (
                    <div
                      key={srv.id}
                      onClick={() => {
                        setSelectedServiceId(srv.id)
                        setFormError('')
                      }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2 ${
                        isSelected
                          ? 'border-[#6B3CFF] bg-[#6B3CFF]/5 shadow-sm ring-1 ring-[#6B3CFF]'
                          : 'border-[#12101F]/10 bg-[#FAF7F2] hover:bg-white hover:border-[#12101F]/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-xs text-[#0E0B1E]">
                              {srv.service_name}
                            </span>
                            {srv.requirement_description_required && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                                {lang === 'te' ? 'వివరణ అవసరం' : 'Description Required'}
                              </span>
                            )}
                          </div>
                          {srv.description && (
                            <p className="text-[11px] text-[#575266] leading-relaxed line-clamp-2">
                              {srv.description}
                            </p>
                          )}
                        </div>

                        <input
                          type="radio"
                          name="service_radio"
                          checked={isSelected}
                          onChange={() => {
                            setSelectedServiceId(srv.id)
                            setFormError('')
                          }}
                          className="w-4 h-4 text-[#6B3CFF] focus:ring-[#6B3CFF] cursor-pointer mt-0.5"
                        />
                      </div>

                      {/* Display provider instructions if selected and configured */}
                      {isSelected && srv.instructions && (
                        <div className="pt-2 border-t border-[#6B3CFF]/15 text-[11px] text-[#0E0B1E] flex items-start gap-2 bg-[#6B3CFF]/5 p-2 rounded-lg">
                          <Info size={13} className="text-[#6B3CFF] shrink-0 mt-0.5" />
                          <div className="leading-relaxed">
                            <span className="font-bold text-[#6B3CFF]">{lang === 'te' ? 'ప్రొవైడర్ సూచన: ' : 'Provider Instructions: '}</span>
                            {srv.instructions}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ================================================================ */}
          {/* SECTION 3: POTENTIAL CUSTOMER DETAILS (2-Column Layout) */}
          {/* ================================================================ */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#12101F]/10 space-y-4 shadow-sm">
            <label className="text-xs font-bold uppercase tracking-wider text-[#0E0B1E] flex items-center gap-1.5">
              <User size={14} className="text-[#6B3CFF]" />
              <span>
                {lang === 'te' ? '3. సంభావ్య కస్టమర్ సంప్రదింపు వివరాలు' : '3. Potential Customer Details'} *
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Customer Name */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#0E0B1E] flex items-center gap-1">
                  <span>{lang === 'te' ? 'కస్టమర్ పేరు' : 'Customer / Lead Name'}</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#575266]" />
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder={lang === 'te' ? 'ఉదా. రవి వర్మ' : 'e.g. Ramesh Kumar'}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#12101F]/15 bg-[#FBF9F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]/30 transition-all text-[#0E0B1E]"
                  />
                </div>
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#0E0B1E] flex items-center gap-1">
                  <span>{lang === 'te' ? 'మొబైల్ నంబరు' : 'Mobile Number'}</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#575266]" />
                  <input
                    type="tel"
                    required
                    value={clientMobile}
                    onChange={(e) => setClientMobile(e.target.value)}
                    placeholder={lang === 'te' ? '+91 98765 43210' : '+91 98765 43210'}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#12101F]/15 bg-[#FBF9F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]/30 transition-all text-[#0E0B1E]"
                  />
                </div>
              </div>

              {/* Email Address (Optional) */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#0E0B1E] flex items-center justify-between">
                  <span>{lang === 'te' ? 'ఇమెయిల్ చిరునామా' : 'Email Address'}</span>
                  <span className="text-[10px] text-[#575266] font-normal">
                    {lang === 'te' ? '(ఐచ్ఛికం)' : '(optional)'}
                  </span>
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#575266]" />
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder={lang === 'te' ? 'customer@example.com' : 'customer@example.com'}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#12101F]/15 bg-[#FBF9F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]/30 transition-all text-[#0E0B1E]"
                  />
                </div>
              </div>

              {/* Area / City / Location */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[#0E0B1E] flex items-center gap-1">
                  <span>{lang === 'te' ? 'ప్రాంతం / నగరం / లొకేషన్' : 'Area / City / Location'}</span>
                  <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#575266]" />
                  <input
                    type="text"
                    required
                    value={clientLocation}
                    onChange={(e) => setClientLocation(e.target.value)}
                    placeholder={lang === 'te' ? 'విజయవాడ / హైదరాబాద్ / విశాఖపట్నం' : 'Vijayawada / Hyderabad / Vizag'}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#12101F]/15 bg-[#FBF9F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]/30 transition-all text-[#0E0B1E]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================ */}
          {/* SECTION 4: REQUIREMENT / PROBLEM DESCRIPTION */}
          {/* ================================================================ */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#12101F]/10 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-[#0E0B1E] flex items-center gap-1.5">
                <Info size={14} className="text-[#6B3CFF]" />
                <span>
                  {lang === 'te'
                    ? '4. కస్టమర్ అవసరం / సమస్య వివరాలు'
                    : '4. What does the customer need help with?'}
                </span>
                {currentService?.requirement_description_required ? (
                  <span className="text-rose-500">*</span>
                ) : (
                  <span className="text-[10px] text-[#575266] font-normal lowercase">
                    {lang === 'te' ? '(ఐచ్ఛికం)' : '(optional)'}
                  </span>
                )}
              </label>

              {currentService?.requirement_description_required && (
                <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {lang === 'te' ? 'ఈ సర్వీస్‌కు తప్పనిసరి' : 'Required by Service'}
                </span>
              )}
            </div>

            <textarea
              rows={3}
              value={requirementDescription}
              onChange={(e) => setRequirementDescription(e.target.value)}
              placeholder={
                lang === 'te'
                  ? 'కస్టమర్ అవసరం, సవాలు లేదా వారు వెతుకుతున్న సేవను సంక్షిప్తంగా వివరించండి...'
                  : 'Briefly describe the customer’s requirement, challenge, or the service they are looking for...'
              }
              className="w-full p-3 text-xs rounded-xl border border-[#12101F]/15 bg-[#FBF9F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]/30 transition-all text-[#0E0B1E] leading-relaxed resize-none"
            />

            <p className="text-[11px] text-[#575266] flex items-start gap-1.5 leading-relaxed">
              <ShieldCheck size={13} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>
                {lang === 'te'
                  ? 'కస్టమర్ పంచుకోవడానికి అంగీకరించిన సమాచారాన్ని మాత్రమే అందించండి. సున్నితమైన వైద్య లేదా వ్యక్తిగత డేటాను సేకరించవద్దు.'
                  : 'Provide only information the customer has agreed to share. Do not collect unnecessary sensitive medical, financial, or personal information.'}
              </span>
            </p>
          </div>

          {/* ================================================================ */}
          {/* SECTION 5: CUSTOMER CONSENT */}
          {/* ================================================================ */}
          <div className="bg-[#FAF7F2] p-4 sm:p-5 rounded-2xl border border-[#12101F]/10 space-y-3">
            <div className="flex items-start gap-3">
              <input
                id="referral-consent-checkbox"
                type="checkbox"
                checked={consentConfirmed}
                onChange={(e) => {
                  setConsentConfirmed(e.target.checked)
                  if (e.target.checked) setFormError('')
                }}
                className="w-4 h-4 text-[#6B3CFF] rounded border-gray-300 focus:ring-[#6B3CFF] cursor-pointer mt-0.5 shrink-0"
              />
              <label
                htmlFor="referral-consent-checkbox"
                className="text-xs text-[#0E0B1E] font-medium leading-relaxed cursor-pointer select-none"
              >
                {lang === 'te'
                  ? 'ఎంచుకున్న సర్వీస్ ప్రొవైడర్‌తో ఈ విచారణపై ఫాలో-అప్ చేయడానికి కస్టమర్ సంప్రదింపు వివరాలు మరియు సర్వీస్ అవసరాన్ని పంచుకోవడానికి నాకు కస్టమర్ అనుమతి ఉందని నేను ధృవీకరిస్తున్నాను.'
                  : "I confirm that I have the customer's permission to share their contact details and service requirement with the selected service provider for the purpose of following up on this enquiry."}
                <span className="text-rose-500 font-bold ml-1">*</span>
              </label>
            </div>
          </div>

          {/* ================================================================ */}
          {/* SUBMIT BUTTON */}
          {/* ================================================================ */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={submitting}
              className="w-full py-3.5 text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              {submitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{lang === 'te' ? 'రిఫరల్ సమర్పిస్తోంది...' : 'Submitting Referral...'}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>{lang === 'te' ? 'రిఫరల్ సమర్పించండి' : 'Submit Referral'}</span>
                  <ArrowRight size={16} />
                </div>
              )}
            </Button>
          </div>
        </form>
      )}
    </Drawer>
  )
}
