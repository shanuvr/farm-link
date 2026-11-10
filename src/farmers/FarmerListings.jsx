import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import ListingPhotoSlider from '../components/ListingPhotoSlider'
import { useFarmer } from '../context/farmerContextStore'
import { getListingImages } from './farmerData'
import ListingDetailModal from './ListingDetailModal'

const STATUS_BADGES = {
  active: { label: 'Active', cls: 'bg-[#e8f3e1]/95 text-[#184828]' },
  paused: { label: 'Paused', cls: 'bg-[#f6eee0]/95 text-[#7a4b1e]' },
  sold_out: { label: 'Reserved', cls: 'bg-[#ebe6d9]/95 text-[#465a48]' },
}

function shortGrade(grade = '') {
  if (grade.includes('Grade A')) return 'Grade A'
  if (grade.includes('Grade B')) return 'Grade B'
  if (grade.toLowerCase().includes('organic')) return 'Organic'
  return grade
}

export default function FarmerListings() {
  const { listings, offers, updateListing, toggleListingStatus, deleteListing } = useFarmer()
  const location = useLocation()

  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [selectedListingId, setSelectedListingId] = useState(null)

  const createdName = location.state?.createdName
  const selectedListing = listings.find((l) => l.id === selectedListingId) || null

  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      !search.trim() ||
      item.productName.toLowerCase().includes(search.trim().toLowerCase()) ||
      item.location.toLowerCase().includes(search.trim().toLowerCase())

    if (!matchesSearch) return false
    if (filter === 'Ready Stock') return item.type === 'Ready Stock' && item.status === 'active'
    if (filter === 'Upcoming Harvest') return item.type === 'Upcoming Harvest' && item.status === 'active'
    if (filter === 'Paused / Sold Out') return item.status !== 'active'
    return true
  })

  const handleSaveEdit = (item, price, qty) => {
    updateListing(item.id, {
      askingPrice: price,
      quantity: qty,
      status: qty <= item.reservedQuantity ? 'sold_out' : item.status === 'sold_out' ? 'active' : item.status,
    })
  }

  return (
    <div className="space-y-4">
      {/* Header Row */}
      <div>
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#143e22]">
          My Produce Listings
        </h1>
        <p className="mt-0.5 text-xs text-[#5e7160]">
          Swipe photos or tap any listing card to view full details, edit, or manage stock.
        </p>
      </div>

      {createdName && (
        <div className="rounded-xl bg-[#eef7e9] border border-[#b9dcac] px-3.5 py-2 text-xs text-[#143e22] font-medium">
          Published <strong>{createdName}</strong> — visible to the purchasing company.
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex flex-wrap gap-1.5">
          {['All', 'Ready Stock', 'Upcoming Harvest', 'Paused / Sold Out'].map((tab) => {
            const active = filter === tab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#184828] text-white border-[#184828]'
                    : 'bg-[#fffdf8] text-[#465a48] border-[#e2d8c1] hover:border-[#184828]'
                }`}
              >
                {tab}
              </button>
            )
          })}
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search produce..."
          className="w-full sm:w-56 rounded-xl border border-[#dcd2b8] bg-[#fffdf8] px-3 py-1.5 text-base sm:text-xs text-[#143e22] placeholder:text-[#7c8c7e] focus:outline-none focus:border-[#184828]"
        />
      </div>

      {/* 2-Card-Per-Row Mobile Grid -> 3-4 Cols Desktop */}
      {filteredListings.length === 0 ? (
        <div className="rounded-2xl bg-[#fffdf8] border border-dashed border-[#dcd2b8] p-8 text-center">
          <p className="font-serif text-base font-bold text-[#143e22]">No matching listings found</p>
          <p className="mt-1 text-xs text-[#5e7160]">
            Try switching filters or add a new produce listing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
          {filteredListings.map((item) => {
            const images = getListingImages(item)
            const available = Math.max(0, item.quantity - item.reservedQuantity)
            const reservedPct = item.quantity > 0 ? Math.round((item.reservedQuantity / item.quantity) * 100) : 0
            const badge = STATUS_BADGES[item.status] || STATUS_BADGES.active
            const pendingOfferCount = offers.filter(
              (o) => o.listingId === item.id && o.status === 'pending_farmer'
            ).length

            return (
              <article
                key={item.id}
                onClick={() => setSelectedListingId(item.id)}
                className="rounded-2xl bg-[#fffdf8] border border-[#e5dcbd] overflow-hidden shadow-2xs hover:border-[#184828]/45 hover:shadow-md transition-all flex flex-col cursor-pointer"
              >
                {/* Photo Carousel Header */}
                <div className="relative">
                  <ListingPhotoSlider
                    images={images}
                    alt={item.productName}
                    aspectClass="aspect-[4/3]"
                    compact
                    onImageClick={() => setSelectedListingId(item.id)}
                  />
                  <span
                    className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9.5px] sm:text-[10px] font-semibold shadow-2xs backdrop-blur-xs pointer-events-none ${badge.cls}`}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* Card Details Body */}
                <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between gap-2">
                  <div>
                    <h2 className="font-serif text-[13px] sm:text-[15px] font-bold text-[#143e22] leading-snug line-clamp-1">
                      {item.productName}
                    </h2>

                    {/* Quality Grade & Availability Type */}
                    <div className="mt-1 flex items-center gap-1 flex-wrap">
                      <span className="px-1.5 py-0.2 rounded bg-[#eef6e8] border border-[#d2e4c7] text-[9.5px] sm:text-[10.5px] font-semibold text-[#184828]">
                        {shortGrade(item.grade)}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-[#5e7160] truncate">
                        · {item.type}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-baseline justify-between gap-1 flex-wrap">
                      <span className="text-sm sm:text-base font-bold text-[#143e22]">
                        ₹{item.askingPrice}
                        <span className="text-[10px] sm:text-xs font-normal text-[#5e7160]">/{item.unit}</span>
                      </span>
                      <span className="text-[10px] sm:text-[11px] font-medium text-[#465a48]">
                        <strong className="text-[#143e22]">{available}</strong>/{item.quantity} {item.unit}
                      </span>
                    </div>

                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#ebe4d3] overflow-hidden">
                      <div
                        className="h-full bg-[#184828] rounded-full transition-all"
                        style={{ width: `${reservedPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Single-Company Viewed Status & Offer Shortcut */}
                  <div className="pt-1.5 border-t border-[#f0e9d9] flex items-center justify-between gap-1 text-[10px] sm:text-[11px]">
                    {item.companyViewed?.viewed ? (
                      <span className="inline-flex items-center gap-1 text-[#244e82] font-semibold">
                        <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>Viewed</span>
                      </span>
                    ) : (
                      <span className="text-[#7c8c7e] font-medium">Not viewed</span>
                    )}

                    {pendingOfferCount > 0 ? (
                      <Link
                        to="/farmers/offers"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2 py-0.5 rounded-full bg-[#fceae6] text-[#9a2e1a] font-bold hover:bg-[#f7d8d1] transition-colors truncate"
                      >
                        {pendingOfferCount} Offer →
                      </Link>
                    ) : (
                      <span className="text-[#5e7160] font-medium truncate">Details →</span>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* Detailed View Popup Modal */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          offers={offers}
          onClose={() => setSelectedListingId(null)}
          onSaveEdit={handleSaveEdit}
          onToggleStatus={toggleListingStatus}
          onDelete={deleteListing}
        />
      )}
    </div>
  )
}
