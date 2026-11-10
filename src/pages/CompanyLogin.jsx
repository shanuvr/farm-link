import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import {
  AuthEmailField,
  AuthPasswordField,
  AuthWaveBackdrop,
} from '../components/AuthFields'
import Footer from '../components/Footer'
import { useCompany } from '../context/companyContextStore'
import { validateCredentials } from '../utils/authValidation'

const PROCUREMENT_HIGHLIGHTS = [
  'Direct verified farm stock discovery',
  'Structured offers & stock reservation',
  'Collection scheduling & payment tracking',
]

function BuildingMark({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9.5L12 3L21 9.5H3Z" />
      <path d="M2 10.5H22" />
      <path d="M5 11.5V18" />
      <path d="M9.5 11.5V18" />
      <path d="M14.5 11.5V18" />
      <path d="M19 11.5V18" />
      <path d="M2 18.5H22" />
      <path d="M1 21H23" />
    </svg>
  )
}

export default function CompanyLogin() {
  const { isAuthenticated, loginCompany } = useCompany()
  const navigate = useNavigate()
  const location = useLocation()
  const destination = location.state?.from || '/company/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  if (isAuthenticated) {
    return <Navigate to={destination} replace />
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validateCredentials(email, password)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      loginCompany(email.trim())
      navigate(destination, { replace: true })
    }
  }

  return (
    <main className="w-full bg-[#fbf8f1]">
      <section className="relative min-h-[calc(100dvh-3.5rem)] lg:min-h-[calc(100dvh-3rem)] [@media(min-width:1280px)_and_(min-height:760px)]:min-h-[calc(100dvh-3.625rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-4 pb-20 sm:pt-6 sm:pb-24 lg:pt-4 lg:pb-16 [@media(min-width:1280px)_and_(min-height:760px)]:pb-24 overflow-x-clip">
        <AuthWaveBackdrop />

        {/* Compact B2B Card positioned cleanly above the bottom green wave & palm trees */}
        <div className="relative z-10 w-full max-w-4xl bg-white border border-[#e3d9c3] rounded-3xl shadow-[0_16px_44px_rgba(20,42,26,0.09)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Mobile Executive Header Bar */}
          <div className="lg:hidden bg-[#12381f] text-white px-5 py-3.5 border-b border-[#255736]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-semibold tracking-wide text-[#f2dfc7]">
              <BuildingMark className="w-3.5 h-3.5" />
              <span>B2B Procurement Portal</span>
            </div>
            <h1 className="mt-2 font-serif text-xl font-bold tracking-tight text-white">
              Company Login
            </h1>
            <p className="mt-0.5 text-xs text-green-100/85">
              Sign in with your authorized company credentials.
            </p>
          </div>

          {/* Left Form Panel */}
          <div className="lg:col-span-7 flex flex-col justify-between bg-white">
            <div className="hidden lg:block h-1 w-full bg-gradient-to-r from-[#1e293b] via-[#184828] to-[#1e293b]" aria-hidden="true" />

            <div className="p-5 sm:p-6 lg:px-8 lg:py-6 [@media(min-width:1280px)_and_(min-height:760px)]:p-9 flex-1 flex flex-col justify-center">
              <div className="hidden lg:block mb-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-800 text-[11.5px] font-semibold mb-2">
                  <BuildingMark className="w-3.5 h-3.5 text-[#184828]" />
                  <span>Authorized Buyer Access</span>
                </div>
                <h1 className="font-serif text-2xl [@media(min-width:1280px)_and_(min-height:760px)]:text-3xl font-bold text-[#143e22] tracking-tight">
                  Company Login
                </h1>
                <p className="mt-1 text-xs sm:text-[13px] text-[#465a48]">
                  Access your FarmLink procurement dashboard.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-3">
                <AuthEmailField
                  id="company-login-email"
                  label="Company Email ID"
                  placeholder="procurement@company.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
                  }}
                  error={errors.email}
                  bgClass="bg-[#fcfaf5]"
                  focusClass="border-[#ddd3bc] focus-within:border-[#1e293b] focus-within:ring-slate-900/10"
                />

                <AuthPasswordField
                  id="company-login-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((prev) => ({ ...prev, password: '' }))
                  }}
                  error={errors.password}
                  bgClass="bg-[#fcfaf5]"
                  focusClass="border-[#ddd3bc] focus-within:border-[#1e293b] focus-within:ring-slate-900/10"
                />

                <button
                  type="submit"
                  className="w-full mt-1.5 py-2.5 px-5 rounded-xl bg-[#1e293b] hover:bg-[#0f172a] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.99] inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BuildingMark className="w-4 h-4" />
                  <span>Sign In to Procurement Desk</span>
                </button>
              </form>

              <div className="mt-4 pt-3.5 border-t border-[#ece4d3] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-xs text-[#465a48]">
                <p>
                  Admin-provisioned account.{' '}
                  <Link to="/contact" className="font-semibold text-[#1e293b] hover:underline">
                    Need access?
                  </Link>
                </p>
                <Link to="/login" className="font-semibold text-[#184828] hover:underline">
                  Farmer Login →
                </Link>
              </div>
            </div>
          </div>

          {/* Right Executive Panel (Concise & Uncluttered) */}
          <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-7 bg-[#12381f] text-white overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                backgroundSize: '26px 26px',
              }}
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-20 -right-20 w-56 h-56 rounded-full bg-[#5d281f]/45 blur-3xl pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10">
              <div className="flex items-center justify-between text-[11.5px] font-medium text-green-200/90 pb-3 border-b border-white/12">
                <span className="inline-flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#7fd874]" />
                  Procurement Desk
                </span>
                <span className="uppercase tracking-wider text-[#e9d5b5] text-[10.5px]">B2B Portal</span>
              </div>

              <h2 className="mt-4 font-serif text-xl font-bold leading-snug text-white">
                Centralized Agricultural Sourcing
              </h2>

              <ul className="mt-4 space-y-2.5 text-xs text-green-50/90">
                {PROCUREMENT_HIGHLIGHTS.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/12 border border-white/20 shrink-0 flex items-center justify-center">
                      <svg className="w-3 h-3 text-[#b9e6a8]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 rounded-xl bg-white/8 border border-white/15 px-3.5 py-2.5">
              <p className="text-[11px] text-green-100/80 leading-relaxed">
                <span className="font-semibold text-[#f3dfbe]">Controlled Buyer Access ·</span> Accounts are issued by the FarmLink Administrator.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer showWave={false} />
    </main>
  )
}
