import { useState } from 'react'
import { Link } from 'react-router-dom'
import AcceptOfferModal from '../components/AcceptOfferModal'
import { useFarmer } from '../context/farmerContextStore'
import { formatINR, REJECT_REASONS } from './farmerData'
import ProduceThumb from './ProduceThumb'

const OFFER_STATUS_BADGES = {
  pending_farmer: { label: 'Offer Received', cls: 'bg-[#fceae6] text-[#9a2e1a]' },
  countered_by_farmer: { label: 'Countered', cls: 'bg-[#fef3c7] text-[#92400e]' },
  accepted: { label: 'Accepted', cls: 'bg-[#e8f3e1] text-[#184828]' },
  rejected: { label: 'Declined', cls: 'bg-[#f1ece2] text-[#6b7280]' },
}

export default function FarmerOffers() {
  const { offers, acceptOffer, counterOffer, rejectOffer } = useFarmer()

  const [tab, setTab] = useState('action')
  const [counterId, setCounterId] = useState(null)
  const [counterForm, setCounterForm] = useState({ price: '', quantity: '' })
  const [rejectId, setRejectId] = useState(null)
  const [rejectReason, setRejectReason] = useState(REJECT_REASONS[0])
  const [justAcceptedName, setJustAcceptedName] = useState('')
  const [acceptingOffer, setAcceptingOffer] = useState(null)

  const actionCount = offers.filter((o) => o.status === 'pending_farmer').length
  const counteredCount = offers.filter((o) => o.status === 'countered_by_farmer').length
  const historyCount = offers.filter((o) => o.status === 'accepted' || o.status === 'rejected').length

  const visibleOffers = offers.filter((o) => {
    if (tab === 'action') return o.status === 'pending_farmer'
    if (tab === 'countered') return o.status === 'countered_by_farmer'
    return o.status === 'accepted' || o.status === 'rejected'
  })

  const openCounter = (offer) => {
    setRejectId(null)
    setCounterId(offer.id)
    setCounterForm({
      price: String(Math.round((offer.offeredPrice + offer.askingPrice) / 2)),
      quantity: String(offer.quantity),
    })
  }

  const submitCounter = (offer) => {
    const price = Number(counterForm.price)
    const qty = Number(counterForm.quantity)
    if (!price || price <= 0 || !qty || qty <= 0) return

    counterOffer(offer.id, price, qty)
    setCounterId(null)
    setTab('countered')
  }

  const handleAccept = (offer) => {
    setAcceptingOffer(offer)
  }

  const handleConfirmAccept = (options) => {
    if (!acceptingOffer) return
    acceptOffer(acceptingOffer.id, options)
    setCounterId(null)
    setRejectId(null)
    setJustAcceptedName(acceptingOffer.productName)
    setAcceptingOffer(null)
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#143e22]">
          Company Offers &amp; Negotiation
        </h1>
        <p className="mt-0.5 text-xs text-[#5e7160]">
          Review offers from the purchasing company and negotiate your final selling price.
        </p>
      </div>

      {justAcceptedName && (
        <div className="rounded-xl bg-[#eef7e9] border border-[#b9dcac] px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-[#143e22]">
          <span>
            Deal accepted for <strong>{justAcceptedName}</strong> — confirmed order created.
          </span>
          <Link to="/farmers/orders" className="font-bold text-[#184828] underline shrink-0">
            View Confirmed →
          </Link>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {[
          { id: 'action', label: 'Action Needed', count: actionCount },
          { id: 'countered', label: 'Countered', count: counteredCount },
          { id: 'history', label: 'History', count: historyCount },
        ].map((item) => {
          const active = tab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                active
                  ? 'bg-[#184828] text-white border-[#184828]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-[#184828]'
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`px-1.5 rounded-full text-[10px] font-bold ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-100 text-[#143e22]'
                }`}
              >
                {item.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* 2-Column Compact Offer Cards on Desktop */}
      {visibleOffers.length === 0 ? (
        <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-8 text-center">
          <p className="font-serif text-base font-bold text-[#143e22]">No offers in this tab</p>
          <p className="mt-1 text-xs text-[#5e7160]">
            {tab === 'action'
              ? 'All incoming company offers have been handled.'
              : 'Your negotiation history will appear here.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-start">
          {visibleOffers.map((offer) => {
            const badge = OFFER_STATUS_BADGES[offer.status] || OFFER_STATUS_BADGES.pending_farmer
            const totalValue = offer.offeredPrice * offer.quantity
            const diff = offer.offeredPrice - offer.askingPrice
            const isCountering = counterId === offer.id
            const isRejecting = rejectId === offer.id

            return (
              <article
                key={offer.id}
                className="rounded-2xl bg-white border border-[#e2e6e1] p-4 shadow-2xs space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ProduceThumb name={offer.productName} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h2 className="font-serif text-base font-bold text-[#143e22] truncate">
                          {offer.productName}
                        </h2>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.cls}`}>
                          {badge.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#5e7160] truncate">
                        {offer.companyName} · {offer.paymentPreference}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 shrink-0">
                    {offer.expiresIn}
                  </span>
                </div>

                {/* Price & Quantity Comparison */}
                <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#f8faf8] border border-[#e5e9e4] px-3 py-2">
                  <div>
                    <p className="text-[10px] text-[#5e7160] font-medium">Asking Price</p>
                    <p className="font-serif text-sm sm:text-base font-bold text-[#465a48]">
                      ₹{offer.askingPrice}/{offer.unit}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#5e7160] font-medium">
                      {offer.status === 'countered_by_farmer' ? 'Your Counter' : 'Offer Price'}
                    </p>
                    <p className="font-serif text-sm sm:text-base font-bold text-[#143e22]">
                      ₹{offer.offeredPrice}/{offer.unit}{' '}
                      <span className={`text-[10px] font-sans font-semibold ${diff >= 0 ? 'text-[#184828]' : 'text-[#9a2e1a]'}`}>
                        ({diff >= 0 ? `+₹${diff}` : `-₹${Math.abs(diff)}`})
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#5e7160] font-medium">Total ({offer.quantity} {offer.unit})</p>
                    <p className="font-serif text-sm sm:text-base font-bold text-[#143e22]">
                      {formatINR(totalValue)}
                    </p>
                  </div>
                </div>

                {/* Compact Negotiation Timeline */}
                <div className="space-y-1 border-l-2 border-[#dce8d2] pl-2.5">
                  {offer.history.map((round) => (
                    <div key={round.id} className="flex items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            round.actor === 'farmer' ? 'bg-[#184828]' : 'bg-[#5d281f]'
                          }`}
                        />
                        <span className="font-semibold text-[#143e22] truncate">{round.label}:</span>
                        <span className="text-[#2c4030] shrink-0">
                          ₹{round.price} × {round.quantity} {offer.unit}
                        </span>
                      </div>
                      <span className="text-[10px] text-[#6d7d6f] shrink-0">{round.time}</span>
                    </div>
                  ))}
                </div>

                {/* Inline Bargaining Drawer (Counteroffer) */}
                {isCountering && (
                  <div className="rounded-xl bg-[#f4f9f0] border border-[#b9dcac] p-3 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-serif font-bold text-[#143e22]">Propose Counteroffer</span>
                      <span className="font-semibold text-[#184828]">
                        Total: {formatINR((Number(counterForm.price) || 0) * (Number(counterForm.quantity) || 0))}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10.5px] font-semibold text-[#143e22] mb-1">
                          Price (₹/{offer.unit})
                        </label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setCounterForm((prev) => ({
                                ...prev,
                                price: String(Math.max(1, (Number(prev.price) || 0) - 2)),
                              }))
                            }
                            className="px-2 py-1 rounded-lg border border-[#c7dbbd] bg-white text-[11px] font-bold text-[#143e22] cursor-pointer"
                          >
                            -2
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={counterForm.price}
                            onChange={(e) => setCounterForm((prev) => ({ ...prev, price: e.target.value }))}
                            className="w-full rounded-lg border border-[#c7dbbd] bg-white px-2 py-1 text-sm font-semibold text-center text-[#143e22]"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setCounterForm((prev) => ({
                                ...prev,
                                price: String((Number(prev.price) || 0) + 2),
                              }))
                            }
                            className="px-2 py-1 rounded-lg border border-[#c7dbbd] bg-white text-[11px] font-bold text-[#143e22] cursor-pointer"
                          >
                            +2
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10.5px] font-semibold text-[#143e22] mb-1">
                          Quantity ({offer.unit})
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={counterForm.quantity}
                          onChange={(e) => setCounterForm((prev) => ({ ...prev, quantity: e.target.value }))}
                          className="w-full rounded-lg border border-[#c7dbbd] bg-white px-2.5 py-1 text-sm font-semibold text-[#143e22]"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setCounterId(null)}
                        className="px-3 py-1 rounded-lg border border-[#c7dbbd] bg-white text-xs font-semibold text-[#465a48] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => submitCounter(offer)}
                        className="px-3.5 py-1 rounded-lg bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold cursor-pointer"
                      >
                        Send Counter
                      </button>
                    </div>
                  </div>
                )}

                {/* Inline Decline Confirmation */}
                {isRejecting && (
                  <div className="rounded-xl bg-[#fdf3f2] border border-[#efc7c2] p-3 space-y-2">
                    <p className="text-[11px] font-semibold text-[#7f1d1d]">Reason for declining:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {REJECT_REASONS.map((reason) => (
                        <button
                          key={reason}
                          type="button"
                          onClick={() => setRejectReason(reason)}
                          className={`px-2 py-0.5 rounded-full text-[10.5px] font-medium border cursor-pointer ${
                            rejectReason === reason
                              ? 'bg-[#991b1b] text-white border-[#991b1b]'
                              : 'bg-white text-[#5a2a2a] border-[#e7c4bf]'
                          }`}
                        >
                          {reason}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-end gap-2 pt-0.5">
                      <button
                        type="button"
                        onClick={() => setRejectId(null)}
                        className="px-2.5 py-1 rounded-lg border border-[#e7c4bf] bg-white text-xs font-semibold text-[#465a48] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          rejectOffer(offer.id, rejectReason)
                          setRejectId(null)
                        }}
                        className="px-3 py-1 rounded-lg bg-[#991b1b] text-white text-xs font-semibold cursor-pointer"
                      >
                        Confirm Decline
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary Bargaining Actions */}
                {offer.status === 'pending_farmer' && !isCountering && !isRejecting && (
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleAccept(offer)}
                      className="flex-1 px-3.5 py-1.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      Accept ₹{offer.offeredPrice}/{offer.unit}
                    </button>
                    <button
                      type="button"
                      onClick={() => openCounter(offer)}
                      className="flex-1 px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-[#1e293b] hover:text-white text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Counteroffer
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCounterId(null)
                        setRejectId(offer.id)
                      }}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-[#991b1b] hover:bg-[#fceae6] transition-colors cursor-pointer"
                    >
                      Decline
                    </button>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}

      {acceptingOffer && (
        <AcceptOfferModal
          key={acceptingOffer.id}
          offer={acceptingOffer}
          role="farmer"
          onClose={() => setAcceptingOffer(null)}
          onConfirm={handleConfirmAccept}
        />
      )}
    </div>
  )
}
