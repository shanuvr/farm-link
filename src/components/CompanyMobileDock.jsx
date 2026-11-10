import { NavLink } from 'react-router-dom'
import { BrowseIcon, DashboardIcon, OffersIcon, OrdersIcon } from './CompanyIcons'

/**
 * Compact 4-tab bottom navigation dock for mobile screens (< lg) in Company Portal.
 */
export default function CompanyMobileDock({ counterOffersCount, actionOrdersCount }) {
  return (
    <nav
      className="lg:hidden fixed bottom-2.5 inset-x-3 z-50 max-w-md mx-auto"
      aria-label="Mobile company navigation"
    >
      <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.12)] px-2 py-1.5 grid grid-cols-4 items-center">
        <NavLink
          to="/company/dashboard"
          end
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <DashboardIcon className="w-5 h-5" />
              <span className={`text-[10px] mt-0.5 leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                Overview
              </span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/company/browse"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <BrowseIcon className="w-5 h-5" />
              <span className={`text-[10px] mt-0.5 leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                Browse
              </span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/company/offers"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <OffersIcon className="w-5 h-5" />
                {counterOffersCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {counterOffersCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                Offers
              </span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/company/orders"
          className={({ isActive }) =>
            `relative flex flex-col items-center justify-center py-1 rounded-xl transition-colors ${
              isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <OrdersIcon className="w-5 h-5" />
                {actionOrdersCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#184828] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
                    {actionOrdersCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 leading-none ${isActive ? 'font-bold' : 'font-medium'}`}>
                Orders
              </span>
            </>
          )}
        </NavLink>
      </div>
    </nav>
  )
}
