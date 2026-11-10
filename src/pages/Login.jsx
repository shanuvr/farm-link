import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  AuthEmailField,
  AuthPasswordField,
  AuthWaveBackdrop,
} from '../components/AuthFields'
import Footer from '../components/Footer'
import { useFarmer } from '../context/farmerContextStore'
import { validateCredentials } from '../utils/authValidation'

export default function Login() {
  const { setFarmerSessionEmail } = useFarmer()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validateCredentials(email, password)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      setFarmerSessionEmail(email.trim())
      navigate('/farmers')
    }
  }

  return (
    <main className="w-full bg-[#fbf8f1]">
      <section className="relative min-h-[calc(100dvh-3.5rem)] lg:min-h-[calc(100dvh-3rem)] [@media(min-width:1280px)_and_(min-height:760px)]:min-h-[calc(100dvh-3.625rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-4 pb-20 sm:pt-6 sm:pb-24 lg:pt-4 lg:pb-16 [@media(min-width:1280px)_and_(min-height:760px)]:pb-24 overflow-x-clip">
        <AuthWaveBackdrop />

        {/* Farmer Login Split Card */}
        <div className="relative z-10 w-full max-w-4xl bg-[#fffdf8]/95 backdrop-blur-sm border border-[#e5dcbd] rounded-3xl shadow-[0_14px_44px_rgba(20,62,34,0.09)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Photo Showcase Panel */}
          <div className="hidden lg:flex lg:col-span-5 relative flex-col justify-between p-7 text-white overflow-hidden">
            <img
              src="/hero/hero-mobile-cropped.png"
              alt="Kerala farmland and fresh harvest basket"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,56,31,0.58)_0%,rgba(18,56,31,0.28)_40%,rgba(18,56,31,0.88)_82%,rgba(18,56,31,0.96)_100%)]"
              aria-hidden="true"
            />

            <div className="relative z-10 inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold tracking-wide">
              <svg className="w-3.5 h-3.5 text-[#b9e6a8]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21 3C11.5 3 7 8 7 14c0 1.5.3 3 .8 4.2L3 21l3.8-4.8c1.2.5 2.7.8 4.2.8 6 0 11-4.5 11-14z" />
              </svg>
              <span>Farmer Portal</span>
            </div>

            <div className="relative z-10 space-y-3">
              <p className="font-serif text-xl font-bold leading-snug text-white">
                Fair offers, direct sales, and complete peace of mind.
              </p>
              <p className="text-xs text-green-100/90 leading-relaxed">
                Log in to manage your produce listings, review company offers, and track collections &amp; payments.
              </p>
              <div className="pt-1 flex flex-wrap gap-2 text-[11px] font-medium text-green-50">
                <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20">
                  Direct Buyer Access
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20">
                  Transparent Records
                </span>
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 p-5 sm:p-6 lg:px-8 lg:py-6 [@media(min-width:1280px)_and_(min-height:760px)]:p-9 flex flex-col justify-center">
            <div className="lg:hidden inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-[#e8f3e1] border border-[#cde2be] text-[#184828] text-xs font-semibold mb-2.5">
              <svg className="w-3.5 h-3.5 text-[#2c6e43]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21 3C11.5 3 7 8 7 14c0 1.5.3 3 .8 4.2L3 21l3.8-4.8c1.2.5 2.7.8 4.2.8 6 0 11-4.5 11-14z" />
              </svg>
              <span>Farmer Portal</span>
            </div>

            <div className="mb-4">
              <h1 className="font-serif text-2xl [@media(min-width:1280px)_and_(min-height:760px)]:text-3xl font-bold text-[#143e22] tracking-tight">
                Farmer Login
              </h1>
              <p className="mt-1 text-xs sm:text-[13px] text-[#465a48]">
                Enter your email ID and password to access your FarmLink account.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-3">
              <AuthEmailField
                id="farmer-login-email"
                label="Email ID"
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
                }}
                error={errors.email}
              />

              <AuthPasswordField
                id="farmer-login-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }))
                }}
                error={errors.password}
              />

              <button
                type="submit"
                className="w-full mt-1.5 py-2.5 px-5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.99] inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                <span>Sign In</span>
              </button>
            </form>

            <div className="mt-4 pt-3.5 border-t border-[#e9e1ce] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-xs text-[#465a48]">
              <p>
                New farmer on FarmLink?{' '}
                <Link to="/register" className="font-semibold text-[#184828] hover:underline">
                  Register here
                </Link>
              </p>
              <Link to="/company" className="font-semibold text-[#5d281f] hover:underline">
                Company Login →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer showWave={false} />
    </main>
  )
}
