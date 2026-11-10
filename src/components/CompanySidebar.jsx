import { Link, NavLink } from 'react-router-dom'
import {
  BrowseIcon,
  DashboardIcon,
  FarmersIcon,
  OffersIcon,
  OrdersIcon,
  ReportsIcon,
  SettingsIcon,
} from './CompanyIcons'
import { FarmLinkLogoMark } from './FarmerIcons'

/**
 * Crisp white institutional sidebar navigation for the Company Procurement Portal.
 */
export default function CompanySidebar({
  companyProfile,
  initials,
  counterOffersCount,
  actionOrdersCount,
}) {
  const procurementLinks = [
    { label: 'Overview', path: '/company/dashboard', end: true, icon: DashboardIcon },
    { label: 'Browse Produce', path: '/company/browse', icon: BrowseIcon },
    {
      label: 'Negotiations',
      path: '/company/offers',
      badge: counterOffersCount,
      badgeCls: 'bg-amber-100 text-amber-800',
      activeBadgeCls: 'bg-white/20 text-white',
      icon: OffersIcon,
    },
    {
      label: 'Orders & Logistics',
      path: '/company/orders',
      badge: actionOrdersCount,
      badgeCls: 'bg-slate-200 text-slate-800',
      activeBadgeCls: 'bg-white/20 text-white',
      icon: OrdersIcon,
    },
  ]

  const managementLinks = [
    { label: 'Verified Farmers', path: '/company/farmers', icon: FarmersIcon },
    { label: 'Reports', path: '/company/reports', icon: ReportsIcon },
    { label: 'Company Profile', path: '/company/settings', icon: SettingsIcon },
  ]

  const renderNavItem = (item) => {
    const Icon = item.icon
    return (
      <NavLink
        key={item.path}
        to={item.path}
        end={item.end}
        className={({ isActive }) =>
          `flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-[13.5px] transition-colors focus:outline-none ${
            isActive
              ? 'bg-[#1e293b] text-white font-semibold shadow-2xs'
              : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900 font-medium'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span className="flex items-center gap-2.5 min-w-0">
              <Icon
                className={`w-4.5 h-4.5 shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-500'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </span>

            {item.badge > 0 && (
              <span
                className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  isActive ? item.activeBadgeCls : item.badgeCls
                }`}
              >
                {item.badge}
              </span>
            )}
          </>
        )}
      </NavLink>
    )
  }

  return (
    <aside
      className="hidden lg:flex lg:flex-col lg:w-60 lg:shrink-0 sticky top-0 h-dvh bg-white border-r border-[#e2e6e1] select-none"
      aria-label="Company procurement sidebar navigation"
    >
      {/* Top Brand Header aligned horizontally at h-14 */}
      <div className="h-14 px-5 border-b border-[#e2e6e1] flex items-center">
        <Link to="/company/dashboard" className="flex items-center gap-2.5">
          <FarmLinkLogoMark className="w-8 h-8" />
          <div className="flex flex-col leading-none">
            <span className="font-serif text-[19px] font-bold tracking-tight text-[#143e22]">
              FarmLink
            </span>
            <span className="text-[9px] font-semibold tracking-wider text-slate-500 uppercase mt-0.5">
              Procurement Desk
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        <div>
          <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            Procurement
          </p>
          <nav className="space-y-1" aria-label="Primary company navigation">
            {procurementLinks.map(renderNavItem)}
          </nav>
        </div>

        <div>
          <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
            Network &amp; Insights
          </p>
          <nav className="space-y-1" aria-label="Secondary company navigation">
            {managementLinks.map(renderNavItem)}
          </nav>
        </div>
      </div>

      {/* Bottom Buyer Organization Footer */}
      <div className="p-3 border-t border-[#e2e6e1]">
        <Link
          to="/company/settings"
          className="flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-xl hover:bg-slate-100 transition-colors group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="relative w-8 h-8 rounded-full bg-[#1e293b] text-white text-xs font-bold flex items-center justify-center shrink-0">
              {initials}
              <span
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
                title="Verified Corporate Buyer"
              />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-900 truncate">
                {companyProfile.shortName}
              </p>
              <p className="text-[10.5px] text-slate-500 truncate">
                {companyProfile.headquarters}
              </p>
            </div>
          </div>

          <svg
            className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0 transition-colors"
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
        </Link>
      </div>
    </aside>
  )
}
