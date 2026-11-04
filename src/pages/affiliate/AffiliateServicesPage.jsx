import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { api } from '../../lib/api'
import { useLanguage } from '../../context/useLanguage'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import {
  Search,
  Filter,
  HeartPulse,
  GraduationCap,
  Building2,
  MapPin,
  Layers,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Info,
  CheckCircle2,
} from 'lucide-react'

export default function AffiliateServicesPage() {
  const { lang } = useLanguage()
  const outletContext = useOutletContext()

  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSector, setSelectedSector] = useState('all')

  const loadProviders = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getProviders({
        sector: selectedSector !== 'all' ? selectedSector : null,
        search: searchQuery.trim() || null,
      })
      setProviders(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load service providers:', err)
      setError(
        lang === 'te'
          ? 'ప్రొవైడర్ల వివరాలను లోడ్ చేయడంలో విఫలమైంది.'
          : 'Failed to load service providers.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProviders()
  }, [selectedSector])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    loadProviders()
  }

  const handleRefer = (provider, service = null) => {
    if (outletContext?.openLeadDrawer) {
      outletContext.openLeadDrawer(provider?.name || '', service?.service_name || '')
    }
  }

  const getSectorMeta = (sector) => {
    switch (sector) {
      case 'healthcare':
        return {
          label: lang === 'te' ? 'ఆరోగ్య సంరక్షణ' : 'Healthcare',
          icon: HeartPulse,
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        }
      case 'education':
        return {
          label: lang === 'te' ? 'విద్య' : 'Education',
          icon: GraduationCap,
          color: 'bg-blue-50 text-blue-700 border-blue-200',
          badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
        }
      case 'professional':
        return {
          label: lang === 'te' ? 'వృత్తిపరమైన సేవలు' : 'Professional Services',
          icon: Building2,
          color: 'bg-purple-50 text-purple-700 border-purple-200',
          badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
        }
      default:
        return {
          label: lang === 'te' ? 'సేవ' : 'Service',
          icon: Building2,
          color: 'bg-gray-50 text-gray-700 border-gray-200',
          badgeColor: 'bg-gray-50 text-gray-800 border-gray-200',
        }
    }
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-200">
      {/* 1. Header Hero Banner */}
      <div className="bg-white rounded-3xl border border-[#12101F]/10 p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#6B3CFF] via-[#8E51FF] to-[#D6F36B]" />

        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6B3CFF]/10 text-[#6B3CFF] text-xs font-bold uppercase tracking-wider">
            <ShieldCheck size={14} />
            <span>
              {lang === 'te' ? 'అధికారిక సర్వీస్ నెట్‌వర్క్' : 'Verified Service Network'}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0E0B1E] tracking-tight leading-tight m-0">
            {lang === 'te'
              ? 'ఒకే నెట్‌వర్క్ సంబంధాలు. మూడు అవకాశాల రంగాలు.'
              : 'One network of connections. Three areas of opportunity.'}
          </h1>

          <p className="text-sm sm:text-base text-[#575266] leading-relaxed m-0">
            {lang === 'te'
              ? 'ఆరోగ్య సంరక్షణ, విద్య మరియు వృత్తిపరమైన సేవల రంగాలలో ధృవీకరించబడిన ప్రొవైడర్లను చూడండి. ప్రతి ప్రొవైడర్ నిబంధనల ప్రకారం అర్హత మరియు కమీషన్ వర్తిస్తాయి.'
              : 'Explore verified providers across Healthcare, Education, and Professional Services. A referral’s eligibility and compensation depend on the relevant provider’s terms.'}
          </p>
        </div>
      </div>

      {/* 2. Search and Category Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-black/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Sector Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: lang === 'te' ? 'అన్ని రంగాలు' : 'All Sectors' },
            { id: 'healthcare', label: lang === 'te' ? 'ఆరోగ్య సంరక్షణ' : 'Healthcare' },
            { id: 'education', label: lang === 'te' ? 'విద్య' : 'Education' },
            { id: 'professional', label: lang === 'te' ? 'వృత్తిపరమైన సేవలు' : 'Professional Services' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedSector(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                selectedSector === cat.id
                  ? 'bg-[#0E0B1E] text-white border-[#0E0B1E] shadow-sm'
                  : 'bg-white text-[#575266] border-black/10 hover:border-black/30 hover:text-[#0E0B1E]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#575266]" />
          <input
            type="text"
            placeholder={
              lang === 'te'
                ? 'ప్రొవైడర్ లేదా సేవ పేరుతో వెతకండి...'
                : 'Search providers or services...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/15 text-xs text-[#0E0B1E] placeholder-[#575266]/60 outline-none focus:ring-2 focus:ring-[#6B3CFF]"
          />
        </form>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          {error}
        </div>
      )}

      {/* 3. Verified Provider Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-[#575266]">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#6B3CFF] mb-3" />
          <p className="text-sm font-semibold">
            {lang === 'te' ? 'ప్రొవైడర్లను లోడ్ చేస్తున్నాము...' : 'Loading verified providers...'}
          </p>
        </div>
      ) : providers.length === 0 ? (
        <div className="bg-white rounded-3xl border border-black/10 p-12 text-center text-[#575266]">
          <Building2 className="w-12 h-12 text-black/20 mx-auto mb-3" />
          <h3 className="font-serif text-lg font-bold text-[#0E0B1E]">
            {lang === 'te' ? 'ప్రొవైడర్లు ఏవీ కనుగొనబడలేదు' : 'No service providers found'}
          </h3>
          <p className="text-xs text-[#575266] mt-1 max-w-md mx-auto">
            {lang === 'te'
              ? 'మీ శోధన లేదా ఫిల్టర్ ప్రమాణాలను మార్చి మళ్ళీ ప్రయత్నించండి.'
              : 'Try adjusting your search criteria or select another service sector.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((prov) => {
            const meta = getSectorMeta(prov.sector)
            const SectorIcon = meta.icon
            const services = Array.isArray(prov.services) ? prov.services : []

            return (
              <Card
                key={prov.id}
                padding="p-6 sm:p-7"
                variant="surface"
                hoverable
                className="flex flex-col justify-between border-black/10 relative group"
              >
                <div className="space-y-4">
                  {/* Top Bar: Sector Badge & City */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${meta.badgeColor}`}
                    >
                      <SectorIcon size={13} />
                      <span>{meta.label}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 text-xs text-[#575266] font-medium">
                      <MapPin size={12} className="text-[#575266]/70" />
                      <span>{prov.city}</span>
                      {prov.area && <span className="text-[#575266]/40">· {prov.area}</span>}
                    </span>
                  </div>

                  {/* Provider Name & Service Title */}
                  <div>
                    <h3 className="text-lg font-bold font-serif text-[#0E0B1E] leading-snug">
                      {prov.name}
                    </h3>
                    <p className="text-xs font-semibold text-[#6B3CFF] mt-1">
                      {prov.service_title}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#575266] leading-relaxed">
                    {prov.description}
                  </p>

                  {/* Available Services List */}
                  {services.length > 0 && (
                    <div className="pt-3 border-t border-black/5 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#0E0B1E]/60 flex items-center gap-1.5">
                        <Layers size={12} />
                        <span>
                          {lang === 'te'
                            ? `లభ్యమయ్యే సేవలు (${services.length})`
                            : `Available Services (${services.length})`}
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {services.map((svc) => (
                          <div
                            key={svc.id}
                            className="p-2.5 rounded-xl bg-black/[0.02] border border-black/5 flex items-start justify-between gap-2 text-xs"
                          >
                            <div className="min-w-0">
                              <span className="font-bold text-[#0E0B1E] block truncate">
                                {svc.service_name}
                              </span>
                              {svc.description && (
                                <span className="text-[11px] text-[#575266] block line-clamp-2 mt-0.5">
                                  {svc.description}
                                </span>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-[#6B3CFF] text-[11px] shrink-0 p-1 h-auto"
                              onClick={() => handleRefer(prov, svc)}
                            >
                              {lang === 'te' ? 'రిఫర్' : 'Refer'}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Terms Note */}
                  <div className="p-3 rounded-xl bg-[#FAF7F2] border border-black/5 text-[11px] text-[#575266] flex items-start gap-2">
                    <Info size={13} className="text-[#6B3CFF] shrink-0 mt-0.5" />
                    <span>
                      {prov.compensation_terms ||
                        (lang === 'te'
                          ? 'ప్రొవైడర్ నిబంధనల ప్రకారం కమీషన్ వర్తిస్తుంది.'
                          : 'Compensation is governed by provider terms.')}
                    </span>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-5 mt-5 border-t border-black/5">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    rightIcon={ArrowRight}
                    onClick={() => handleRefer(prov)}
                  >
                    {lang === 'te' ? 'ఈ ప్రొవైడర్‌కు రిఫర్ చేయండి' : 'Refer Potential Customer'}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
