import { NavLink } from 'react-router-dom'
import {
  ConfirmedIcon,
  HomeIcon,
  ListingsIcon,
  OffersIcon,
  PlusIcon,
} from './FarmerIcons'

function FarmerDockTab({ to, end = false, label, icon, badgeCount = 0, badgeCls = 'bg-[#184828]' }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `relative flex flex-col items-center justify-center pt-1 pb-1.5 px-1 rounded-xl transition-all ${
          isActive
            ? 'bg-[#e8f3e1] text-[#143e22] ring-1 ring-[#cce0be]'
            : 'text-slate-400 hover:text-slate-600'
        }`
      }
    >
      {({ isActive }) => (
        <>
          <div className="relative">
            {icon}
            {badgeCount > 0 && (
              <span
                className={`absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full ${badgeCls} text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white`}
              >
                {badgeCount}
              </span>
            )}
          </div>
          <span
            className={`text-[10px] mt-0.5 leading-none ${
              isActive ? 'font-bold text-[#143e22]' : 'font-medium'
            }`}
          >
            {label}
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
  )
}

/**
 * Compact floating mobile bottom app dock for the Farmer Portal.
 */
export default function FarmerMobileDock({ pendingOffersCount, activeOrdersCount }) {
  return (
    <nav
      className="lg:hidden fixed bottom-2.5 inset-x-3 z-40 max-w-md mx-auto"
      aria-label="Mobile farmer navigation"
    >
      <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.12)] px-1.5 py-1.5 grid grid-cols-5 items-end gap-1">
        <FarmerDockTab
          to="/farmers"
          end
          label="Home"
          icon={<HomeIcon className="w-5 h-5" />}
        />

        <FarmerDockTab
          to="/farmers/listings"
          label="Listings"
          icon={<ListingsIcon className="w-5 h-5" />}
        />

        <NavLink
          to="/farmers/add"
          className="flex flex-col items-center justify-end pb-0.5 group"
          aria-label="Add new listing"
        >
          {({ isActive }) => (
            <>
              <span
                className={`w-11 h-11 -mt-5 rounded-full flex items-center justify-center shadow-[0_6px_16px_rgba(24,72,40,0.34)] transition-all active:scale-95 ${
                  isActive
                    ? 'bg-[#12391f] text-white ring-4 ring-[#cde3be] scale-105'
                    : 'bg-[#184828] text-white ring-4 ring-[#f4f6f4] group-hover:bg-[#12391f]'
                }`}
              >
                <PlusIcon className="w-5 h-5" />
              </span>
              <span
                className={`text-[10px] mt-1 leading-none px-2 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-[#e8f3e1] text-[#143e22] font-bold'
                    : 'text-slate-500 font-semibold'
                }`}
              >
                Add
              </span>
            </>
          )}
        </NavLink>

        <FarmerDockTab
          to="/farmers/offers"
          label="Offers"
          icon={<OffersIcon className="w-5 h-5" />}
          badgeCount={pendingOffersCount}
          badgeCls="bg-[#b91c1c]"
        />

        <FarmerDockTab
          to="/farmers/orders"
          label="Confirmed"
          icon={<ConfirmedIcon className="w-5 h-5" />}
          badgeCount={activeOrdersCount}
          badgeCls="bg-[#184828]"
        />
      </div>
    </nav>
  )
}

