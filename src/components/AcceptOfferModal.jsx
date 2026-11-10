import { useState } from 'react'
import { formatINR, getPayoutDestinationInfo } from '../farmers/farmerData'
import ProduceThumb from '../farmers/ProduceThumb'
import { PaymentGatewayPanel } from './PaymentGatewayModal'

const BEFORE = 'Payment Before Collection'
const AFTER = 'Payment After Collection'

/**
 * Shared deal-acceptance confirmation dialog with Pay Now (via FarmLink Pay Gateway)
 * vs Pay at Pickup selection across both Company Portal and Farmer Portal.
 */
export default function AcceptOfferModal({ offer, role = 'company', onClose, onConfirm }) {
  const [step, setStep] = useState('terms') // 'terms' | 'gateway'
  const [paymentPreference, setPaymentPreference] = useState(
    offer.paymentPreference === AFTER ? AFTER : BEFORE
  )

  const isCompany = role === 'company'
  const isBefore = paymentPreference === BEFORE
  const totalValue = (Number(offer.offeredPrice) || 0) * (Number(offer.quantity) || 0)
  const counterparty = isCompany ? offer.farmerName : offer.companyName
  const farmerPayoutInfo =
    isCompany && offer.farmerPayout ? getPayoutDestinationInfo(offer.farmerPayout) : null

  const handleConfirmTerms = (e) => {
    e.preventDefault()
    if (isCompany && isBefore) {
      setStep('gateway')
      return
    }
    onConfirm({
      paymentPreference,
      payNowImmediate: false,
      paymentRef: '',
    })
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 backdrop-blur-xs p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accept-offer-modal-title"
      onClick={() => {
        if (step === 'terms') onClose()
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl max-h-[88dvh] overflow-y-auto overscroll-contain"
      >
        {step === 'gateway' ? (
          <PaymentGatewayPanel
            amount={totalValue}
            recipientName={offer.farmerName}
            recipientPayout={offer.farmerPayout}
            itemSummary={`${offer.productName} · ${offer.quantity} ${offer.unit}`}
            backLabel="← Back"
            onCancel={() => setStep('terms')}
            onSuccess={(tx) =>
              onConfirm({
                paymentPreference: BEFORE,
                payNowImmediate: true,
                paymentRef: tx.transactionRef,
              })
            }
          />
        ) : (
          <form onSubmit={handleConfirmTerms}>
            {/* Modal Header */}
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#184828]">
                  Confirm Deal Agreement
                </p>
                <h2
                  id="accept-offer-modal-title"
                  className="font-serif text-lg font-bold text-slate-900 leading-tight"
                >
                  Accept {offer.productName}
                </h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Cancel confirmation"
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Deal Snapshot */}
              <div className="rounded-2xl bg-[#f8faf8] border border-[#e5e9e4] p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <ProduceThumb name={offer.productName} size="md" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{offer.productName}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {isCompany ? 'Farmer' : 'Buyer'}: {counterparty}
                    </p>
                    <p className="text-xs font-medium text-slate-700 mt-0.5">
                      {offer.quantity} {offer.unit} × ₹{offer.offeredPrice}/{offer.unit}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-[10.5px] font-medium text-slate-500">Order Total</p>
                  <p className="font-serif text-xl font-bold text-[#184828]">
                    {formatINR(totalValue)}
                  </p>
                </div>
              </div>

              {/* Payment Timing Choice */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-800">Choose Payment Option</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentPreference(BEFORE)}
                    className={`text-left rounded-2xl border p-3 transition-all cursor-pointer ${
                      isBefore
                        ? 'bg-emerald-50/70 border-[#184828] ring-1 ring-[#184828]'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {isCompany ? 'Pay Now (Advance)' : 'Pay Before Pickup'}
                      </span>
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isBefore ? 'border-[#184828] bg-[#184828]' : 'border-slate-300'
                        }`}
                      >
                        {isBefore && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                      {isCompany
                        ? 'Pay upfront via FarmLink Pay before scheduling farm pickup.'
                        : 'Require buyer advance payment prior to pickup dispatch.'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentPreference(AFTER)}
                    className={`text-left rounded-2xl border p-3 transition-all cursor-pointer ${
                      !isBefore
                        ? 'bg-sky-50/70 border-sky-700 ring-1 ring-sky-700'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900">Pay at Pickup</span>
                      <span
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          !isBefore ? 'border-sky-700 bg-sky-700' : 'border-slate-300'
                        }`}
                      >
                        {!isBefore && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                      Settle full invoice at farmgate after collection &amp; weighing.
                    </p>
                  </button>
                </div>

                {farmerPayoutInfo && (
                  <div className="rounded-xl bg-[#f8faf8] border border-[#e5e9e4] px-3 py-2 flex items-center justify-between gap-2 text-[11px]">
                    <span className="text-slate-500 font-medium">
                      Farmer Payout ({farmerPayoutInfo.mode})
                    </span>
                    <span className="font-mono font-semibold text-[#184828] truncate">
                      {farmerPayoutInfo.primaryValue}
                    </span>
                  </div>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  {isCompany && isBefore
                    ? `Proceed to Pay ${formatINR(totalValue)} →`
                    : isCompany
                      ? 'Confirm Deal (Pay at Pickup)'
                      : 'Confirm & Accept Deal'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
