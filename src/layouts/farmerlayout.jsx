import { useCallback, useRef, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  FarmLinkMobileHeaderBrand,
  LogoutIcon,
  PlusIcon,
  ProfileIcon,
  ReportsIcon,
} from '../components/FarmerIcons'
import FarmerMobileDock from '../components/FarmerMobileDock'
import FarmerSidebar from '../components/FarmerSidebar'
import { useFarmer } from '../context/farmerContextStore'
import { useDismissPopover } from '../utils/useDismissPopover'

const ROUTE_BREADCRUMBS = [
  { path: '/farmers/listings', label: 'My Listings' },
  { path: '/farmers/add', label: 'Add Listing' },
  { path: '/farmers/offers', label: 'Offers & Negotiation' },
  { path: '/farmers/orders', label: 'Confirmed Orders' },
  { path: '/farmers/reports', label: 'Sales Reports' },
  { path: '/farmers/profile', label: 'Profile & Settings' },
  { path: '/farmers', label: 'Overview' },
]

export default function FarmerLayout() {
  const {
    profile,
    offers,
    orders,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
  } = useFarmer()

  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const notifRef = useRef(null)
  const profileMenuRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()

  const closeNotif = useCallback(() => setNotifOpen(false), [])
  const closeProfile = useCallback(() => setProfileOpen(false), [])
  useDismissPopover(notifRef, notifOpen, closeNotif)
  useDismissPopover(profileMenuRef, profileOpen, closeProfile)

  const handleFarmerLogout = () => {
    setProfileOpen(false)
    setNotifOpen(false)
    navigate('/', { replace: true })
  }

  const pendingOffersCount = offers.filter((o) => o.status === 'pending_farmer').length
  const activeOrdersCount = orders.filter((o) => o.status !== 'Completed').length
  const unreadNotifsCount = notifications.filter((n) => n.unread).length

  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const currentSection =
    ROUTE_BREADCRUMBS.find((r) =>
      r.path === '/farmers' ? location.pathname === '/farmers' : location.pathname.startsWith(r.path)
    )?.label || 'Overview'

  return (
    <div className="min-h-dvh bg-[#f4f6f4] text-[#143e22] flex">
      {/* Modular Desktop Left Sidebar */}
      <FarmerSidebar
        profile={profile}
        initials={initials}
        pendingOffersCount={pendingOffersCount}
        activeOrdersCount={activeOrdersCount}
      />

      {/* Main Workspace */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar (h-14 aligned cleanly with sidebar header border) */}
        <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#e2e6e1]">
          <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
            {/* Mobile Brand */}
            <FarmLinkMobileHeaderBrand to="/farmers" badge="Farmer" />

            {/* Desktop Clean Breadcrumb */}
            <div className="hidden lg:flex items-center gap-2 text-xs text-[#5e7160]">
              <span>Farmer Portal</span>
              <span>/</span>
              <span className="font-semibold text-[#143e22]">{currentSection}</span>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Link
                to="/farmers/reports"
                aria-label="Sales reports"
                className="lg:hidden p-2 rounded-xl border border-slate-200 bg-white text-[#143e22] hover:bg-slate-50 transition-colors"
              >
                <ReportsIcon className="w-4.5 h-4.5" />
              </Link>

              <Link
                to="/farmers/add"
                className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold shadow-2xs transition-colors"
              >
                <PlusIcon className="w-3.5 h-3.5" />
                <span>New Listing</span>
              </Link>

              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => {
                    setNotifOpen((prev) => !prev)
                    setProfileOpen(false)
                  }}
                  className="relative p-2 rounded-xl border border-slate-200 bg-white text-[#143e22] hover:bg-slate-50 transition-colors cursor-pointer"
                  aria-label="Toggle notifications"
                  aria-expanded={notifOpen}
                >
                  <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  {unreadNotifsCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#b91c1c] text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute -right-16 sm:right-0 mt-2 w-[min(340px,calc(100vw-1.5rem))] sm:w-[340px] rounded-2xl bg-white border border-slate-200 shadow-xl z-50 overflow-hidden">
                    <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-[#143e22]">
                        Activity &amp; Alerts
                      </span>
                      {unreadNotifsCount > 0 && (
                        <button
                          type="button"
                          onClick={markAllNotificationsRead}
                          className="text-[11px] font-semibold text-[#184828] hover:underline cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                      {notifications.slice(0, 6).map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => {
                            markNotificationRead(n.id)
                            setNotifOpen(false)
                            if (n.link) navigate(n.link)
                          }}
                          className={`w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                            n.unread ? 'bg-emerald-50/45' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-[#143e22]">{n.title}</p>
                            <span className="text-[10px] text-[#6d7d6f] shrink-0">{n.time}</span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-[#465a48] leading-snug">{n.message}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Profile Dropdown (Profile link + Log Out to Home) */}
              <div className="relative lg:hidden" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen((prev) => !prev)
                    setNotifOpen(false)
                  }}
                  aria-label="Farmer account menu"
                  aria-expanded={profileOpen}
                  aria-haspopup="menu"
                  className="inline-flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors cursor-pointer select-none"
                >
                  <span className="relative w-7 h-7 rounded-full bg-[#184828] text-white text-xs font-bold flex items-center justify-center">
                    {initials}
                    {profile.verified && (
                      <span
                        className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#22c55e] ring-2 ring-white"
                        title="Verified Farmer"
                      />
                    )}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-[#5e7160] transition-transform duration-150 ${
                      profileOpen ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {profileOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 overflow-hidden"
                  >
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-[#143e22] truncate">{profile.name}</p>
                      <p className="text-[10.5px] text-[#5e7160] truncate">
                        {profile.district} • Verified Farmer
                      </p>
                    </div>

                    <Link
                      to="/farmers/profile"
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-[#143e22] hover:bg-emerald-50/60 transition-colors"
                    >
                      <ProfileIcon className="w-4 h-4 text-[#2c6e43]" />
                      <span>Profile &amp; Payouts</span>
                    </Link>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      type="button"
                      role="menuitem"
                      onClick={handleFarmerLogout}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                    >
                      <LogoutIcon className="w-4 h-4 text-rose-600" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Active Page Body */}
        <main className="flex-1 w-full max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-5 pb-24 lg:pb-10">
          <Outlet />
        </main>
      </div>

      {/* Modular Mobile Bottom Dock */}
      <FarmerMobileDock
        pendingOffersCount={pendingOffersCount}
        activeOrdersCount={activeOrdersCount}
      />
    </div>
  )
}
