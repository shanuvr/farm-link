import { Link, NavLink } from 'react-router-dom'
import {
  ConfirmedIcon,
  FarmLinkLogoMark,
  HomeIcon,
  ListingsIcon,
  OffersIcon,
  PlusIcon,
  ProfileIcon,
  ReportsIcon,
} from './FarmerIcons'

/**
 * Illustrated dark forest-green desktop sidebar navigation for the Farmer Portal.
 */
export default function FarmerSidebar({
  profile,
  initials,
  pendingOffersCount,
  activeOrdersCount,
}) {
  const mainLinks = [
    { label: 'Home', path: '/farmers', end: true, icon: HomeIcon },
    { label: 'My Listings', path: '/farmers/listings', icon: ListingsIcon },
    {
      label: 'Offers',
      path: '/farmers/offers',
      badge: pendingOffersCount,
      badgeCls: 'bg-[#f4c150] text-[#143e22]',
      activeBadgeCls: 'bg-[#184828] text-white',
      icon: OffersIcon,
    },
    {
      label: 'Confirmed',
      path: '/farmers/orders',
      badge: activeOrdersCount,
      badgeCls: 'bg-white/15 text-white',
      activeBadgeCls: 'bg-[#184828] text-white',
      icon: ConfirmedIcon,
    },
  ]

  const actionLinks = [
    { label: 'Add New Listing', path: '/farmers/add', icon: PlusIcon },
    { label: 'Sales Reports', path: '/farmers/reports', icon: ReportsIcon },
    { label: 'Profile & Settings', path: '/farmers/profile', icon: ProfileIcon },
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
      aria-label="Farmer sidebar navigation"
    >
      {/* Top Brand Header */}
      <div className="h-14 px-5 border-b border-white/12 flex items-center">
        <Link to="/farmers" className="flex items-center gap-2.5">
          <FarmLinkLogoMark className="w-8 h-8" light />
          <div className="flex flex-col leading-none">
            <span className="font-serif text-[19px] font-bold tracking-tight text-white">
              FarmLink
            </span>
            <span className="text-[9px] font-semibold tracking-wider text-emerald-200/85 uppercase mt-0.5">
              Farmer Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-3 py-4 space-y-5 overflow-y-auto no-scrollbar">
        <div>
          <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-emerald-200/55 uppercase">
            Menu
          </p>
          <nav className="space-y-1" aria-label="Primary farmer navigation">
            {mainLinks.map(renderNavItem)}
          </nav>
        </div>

        <div>
          <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-emerald-200/55 uppercase">
            Actions
          </p>
          <div className="space-y-1">
            {actionLinks.map(renderNavItem)}
          </div>
        </div>
      </div>

      {/* Frosted Glass Bottom Account Footer */}
      <div className="p-3">
        <Link
          to="/farmers/profile"
          className="flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-xl bg-[#0c2914]/78 backdrop-blur-sm border border-white/15 hover:bg-[#0c2914]/92 transition-colors group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="relative w-8 h-8 rounded-full bg-[#edf5e6] text-[#143e22] text-xs font-bold flex items-center justify-center shrink-0">
              {initials}
              {profile.verified && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0c2914]"
                  title="Verified Farmer"
                />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{profile.name}</p>
              <p className="text-[10.5px] text-emerald-100/75 truncate">{profile.district}</p>
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
