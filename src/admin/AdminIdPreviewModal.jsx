import { useState } from 'react'
import { ADMIN_REJECT_REASONS } from './adminData'

/**
 * KYC Document inspection modal allowing Platform Admins to visually verify ID proof details
 * and approve or decline farmer registration applications.
 */
export default function AdminIdPreviewModal({ application, onClose, onApprove, onReject }) {
  const [showRejectBox, setShowRejectBox] = useState(false)
  const [reason, setReason] = useState(application.rejectReason || ADMIN_REJECT_REASONS[0])

  const initials = application.fullName
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || '')
    .join('')

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 backdrop-blur-xs p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-kyc-modal-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-xl bg-white border border-slate-200 rounded-2xl sm:rounded-3xl shadow-2xl max-h-[88dvh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="shrink-0 px-5 py-3.5 border-b border-slate-100 flex items-center justify-between gap-3 bg-white">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#184828]">
              KYC Document Inspection
            </p>
            <h2
              id="admin-kyc-modal-title"
              className="font-serif text-lg font-bold text-slate-900 leading-tight"
            >
              {application.fullName} · {application.district}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close KYC modal"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-bold cursor-pointer shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Inspection Content */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-5 space-y-4">
          {/* Simulated ID Card Scan Preview */}
          <div className="rounded-2xl border border-[#d6e5cf] bg-[linear-gradient(135deg,#f8fbf6_0%,#eef5ea_100%)] p-4 space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-[#d6e5cf]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2 py-0.5 rounded bg-[#184828] text-white text-[10px] font-bold uppercase tracking-wider shrink-0">
                  {application.idFileType === 'pdf' ? 'PDF DOC' : 'PHOTO SCAN'}
                </span>
                <span className="text-xs font-bold text-[#143e22] truncate">
                  {application.idType}
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#5a705d] truncate">
                {application.idFileName}
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-16 h-20 rounded-xl bg-white border border-[#c8dfb3] flex flex-col items-center justify-center shrink-0 shadow-2xs">
                <span className="w-9 h-9 rounded-full bg-[#184828] text-white text-xs font-bold flex items-center justify-center">
                  {initials}
                </span>
                <span className="mt-1.5 text-[9px] font-semibold text-[#5a705d] uppercase">
                  Photo ID
                </span>
              </div>

              <div className="min-w-0 flex-1 space-y-1.5 text-xs">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                    Holder Name
                  </p>
                  <p className="font-serif text-base font-bold text-slate-900">
                    {application.fullName}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      Document No.
                    </p>
                    <p className="font-mono font-bold text-[#143e22]">{application.idNumber}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                      Region Match
                    </p>
                    <p className="font-semibold text-slate-800">{application.district}, Kerala</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Applicant Verification Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="rounded-xl bg-[#f8faf8] border border-[#e5e9e4] p-3 space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Mobile &amp; OTP Check
              </p>
              <p className="font-semibold text-slate-900">{application.phone}</p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10.5px] font-bold">
                ✓ OTP Verified
              </span>
            </div>

            <div className="rounded-xl bg-[#f8faf8] border border-[#e5e9e4] p-3 space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                Farm &amp; Cluster
              </p>
              <p className="font-semibold text-slate-900">{application.village}</p>
              <p className="text-[11px] text-slate-600">{application.farmSize}</p>
            </div>
          </div>

          {/* Submitted Bank & UPI Payout Account Details */}
          {application.payoutDetails && (
            <div className="rounded-xl bg-[#f8faf8] border border-[#e5e9e4] p-3 space-y-1.5 text-xs">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                  Payout Bank &amp; UPI Details
                </p>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#184828] text-[10px] font-bold">
                  Preferred: {application.payoutDetails.preferredMethod}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                <p className="text-slate-600 truncate">
                  UPI: <strong className="font-mono text-slate-900">{application.payoutDetails.upiId}</strong>
                </p>
                <p className="text-slate-600 truncate">
                  Bank: <strong className="text-slate-900">{application.payoutDetails.bankName}</strong>
                </p>
                <p className="text-slate-600 truncate">
                  Acct: <strong className="font-mono text-slate-900">{application.payoutDetails.accountNumber}</strong>
                </p>
                <p className="text-slate-600 truncate">
                  IFSC: <strong className="font-mono text-slate-900">{application.payoutDetails.ifscCode}</strong>
                </p>
              </div>
            </div>
          )}

          {application.status === 'rejected' && application.rejectReason && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 px-3.5 py-2.5 text-xs text-rose-800">
              <strong>Previous Decline Note:</strong> {application.rejectReason}
            </div>
          )}

          {showRejectBox && (
            <div className="rounded-2xl bg-[#fdf3f2] border border-[#efc7c2] p-3.5 space-y-2.5">
              <p className="text-xs font-bold text-[#991b1b]">Select Decline / Re-upload Reason</p>
              <div className="flex flex-wrap gap-1.5">
                {ADMIN_REJECT_REASONS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setReason(item)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border cursor-pointer transition-colors ${
                      reason === item
                        ? 'bg-[#991b1b] text-white border-[#991b1b]'
                        : 'bg-white text-slate-700 border-[#e7c4bf] hover:border-[#991b1b]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowRejectBox(false)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-600 cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onReject(application.id, reason)
                    onClose()
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#b91c1c] hover:bg-[#991b1b] text-white text-xs font-semibold cursor-pointer"
                >
                  Confirm Decline
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pinned Footer Actions */}
        {!showRejectBox && (
          <div className="shrink-0 px-5 py-3 border-t border-slate-100 bg-white flex flex-wrap items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Close
            </button>

            <div className="flex items-center gap-2">
              {application.status !== 'rejected' && (
                <button
                  type="button"
                  onClick={() => setShowRejectBox(true)}
                  className="px-3.5 py-2 rounded-xl border border-[#efc7c2] text-[#991b1b] hover:bg-[#fdf3f2] text-xs font-semibold cursor-pointer"
                >
                  Decline / Re-submit
                </button>
              )}

              {application.status !== 'approved' && (
                <button
                  type="button"
                  onClick={() => {
                    onApprove(application.id)
                    onClose()
                  }}
                  className="px-4 py-2 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  ✓ Approve &amp; Verify Farmer
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

