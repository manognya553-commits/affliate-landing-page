import React, { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import Card from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Table from '../../components/ui/Table'
import StatusBadge from '../../components/ui/StatusBadge'
import DemoDataNotice from '../../components/ui/DemoDataNotice'
import {
  Users,
  Search,
  Filter,
  PlusCircle,
  Inbox,
  Sparkles,
  Building2,
  Calendar,
  CheckCircle2,
} from 'lucide-react'

export default function AffiliateLeadsPage() {
  const { user } = useAuth()
  const { lang } = useLanguage()
  const outletContext = useOutletContext()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [referrals, setReferrals] = useState([])
  const [loading, setLoading] = useState(true)

  const partnerCode = `SBL-${(user?.id || '882199').slice(0, 8).toUpperCase()}`

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
      (item.service_category && item.service_category.toLowerCase().includes(query)) ||
      (item.client_city && item.client_city.toLowerCase().includes(query)) ||
      (item.reference_number && item.reference_number.toLowerCase().includes(query))
    )
  })

  const handleOpenDrawer = () => {
    if (outletContext?.openLeadDrawer) {
      outletContext.openLeadDrawer()
    }
  }

  // Filter tab definitions
  const statusTabs = [
    { id: 'all', label: 'All Leads' },
    { id: 'pending', label: 'Pending' },
    { id: 'contacted', label: 'Contacted' },
    { id: 'qualified', label: 'Qualified' },
    { id: 'converted', label: 'Converted' },
    { id: 'rejected', label: 'Rejected' },
  ]

  const columns = [
    {
      header: 'Reference ID',
      key: 'id',
      render: (item) => (
        <span className="font-mono font-bold text-xs text-[#12101F]">
          {item.reference_number || `SBL-${String(item.id || '').slice(0, 6).toUpperCase()}`}
        </span>
      ),
    },
    {
      header: 'Business & Contact Person',
      key: 'client_name',
      render: (item) => (
        <div>
          <span className="font-semibold text-xs text-[#12101F] block">{item.client_name}</span>
          <span className="text-[11px] text-[#575266]">{item.client_mobile || 'Contact on file'}</span>
        </div>
      ),
    },
    {
      header: 'Location',
      key: 'client_city',
      render: (item) => (
        <span className="text-xs text-[#575266] font-medium">{item.client_city || 'Regional'}</span>
      ),
    },
    {
      header: 'Industry Sector',
      key: 'service_category',
      render: (item) => (
        <span className="text-xs capitalize font-medium text-[#12101F] bg-[#F3ECE1] px-2.5 py-1 rounded-lg border border-[#E8E2D8]">
          {item.service_category || 'Healthcare'}
        </span>
      ),
    },
    {
      header: 'Pipeline Status',
      key: 'status',
      render: (item) => <StatusBadge status={item.status || 'Pending'} size="sm" />,
    },
    {
      header: 'Est. Commission',
      key: 'commission',
      render: (item) => (
        <span className="font-bold text-xs text-[#6B3CFF]">
          {item.estimated_commission || '₹18,500 (est)'}
        </span>
      ),
    },
    {
      header: 'Submitted',
      key: 'created_at',
      render: (item) => (
        <span className="text-xs text-[#575266]">
          {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Today'}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E8E2D8]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#12101F] tracking-tight flex items-center gap-2.5">
            <Users className="w-7 h-7 text-[#6B3CFF]" />
            <span>{lang === 'te' ? 'క్లయింట్ లీడ్స్ పైప్‌లైన్' : 'Client Leads Pipeline'}</span>
          </h1>
          <p className="text-sm text-[#575266] mt-1">
            {lang === 'te'
              ? 'మీరు పరిచయం చేసిన వ్యాపారాల సంప్రదింపు పురోగతి మరియు అట్రిబ్యూషన్ స్థితి'
              : 'End-to-end lifecycle progression of client introductions under your 60-day attribution lock.'}
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={PlusCircle}
          onClick={handleOpenDrawer}
        >
          + Refer New Client
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
                  ? 'bg-[#12101F] text-white border-[#12101F] shadow-xs'
                  : 'bg-white text-[#575266] border-[#E8E2D8] hover:border-[#12101F]/30 hover:text-[#12101F]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#575266]" />
          <input
            type="text"
            placeholder="Search by client, city, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E8E2D8] bg-white text-xs text-[#12101F] placeholder-[#575266]/60 outline-none focus:ring-2 focus:ring-[#6B3CFF]"
          />
        </div>
      </div>

      {/* Leads Table & Honest Empty State */}
      {filteredReferrals.length === 0 && !loading ? (
        <Card padding="p-12" variant="surface" className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#6B3CFF]/10 text-[#6B3CFF] flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold font-serif text-[#12101F]">
            No client leads found
          </h3>
          <p className="text-xs text-[#575266] max-w-md mx-auto mt-1 mb-6 leading-relaxed">
            {selectedStatus !== 'all'
              ? `There are no leads currently in "${selectedStatus}" status.`
              : 'You have not referred any clients yet. Submit your first client introduction using the Lead Drawer.'}
          </p>
          <Button
            variant="primary"
            size="md"
            leftIcon={PlusCircle}
            onClick={handleOpenDrawer}
          >
            + Refer a Client Now
          </Button>
        </Card>
      ) : (
        <Table
          columns={columns}
          data={filteredReferrals}
          emptyMessage="No referral leads found."
        />
      )}

      <DemoDataNotice />
    </div>
  )
}
