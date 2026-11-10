import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ListingPhotoSlider from '../components/ListingPhotoSlider'
import { useCompany } from '../context/companyContextStore'
import { getListingImages } from '../farmers/farmerData'
import {
  getListingCategory,
  KERALA_DISTRICTS,
  PRODUCE_CATEGORIES,
} from './companyData'
import CompanyListingModal from './CompanyListingModal'

const SAVED_BATCHES_KEY = 'farmlink_company_saved_v1'
const TYPE_FILTERS = ['All Stock', 'Ready Stock', 'Upcoming Harvest']

function loadSavedIds() {
  try {
    const raw = localStorage.getItem(SAVED_BATCHES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function CategoryIcon({ category, active }) {
  const strokeWhite = active ? 'text-white' : ''
  if (category === 'All Products') {
    return (
      <svg className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-[#184828]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    )
  }
  if (category === 'Vegetables') {
    return (
      <svg className={`w-4 h-4 shrink-0 ${strokeWhite || 'text-[#2c6e43]'}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17 3C9.5 3 4 8.5 4 16c0 1.4.2 2.7.7 3.9L3 21.6l1.4 1.4 1.7-1.7c1.2.5 2.5.7 3.9.7 7.5 0 13-5.5 13-13 0-.8-.1-1.6-.2-2.3-.7-.1-1.5-.2-2.3-.2H17zm-8 14c-1.8 0-3.2-1.4-3.2-3.2 0-4 3.1-7.4 7.8-8.2-.9 2.7-2.6 5.6-4.6 7.6v3.8z" />
      </svg>
    )
  }
  if (category === 'Fruits') {
    return (
      <svg className={`w-4 h-4 shrink-0 ${strokeWhite || 'text-[#dc2626]'}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 6c1.1-2.1 3.1-3.3 5-3.3.1 2-1.1 3.9-3 4.8-.6.3-1.3.4-2 .4v-.1c0-.6 0-1.2 0-1.8zm3.7 2.2c-1.4 0-2.5.7-3.7.7s-2.3-.7-3.7-.7C5.4 8.2 3 10.7 3 14.3 3 18.6 6.2 22 9.1 22c1.2 0 2-.6 2.9-.6s1.7.6 2.9.6C17.8 22 21 18.6 21 14.3c0-3.6-2.4-6.1-5.3-6.1z" />
      </svg>
    )
  }
  if (category === 'Grains') {
    return (
      <svg className={`w-4 h-4 shrink-0 ${strokeWhite || 'text-[#d97706]'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22V6" />
        <path d="M12 6c0-2.5 2-4 2-4s2 1.5 2 4-2 4-2 4" />
        <path d="M12 10c-2.8 0-5-1.6-5-4 2.8 0 5 1.6 5 4z" />
        <path d="M12 10c2.8 0 5-1.6 5-4-2.8 0-5 1.6-5 4z" />
        <path d="M12 15c-2.8 0-5-1.6-5-4 2.8 0 5 1.6 5 4z" />
        <path d="M12 15c2.8 0 5-1.6 5-4-2.8 0-5 1.6-5 4z" />
      </svg>
    )
  }
  if (category === 'Spices') {
    return (
      <svg className={`w-4 h-4 shrink-0 ${strokeWhite || 'text-[#dc2626]'}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M15.5 5.2c1.2-.8 2.7-.7 3.7.2.4.4.4 1 0 1.4-.4.4-1 .4-1.4 0-.4-.3-1-.3-1.4 0-.2.1-.3.3-.4.5 1.9 1.6 2.5 4.4 1.3 7-1.6 3.5-5.6 6.2-10.3 6.6-1.2.1-2-.9-1.5-2 .9-1.9 2.9-3.6 5.2-5 1.7-1 2.9-2.8 3.2-4.7-.6.2-1.2.1-1.7-.3-.5-.4-.6-1.1-.3-1.6.7-1.1 2-1.8 3.6-2.1z" />
      </svg>
    )
  }
  return (
    <svg className={`w-4 h-4 shrink-0 ${strokeWhite || 'text-slate-700'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  )
}

function shortGrade(grade = '') {
  if (grade.includes('Organic')) return 'Organic'
  if (grade.includes('Grade B')) return 'Grade B'
  return 'Grade A'
}

/**
 * Marketplace catalog for Company Portal buyers featuring lush produce banner,
 * unified filters, category pills, grid/list view toggle, watchlist, and quick offer flow.
 */
export default function CompanyBrowse() {
  const {
    allListings,
    allOffers,
    farmersDirectory,
    companyProfile,
    markListingViewed,
    sendCompanyOffer,
  } = useCompany()

  const [searchParams, setSearchParams] = useSearchParams()
  const farmerFilterId = searchParams.get('farmer') || ''

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Products')
  const [district, setDistrict] = useState('All Districts')
  const [typeFilter, setTypeFilter] = useState('All Stock')
  const [sortBy, setSortBy] = useState('available_desc')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const [savedIds, setSavedIds] = useState(loadSavedIds)
  const [selectedListingId, setSelectedListingId] = useState(null)

  const selectedFarmer = farmersDirectory.find((f) => f.id === farmerFilterId)

  const openOffersByListing = useMemo(() => {
    const map = {}
    allOffers.forEach((offer) => {
      if (
        (offer.status === 'countered_by_farmer' || offer.status === 'pending_farmer') &&
        !map[offer.listingId]
      ) {
        map[offer.listingId] = offer
      }
    })
    return map
  }, [allOffers])

  const filteredListings = useMemo(() => {
    const q = search.trim().toLowerCase()

    const visible = allListings.filter((item) => {
      if (item.status === 'paused') return false
      if (farmerFilterId && item.farmerId !== farmerFilterId) return false
      if (category !== 'All Products' && getListingCategory(item) !== category) return false
      if (
        district !== 'All Districts' &&
        !item.location.toLowerCase().includes(district.toLowerCase())
      ) {
        return false
      }
      if (typeFilter !== 'All Stock' && item.type !== typeFilter) return false
      if (q) {
        const hay = `${item.productName} ${item.farmerName} ${item.location} ${item.grade}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })

    return [...visible].sort((a, b) => {
      const availA = Math.max(0, (a.quantity || 0) - (a.reservedQuantity || 0))
      const availB = Math.max(0, (b.quantity || 0) - (b.reservedQuantity || 0))
      if ((availA > 0) !== (availB > 0)) return availA > 0 ? -1 : 1

      if (sortBy === 'price_asc') return a.askingPrice - b.askingPrice
      if (sortBy === 'price_desc') return b.askingPrice - a.askingPrice
      return availB - availA
    })
  }, [allListings, farmerFilterId, category, district, typeFilter, search, sortBy])

  const selectedListing = allListings.find((l) => l.id === selectedListingId) || null

  const openListing = (item) => {
    markListingViewed(item.id)
    setSelectedListingId(item.id)
  }

  const toggleSaved = (e, id) => {
    e.stopPropagation()
    setSavedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      try {
        localStorage.setItem(SAVED_BATCHES_KEY, JSON.stringify(next))
      } catch {
        // Ignore storage quota issues
      }
      return next
    })
  }

  const resetAllFilters = () => {
    setSearch('')
    setCategory('All Products')
    setDistrict('All Districts')
    setTypeFilter('All Stock')
    setSearchParams({})
  }

  return (
    <div className="space-y-4">
      {/* Lush Produce Procurement Banner */}
      <section className="relative rounded-2xl overflow-hidden bg-[#123c1e] min-h-[92px] sm:min-h-[104px] flex items-center justify-between px-5 sm:px-6 py-3 shadow-xs">
        <img
          src="/hero/hero-desktop.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-[right_62%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#11391c] via-[#154422]/94 sm:via-[#154422]/85 to-[#154422]/20"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-xl">
          <h1 className="font-serif text-xl sm:text-2xl lg:text-[26px] font-bold text-white leading-tight tracking-tight">
            Source Fresh, Quality Produce
          </h1>
          <p className="mt-1 text-xs sm:text-sm font-bold text-[#9de67c]">
            Direct from Verified Kerala Farmers
          </p>
        </div>

        {selectedFarmer && (
          <div className="relative z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 text-[#143e22] text-xs font-semibold shadow-sm shrink-0">
            <span>Farmer: {selectedFarmer.name}</span>
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="underline text-[#184828] hover:text-slate-900 cursor-pointer"
            >
              Show All
            </button>
          </div>
        )}
      </section>

      {/* Unified Search + Filter Controls Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
        <div className="lg:col-span-5 relative">
          <svg
            className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search produce (e.g., Tapioca, Banana, Ginger...)"
            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs focus:outline-none focus:border-[#184828]"
          />
        </div>

        <div className="lg:col-span-7 grid grid-cols-3 gap-2">
          <div className="relative">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              aria-label="Filter by district"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-2xs focus:outline-none focus:border-[#184828]"
            >
              {KERALA_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by harvest availability"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-2xs focus:outline-none focus:border-[#184828]"
            >
              {TYPE_FILTERS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort produce listings"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-2xs focus:outline-none focus:border-[#184828]"
            >
              <option value="available_desc">Stock: High to Low</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pill Strip */}
      <div
        className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5"
        role="tablist"
        aria-label="Filter produce by category"
      >
        {PRODUCE_CATEGORIES.map((cat) => {
          const active = category === cat
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setCategory(cat)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-[13px] font-semibold border shrink-0 transition-all cursor-pointer ${
                active
                  ? 'bg-[#184828] text-white border-[#184828] shadow-xs'
                  : 'bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <CategoryIcon category={cat} active={active} />
              <span>{cat}</span>
            </button>
          )
        })}
      </div>

      {/* Sub-bar: Batch Count + Grid / List Switcher */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-600">
          {filteredListings.length} {filteredListings.length === 1 ? 'batch' : 'batches'} available
        </span>

        <div className="inline-flex rounded-xl bg-white p-0.5 border border-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'grid' ? 'bg-[#184828] text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-label="List view"
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              viewMode === 'list' ? 'bg-[#184828] text-white' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <circle cx="4" cy="6" r="1" />
              <circle cx="4" cy="12" r="1" />
              <circle cx="4" cy="18" r="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Results Area */}
      {filteredListings.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-2">
          <p className="font-serif text-base font-bold text-slate-900">No matching produce batches</p>
          <p className="text-xs text-slate-500">
            Try switching category tabs, clearing district filters, or searching another crop.
          </p>
          <button
            type="button"
            onClick={resetAllFilters}
            className="mt-2 px-4 py-1.5 rounded-xl bg-[#184828] text-white text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredListings.map((item) => {
            const available = Math.max(0, (item.quantity || 0) - (item.reservedQuantity || 0))
            const isSoldOut = available <= 0 || item.status === 'sold_out'
            const openOffer = openOffersByListing[item.id]
            const images = getListingImages(item)
            const isSaved = savedIds.includes(item.id)

            return (
              <article
                key={item.id}
                onClick={() => openListing(item)}
                className={`group rounded-2xl bg-white border border-[#e2e6e1] overflow-hidden shadow-2xs hover:shadow-md hover:border-[#184828]/35 transition-all cursor-pointer flex flex-col ${
                  isSoldOut ? 'opacity-65' : ''
                }`}
              >
                <div className="relative bg-slate-100">
                  <ListingPhotoSlider
                    images={images}
                    alt={item.productName}
                    aspectClass="aspect-[16/10]"
                    compact
                    onImageClick={() => openListing(item)}
                  />

                  <span
                    className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                      isSoldOut
                        ? 'bg-slate-900/90 text-white'
                        : item.type === 'Ready Stock'
                          ? 'bg-white/95 text-[#184828]'
                          : 'bg-amber-50/95 text-amber-800'
                    }`}
                  >
                    {isSoldOut ? 'Sold Out' : item.type === 'Ready Stock' ? 'Ready Stock' : 'Upcoming'}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => toggleSaved(e, item.id)}
                    aria-label={isSaved ? 'Remove from saved batches' : 'Save batch'}
                    className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full backdrop-blur-xs flex items-center justify-center transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-white text-rose-600 shadow-xs'
                        : 'bg-black/35 hover:bg-black/55 text-white'
                    }`}
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill={isSaved ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="2.1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />
                    </svg>
                  </button>
                </div>

                <div className="p-2.5 sm:p-3 flex-1 flex flex-col justify-between gap-2">
                  <div>
                    <h2 className="font-serif text-sm font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-[#184828]">
                      {item.productName}
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {item.farmerName} · {item.location}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200/70 text-[#184828] text-[10px] font-semibold">
                        {shortGrade(item.grade)}
                      </span>
                      <span className="text-[10.5px] text-slate-400 truncate">
                        {item.availableFrom}
                      </span>
                    </div>
                  </div>

                  <div className="pt-1.5 border-t border-slate-100 space-y-2">
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="text-sm sm:text-[15px] font-bold text-slate-900">
                        ₹{item.askingPrice}
                        <span className="text-[11px] font-normal text-slate-500">/{item.unit}</span>
                      </span>
                      <span className="text-[11px] sm:text-xs font-bold text-[#184828]">
                        {isSoldOut ? 'Sold out' : `${available} ${item.unit} left`}
                      </span>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100/80 flex items-center justify-between gap-2">
                      {openOffer ? (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold truncate ${
                            openOffer.status === 'countered_by_farmer'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-sky-50 text-sky-700 border border-sky-200'
                          }`}
                        >
                          {openOffer.status === 'countered_by_farmer'
                            ? `Counter ₹${openOffer.offeredPrice}`
                            : `Offered ₹${openOffer.offeredPrice}`}
                        </span>
                      ) : (
                        <span className="text-[10.5px] text-slate-400 truncate">
                          {item.companyViewed?.viewed ? 'Viewed' : 'New batch'}
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          openListing(item)
                        }}
                        className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer shrink-0 ${
                          isSoldOut
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-[#184828] hover:bg-[#12391f] text-white'
                        }`}
                      >
                        {isSoldOut ? 'Details' : 'Make Offer'}
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        /* Compact List Mode */
        <div className="rounded-2xl bg-white border border-[#e2e6e1] divide-y divide-slate-100 overflow-hidden shadow-2xs">
          {filteredListings.map((item) => {
            const available = Math.max(0, (item.quantity || 0) - (item.reservedQuantity || 0))
            const isSoldOut = available <= 0 || item.status === 'sold_out'
            const thumb = getListingImages(item)[0]
            return (
              <div
                key={item.id}
                onClick={() => openListing(item)}
                className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSoldOut ? 'opacity-65' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={item.productName}
                      className="w-14 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-12 rounded-xl bg-emerald-50 border border-emerald-100 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-serif text-sm sm:text-base font-bold text-slate-900 truncate">
                        {item.productName}
                      </h2>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-[#184828] text-[10px] font-semibold">
                        {shortGrade(item.grade)}
                      </span>
                      <span className="text-[11px] text-slate-500">{item.type}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">
                      {item.farmerName} · {item.location} · Available {item.availableFrom}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-bold text-slate-900">
                      ₹{item.askingPrice}/{item.unit}
                    </p>
                    <p className="text-xs font-semibold text-[#184828]">
                      {isSoldOut ? 'Sold out' : `${available} ${item.unit} left`}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      openListing(item)
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold cursor-pointer"
                  >
                    {isSoldOut ? 'Details' : 'Make Offer'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedListing && (
        <CompanyListingModal
          listing={selectedListing}
          initialPaymentMode={companyProfile.defaultPaymentMode}
          onClose={() => setSelectedListingId(null)}
          onSubmitOffer={sendCompanyOffer}
        />
      )}
    </div>
  )
}
