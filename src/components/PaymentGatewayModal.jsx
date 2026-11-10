import { useEffect, useState } from 'react'
import { formatINR, getPayoutDestinationInfo } from '../farmers/farmerData'

const PAYMENT_TABS = [
  { id: 'upi', label: 'UPI / QR' },
  { id: 'netbanking', label: 'NetBanking' },
  { id: 'card', label: 'Corporate Card' },
]

const UPI_APPS = ['Google Pay', 'PhonePe', 'BHIM UPI']
const BANKS = ['HDFC Corporate', 'SBI YONO Business', 'Federal Bank', 'ICICI Corporate']

function ShieldLockIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  )
}

/**
 * Reusable 3-stage FarmLink Pay dummy payment gateway panel:
 * 1) Payment Method Selection -> 2) Authorization Spinner -> 3) Digital Receipt.
 */
export function PaymentGatewayPanel({
  amount,
  recipientName,
  recipientPayout,
  itemSummary,
  onCancel,
  onSuccess,
  backLabel = 'Cancel',
}) {
  const [stage, setStage] = useState('select') // 'select' | 'processing' | 'success'
  const [methodTab, setMethodTab] = useState('upi')
  const [upiApp, setUpiApp] = useState(UPI_APPS[0])
  const [upiId, setUpiId] = useState('procurement@keralafresh.upi')
  const [selectedBank, setSelectedBank] = useState(BANKS[0])
  const [receipt, setReceipt] = useState(null)

  const payoutInfo = recipientPayout ? getPayoutDestinationInfo(recipientPayout) : null

  useEffect(() => {
    if (stage !== 'processing') return undefined
    const timer = setTimeout(() => {
      const prefix = methodTab === 'upi' ? 'UPI' : methodTab === 'netbanking' ? 'NB' : 'CRD'
      const txId = `FL${prefix}${Math.floor(100000 + Math.random() * 900000)}`
      const methodLabel =
        methodTab === 'upi'
          ? `${upiApp} (${upiId || 'Verified UPI'})`
          : methodTab === 'netbanking'
            ? `${selectedBank} NetBanking`
            : 'Corporate Visa •••• 4821'

      setReceipt({
        transactionRef: txId,
        methodLabel,
        paidAt: 'Just now',
      })
      setStage('success')
    }, 850)
    return () => clearTimeout(timer)
  }, [stage, methodTab, upiApp, upiId, selectedBank])

  if (stage === 'processing') {
    return (
      <div className="p-8 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-[#184828] animate-spin" />
        <div>
          <p className="font-serif text-lg font-bold text-slate-900">
            Authorizing Payment...
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Connecting securely to FarmLink Pay Escrow for {formatINR(amount)}
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-medium text-slate-600">
          <ShieldLockIcon className="w-3.5 h-3.5 text-[#184828]" />
          <span>256-bit Encrypted Sandbox Gateway</span>
        </div>
      </div>
    )
  }

  if (stage === 'success' && receipt) {
    return (
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col items-center text-center pt-1">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-[#184828]">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h3 className="mt-3 font-serif text-xl font-bold text-slate-900">
            Payment Successful!
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Escrow payment verified and ready to sync across portals.
          </p>
        </div>

        <div className="rounded-2xl bg-[#f8faf8] border border-[#e5e9e4] p-4 space-y-2.5 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/70">
            <span className="text-slate-500">Amount Paid</span>
            <span className="font-serif text-lg font-bold text-[#184828]">
              {formatINR(amount)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Transaction ID</span>
            <span className="font-mono font-bold text-slate-900">{receipt.transactionRef}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Paid To</span>
            <span className="font-semibold text-slate-800">{recipientName}</span>
          </div>
          {payoutInfo && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-slate-500 shrink-0">Farmer Payout ({payoutInfo.mode})</span>
              <span className="font-mono font-semibold text-[#184828] text-right truncate">
                {payoutInfo.primaryValue}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Method</span>
            <span className="font-medium text-slate-700 text-right">{receipt.methodLabel}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Order Batch</span>
            <span className="font-medium text-slate-700 text-right">{itemSummary}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSuccess(receipt)}
          className="w-full py-2.5 px-4 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
        >
          Done &amp; Continue →
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Gateway Brand Bar */}
      <div className="px-5 py-3 bg-[#143e22] text-white flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center">
            <ShieldLockIcon className="w-4 h-4 text-emerald-200" />
          </span>
          <div>
            <p className="text-xs font-bold leading-none">FarmLink Pay</p>
            <p className="text-[10px] text-emerald-100/80 mt-0.5">Verified B2B Escrow Checkout</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-[10px] text-emerald-100/80 uppercase tracking-wider">Payable</p>
          <p className="font-serif text-base font-bold leading-none mt-0.5">
            {formatINR(amount)}
          </p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Order & Recipient Strip */}
        <div className="rounded-xl bg-[#f8faf8] border border-[#e5e9e4] px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs">
          <div className="min-w-0">
            <p className="font-semibold text-slate-900 truncate">{itemSummary}</p>
            <p className="text-[11px] text-slate-500 truncate">Paying to: {recipientName}</p>
            {payoutInfo && (
              <p className="text-[11px] text-[#184828] font-medium truncate mt-0.5">
                Destination ({payoutInfo.mode}):{' '}
                <span className="font-mono font-semibold">{payoutInfo.primaryValue}</span>
              </p>
            )}
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#184828] text-[10px] font-bold shrink-0">
            Escrow Protected
          </span>
        </div>

        {/* Method Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-slate-100 border border-slate-200">
          {PAYMENT_TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setMethodTab(t.id)}
              className={`py-1.5 px-2 rounded-lg text-[11.5px] font-semibold transition-all cursor-pointer ${
                methodTab === t.id
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Method Details */}
        {methodTab === 'upi' && (
          <div className="space-y-3 rounded-2xl border border-slate-200 p-3.5 bg-white">
            <div className="flex flex-wrap gap-1.5">
              {UPI_APPS.map((app) => (
                <button
                  key={app}
                  type="button"
                  onClick={() => setUpiApp(app)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold border transition-colors cursor-pointer ${
                    upiApp === app
                      ? 'bg-[#1e293b] text-white border-[#1e293b]'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {app}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Corporate UPI ID / VPA
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@okicici"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-[#f8faf8] focus:bg-white text-base sm:text-xs font-medium text-slate-900 focus:outline-none focus:border-slate-500"
              />
            </div>
          </div>
        )}

        {methodTab === 'netbanking' && (
          <div className="grid grid-cols-2 gap-2">
            {BANKS.map((bank) => (
              <button
                key={bank}
                type="button"
                onClick={() => setSelectedBank(bank)}
                className={`text-left px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  selectedBank === bank
                    ? 'bg-emerald-50/70 border-[#184828] text-[#143e22]'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                }`}
              >
                {bank}
              </button>
            ))}
          </div>
        )}

        {methodTab === 'card' && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Corporate Debit / Credit Card</span>
              <span className="px-2 py-0.5 rounded bg-slate-200/80 text-[10px] font-bold text-slate-700">
                VISA
              </span>
            </div>
            <div className="rounded-xl bg-white border border-slate-200 px-3 py-2 font-mono text-slate-800 font-semibold">
              4532 •••• •••• 4821
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-slate-600">
                Exp: <strong className="text-slate-900">09/28</strong>
              </div>
              <div className="rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-slate-600">
                CVV: <strong className="text-slate-900">•••</strong>
              </div>
            </div>
          </div>
        )}

        {/* Gateway Footer Actions */}
        <div className="pt-1 flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
          >
            {backLabel}
          </button>
          <button
            type="button"
            onClick={() => setStage('processing')}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
          >
            Pay {formatINR(amount)} Securely
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Standalone backdrop modal wrapper around PaymentGatewayPanel for Orders payments & settlements.
 */
export default function PaymentGatewayModal({
  amount,
  recipientName,
  recipientPayout,
  itemSummary,
  onClose,
  onSuccess,
}) {
  return (
    <div
      className="fixed inset-0 z-[75] flex items-center justify-center bg-slate-950/55 backdrop-blur-xs p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="FarmLink Pay Gateway"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-md bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl max-h-[88dvh] overflow-y-auto overscroll-contain"
      >
        <PaymentGatewayPanel
          amount={amount}
          recipientName={recipientName}
          recipientPayout={recipientPayout}
          itemSummary={itemSummary}
          onCancel={onClose}
          onSuccess={onSuccess}
        />
      </div>
    </div>
  )
}

