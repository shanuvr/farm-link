import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

const NAV_LINKS = [
  {
    name: 'Home',
    path: '/',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 10.5L12 3l9 7.5" />
        <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-5h4v5h4a1 1 0 0 0 1-1V9.5" />
      </svg>
    ),
  },
  {
    name: 'About Us',
    path: '/about',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 3C11.5 3 7 8 7 14c0 1.5.3 3 .8 4.2L3 21l3.8-4.8c1.2.5 2.7.8 4.2.8 6 0 11-4.5 11-14z" />
      </svg>
    ),
  },
  {
    name: 'FAQ',
    path: '/faq',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.5 2.5 0 0 1 4.9.8c0 1.7-2.4 2.2-2.4 3.5" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  {
    name: 'Contact',
    path: '/contact',
    icon: (
      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
]

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

  useEffect(() => {
    if (!mobileOpen) return undefined
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [mobileOpen])

  const isCurrentActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Dimmed Click-Away Backdrop (sibling outside sticky header to avoid fixed-positioning blur clip) */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
        className={`fixed inset-x-0 top-14 bottom-0 z-40 lg:hidden bg-[#143e22]/25 backdrop-blur-[2px] transition-opacity duration-300 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      <header className="sticky top-0 z-50 w-full bg-[#fbf8f1]/78 backdrop-blur-md backdrop-saturate-150 border-b border-[#e9e1ce]/70 shadow-[0_4px_20px_rgba(20,62,34,0.05)]">
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
            {NAV_LINKS.map((item) => {
              const active = isCurrentActive(item.path)
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={`relative text-sm transition-colors px-3.5 py-1.5 rounded-full select-none ${
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
              to="/company"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl border border-[#5d281f]/55 bg-[#fffdf8]/85 backdrop-blur-xs text-[#5d281f] hover:bg-[#5d281f] hover:text-white font-semibold text-sm shadow-2xs transition-colors"
            >
              <CompanyIcon className="w-4 h-4" />
              <span>Company Login</span>
            </Link>
          </div>

          {/* Animated Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`lg:hidden w-9 h-9 rounded-xl border flex items-center justify-center transition-colors select-none cursor-pointer focus:outline-none ${
              mobileOpen
                ? 'border-[#184828]/35 bg-[#e8f3e1] text-[#143e22]'
                : 'border-[#e5dcbd] bg-[#fffdf8]/90 text-[#143e22] hover:border-[#184828]/35 hover:bg-[#e8f3e1]/50'
            }`}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            <span className="w-[18px] flex flex-col gap-[3.5px]" aria-hidden="true">
              <span
                className={`block h-[2px] w-full rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  mobileOpen ? 'translate-y-[5.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-[2px] w-full rounded-full bg-current transition-all duration-200 ease-out ${
                  mobileOpen ? 'opacity-0 scale-x-0' : 'opacity-100 scale-x-100'
                }`}
              />
              <span
                className={`block h-[2px] w-full rounded-full bg-current transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  mobileOpen ? '-translate-y-[5.5px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Smooth Animated Mobile Overlay Dropdown Sheet */}
      <div
        className={`lg:hidden absolute inset-x-0 top-full z-50 grid transition-[grid-template-rows,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          mobileOpen
            ? 'grid-rows-[1fr] opacity-100 translate-y-0 pointer-events-auto'
            : 'grid-rows-[0fr] opacity-0 -translate-y-1.5 pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="overflow-hidden">
          <div className="border-t border-[#e9e1ce] bg-[#fbf8f1]/98 backdrop-blur-lg rounded-b-3xl shadow-[0_18px_42px_rgba(20,62,34,0.16)] px-4 pt-3 pb-4 space-y-3">
            {/* Grouped Navigation Links */}
            <nav className="rounded-2xl border border-[#e5dcbd] bg-[#fffdf8]/95 p-1.5 space-y-0.5 shadow-2xs">
              {NAV_LINKS.map((item, idx) => {
                const active = isCurrentActive(item.path)
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      transitionDelay: mobileOpen ? `${idx * 35}ms` : '0ms',
                    }}
                    className={`select-none flex items-center justify-between px-3 py-2.5 rounded-xl text-[13.5px] transition-all duration-200 ease-out ${
                      mobileOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-1.5'
                    } ${
                      active
                        ? 'bg-[#184828] text-white font-semibold shadow-2xs'
                        : 'text-[#2a3c2c] hover:bg-[#f4f9f0] hover:text-[#143e22] font-medium'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={active ? 'text-[#b9e6a8]' : 'text-[#5a705d]'}>
                        {item.icon}
                      </span>
                      <span>{item.name}</span>
                    </span>
                    {active ? (
                      <span className="w-2 h-2 rounded-full bg-[#b9e6a8]" aria-hidden="true" />
                    ) : (
                      <svg className="w-3.5 h-3.5 text-[#7c8c7e]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    )}
                  </NavLink>
                )
              })}
            </nav>

            {/* Account & Portal Actions */}
            <div className="space-y-2">
              <p className="px-1 text-[10px] font-bold uppercase tracking-wider text-[#5a705d]">
                Account &amp; Portal Access
              </p>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="select-none flex items-center justify-center h-10 rounded-xl border border-[#184828]/25 bg-[#fffdf8] text-[#143e22] hover:border-[#184828]/45 hover:bg-[#f4f9f0] font-semibold text-[13px] transition-colors"
                >
                  Farmer Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="select-none flex items-center justify-center h-10 rounded-xl bg-[#184828] hover:bg-[#12381e] text-white font-semibold text-[13px] shadow-xs transition-colors"
                >
                  Register
                </Link>
              </div>

              <Link
                to="/company"
                onClick={() => setMobileOpen(false)}
                className="select-none flex items-center justify-between gap-3 w-full px-3 py-2.5 rounded-xl border border-[#e5dcbd] bg-[#fffdf8] text-[#5d281f] hover:border-[#5d281f]/40 hover:bg-[#fdf6ef] transition-all"
              >
                <span className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-[#fdf0e6] text-[#5d281f] flex items-center justify-center shrink-0">
                    <CompanyIcon className="w-4 h-4" />
                  </span>
                  <span className="text-[13px] font-semibold">Company Login</span>
                </span>
                <span className="text-[11px] font-medium text-[#5d281f]/75">
                  Buyer Portal →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
    </>
  )
}
