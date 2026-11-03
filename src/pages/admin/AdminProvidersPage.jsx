import React, { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { useLanguage } from '../../context/useLanguage'
import { getPortalText } from '../../i18n/portalTranslations'
import {
  Building2,
  HeartPulse,
  GraduationCap,
  Sparkles,
  Search,
  Filter,
  Plus,
  Edit2,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  Phone,
  Mail,
  MapPin,
  Globe,
  Power,
  ShieldCheck,
  Tag,
} from 'lucide-react'

export default function AdminProvidersPage() {
  const { lang } = useLanguage()

  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState('')

  // Filter & Search states
  const [selectedSector, setSelectedSector] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProvider, setEditingProvider] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  // Form Fields
  const [name, setName] = useState('')
  const [sector, setSector] = useState('healthcare')
  const [serviceTitle, setServiceTitle] = useState('')
  const [description, setDescription] = useState('')
  const [eligibilityCriteria, setEligibilityCriteria] = useState('')
  const [compensationTerms, setCompensationTerms] = useState('')
  const [city, setCity] = useState('')
  const [area, setArea] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [isSample, setIsSample] = useState(false)
  const [isActive, setIsActive] = useState(true)

  const t = (path) => getPortalText(lang, path)

  const loadProviders = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getAdminProviders({
        sector: selectedSector !== 'all' ? selectedSector : null,
        status: selectedStatus !== 'all' ? selectedStatus : null,
        search: searchQuery.trim() || null,
      })
      setProviders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load providers:', err)
      setError(err.message || 'Failed to fetch provider directory.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProviders()
  }, [selectedSector, selectedStatus])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    loadProviders()
  }

  const handleOpenCreateModal = () => {
    setEditingProvider(null)
    setName('')
    setSector('healthcare')
    setServiceTitle('')
    setDescription('')
    setEligibilityCriteria('')
    setCompensationTerms('Provider sets terms. Verification window: 14 business days.')
    setCity('')
    setArea('')
    setContactEmail('')
    setContactPhone('')
    setWebsite('')
    setIsSample(false)
    setIsActive(true)
    setFormError('')
    setModalOpen(true)
  }

  const handleOpenEditModal = (prov) => {
    setEditingProvider(prov)
    setName(prov.name)
    setSector(prov.sector)
    setServiceTitle(prov.service_title)
    setDescription(prov.description)
    setEligibilityCriteria(prov.eligibility_criteria || '')
    setCompensationTerms(prov.compensation_terms)
    setCity(prov.city)
    setArea(prov.area || '')
    setContactEmail(prov.contact_email || '')
    setContactPhone(prov.contact_phone || '')
    setWebsite(prov.website || '')
    setIsSample(prov.is_sample)
    setIsActive(prov.is_active)
    setFormError('')
    setModalOpen(true)
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setFormError('')

    const payload = {
      name: name.trim(),
      sector,
      service_title: serviceTitle.trim(),
      description: description.trim(),
      eligibility_criteria: eligibilityCriteria.trim() || null,
      compensation_terms: compensationTerms.trim(),
      city: city.trim(),
      area: area.trim() || null,
      contact_email: contactEmail.trim().toLowerCase() || null,
      contact_phone: contactPhone.trim() || null,
      website: website.trim() || null,
      is_sample: isSample,
      is_active: isActive,
    }

    try {
      if (editingProvider) {
        await api.updateAdminProvider(editingProvider.id, payload)
        setSuccess(`Provider "${payload.name}" updated successfully.`)
      } else {
        await api.createAdminProvider(payload)
        setSuccess(`Provider "${payload.name}" created and added to directory.`)
      }
      setModalOpen(false)
      loadProviders()
    } catch (err) {
      setFormError(err.message || 'Failed to save provider.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (prov) => {
    try {
      await api.toggleAdminProviderActive(prov.id)
      setSuccess(
        `Provider "${prov.name}" is now ${prov.is_active ? 'deactivated' : 'activated'}.`
      )
      loadProviders()
    } catch (err) {
      setError(err.message || 'Failed to toggle provider status.')
    }
  }

  const getSectorBadge = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'healthcare':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <HeartPulse size={12} />
            {lang === 'te' ? 'ఆరోగ్య సంరక్షణ' : 'Healthcare'}
          </span>
        )
      case 'education':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <GraduationCap size={12} />
            {lang === 'te' ? 'విద్య' : 'Education'}
          </span>
        )
      case 'professional':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-[#6B3CFF] border border-purple-200">
            <Building2 size={12} />
            {lang === 'te' ? 'వృత్తిపరమైన సేవలు' : 'Professional'}
          </span>
        )
      default:
        return <span className="text-xs font-medium capitalize">{cat}</span>
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-black/10 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B3CFF]">
            {lang === 'te' ? 'ప్రొవైడర్ డైరెక్టరీ నిర్వహణ' : 'Directory & Partner Management'}
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0E0B1E] tracking-tight mt-1">
            {lang === 'te' ? 'సేవా ప్రొవైడర్ల కేటలాగ్' : 'Service Providers Directory'}
          </h1>
          <p className="text-sm text-[#0E0B1E]/70 max-w-2xl mt-1 leading-relaxed">
            {lang === 'te'
              ? 'ఆరోగ్య సంరక్షణ, విద్య మరియు వృత్తిపరమైన రంగాలలో అధీకృత భాగస్వాములను నిర్వహించండి మరియు డైరెక్టరీని అప్‌డేట్ చేయండి.'
              : 'Add, edit, and maintain accredited service providers across Healthcare, Education, and Professional Services.'}
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6B3CFF] text-white font-semibold text-sm hover:bg-[#592be0] transition-colors shadow-md shadow-[#6B3CFF]/30 cursor-pointer"
          >
            <Plus size={16} />
            <span>{lang === 'te' ? '+ ప్రొవైడర్‌ను జోడించండి' : '+ Add Service Provider'}</span>
          </button>
        </div>
      </div>

      {/* Global Alerts */}
      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} />
            <span>{success}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccess('')}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-700 hover:text-rose-900"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-black/10 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-3.5 text-[#0E0B1E]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'te'
                ? 'ప్రొవైడర్ పేరు, నగరం లేదా సేవ ద్వారా వెతకండి...'
                : 'Search providers by name, city, service title...'
            }
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]"
          />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Sector Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0E0B1E]/60 uppercase tracking-wider">
              {lang === 'te' ? 'రంగం:' : 'Sector:'}
            </span>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-3 py-2 rounded-xl border border-black/15 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] bg-white"
            >
              <option value="all">{lang === 'te' ? 'అన్ని రంగాలు' : 'All Sectors'}</option>
              <option value="healthcare">{lang === 'te' ? 'ఆరోగ్య సంరక్షణ' : 'Healthcare'}</option>
              <option value="education">{lang === 'te' ? 'విద్య' : 'Education'}</option>
              <option value="professional">{lang === 'te' ? 'వృత్తిపరమైన సేవలు' : 'Professional Services'}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0E0B1E]/60 uppercase tracking-wider">
              {lang === 'te' ? 'స్థితి:' : 'Status:'}
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl border border-black/15 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] bg-white"
            >
              <option value="all">{lang === 'te' ? 'అన్నీ' : 'All Status'}</option>
              <option value="active">{lang === 'te' ? 'యాక్టివ్' : 'Active Only'}</option>
              <option value="inactive">{lang === 'te' ? 'నిష్క్రియం' : 'Inactive Only'}</option>
            </select>
          </div>

          <button
            type="button"
            onClick={loadProviders}
            className="p-2.5 rounded-xl border border-black/10 hover:bg-black/5 text-[#0E0B1E] transition-colors"
            title="Refresh Providers"
          >
            <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* Providers Table */}
      <div className="bg-white rounded-3xl border border-black/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/10 bg-[#FAF7F2] text-[11px] font-bold uppercase tracking-wider text-[#0E0B1E]/60">
                <th className="py-4 px-6">{lang === 'te' ? 'ప్రొవైడర్ & సేవ' : 'Provider & Service'}</th>
                <th className="py-4 px-6">{lang === 'te' ? 'రంగం' : 'Sector'}</th>
                <th className="py-4 px-6">{lang === 'te' ? 'నగరం' : 'Location'}</th>
                <th className="py-4 px-6">{lang === 'te' ? 'పరిహార నిబంధనలు' : 'Compensation Terms'}</th>
                <th className="py-4 px-6">{lang === 'te' ? 'స్థితి' : 'Status'}</th>
                <th className="py-4 px-6 text-right">{lang === 'te' ? 'చర్యలు' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#0E0B1E]/60">
                    <RefreshCw size={24} className="animate-spin mx-auto text-[#6B3CFF] mb-2" />
                    <span>{lang === 'te' ? 'ప్రొవైడర్లను లోడ్ చేస్తున్నాము...' : 'Loading providers...'}</span>
                  </td>
                </tr>
              ) : providers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#0E0B1E]/60">
                    <Building2 size={32} className="mx-auto text-black/20 mb-2" />
                    <p className="font-semibold">{lang === 'te' ? 'ప్రొవైడర్లు ఏవీ కనుగొనబడలేదు' : 'No service providers found'}</p>
                    <p className="text-xs text-[#0E0B1E]/40 mt-1">
                      {lang === 'te' ? 'మీ శోధన ప్రమాణాలను సవరించండి లేదా కొత్త ప్రొవైడర్‌ను జోడించండి.' : 'Try adjusting your search criteria or add a new provider record.'}
                    </p>
                  </td>
                </tr>
              ) : (
                providers.map((prov) => (
                  <tr key={prov.id} className="hover:bg-[#FAF7F2]/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#0E0B1E] flex items-center gap-2">
                        <span>{prov.name}</span>
                        {prov.is_sample && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                            Sample
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#0E0B1E]/70 mt-0.5 font-medium">
                        {prov.service_title}
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {getSectorBadge(prov.sector)}
                    </td>
                    <td className="py-4 px-6 text-xs text-[#0E0B1E]/80">
                      <div className="font-semibold flex items-center gap-1">
                        <MapPin size={12} className="text-[#0E0B1E]/40" />
                        {prov.city}
                      </div>
                      {prov.area && <div className="text-[11px] text-[#0E0B1E]/50 pl-4">{prov.area}</div>}
                    </td>
                    <td className="py-4 px-6 text-xs text-[#0E0B1E]/70 max-w-xs truncate" title={prov.compensation_terms}>
                      {prov.compensation_terms}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {prov.is_active ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                          {lang === 'te' ? 'యాక్టివ్' : 'Active'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-black/5 text-[#0E0B1E]/50 border border-black/10">
                          <span className="w-1.5 h-1.5 rounded-full bg-black/30" />
                          {lang === 'te' ? 'నిష్క్రియం' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(prov)}
                          className="p-1.5 rounded-lg border border-black/10 hover:bg-black/5 text-[#0E0B1E] transition-colors"
                          title="Edit Provider"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(prov)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            prov.is_active
                              ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                          title={prov.is_active ? 'Deactivate Provider' : 'Activate Provider'}
                        >
                          <Power size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Provider Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-black/10 shadow-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-black/10 pb-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B3CFF]">
                  {editingProvider ? 'Edit Listing' : 'New Listing'}
                </span>
                <h2 className="text-xl font-bold text-[#0E0B1E]">
                  {editingProvider
                    ? (lang === 'te' ? 'ప్రొవైడర్ వివరాలను సవరించండి' : 'Edit Service Provider')
                    : (lang === 'te' ? 'కొత్త సర్వీస్ ప్రొవైడర్‌ను జోడించండి' : 'Add New Service Provider')}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-[#0E0B1E]/50 hover:bg-black/5"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 mb-5">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/60 mb-1.5">
                    {lang === 'te' ? 'ప్రొవైడర్ పేరు *' : 'Provider Legal Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Apollo Tele-Clinic / Pragathi Academy"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/60 mb-1.5">
                    {lang === 'te' ? 'రంగం *' : 'Sector Category *'}
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] bg-white"
                  >
                    <option value="healthcare">Healthcare</option>
                    <option value="education">Education</option>
                    <option value="professional">Professional Services</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/60 mb-1.5">
                  {lang === 'te' ? 'సేవ శీర్షిక *' : 'Service Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  placeholder="e.g. Specialist Diagnostic Consultations"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/60 mb-1.5">
                  {lang === 'te' ? 'వివరణ *' : 'Service Description *'}
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Accredited clinical services and specialist evaluations for referred patients..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/60 mb-1.5">
                    {lang === 'te' ? 'నగరం *' : 'City *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Vijayawada / Hyderabad / Visakhapatnam"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/60 mb-1.5">
                    {lang === 'te' ? 'ప్రాంతం (ఐచ్ఛికం)' : 'Area / Locality'}
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="Suryaraopet / Banjara Hills"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E0B1E]/60 mb-1.5">
                  {lang === 'te' ? 'పరిహార నిబంధనలు *' : 'Provider Compensation Terms *'}
                </label>
                <input
                  type="text"
                  required
                  value={compensationTerms}
                  onChange={(e) => setCompensationTerms(e.target.value)}
                  placeholder="Provider sets terms. Net 14 business days following verified consultation."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-sm focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E0B1E]/60 mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="care@provider.in"
                    className="w-full px-3 py-2 rounded-xl border border-black/15 text-xs focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E0B1E]/60 mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 866 245 9000"
                    className="w-full px-3 py-2 rounded-xl border border-black/15 text-xs focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E0B1E]/60 mb-1">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://provider.in"
                    className="w-full px-3 py-2 rounded-xl border border-black/15 text-xs focus:outline-none focus:ring-2 focus:ring-[#6B3CFF]"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-black/10">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded text-[#6B3CFF] focus:ring-[#6B3CFF] w-4 h-4"
                  />
                  <span className="text-xs font-bold text-[#0E0B1E]">
                    {lang === 'te' ? 'డైరెక్టరీలో యాక్టివ్గా ఉంచండి' : 'Active (Listed in Directory)'}
                  </span>
                </label>

                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSample}
                    onChange={(e) => setIsSample(e.target.checked)}
                    className="rounded text-[#6B3CFF] focus:ring-[#6B3CFF] w-4 h-4"
                  />
                  <span className="text-xs font-bold text-amber-800">
                    {lang === 'te' ? 'డెమో/శాంపిల్ పార్టనర్ మార్క్ చేయండి' : 'Mark as Sample/Demo Partner'}
                  </span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-black/15 text-xs font-semibold text-[#0E0B1E] hover:bg-black/5"
                >
                  {lang === 'te' ? 'రద్దు చేయండి' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#592be0] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting && <RefreshCw size={13} className="animate-spin" />}
                  <span>{editingProvider ? 'Update Provider' : 'Create Provider'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
