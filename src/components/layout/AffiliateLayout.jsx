import React, { useState } from 'react'
import { NavLink, Outlet, useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useLanguage } from '../../context/useLanguage'
import { getPortalText } from '../../i18n/portalTranslations'
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Settings,
  Copy,
  Check,
  ShieldAlert,
  ChevronDown,
  Menu,
  X,
  Radio,
  LogOut,
  ExternalLink,
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

  const navItems = [
    {
      to: '/app',
      label: t('shell.nav.dashboard'),
      end: true,
      icon: LayoutDashboard,
    },
    {
      to: '/app/services',
      label: t('shell.nav.services'),
      icon: Briefcase,
    },
    {
      to: '/app/leads',
      label: t('shell.nav.leads'),
      icon: Users,
    },
    {
      to: '/app/profile',
      label: t('shell.nav.profile'),
      icon: Settings,
    },
  ]

  // Breadcrumb path calculation
  const getBreadcrumb = () => {
    if (location.pathname === '/app') return t('shell.nav.dashboard')
    if (location.pathname.startsWith('/app/services')) return t('shell.nav.services')
    if (location.pathname.startsWith('/app/leads')) return t('shell.nav.leads')
    if (location.pathname.startsWith('/app/profile')) return t('shell.nav.profile')
    return t('shell.nav.dashboard')
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0E0B1E] flex flex-col md:flex-row antialiased font-sans">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-[#0E0B1E] text-white min-h-screen sticky top-0 h-screen select-none border-r border-white/10 z-30">
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
                {t('shell.brandSubtitle')}
              </span>
            </div>
          </Link>
        </div>

        {/* Section title & Navigation */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 px-3 mb-3">
            {t('shell.sidebar.partnerWorkspace')}
          </div>

          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all no-underline ${
                      isActive
                        ? 'bg-[#6B3CFF] text-white shadow-md shadow-[#6B3CFF]/30 font-bold'
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
        </div>

        {/* Bottom Partner ID Badge Card */}
        <div className="p-4 border-t border-white/10 bg-[#0E0B1E]">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-white/60">
                {t('shell.sidebar.partnerId')}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                {t('shell.sidebar.active')}
              </span>
            </div>

            <div className="font-mono text-xs font-bold text-white tracking-wide bg-black/40 px-3 py-2 rounded-xl border border-white/10 flex items-center justify-between">
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

            <p className="text-[10px] text-white/50 m-0 leading-tight">
              {t('shell.sidebar.partnerIdHelp')}
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-[#12101F]/10 px-6 py-3.5 flex items-center justify-between shadow-xs">
          {/* Mobile brand + hamburger */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-black/10 text-[#0E0B1E] bg-white cursor-pointer"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#6B3CFF] flex items-center justify-center font-black text-white text-xs">
                sB
              </div>
              <span className="font-bold text-lg text-[#0E0B1E]">sBLOOM</span>
            </div>
          </div>

          {/* Desktop Breadcrumbs */}
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-[#12101F]/60">
            <span>{t('shell.brandSubtitle')}</span>
            <span>/</span>
            <span className="font-bold text-[#0E0B1E]">{getBreadcrumb()}</span>
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3">
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
              <span>
                {apiHealth.online
                  ? `${t('shell.topbar.apiLive')} ${apiHealth.latencyMs}ms`
                  : t('shell.topbar.apiOffline')}
              </span>
            </div>

            {/* Copy Affiliate Link Button */}
            <button
              type="button"
              onClick={copyAffiliateLink}
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[#12101F]/15 bg-white hover:bg-black/5 text-xs font-semibold text-[#0E0B1E] transition-all cursor-pointer shadow-2xs"
            >
              {copiedLink ? (
                <>
                  <Check size={14} className="text-emerald-600" />
                  <span className="text-emerald-600 font-bold">{t('shell.topbar.linkCopied')}</span>
                </>
              ) : (
                <>
                  <Copy size={14} className="text-[#6B3CFF]" />
                  <span>{t('shell.topbar.copyLink')}</span>
                </>
              )}
            </button>

            {/* Switch to Admin if admin role */}
            {role === 'admin' && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-[#6B3CFF] border border-purple-200 text-xs font-bold hover:bg-purple-100 transition-colors no-underline"
              >
                <ShieldAlert size={14} />
                <span>{t('shell.topbar.switchToAdmin')}</span>
              </Link>
            )}

            {/* Language Switcher */}
            <div className="flex items-center rounded-xl bg-[#FAF7F2] p-1 border border-black/10 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`px-2.5 py-1 rounded-lg transition-colors border-none cursor-pointer ${
                  lang === 'en'
                    ? 'bg-[#6B3CFF] text-white shadow-2xs font-bold'
                    : 'bg-transparent text-[#0E0B1E]/70 hover:text-[#0E0B1E]'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang('te')}
                className={`px-2.5 py-1 rounded-lg font-telugu-sans transition-colors border-none cursor-pointer ${
                  lang === 'te'
                    ? 'bg-[#6B3CFF] text-white shadow-2xs font-bold'
                    : 'bg-transparent text-[#0E0B1E]/70 hover:text-[#0E0B1E]'
                }`}
              >
                తెలుగు
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-black/10 hover:bg-black/5 text-xs font-semibold text-[#0E0B1E] transition-colors bg-white cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#6B3CFF] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  {(profile?.full_name || user?.email || 'A')[0].toUpperCase()}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {profile?.full_name || user?.email?.split('@')[0]}
                </span>
                <ChevronDown size={14} className="text-[#0E0B1E]/50" />
              </button>

              {profileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-black/10 py-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setProfileMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-black/5">
                    <p className="text-xs font-bold text-[#0E0B1E] truncate m-0">
                      {profile?.full_name || 'Affiliate'}
                    </p>
                    <p className="text-[11px] text-[#0E0B1E]/60 truncate m-0 mt-0.5">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to="/app/profile"
                    onClick={() => setProfileMenuOpen(false)}
                    className="block px-4 py-2 text-xs font-medium text-[#0E0B1E]/80 hover:bg-black/5 hover:text-[#0E0B1E] no-underline"
                  >
                    {t('shell.topbar.profileSettings')}
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setProfileMenuOpen(false)
                      handleSignOut()
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer border-none bg-transparent"
                  >
                    <LogOut size={13} />
                    <span>{t('shell.topbar.signOut')}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0E0B1E] text-white border-b border-white/10 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold no-underline ${
                      isActive ? 'bg-[#6B3CFF] text-white' : 'text-white/70 hover:bg-white/5'
                    }`
                  }
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
            {role === 'admin' && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#D6F36B] no-underline"
              >
                <ShieldAlert size={18} />
                <span>{t('shell.topbar.switchToAdmin')}</span>
              </Link>
            )}
          </div>
        )}

        {/* Content Outlet Canvas */}
        <main className="flex-1 max-w-[1440px] w-full mx-auto p-6 md:p-8 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
