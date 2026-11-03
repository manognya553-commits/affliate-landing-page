import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import { getPortalText } from '../../i18n/portalTranslations'
import LeadDrawer from '../features/LeadDrawer'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Wallet,
  FileText,
  BookOpen,
  LifeBuoy,
  Settings,
  PlusCircle,
  Copy,
  Check,
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
  LogOut,
  ExternalLink,
  Sparkles,
  Globe,
} from 'lucide-react'

export default function AffiliateLayout() {
  const { profile, user, signOut, role, apiHealth } = useAuth()
  const { lang, setLang } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()

  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [copiedId, setCopiedId] = useState(false)

  // Global Lead Drawer state accessible by all child pages via useOutletContext
  const [isLeadDrawerOpen, setIsLeadDrawerOpen] = useState(false)
  const [drawerInitialService, setDrawerInitialService] = useState(null)

  const openLeadDrawer = (serviceId = null) => {
    setDrawerInitialService(serviceId)
    setIsLeadDrawerOpen(true)
  }

  const t = (path) => getPortalText(lang, path)

  const handleSignOut = async () => {
    await signOut()
    navigate('/app/login')
  }

  const partnerId = `SBL-${(user?.id || '882199').slice(0, 8).toUpperCase()}`

  const copyAffiliateLink = () => {
    const link = `${window.location.origin}/?ref=${partnerId}`
    navigator.clipboard.writeText(link)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2200)
  }

  const copyPartnerId = () => {
    navigator.clipboard.writeText(partnerId)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2200)
  }

  // Complete 8-route Navigation Inventory
  const navItems = [
    {
      to: '/app',
      label: lang === 'te' ? 'డాష్‌బోర్డ్' : 'Dashboard',
      end: true,
      icon: LayoutDashboard,
    },
    {
      to: '/app/services',
      label: lang === 'te' ? 'సర్వీసెస్ కేటలాగ్' : 'Services Catalog',
      icon: Briefcase,
    },
    {
      to: '/app/leads',
      label: lang === 'te' ? 'లీడ్స్ పైప్‌లైన్' : 'Leads Pipeline',
      icon: Users,
    },
    {
      to: '/app/earnings',
      label: lang === 'te' ? 'కమీషన్ లెడ్జర్' : 'Commission Ledger',
      icon: Wallet,
    },
    {
      to: '/app/invoices',
      label: lang === 'te' ? 'పన్ను రసీదులు' : 'Tax Invoices',
      icon: FileText,
    },
    {
      to: '/app/learn',
      label: lang === 'te' ? 'పార్ట్‌నర్ అకాడమీ' : 'Enablement Academy',
      icon: BookOpen,
    },
    {
      to: '/app/support',
      label: lang === 'te' ? 'సహాయ కేంద్రం' : 'Help & Support',
      icon: LifeBuoy,
    },
    {
      to: '/app/profile',
      label: lang === 'te' ? 'ప్రొఫైల్ & సెట్టింగ్స్' : 'Profile & Settings',
      icon: Settings,
    },
  ]

  // Breadcrumb path calculation
  const getBreadcrumb = () => {
    if (location.pathname === '/app') return lang === 'te' ? 'డాష్‌బోర్డ్' : 'Dashboard'
    if (location.pathname.startsWith('/app/services')) return lang === 'te' ? 'సర్వీసెస్ కేటలాగ్' : 'Services Catalog'
    if (location.pathname.startsWith('/app/leads')) return lang === 'te' ? 'లీడ్స్ పైప్‌లైన్' : 'Leads Pipeline'
    if (location.pathname.startsWith('/app/earnings')) return lang === 'te' ? 'కమీషన్ లెడ్జర్' : 'Commission Ledger'
    if (location.pathname.startsWith('/app/invoices')) return lang === 'te' ? 'పన్ను రసీదులు' : 'Tax Invoices'
    if (location.pathname.startsWith('/app/learn')) return lang === 'te' ? 'పార్ట్‌నర్ అకాడమీ' : 'Enablement Academy'
    if (location.pathname.startsWith('/app/support')) return lang === 'te' ? 'సహాయ కేంద్రం' : 'Help & Support'
    if (location.pathname.startsWith('/app/profile')) return lang === 'te' ? 'ప్రొఫైల్ & సెట్టింగ్స్' : 'Profile & Settings'
    return 'Dashboard'
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0E0B1E] flex flex-col md:flex-row antialiased font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#0E0B1E] text-white min-h-screen sticky top-0 h-screen select-none border-r border-white/10 z-30 shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group no-underline">
            <div className="w-9 h-9 rounded-xl bg-[#6B3CFF] flex items-center justify-center font-black text-white text-base shadow-md shadow-[#6B3CFF]/40 group-hover:scale-105 transition-transform">
              sB
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-white leading-none">
                sBLOOM
              </span>
              <span className="text-[10px] font-bold text-[#D6F36B] tracking-wider uppercase mt-1">
                Affiliate Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Section title & Navigation */}
        <div className="flex-1 px-4 py-5 overflow-y-auto space-y-4">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 px-3 mb-2.5">
              Partner Workspace
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs lg:text-sm font-semibold transition-all no-underline ${
                        isActive
                          ? 'bg-[#6B3CFF] text-white shadow-md shadow-[#6B3CFF]/30 font-bold'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <Icon size={17} className="shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                )
              })}
            </nav>
          </div>

          {/* Quick Refer Action inside Sidebar */}
          <div className="pt-2 px-1">
            <button
              type="button"
              onClick={() => openLeadDrawer()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#D6F36B] hover:bg-[#B8DB3D] text-[#0E0B1E] text-xs font-bold transition-all shadow-sm cursor-pointer border-none"
            >
              <PlusCircle size={15} />
              <span>+ Refer Client Lead</span>
            </button>
          </div>
        </div>

        {/* Bottom Partner ID Badge Card */}
        <div className="p-4 border-t border-white/10 bg-[#0E0B1E]">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-white/60">
                Partner Code
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Active
              </span>
            </div>

            <div className="font-mono text-xs font-bold text-white tracking-wide bg-black/40 px-3 py-1.5 rounded-xl border border-white/10 flex items-center justify-between">
              <span>{partnerId}</span>
              <button
                type="button"
                onClick={copyPartnerId}
                title="Copy Partner ID"
                className="text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
              >
                {copiedId ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>

            <p className="text-[10px] text-white/40 m-0 leading-tight">
              60-day attribution lock attached to client deals.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-[#12101F]/10 px-4 sm:px-6 py-3 flex items-center justify-between shadow-2xs">
          {/* Mobile brand + hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-black/10 text-[#0E0B1E] bg-white cursor-pointer"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#6B3CFF] flex items-center justify-center font-black text-white text-xs">
                sB
              </div>
              <span className="font-bold text-base text-[#0E0B1E]">sBLOOM</span>
            </div>
          </div>

          {/* Desktop Breadcrumbs */}
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-[#12101F]/60">
            <span>Portal</span>
            <span>/</span>
            <span className="font-bold text-[#0E0B1E]">{getBreadcrumb()}</span>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5">
            {/* Global Refer Client CTA */}
            <button
              type="button"
              onClick={() => openLeadDrawer()}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6B3CFF] hover:bg-[#582CD6] text-white text-xs font-bold transition-all shadow-xs shadow-[#6B3CFF]/30 cursor-pointer border-none"
            >
              <PlusCircle size={14} />
              <span>+ Refer Client</span>
            </button>

            {/* Real Latency / API Live Indicator */}
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                apiHealth.online
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-red-50 text-red-800 border-red-200'
              }`}
              title={`Database Status: ${apiHealth.db || 'unreachable'}`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  apiHealth.online ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                }`}
              />
              <span className="text-[11px]">
                {apiHealth.online
                  ? `API ${apiHealth.latencyMs}ms`
                  : 'API Offline'}
              </span>
            </div>

            {/* Copy Affiliate Link Button */}
            <button
              type="button"
              onClick={copyAffiliateLink}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#12101F]/15 bg-white hover:bg-black/5 text-xs font-semibold text-[#0E0B1E] transition-all cursor-pointer shadow-2xs"
            >
              {copiedLink ? (
                <>
                  <Check size={13} className="text-emerald-600" />
                  <span className="text-emerald-600 font-bold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} className="text-[#6B3CFF]" />
                  <span>Share Link</span>
                </>
              )}
            </button>

            {/* Language Switcher */}
            <div className="flex items-center bg-[#F3ECE1] border border-[#E8E2D8] rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                  lang === 'en'
                    ? 'bg-white text-[#12101F] shadow-2xs'
                    : 'text-[#575266] hover:text-[#12101F] bg-transparent'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('te')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border-none cursor-pointer ${
                  lang === 'te'
                    ? 'bg-white text-[#12101F] shadow-2xs'
                    : 'text-[#575266] hover:text-[#12101F] bg-transparent'
                }`}
              >
                తెలుగు
              </button>
            </div>

            {/* Draft Telugu indicator */}
            {lang === 'te' && (
              <span className="hidden xl:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Draft Telugu UI
              </span>
            )}

            {/* Switch to Admin if admin role */}
            {role === 'admin' && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-purple-50 text-[#6B3CFF] border border-purple-200 text-xs font-bold hover:bg-purple-100 transition-colors no-underline"
              >
                <ShieldAlert size={14} />
                <span>Admin Console</span>
              </Link>
            )}

            {/* User Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-black/5 transition-colors cursor-pointer border-none bg-transparent"
              >
                <div className="w-8 h-8 rounded-full bg-[#6B3CFF] text-white flex items-center justify-center font-bold text-xs">
                  {(profile?.full_name || user?.email || 'P')[0].toUpperCase()}
                </div>
                <ChevronDown size={14} className="text-[#575266]" />
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-[#E8E2D8] shadow-xl p-2 z-50 text-xs animate-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-[#E8E2D8]">
                    <p className="font-bold text-[#12101F] truncate">
                      {profile?.full_name || 'Partner Account'}
                    </p>
                    <p className="text-[11px] text-[#575266] truncate">{user?.email}</p>
                    <span className="inline-block mt-1 font-mono font-bold text-[10px] text-[#6B3CFF] bg-[#6B3CFF]/10 px-2 py-0.5 rounded-md">
                      {partnerId}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/app/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#12101F] hover:bg-[#FAF7F2] no-underline font-medium"
                    >
                      <Settings size={14} className="text-[#575266]" />
                      <span>Profile & Settings</span>
                    </Link>

                    <Link
                      to="/app/support"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#12101F] hover:bg-[#FAF7F2] no-underline font-medium"
                    >
                      <LifeBuoy size={14} className="text-[#575266]" />
                      <span>Help & Support</span>
                    </Link>

                    <Link
                      to="/"
                      target="_blank"
                      onClick={() => setProfileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-[#12101F] hover:bg-[#FAF7F2] no-underline font-medium"
                    >
                      <ExternalLink size={14} className="text-[#575266]" />
                      <span>Public Landing Page</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-[#E8E2D8]">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-left cursor-pointer border-none bg-transparent font-medium"
                    >
                      <LogOut size={14} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0E0B1E] text-white border-b border-white/10 p-4 space-y-2 z-30">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all no-underline ${
                        isActive
                          ? 'bg-[#6B3CFF] text-white font-bold'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </nav>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  openLeadDrawer()
                }}
                className="w-full py-2.5 rounded-xl bg-[#D6F36B] text-[#0E0B1E] text-xs font-bold"
              >
                + Refer Client Lead
              </button>
            </div>
          </div>
        )}

        {/* Main Routed Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {/* Global Outlet context allows any subpage to trigger openLeadDrawer(serviceId) */}
          <Outlet context={{ openLeadDrawer }} />
        </main>
      </div>

      {/* Global Slide-Over Lead Drawer */}
      <LeadDrawer
        isOpen={isLeadDrawerOpen}
        onClose={() => setIsLeadDrawerOpen(false)}
        initialServiceId={drawerInitialService}
      />
    </div>
  )
}
