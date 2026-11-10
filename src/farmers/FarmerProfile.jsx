import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFarmer } from '../context/farmerContextStore'
import {
  INITIAL_FARMER_DATA,
  getPayoutDestinationInfo,
  normalizePayoutDetails,
} from './farmerData'

export default function FarmerProfile() {
  const { profile, updateProfile, resetDemoData } = useFarmer()
  const navigate = useNavigate()

  const [form, setForm] = useState(() => ({
    ...profile,
    payoutDetails: normalizePayoutDetails(profile.payoutDetails),
  }))
  const [savedNotice, setSavedNotice] = useState(false)
  const [resetNotice, setResetNotice] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    const cleanPayout = {
      preferredMethod:
        form.payoutDetails?.preferredMethod === 'Bank Transfer' ? 'Bank Transfer' : 'UPI',
      upiId: (form.payoutDetails?.upiId || '').trim(),
      accountHolder: (form.payoutDetails?.accountHolder || '').trim(),
      bankName: (form.payoutDetails?.bankName || '').trim(),
      accountNumber: (form.payoutDetails?.accountNumber || '').replace(/\s+/g, ''),
      ifscCode: (form.payoutDetails?.ifscCode || '').trim().toUpperCase(),
    }
    const nextProfile = { ...form, payoutDetails: cleanPayout }
    updateProfile(nextProfile)
    setForm(nextProfile)
    setSavedNotice(true)
    setResetNotice(false)
  }

  const handleReset = () => {
    resetDemoData()
    setForm({
      ...INITIAL_FARMER_DATA.profile,
      payoutDetails: { ...INITIAL_FARMER_DATA.profile.payoutDetails },
    })
    setResetNotice(true)
    setSavedNotice(false)
  }

  const updatePayoutField = (field, value) => {
    setForm((prev) => ({
      ...prev,
      payoutDetails: {
        ...normalizePayoutDetails(prev.payoutDetails),
        [field]: value,
      },
    }))
  }

  const payout = normalizePayoutDetails(form.payoutDetails)
  const payoutPreview = getPayoutDestinationInfo(payout)

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#143e22]">
          Farmer Profile &amp; Account
        </h1>
        <p className="mt-0.5 text-xs text-[#5e7160]">
          Keep your farm location and contact details accurate for produce collection.
        </p>
      </div>

      {savedNotice && (
        <div className="rounded-xl bg-[#eef7e9] border border-[#b9dcac] px-4 py-2.5 text-xs sm:text-sm text-[#143e22] font-medium">
          Profile details updated.
        </div>
      )}
      {resetNotice && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs sm:text-sm text-amber-900 font-medium">
          Demo listings, offers, and orders have been reset to default sample records.
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="rounded-2xl bg-white border border-[#e2e6e1] p-5 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <p className="font-serif text-lg font-bold text-[#143e22]">{profile.name}</p>
            <p className="text-xs text-[#5e7160]">{profile.farmSize}</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#e8f3e1] text-[#184828] text-xs font-semibold">
            {profile.verified ? 'Verified Farmer' : 'Pending Review'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="prof-name" className="block text-xs font-semibold text-[#143e22] mb-1">
              Full Name
            </label>
            <input
              id="prof-name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-base sm:text-sm text-[#143e22] focus:outline-none focus:border-[#184828]"
            />
          </div>

          <div>
            <label htmlFor="prof-phone" className="block text-xs font-semibold text-[#143e22] mb-1">
              Mobile Number
            </label>
            <input
              id="prof-phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-base sm:text-sm text-[#143e22] focus:outline-none focus:border-[#184828]"
            />
          </div>

          <div>
            <label htmlFor="prof-email" className="block text-xs font-semibold text-[#143e22] mb-1">
              Email ID
            </label>
            <input
              id="prof-email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-base sm:text-sm text-[#143e22] focus:outline-none focus:border-[#184828]"
            />
          </div>

          <div>
            <label htmlFor="prof-district" className="block text-xs font-semibold text-[#143e22] mb-1">
              District &amp; State
            </label>
            <input
              id="prof-district"
              type="text"
              value={form.district}
              onChange={(e) => setForm((prev) => ({ ...prev, district: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-base sm:text-sm text-[#143e22] focus:outline-none focus:border-[#184828]"
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="prof-village" className="block text-xs font-semibold text-[#143e22] mb-1">
              Farm / Village Address
            </label>
            <input
              id="prof-village"
              type="text"
              value={form.village}
              onChange={(e) => setForm((prev) => ({ ...prev, village: e.target.value }))}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-base sm:text-sm text-[#143e22] focus:outline-none focus:border-[#184828]"
            />
          </div>
        </div>

        {/* Bank & UPI Payout Details */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#143e22]">Bank &amp; UPI Payout Details</h3>
              <p className="text-xs text-[#647165] mt-0.5">
                Verified buyers transfer advance and harvest pickup settlements here.
              </p>
            </div>

            <div className="inline-flex rounded-xl border border-slate-200 bg-[#f8faf8] p-1 gap-1">
              {[
                { id: 'UPI', label: 'UPI Transfer' },
                { id: 'Bank Transfer', label: 'Bank Transfer' },
              ].map((option) => {
                const active = payout.preferredMethod === option.id
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => updatePayoutField('preferredMethod', option.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      active
                        ? 'bg-[#184828] text-white shadow-2xs'
                        : 'text-[#647165] hover:text-[#143e22]'
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-xl bg-[#f8faf8] border border-[#e5e9e4] px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[#647165] font-medium">
              Company payouts route via{' '}
              <strong className="text-[#143e22]">{payoutPreview.mode}</strong>
            </span>
            <span className="font-mono font-semibold text-[#184828]">
              {payoutPreview.primaryValue}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between gap-2 mb-1">
                <label htmlFor="prof-upi" className="block text-xs font-semibold text-[#143e22]">
                  UPI ID / VPA
                </label>
                {payout.preferredMethod === 'UPI' && (
                  <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-[#184828] border border-emerald-200">
                    Preferred Route
                  </span>
                )}
              </div>
              <input
                id="prof-upi"
                type="text"
                value={payout.upiId}
                placeholder="e.g. rajannair.ollur@okaxis"
                onChange={(e) => updatePayoutField('upiId', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-base sm:text-sm font-mono text-[#143e22] focus:outline-none focus:border-[#184828]"
              />
            </div>

            <div>
              <label
                htmlFor="prof-acct-holder"
                className="block text-xs font-semibold text-[#143e22] mb-1"
              >
                Account Holder Name
              </label>
              <input
                id="prof-acct-holder"
                type="text"
                value={payout.accountHolder}
                placeholder="Name as per bank passbook"
                onChange={(e) => updatePayoutField('accountHolder', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-base sm:text-sm text-[#143e22] focus:outline-none focus:border-[#184828]"
              />
            </div>

            <div>
              <label
                htmlFor="prof-bank-name"
                className="block text-xs font-semibold text-[#143e22] mb-1"
              >
                Bank Name &amp; Branch
              </label>
              <input
                id="prof-bank-name"
                type="text"
                value={payout.bankName}
                placeholder="e.g. Kerala Gramin Bank, Ollur"
                onChange={(e) => updatePayoutField('bankName', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-base sm:text-sm text-[#143e22] focus:outline-none focus:border-[#184828]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-1">
                <label
                  htmlFor="prof-acct-no"
                  className="block text-xs font-semibold text-[#143e22]"
                >
                  Bank Account Number
                </label>
                {payout.preferredMethod === 'Bank Transfer' && (
                  <span className="text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-[#184828] border border-emerald-200">
                    Preferred Route
                  </span>
                )}
              </div>
              <input
                id="prof-acct-no"
                type="text"
                inputMode="numeric"
                value={payout.accountNumber}
                placeholder="Enter bank account number"
                onChange={(e) => updatePayoutField('accountNumber', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-base sm:text-sm font-mono text-[#143e22] focus:outline-none focus:border-[#184828]"
              />
            </div>

            <div>
              <label htmlFor="prof-ifsc" className="block text-xs font-semibold text-[#143e22] mb-1">
                IFSC Code
              </label>
              <input
                id="prof-ifsc"
                type="text"
                maxLength={11}
                value={payout.ifscCode}
                placeholder="e.g. KLGB0040218"
                onChange={(e) => updatePayoutField('ifscCode', e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-base sm:text-sm font-mono uppercase tracking-wider text-[#143e22] focus:outline-none focus:border-[#184828]"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
            >
              Reset Demo Data
            </button>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-3.5 py-2 rounded-xl border border-[#e7c4bf] text-xs font-semibold text-[#991b1b] hover:bg-[#fceae6] cursor-pointer"
            >
              Sign Out
            </button>
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-sm font-semibold shadow-xs cursor-pointer"
          >
            Save Profile
          </button>
        </div>
      </form>
    </div>
  )
}
