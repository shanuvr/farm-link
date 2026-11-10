import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ListingPhotoSlider from '../components/ListingPhotoSlider'
import { formatINR, getListingImages } from './farmerData'

const STATUS_BADGES = {
  active: { label: 'Active', cls: 'bg-[#e8f3e1] text-[#184828]' },
  paused: { label: 'Paused', cls: 'bg-[#f6eee0] text-[#7a4b1e]' },
  sold_out: { label: 'Fully Reserved', cls: 'bg-[#ebe6d9] text-[#465a48]' },
}

export default function ListingDetailModal({
  listing,
  offers = [],
  onClose,
  onSaveEdit,
  onToggleStatus,
  onDelete,
}) {
  const [editing, setEditing] = useState(false)
  const [editValues, setEditValues] = useState({
    askingPrice: String(listing?.askingPrice || ''),
    quantity: String(listing?.quantity || ''),
  })
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  if (!listing) return null

  const images = getListingImages(listing)

  const available = Math.max(0, listing.quantity - listing.reservedQuantity)
  const reservedPct =
    listing.quantity > 0 ? Math.round((listing.reservedQuantity / listing.quantity) * 100) : 0
  const badge = STATUS_BADGES[listing.status] || STATUS_BADGES.active

  const linkedOffers = offers.filter((o) => o.listingId === listing.id)
  const pendingOffers = linkedOffers.filter((o) => o.status === 'pending_farmer')

  const handleSave = () => {
    const price = Number(editValues.askingPrice)
    const qty = Number(editValues.quantity)
    if (!price || price <= 0 || !qty || qty < listing.reservedQuantity) return
    onSaveEdit(listing, price, qty)
    setEditing(false)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="listing-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#fffdf8] border border-[#e5dcbd] rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90dvh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Photo Slider */}
        <div className="relative">
          <ListingPhotoSlider
            images={images}
            alt={listing.productName}
            aspectClass="aspect-[16/9]"
          />

          <span
            className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold shadow-xs ${badge.cls}`}
          >
            {badge.label}
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close listing details"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/55 hover:bg-black/75 text-white flex items-center justify-center backdrop-blur-xs transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-4 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2
                id="listing-modal-title"
                className="font-serif text-lg sm:text-xl font-bold text-[#143e22] leading-tight"
              >
                {listing.productName}
              </h2>
              <p className="mt-0.5 text-xs text-[#465a48]">
                <span className="font-semibold text-[#5d281f]">{listing.type}</span> · {listing.grade}
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="font-serif text-lg sm:text-xl font-bold text-[#143e22]">
                ₹{listing.askingPrice}
                <span className="text-xs font-sans font-normal text-[#5e7160]">/{listing.unit}</span>
              </p>
              <p className="text-[11px] text-[#5e7160]">
                {formatINR(listing.askingPrice * available)} left
              </p>
            </div>
          </div>

          {/* Stock Breakdown */}
          <div className="rounded-xl bg-[#fbf8f1] border border-[#ede5d2] px-3 py-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="text-[#143e22]">
                <strong>{available} {listing.unit}</strong> available
              </span>
              <span className="text-[#5e7160]">
                {listing.reservedQuantity} {listing.unit} reserved / {listing.quantity} {listing.unit} total
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-[#e6dec9] overflow-hidden">
              <div
                className="h-full bg-[#184828] rounded-full transition-all"
                style={{ width: `${reservedPct}%` }}
              />
            </div>
          </div>

          {/* Key Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-xl bg-[#fbf8f1] border border-[#f0e9d9] px-2.5 py-2">
              <p className="text-[10px] text-[#6d7d6f]">Farm Location</p>
              <p className="mt-0.5 font-semibold text-[#143e22]">{listing.location}</p>
            </div>
            <div className="rounded-xl bg-[#fbf8f1] border border-[#f0e9d9] px-2.5 py-2">
              <p className="text-[10px] text-[#6d7d6f]">Company Status</p>
              {listing.companyViewed?.viewed ? (
                <p className="mt-0.5 font-semibold text-[#244e82]">
                  Viewed ({listing.companyViewed.viewedAt})
                </p>
              ) : (
                <p className="mt-0.5 font-semibold text-[#7c8c7e]">Not viewed yet</p>
              )}
            </div>
            <div className="rounded-xl bg-[#fbf8f1] border border-[#f0e9d9] px-2.5 py-2">
              <p className="text-[10px] text-[#6d7d6f]">Harvest Date</p>
              <p className="mt-0.5 font-semibold text-[#143e22]">{listing.harvestDate}</p>
            </div>
            <div className="rounded-xl bg-[#fbf8f1] border border-[#f0e9d9] px-2.5 py-2">
              <p className="text-[10px] text-[#6d7d6f]">Available From</p>
              <p className="mt-0.5 font-semibold text-[#143e22]">{listing.availableFrom}</p>
            </div>
          </div>

          {listing.notes && (
            <div className="text-xs text-[#465a48] leading-snug bg-[#fbf8f1]/70 rounded-xl border border-[#f0e9d9] px-3 py-2">
              <span className="font-semibold text-[#143e22]">Notes: </span>
              {listing.notes}
            </div>
          )}

          {pendingOffers.length > 0 && (
            <div className="rounded-xl bg-[#fdf3f2] border border-[#efc7c2] px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-[#9a2e1a]">
                {pendingOffers.length} company offer waiting (₹{pendingOffers[0].offeredPrice}/{listing.unit})
              </span>
              <Link
                to="/farmers/offers"
                onClick={onClose}
                className="font-bold text-[#9a2e1a] underline shrink-0"
              >
                Negotiate →
              </Link>
            </div>
          )}

          {/* Inline Edit Panel */}
          {editing ? (
            <div className="rounded-xl bg-[#fbf8f1] border border-[#d9ceb4] p-3 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-[#143e22] mb-1">
                    Price (₹/{listing.unit})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={editValues.askingPrice}
                    onChange={(e) => setEditValues((prev) => ({ ...prev, askingPrice: e.target.value }))}
                    className="w-full rounded-lg border border-[#dcd2b8] bg-white px-2.5 py-1.5 text-sm text-[#143e22]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-[#143e22] mb-1">
                    Total Qty ({listing.unit}, min {listing.reservedQuantity})
                  </label>
                  <input
                    type="number"
                    min={Math.max(1, listing.reservedQuantity)}
                    value={editValues.quantity}
                    onChange={(e) => setEditValues((prev) => ({ ...prev, quantity: e.target.value }))}
                    className="w-full rounded-lg border border-[#dcd2b8] bg-white px-2.5 py-1.5 text-sm text-[#143e22]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#dcd2b8] text-xs font-semibold text-[#465a48] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-3.5 py-1.5 rounded-lg bg-[#184828] text-white text-xs font-semibold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-2 border-t border-[#ede5d2] flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditValues({
                      askingPrice: String(listing.askingPrice),
                      quantity: String(listing.quantity),
                    })
                    setEditing(true)
                  }}
                  className="px-3 py-1.5 rounded-xl border border-[#dcd2b8] bg-[#fbf8f1] hover:bg-[#efe8d6] text-xs font-semibold text-[#143e22] cursor-pointer"
                >
                  Edit
                </button>
                {listing.status !== 'sold_out' && (
                  <button
                    type="button"
                    onClick={() => onToggleStatus(listing.id)}
                    className="px-3 py-1.5 rounded-xl border border-[#dcd2b8] bg-[#fbf8f1] hover:bg-[#efe8d6] text-xs font-semibold text-[#5d281f] cursor-pointer"
                  >
                    {listing.status === 'paused' ? 'Resume' : 'Pause'}
                  </button>
                )}
                {confirmDelete ? (
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(listing.id)
                      onClose()
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#b91c1c] text-white text-xs font-semibold cursor-pointer"
                  >
                    Confirm Delete
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#991b1b] hover:bg-[#fceae6] cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
