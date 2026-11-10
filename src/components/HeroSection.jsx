import { Link } from 'react-router-dom'

export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#fbf8f1] overflow-hidden">

      {/* ================= MOBILE HERO ================= */}
      <div className="relative lg:hidden w-full">
        <div className="relative w-full">
          <img
            src="/hero/hero-mobile.png"
            alt="Kerala countryside with a basket of fresh vegetables"
            className="w-full h-auto sm:h-[640px] object-cover object-top block"
          />

          {/* Soft top wash for headline readability, fades quickly so the photo stays visible */}
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(251,248,241,0.92)_0%,rgba(251,248,241,0.55)_28%,rgba(251,248,241,0.12)_48%,transparent_62%)] pointer-events-none" />

          {/* Bottom fade into the cream page background */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#fbf8f1] to-transparent pointer-events-none" />

          {/* Content */}
          <div className="absolute inset-x-0 top-0 z-10 px-5 sm:px-8 pt-6 sm:pt-10 flex flex-col items-start">
            <h1 className="font-serif text-[#143e22] text-[32px] sm:text-[42px] font-bold tracking-tight leading-[1.1] text-left">
              Your Harvest,<br />
              <span className="text-[#143e22]">A Reliable Market</span>
            </h1>

            <div className="my-3 flex items-center gap-1.5 self-start">
              <div className="w-6 h-[1.5px] bg-[#3a7548]/40 rounded-full" />
              <svg className="w-4 h-4 text-[#3a7548]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 3C11.5 3 7 8 7 14c0 1.5.3 3 .8 4.2L3 21l3.8-4.8c1.2.5 2.7.8 4.2.8 6 0 11-4.5 11-14z" />
              </svg>
              <div className="w-6 h-[1.5px] bg-[#3a7548]/40 rounded-full" />
            </div>

            <p className="text-[#2c4030] text-[13px] sm:text-[15px] leading-relaxed max-w-[330px] sm:max-w-[420px] text-left">
              A simple and trusted platform that connects farmers directly with a purchasing company. List your produce, get fair offers, and sell with confidence.
            </p>

            <div className="mt-4 flex flex-col w-full max-w-[310px] sm:max-w-[340px] gap-2.5">
              <Link
                to="/register"
                className="flex items-center justify-center gap-2.5 w-full py-2.5 px-4 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white font-semibold text-sm shadow-md transition-all active:scale-[0.98]"
              >
                <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M7 8C7 5 9 3 12 3C15 3 17 5 17 8H7Z" />
                  <path d="M2 10C2 8.8 6.5 8 12 8C17.5 8 22 8.8 22 10C22 11.2 17.5 12 12 12C6.5 12 2 11.2 2 10Z" />
                  <circle cx="12" cy="13.5" r="2.2" />
                  <path d="M6.5 21C6.5 17.8 9 16.5 12 16.5C15 16.5 17.5 17.8 17.5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
                <span>Register as a Farmer</span>
              </Link>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2.5 w-full py-2.5 px-4 rounded-xl border border-[#184828]/50 bg-[#fdfbf6]/90 hover:bg-white text-[#184828] font-semibold text-sm shadow-2xs transition-all active:scale-[0.98]"
              >
                <svg className="w-4 h-4 text-[#184828]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                <span>Farmer Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DESKTOP HERO ================= */}
      <div className="hidden lg:block relative w-full">
        {/* Full-bleed photo anchored to the right edge */}
        <div className="absolute inset-y-0 right-0 w-[55%] xl:w-[56%] overflow-hidden pointer-events-none">
          <img
            src="/hero/hero-desktop.png"
            alt="Kerala veranda with a harvest of fresh vegetables"
            className="w-full h-full object-cover object-center"
          />
          {/* Fade the left edge into the cream background */}
          <div className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#fbf8f1] via-[#fbf8f1]/60 to-transparent" />
          {/* Soft top and bottom blends */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#fbf8f1]/70 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#fbf8f1]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-12 items-center min-h-[440px] py-12">
            <div className="col-span-6 xl:col-span-5 flex flex-col justify-center">
              <h1 className="font-serif text-[#143e22] text-[44px] xl:text-[54px] font-bold tracking-tight leading-[1.1]">
                Your Harvest,<br />
                <span className="text-[#143e22]">A Reliable Market</span>
              </h1>

              <div className="mt-3 flex items-center gap-1.5">
                <svg className="w-5 h-5 text-[#4a8a58]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 3C11.5 3 7 8 7 14c0 1.5.3 3 .8 4.2L3 21l3.8-4.8c1.2.5 2.7.8 4.2.8 6 0 11-4.5 11-14z" />
                </svg>
                <div className="w-8 h-[1.5px] bg-[#4a8a58]/40 rounded-full" />
              </div>

              <p className="mt-4 text-[#2c4030] text-base xl:text-lg leading-relaxed max-w-[480px] xl:max-w-[520px]">
                A simple and trusted platform that connects farmers directly with a purchasing company. List your produce, get fair offers, and sell with confidence.
              </p>

              <div className="mt-7 flex items-center gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white font-semibold text-[15px] transition-all duration-150 shadow-md hover:shadow-lg"
                >
                  <svg className="w-5 h-5 fill-current text-white/95" viewBox="0 0 24 24">
                    <path d="M7 8C7 5 9 3 12 3C15 3 17 5 17 8H7Z" />
                    <path d="M2 10C2 8.8 6.5 8 12 8C17.5 8 22 8.8 22 10C22 11.2 17.5 12 12 12C6.5 12 2 11.2 2 10Z" />
                    <circle cx="12" cy="13.5" r="2.2" />
                    <path d="M6.5 21C6.5 17.8 9 16.5 12 16.5C15 16.5 17.5 17.8 17.5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                  </svg>
                  <span>Register as a Farmer</span>
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl border border-[#184828]/50 bg-white/70 hover:bg-white text-[#184828] font-semibold text-[15px] transition-all duration-150 shadow-2xs hover:shadow-sm"
                >
                  <svg className="w-5 h-5 text-[#184828]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                    <polyline points="10 17 15 12 10 7" />
                    <line x1="15" y1="12" x2="3" y2="12" />
                  </svg>
                  <span>Farmer Login</span>
                </Link>
              </div>
            </div>

            <div className="col-span-6 xl:col-span-7" />
          </div>
        </div>
      </div>

      {/* ================= FEATURE PILLARS RIBBON ================= */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-1 sm:-mt-2 lg:mt-0 pb-8">
        <div className="bg-[#fcf9f2] border border-[#e5dcbd] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-[0_4px_18px_rgba(24,72,40,0.04)]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-y divide-[#e5dcbd] sm:divide-y-0 lg:divide-y-0">

            {/* Feature 1 */}
            <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-3.5 p-3 sm:p-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#dbeecd] flex-shrink-0 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#1b5e28]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4L16 11" />
                  <path d="m13 7-2-2a1 1 0 0 0-1.4 0L5.3 9.3a1 1 0 0 0 0 1.4L8 13" />
                  <path d="m14 14 3-3" />
                  <path d="m7 7 3 3" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif font-bold text-[#143e22] text-sm sm:text-base leading-tight">
                  Direct &amp; Trusted
                </h3>
                <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-[#465a48] leading-tight">
                  Sell directly to a verified company
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-3.5 p-3 sm:p-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#dbeecd] flex-shrink-0 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#1b5e28]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="6" rx="8" ry="3" />
                  <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
                  <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif font-bold text-[#143e22] text-sm sm:text-base leading-tight">
                  Fair Price
                </h3>
                <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-[#465a48] leading-tight">
                  Negotiate and get the best value
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-3.5 p-3 sm:p-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#dbeecd] flex-shrink-0 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#1b5e28]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif font-bold text-[#143e22] text-sm sm:text-base leading-tight">
                  Secure &amp; Transparent
                </h3>
                <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-[#465a48] leading-tight">
                  Clear orders, payments and records
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-3.5 p-3 sm:p-4">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#dbeecd] flex-shrink-0 flex items-center justify-center">
                <svg className="w-5 h-5 text-[#1b5e28]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 20h10" />
                  <path d="M12 20v-8" />
                  <path d="M12 12c-3 0-6-2.5-6-6 4 0 6 2 6 6Z" />
                  <path d="M12 12c3 0 6-2.5 6-6-4 0-6 2-6 6Z" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif font-bold text-[#143e22] text-sm sm:text-base leading-tight">
                  Simple to Use
                </h3>
                <p className="mt-0.5 sm:mt-1 text-[11px] sm:text-xs text-[#465a48] leading-tight">
                  Easy for every farmer, from anywhere
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  )
}
