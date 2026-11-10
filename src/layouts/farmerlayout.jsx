import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useFarmer } from '../context/farmerContextStore'

function HomeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
      <path d="M9 21v-6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6" />
    </svg>
  )
}

function ListingsIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 10h14l-1.5 9a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 10Z" />
      <path d="M3 10h18" />
      <path d="m8 10 2.5-5" />
      <path d="m16 10-2.5-5" />
    </svg>
  )
}

function OffersIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4L16 11" />
      <path d="m13 7-2-2a1 1 0 0 0-1.4 0L5.3 9.3a1 1 0 0 0 0 1.4L8 13" />
      <path d="m14 14 3-3" />
      <path d="m7 7 3 3" />
    </svg>
  )
}

function ConfirmedIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

function PlusIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

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
  const location = useLocation()
  const navigate = useNavigate()

  const pendingOffersCount = offers.filter((o) => o.status === 'pending_farmer').length
  const activeOrdersCount = orders.filter((o) => o.status !== 'Completed').length
  const unreadNotifsCount = notifications.filter((n) => n.unread).length

  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const desktopTabs = [
    { label: 'Home', path: '/farmers', end: true },
    { label: 'My Listings', path: '/farmers/listings' },
    { label: 'Offers', path: '/farmers/offers', badge: pendingOffersCount },
    { label: 'Confirmed', path: '/farmers/orders', badge: activeOrdersCount },
  ]

  const isRouteActive = (path, end = false) => {
    if (end) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-dvh bg-[#fbf8f1] text-[#143e22] flex flex-col">
      {/* Top App Header */}
      <header className="sticky top-0 z-40 w-full bg-[#fbf8f1]/85 backdrop-blur-md border-b border-[#e7dec9]">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
          {/* Brand + Portal Tag */}
          <Link to="/farmers" className="flex items-center gap-2 shrink-0">
            <svg viewBox="0 0 72 62" className="w-8 h-8 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 28L36 15L52 28H20Z" fill="#1b4d29" stroke="#12381e" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M22 25.5L36 14.5L50 25.5" stroke="#9cc594" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="25" y="28" width="3" height="11" fill="#12381e" rx="0.5" />
              <rect x="34.5" y="28" width="3" height="11" fill="#12381e" rx="0.5" />
              <rect x="44" y="28" width="3" height="11" fill="#12381e" rx="0.5" />
              <path d="M4 42C18 36 38 35 68 39" stroke="#1b4d29" strokeWidth="3.6" strokeLinecap="round" />
              <path d="M9 48C24 42 44 41 63 46" stroke="#2d6d3d" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M36 14C36 10 39 8 42 8C42 10 40 12.5 36 14Z" fill="#5aa866" />
              <path d="M36 14C35 10 33 9 30 9C30 11 32 13 36 14Z" fill="#478a53" />
            </svg>
            <div className="flex flex-col leading-none">
              <span className="font-serif text-lg font-bold text-[#143e22]">FarmLink</span>
              <span className="text-[9.5px] font-semibold tracking-wide text-[#2c6e43] uppercase mt-0.5">
                Farmer Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Farmer navigation">
            {desktopTabs.map((tab) => {
              const active = isRouteActive(tab.path, tab.end)
              return (
                <NavLink
                  key={tab.path}
                  to={tab.path}
                  end={tab.end}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm transition-colors ${
                    active
                      ? 'bg-[#184828] text-white font-semibold shadow-2xs'
                      : 'text-[#2a3c2c] hover:text-[#184828] hover:bg-[#184828]/6 font-medium'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.badge > 0 && (
                    <span
                      className={`text-[10.5px] font-bold px-1.5 py-0.2 rounded-full ${
                        active ? 'bg-white/20 text-white' : 'bg-[#e5f1dc] text-[#184828]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Right Actions: + Add Listing (Desktop), Notifications, Profile */}
          <div className="flex items-center gap-2">
            <Link
              to="/farmers/add"
              className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-sm font-semibold shadow-xs transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Add Listing</span>
            </Link>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotifOpen((prev) => !prev)}
                className="relative p-2 rounded-xl border border-[#e3d9c3] bg-[#fffdf8] text-[#143e22] hover:bg-[#f4efe2] transition-colors cursor-pointer"
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
                <div className="absolute right-0 mt-2 w-[300px] sm:w-[340px] rounded-2xl bg-[#fffdf8] border border-[#e3d9c3] shadow-xl z-50 overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-[#ede5d2] flex items-center justify-between">
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
                  <div className="max-h-72 overflow-y-auto divide-y divide-[#f1ead9]">
                    {notifications.slice(0, 6).map((n) => (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => {
                          markNotificationRead(n.id)
                          setNotifOpen(false)
                          if (n.link) navigate(n.link)
                        }}
                        className={`w-full text-left px-4 py-2.5 hover:bg-[#fbf8f1] transition-colors cursor-pointer ${
                          n.unread ? 'bg-[#f4faef]' : ''
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

            {/* Profile Link Pill */}
            <Link
              to="/farmers/profile"
              className="inline-flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-[#e3d9c3] bg-[#fffdf8] hover:bg-[#f4efe2] transition-colors"
              aria-label="Farmer profile"
            >
              <span className="relative w-7 h-7 rounded-full bg-[#184828] text-white text-xs font-bold flex items-center justify-center">
                {initials}
                {profile.verified && (
                  <span
                    className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#4ade80] ring-2 ring-[#fffdf8]"
                    title="Verified Farmer"
                  />
                )}
              </span>
              <span className="hidden sm:inline text-xs font-semibold text-[#143e22] max-w-[90px] truncate">
                {profile.name.split(' ')[0]}
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area (bottom padding clears mobile floating dock) */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-24 lg:pb-10">
        <Outlet />
      </main>

      {/* Compact Mobile App Bottom Dock */}
      <nav
        className="lg:hidden fixed bottom-2.5 inset-x-3 z-50 max-w-md mx-auto"
        aria-label="Mobile farmer navigation"
      >
        <div className="bg-[#fffdf8]/95 backdrop-blur-md border border-[#dcd1b7] rounded-2xl shadow-[0_10px_30px_rgba(20,62,34,0.14)] px-1.5 py-1.5 grid grid-cols-5 items-end">
          {/* 1. Home */}
          <NavLink
            to="/farmers"
            end
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-0.5 rounded-xl transition-colors ${
                isActive ? 'text-[#184828]' : 'text-[#617363] hover:text-[#184828]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <HomeIcon className="w-5 h-5" />
                <span className={`text-[10px] mt-0.5 leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                  Home
                </span>
              </>
            )}
          </NavLink>

          {/* 2. My Listings */}
          <NavLink
            to="/farmers/listings"
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-0.5 rounded-xl transition-colors ${
                isActive ? 'text-[#184828]' : 'text-[#617363] hover:text-[#184828]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <ListingsIcon className="w-5 h-5" />
                <span className={`text-[10px] mt-0.5 leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                  Listings
                </span>
              </>
            )}
          </NavLink>

          {/* 3. Center Elevated + Add Listing */}
          <NavLink
            to="/farmers/add"
            className="flex flex-col items-center justify-end pb-0.5 group"
            aria-label="Add new listing"
          >
            {({ isActive }) => (
              <>
                <span
                  className={`w-11 h-11 -mt-5 rounded-full flex items-center justify-center shadow-[0_6px_16px_rgba(24,72,40,0.34)] ring-4 ring-[#fbf8f1] transition-transform active:scale-95 ${
                    isActive ? 'bg-[#12391f] text-white' : 'bg-[#184828] text-white group-hover:bg-[#12391f]'
                  }`}
                >
                  <PlusIcon className="w-5 h-5" />
                </span>
                <span className={`text-[10px] mt-1 leading-none ${isActive ? 'text-[#184828] font-bold' : 'text-[#465a48] font-semibold'}`}>
                  Add
                </span>
              </>
            )}
          </NavLink>

          {/* 4. Offers (Bargain) */}
          <NavLink
            to="/farmers/offers"
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center py-0.5 rounded-xl transition-colors ${
                isActive ? 'text-[#184828]' : 'text-[#617363] hover:text-[#184828]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <OffersIcon className="w-5 h-5" />
                  {pendingOffersCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#b91c1c] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-[#fffdf8]">
                      {pendingOffersCount}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] mt-0.5 leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                  Offers
                </span>
              </>
            )}
          </NavLink>

          {/* 5. Confirmed Orders */}
          <NavLink
            to="/farmers/orders"
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center py-0.5 rounded-xl transition-colors ${
                isActive ? 'text-[#184828]' : 'text-[#617363] hover:text-[#184828]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <ConfirmedIcon className="w-5 h-5" />
                  {activeOrdersCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#184828] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-[#fffdf8]">
                      {activeOrdersCount}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] mt-0.5 leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                  Confirmed
                </span>
              </>
            )}
          </NavLink>
        </div>
      </nav>
    </div>
  )
}

