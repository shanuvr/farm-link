import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCompany } from '../context/companyContextStore'
import { formatINR } from '../farmers/farmerData'
import ProduceThumb from '../farmers/ProduceThumb'

const TABS = [
  { key: 'countered', label: 'Counteroffers' },
  { key: 'waiting', label: 'Awaiting Farmer' },
  { key: 'history', label: 'History' },
]

function OfferStatusPill({ status }) {
  if (status === 'countered_by_farmer') {
    return (
      <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10.5px] font-semibold">
        Counteroffer Received
      </span>
    )
  }
  if (status === 'pending_farmer') {
    return (
      <span className="px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[10.5px] font-semibold">
        Awaiting Farmer
      </span>
    )
  }
  if (status === 'accepted') {
    return (
      <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10.5px] font-semibold">
        Accepted
      </span>
    )
  }
  return (
    <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10.5px] font-semibold">
      Closed
    </span>
  )
}

/**
 * Clean 2-column Company Portal Offers & Negotiations desk (/company/offers).
 */
export default function CompanyOffers() {
  const { allOffers, acceptFarmerCounter, reviseCompanyOffer, withdrawCompanyOffer } =
    useCompany()

  const [tab, setTab] = useState('countered')
  const [editingId, setEditingId] = useState(null)
  const [revisePrice, setRevisePrice] = useState('')
  const [reviseQty, setReviseQty] = useState('')
  const [recentBanner, setRecentBanner] = useState('')

  const counts = {
    countered: allOffers.filter((o) => o.status === 'countered_by_farmer').length,
    waiting: allOffers.filter((o) => o.status === 'pending_farmer').length,
    history: allOffers.filter(
      (o) => o.status !== 'countered_by_farmer' && o.status !== 'pending_farmer'
    ).length,
  }

  const visibleOffers = allOffers.filter((o) => {
    if (tab === 'countered') return o.status === 'countered_by_farmer'
    if (tab === 'waiting') return o.status === 'pending_farmer'
    return o.status !== 'countered_by_farmer' && o.status !== 'pending_farmer'
  })

  const startRevise = (offer) => {
    setEditingId(offer.id)
    setRevisePrice(String(offer.offeredPrice))
    setReviseQty(String(offer.quantity))
  }

  const handleReviseSubmit = (e, offerId) => {
    e.preventDefault()
    const cleanPrice = Number(revisePrice)
    const cleanQty = Number(reviseQty)
    if (!cleanPrice || cleanPrice <= 0 || !cleanQty || cleanQty <= 0) return
    reviseCompanyOffer(offerId, cleanPrice, cleanQty)
    setEditingId(null)
    setRecentBanner('Revised offer sent to farmer and synchronized live.')
  }

  const handleAccept = (offer) => {
    acceptFarmerCounter(offer.id)
    setRecentBanner(
      `Counteroffer accepted for ${offer.productName} (${offer.quantity} ${offer.unit} at ₹${offer.offeredPrice}/${offer.unit}).`
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Offers &amp; Negotiations
          </h1>
          <p className="mt-0.5 text-xs text-slate-600">
            Respond to farmer counteroffers, revise pricing, or lock in confirmed orders.
          </p>
        </div>

        <Link
          to="/company/browse"
          className="px-3.5 py-1.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold self-start transition-colors"
        >
          + New Offer
        </Link>
      </div>

      {recentBanner && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900">
          <span className="font-medium">{recentBanner}</span>
          <div className="flex items-center gap-3">
            <Link to="/company/orders" className="font-bold text-[#184828] underline">
              Go to Orders &amp; Logistics →
            </Link>
            <button
              type="button"
              onClick={() => setRecentBanner('')}
              className="text-emerald-700 hover:text-emerald-950 font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Compact Pill Tabs */}
      <div className="flex flex-wrap gap-1.5">
        {TABS.map((t) => {
          const active = tab === t.key
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                active
                  ? 'bg-[#1e293b] text-white border-[#1e293b]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`px-1.5 rounded-full text-[10px] font-bold ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {counts[t.key]}
              </span>
            </button>
          )
        })}
      </div>

      {/* 2-Column Offers Grid */}
      {visibleOffers.length === 0 ? (
        <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-8 text-center">
          <p className="font-serif text-base font-bold text-slate-900">Nothing in this tab</p>
          <p className="mt-1 text-xs text-slate-500">
            Browse produce batches to send a new procurement offer or check another tab above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {visibleOffers.map((offer) => {
            const isEditing = editingId === offer.id
            const canAct =
              offer.status === 'countered_by_farmer' || offer.status === 'pending_farmer'
            const diff = (offer.offeredPrice || 0) - (offer.askingPrice || 0)

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
                        <h2 className="font-serif text-base font-bold text-slate-900 truncate">
                          {offer.productName}
                        </h2>
                        <OfferStatusPill status={offer.status} />
                      </div>
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {offer.farmerName} · {offer.farmerLocation}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0">
                    {offer.expiresIn}
                  </span>
                </div>

                {/* Price & Volume Strip */}
                <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#f8faf8] border border-[#e5e9e4] px-3 py-2">
                  <div>
                    <p className="text-[10px] font-medium text-slate-500">Farmer Ask</p>
                    <p className="font-serif text-sm font-bold text-slate-700">
                      ₹{offer.askingPrice}/{offer.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-slate-500">Active Offer</p>
                    <p className="font-serif text-sm font-bold text-slate-900">
                      ₹{offer.offeredPrice}/{offer.unit}{' '}
                      <span
                        className={`text-[10px] font-sans font-semibold ${
                          diff >= 0 ? 'text-emerald-700' : 'text-amber-700'
                        }`}
                      >
                        ({diff >= 0 ? `+₹${diff}` : `-₹${Math.abs(diff)}`})
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-medium text-slate-500">
                      Total ({offer.quantity} {offer.unit})
                    </p>
                    <p className="font-serif text-sm font-bold text-[#184828]">
                      {formatINR((offer.offeredPrice || 0) * (offer.quantity || 0))}
                    </p>
                  </div>
                </div>

                {/* Compact Negotiation Trail */}
                {offer.history?.length > 0 && (
                  <div className="space-y-1 border-l-2 border-slate-200 pl-2.5">
                    {offer.history.map((step) => (
                      <div
                        key={step.id}
                        className="flex items-center justify-between gap-2 text-[11px]"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span
                            className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                              step.actor === 'farmer' ? 'bg-[#184828]' : 'bg-[#1e293b]'
                            }`}
                          />
                          <span className="text-slate-700 truncate">
                            {step.label}: <strong>₹{step.price}/{offer.unit}</strong> ·{' '}
                            {step.quantity} {offer.unit}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 shrink-0">{step.time}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Revise Form */}
                {isEditing && (
                  <form
                    onSubmit={(e) => handleReviseSubmit(e, offer.id)}
                    className="rounded-xl bg-[#f8faf8] border border-slate-200 p-3 space-y-2.5"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
                          New Price (₹/{offer.unit})
                        </label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              setRevisePrice((p) => String(Math.max(1, Number(p || 0) - 2)))
                            }
                            className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                          >
                            -2
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={revisePrice}
                            onChange={(e) => setRevisePrice(e.target.value)}
                            className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-900"
                          />
                          <button
                            type="button"
                            onClick={() => setRevisePrice((p) => String(Number(p || 0) + 2))}
                            className="px-2 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
                          >
                            +2
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10.5px] font-semibold text-slate-700 mb-1">
                          Quantity ({offer.unit})
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={reviseQty}
                          onChange={(e) => setReviseQty(e.target.value)}
                          className="w-full px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-600 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3.5 py-1.5 rounded-lg bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold cursor-pointer"
                      >
                        Send Revision
                      </button>
                    </div>
                  </form>
                )}

                {/* Card Footer Actions */}
                {canAct && !isEditing && (
                  <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500">{offer.paymentPreference}</span>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {offer.status === 'countered_by_farmer' && (
                        <button
                          type="button"
                          onClick={() => handleAccept(offer)}
                          className="px-3 py-1.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold cursor-pointer transition-colors"
                        >
                          Accept ₹{offer.offeredPrice}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => startRevise(offer)}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                      >
                        Revise
                      </button>
                      <button
                        type="button"
                        onClick={() => withdrawCompanyOffer(offer.id)}
                        className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-700 hover:bg-rose-50 cursor-pointer"
                      >
                        Withdraw
                      </button>
                    </div>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
