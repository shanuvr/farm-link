import { useState } from 'react'
import { Link } from 'react-router-dom'
import ListingPhotoSlider from '../components/ListingPhotoSlider'
import { formatINR, getListingImages } from '../farmers/farmerData'
import { PAYMENT_MODES } from './companyData'

/**
 * Produce detail and structured bid modal for Company Portal buyers.
 */
export default function CompanyListingModal({
  listing,
  onClose,
  initialPaymentMode,
  onSubmitOffer,
}) {
  const available = Math.max(0, (listing.quantity || 0) - (listing.reservedQuantity || 0))
  const isSoldOut = available <= 0 || listing.status === 'sold_out'
  const images = getListingImages(listing)

  const [offeredPrice, setOfferedPrice] = useState(listing.askingPrice || 0)
  const [quantity, setQuantity] = useState(available > 0 ? Math.min(50, available) : 0)
  const [paymentPreference, setPaymentPreference] = useState(
    initialPaymentMode || PAYMENT_MODES[0]
  )
  const [validityHours, setValidityHours] = useState(24)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const cleanPrice = Number(offeredPrice)
    const cleanQty = Number(quantity)

    if (!cleanPrice || cleanPrice <= 0) {
      setError('Enter a valid offer price per unit.')
      return
    }
    if (!cleanQty || cleanQty <= 0 || cleanQty > available) {
      setError(`Quantity must be between 1 and ${available} ${listing.unit}.`)
      return
    }

    setError('')
    onSubmitOffer({
      listingId: listing.id,
      offeredPrice: cleanPrice,
      quantity: cleanQty,
      paymentPreference,
      validityHours,
    })
    setSubmitted(true)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/50 backdrop-blur-xs p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="company-listing-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-2xl bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92dvh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#184828]">
              {listing.type} · {listing.grade}
            </p>
            <h2
              id="company-listing-modal-title"
              className="font-serif text-xl font-bold text-slate-900 leading-tight"
            >
              {listing.productName}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close listing details"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Produce Photo Slider + Farm Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
              <ListingPhotoSlider
                images={images}
                alt={listing.productName}
                aspectClass="aspect-[4/3]"
              />
            </div>

            <div className="bg-[#f8faf8] border border-[#e5e9e4] rounded-2xl p-4 flex flex-col justify-between gap-3">
              <div className="space-y-2.5">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">Farmer Asking Price</span>
                  <span className="font-serif text-xl font-bold text-slate-900">
                    ₹{listing.askingPrice}
                    <span className="text-xs font-sans font-normal text-slate-500">
                      /{listing.unit}
                    </span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-slate-200/70 pt-2">
                  <span className="text-slate-500">Available Stock</span>
                  <span className="font-semibold text-[#184828]">
                    {isSoldOut ? 'Sold out' : `${available} ${listing.unit} left`}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-slate-200/70 pt-2">
                  <span className="text-slate-500">Harvest / Ready</span>
                  <span className="font-medium text-slate-800">{listing.availableFrom}</span>
                </div>

                <div className="flex items-center justify-between text-xs border-t border-slate-200/70 pt-2">
                  <span className="text-slate-500">Farm Location</span>
                  <span className="font-medium text-slate-800 text-right">{listing.location}</span>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate">{listing.farmerName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{listing.farmerPhone}</p>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold shrink-0">
                  Verified Farm
                </span>
              </div>
            </div>
          </div>

          {listing.notes && (
            <div className="bg-[#f8faf8] border border-[#e5e9e4] rounded-xl px-4 py-2.5 text-xs text-slate-600">
              <span className="font-semibold text-slate-900">Farmer Notes: </span>
              {listing.notes}
            </div>
          )}

          {/* Make Price Offer Form */}
          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2.5">
              <p className="text-sm font-bold text-emerald-900">
                Offer Sent to {listing.farmerName}
              </p>
              <p className="text-xs text-emerald-800">
                Proposed ₹{offeredPrice}/{listing.unit} for {quantity} {listing.unit} ({paymentPreference}).
                Synced live to the Farmer Portal and your Negotiations queue.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Link
                  to="/company/offers"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold"
                >
                  View in Negotiations →
                </Link>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          ) : isSoldOut ? (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center text-xs text-slate-600">
              All stock in this batch is currently reserved or sold out.
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="font-serif text-base font-bold text-slate-900">
                  Send Procurement Offer
                </h3>
                <span className="text-xs font-bold text-[#184828]">
                  Est. Total: {formatINR((Number(offeredPrice) || 0) * (Number(quantity) || 0))}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Offered Price (₹ / {listing.unit})
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setOfferedPrice((p) => Math.max(1, Number(p) - 2))}
                      className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 cursor-pointer"
                    >
                      -2
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={offeredPrice}
                      onChange={(e) => setOfferedPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setOfferedPrice((p) => Number(p) + 2)}
                      className="px-2.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800 cursor-pointer"
                    >
                      +2
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantity Needed ({listing.unit}, max {available})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={available}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-900 focus:outline-none focus:border-slate-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Arrangement
                  </label>
                  <select
                    value={paymentPreference}
                    onChange={(e) => setPaymentPreference(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-500"
                  >
                    {PAYMENT_MODES.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Offer Validity
                  </label>
                  <select
                    value={validityHours}
                    onChange={(e) => setValidityHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-slate-500"
                  >
                    <option value={24}>24 Hours</option>
                    <option value={48}>48 Hours</option>
                    <option value={72}>72 Hours</option>
                  </select>
                </div>
              </div>

              {error && <p className="text-xs font-medium text-rose-700">{error}</p>}

              <div className="flex items-center justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  Submit Offer ({formatINR((Number(offeredPrice) || 0) * (Number(quantity) || 0))})
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
