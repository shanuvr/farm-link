import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ListingPhotoSlider from '../components/ListingPhotoSlider'
import { useCompany } from '../context/companyContextStore'
import { getListingImages } from '../farmers/farmerData'
import { KERALA_DISTRICTS } from './companyData'
import CompanyListingModal from './CompanyListingModal'

const TYPE_FILTERS = ['All Stock', 'Ready Stock', 'Upcoming Harvest']

/**
 * Marketplace catalog for Company Portal buyers to discover, inspect, and bid on produce.
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
  const [district, setDistrict] = useState('All Districts')
  const [typeFilter, setTypeFilter] = useState('All Stock')
  const [sortBy, setSortBy] = useState('available_desc')
  const [selectedListingId, setSelectedListingId] = useState(null)

  const selectedFarmer = farmersDirectory.find((f) => f.id === farmerFilterId)

  const openOffersByListing = useMemo(() => {
    const map = {}
    allOffers.forEach((offer) => {
      if (offer.status === 'countered_by_farmer' || offer.status === 'pending_farmer') {
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
  }, [allListings, farmerFilterId, district, typeFilter, search, sortBy])

  const selectedListing = allListings.find((l) => l.id === selectedListingId) || null

  const openListing = (item) => {
    markListingViewed(item.id)
    setSelectedListingId(item.id)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Browse Farmer Produce
          </h1>
          <p className="mt-0.5 text-xs text-slate-600">
            Inspect verified Kerala harvests and submit structured procurement bids.
          </p>
        </div>

        {selectedFarmer && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold self-start">
            <span>Farmer: {selectedFarmer.name}</span>
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="underline text-slate-300 hover:text-white cursor-pointer"
            >
              Show All
            </button>
          </div>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-[#e2e6e1] rounded-2xl p-3 sm:p-4 space-y-3 shadow-2xs">
        <div className="flex flex-col md:flex-row gap-2.5">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crop, farmer name, or village..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 bg-[#f8faf8] text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-500"
          />

          <div className="flex gap-2">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              aria-label="Filter by district"
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-500"
            >
              {KERALA_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort produce listings"
              className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-500"
            >
              <option value="available_desc">Stock: High to Low</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {TYPE_FILTERS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                  typeFilter === t
                    ? 'bg-[#1e293b] text-white border-[#1e293b]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-medium text-slate-500">
            {filteredListings.length} {filteredListings.length === 1 ? 'batch' : 'batches'} available
          </span>
        </div>
      </div>

      {/* Produce Cards Grid */}
      {filteredListings.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-300 rounded-2xl p-8 text-center space-y-2">
          <p className="font-serif text-base font-bold text-slate-900">No matching produce batches</p>
          <p className="text-xs text-slate-500">
            Try clearing your district filter or searching for another crop.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch('')
              setDistrict('All Districts')
              setTypeFilter('All Stock')
              setSearchParams({})
            }}
            className="mt-2 px-4 py-1.5 rounded-xl bg-[#1e293b] text-white text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          {filteredListings.map((item) => {
            const available = Math.max(0, (item.quantity || 0) - (item.reservedQuantity || 0))
            const isSoldOut = available <= 0 || item.status === 'sold_out'
            const openOffer = openOffersByListing[item.id]
            const images = getListingImages(item)

            return (
              <article
                key={item.id}
                onClick={() => openListing(item)}
                className={`group rounded-2xl bg-white border border-[#e2e6e1] overflow-hidden shadow-2xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col ${
                  isSoldOut ? 'opacity-65' : ''
                }`}
              >
                <div className="relative bg-slate-100">
                  <ListingPhotoSlider
                    images={images}
                    alt={item.productName}
                    aspectClass="aspect-[4/3]"
                    compact
                    onImageClick={() => openListing(item)}
                  />
                  <span
                    className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                      isSoldOut
                        ? 'bg-slate-800/90 text-white'
                        : item.type === 'Ready Stock'
                          ? 'bg-emerald-50/95 text-emerald-800'
                          : 'bg-amber-50/95 text-amber-800'
                    }`}
                  >
                    {isSoldOut ? 'Sold Out' : item.type === 'Ready Stock' ? 'Ready Stock' : 'Upcoming'}
                  </span>
                </div>

                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between gap-2.5">
                  <div>
                    <h2 className="font-serif text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-1 group-hover:text-[#184828]">
                      {item.productName}
                    </h2>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {item.farmerName} · {item.location}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {item.grade.split(' ')[0] === 'Organic' ? 'Organic' : 'Grade A'}
                      </span>
                      <span className="text-[10.5px] text-slate-400 truncate">
                        {item.availableFrom}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="text-sm sm:text-base font-bold text-slate-900">
                        ₹{item.askingPrice}
                        <span className="text-[11px] font-normal text-slate-500">/{item.unit}</span>
                      </span>
                      <span className="text-[11px] sm:text-xs font-semibold text-[#184828]">
                        {isSoldOut ? 'Sold out' : `${available} ${item.unit} left`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      {openOffer ? (
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold ${
                            openOffer.status === 'countered_by_farmer'
                              ? 'bg-amber-50 text-amber-800'
                              : 'bg-sky-50 text-sky-700'
                          }`}
                        >
                          {openOffer.status === 'countered_by_farmer'
                            ? `Counter ₹${openOffer.offeredPrice}`
                            : `Offered ₹${openOffer.offeredPrice}`}
                        </span>
                      ) : (
                        <span className="text-slate-400">
                          {item.companyViewed?.viewed ? 'Viewed' : 'New batch'}
                        </span>
                      )}

                      <span className="font-semibold text-[#184828] group-hover:underline">
                        {isSoldOut ? 'Details →' : 'Make Offer →'}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
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
