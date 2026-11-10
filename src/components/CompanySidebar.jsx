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
import { FarmLinkSidebarBrand } from './FarmerIcons'

/**
 * Illustrated dark forest-green sidebar navigation for the Company Procurement Portal.
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
      badgeCls: 'bg-[#f4c150] text-[#143e22]',
      activeBadgeCls: 'bg-[#184828] text-white',
      icon: OffersIcon,
    },
    {
      label: 'Orders & Logistics',
      path: '/company/orders',
      badge: actionOrdersCount,
      badgeCls: 'bg-white/15 text-white',
      activeBadgeCls: 'bg-[#184828] text-white',
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
          `flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-[13.5px] transition-all focus:outline-none ${
            isActive
              ? 'bg-[#edf5e6] text-[#143e22] font-semibold shadow-sm'
              : 'text-white/90 hover:bg-white/10 hover:text-white font-medium'
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span className="flex items-center gap-2.5 min-w-0">
              <Icon
                className={`w-4.5 h-4.5 shrink-0 ${
                  isActive ? 'text-[#184828]' : 'text-emerald-100/80'
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
      className="hidden lg:flex lg:flex-col lg:w-60 lg:shrink-0 sticky top-0 h-dvh bg-[#144021] bg-cover bg-bottom bg-no-repeat text-white border-r border-[#0f3319] select-none"
      style={{ backgroundImage: "url('/hero/side%20bar%20bg.png')" }}
      aria-label="Company procurement sidebar navigation"
    >
      {/* Top Brand Header */}
      <FarmLinkSidebarBrand
        to="/company/dashboard"
        portalLabelTop="Procurement"
        portalLabelBottom="Desk"
      />

      {/* Navigation Sections */}
      <div className="flex-1 px-3 py-4 space-y-5 overflow-y-auto no-scrollbar">
        <div>
          <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-emerald-200/55 uppercase">
            Procurement
          </p>
          <nav className="space-y-1" aria-label="Primary company navigation">
            {procurementLinks.map(renderNavItem)}
          </nav>
        </div>

        <div>
          <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-emerald-200/55 uppercase">
            Network &amp; Insights
          </p>
          <nav className="space-y-1" aria-label="Secondary company navigation">
            {managementLinks.map(renderNavItem)}
          </nav>
        </div>
      </div>

      {/* Frosted Glass Bottom Buyer Footer over Illustrated Kerala Fields */}
      <div className="p-3">
        <Link
          to="/company/settings"
          className="flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-xl bg-[#0c2914]/78 backdrop-blur-sm border border-white/15 hover:bg-[#0c2914]/92 transition-colors group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="relative w-8 h-8 rounded-full bg-[#edf5e6] text-[#143e22] text-xs font-bold flex items-center justify-center shrink-0">
              {initials}
              <span
                className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0c2914]"
                title="Verified Corporate Buyer"
              />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {companyProfile.shortName}
              </p>
              <p className="text-[10.5px] text-emerald-100/75 truncate">
                {companyProfile.headquarters}
              </p>
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
        </Link>
      </div>
    </aside>
  )
}
