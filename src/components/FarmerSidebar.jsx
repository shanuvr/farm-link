import { Link, NavLink } from 'react-router-dom'
import {
  ConfirmedIcon,
  FarmLinkLogoMark,
  HomeIcon,
  ListingsIcon,
  OffersIcon,
  PlusIcon,
  ProfileIcon,
} from './FarmerIcons'

/**
 * Clean warm-ivory desktop sidebar navigation for the Farmer Portal.
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
      badgeCls: 'bg-[#fceae6] text-[#9a2e1a]',
      activeBadgeCls: 'bg-white/20 text-white',
      icon: OffersIcon,
    },
    {
      label: 'Confirmed',
      path: '/farmers/orders',
      badge: activeOrdersCount,
      badgeCls: 'bg-[#e6f0df] text-[#184828]',
      activeBadgeCls: 'bg-white/20 text-white',
      icon: ConfirmedIcon,
    },
  ]

  return (
    <aside
      className="hidden lg:flex lg:flex-col lg:w-60 lg:shrink-0 sticky top-0 h-dvh bg-white border-r border-[#e2e6e1] select-none"
      aria-label="Farmer sidebar navigation"
    >
      {/* Top Brand Header (aligned horizontally at h-14 with the main top bar) */}
      <div className="h-14 px-5 border-b border-[#e2e6e1] flex items-center">
        <Link to="/farmers" className="flex items-center gap-2.5">
          <FarmLinkLogoMark className="w-8 h-8" />
          <div className="flex flex-col leading-none">
            <span className="font-serif text-[19px] font-bold tracking-tight text-[#143e22]">
              FarmLink
            </span>
            <span className="text-[9px] font-semibold tracking-wider text-[#2c6e43] uppercase mt-0.5">
              Farmer Portal
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
        <div>
          <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-[#7a8a7c] uppercase">
            Menu
          </p>
          <nav className="space-y-1" aria-label="Primary farmer navigation">
            {mainLinks.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-[13.5px] transition-colors focus:outline-none ${
                      isActive
                        ? 'bg-[#184828] text-white font-semibold shadow-2xs'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-[#143e22] font-medium'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={`w-4.5 h-4.5 shrink-0 ${
                            isActive ? 'text-white' : 'text-[#4f6453]'
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
            })}
          </nav>
        </div>

        {/* Quick Actions / Account Group */}
        <div>
          <p className="px-3 mb-1.5 text-[10px] font-semibold tracking-widest text-[#7a8a7c] uppercase">
            Actions
          </p>
          <div className="space-y-1">
            <NavLink
              to="/farmers/add"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13.5px] transition-colors focus:outline-none ${
                  isActive
                    ? 'bg-[#184828] text-white font-semibold shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-[#143e22] font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <PlusIcon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-[#184828]'}`} />
                  <span>Add New Listing</span>
                </>
              )}
            </NavLink>

            <NavLink
              to="/farmers/profile"
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13.5px] transition-colors focus:outline-none ${
                  isActive
                    ? 'bg-[#184828] text-white font-semibold shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-[#143e22] font-medium'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <ProfileIcon className={`w-4.5 h-4.5 shrink-0 ${isActive ? 'text-white' : 'text-[#4f6453]'}`} />
                  <span>Profile &amp; Settings</span>
                </>
              )}
            </NavLink>
          </div>
        </div>
      </div>

      {/* Clean Single-Row Bottom Farmer Account Footer */}
      <div className="p-3 border-t border-[#e2e6e1]">
        <Link
          to="/farmers/profile"
          className="flex items-center justify-between gap-2.5 px-2.5 py-2 rounded-xl hover:bg-slate-100 transition-colors group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="relative w-8 h-8 rounded-full bg-[#184828] text-white text-xs font-bold flex items-center justify-center shrink-0">
              {initials}
              {profile.verified && (
                <span
                  className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#22c55e] ring-2 ring-white"
                  title="Verified Farmer"
                />
              )}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#143e22] truncate">{profile.name}</p>
              <p className="text-[10.5px] text-[#5e7160] truncate">{profile.district}</p>
            </div>
          </div>

          <svg
            className="w-4 h-4 text-[#7a8a7c] group-hover:text-[#143e22] shrink-0 transition-colors"
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

