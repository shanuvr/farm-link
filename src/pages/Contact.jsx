import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FloatingInputField,
  FloatingSelectField,
  FloatingTextareaField,
} from '../components/AuthFields'
import Footer from '../components/Footer'
import PublicPageBanner from '../components/PublicPageBanner'
import { KERALA_DISTRICTS } from '../utils/keralaLocations'

const INQUIRY_CATEGORIES = [
  'Farmer Registration & KYC',
  'Produce Listing & Pricing',
  'Offer & Pickup Scheduling',
  'Bank / UPI Payout Support',
  'Technical Account Help',
  'General Feedback',
]

const COLLECTION_CORRIDORS = [
  {
    region: 'Central Kerala Hub',
    districts: 'Ernakulam • Thrissur',
    window: 'Daily Pickup Dispatch • 6:30 AM – 2:00 PM',
    address: 'Marine Drive Agro Centre, Kochi, Ernakulam 682031',
  },
  {
    region: 'High Range & Malnad Desk',
    districts: 'Wayanad • Idukki • Kozhikode',
    window: 'Tue, Thu, Sat Route Pickups • 7:00 AM – 3:30 PM',
    address: 'Kalpetta & Thodupuzha Cluster Staging Points',
  },
  {
    region: 'Central-South Belt',
    districts: 'Kottayam • Palakkad • Alappuzha',
    window: 'Mon, Wed, Fri Route Pickups • 6:30 AM – 3:00 PM',
    address: 'Vaikom & Alathur Farmer Aggregation Desks',
  },
]

const INITIAL_CONTACT_FORM = {
  fullName: '',
  phone: '',
  email: '',
  district: '',
  category: '',
  referenceId: '',
  message: '',
}

function validateContactForm(form) {
  const nextErrors = {}
  if (!form.fullName.trim()) {
    nextErrors.fullName = 'Please enter your full name.'
  }

  const digits = form.phone.replace(/\D/g, '')
  if (!digits) {
    nextErrors.phone = 'Please enter your mobile number.'
  } else if (digits.length < 10) {
    nextErrors.phone = 'Enter a valid 10-digit mobile number.'
  }

  if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    nextErrors.email = 'Please enter a valid email address.'
  }

  if (!form.district) {
    nextErrors.district = 'Select your Kerala district.'
  }

  if (!form.category) {
    nextErrors.category = 'Select an inquiry topic.'
  }

  if (!form.message.trim()) {
    nextErrors.message = 'Please describe how our team can help.'
  } else if (form.message.trim().length < 10) {
    nextErrors.message = 'Please share a bit more detail (at least 10 characters).'
  }

  return nextErrors
}

export default function Contact() {
  const [form, setForm] = useState(INITIAL_CONTACT_FORM)
  const [errors, setErrors] = useState({})
  const [submittedTicket, setSubmittedTicket] = useState(null)

  const updateField = (key) => (e) => {
    const value = key === 'phone' ? e.target.value.replace(/\D/g, '').slice(0, 10) : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: '' }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validateContactForm(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) return

    const ticketCode = `FL-SUP-${String(Math.floor(1000 + Math.random() * 9000))}`
    setSubmittedTicket({
      ticketId: ticketCode,
      fullName: form.fullName.trim(),
      phone: form.phone,
      district: form.district,
      category: form.category,
      referenceId: form.referenceId.trim(),
    })
  }

  const handleReset = () => {
    setForm(INITIAL_CONTACT_FORM)
    setErrors({})
    setSubmittedTicket(null)
  }

  return (
    <main className="w-full bg-[#fbf8f1]">
      <PublicPageBanner
        eyebrow="Contact & Support Desk"
        title="Direct Support for Kerala Farmers & Logistics."
        description="Need help with farmer KYC approval, mobile OTP verification, produce pricing, pickup windows, or Bank/UPI settlements? Reach our Kochi support desk directly."
        bottomSlot={
          <div className="flex flex-wrap gap-2.5 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fffdf8] border border-[#e5dcbd] text-[#143e22]">
              <span className="w-2 h-2 rounded-full bg-[#2c6e43]" />
              Mon–Sat • 8:00 AM – 7:00 PM IST
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fffdf8] border border-[#e5dcbd] text-[#143e22]">
              Malayalam &amp; English Helpdesk
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e8f3e1] border border-[#cde2be] text-[#184828]">
              Under 4 Hr Response
            </span>
          </div>
        }
      />

      {/* Main Two-Column Support Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-9 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Helplines & Office Channels */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative rounded-3xl bg-[#143e22] text-white p-6 shadow-md overflow-hidden">
              <img
                src="/hero/side bar bg.png"
                alt=""
                aria-hidden="true"
                className="pointer-events-none select-none absolute inset-x-0 bottom-0 w-full h-44 object-cover object-bottom opacity-20 mix-blend-luminosity"
              />
              <div className="relative z-10 space-y-4">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/15 border border-white/25 text-[11px] font-semibold text-[#b9e6a8] uppercase tracking-wider">
                    Direct Channels
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold mt-2">
                    FarmLink Farmer &amp; Buyer Desk
                  </h2>
                  <p className="mt-1 text-xs text-green-100/85 leading-relaxed">
                    Operated with Kerala Fresh Agro Procurement Pvt Ltd for timely grower onboarding and collection assistance.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3 flex items-start gap-3">
                    <span className="mt-0.5 w-8 h-8 rounded-xl bg-white/15 text-[#b9e6a8] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#b9e6a8]">
                        Toll-Free Farmer Helpline
                      </p>
                      <p className="text-sm font-bold text-white">+91 1800 425 8900</p>
                      <p className="text-[11px] text-green-100/80 mt-0.5">
                        Kochi Procurement Line: +91 484 235 8810
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3 flex items-start gap-3">
                    <span className="mt-0.5 w-8 h-8 rounded-xl bg-white/15 text-[#b9e6a8] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#b9e6a8]">
                        Email Support
                      </p>
                      <p className="text-sm font-semibold text-white truncate">
                        support@farmlink.kerala.in
                      </p>
                      <p className="text-[11px] text-green-100/80 truncate mt-0.5">
                        Procurement: procurement@keralafreshagro.in
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 border border-white/15 px-4 py-3 flex items-start gap-3">
                    <span className="mt-0.5 w-8 h-8 rounded-xl bg-white/15 text-[#b9e6a8] flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#b9e6a8]">
                        Headquarters
                      </p>
                      <p className="text-xs font-medium text-white leading-snug">
                        Marine Drive Agro Centre, Kochi, Ernakulam, Kerala 682031
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Self-Help Card */}
            <div className="rounded-2xl border border-[#e5dcbd] bg-[#fffdf8] p-5 shadow-2xs flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#5d281f]">
                  Instant Answers
                </p>
                <h3 className="font-serif text-base font-bold text-[#143e22] mt-0.5">
                  Checking KYC or UPI payout status?
                </h3>
                <p className="mt-1 text-xs text-[#465a48] leading-relaxed">
                  Browse common questions on ID proof review times, counter-offers, and Pay at Pickup rules.
                </p>
                <Link
                  to="/faq"
                  className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold text-[#184828] hover:underline"
                >
                  <span>Visit FAQ Center</span>
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Input Support Form */}
          <div className="lg:col-span-7 rounded-3xl border border-[#e5dcbd] bg-[#fffdf8] p-5 sm:p-7 shadow-[0_12px_36px_rgba(20,62,34,0.06)]">
            {submittedTicket ? (
              <div className="py-6 sm:py-8 text-center max-w-md mx-auto">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-[#e8f3e1] border border-[#cde2be] text-[#184828] flex items-center justify-center mb-4">
                  <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <span className="inline-block px-3 py-1 rounded-full bg-[#e8f3e1] text-[#184828] text-[11px] font-bold">
                  Support Ticket Created
                </span>
                <h2 className="font-serif text-2xl font-bold text-[#143e22] mt-2.5">
                  We Received Your Message
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-[#465a48] leading-relaxed">
                  Thank you, <strong className="text-[#143e22]">{submittedTicket.fullName}</strong>. Our{' '}
                  {submittedTicket.district} support coordinator will review your inquiry within{' '}
                  <strong className="text-[#184828]">4 business hours</strong>.
                </p>

                <div className="mt-5 rounded-2xl border border-[#e5dcbd] bg-[#fbf8f1] p-4 text-left text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[#5a705d]">Ticket Reference</span>
                    <span className="font-mono font-bold text-[#143e22]">{submittedTicket.ticketId}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#5a705d]">Topic</span>
                    <span className="font-semibold text-[#143e22]">{submittedTicket.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#5a705d]">Callback Mobile</span>
                    <span className="font-semibold text-[#143e22]">+91 {submittedTicket.phone}</span>
                  </div>
                  {submittedTicket.referenceId && (
                    <div className="flex items-center justify-between">
                      <span className="text-[#5a705d]">Batch / Order Ref</span>
                      <span className="font-mono font-semibold text-[#143e22]">{submittedTicket.referenceId}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-xl bg-[#184828] hover:bg-[#12381e] text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                  <Link
                    to="/faq"
                    className="px-5 py-2.5 rounded-xl border border-[#d6ccb4] text-[#143e22] hover:bg-[#fbf8f1] font-semibold text-xs sm:text-sm transition-colors"
                  >
                    Browse FAQ
                  </Link>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#5d281f]">
                    Support Request Form
                  </p>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#143e22] mt-0.5">
                    Send Us a Message
                  </h2>
                  <p className="mt-1 text-xs text-[#465a48]">
                    Share your district and concern so the right FarmLink verification or pickup team responds quickly.
                  </p>
                </div>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <FloatingInputField
                      id="contact-full-name"
                      label="Full Name *"
                      value={form.fullName}
                      onChange={updateField('fullName')}
                      error={errors.fullName}
                      autoComplete="name"
                    />
                    <FloatingInputField
                      id="contact-phone"
                      label="Mobile Number (10 digits) *"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      value={form.phone}
                      onChange={updateField('phone')}
                      error={errors.phone}
                      autoComplete="tel"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <FloatingInputField
                      id="contact-email"
                      label="Email Address (Optional)"
                      type="email"
                      value={form.email}
                      onChange={updateField('email')}
                      error={errors.email}
                      autoComplete="email"
                    />
                    <FloatingSelectField
                      id="contact-district"
                      label="District (Kerala) *"
                      value={form.district}
                      onChange={updateField('district')}
                      options={KERALA_DISTRICTS}
                      error={errors.district}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <FloatingSelectField
                      id="contact-category"
                      label="Inquiry Category *"
                      value={form.category}
                      onChange={updateField('category')}
                      options={INQUIRY_CATEGORIES}
                      error={errors.category}
                    />
                    <FloatingInputField
                      id="contact-reference"
                      label="Order / Listing Ref (Optional)"
                      value={form.referenceId}
                      onChange={updateField('referenceId')}
                    />
                  </div>

                  <FloatingTextareaField
                    id="contact-message"
                    label="Describe your question or issue *"
                    rows={4}
                    maxLength={600}
                    value={form.message}
                    onChange={updateField('message')}
                    error={errors.message}
                  />

                  <div className="pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-[11px] text-[#5a705d]">
                      Available in Malayalam &amp; English • Pilot coverage across 14 districts
                    </p>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#184828] hover:bg-[#12381e] text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer shrink-0"
                    >
                      <span>Submit Support Request</span>
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Regional Collection Hubs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6">
        <div className="mb-5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#184828]">
            Collection Logistics
          </p>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#143e22] mt-0.5">
            Regional Aggregation &amp; Pickup Corridors
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {COLLECTION_CORRIDORS.map((hub) => (
            <div
              key={hub.region}
              className="rounded-2xl border border-[#e5dcbd] bg-[#fffdf8] p-5 shadow-2xs"
            >
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#e8f3e1] text-[#184828] text-[11px] font-semibold">
                {hub.districts}
              </span>
              <h3 className="font-serif text-base font-bold text-[#143e22] mt-2.5">
                {hub.region}
              </h3>
              <p className="mt-1 text-xs font-medium text-[#5d281f]">
                {hub.window}
              </p>
              <p className="mt-2 text-xs text-[#465a48] leading-relaxed">
                {hub.address}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
