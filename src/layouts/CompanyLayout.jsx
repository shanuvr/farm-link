import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import CompanyMobileDock from '../components/CompanyMobileDock'
import CompanySidebar from '../components/CompanySidebar'
import { BrowseIcon, FarmersIcon, ReportsIcon, SettingsIcon } from '../components/CompanyIcons'
import { FarmLinkMobileHeaderBrand } from '../components/FarmerIcons'
import { useCompany } from '../context/companyContextStore'

const ROUTE_TITLES = [
  { path: '/company/dashboard', label: 'Procurement Overview', end: true },
  { path: '/company/browse', label: 'Browse Produce' },
  { path: '/company/offers', label: 'Offers & Negotiations' },
  { path: '/company/orders', label: 'Orders & Logistics' },
  { path: '/company/farmers', label: 'Verified Farmers' },
  { path: '/company/reports', label: 'Procurement Reports' },
  { path: '/company/settings', label: 'Company Profile & Settings' },
]

/**
 * Clean stone-and-slate architectural shell for the Company Procurement Portal.
 */
export default function CompanyLayout() {
  const {
    isAuthenticated,
    companyProfile,
    allOffers,
    allOrders,
    notifications,
    markCompanyNotificationRead,
    markAllCompanyNotificationsRead,
  } = useCompany()

  const location = useLocation()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const notifRef = useRef(null)
  const moreRef = useRef(null)

  useEffect(() => {
    const handleOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setMoreOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  if (!isAuthenticated) {
    return <Navigate to="/company" replace state={{ from: location.pathname }} />
  }

  const counterOffersCount = allOffers.filter((o) => o.status === 'countered_by_farmer').length
  const actionOrdersCount = allOrders.filter((o) => o.status !== 'Completed').length
  const unreadNotifs = notifications.filter((n) => n.unread).length

  const initials = (companyProfile.shortName || 'KF')
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('')

  const activeRoute =
    ROUTE_TITLES.find((r) =>
      r.end ? location.pathname === r.path : location.pathname.startsWith(r.path)
    ) || ROUTE_TITLES[0]

  return (
    <div className="min-h-dvh bg-[#f4f6f4] text-slate-900 flex flex-col lg:flex-row">
      <CompanySidebar
        companyProfile={companyProfile}
        initials={initials}
        counterOffersCount={counterOffersCount}
        actionOrdersCount={actionOrdersCount}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Utility Bar matching reference layout */}
        <header className="sticky top-0 z-30 h-14 bg-white/95 backdrop-blur-md border-b border-[#e2e6e1] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <FarmLinkMobileHeaderBrand to="/company/dashboard" badge="Buyer" />

            <div className="hidden lg:flex items-center gap-2.5">
              <h2 className="font-serif text-lg font-bold text-slate-900 tracking-tight">
                {activeRoute.label}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#184828] text-[11px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Verified Buyer
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {location.pathname !== '/company/browse' && (
              <Link
                to="/company/browse"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold shadow-2xs transition-colors"
              >
                <BrowseIcon className="w-3.5 h-3.5" />
                <span>Browse Stock</span>
              </Link>
            )}

            {/* Notifications Bell */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => {
                  setNotifOpen((o) => !o)
                  setMoreOpen(false)
                }}
                aria-label="Company notifications"
                className="relative w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadNotifs > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-rose-600 text-white text-[9.5px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadNotifs}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">Procurement Alerts</span>
                    {unreadNotifs > 0 && (
                      <button
                        type="button"
                        onClick={markAllCompanyNotificationsRead}
                        className="text-[11px] font-semibold text-[#184828] hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-xs text-slate-500 text-center">No alerts yet.</p>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          type="button"
                          onClick={() => {
                            markCompanyNotificationRead(n.id)
                            setNotifOpen(false)
                            if (n.link) navigate(n.link)
                          }}
                          className={`w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer ${
                            n.unread ? 'bg-sky-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                            {n.unread && (
                              <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0 mt-1" />
                            )}
                          </div>
                          <p className="text-[11.5px] text-slate-600 mt-0.5 leading-snug">
                            {n.message}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Buyer Account Shortcut (mirrors top-right org badge in reference) */}
            <Link
              to="/company/settings"
              className="hidden lg:inline-flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <span className="w-6.5 h-6.5 rounded-full bg-[#184828] text-white text-[10px] font-bold flex items-center justify-center">
                {initials}
              </span>
              <span className="text-xs font-semibold text-slate-800">
                {companyProfile.shortName}
              </span>
            </Link>

            {/* Mobile Overflow Menu for Farmers, Reports & Company Settings */}
            <div className="relative lg:hidden" ref={moreRef}>
              <button
                type="button"
                onClick={() => {
                  setMoreOpen((o) => !o)
                  setNotifOpen(false)
                }}
                aria-label="More company options"
                className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-50 cursor-pointer"
              >
                <span className="w-6 h-6 rounded-full bg-[#1e293b] text-white text-[10px] font-bold flex items-center justify-center">
                  {initials}
                </span>
                <span>Menu</span>
              </button>

              {moreOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50">
                  <Link
                    to="/company/farmers"
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <FarmersIcon className="w-4 h-4 text-slate-600" />
                    <span>Verified Farmers</span>
                  </Link>
                  <Link
                    to="/company/reports"
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <ReportsIcon className="w-4 h-4 text-slate-600" />
                    <span>Procurement Reports</span>
                  </Link>
                  <Link
                    to="/company/settings"
                    onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <SettingsIcon className="w-4 h-4 text-slate-600" />
                    <span>Company Profile</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Scrollable Canvas */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-6 pb-24 lg:pb-10 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      <CompanyMobileDock
        counterOffersCount={counterOffersCount}
        actionOrdersCount={actionOrdersCount}
      />
    </div>
  )
}
