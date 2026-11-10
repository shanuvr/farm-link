import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import PublicPageBanner from '../components/PublicPageBanner'

const STATS = [
  { value: '14', label: 'Kerala Districts' },
  { value: '0%', label: 'Mandi Middlemen' },
  { value: '100%', label: 'KYC Verified Farmers' },
  { value: 'Direct', label: 'UPI & Bank Payouts' },
]

const CORE_PILLARS = [
  {
    title: 'Direct Institutional Demand',
    desc: 'Growers sell straight to Kerala Fresh Agro Procurement Pvt Ltd instead of navigating multi-tier broker networks.',
    icon: (
      <svg className="w-5 h-5 text-[#184828]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4L16 11" />
        <path d="m13 7-2-2a1 1 0 0 0-1.4 0L5.3 9.3a1 1 0 0 0 0 1.4L8 13" />
        <path d="m14 14 3-3" />
        <path d="m7 7 3 3" />
      </svg>
    ),
  },
  {
    title: 'Fair Two-Way Negotiation',
    desc: 'Farmers set asking prices and quality grades upfront, inspect buyer bids clearly, and submit counter-offers in real time.',
    icon: (
      <svg className="w-5 h-5 text-[#184828]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="6" rx="8" ry="3" />
        <path d="M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6" />
        <path d="M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6" />
      </svg>
    ),
  },
  {
    title: 'OTP & KYC Account Integrity',
    desc: 'Every farmer account undergoes 4-digit mobile OTP verification and ID proof review before going live on procurement feeds.',
    icon: (
      <svg className="w-5 h-5 text-[#184828]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Tracked Collections & Payouts',
    desc: 'Agreed orders clearly specify Payment Before Collection or Payment After Collection, routing funds directly to saved UPI or Bank accounts.',
    icon: (
      <svg className="w-5 h-5 text-[#184828]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <line x1="2" y1="10" x2="22" y2="10" />
      </svg>
    ),
  },
]

const ECOSYSTEM_ROLES = [
  {
    tag: '01 • Farmer Network',
    title: 'Verified Growers & Farm Clusters',
    desc: 'Independent smallholders across Kerala register with Aadhaar or Krishi Bhavan ID, list harvest lots by grade and kg, negotiate offers, and monitor dispatch receipts.',
    ctaLabel: 'Register as Farmer',
    ctaTo: '/register',
    icon: '/icons/Farmer Typing on Laptop.png',
  },
  {
    tag: '02 • Procurement Desk',
    title: 'Kerala Fresh Agro Procurement',
    desc: 'Our dedicated institutional buyer browses verified regional supply, submits structured price offers, chooses settlement terms, and dispatches collection vehicles.',
    ctaLabel: 'Company Portal Login',
    ctaTo: '/company',
    icon: '/icons/Fresh Produce Truck with Rupee Badge.png',
  },
  {
    tag: '03 • Verification Control',
    title: 'Platform KYC & Payout Review',
    desc: 'Every grower onboarding request is inspected against submitted ID proof and Bank/UPI details by FarmLink verification officers before live trading begins.',
    ctaLabel: 'Explore FAQ',
    ctaTo: '/faq',
    icon: '/icons/Handshake Agreement with Accent Rays.png',
  },
]

const FEATURED_CROPS = [
  { name: 'Nendran Banana', district: 'Kottayam & Wayanad', img: '/crops/banana-1.jpg' },
  { name: 'Country Tomatoes', district: 'Palakkad & Thrissur', img: '/crops/tomatoes-1.jpg' },
  { name: 'Fresh Farm Ginger', district: 'Wayanad Foothills', img: '/crops/ginger-1.jpg' },
  { name: 'Yardlong Beans', district: 'Alathur & Ernakulam', img: '/crops/beans-1.jpg' },
  { name: 'Tapioca (Kappa)', district: 'Idukki & Kollam', img: '/crops/tapioca-1.jpg' },
]

export default function About() {
  return (
    <main className="w-full bg-[#fbf8f1]">
      <PublicPageBanner
        eyebrow="About FarmLink • Kerala Pilot"
        title="Built to Give Kerala Farmers a Direct, Reliable Market."
        description="FarmLink bridges independent agricultural growers across all 14 districts directly with verified institutional procurement — eliminating middleman guesswork, clarifying pricing upfront, and ensuring every rupee settles straight to the farmer."
        bottomSlot={
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#184828] hover:bg-[#12381e] text-white font-semibold text-sm shadow-sm transition-colors"
            >
              <span>Join as Verified Farmer</span>
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#5d281f]/45 bg-[#fffdf8] text-[#5d281f] hover:bg-[#5d281f] hover:text-white font-semibold text-sm transition-colors"
            >
              <span>Contact Procurement Desk</span>
            </Link>
          </div>
        }
        rightSlot={
          <div className="rounded-3xl border border-[#e5dcbd] bg-[#fffdf8] p-3.5 shadow-[0_14px_40px_rgba(20,62,34,0.08)]">
            <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden">
              <img
                src="/hero/hero-mobile-cropped.png"
                alt="Freshly harvested Kerala vegetables on a farm veranda"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#12381f]/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3.5 right-3.5 flex items-center justify-between text-white">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#b9e6a8]">
                    Regional Supply Network
                  </p>
                  <p className="font-serif text-base font-bold leading-snug">
                    Farm-Gate to Procurement Center
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2.5">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-[#f4f9f0] border border-[#dce8d4] px-3 py-2.5 text-center"
                >
                  <p className="font-serif text-xl font-bold text-[#143e22] leading-none">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-[#465a48]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        }
      />

      {/* Mission & Direct Model Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <article className="lg:col-span-6 rounded-3xl border border-[#e5dcbd] bg-[#fffdf8] p-6 sm:p-8 shadow-xs flex flex-col justify-between">
            <div>
              <span className="inline-block px-3 py-1 rounded-full bg-[#fdf6ec] border border-[#ebd8be] text-[#5d281f] text-[11px] font-bold uppercase tracking-wider mb-3">
                The Challenge
              </span>
              <h2 className="font-serif text-2xl sm:text-[26px] font-bold text-[#143e22] tracking-tight">
                Why Traditional Produce Sales Leave Growers Guessing
              </h2>
              <p className="mt-3 text-sm text-[#465a48] leading-relaxed">
                Across regional agricultural belts, hardworking cultivators spend months nurturing Nendran bananas, yardlong beans, ginger, and seasonal vegetables — yet only learn final net realizations after transport, loading fees, and multiple broker commissions have already been subtracted.
              </p>
              <p className="mt-3 text-sm text-[#465a48] leading-relaxed">
                Unclear verbal price commitments and delayed credit settlements force farmers to accept distressed rates on harvest day rather than planning confidently for their next crop cycle.
              </p>
            </div>
            <div className="mt-6 pt-5 border-t border-[#e9e1ce] grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-[#fbf8f1] border border-[#e5dcbd] px-3.5 py-2.5">
                <p className="font-semibold text-[#5d281f]">Before FarmLink</p>
                <p className="mt-0.5 text-[#465a48]">Broker markups &amp; unrecorded verbal rates</p>
              </div>
              <div className="rounded-xl bg-[#e8f3e1] border border-[#cde2be] px-3.5 py-2.5">
                <p className="font-semibold text-[#143e22]">With FarmLink</p>
                <p className="mt-0.5 text-[#184828]">Direct digital bids &amp; verified receipts</p>
              </div>
            </div>
          </article>

          <article className="lg:col-span-6 relative rounded-3xl bg-[#143e22] text-white p-6 sm:p-8 shadow-md overflow-hidden flex flex-col justify-between">
            <img
              src="/hero/side bar bg.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute inset-x-0 bottom-0 w-full h-56 object-cover object-bottom opacity-20 mix-blend-luminosity"
            />
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full bg-white/15 border border-white/25 text-[#b9e6a8] text-[11px] font-bold uppercase tracking-wider mb-3">
                Our Commitment
              </span>
              <h2 className="font-serif text-2xl sm:text-[26px] font-bold text-white tracking-tight">
                Transparent Procurement with Single-Company Accountability
              </h2>
              <p className="mt-3 text-sm text-green-100/90 leading-relaxed">
                Instead of crowding growers with unverified anonymous middlemen, FarmLink connects verified farmers directly to our unified procurement partner —{' '}
                <strong className="text-white font-semibold">Kerala Fresh Agro Procurement Pvt Ltd</strong>.
              </p>
              <ul className="mt-5 space-y-2.5 text-sm text-green-50">
                {[
                  'Written rupee-per-kg offer terms before any pickup is scheduled',
                  'Clear choice of Payment Before Collection or Payment After Collection',
                  'Direct payouts via UPI or IMPS/NEFT tied to verified farmer records',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-[#2c6e43] text-[#b9e6a8] flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 text-xs text-green-100/85">
              <span>Headquartered in Kochi, Kerala</span>
              <Link to="/faq" className="font-semibold text-[#b9e6a8] hover:underline">
                Read how settlements work →
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-14">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#5d281f]">
              Platform Standards
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#143e22] tracking-tight mt-0.5">
              Built for Trust at Every Harvest Step
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#465a48] max-w-md">
            Designed around smallholder reliability — clean workflows from mobile OTP registration to harvest-day payment receipts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CORE_PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className="rounded-2xl border border-[#e5dcbd] bg-[#fffdf8] p-5 shadow-2xs hover:border-[#b7caaa] transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-[#e8f3e1] border border-[#cde2be] flex items-center justify-center mb-3.5">
                {pillar.icon}
              </div>
              <h3 className="font-serif text-base font-bold text-[#143e22]">
                {pillar.title}
              </h3>
              <p className="mt-1.5 text-xs sm:text-[13px] text-[#465a48] leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Three Portals Ecosystem */}
      <section className="bg-[#f4f1e8]/75 border-y border-[#e5dcbd]/80 py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#184828]">
              Unified Architecture
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#143e22] mt-1">
              Three Portals Keeping Trade Organized
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#465a48]">
              Clear separation between farmer selling tools, company procurement operations, and platform KYC moderation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {ECOSYSTEM_ROLES.map((role) => (
              <div
                key={role.title}
                className="rounded-2xl border border-[#e5dcbd] bg-[#fffdf8] p-5 sm:p-6 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <span className="px-2.5 py-1 rounded-full bg-[#e8f3e1] text-[#184828] text-[11px] font-bold">
                      {role.tag}
                    </span>
                    <img
                      src={role.icon}
                      alt=""
                      className="w-11 h-11 object-contain"
                    />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#143e22]">
                    {role.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-[13px] text-[#465a48] leading-relaxed">
                    {role.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#e9e1ce]">
                  <Link
                    to={role.ctaTo}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#184828] hover:text-[#12381e] hover:underline"
                  >
                    <span>{role.ctaLabel}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regional Kerala Crops + Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-6">
        <div className="mb-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#5d281f]">
            Regional Harvests
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#143e22] mt-0.5">
            Key Crops Sourced Across Kerala Clusters
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mb-10">
          {FEATURED_CROPS.map((crop) => (
            <div
              key={crop.name}
              className="rounded-2xl border border-[#e5dcbd] bg-[#fffdf8] overflow-hidden shadow-2xs group"
            >
              <div className="h-28 sm:h-32 overflow-hidden">
                <img
                  src={crop.img}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <p className="font-serif text-sm font-bold text-[#143e22] leading-tight">
                  {crop.name}
                </p>
                <p className="mt-0.5 text-[11px] text-[#5a705d]">
                  {crop.district}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Clean CTA strip before footer wave */}
        <div className="rounded-3xl border border-[#cde2be] bg-[#e8f3e1]/65 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl font-bold text-[#143e22]">
              Ready to List Your Next Harvest?
            </h2>
            <p className="mt-1.5 text-sm text-[#35523b]">
              Complete farmer onboarding with mobile OTP &amp; ID proof verification in minutes, or reach our regional helpdesk if you need assistance getting started.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#184828] hover:bg-[#12381e] text-white font-semibold text-sm shadow-sm transition-colors"
            >
              <span>Farmer Registration →</span>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#184828]/35 bg-[#fffdf8] text-[#143e22] hover:bg-[#184828]/5 font-semibold text-sm transition-colors"
            >
              <span>Talk to Support</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
