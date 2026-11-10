import { Link } from 'react-router-dom'

const PILLARS = [
  {
    title: 'Direct & Trusted',
    desc: 'Sell directly to a verified purchasing company',
    icon: (
      <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#1b5e28]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4L16 11" />
        <path d="m13 7-2-2a1 1 0 0 0-1.4 0L5.3 9.3a1 1 0 0 0 0 1.4L8 13" />
        <path d="m14 14 3-3" />
        <path d="m7 7 3 3" />
      </svg>
    ),
  },
  {
    title: 'Fair Price',
    desc: 'Negotiate and get the best value for your produce',
    icon: (
      <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#1b5e28]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="6" rx="8" ry="3" />
        <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
        <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
      </svg>
    ),
  },
  {
    title: 'Secure & Transparent',
    desc: 'Clear orders, payments and records',
    icon: (
      <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#1b5e28]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Simple to Use',
    desc: 'Easy for every farmer, from anywhere',
    icon: (
      <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-[#1b5e28]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 20h10" />
        <path d="M12 20v-8" />
        <path d="M12 12c-3 0-6-2.5-6-6 4 0 6 2 6 6Z" />
        <path d="M12 12c3 0 6-2.5 6-6-4 0-6 2-6 6Z" />
      </svg>
    ),
  },
]

const CELL_BORDERS = [
  'border-r border-b lg:border-b-0 border-[#e5dcbd]',
  'border-b lg:border-b-0 lg:border-r border-[#e5dcbd]',
  'border-r border-[#e5dcbd]',
  '',
]

export default function HeroSection() {
  return (
    <section className="relative w-full bg-[#fbf8f1]">
      {/* Hero Banner — extends cleanly behind the translucent glassmorphic Navbar for full sky, roof & basket framing */}
      <div className="relative w-full min-h-[max(248px,34dvh)] sm:min-h-[max(310px,41dvh)] lg:min-h-0 flex items-center lg:block overflow-hidden">
        {/* Mobile background image */}
        <img
          src="/hero/hero-mobile-cropped.png"
          alt="Kerala countryside with a basket of fresh vegetables"
          className="lg:hidden absolute inset-0 w-full h-full object-cover object-bottom sm:object-[center_82%]"
          fetchPriority="high"
        />

        {/* Desktop background image anchored to right ~68% so sky, palms, Kerala tiled roof & full basket fit naturally without over-zooming */}
        <div className="hidden lg:block absolute inset-y-0 right-0 w-[70%] xl:w-[66%] pointer-events-none">
          <img
            src="/hero/hero-desktop.png"
            alt="Kerala veranda with a harvest of fresh vegetables"
            className="w-full h-full object-cover object-[right_86%] [@media(min-width:1280px)_and_(min-height:760px)]:object-[right_82%]"
            fetchPriority="high"
          />
          {/* Smooth left edge dissolve into #fbf8f1 cream */}
          <div
            className="absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-[#fbf8f1] via-[#fbf8f1]/75 to-transparent"
            aria-hidden="true"
          />
        </div>

        {/* Mobile readability wash */}
        <div
          className="lg:hidden absolute inset-0 bg-[linear-gradient(100deg,rgba(251,248,241,0.96)_0%,rgba(251,248,241,0.90)_48%,rgba(251,248,241,0.44)_70%,rgba(251,248,241,0.05)_92%)] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="lg:hidden absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#fbf8f1]/75 via-[#fbf8f1]/30 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Desktop readability wash across left column */}
        <div
          className="hidden lg:block absolute inset-0 bg-[linear-gradient(90deg,#fbf8f1_0%,#fbf8f1_28%,rgba(251,248,241,0.86)_40%,rgba(251,248,241,0.28)_55%,transparent_70%)] pointer-events-none"
          aria-hidden="true"
        />

        {/* Subtle bottom edge blend */}
        <div
          className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#fbf8f1]/40 to-transparent pointer-events-none"
          aria-hidden="true"
        />

        {/* Foreground Content (top padding clears glassmorphic Navbar) */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-[60px] pb-5 sm:pt-[70px] sm:pb-9 lg:pt-[60px] lg:pb-8 [@media(min-width:1280px)_and_(min-height:760px)]:pt-[84px] [@media(min-width:1280px)_and_(min-height:760px)]:pb-12">
          <div className="w-full max-w-[235px] sm:max-w-[350px] lg:max-w-[495px] xl:max-w-[530px]">
            <h1 className="font-serif text-[#143e22] text-[22.5px] sm:text-[34px] lg:text-[34px] xl:text-[38px] [@media(min-width:1280px)_and_(min-height:760px)]:text-[48px] font-bold tracking-tight leading-[1.06]">
              Your Harvest,
              <br />
              A Reliable Market
            </h1>

            {/* Ornamental leaf divider */}
            <div className="my-1 sm:my-2 flex items-center gap-2 max-w-[130px] sm:max-w-[180px] lg:max-w-[210px]">
              <div className="flex-1 h-[1px] bg-[#3a7548]/45 rounded-full" />
              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-[#3a7548] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21 3C11.5 3 7 8 7 14c0 1.5.3 3 .8 4.2L3 21l3.8-4.8c1.2.5 2.7.8 4.2.8 6 0 11-4.5 11-14z" />
              </svg>
              <div className="flex-1 h-[1px] bg-[#3a7548]/45 rounded-full" />
            </div>

            <p className="text-[#253828] text-[10.8px] sm:text-[13.5px] lg:text-[13.5px] xl:text-[14px] [@media(min-width:1280px)_and_(min-height:760px)]:text-[16px] leading-[1.28] sm:leading-[1.33]">
              A simple and trusted platform that connects farmers directly with a purchasing company. List your produce, get fair offers, and sell with confidence.
            </p>

            {/* Primary Farmer CTAs */}
            <div className="mt-2 sm:mt-3.5 lg:mt-3 [@media(min-width:1280px)_and_(min-height:760px)]:mt-4 flex flex-col lg:flex-row gap-1.5 sm:gap-2.5 lg:gap-3 w-[195px] sm:w-[245px] lg:w-auto">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 xl:py-2.5 px-3 lg:px-4.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white font-semibold text-[11.5px] sm:text-sm lg:text-[13.5px] xl:text-[14.5px] shadow-md transition-all active:scale-[0.98]"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M7 8C7 5 9 3 12 3C15 3 17 5 17 8H7Z" />
                  <path d="M2 10C2 8.8 6.5 8 12 8C17.5 8 22 8.8 22 10C22 11.2 17.5 12 12 12C6.5 12 2 11.2 2 10Z" />
                  <circle cx="12" cy="13.5" r="2.2" />
                  <path d="M6.5 21C6.5 17.8 9 16.5 12 16.5C15 16.5 17.5 17.8 17.5 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
                </svg>
                <span>Register as a Farmer</span>
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 xl:py-2.5 px-3 lg:px-4.5 rounded-xl border border-[#5d281f]/45 bg-[#fcf7ea]/95 hover:bg-white text-[#143e22] font-semibold text-[11.5px] sm:text-sm lg:text-[13.5px] xl:text-[14.5px] shadow-2xs transition-all active:scale-[0.98]"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#184828] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

      {/* 4-Pillar Feature Ribbon overlapping bottom of Hero */}
      <div className="relative z-20 max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 -mt-3 sm:-mt-5">
        <div className="bg-[#fcf9f2]/95 backdrop-blur-xs border border-[#e5dcbd] rounded-xl sm:rounded-2xl shadow-[0_6px_22px_rgba(20,62,34,0.07)] px-1 py-0.5 sm:px-3 sm:py-1 lg:px-4 lg:py-1.5">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((pillar, idx) => (
              <div
                key={pillar.title}
                className={`flex items-start sm:items-center gap-1.5 sm:gap-2.5 px-1.5 py-1.5 sm:px-3 sm:py-2 lg:px-3 lg:py-2 ${CELL_BORDERS[idx]}`}
              >
                <div className="w-6.5 h-6.5 sm:w-9 sm:h-9 rounded-full bg-[#e0efd1] border border-[#c8dfb3] shrink-0 flex items-center justify-center mt-0.5 sm:mt-0">
                  {pillar.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="font-serif font-bold text-[#143e22] text-[11px] sm:text-[13.5px] lg:text-[14.5px] leading-[1.15]">
                    {pillar.title}
                  </h3>
                  <p className="mt-0.5 text-[9.5px] sm:text-[11px] lg:text-[11.5px] text-[#465a48] leading-[1.18] sm:leading-snug">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
