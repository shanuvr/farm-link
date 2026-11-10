import { NavLink } from 'react-router-dom'
import {
  ConfirmedIcon,
  HomeIcon,
  ListingsIcon,
  OffersIcon,
  PlusIcon,
} from './FarmerIcons'

/**
 * Compact floating mobile bottom app dock for the Farmer Portal.
 */
export default function FarmerMobileDock({ pendingOffersCount, activeOrdersCount }) {
  return (
    <nav
      className="lg:hidden fixed bottom-2.5 inset-x-3 z-50 max-w-md mx-auto"
      aria-label="Mobile farmer navigation"
    >
      <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-[0_10px_30px_rgba(15,23,42,0.12)] px-1.5 py-1.5 grid grid-cols-5 items-end">
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

        <NavLink
          to="/farmers/add"
          className="flex flex-col items-center justify-end pb-0.5 group"
          aria-label="Add new listing"
        >
          {({ isActive }) => (
            <>
              <span
                className={`w-11 h-11 -mt-5 rounded-full flex items-center justify-center shadow-[0_6px_16px_rgba(24,72,40,0.34)] ring-4 ring-[#f4f6f4] transition-transform active:scale-95 ${
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
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#b91c1c] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
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
                  <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-[#184828] text-white text-[9px] font-bold flex items-center justify-center ring-2 ring-white">
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
  )
}

