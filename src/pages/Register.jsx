import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AuthWaveBackdrop,
  FloatingInputField,
  FloatingPasswordField,
  FloatingSelectField,
} from '../components/AuthFields'
import Footer from '../components/Footer'
import { KERALA_DISTRICTS } from '../utils/keralaLocations'

const ID_PROOF_TYPES = [
  'Aadhaar Card',
  'Voter ID (EPIC)',
  'Kisan Credit Card / Krishi Bhavan ID',
  'Driving Licence',
  'PAN Card',
]

const ONBOARDING_HIGHLIGHTS = [
  {
    step: '01',
    title: 'Basic & Farm Profile',
    desc: 'Share your contact details, Kerala district, and crop acreage.',
  },
  {
    step: '02',
    title: 'Mobile OTP & ID Proof',
    desc: 'Verify your mobile via 4-digit OTP and upload your ID document.',
  },
  {
    step: '03',
    title: 'Verified Direct Sales',
    desc: 'Get reviewed quickly and start receiving direct buyer offers.',
  },
]

const DEMO_OTP = '1234'

const INITIAL_FORM = {
  fullName: '',
  phone: '',
  email: '',
  district: '',
  village: '',
  farmSize: '',
  password: '',
  confirmPassword: '',
  idType: '',
  idNumber: '',
  consent: false,
}

function formatFileSize(bytes) {
  if (!bytes) return '0 KB'
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * UI-only Farmer Registration screen with compact 2-column mobile grid,
 * custom dropdowns, Mobile OTP verification, and ID proof upload preview.
 */
export default function Register() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [otpStatus, setOtpStatus] = useState('idle') // 'idle' | 'sent' | 'verified'
  const [otpDigits, setOtpDigits] = useState(['', '', '', ''])
  const [otpError, setOtpError] = useState('')
  const [idFile, setIdFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const fileInputRef = useRef(null)
  const otpRefs = useRef([])

  useEffect(() => {
    return () => {
      if (idFile?.previewUrl) {
        URL.revokeObjectURL(idFile.previewUrl)
      }
    }
  }, [idFile])

  const updateField = (field) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: val }))
    if (field === 'phone' && otpStatus !== 'idle') {
      setOtpStatus('idle')
      setOtpDigits(['', '', '', ''])
      setOtpError('')
    }
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleSendOtp = () => {
    const digitsCount = form.phone.replace(/\D/g, '').length
    if (digitsCount < 8) {
      setErrors((prev) => ({ ...prev, phone: 'Enter valid mobile number first' }))
      return
    }
    setErrors((prev) => ({ ...prev, phone: '' }))
    setOtpStatus('sent')
    setOtpDigits(['', '', '', ''])
    setOtpError('')
    setTimeout(() => otpRefs.current[0]?.focus(), 40)
  }

  const handleOtpDigitChange = (idx, raw) => {
    const clean = raw.replace(/\D/g, '')
    if (!clean) {
      setOtpDigits((prev) => prev.map((d, i) => (i === idx ? '' : d)))
      setOtpError('')
      return
    }

    // Handle full 4-digit paste into any box
    if (clean.length > 1) {
      const next = clean.slice(0, 4).split('')
      while (next.length < 4) next.push('')
      setOtpDigits(next)
      setOtpError('')
      otpRefs.current[Math.min(3, clean.length - 1)]?.focus()
      return
    }

    setOtpDigits((prev) => prev.map((d, i) => (i === idx ? clean : d)))
    setOtpError('')
    if (idx < 3) {
      otpRefs.current[idx + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus()
    }
  }

  const handleVerifyOtp = () => {
    const code = otpDigits.join('')
    if (code.length < 4) {
      setOtpError('Enter all 4 OTP digits')
      return
    }
    if (code !== DEMO_OTP) {
      setOtpError(`Invalid code · Try demo OTP ${DEMO_OTP}`)
      return
    }
    setOtpStatus('verified')
    setOtpError('')
  }

  const fillDemoOtp = () => {
    setOtpDigits(DEMO_OTP.split(''))
    setOtpError('')
  }

  const handleSelectedFile = (file) => {
    if (!file) return
    const isImage = file.type.startsWith('image/')
    const previewUrl = isImage ? URL.createObjectURL(file) : ''
    setIdFile({
      name: file.name,
      sizeLabel: formatFileSize(file.size),
      isImage,
      previewUrl,
    })
    if (errors.idFile) {
      setErrors((prev) => ({ ...prev, idFile: '' }))
    }
  }

  const clearSelectedFile = () => {
    setIdFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = () => {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Required'
    if (!form.email.trim()) next.email = 'Required'
    if (!form.phone.trim()) next.phone = 'Mobile number is required'
    if (!form.district) next.district = 'Select district'
    if (!form.village.trim()) next.village = 'Required'
    if (!form.farmSize.trim()) next.farmSize = 'Enter farm size & main crops'
    if (!form.password) next.password = 'Required'
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Mismatch'
    if (!form.idType) next.idType = 'Select ID type'
    if (!form.idNumber.trim()) next.idNumber = 'Required'
    if (!idFile) next.idFile = 'Please upload a photo or PDF of your ID proof'
    if (!form.consent) next.consent = 'Please confirm that your KYC details are accurate'
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (otpStatus !== 'verified') {
      setOtpError('Verify your mobile number via OTP first')
      return
    }
    const nextErrors = validateForm()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true)
    }
  }

  const handleResetForm = () => {
    clearSelectedFile()
    setForm(INITIAL_FORM)
    setOtpStatus('idle')
    setOtpDigits(['', '', '', ''])
    setOtpError('')
    setErrors({})
    setSubmitted(false)
  }

  const isOtpVerified = otpStatus === 'verified'

  return (
    <main className="w-full bg-[#fbf8f1]">
      <section className="relative min-h-[calc(100dvh-3.5rem)] lg:min-h-0 lg:h-[calc(100dvh-3rem)] [@media(min-width:1280px)_and_(min-height:760px)]:h-[calc(100dvh-3.625rem)] flex items-center justify-center px-3 sm:px-6 lg:px-8 pt-3.5 pb-14 sm:pt-5 sm:pb-16 lg:pt-2.5 lg:pb-14 [@media(min-width:1280px)_and_(min-height:760px)]:pt-4 [@media(min-width:1280px)_and_(min-height:760px)]:pb-18 overflow-x-clip">
        <AuthWaveBackdrop />

        {/* Farmer Registration Split Card — fixed left photo + compact scrollable right form on lg+ */}
        <div className="relative z-10 w-full max-w-5xl bg-[#fffdf8] border border-[#e5dcbd] rounded-3xl shadow-[0_14px_44px_rgba(20,62,34,0.09)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 lg:h-full lg:max-h-[545px]">
          {/* Left Visual Showcase Panel (fixed in place on lg+) */}
          <div className="hidden lg:flex lg:col-span-4 lg:h-full relative flex-col justify-between p-5 text-white overflow-hidden">
            <img
              src="/hero/hero-mobile-cropped.png"
              alt="Kerala farmland and fresh vegetable harvest"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,56,31,0.72)_0%,rgba(18,56,31,0.48)_35%,rgba(18,56,31,0.92)_78%,rgba(18,56,31,0.98)_100%)]"
              aria-hidden="true"
            />

            <div className="relative z-10 space-y-2">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[11px] font-semibold tracking-wide">
                <svg className="w-3.5 h-3.5 text-[#b9e6a8]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M21 3C11.5 3 7 8 7 14c0 1.5.3 3 .8 4.2L3 21l3.8-4.8c1.2.5 2.7.8 4.2.8 6 0 11-4.5 11-14z" />
                </svg>
                <span>Farmer Onboarding</span>
              </div>

              <h2 className="font-serif text-xl font-bold leading-snug text-white pt-0.5">
                Join Kerala&apos;s verified farm-to-buyer network.
              </h2>
              <p className="text-[11.5px] text-green-100/90 leading-relaxed">
                Register once to receive transparent procurement offers and direct payouts.
              </p>
            </div>

            <div className="relative z-10 space-y-2 pt-3">
              {ONBOARDING_HIGHLIGHTS.map((item) => (
                <div
                  key={item.step}
                  className="rounded-xl bg-white/10 backdrop-blur-xs border border-white/15 px-3 py-2 flex items-start gap-2.5"
                >
                  <span className="w-5.5 h-5.5 rounded-full bg-[#b9e6a8]/20 border border-[#b9e6a8]/40 text-[#d8f3cc] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {item.step}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11.5px] font-bold text-white leading-tight">{item.title}</p>
                    <p className="text-[10.5px] text-green-100/80 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Form / Confirmation Panel (scrollable form body inside 100dvh on lg+) */}
          <div className="lg:col-span-8 lg:h-full lg:min-h-0 bg-[#fffdf8] flex flex-col">
            {submitted ? (
              <div className="p-5 sm:p-7 lg:px-8 lg:flex-1 lg:overflow-y-auto flex flex-col justify-center">
                <div className="space-y-4 max-w-lg mx-auto w-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-[#e8f3e1] border border-[#cce0be] text-[#184828] flex items-center justify-center">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="mt-3 px-3 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
                    Pending KYC Verification
                  </span>
                  <h1 className="mt-2 font-serif text-2xl font-bold text-[#143e22]">
                    Registration Submitted
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-[#465a48]">
                    Your OTP-verified farmer onboarding application and ID proof are ready for review.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#f8faf7] border border-[#e2e8df] p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#5a705d]">Farmer Name</span>
                    <span className="font-semibold text-[#143e22]">{form.fullName}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#5a705d]">Verified Mobile</span>
                    <span className="font-semibold text-[#184828]">{form.phone} ✓</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#5a705d]">Email</span>
                    <span className="font-medium text-[#143e22]">{form.email}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#5a705d]">Farm Location</span>
                    <span className="font-medium text-[#143e22]">
                      {form.village}, {form.district}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[#5a705d]">ID Verification</span>
                    <span className="font-medium text-[#143e22] text-right">
                      {form.idType} ({idFile?.name})
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  <Link
                    to="/login"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs sm:text-sm font-semibold text-center shadow-sm transition-colors"
                  >
                    Go to Farmer Login →
                  </Link>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="py-2.5 px-4 rounded-xl border border-[#d6ccb4] bg-white hover:bg-[#fbf8f1] text-[#143e22] text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Submit Another
                  </button>
                </div>
                </div>
              </div>
            ) : (
              <>
                {/* Compact Pinned Card Header */}
                <div className="shrink-0 px-4 py-2.5 sm:px-6 sm:py-3 border-b border-[#efe9da] flex items-center justify-between gap-2">
                  <div>
                    <h1 className="font-serif text-lg sm:text-[22px] font-bold text-[#143e22] tracking-tight leading-tight">
                      Farmer Registration
                    </h1>
                    <p className="text-[11px] sm:text-xs text-[#465a48]">
                      Verify your mobile via OTP and upload ID proof to apply.
                    </p>
                  </div>
                  <span className="lg:hidden inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e8f3e1] border border-[#cde2be] text-[#184828] text-[10px] font-semibold shrink-0">
                    Onboarding
                  </span>
                </div>

                {/* Scrollable Inner Form Area on Desktop */}
                <div className="lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain thin-scrollbar px-4 py-3 sm:px-6 sm:py-3.5">
                  <form id="farmer-register-form" onSubmit={handleSubmit} noValidate className="space-y-3">
                  {/* Section 1: Basic, Mobile OTP & Farm Details */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#5a705d]">
                      01 · Basic &amp; Farm Details
                    </p>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-2.5">
                      <FloatingInputField
                        id="reg-fullname"
                        label="Full Name"
                        value={form.fullName}
                        onChange={updateField('fullName')}
                        autoComplete="name"
                        error={errors.fullName}
                        required
                      />

                      <FloatingInputField
                        id="reg-email"
                        label="Email Address"
                        type="email"
                        value={form.email}
                        onChange={updateField('email')}
                        autoComplete="email"
                        error={errors.email}
                        required
                      />

                      <FloatingSelectField
                        id="reg-district"
                        label="District (Kerala)"
                        value={form.district}
                        onChange={updateField('district')}
                        options={KERALA_DISTRICTS}
                        error={errors.district}
                      />

                      <FloatingInputField
                        id="reg-village"
                        label="Village / Cluster"
                        value={form.village}
                        onChange={updateField('village')}
                        error={errors.village}
                        required
                      />

                      {/* Mobile Number + Inline Send OTP */}
                      <div className="col-span-2 space-y-1.5">
                        <div className="flex items-start gap-1.5">
                          <div className="flex-1 min-w-0">
                            <FloatingInputField
                              id="reg-phone"
                              label="Mobile Number"
                              type="tel"
                              inputMode="tel"
                              value={form.phone}
                              onChange={updateField('phone')}
                              autoComplete="tel"
                              readOnly={isOtpVerified}
                              rightElement={
                                isOtpVerified ? (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOtpStatus('idle')
                                      setOtpDigits(['', '', '', ''])
                                      setOtpError('')
                                    }}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#e0efd1] border border-[#c3dfb0] text-[#143e22] text-[10px] font-bold cursor-pointer hover:bg-[#d3e8c2]"
                                    title="Click to change number"
                                  >
                                    <span>✓ Verified</span>
                                  </button>
                                ) : null
                              }
                              error={errors.phone}
                              required
                            />
                          </div>

                          {!isOtpVerified && (
                            <button
                              type="button"
                              onClick={handleSendOtp}
                              className="h-[40px] sm:h-[36px] px-3 sm:px-3.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-[11.5px] font-semibold shrink-0 shadow-2xs transition-colors cursor-pointer"
                            >
                              {otpStatus === 'sent' ? 'Resend OTP' : 'Send OTP'}
                            </button>
                          )}
                        </div>

                        {/* Inline 4-Digit OTP Entry Panel */}
                        {otpStatus === 'sent' && (
                          <div className="rounded-xl bg-[#f4f9f0] border border-[#cce0be] px-3 py-2 space-y-1.5">
                            <div className="flex items-center justify-between gap-2 text-[10.5px]">
                              <span className="text-[#143e22] font-medium truncate">
                                Enter 4-digit OTP sent to <strong>{form.phone}</strong>
                              </span>
                              <button
                                type="button"
                                onClick={fillDemoOtp}
                                className="text-[#184828] font-bold hover:underline shrink-0 cursor-pointer"
                              >
                                Use Demo ({DEMO_OTP})
                              </button>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5">
                                {otpDigits.map((digit, idx) => (
                                  <input
                                    key={idx}
                                    ref={(el) => {
                                      otpRefs.current[idx] = el
                                    }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={4}
                                    value={digit}
                                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                    aria-label={`OTP digit ${idx + 1}`}
                                    className="w-8 h-8 rounded-lg border border-[#c7dcbb] bg-white text-center font-mono text-sm font-bold text-[#143e22] focus:border-[#184828] focus:outline-none focus:ring-2 focus:ring-[#184828]/15"
                                  />
                                ))}
                              </div>

                              <button
                                type="button"
                                onClick={handleVerifyOtp}
                                className="px-3 py-1.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-[11px] font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
                              >
                                Verify OTP
                              </button>
                            </div>

                            {otpError && (
                              <p className="text-[10.5px] font-medium text-[#b91c1c]">{otpError}</p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="col-span-2 lg:col-span-1">
                        <FloatingInputField
                          id="reg-farmsize"
                          label="Farm Size & Crops"
                          value={form.farmSize}
                          onChange={updateField('farmSize')}
                          error={errors.farmSize}
                          required
                        />
                      </div>

                      <FloatingPasswordField
                        id="reg-password"
                        label="Create Password"
                        value={form.password}
                        onChange={updateField('password')}
                        error={errors.password}
                        required
                      />

                      <FloatingPasswordField
                        id="reg-confirm-password"
                        label="Confirm Password"
                        value={form.confirmPassword}
                        onChange={updateField('confirmPassword')}
                        error={errors.confirmPassword}
                        required
                      />
                    </div>
                  </div>

                  {/* Section 2: ID Proof Upload */}
                  <div className="space-y-2 pt-2 border-t border-[#efe9da]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#5a705d]">
                      02 · Identity Verification (ID Proof)
                    </p>

                    <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                      <FloatingSelectField
                        id="reg-id-type"
                        label="ID Proof Type"
                        value={form.idType}
                        onChange={updateField('idType')}
                        options={ID_PROOF_TYPES}
                        error={errors.idType}
                        placement="top"
                      />

                      <FloatingInputField
                        id="reg-id-number"
                        label="ID Number"
                        value={form.idNumber}
                        onChange={updateField('idNumber')}
                        maxLength={24}
                        error={errors.idNumber}
                        required
                      />
                    </div>

                    {/* Interactive File Dropzone */}
                    <div>
                      <input
                        ref={fileInputRef}
                        id="reg-id-file"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleSelectedFile(e.target.files?.[0])}
                        className="sr-only"
                      />

                      {!idFile ? (
                        <label
                          htmlFor="reg-id-file"
                          onDragOver={(e) => {
                            e.preventDefault()
                            setDragActive(true)
                          }}
                          onDragLeave={() => setDragActive(false)}
                          onDrop={(e) => {
                            e.preventDefault()
                            setDragActive(false)
                            handleSelectedFile(e.dataTransfer.files?.[0])
                          }}
                          className={`flex items-center gap-2.5 rounded-xl border border-dashed px-3 py-2 transition-colors cursor-pointer ${
                            dragActive
                              ? 'border-[#184828] bg-[#eef7e9]'
                              : errors.idFile
                                ? 'border-[#b91c1c] bg-[#fef6f5]'
                                : 'border-[#c8dfb3] bg-[#f8faf7] hover:border-[#184828] hover:bg-[#f2f8ee]'
                          }`}
                        >
                          <span className="w-8 h-8 rounded-full bg-[#e0efd1] border border-[#c8dfb3] text-[#184828] flex items-center justify-center shrink-0">
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                              <polyline points="17 8 12 3 7 8" />
                              <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-[11.5px] font-bold text-[#143e22] truncate">
                              Upload ID Proof Photo or PDF
                            </p>
                            <p className="text-[10px] text-[#5a705d] truncate">
                              JPG, PNG, or PDF (max 5 MB)
                            </p>
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-white border border-[#d6ccb4] text-[10.5px] font-semibold text-[#143e22] shrink-0 shadow-2xs">
                            Browse
                          </span>
                        </label>
                      ) : (
                        <div className="rounded-xl border border-[#cce0be] bg-[#f4f9f0] p-2 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            {idFile.isImage && idFile.previewUrl ? (
                              <img
                                src={idFile.previewUrl}
                                alt="Uploaded ID preview"
                                className="w-10 h-8 rounded-md object-cover border border-[#c8dfb3] shrink-0 bg-white"
                              />
                            ) : (
                              <span className="w-9 h-8 rounded-md bg-white border border-[#c8dfb3] text-[#184828] text-[10px] font-bold flex items-center justify-center shrink-0">
                                PDF
                              </span>
                            )}
                            <div className="min-w-0">
                              <p className="text-[11.5px] font-bold text-[#143e22] truncate">
                                {idFile.name}
                              </p>
                              <p className="text-[10px] text-[#5a705d]">
                                {idFile.sizeLabel} · Ready for review
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            <label
                              htmlFor="reg-id-file"
                              className="px-2 py-0.5 rounded-md bg-white border border-[#d6ccb4] hover:bg-slate-50 text-[10.5px] font-semibold text-[#143e22] cursor-pointer"
                            >
                              Replace
                            </label>
                            <button
                              type="button"
                              onClick={clearSelectedFile}
                              className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold text-[#991b1b] hover:bg-[#fceae6] cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}

                      {errors.idFile && (
                        <p className="mt-1 text-[10.5px] font-medium text-[#b91c1c]">
                          {errors.idFile}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Consent */}
                  <div>
                    <label className="inline-flex items-start gap-2 text-[11px] text-[#465a48] cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={updateField('consent')}
                        className="mt-0.5 w-3.5 h-3.5 rounded border-[#b8ad92] accent-[#184828] shrink-0 cursor-pointer"
                      />
                      <span>
                        I confirm that these farmer details and uploaded ID proof belong to me for KYC verification.
                      </span>
                    </label>
                    {errors.consent && (
                      <p className="mt-0.5 text-[10.5px] font-medium text-[#b91c1c]">
                        {errors.consent}
                      </p>
                    )}
                  </div>
                </form>
                </div>

                {/* Compact Pinned Card Footer (Submit + Auth Links) */}
                <div className="shrink-0 px-4 py-2.5 sm:px-6 sm:py-3 border-t border-[#efe9da] bg-[#fffdf8] space-y-2">
                  <div className="space-y-0.5">
                    <button
                      type="submit"
                      form="farmer-register-form"
                      disabled={!isOtpVerified}
                      className={`w-full py-2 px-4 rounded-xl font-semibold text-xs sm:text-[13px] inline-flex items-center justify-center gap-2 transition-all ${
                        isOtpVerified
                          ? 'bg-[#184828] hover:bg-[#12391f] text-white shadow-sm hover:shadow active:scale-[0.99] cursor-pointer'
                          : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <span>
                        {isOtpVerified ? 'Register Farmer Account' : 'Verify Mobile OTP to Register'}
                      </span>
                      {isOtpVerified && <span aria-hidden="true">→</span>}
                    </button>
                    {!isOtpVerified && otpError && otpStatus !== 'sent' && (
                      <p className="text-[10.5px] font-medium text-[#b91c1c] text-center">
                        {otpError}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] text-[#465a48]">
                    <p>
                      Already registered?{' '}
                      <Link to="/login" className="font-semibold text-[#184828] hover:underline">
                        Farmer Login
                      </Link>
                    </p>
                    <Link to="/company" className="font-semibold text-[#5d281f] hover:underline">
                      Company Login →
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer showWave={false} />
    </main>
  )
}
