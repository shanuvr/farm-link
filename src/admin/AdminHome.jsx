import { useCallback, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FarmLinkMobileHeaderBrand, FarmLinkSidebarBrand } from '../components/FarmerIcons'
import { useDismissPopover } from '../utils/useDismissPopover'
import {
  ADMIN_PROFILE,
  INITIAL_FARMER_APPLICATIONS,
  KERALA_FILTER_DISTRICTS,
} from './adminData'
import AdminIdPreviewModal from './AdminIdPreviewModal'

function KycShieldIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function AccountUserIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.5 3.6-5.5 8-5.5s8 2 8 5.5" />
    </svg>
  )
}

function GreenCheckCircle() {
  return (
    <span className="w-4.5 h-4.5 rounded-full bg-[#2e7d32] text-white flex items-center justify-center shrink-0">
      <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  )
}

function KpiBadgeIcon({ type }) {
  if (type === 'pending') {
    return (
      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 22h14" />
        <path d="M5 2h14" />
        <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
        <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
      </svg>
    )
  }
  if (type === 'approved') {
    return (
      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    )
  }
  if (type === 'rejected') {
    return (
      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" />
        <path d="m9 9 6 6" />
      </svg>
    )
  }
  return (
    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

const APP_STATUS_BADGES = {
  pending: { label: 'Pending Review', cls: 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]' },
  approved: { label: 'Verified Farmer', cls: 'bg-[#e8f3e1] text-[#184828] border-[#cce0be]' },
  rejected: { label: 'Action Needed', cls: 'bg-[#fee2e2] text-[#991b1b] border-[#fecaca]' },
}

/**
 * Focused Farmer Approval & Admin Account Center (/admin).
 * Single-company model: one company buyer & many verified farmer suppliers.
 */
export default function AdminHome() {
  const [section, setSection] = useState('approvals') // 'approvals' | 'account'
  const [applications, setApplications] = useState(INITIAL_FARMER_APPLICATIONS)
  const [adminAccount, setAdminAccount] = useState(ADMIN_PROFILE)
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' })
  const [statusFilter, setStatusFilter] = useState('pending')
  const [districtFilter, setDistrictFilter] = useState('All Districts')
  const [search, setSearch] = useState('')
  const [inspectingApp, setInspectingApp] = useState(null)
  const [notice, setNotice] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef(null)
  const closeNotif = useCallback(() => setNotifOpen(false), [])
  useDismissPopover(notifRef, notifOpen, closeNotif)

  const pendingApps = applications.filter((a) => a.status === 'pending')
  const approvedApps = applications.filter((a) => a.status === 'approved')
  const rejectedApps = applications.filter((a) => a.status === 'rejected')

  const adminInitials = adminAccount.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('')

  const handleApproveFarmer = (appId) => {
    const target = applications.find((a) => a.id === appId)
    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? { ...a, status: 'approved', rejectReason: '', submittedAt: 'Verified just now' }
          : a
      )
    )
    if (target) {
      setNotice(`Approved & verified farmer ${target.fullName} (${target.district}).`)
    }
  }

  const handleRejectFarmer = (appId, reason) => {
    const target = applications.find((a) => a.id === appId)
    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId ? { ...a, status: 'rejected', rejectReason: reason } : a
      )
    )
    if (target) {
      setNotice(`Marked ${target.fullName} for ID re-submission: "${reason}".`)
    }
  }

  const handleSaveAccount = (e) => {
    e.preventDefault()
    setPasswordForm({ current: '', next: '', confirm: '' })
    setNotice('Admin account details saved cleanly.')
  }

  const q = search.trim().toLowerCase()
  const visibleApps = applications.filter((app) => {
    if (statusFilter !== 'all' && app.status !== statusFilter) return false
    if (districtFilter !== 'All Districts' && app.district !== districtFilter) return false
    if (q) {
      const hay = `${app.fullName} ${app.phone} ${app.district} ${app.village} ${app.idNumber} ${app.farmSize}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })

  const navItems = [
    {
      id: 'approvals',
      label: 'Farmer Approvals',
      icon: KycShieldIcon,
      badge: pendingApps.length,
    },
    {
      id: 'account',
      label: 'Account Details',
      icon: AccountUserIcon,
      badge: 0,
    },
  ]

  const kpis = [
    {
      key: 'pending',
      label: 'Pending Approval',
      value: pendingApps.length,
      cardCls: 'bg-[#fff9ee] border-[#f4dfba]',
      activeRing: 'ring-2 ring-amber-400/55 border-b-2 border-b-amber-500',
      iconWrap: 'bg-[#fef0d4] text-[#b45309]',
    },
    {
      key: 'approved',
      label: 'Verified Farmers',
      value: approvedApps.length,
      cardCls: 'bg-[#f2f9ef] border-[#cce0be]',
      activeRing: 'ring-2 ring-[#2e7d32]/35 border-b-2 border-b-[#184828]',
      iconWrap: 'bg-[#dff0d4] text-[#184828]',
    },
    {
      key: 'rejected',
      label: 'Declined / Retry',
      value: rejectedApps.length,
      cardCls: 'bg-[#fdf4f3] border-[#f2d0cc]',
      activeRing: 'ring-2 ring-rose-400/45 border-b-2 border-b-rose-600',
      iconWrap: 'bg-[#fae1df] text-[#b91c1c]',
    },
    {
      key: 'all',
      label: 'Total Applications',
      value: applications.length,
      cardCls: 'bg-[#f3f7fd] border-[#d3e1f5]',
      activeRing: 'ring-2 ring-sky-400/45 border-b-2 border-b-sky-600',
      iconWrap: 'bg-[#dfeafc] text-[#2563eb]',
    },
  ]

  return (
    <div className="min-h-dvh bg-[#f4f6f4] flex">
      {/* Illustrated Dark Forest-Green Desktop Sidebar */}
      <aside
        className="hidden lg:flex lg:flex-col lg:w-60 lg:shrink-0 sticky top-0 h-dvh bg-[#144021] bg-cover bg-bottom bg-no-repeat text-white border-r border-[#0f3319] select-none"
        style={{ backgroundImage: "url('/hero/side%20bar%20bg.png')" }}
        aria-label="Admin sidebar navigation"
      >
        <FarmLinkSidebarBrand
          to="/"
          portalLabelTop="Admin"
          portalLabelBottom="Control"
        />

        <div className="flex-1 px-3 py-4 overflow-y-auto no-scrollbar">
          <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-emerald-200/55 uppercase">
            Management
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = section === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSection(item.id)}
                  className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-[13.5px] transition-all cursor-pointer ${
                    active
                      ? 'bg-[#edf5e6] text-[#143e22] font-semibold shadow-sm'
                      : 'text-white/90 hover:bg-white/10 hover:text-white font-medium'
                  }`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4.5 h-4.5 shrink-0 ${
                        active ? 'text-[#184828]' : 'text-emerald-100/80'
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge > 0 && (
                    <span
                      className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        active ? 'bg-[#184828] text-white' : 'bg-[#f4c150] text-[#143e22]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom Frosted Admin Account Card */}
        <div className="p-3">
          <button
            type="button"
            onClick={() => setSection('account')}
            className="w-full text-left flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-xl bg-[#0c2914]/78 backdrop-blur-sm border border-white/15 hover:bg-[#0c2914]/92 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-full bg-[#edf5e6] text-[#143e22] text-xs font-bold flex items-center justify-center shrink-0">
                {adminInitials || 'AK'}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{adminAccount.name}</p>
                <p className="text-[10px] text-emerald-100/75 truncate">{adminAccount.role}</p>
              </div>
            </div>
            <svg
              className="w-4 h-4 text-emerald-200/70 group-hover:text-white shrink-0 transition-colors"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-md border-b border-[#e2e6e1] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <FarmLinkMobileHeaderBrand to="/" badge="Admin" />

            <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
              <span>Admin Control</span>
              <span>›</span>
              <span className="font-semibold text-slate-900">
                {navItems.find((n) => n.id === section)?.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                aria-label="KYC Queue Notifications"
                className="relative p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {pendingApps.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600 ring-2 ring-white" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute -right-24 sm:right-0 mt-2 w-[min(288px,calc(100vw-1.5rem))] sm:w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-slate-900">KYC Verification Alerts</span>
                    <button
                      type="button"
                      onClick={() => setNotifOpen(false)}
                      className="text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-slate-600">
                    <strong className="text-[#184828]">{pendingApps.length}</strong> farmer{' '}
                    {pendingApps.length === 1 ? 'application awaits' : 'applications await'} ID proof
                    verification.
                  </p>
                </div>
              )}
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
            >
              <span>Public Home</span>
              <svg className="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </Link>
          </div>
        </header>

        <main className="flex-1 w-full max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-5 pb-24 lg:pb-10 space-y-4">
          {notice && (
            <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs font-semibold text-[#184828]">
              <span>{notice}</span>
              <button
                type="button"
                onClick={() => setNotice('')}
                className="text-emerald-700 hover:underline shrink-0 cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          )}

          {section === 'approvals' ? (
            <>
              {/* Illustrated Title Header Banner */}
              <section className="relative rounded-2xl overflow-hidden bg-white border border-[#e2e6e1] px-4 py-4 sm:px-6 sm:py-5 shadow-2xs">
                <div
                  className="hidden sm:block absolute inset-y-0 right-0 w-[56%] pointer-events-none select-none overflow-hidden"
                  aria-hidden="true"
                >
                  <img
                    src="/footer/wave-desktop-cropped.png"
                    alt=""
                    className="w-full h-full object-cover object-[right_75%] opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent" />
                </div>

                <div className="relative z-10 flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-[#e8f3e1] border border-[#cce0be] text-[#184828] flex items-center justify-center shrink-0">
                    <KycShieldIcon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h1 className="font-serif text-xl sm:text-[26px] font-bold text-[#143e22] tracking-tight leading-tight">
                      Farmer Approvals
                    </h1>
                    <p className="mt-0.5 text-xs sm:text-[13px] text-[#465a48]">
                      Review and verify farmer registrations, ID proofs, and payout details.
                    </p>
                  </div>
                </div>
              </section>

              {/* 4 Soft-Tinted Color-Coded KPI Cards */}
              <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
                {kpis.map((item) => {
                  const isActive = statusFilter === item.key
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => setStatusFilter(item.key)}
                      className={`text-left rounded-2xl border px-3 py-2.5 sm:px-4 sm:py-3.5 flex items-center gap-3 transition-all cursor-pointer shadow-2xs ${
                        item.cardCls
                      } ${isActive ? item.activeRing : 'hover:shadow-xs'}`}
                    >
                      <span
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${item.iconWrap}`}
                      >
                        <KpiBadgeIcon type={item.key} />
                      </span>
                      <div className="min-w-0">
                        <p className="font-serif text-lg sm:text-2xl font-bold text-slate-900 leading-none">
                          {item.value}
                        </p>
                        <p className="text-[11px] sm:text-xs font-medium text-slate-700 truncate mt-1">
                          {item.label}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </section>

              {/* Filter Pills + Search & District Controls */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 pt-0.5">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0 sm:flex-wrap">
                  {[
                    { id: 'pending', label: 'Pending Review', count: pendingApps.length },
                    { id: 'approved', label: 'Approved', count: approvedApps.length },
                    { id: 'rejected', label: 'Declined', count: rejectedApps.length },
                    { id: 'all', label: 'All', count: applications.length },
                  ].map((tab) => {
                    const active = statusFilter === tab.id
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setStatusFilter(tab.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold border shrink-0 transition-colors cursor-pointer ${
                          active
                            ? 'bg-[#184828] text-white border-[#184828] shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-[#184828]'
                        }`}
                      >
                        <span>{tab.label}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${
                            active ? 'bg-[#2e7d32] text-white' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {tab.count}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-56">
                    <svg
                      className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input
                      type="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search farmer, ID, or cluster..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#184828]"
                    />
                  </div>

                  <div className="relative shrink-0">
                    <svg
                      className="w-3.5 h-3.5 text-[#184828] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <select
                      value={districtFilter}
                      onChange={(e) => setDistrictFilter(e.target.value)}
                      className="pl-7 pr-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#184828] cursor-pointer"
                    >
                      {KERALA_FILTER_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Horizontal Single-Column Approval Cards */}
              {visibleApps.length === 0 ? (
                <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-8 text-center">
                  <p className="font-serif text-base font-bold text-slate-900">
                    No farmer applications match this filter
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Switch status tabs or clear your search/district filter.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleApps.map((app) => {
                    const badge = APP_STATUS_BADGES[app.status] || APP_STATUS_BADGES.pending
                    const initials = app.fullName
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((w) => w[0]?.toUpperCase() || '')
                      .join('')
                    const [acresPart, cropsPart] = (app.farmSize || '').split('·').map((s) => s.trim())

                    return (
                      <article
                        key={app.id}
                        className="rounded-2xl bg-white border border-[#e2e6e1] p-3.5 sm:px-5 sm:py-4 shadow-2xs hover:border-slate-300 transition-colors"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-center">
                          {/* Zone 1: Farmer Avatar & Metadata */}
                          <div className="lg:col-span-5 flex items-center gap-3 min-w-0">
                            <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#e5f0dd] border border-[#cce0be] text-[#184828] text-xs sm:text-sm font-bold flex items-center justify-center shrink-0">
                              {initials}
                            </span>

                            <div className="min-w-0 space-y-0.5 sm:space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="font-serif text-[15px] sm:text-base font-bold text-slate-900 truncate">
                                  {app.fullName}
                                </h2>
                                <span
                                  className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${badge.cls}`}
                                >
                                  {badge.label}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11.5px] sm:text-xs text-slate-600">
                                <span className="inline-flex items-center gap-1">
                                  <svg className="w-3.5 h-3.5 text-slate-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                  </svg>
                                  {app.district}
                                </span>
                                <span className="text-slate-300">|</span>
                                <span className="inline-flex items-center gap-1 truncate">
                                  <svg className="w-3.5 h-3.5 text-[#2c6e43] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M7 20h10" />
                                    <path d="M12 20v-8" />
                                    <path d="M12 12c-3 0-6-2.5-6-6 4 0 6 2 6 6Z" />
                                  </svg>
                                  {app.village}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] sm:text-[11.5px] text-slate-500">
                                <span className="font-medium text-slate-700">{acresPart}</span>
                                {cropsPart && (
                                  <>
                                    <span className="text-slate-300">|</span>
                                    <span className="truncate">{cropsPart}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Zone 2: Verification Documents Checklist (side-by-side on mobile, stacked on lg+) */}
                          <div className="lg:col-span-4 space-y-1.5">
                            <p className="text-[11px] sm:text-xs font-bold text-slate-800">
                              Verification Documents
                            </p>

                            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
                              <button
                                type="button"
                                onClick={() => setInspectingApp(app)}
                                className="w-full rounded-xl bg-[#f4f8f1] hover:bg-[#ebf3e6] border border-[#dce8d4] px-2.5 sm:px-3 py-1.5 flex items-center justify-between gap-1.5 text-[11px] sm:text-xs transition-colors cursor-pointer"
                              >
                                <span className="inline-flex items-center gap-1.5 sm:gap-2 min-w-0 font-semibold text-[#143e22]">
                                  <svg className="w-3.5 h-3.5 text-[#2c6e43] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="5" width="20" height="14" rx="2" />
                                    <line x1="2" y1="10" x2="22" y2="10" />
                                  </svg>
                                  <span className="truncate">{app.idType}</span>
                                </span>
                                <GreenCheckCircle />
                              </button>

                              <button
                                type="button"
                                onClick={() => setInspectingApp(app)}
                                className="w-full rounded-xl bg-[#f4f8f1] hover:bg-[#ebf3e6] border border-[#dce8d4] px-2.5 sm:px-3 py-1.5 flex items-center justify-between gap-1.5 text-[11px] sm:text-xs transition-colors cursor-pointer"
                              >
                                <span className="inline-flex items-center gap-1.5 sm:gap-2 min-w-0 font-semibold text-[#143e22]">
                                  <svg className="w-3.5 h-3.5 text-[#2c6e43] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 10h18" />
                                    <path d="M5 10v8M9 10v8M15 10v8M19 10v8" />
                                    <path d="M2 18h20" />
                                    <path d="m12 3 9 5H3l9-5Z" />
                                  </svg>
                                  <span className="truncate">
                                    Bank / UPI<span className="hidden sm:inline"> Details</span>
                                  </span>
                                </span>
                                <GreenCheckCircle />
                              </button>
                            </div>
                          </div>

                          {/* Zone 3: Single Horizontal Action Row on Mobile / Stacked Action Stack on Desktop */}
                          <div className="lg:col-span-3 pt-2.5 border-t border-slate-100 lg:pt-0 lg:border-t-0 flex items-center gap-1.5 lg:flex-col lg:items-stretch lg:gap-2">
                            <button
                              type="button"
                              onClick={() => setInspectingApp(app)}
                              className="shrink-0 lg:w-full py-1.5 px-2.5 sm:px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[11px] sm:text-xs font-semibold text-slate-800 inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <svg className="w-3.5 h-3.5 text-slate-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                              </svg>
                              <span className="lg:hidden">View Docs</span>
                              <span className="hidden lg:inline">View Documents</span>
                            </button>

                            {app.status === 'pending' ? (
                              <div className="flex-1 lg:flex-none grid grid-cols-2 gap-1.5 lg:gap-2">
                                <button
                                  type="button"
                                  onClick={() => setInspectingApp(app)}
                                  className="py-1.5 px-2 sm:px-2.5 rounded-xl border border-[#e7c4bf] bg-white hover:bg-[#fdf3f2] text-[11px] sm:text-xs font-semibold text-[#b91c1c] transition-colors cursor-pointer"
                                >
                                  Decline
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleApproveFarmer(app.id)}
                                  className="py-1.5 px-2 sm:px-2.5 rounded-xl bg-[#2e7d32] hover:bg-[#184828] text-white text-[11px] sm:text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                                >
                                  ✓ Approve
                                </button>
                              </div>
                            ) : app.status === 'rejected' ? (
                              <button
                                type="button"
                                onClick={() => handleApproveFarmer(app.id)}
                                className="flex-1 lg:flex-none lg:w-full py-1.5 px-3 rounded-xl bg-[#2e7d32] hover:bg-[#184828] text-white text-[11px] sm:text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                              >
                                ✓ Approve Now
                              </button>
                            ) : (
                              <div className="flex-1 lg:flex-none text-center py-1 px-2 rounded-xl bg-[#f4f9f0] border border-[#dce8d4] text-[10.5px] sm:text-[11px] font-semibold text-[#184828] truncate">
                                {app.submittedAt}
                              </div>
                            )}
                          </div>
                        </div>

                        {app.status === 'rejected' && app.rejectReason && (
                          <p className="mt-2.5 text-[11px] font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-1.5">
                            Decline note: {app.rejectReason}
                          </p>
                        )}
                      </article>
                    )
                  })}
                </div>
              )}
            </>
          ) : (
            /* Admin Account Details View */
            <section className="max-w-2xl space-y-4">
              <div>
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Admin Account Details
                </h1>
                <p className="mt-0.5 text-xs text-slate-600">
                  Manage verification officer contact details and admin portal credentials.
                </p>
              </div>

              <form
                onSubmit={handleSaveAccount}
                className="rounded-2xl bg-white border border-[#e2e6e1] p-5 sm:p-6 shadow-2xs space-y-4"
              >
                <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-11 h-11 rounded-full bg-[#184828] text-white text-sm font-bold flex items-center justify-center shrink-0">
                      {adminInitials || 'AK'}
                    </span>
                    <div className="min-w-0">
                      <p className="font-serif text-base font-bold text-slate-900 truncate">
                        {adminAccount.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{adminAccount.department}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[#184828] text-[11px] font-semibold shrink-0">
                    Active Admin
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="adm-name"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Full Name
                    </label>
                    <input
                      id="adm-name"
                      type="text"
                      value={adminAccount.name}
                      onChange={(e) =>
                        setAdminAccount((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#184828]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="adm-role"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Designation / Role
                    </label>
                    <input
                      id="adm-role"
                      type="text"
                      value={adminAccount.role}
                      onChange={(e) =>
                        setAdminAccount((prev) => ({ ...prev, role: e.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#184828]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="adm-email"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Admin Email ID
                    </label>
                    <input
                      id="adm-email"
                      type="email"
                      value={adminAccount.email}
                      onChange={(e) =>
                        setAdminAccount((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#184828]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="adm-phone"
                      className="block text-xs font-semibold text-slate-700 mb-1"
                    >
                      Contact Phone
                    </label>
                    <input
                      id="adm-phone"
                      type="tel"
                      value={adminAccount.phone}
                      onChange={(e) =>
                        setAdminAccount((prev) => ({ ...prev, phone: e.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-[#184828]"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <p className="text-xs font-bold text-slate-800">Change Password (Optional)</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <input
                      type="password"
                      placeholder="Current password"
                      value={passwordForm.current}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({ ...prev, current: e.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#184828]"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={passwordForm.next}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({ ...prev, next: e.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#184828]"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={passwordForm.confirm}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({ ...prev, confirm: e.target.value }))
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#184828]"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <Link
                    to="/"
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    ← Public Home
                  </Link>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs sm:text-sm font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    Save Account Details
                  </button>
                </div>
              </form>
            </section>
          )}
        </main>
      </div>

      {/* Focused 2-Tab Mobile Bottom Dock */}
      <nav
        className="lg:hidden fixed bottom-2.5 inset-x-3 z-40 max-w-sm mx-auto"
        aria-label="Mobile admin navigation"
      >
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.12)] px-1.5 py-1.5 grid grid-cols-2 items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = section === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSection(item.id)}
                className={`relative flex flex-col items-center justify-center pt-1 pb-1.5 px-2 rounded-xl transition-all cursor-pointer ${
                  active
                    ? 'bg-[#e8f3e1] text-[#143e22] ring-1 ring-[#cce0be]'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] mt-0.5 leading-none ${
                    active ? 'font-bold text-[#143e22]' : 'font-medium'
                  }`}
                >
                  {item.label}
                </span>
                {active && (
                  <span
                    className="absolute bottom-0.5 w-5 h-[2px] rounded-full bg-[#184828]"
                    aria-hidden="true"
                  />
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {inspectingApp && (
        <AdminIdPreviewModal
          key={inspectingApp.id}
          application={inspectingApp}
          onClose={() => setInspectingApp(null)}
          onApprove={handleApproveFarmer}
          onReject={handleRejectFarmer}
        />
      )}
    </div>
  )
}
