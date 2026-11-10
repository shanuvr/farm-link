import { useState } from 'react'

/**
 * Rural landscape wave backdrop anchored at the bottom of auth pages.
 */
export function AuthWaveBackdrop() {
  return (
    <>
      <div className="hidden sm:block absolute inset-x-0 bottom-0 pointer-events-none select-none z-0 opacity-90" aria-hidden="true">
        <img src="/footer/wave-desktop-cropped.png" alt="" className="w-full h-auto block" />
      </div>
      <div className="block sm:hidden absolute inset-x-0 bottom-0 pointer-events-none select-none z-0 opacity-90" aria-hidden="true">
        <img src="/footer/wave-mobile-cropped.png" alt="" className="w-full h-auto block" />
      </div>
    </>
  )
}

export function AuthEmailField({
  id = 'auth-email',
  label = 'Email ID',
  placeholder = 'you@example.com',
  value,
  onChange,
  error,
  focusClass = 'border-[#dcd2b8] focus-within:border-[#184828] focus-within:ring-[#184828]/12',
  bgClass = 'bg-[#fbf8f1]/75',
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-semibold text-[#143e22] mb-1">
        {label}
      </label>
      <div
        className={`flex items-center rounded-xl border overflow-hidden ${bgClass} transition-all focus-within:bg-white focus-within:ring-3 ${
          error ? 'border-[#b91c1c] focus-within:border-[#b91c1c] focus-within:ring-[#b91c1c]/15' : focusClass
        }`}
      >
        <span className="pl-3.5 text-[#5a705d] shrink-0" aria-hidden="true">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </span>
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full bg-transparent px-3 py-2 text-base sm:text-sm text-[#143e22] placeholder:text-[#7c8c7e] focus:outline-none"
        />
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-[#b91c1c]">
          {error}
        </p>
      )}
    </div>
  )
}

export function AuthPasswordField({
  id = 'auth-password',
  label = 'Password',
  placeholder = 'Enter your password',
  value,
  onChange,
  error,
  focusClass = 'border-[#dcd2b8] focus-within:border-[#184828] focus-within:ring-[#184828]/12',
  bgClass = 'bg-[#fbf8f1]/75',
}) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div>
      <label htmlFor={id} className="block text-[13px] font-semibold text-[#143e22] mb-1">
        {label}
      </label>
      <div
        className={`flex items-center rounded-xl border overflow-hidden ${bgClass} transition-all focus-within:bg-white focus-within:ring-3 ${
          error ? 'border-[#b91c1c] focus-within:border-[#b91c1c] focus-within:ring-[#b91c1c]/15' : focusClass
        }`}
      >
        <span className="pl-3.5 text-[#5a705d] shrink-0" aria-hidden="true">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>
        <input
          id={id}
          name="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full bg-transparent px-3 py-2 text-base sm:text-sm text-[#143e22] placeholder:text-[#7c8c7e] focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="pr-3.5 pl-2 py-2 text-[#5a705d] hover:text-[#143e22] transition-colors focus:outline-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs font-medium text-[#b91c1c]">
          {error}
        </p>
      )}
    </div>
  )
}
