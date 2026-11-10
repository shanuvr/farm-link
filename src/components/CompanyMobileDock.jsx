import { NavLink } from 'react-router-dom'
import { BrowseIcon, DashboardIcon, OffersIcon, OrdersIcon } from './CompanyIcons'

/**
 * Compact 4-tab bottom navigation dock for mobile screens (< lg) in Company Portal.
 */
export default function CompanyMobileDock({ counterOffersCount, actionOrdersCount }) {
  const tabs = [
    {
      to: '/company/dashboard',
      end: true,
      label: 'Overview',
      icon: <DashboardIcon className="w-5 h-5" />,
    },
    {
      to: '/company/browse',
      label: 'Browse',
      icon: <BrowseIcon className="w-5 h-5" />,
    },
    {
      to: '/company/offers',
      label: 'Offers',
      icon: <OffersIcon className="w-5 h-5" />,
      badgeCount: counterOffersCount,
      badgeCls: 'bg-amber-600',
    },
    {
      to: '/company/orders',
      label: 'Orders',
      icon: <OrdersIcon className="w-5 h-5" />,
      badgeCount: actionOrdersCount,
      badgeCls: 'bg-[#184828]',
    },
  ]

  return (
    <nav
      className="lg:hidden fixed bottom-2.5 inset-x-3 z-40 max-w-md mx-auto"
      aria-label="Mobile company navigation"
    >
      <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.12)] px-1.5 py-1.5 grid grid-cols-4 items-center gap-1">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center pt-1 pb-1.5 px-1 rounded-xl transition-all ${
                isActive
                  ? 'bg-[#e8f3e1] text-[#143e22] ring-1 ring-[#cce0be]'
                  : 'text-slate-400 hover:text-slate-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  {tab.icon}
                  {tab.badgeCount > 0 && (
                    <span
                      className={`absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full ${tab.badgeCls} text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white`}
                    >
                      {tab.badgeCount}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] mt-0.5 leading-none ${
                    isActive ? 'font-bold text-[#143e22]' : 'font-medium'
                  }`}
                >
                  {tab.label}
                </span>
                {isActive && (
                  <span
                    className="absolute bottom-0.5 w-4 h-[2px] rounded-full bg-[#184828]"
                    aria-hidden="true"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
