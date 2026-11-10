import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import PublicPageBanner from '../components/PublicPageBanner'

const FAQ_CATEGORIES = [
  'All Topics',
  'Registration & KYC',
  'Listings & Pricing',
  'Offers & Negotiation',
  'Pickups & Payments',
  'Account & Security',
]

const FAQ_ITEMS = [
  {
    id: 'kyc-docs',
    category: 'Registration & KYC',
    question: 'Which ID proof documents are accepted during Farmer Registration?',
    answer:
      'FarmLink accepts any one valid government or agricultural identity proof: Aadhaar Card, Kisan Credit Card / Krishi Bhavan ID, Voter ID (EPIC), Driving Licence, or PAN Card. Clear photos (JPG/PNG) or PDFs up to 5 MB work smoothly for verification.',
  },
  {
    id: 'mobile-otp',
    category: 'Registration & KYC',
    question: 'Why is 4-digit mobile OTP verification required before submitting registration?',
    answer:
      'Verifying your 10-digit mobile number via OTP ensures buyer offers, pickup alerts, and direct payment updates always reach the genuine grower and prevents duplicate or mistyped accounts.',
  },
  {
    id: 'kyc-timeline',
    category: 'Registration & KYC',
    question: 'How long does Admin approval take, and what happens if an ID proof is declined?',
    answer:
      'Most grower applications are reviewed by our platform verification officer within one business day. If an uploaded image is blurry or mismatched, your status shows Declined / Re-submit with the exact review note so you can upload a clearer document.',
  },
  {
    id: 'listing-crops',
    category: 'Listings & Pricing',
    question: 'What types of crops can Kerala farmers list on FarmLink?',
    answer:
      'Farmers across all 14 districts can list fresh vegetables (tomatoes, brinjal, yardlong beans, okra, bitter gourd, snake gourd), fruits (Nendran banana, pineapple), spices (farm ginger, turmeric), and tubers like tapioca (kappa).',
  },
  {
    id: 'listing-pricing',
    category: 'Listings & Pricing',
    question: 'Do I have to use the suggested price, or can I set my own per-kg rate?',
    answer:
      'You always stay in control of your asking price. FarmLink shows helpful reference prices for Kerala grades (Grade A, Grade B, Organic / Farm Fresh), and you can enter the exact per-kg or per-bunch price you expect.',
  },
  {
    id: 'listing-edit',
    category: 'Listings & Pricing',
    question: 'Can I update quantity or pause a produce listing before an offer is accepted?',
    answer:
      'Yes. Inside your Farmer Dashboard under My Listings, you can adjust available harvest quantities, revise your target rate, or mark a batch unavailable anytime prior to accepting a buyer offer.',
  },
  {
    id: 'buyer-identity',
    category: 'Offers & Negotiation',
    question: 'Who sends purchase offers for my listed produce?',
    answer:
      'FarmLink operates a verified single-company procurement model with Kerala Fresh Agro Procurement Pvt Ltd. Instead of dealing with unknown brokers, every bid comes directly from our vetted buyer procurement desk.',
  },
  {
    id: 'counter-offer',
    category: 'Offers & Negotiation',
    question: 'How does price negotiation work if an offer is below my target rate?',
    answer:
      'When an offer arrives in your Offers tab, you can click Negotiate to propose a revised per-kg counter-rate alongside a short note. You are never locked into accepting the opening bid — orders proceed only when both sides agree.',
  },
  {
    id: 'reject-offer',
    category: 'Offers & Negotiation',
    question: 'What happens if I decline a procurement offer?',
    answer:
      'Declining an offer leaves your listing active on the buyer browse feed with your remaining harvest quantity intact, ready for future bids or revised batch terms.',
  },
  {
    id: 'payment-modes',
    category: 'Pickups & Payments',
    question: 'What is the difference between Payment Before Collection and Payment After Collection?',
    answer:
      'Each buyer offer specifies the settlement term upfront before you accept: Payment Before Collection (Pay Now) settles via UPI/Bank before dispatch, while Payment After Collection (Pay at Pickup) triggers payout immediately once quality and weight are verified at pickup.',
  },
  {
    id: 'payout-destination',
    category: 'Pickups & Payments',
    question: 'Where are my order payments credited, and how can I update my UPI or Bank account?',
    answer:
      'Funds are settled directly to the verified UPI ID or Bank Account saved in your Farmer Profile (Payment & Bank Details). Keeping your UPI or IFSC/account details accurate ensures instant settlement without middleman holds.',
  },
  {
    id: 'pickup-receipts',
    category: 'Pickups & Payments',
    question: 'How do I confirm pickup dispatch and check past payment records?',
    answer:
      'Your Orders desk tracks each confirmed sale from Ready for Pickup through Dispatched and Paid, while the Reports tab summarizes your completed harvest tonnage, revenue totals, and downloadable order statements.',
  },
  {
    id: 'account-support',
    category: 'Account & Security',
    question: 'What should I do if I change my mobile number or need to update KYC records?',
    answer:
      'You can update payout preferences inside Profile Settings, or send a quick request via the Contact Support page with your registered name and district so a verification officer can assist safely.',
  },
  {
    id: 'data-safety',
    category: 'Account & Security',
    question: 'Who can view my uploaded Aadhaar or Krishi Bhavan ID document?',
    answer:
      'Uploaded KYC proof documents are restricted strictly to FarmLink Platform Control officers solely for identity verification and payout compliance — buyer procurement views show your verified status badge rather than raw ID files.',
  },
]

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All Topics')
  const [openIds, setOpenIds] = useState(() => new Set([FAQ_ITEMS[0].id, FAQ_ITEMS[9].id]))

  const categoryCounts = useMemo(() => {
    const counts = { 'All Topics': FAQ_ITEMS.length }
    for (const item of FAQ_ITEMS) {
      counts[item.category] = (counts[item.category] || 0) + 1
    }
    return counts
  }, [])

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory = activeCategory === 'All Topics' || item.category === activeCategory
      if (!matchesCategory) return false
      if (!query) return true
      return (
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      )
    })
  }, [activeCategory, searchQuery])

  const allFilteredOpen =
    filteredItems.length > 0 && filteredItems.every((item) => openIds.has(item.id))

  const toggleItem = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleToggleAll = () => {
    if (allFilteredOpen) {
      setOpenIds((prev) => {
        const next = new Set(prev)
        filteredItems.forEach((item) => next.delete(item.id))
        return next
      })
    } else {
      setOpenIds((prev) => {
        const next = new Set(prev)
        filteredItems.forEach((item) => next.add(item.id))
        return next
      })
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setActiveCategory('All Topics')
  }

  return (
    <main className="w-full bg-[#fbf8f1]">
      <PublicPageBanner
        eyebrow="Help Center & FAQ"
        title="Frequently Asked Questions"
        description="Everything growers and procurement coordinators need to know about onboarding, mobile OTP, KYC verification, crop negotiations, and direct Bank/UPI settlements."
        bottomSlot={
          <div className="max-w-xl">
            <div className="relative flex items-center rounded-2xl border border-[#d6ccb4] bg-[#fffdf8] shadow-xs focus-within:border-[#184828] focus-within:ring-2 focus-within:ring-[#184828]/12 transition-all">
              <span className="pl-4 text-[#5a705d] shrink-0" aria-hidden="true">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Aadhaar, OTP, Pay at Pickup, UPI, Krishi ID..."
                aria-label="Search frequently asked questions"
                className="w-full bg-transparent px-3 py-3 text-sm text-[#143e22] placeholder:text-[#7c8c7e] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mr-2 px-2 py-1 rounded-lg text-xs font-semibold text-[#5a705d] hover:text-[#143e22] hover:bg-[#f4f1e8] cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        }
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Category Pills + Expand Control */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 md:flex-wrap">
            {FAQ_CATEGORIES.map((category) => {
              const active = activeCategory === category
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`select-none inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#184828] text-white shadow-2xs'
                      : 'bg-[#fffdf8] border border-[#e5dcbd] text-[#2c3e2d] hover:border-[#184828]/40 hover:text-[#143e22]'
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] leading-none ${
                      active ? 'bg-white/20 text-white' : 'bg-[#f4f1e8] text-[#5a705d]'
                    }`}
                  >
                    {categoryCounts[category] || 0}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
            <span className="text-xs text-[#5a705d] font-medium">
              Showing {filteredItems.length} of {FAQ_ITEMS.length}
            </span>
            {filteredItems.length > 0 && (
              <button
                type="button"
                onClick={handleToggleAll}
                className="px-3 py-1.5 rounded-xl border border-[#d6ccb4] bg-[#fffdf8] hover:bg-[#f4f9f0] text-xs font-semibold text-[#184828] transition-colors cursor-pointer"
              >
                {allFilteredOpen ? 'Collapse All' : 'Expand All'}
              </button>
            )}
          </div>
        </div>

        {/* Main Accordion + Right Quick Help Column */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-3">
            {filteredItems.length === 0 ? (
              <div className="rounded-3xl border border-[#e5dcbd] bg-[#fffdf8] p-8 text-center">
                <p className="font-serif text-xl font-bold text-[#143e22]">
                  No questions matched your search
                </p>
                <p className="mt-1.5 text-xs sm:text-sm text-[#465a48]">
                  Try another keyword or clear your filters to browse all {FAQ_ITEMS.length} FarmLink answers.
                </p>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-4 px-5 py-2 rounded-xl bg-[#184828] hover:bg-[#12381e] text-white text-xs font-semibold transition-colors cursor-pointer"
                >
                  Clear Search &amp; Filters
                </button>
              </div>
            ) : (
              filteredItems.map((item) => {
                const isOpen = openIds.has(item.id)
                return (
                  <div
                    key={item.id}
                    className={`rounded-2xl border bg-[#fffdf8] transition-all ${
                      isOpen
                        ? 'border-[#184828]/40 shadow-[0_8px_24px_rgba(20,62,34,0.06)]'
                        : 'border-[#e5dcbd] hover:border-[#c8bc9d]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleItem(item.id)}
                      aria-expanded={isOpen}
                      className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                    >
                      <div>
                        <span className="inline-block px-2 py-0.5 rounded-full bg-[#e8f3e1] text-[#184828] text-[10.5px] font-semibold mb-1.5">
                          {item.category}
                        </span>
                        <h2 className="font-serif text-[15.5px] sm:text-base font-bold text-[#143e22] leading-snug">
                          {item.question}
                        </h2>
                      </div>
                      <span
                        className={`mt-1 w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                          isOpen
                            ? 'bg-[#184828] border-[#184828] text-white rotate-180'
                            : 'bg-[#fbf8f1] border-[#d6ccb4] text-[#143e22]'
                        }`}
                        aria-hidden="true"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="6 9 12 15 18 9" />
                        </svg>
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 border-t border-[#efe8d7] text-xs sm:text-sm text-[#465a48] leading-relaxed">
                        {item.answer}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {/* Right Quick Help Column */}
          <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-20">
            <div className="relative rounded-3xl bg-[#143e22] text-white p-6 shadow-md overflow-hidden">
              <img
                src="/hero/side bar bg.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none absolute inset-x-0 bottom-0 w-full h-36 object-cover object-bottom opacity-20 mix-blend-luminosity"
              />
              <div className="relative z-10">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 border border-white/25 text-[11px] font-semibold text-[#b9e6a8] uppercase tracking-wider">
                  Still Need Help?
                </span>
                <h2 className="font-serif text-xl font-bold mt-2.5">
                  Speak With Our Farmer Support Team
                </h2>
                <p className="mt-1.5 text-xs text-green-100/90 leading-relaxed">
                  Have a specific batch question, KYC re-upload issue, or payout query? Send us a direct support ticket or register your farm account.
                </p>

                <div className="mt-5 flex flex-col gap-2.5">
                  <Link
                    to="/contact"
                    className="w-full py-2.5 px-4 rounded-xl bg-white text-[#143e22] hover:bg-[#e8f3e1] font-semibold text-xs sm:text-sm text-center transition-colors"
                  >
                    Contact Support Desk →
                  </Link>
                  <Link
                    to="/register"
                    className="w-full py-2.5 px-4 rounded-xl border border-white/30 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm text-center transition-colors"
                  >
                    Start Farmer Registration
                  </Link>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#e5dcbd] bg-[#fffdf8] p-5 shadow-2xs space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#5d281f]">
                Quick Reference
              </p>
              <div className="text-xs text-[#465a48] space-y-2.5">
                <div className="rounded-xl bg-[#fbf8f1] border border-[#e5dcbd] px-3.5 py-2.5">
                  <p className="font-semibold text-[#143e22]">Accepted KYC IDs</p>
                  <p className="mt-0.5 text-[11.5px]">
                    Aadhaar • Krishi Bhavan / KCC • Voter ID • Driving Licence • PAN
                  </p>
                </div>
                <div className="rounded-xl bg-[#f4f9f0] border border-[#dce8d4] px-3.5 py-2.5">
                  <p className="font-semibold text-[#143e22]">Payout Channels</p>
                  <p className="mt-0.5 text-[11.5px]">
                    Instant UPI ID or Direct Bank Account (IMPS / NEFT)
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  )
}
