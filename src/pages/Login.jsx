import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [submittedEmail, setSubmittedEmail] = useState('')

  const validate = () => {
    const nextErrors = {}
    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      nextErrors.email = 'Please enter your email ID.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (!password) {
      nextErrors.password = 'Please enter your password.'
    } else if (password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    return nextErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      setSubmittedEmail(email.trim())
    } else {
      setSubmittedEmail('')
    }
  }

  return (
    <main className="w-full bg-[#fbf8f1]">
      <section className="relative min-h-[calc(100dvh-3.5rem)] lg:min-h-[calc(100dvh-3rem)] [@media(min-width:1280px)_and_(min-height:760px)]:min-h-[calc(100dvh-3.625rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-5 pb-20 sm:pt-8 sm:pb-24 lg:pt-6 lg:pb-16 [@media(min-width:1280px)_and_(min-height:760px)]:py-14 overflow-x-clip">
        {/* Subtle Rural Landscape Wave Backdrop */}
        <div className="hidden sm:block absolute inset-x-0 bottom-0 pointer-events-none select-none z-0 opacity-90" aria-hidden="true">
          <img src="/footer/wave-desktop-cropped.png" alt="" className="w-full h-auto block" />
        </div>
        <div className="block sm:hidden absolute inset-x-0 bottom-0 pointer-events-none select-none z-0 opacity-90" aria-hidden="true">
          <img src="/footer/wave-mobile-cropped.png" alt="" className="w-full h-auto block" />
        </div>

        {/* Login Card */}
        <div className="relative z-10 w-full max-w-4xl bg-[#fffdf8]/95 backdrop-blur-sm border border-[#e5dcbd] rounded-3xl shadow-[0_14px_44px_rgba(20,62,34,0.09)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Left Visual Showcase Panel (Desktop) */}
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

            <div className="relative z-10 flex items-center gap-2 self-start px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-xs font-semibold tracking-wide">
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
          <div className="lg:col-span-7 p-5 sm:p-8 lg:p-8 [@media(min-width:1280px)_and_(min-height:760px)]:p-10 flex flex-col justify-center">
            {/* Mobile portal badge */}
            <div className="lg:hidden inline-flex items-center gap-1.5 self-start px-3 py-1 rounded-full bg-[#e8f3e1] border border-[#cde2be] text-[#184828] text-xs font-semibold mb-3">
              <svg className="w-3.5 h-3.5 text-[#2c6e43]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21 3C11.5 3 7 8 7 14c0 1.5.3 3 .8 4.2L3 21l3.8-4.8c1.2.5 2.7.8 4.2.8 6 0 11-4.5 11-14z" />
              </svg>
              <span>Farmer Portal</span>
            </div>

            <div className="mb-5">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#143e22] tracking-tight">
                Farmer Login
              </h1>
              <p className="mt-1.5 text-sm text-[#465a48] leading-relaxed">
                Enter your email ID and password to access your FarmLink account.
              </p>
            </div>

            {submittedEmail && (
              <div
                role="status"
                className="mb-5 rounded-xl border border-[#b7dcab] bg-[#eef7e9] px-4 py-3 text-sm text-[#143e22]"
              >
                <p className="font-semibold">
                  Form validated for <span className="underline">{submittedEmail}</span>
                </p>
                <p className="mt-0.5 text-xs text-[#2c4a31]">
                  Backend authentication is not connected yet.{' '}
                  <Link to="/farmers" className="font-semibold text-[#184828] underline hover:text-[#12381e]">
                    Preview Farmer Dashboard →
                  </Link>
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Email ID */}
              <div>
                <label htmlFor="login-email" className="block text-sm font-semibold text-[#143e22] mb-1.5">
                  Email ID
                </label>
                <div
                  className={`flex items-center rounded-xl border bg-[#fbf8f1]/75 transition-all focus-within:bg-white focus-within:ring-3 ${
                    errors.email
                      ? 'border-[#b91c1c] focus-within:border-[#b91c1c] focus-within:ring-[#b91c1c]/15'
                      : 'border-[#dcd2b8] focus-within:border-[#184828] focus-within:ring-[#184828]/12'
                  }`}
                >
                  <span className="pl-3.5 text-[#5a705d] shrink-0" aria-hidden="true">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </span>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
                    }}
                    placeholder="farmer@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'login-email-error' : undefined}
                    className="w-full bg-transparent px-3 py-2.5 text-base sm:text-sm text-[#143e22] placeholder:text-[#7c8c7e] focus:outline-none"
                  />
                </div>
                {errors.email && (
                  <p id="login-email-error" className="mt-1 text-xs font-medium text-[#b91c1c]">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="login-password" className="block text-sm font-semibold text-[#143e22] mb-1.5">
                  Password
                </label>
                <div
                  className={`flex items-center rounded-xl border bg-[#fbf8f1]/75 transition-all focus-within:bg-white focus-within:ring-3 ${
                    errors.password
                      ? 'border-[#b91c1c] focus-within:border-[#b91c1c] focus-within:ring-[#b91c1c]/15'
                      : 'border-[#dcd2b8] focus-within:border-[#184828] focus-within:ring-[#184828]/12'
                  }`}
                >
                  <span className="pl-3.5 text-[#5a705d] shrink-0" aria-hidden="true">
                    <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </span>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors((prev) => ({ ...prev, password: '' }))
                    }}
                    placeholder="Enter your password"
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? 'login-password-error' : undefined}
                    className="w-full bg-transparent px-3 py-2.5 text-base sm:text-sm text-[#143e22] placeholder:text-[#7c8c7e] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="pr-3.5 pl-2 py-2 text-[#5a705d] hover:text-[#184828] transition-colors focus:outline-none"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="login-password-error" className="mt-1 text-xs font-medium text-[#b91c1c]">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full mt-2 py-3 px-5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white font-semibold text-sm sm:text-[15px] shadow-md hover:shadow-lg transition-all active:scale-[0.99] inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                <span>Sign In</span>
              </button>
            </form>

            {/* Footer Links inside Card */}
            <div className="mt-6 pt-5 border-t border-[#e9e1ce] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-[13px] text-[#465a48]">
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
