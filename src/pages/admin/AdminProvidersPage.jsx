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
  Trash2,
  Layers,
  Info,
  Check,
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

  // Provider Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProvider, setEditingProvider] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  // Provider Form Fields
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

  // ============================================================================
  // SERVICES MANAGEMENT MODAL STATE
  // ============================================================================
  const [servicesModalOpen, setServicesModalOpen] = useState(false)
  const [activeProviderForServices, setActiveProviderForServices] = useState(null)
  const [providerServices, setProviderServices] = useState([])
  const [loadingServices, setLoadingServices] = useState(false)
  const [servicesError, setServicesError] = useState('')
  const [servicesSuccess, setServicesSuccess] = useState('')

  // Add / Edit Individual Service Form Modal State
  const [serviceFormModalOpen, setServiceFormModalOpen] = useState(false)
  const [editingService, setEditingService] = useState(null)
  const [savingService, setSavingService] = useState(false)
  const [serviceFormError, setServiceFormError] = useState('')

  const [serviceName, setServiceName] = useState('')
  const [serviceDescription, setServiceDescription] = useState('')
  const [reqDescRequired, setReqDescRequired] = useState(false)
  const [serviceInstructions, setServiceInstructions] = useState('')
  const [serviceIsActive, setServiceIsActive] = useState(true)

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

  // ============================================================================
  // SERVICES MANAGEMENT HANDLERS
  // ============================================================================
  const loadProviderServices = async (providerId) => {
    try {
      setLoadingServices(true)
      setServicesError('')
      const data = await api.getAdminProviderServices(providerId)
      setProviderServices(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load provider services:', err)
      setServicesError(err.message || 'Failed to load provider services.')
    } finally {
      setLoadingServices(false)
    }
  }

  const handleOpenServicesModal = (prov) => {
    setActiveProviderForServices(prov)
    setServicesSuccess('')
    setServicesError('')
    setServicesModalOpen(true)
    loadProviderServices(prov.id)
  }

  const handleOpenAddService = () => {
    setEditingService(null)
    setServiceName('')
    setServiceDescription('')
    setReqDescRequired(false)
    setServiceInstructions('')
    setServiceIsActive(true)
    setServiceFormError('')
    setServiceFormModalOpen(true)
  }

  const handleOpenEditService = (srv) => {
    setEditingService(srv)
    setServiceName(srv.service_name)
    setServiceDescription(srv.description)
    setReqDescRequired(srv.requirement_description_required)
    setServiceInstructions(srv.instructions || '')
    setServiceIsActive(srv.is_active)
    setServiceFormError('')
    setServiceFormModalOpen(true)
  }

  const handleSaveService = async (e) => {
    e.preventDefault()
    if (!activeProviderForServices) return

    setSavingService(true)
    setServiceFormError('')

    const payload = {
      service_name: serviceName.trim(),
      description: serviceDescription.trim(),
      requirement_description_required: reqDescRequired,
      instructions: serviceInstructions.trim() || null,
      is_active: serviceIsActive,
    }

    try {
      if (editingService) {
        await api.updateAdminProviderService(activeProviderForServices.id, editingService.id, payload)
        setServicesSuccess(`Service "${payload.service_name}" updated successfully.`)
      } else {
        await api.createAdminProviderService(activeProviderForServices.id, payload)
        setServicesSuccess(`Service "${payload.service_name}" added successfully.`)
      }
      setServiceFormModalOpen(false)
      loadProviderServices(activeProviderForServices.id)
      loadProviders() // refresh provider service counts in main table
    } catch (err) {
      setServiceFormError(err.message || 'Failed to save service.')
    } finally {
      setSavingService(false)
    }
  }

  const handleToggleServiceActive = async (srv) => {
    if (!activeProviderForServices) return
    try {
      await api.toggleAdminProviderServiceActive(activeProviderForServices.id, srv.id)
      setServicesSuccess(`Service "${srv.service_name}" status toggled.`)
      loadProviderServices(activeProviderForServices.id)
      loadProviders()
    } catch (err) {
      setServicesError(err.message || 'Failed to toggle service status.')
    }
  }

  const handleDeleteService = async (srv) => {
    if (!activeProviderForServices) return
    if (!window.confirm(`Are you sure you want to delete service "${srv.service_name}"?`)) {
      return
    }

    try {
      await api.deleteAdminProviderService(activeProviderForServices.id, srv.id)
      setServicesSuccess(`Service "${srv.service_name}" deleted successfully.`)
      loadProviderServices(activeProviderForServices.id)
      loadProviders()
    } catch (err) {
      setServicesError(err.message || 'Failed to delete service.')
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
    <div className="space-y-6 animate-in fade-in duration-200 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-black/10 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#6B3CFF]">
            {lang === 'te' ? 'ప్రొవైడర్ & సర్వీసెస్ డైరెక్టరీ' : 'Directory & Service Management'}
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#0E0B1E] tracking-tight mt-1">
            {lang === 'te' ? 'సేవా ప్రొవైడర్ల కేటలాగ్' : 'Service Providers Directory'}
          </h1>
          <p className="text-sm text-[#0E0B1E]/70 max-w-2xl mt-1 leading-relaxed">
            {lang === 'te'
              ? 'ప్రొవైడర్లను మరియు ప్రతి ప్రొవైడర్ కింద బహుళ సేవలను జోడించండి, సవరించండి మరియు కాన్ఫిగర్ చేయండి.'
              : 'Manage accredited service providers and configure individual services, requirement rules, and instructions.'}
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
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
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
            className="text-rose-700 hover:text-rose-900 cursor-pointer"
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
              className="px-3 py-2 rounded-xl border border-black/15 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] bg-white cursor-pointer"
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
              className="px-3 py-2 rounded-xl border border-black/15 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#6B3CFF] bg-white cursor-pointer"
            >
              <option value="all">{lang === 'te' ? 'అన్నీ' : 'All Status'}</option>
              <option value="active">{lang === 'te' ? 'యాక్టివ్' : 'Active Only'}</option>
              <option value="inactive">{lang === 'te' ? 'నిష్క్రియం' : 'Inactive Only'}</option>
            </select>
          </div>

          <button
            type="button"
            onClick={loadProviders}
            className="p-2.5 rounded-xl border border-black/10 hover:bg-black/5 text-[#0E0B1E] transition-colors cursor-pointer"
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
                <th className="py-4 px-6">{lang === 'te' ? 'ప్రొవైడర్' : 'Provider'}</th>
                <th className="py-4 px-6">{lang === 'te' ? 'రంగం' : 'Sector'}</th>
                <th className="py-4 px-6">{lang === 'te' ? 'నగరం' : 'Location'}</th>
                <th className="py-4 px-6">{lang === 'te' ? 'సేవలు' : 'Services'}</th>
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
                providers.map((prov) => {
                  const servicesCount = Array.isArray(prov.services) ? prov.services.length : 0

                  return (
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

                      {/* Services column with quick count and direct manage action */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenServicesModal(prov)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#6B3CFF]/20 bg-[#6B3CFF]/5 hover:bg-[#6B3CFF]/15 text-[#6B3CFF] text-xs font-bold transition-all cursor-pointer"
                        >
                          <Layers size={13} />
                          <span>{servicesCount} {servicesCount === 1 ? 'Service' : 'Services'}</span>
                          <span className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-[#6B3CFF]/20">
                            {lang === 'te' ? 'నిర్వహించు' : 'Manage'}
                          </span>
                        </button>
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
                            onClick={() => handleOpenServicesModal(prov)}
                            className="p-1.5 rounded-lg border border-[#6B3CFF]/30 text-[#6B3CFF] hover:bg-[#6B3CFF]/10 transition-colors cursor-pointer"
                            title="Manage Services"
                          >
                            <Layers size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(prov)}
                            className="p-1.5 rounded-lg border border-black/10 hover:bg-black/5 text-[#0E0B1E] transition-colors cursor-pointer"
                            title="Edit Provider"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleActive(prov)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
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
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* SERVICES MANAGEMENT MODAL FOR SELECTED PROVIDER */}
      {/* ==================================================================== */}
      {servicesModalOpen && activeProviderForServices && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-black/10 shadow-2xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-black/10 pb-4 mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B3CFF]">
                    {lang === 'te' ? 'సేవల నిర్వహణ' : 'Provider Services Management'}
                  </span>
                  {getSectorBadge(activeProviderForServices.sector)}
                </div>
                <h2 className="text-xl font-bold text-[#0E0B1E] mt-1">
                  {activeProviderForServices.name}
                </h2>
                <p className="text-xs text-[#0E0B1E]/60 mt-0.5">
                  {lang === 'te'
                    ? 'ఈ ప్రొవైడర్ కింద బహుళ సేవలను జోడించండి, సవరించండి మరియు వివరణ అవసరాన్ని కాన్ఫిగర్ చేయండి.'
                    : 'Manage multiple services offered by this provider. Configure requirement rules and affiliate instructions.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenAddService}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#592be0] transition-colors shadow-sm cursor-pointer"
                >
                  <Plus size={14} />
                  <span>{lang === 'te' ? '+ కొత్త సర్వీస్' : '+ Add Service'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setServicesModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-black/5 text-[#0E0B1E]/60 hover:text-[#0E0B1E] cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Alerts */}
            {servicesSuccess && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
                <span>{servicesSuccess}</span>
                <button type="button" onClick={() => setServicesSuccess('')} className="cursor-pointer">
                  <X size={14} />
                </button>
              </div>
            )}
            {servicesError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
                <span>{servicesError}</span>
                <button type="button" onClick={() => setServicesError('')} className="cursor-pointer">
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Services List */}
            {loadingServices ? (
              <div className="py-12 text-center text-xs text-[#0E0B1E]/60">
                <RefreshCw size={20} className="animate-spin mx-auto text-[#6B3CFF] mb-2" />
                <span>Loading services...</span>
              </div>
            ) : providerServices.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-black/10 rounded-2xl p-6">
                <Layers size={32} className="mx-auto text-black/20 mb-2" />
                <h4 className="font-bold text-sm text-[#0E0B1E]">No services listed yet</h4>
                <p className="text-xs text-[#0E0B1E]/60 max-w-sm mx-auto mt-1 mb-4">
                  This provider currently has no services. Add the first service to allow affiliates to submit referrals for this provider.
                </p>
                <button
                  type="button"
                  onClick={handleOpenAddService}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#592be0] transition-colors cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add First Service</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {providerServices.map((srv) => (
                  <div
                    key={srv.id}
                    className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                      srv.is_active
                        ? 'border-black/10 bg-[#FAF7F2]/50 hover:bg-white'
                        : 'border-black/10 bg-gray-50 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-[#0E0B1E]">
                            {srv.service_name}
                          </h4>
                          {srv.is_active ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Active
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                              Inactive
                            </span>
                          )}
                          {srv.requirement_description_required ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                              Description Mandatory
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600">
                              Description Optional
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-[#0E0B1E]/70 mt-1 leading-relaxed">
                          {srv.description}
                        </p>
                      </div>

                      {/* Service Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleOpenEditService(srv)}
                          className="p-1.5 rounded-lg border border-black/10 hover:bg-black/5 text-[#0E0B1E] transition-colors cursor-pointer"
                          title="Edit Service"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleServiceActive(srv)}
                          className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                            srv.is_active
                              ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                          title={srv.is_active ? 'Deactivate Service' : 'Activate Service'}
                        >
                          <Power size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteService(srv)}
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Service"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Affiliate Instructions Box */}
                    {srv.instructions && (
                      <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200/60 text-xs text-purple-950 flex items-start gap-2">
                        <Info size={14} className="text-[#6B3CFF] shrink-0 mt-0.5" />
                        <div className="leading-relaxed">
                          <span className="font-bold text-[#6B3CFF]">Affiliate Instructions: </span>
                          {srv.instructions}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ADD / EDIT INDIVIDUAL SERVICE FORM MODAL */}
      {/* ==================================================================== */}
      {serviceFormModalOpen && activeProviderForServices && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl border border-black/10 shadow-2xl max-w-lg w-full p-6 sm:p-7">
            <div className="flex items-center justify-between border-b border-black/10 pb-3.5 mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B3CFF]">
                  {activeProviderForServices.name}
                </span>
                <h3 className="text-lg font-bold text-[#0E0B1E]">
                  {editingService ? 'Edit Service' : 'Add New Service'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setServiceFormModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-black/5 text-[#0E0B1E]/60 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {serviceFormError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {serviceFormError}
              </div>
            )}

            <form onSubmit={handleSaveService} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#0E0B1E] block mb-1">
                  Service Name *
                </label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Specialist Cardiology Review"
                  className="w-full px-3 py-2 rounded-xl border border-black/15 text-xs focus:ring-2 focus:ring-[#6B3CFF] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#0E0B1E] block mb-1">
                  Service Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={serviceDescription}
                  onChange={(e) => setServiceDescription(e.target.value)}
                  placeholder="Briefly describe what this service provides..."
                  className="w-full p-2.5 rounded-xl border border-black/15 text-xs focus:ring-2 focus:ring-[#6B3CFF] outline-none resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="font-bold text-[#0E0B1E] block mb-1">
                  Instructions for Affiliates (Optional)
                </label>
                <textarea
                  rows={2}
                  value={serviceInstructions}
                  onChange={(e) => setServiceInstructions(e.target.value)}
                  placeholder="Guidelines or requirements affiliates see when submitting this referral (e.g. mention if patient has previous clinical history)..."
                  className="w-full p-2.5 rounded-xl border border-black/15 text-xs focus:ring-2 focus:ring-[#6B3CFF] outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-black/10">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={reqDescRequired}
                    onChange={(e) => setReqDescRequired(e.target.checked)}
                    className="w-4 h-4 text-[#6B3CFF] rounded border-gray-300 focus:ring-[#6B3CFF] mt-0.5 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-[#0E0B1E] block">
                      Customer Requirement Description is Mandatory
                    </span>
                    <span className="text-[11px] text-[#0E0B1E]/60 block leading-relaxed">
                      When checked, the affiliate must provide at least 10 characters detailing the customer's requirement.
                    </span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
                  <input
                    type="checkbox"
                    checked={serviceIsActive}
                    onChange={(e) => setServiceIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#6B3CFF] rounded border-gray-300 focus:ring-[#6B3CFF] cursor-pointer"
                  />
                  <span className="font-bold text-[#0E0B1E]">
                    Service is Active and Publicly Referable
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setServiceFormModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-black/15 text-xs font-semibold hover:bg-black/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingService}
                  className="px-5 py-2 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#592be0] transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {savingService ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* ADD / EDIT PROVIDER MODAL */}
      {/* ==================================================================== */}
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
                className="p-2 rounded-xl hover:bg-black/5 text-[#0E0B1E]/60 hover:text-[#0E0B1E] cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {formError && (
              <div className="p-4 mb-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#0E0B1E] block mb-1">
                    Provider / Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Apex Multi-Specialty Care Network"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-xs focus:ring-2 focus:ring-[#6B3CFF] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0E0B1E] block mb-1">
                    Approved Sector *
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-xs focus:ring-2 focus:ring-[#6B3CFF] outline-none bg-white cursor-pointer"
                  >
                    <option value="healthcare">Healthcare & Clinics</option>
                    <option value="education">Education & Coaching</option>
                    <option value="professional">Professional & Financial Services</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-[#0E0B1E] block mb-1">
                  Primary Service Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  value={serviceTitle}
                  onChange={(e) => setServiceTitle(e.target.value)}
                  placeholder="e.g. Tertiary Specialist Care & Diagnostics"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-xs focus:ring-2 focus:ring-[#6B3CFF] outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-[#0E0B1E] block mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive description of the provider's facilities, services, and reputation..."
                  className="w-full p-3 rounded-xl border border-black/15 text-xs focus:ring-2 focus:ring-[#6B3CFF] outline-none resize-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#0E0B1E] block mb-1">
                    City / Primary Base *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Vijayawada / Hyderabad / Visakhapatnam"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-xs focus:ring-2 focus:ring-[#6B3CFF] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0E0B1E] block mb-1">
                    Area / Locality
                  </label>
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    placeholder="e.g. Suryaraopet / Madhapur"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-xs focus:ring-2 focus:ring-[#6B3CFF] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-[#0E0B1E] block mb-1">
                  Compensation Terms Description *
                </label>
                <input
                  type="text"
                  required
                  value={compensationTerms}
                  onChange={(e) => setCompensationTerms(e.target.value)}
                  placeholder="e.g. Provider sets terms. Verification window: 14 business days."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-xs focus:ring-2 focus:ring-[#6B3CFF] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-[#0E0B1E] block mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="partner@provider.in"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-xs focus:ring-2 focus:ring-[#6B3CFF] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0E0B1E] block mb-1">
                    Contact Phone
                  </label>
                  <input
                    type="text"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 866 245 9000"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-xs focus:ring-2 focus:ring-[#6B3CFF] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#0E0B1E] block mb-1">
                    Website URL
                  </label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-black/15 text-xs focus:ring-2 focus:ring-[#6B3CFF] outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-black/10">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-[#6B3CFF] rounded border-gray-300 focus:ring-[#6B3CFF] cursor-pointer"
                  />
                  <span className="font-bold text-[#0E0B1E]">Active in Directory</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isSample}
                    onChange={(e) => setIsSample(e.target.checked)}
                    className="w-4 h-4 text-[#6B3CFF] rounded border-gray-300 focus:ring-[#6B3CFF] cursor-pointer"
                  />
                  <span className="font-semibold text-[#0E0B1E]/70">Mark as Sample Demonstration Provider</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-black/15 text-xs font-semibold hover:bg-black/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#6B3CFF] text-white text-xs font-bold hover:bg-[#592be0] transition-colors shadow-md shadow-[#6B3CFF]/30 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingProvider ? 'Update Provider' : 'Create Provider'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
