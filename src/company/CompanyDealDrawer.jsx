import { useState } from 'react'
import { formatINR } from '../farmers/farmerData'
import ProduceThumb from '../farmers/ProduceThumb'
import { getOfferSpread } from './companyData'

function DrawerStatusPill({ status }) {
  if (status === 'countered_by_farmer') {
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
        Your Turn · Counteroffer
      </span>
    )
  }
  if (status === 'pending_farmer') {
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[11px] font-semibold">
        Awaiting Farmer
      </span>
    )
  }
  if (status === 'accepted') {
    return (
      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold">
        Accepted · Order Confirmed
      </span>
    )
  }
  return (
    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-semibold">
      Closed
    </span>
  )
}

/**
 * Focused right slide-over Deal Inspector for negotiating, comparing savings, and rapid triage.
 */
export default function CompanyDealDrawer({
  offer,
  activeIndex,
  totalCount,
  onPrev,
  onNext,
  onClose,
  onAccept,
  onRevise,
  onWithdraw,
}) {
  const [price, setPrice] = useState(String(offer.offeredPrice || ''))
  const [qty, setQty] = useState(String(offer.quantity || ''))
  const [confirmWithdraw, setConfirmWithdraw] = useState(false)

  const canAct = offer.status === 'countered_by_farmer' || offer.status === 'pending_farmer'
  const spread = getOfferSpread(offer.offeredPrice, offer.askingPrice)
  const draftSpread = getOfferSpread(price, offer.askingPrice)
  const draftTotal = (Number(price) || 0) * (Number(qty) || 0)

  const handleSubmitRevision = (e) => {
    e.preventDefault()
    const cleanPrice = Number(price)
    const cleanQty = Number(qty)
    if (!cleanPrice || cleanPrice <= 0 || !cleanQty || cleanQty <= 0) return
    onRevise(offer.id, cleanPrice, cleanQty)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex justify-end bg-slate-950/45 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="deal-drawer-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white h-dvh shadow-2xl border-l border-slate-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Navigation Bar */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between gap-2 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Deal {activeIndex + 1} of {totalCount}
            </span>
            <div className="inline-flex items-center gap-1 ml-1">
              <button
                type="button"
                onClick={onPrev}
                disabled={activeIndex <= 0}
                className="px-2 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={onNext}
                disabled={activeIndex >= totalCount - 1}
                className="px-2 py-1 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next →
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close deal inspector"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 pb-6 space-y-5">
          {/* Produce & Farmer Header */}
          <div className="flex items-start gap-3">
            <ProduceThumb name={offer.productName} size="md" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <DrawerStatusPill status={offer.status} />
                <span className="text-[11px] font-medium text-slate-400">
                  {offer.expiresIn}
                </span>
              </div>
              <h2
                id="deal-drawer-title"
                className="mt-1 font-serif text-lg font-bold text-slate-900 leading-snug"
              >
                {offer.productName}
              </h2>
              <p className="text-xs text-slate-600">
                {offer.farmerName} · {offer.farmerLocation}
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">{offer.paymentPreference}</p>
            </div>
          </div>

          {/* Benchmark Comparison Grid */}
          <div className="grid grid-cols-2 gap-2.5 bg-[#f8faf8] border border-[#e5e9e4] rounded-2xl p-3.5">
            <div>
              <p className="text-[10.5px] font-medium text-slate-500">Farmer Asking Rate</p>
              <p className="font-serif text-base font-bold text-slate-700 mt-0.5">
                ₹{offer.askingPrice}/{offer.unit}
              </p>
            </div>
            <div>
              <p className="text-[10.5px] font-medium text-slate-500">Current Active Rate</p>
              <p className="font-serif text-base font-bold text-slate-900 mt-0.5">
                ₹{offer.offeredPrice}/{offer.unit}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-200/70">
              <p className="text-[10.5px] font-medium text-slate-500 mb-1">Price Spread</p>
              <span
                className={`inline-block px-2 py-0.5 rounded-full border text-[10.5px] font-semibold ${spread.cls}`}
              >
                {spread.text}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200/70">
              <p className="text-[10.5px] font-medium text-slate-500">
                Order Value ({offer.quantity} {offer.unit})
              </p>
              <p className="font-serif text-base font-bold text-[#184828] mt-0.5">
                {formatINR((offer.offeredPrice || 0) * (offer.quantity || 0))}
              </p>
            </div>
          </div>

          {/* Full Negotiation History Timeline */}
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Negotiation Timeline
              </h3>
              <span className="text-[11px] font-semibold text-slate-500">
                {(offer.history || []).length} rounds
              </span>
            </div>

            <div className="space-y-2 border-l-2 border-slate-200 pl-3.5">
              {(offer.history || []).map((step) => {
                const isFarmer = step.actor === 'farmer'
                return (
                  <div
                    key={step.id}
                    className="rounded-xl bg-slate-50/80 border border-slate-200/80 px-3 py-2 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isFarmer ? 'bg-[#184828]' : 'bg-[#1e293b]'
                          }`}
                        />
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {step.label}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 pl-3.5">
                        <strong>
                          ₹{step.price}/{offer.unit}
                        </strong>{' '}
                        for {step.quantity} {offer.unit} ({formatINR(step.price * step.quantity)})
                      </p>
                    </div>
                    <span className="text-[10.5px] text-slate-400 shrink-0">{step.time}</span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Interactive Action Console */}
          {canAct && (
            <form
              onSubmit={handleSubmitRevision}
              className="rounded-2xl bg-[#f8faf8] border border-slate-200 p-4 space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-sm font-bold text-slate-900">
                  {offer.status === 'countered_by_farmer'
                    ? 'Accept or Counter'
                    : 'Revise Sent Offer'}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full border text-[10px] font-semibold ${draftSpread.cls}`}
                >
                  {draftSpread.text}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Rate (₹/{offer.unit})
                  </label>
                  <div className="flex items-stretch rounded-lg border border-slate-200 bg-white overflow-hidden focus-within:border-[#184828] transition-colors">
                    <button
                      type="button"
                      onClick={() => setPrice((p) => String(Math.max(1, Number(p || 0) - 2)))}
                      aria-label="Decrease counteroffer rate by ₹2"
                      className="w-9 shrink-0 bg-[#f8faf8] hover:bg-slate-100 border-r border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center cursor-pointer"
                    >
                      -2
                    </button>
                    <input
                      type="number"
                      min="1"
                      inputMode="numeric"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="flex-1 min-w-0 px-1.5 py-1.5 bg-transparent text-xs font-bold text-center text-slate-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => setPrice((p) => String(Number(p || 0) + 2))}
                      aria-label="Increase counteroffer rate by ₹2"
                      className="w-9 shrink-0 bg-[#f8faf8] hover:bg-slate-100 border-l border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center cursor-pointer"
                    >
                      +2
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Quantity ({offer.unit})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-200/70">
                <span className="text-slate-500">Revised Contract Total</span>
                <span className="font-serif text-sm font-bold text-slate-900">
                  {formatINR(draftTotal)}
                </span>
              </div>

              <div className="space-y-2 pt-1">
                {offer.status === 'countered_by_farmer' && (
                  <button
                    type="button"
                    onClick={() => onAccept(offer)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                  >
                    Accept Farmer Counter (₹{offer.offeredPrice}/{offer.unit} ·{' '}
                    {formatINR((offer.offeredPrice || 0) * (offer.quantity || 0))})
                  </button>
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-3 rounded-xl bg-[#1e293b] hover:bg-[#0f172a] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Send Counteroffer
                  </button>

                  {confirmWithdraw ? (
                    <button
                      type="button"
                      onClick={() => onWithdraw(offer.id)}
                      className="px-3 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold cursor-pointer"
                    >
                      Confirm Withdraw
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmWithdraw(true)}
                      className="px-3 py-2 rounded-xl border border-rose-200 text-rose-700 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                    >
                      Withdraw
                    </button>
                  )}
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

