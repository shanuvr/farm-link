import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCompany } from '../context/companyContextStore'
import { getPayoutDestinationInfo } from '../farmers/farmerData'
import { KERALA_DISTRICTS } from './companyData'

/**
 * Verified Kerala farmers partner directory for Company Portal buyers (/company/farmers).
 */
export default function CompanyFarmers() {
  const { farmersDirectory } = useCompany()
  const [search, setSearch] = useState('')
  const [district, setDistrict] = useState('All Districts')

  const q = search.trim().toLowerCase()
  const visibleFarmers = farmersDirectory.filter((f) => {
    if (
      district !== 'All Districts' &&
      !f.district.toLowerCase().includes(district.toLowerCase())
    ) {
      return false
    }
    if (q) {
      const hay = `${f.name} ${f.district} ${f.village} ${f.farmSize} ${f.payoutDetails?.upiId || ''} ${f.payoutDetails?.bankName || ''}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Verified Farmer Network
        </h1>
        <p className="mt-0.5 text-xs text-slate-600">
          Inspect farm credentials, regional clusters, active crop batches, and supply history.
        </p>
      </div>

      {/* Filter Row */}
      <div className="bg-white border border-[#e2e6e1] rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row gap-2.5 shadow-2xs">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search farmer name, village, or specialty..."
          className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-[#f8faf8] text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-500"
        />
        <select
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          aria-label="Filter farmers by district"
          className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-500"
        >
          {KERALA_DISTRICTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Directory Grid */}
      {visibleFarmers.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center">
          <p className="font-serif text-base font-bold text-slate-900">No matching farmers</p>
          <p className="text-xs text-slate-500 mt-1">
            Try switching districts or clearing your search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleFarmers.map((farmer) => {
            const initials = farmer.name
              .split(/\s+/)
              .slice(0, 2)
              .map((w) => w[0]?.toUpperCase() || '')
              .join('')
            const payoutInfo = getPayoutDestinationInfo(farmer.payoutDetails)

            return (
              <article
                key={farmer.id}
                className="rounded-2xl bg-white border border-[#e2e6e1] p-5 flex flex-col justify-between gap-4 hover:border-slate-300 shadow-2xs transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-11 h-11 rounded-full bg-[#184828] text-white text-sm font-bold flex items-center justify-center shrink-0">
                      {initials}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-serif text-lg font-bold text-slate-900 truncate">
                          {farmer.name}
                        </h2>
                        {farmer.verified && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold shrink-0">
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 truncate">
                        {farmer.village} · {farmer.district}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{farmer.farmSize}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 bg-[#f8faf8] border border-[#e5e9e4] rounded-xl p-3 text-center">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      Active Lots
                    </p>
                    <p className="text-sm font-bold text-[#184828] mt-0.5">
                      {farmer.activeListingsCount}
                    </p>
                  </div>
                  <div className="border-x border-slate-200">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      Orders
                    </p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{farmer.ordersCount}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                      Supplied
                    </p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      {farmer.suppliedVolume} kg
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-[#f8faf8] border border-[#e5e9e4] px-3 py-2 flex items-center justify-between gap-2 text-xs">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Payout · {payoutInfo.mode}
                    </p>
                    <p className="font-mono text-[11.5px] font-semibold text-[#143e22] truncate mt-0.5">
                      {payoutInfo.primaryValue}
                    </p>
                  </div>
                  {payoutInfo.secondaryValue && (
                    <span className="text-[11px] text-slate-500 truncate max-w-[44%] text-right">
                      {payoutInfo.secondaryValue}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-600 font-medium">{farmer.phone}</span>
                  <Link
                    to={`/company/browse?farmer=${encodeURIComponent(farmer.id)}`}
                    className="px-3.5 py-1.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white font-semibold transition-colors"
                  >
                    Browse Produce →
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
