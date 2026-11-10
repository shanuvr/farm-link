import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCompany } from '../context/companyContextStore'
import { PAYMENT_MODES } from './companyData'

/**
 * Company Buyer profile, procurement defaults, demo reset, and sign-out (/company/settings).
 */
export default function CompanySettings() {
  const { companyProfile, updateCompanyProfile, resetCompanyDemoData, logoutCompany } =
    useCompany()
  const navigate = useNavigate()

  const [form, setForm] = useState(companyProfile)
  const [savedNotice, setSavedNotice] = useState('')

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    setSavedNotice('')
  }

  const handleSave = (e) => {
    e.preventDefault()
    updateCompanyProfile(form)
    setSavedNotice('Company profile and default payment settings saved.')
  }

  const handleReset = () => {
    resetCompanyDemoData()
    setSavedNotice('Partner company demo data restored to initial state.')
  }

  const handleLogout = () => {
    logoutCompany()
    navigate('/company')
  }

  return (
    <div className="space-y-5 max-w-3xl">
      <div>
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Company Profile &amp; Settings
        </h1>
        <p className="mt-0.5 text-xs text-slate-600">
          Manage your institutional procurement details, default payment terms, and session.
        </p>
      </div>

      {savedNotice && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-semibold text-emerald-800">
          {savedNotice}
        </div>
      )}

      <form
        onSubmit={handleSave}
        className="rounded-2xl bg-white border border-[#e2e6e1] p-5 sm:p-6 space-y-4 shadow-2xs"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Registered Company Name
            </label>
            <input
              type="text"
              value={form.companyName}
              onChange={handleChange('companyName')}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Short Display Name
            </label>
            <input
              type="text"
              value={form.shortName}
              onChange={handleChange('shortName')}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Procurement Officer
            </label>
            <input
              type="text"
              value={form.officerName}
              onChange={handleChange('officerName')}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Corporate Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={handleChange('email')}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Desk Phone Number
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={handleChange('phone')}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Headquarters City
            </label>
            <input
              type="text"
              value={form.headquarters}
              onChange={handleChange('headquarters')}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-slate-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN</label>
            <input
              type="text"
              value={form.gstin}
              onChange={handleChange('gstin')}
              required
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-slate-500"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Default Offer Payment Terms
            </label>
            <select
              value={form.defaultPaymentMode}
              onChange={handleChange('defaultPaymentMode')}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-slate-500"
            >
              {PAYMENT_MODES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold shadow-2xs cursor-pointer"
          >
            Save Profile Changes
          </button>
        </div>
      </form>

      {/* Session & Demo Controls */}
      <div className="rounded-2xl bg-white border border-[#e2e6e1] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
        <div>
          <h2 className="font-serif text-base font-bold text-slate-900">
            Portal Session &amp; Demo Controls
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Restore seeded Kerala partner farmer batches/orders or sign out to Company Login.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
          >
            Reset Demo Data
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}
