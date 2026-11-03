import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Table from '../../components/ui/Table'
import StatusBadge from '../../components/ui/StatusBadge'
import {
  Users,
  Search,
  PlusCircle,
  Inbox,
  Building2,
  Calendar,
  CheckCircle2,
  X,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Info,
  Eye,
} from 'lucide-react'

export default function AffiliateLeadsPage() {
  const { user } = useAuth()
  const { lang } = useLanguage()
  const outletContext = useOutletContext()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)

  // Selected lead for detail modal
  const [selectedLead, setSelectedLead] = useState(null)

  const fetchReferrals = async () => {
    try {
      setLoading(true)
      const data = await api.getAffiliateReferrals(selectedStatus)
      setReferrals(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load referrals:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReferrals()
  }, [selectedStatus])

  const filteredReferrals = referrals.filter((item) => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return true
    return (
      (item.client_name && item.client_name.toLowerCase().includes(query)) ||
      (item.provider_name && item.provider_name.toLowerCase().includes(query)) ||
      (item.service_name && item.service_name.toLowerCase().includes(query)) ||
      (item.client_city && item.client_city.toLowerCase().includes(query)) ||
      (item.id && String(item.id).toLowerCase().includes(query))
    )
  })

  const handleOpenDrawer = () => {
    if (outletContext?.openLeadDrawer) {
      outletContext.openLeadDrawer()
    }
  }

  // Filter tab definitions
  const statusTabs = [
    { id: 'all', label: lang === 'te' ? 'అన్ని రిఫరల్స్' : 'All Referrals' },
    { id: 'pending', label: lang === 'te' ? 'పెండింగ్' : 'Pending' },
    { id: 'contacted', label: lang === 'te' ? 'సంప్రదించారు' : 'Contacted' },
    { id: 'qualified', label: lang === 'te' ? 'అర్హత పొందారు' : 'Qualified' },
    { id: 'converted', label: lang === 'te' ? 'కన్వర్ట్ అయ్యారు' : 'Converted' },
    { id: 'rejected', label: lang === 'te' ? 'తిరస్కరించబడింది' : 'Rejected' },
  ]

  const columns = [
    {
      header: lang === 'te' ? 'రిఫరెన్స్ ఐడీ' : 'Reference ID',
      key: 'id',
      render: (item) => (
        <span className="font-mono font-bold text-xs text-[#0E0B1E]">
          SBL-REF-{String(item.id || '').slice(0, 8).toUpperCase()}
        </span>
      ),
    },
    {
      header: lang === 'te' ? 'కస్టమర్ పేరు & వివరాలు' : 'Customer Name',
      key: 'client_name',
      render: (item) => (
        <div>
          <span className="font-semibold text-xs text-[#0E0B1E] block">{item.client_name}</span>
          <span className="text-[11px] text-[#575266] flex items-center gap-1 mt-0.5">
            <Phone size={10} className="text-[#575266]" />
            <span>{item.client_mobile || 'Contact on file'}</span>
          </span>
        </div>
      ),
    },
    {
      header: lang === 'te' ? 'సర్వీస్ ప్రొవైడర్' : 'Selected Provider',
      key: 'provider_name',
      render: (item) => (
        <div className="max-w-[200px]">
          <span className="font-medium text-xs text-[#0E0B1E] block truncate">
            {item.provider_name || 'Verified Provider'}
          </span>
          <span className="text-[10px] uppercase font-bold text-[#6B3CFF] tracking-wider">
            {item.service_category || 'Service'}
          </span>
        </div>
      ),
    },
    {
      header: lang === 'te' ? 'ఎంపికైన సర్వీస్' : 'Selected Service',
      key: 'service_name',
      render: (item) => (
        <span className="text-xs font-semibold text-[#0E0B1E] bg-[#6B3CFF]/5 border border-[#6B3CFF]/15 px-2.5 py-1 rounded-lg inline-block">
          {item.service_name || 'General Consultation'}
        </span>
      ),
    },
    {
      header: lang === 'te' ? 'లొకేషన్' : 'Location',
      key: 'client_city',
      render: (item) => (
        <span className="text-xs text-[#575266] font-medium flex items-center gap-1">
          <MapPin size={11} className="text-[#575266]" />
          <span>{item.client_city || 'Regional'}</span>
        </span>
      ),
    },
    {
      header: lang === 'te' ? 'సమర్పించిన తేదీ' : 'Submission Date',
      key: 'created_at',
      render: (item) => (
        <span className="text-xs text-[#575266] flex items-center gap-1">
          <Calendar size={11} className="text-[#575266]" />
          <span>{item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Today'}</span>
        </span>
      ),
    },
    {
      header: lang === 'te' ? 'రిఫరల్ స్థితి' : 'Current Status',
      key: 'status',
      render: (item) => <StatusBadge status={item.status || 'pending'} size="sm" />,
    },
    {
      header: lang === 'te' ? 'చర్య' : 'Action',
      key: 'action',
      render: (item) => (
        <button
          onClick={() => setSelectedLead(item)}
          className="p-1.5 rounded-lg hover:bg-[#6B3CFF]/10 text-[#6B3CFF] transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer"
          title="View referral details"
        >
          <Eye size={14} />
          <span>{lang === 'te' ? 'వివరాలు' : 'View'}</span>
        </button>
      ),
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E8E2D8]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#0E0B1E] tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-[#6B3CFF]" />
            <span>{lang === 'te' ? 'కస్టమర్ రిఫరల్స్ ట్రాకింగ్' : 'Customer Referrals Pipeline'}</span>
          </h1>
          <p className="text-sm text-[#575266] mt-1">
            {lang === 'te'
              ? 'మీరు పరిచయం చేసిన సంభావ్య కస్టమర్ల పురోగతి మరియు సర్వీస్ ప్రొవైడర్ ఫాలో-అప్ స్థితి.'
              : 'Track the introduction and follow-up status of customers you connected with providers in our network.'}
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={PlusCircle}
          onClick={handleOpenDrawer}
        >
          {lang === 'te' ? '+ కస్టమర్‌ను రిఫర్ చేయండి' : '+ Refer Potential Customer'}
        </Button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer border ${
                selectedStatus === tab.id
                  ? 'bg-[#0E0B1E] text-white border-[#0E0B1E] shadow-sm'
                  : 'bg-white text-[#575266] border-[#E8E2D8] hover:border-[#0E0B1E]/30 hover:text-[#0E0B1E]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#575266]" />
          <input
            type="text"
            placeholder={
              lang === 'te'
                ? 'కస్టమర్, ప్రొవైడర్, సర్వీస్ లేదా ఐడీ ద్వారా వెతకండి...'
                : 'Search by customer, provider, service...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E8E2D8] bg-white text-xs text-[#0E0B1E] placeholder-[#575266]/60 outline-none focus:ring-2 focus:ring-[#6B3CFF]"
          />
        </div>
      </div>

      {/* Leads Table & Empty State */}
      {filteredReferrals.length === 0 && !loading ? (
        <Card padding="p-12" variant="surface" className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#6B3CFF]/10 text-[#6B3CFF] flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold font-serif text-[#0E0B1E]">
            {lang === 'te' ? 'రిఫరల్స్ ఏవీ కనుగొనబడలేదు' : 'No customer referrals found'}
          </h3>
          <p className="text-xs text-[#575266] max-w-md mx-auto mt-1 mb-6 leading-relaxed">
            {selectedStatus !== 'all'
              ? `There are no referrals currently in "${selectedStatus}" status.`
              : 'You have not referred any potential customers yet. Click below to refer someone who needs a verified service.'}
          </p>
          <Button
            variant="primary"
            size="md"
            leftIcon={PlusCircle}
            onClick={handleOpenDrawer}
          >
            {lang === 'te' ? '+ కస్టమర్‌ను రిఫర్ చేయండి' : '+ Refer a Customer'}
          </Button>
        </Card>
      ) : (
        <div className="bg-white rounded-2xl border border-[#12101F]/10 overflow-hidden shadow-sm">
          <Table
            columns={columns}
            data={filteredReferrals}
            emptyMessage={lang === 'te' ? 'రిఫరల్స్ ఏవీ లేవు.' : 'No customer referrals found.'}
          />
        </div>
      )}

      {/* READ-ONLY REFERRAL DETAIL MODAL FOR AFFILIATE */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-[#12101F]/10 shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[#FAF7F2] border-b border-[#12101F]/10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#6B3CFF] uppercase tracking-wider block">
                  SBL-REF-{String(selectedLead.id).slice(0, 8).toUpperCase()}
                </span>
                <h3 className="text-lg font-bold font-serif text-[#0E0B1E]">
                  {selectedLead.client_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[#575266] font-medium block">
                    {lang === 'te' ? 'సర్వీస్ ప్రొవైడర్' : 'Selected Provider'}
                  </span>
                  <span className="font-semibold text-[#0E0B1E] text-sm block">
                    {selectedLead.provider_name || 'Verified Provider'}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#6B3CFF]">
                    {selectedLead.service_category}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[#575266] font-medium block">
                    {lang === 'te' ? 'ఎంపికైన సర్వీస్' : 'Selected Service'}
                  </span>
                  <span className="font-semibold text-[#0E0B1E] text-sm block">
                    {selectedLead.service_name || 'General Consultation'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#12101F]/10">
                <div className="space-y-1">
                  <span className="text-[#575266] font-medium block">
                    {lang === 'te' ? 'కస్టమర్ మొబైల్' : 'Customer Mobile'}
                  </span>
                  <span className="font-semibold text-[#0E0B1E] flex items-center gap-1.5">
                    <Phone size={12} className="text-[#6B3CFF]" />
                    <span>{selectedLead.client_mobile}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[#575266] font-medium block">
                    {lang === 'te' ? 'కస్టమర్ ఇమెయిల్' : 'Customer Email'}
                  </span>
                  <span className="font-semibold text-[#0E0B1E] flex items-center gap-1.5">
                    <Mail size={12} className="text-[#6B3CFF]" />
                    <span>{selectedLead.client_email || 'Not provided'}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#12101F]/10">
                <div className="space-y-1">
                  <span className="text-[#575266] font-medium block">
                    {lang === 'te' ? 'ప్రాంతం / నగరం' : 'Customer Location'}
                  </span>
                  <span className="font-semibold text-[#0E0B1E] flex items-center gap-1.5">
                    <MapPin size={12} className="text-[#6B3CFF]" />
                    <span>{selectedLead.client_city}</span>
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-[#575266] font-medium block">
                    {lang === 'te' ? 'ప్రస్తుత స్థితి' : 'Current Status'}
                  </span>
                  <div>
                    <StatusBadge status={selectedLead.status} size="sm" />
                  </div>
                </div>
              </div>

              {selectedLead.context_note && (
                <div className="pt-3 border-t border-[#12101F]/10 space-y-1">
                  <span className="text-[#575266] font-medium block">
                    {lang === 'te' ? 'కస్టమర్ అవసర వివరాలు' : 'Customer Requirement Description'}
                  </span>
                  <p className="p-3 rounded-xl bg-[#FAF7F2] border border-[#12101F]/10 text-[#0E0B1E] leading-relaxed">
                    {selectedLead.context_note}
                  </p>
                </div>
              )}

              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/60 text-[11px] text-purple-900 flex items-start gap-2">
                <Info size={14} className="text-[#6B3CFF] shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  {lang === 'te'
                    ? 'ఈ కస్టమర్ రిఫరల్ లాక్ చేయబడింది. ప్రొవైడర్ అట్రిబ్యూషన్ లేదా స్థితి మార్పులు కేవలం నిర్వాహకుల ద్వారా మాత్రమే ప్రాసెస్ చేయబడతాయి.'
                    : 'This referral is securely attributed under sBLOOM rules. Provider attribution and lifecycle progression are verified directly.'}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-[#FAF7F2] border-t border-[#12101F]/10 flex justify-end">
              <Button variant="outline" size="sm" onClick={() => setSelectedLead(null)}>
                {lang === 'te' ? 'మూసివేయి' : 'Close'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
