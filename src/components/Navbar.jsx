import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

function CompanyIcon({ className = 'w-4 h-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'About Us', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ]

  const isCurrentActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fbf8f1]/68 backdrop-blur-md backdrop-saturate-150 border-b border-[#e9e1ce]/65 shadow-[0_4px_20px_rgba(20,62,34,0.05)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 lg:h-[48px] [@media(min-width:1280px)_and_(min-height:760px)]:h-[58px]">
          {/* Logo */}
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 select-none group shrink-0"
          >
            <svg
              viewBox="0 0 72 62"
              className="w-9 h-9 lg:w-10 lg:h-10 shrink-0"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 28L36 15L52 28H20Z" fill="#1b4d29" stroke="#12381e" strokeWidth="1.8" strokeLinejoin="round" />
              <path d="M22 25.5L36 14.5L50 25.5" stroke="#9cc594" strokeWidth="1.5" strokeLinecap="round" />
              <rect x="25" y="28" width="3" height="11" fill="#12381e" rx="0.5" />
              <rect x="34.5" y="28" width="3" height="11" fill="#12381e" rx="0.5" />
              <rect x="44" y="28" width="3" height="11" fill="#12381e" rx="0.5" />
              <path d="M13 32C10 27 5 25 3 25C5 27 7 30 10 33" stroke="#2b6b3b" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M14 31C14 25 18 22 20 21C18 24 16 28 14 32" stroke="#2b6b3b" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M13 40C12 36 13 33 14 31" stroke="#133d1f" strokeWidth="2" strokeLinecap="round" />
              <path d="M58 32C61 27 66 26 68 26C66 28 64 31 61 34" stroke="#2b6b3b" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M57 31C57 26 53 23 51 22C53 25 55 28 57 32" stroke="#2b6b3b" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M4 42C18 36 38 35 68 39" stroke="#1b4d29" strokeWidth="3.6" strokeLinecap="round" />
              <path d="M9 48C24 42 44 41 63 46" stroke="#2d6d3d" strokeWidth="3.2" strokeLinecap="round" />
              <path d="M16 54C29 49 46 48 57 52" stroke="#4f885e" strokeWidth="2.6" strokeLinecap="round" />
              <path d="M36 14C36 10 39 8 42 8C42 10 40 12.5 36 14Z" fill="#5aa866" />
              <path d="M36 14C35 10 33 9 30 9C30 11 32 13 36 14Z" fill="#478a53" />
            </svg>

            <div className="flex flex-col leading-none">
              <span className="font-serif text-[21px] lg:text-[23px] font-bold tracking-tight text-[#143e22]">
                FarmLink
              </span>
              <span className="text-[9.5px] sm:text-[10px] font-medium tracking-wide text-[#1f532e]/85 mt-0.5">
                Connecting Farmers with Buyers
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((item) => {
              const active = isCurrentActive(item.path)
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`relative text-sm transition-colors px-3.5 py-1.5 rounded-full ${
                    active
                      ? 'bg-[#184828] text-white font-semibold shadow-2xs'
                      : 'text-[#2a3c2c] hover:text-[#184828] hover:bg-[#184828]/5 font-medium'
                  }`}
                >
                  {item.name}
                  {active && (
                    <svg
                      className="absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-10 h-1.5 text-[#184828]"
                      viewBox="0 0 40 6"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M2 3.5C14 0.5 26 0.5 38 3.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  )}
                </NavLink>
              )
            })}
          </nav>

          {/* Desktop action matching reference mockup */}
          <div className="hidden lg:flex items-center">
            <Link
              to="/company/login"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border border-[#5d281f]/55 bg-[#fffdf8]/85 backdrop-blur-xs text-[#5d281f] hover:bg-[#5d281f] hover:text-white font-semibold text-sm shadow-2xs transition-colors"
            >
              <CompanyIcon className="w-4 h-4" />
              <span>Company Login</span>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 -mr-1 rounded-lg text-[#143e22] hover:bg-[#184828]/10 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18" />
                <path d="M6 6L18 18" />
              </svg>
            ) : (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6.5H20" />
                <path d="M4 12H20" />
                <path d="M4 17.5H20" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#e9e1ce] bg-[#fbf8f1] px-4 py-3 space-y-1 shadow-md">
          {navLinks.map((item) => {
            const active = isCurrentActive(item.path)
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#184828] text-white font-semibold'
                    : 'text-[#2a3c2c] hover:bg-[#184828]/5 hover:text-[#184828]'
                }`}
              >
                {item.name}
              </NavLink>
            )
          })}

          <div className="pt-3 mt-2 border-t border-[#e9e1ce] flex flex-col gap-2">
            <Link
              to="/company/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg border border-[#5d281f]/65 text-[#5d281f] hover:bg-[#5d281f] hover:text-white font-semibold text-sm transition-colors"
            >
              <CompanyIcon className="w-4 h-4" />
              <span>Company Login</span>
            </Link>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center py-2 rounded-lg border border-[#184828]/30 text-[#184828] font-semibold text-sm hover:bg-[#184828]/5 transition-colors"
              >
                Farmer Login
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center py-2 rounded-lg bg-[#184828] text-white font-semibold text-sm hover:bg-[#12381e] transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
