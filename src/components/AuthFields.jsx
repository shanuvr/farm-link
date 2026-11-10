import { useEffect, useRef, useState } from 'react'

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

function FloatingFieldWrapper({ id, label, floated, error, multiline = false, children }) {
  const restingPosition = multiline
    ? 'top-3 translate-y-0 text-xs sm:text-[11.5px] peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:font-semibold'
    : 'top-1/2 -translate-y-1/2 text-xs sm:text-[11.5px] peer-focus:top-0 peer-focus:-translate-y-1/2 peer-focus:text-[10px] peer-focus:font-semibold'

  return (
    <div>
      <div className="relative">
        {children}
        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-2.5 z-10 px-1 bg-[#fffdf8] leading-none transition-all duration-150 ${
            floated ? 'top-0 -translate-y-1/2 text-[10px] font-semibold' : restingPosition
          } ${
            error
              ? 'text-[#b91c1c]'
              : floated
                ? 'text-[#184828]'
                : 'text-[#6b7b6d] peer-focus:text-[#184828]'
          }`}
        >
          {label}
        </label>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-0.5 text-[10.5px] font-medium text-[#b91c1c]">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Material-style outlined textarea with notched top-border floating label.
 */
export function FloatingTextareaField({
  id,
  name,
  label,
  value,
  onChange,
  error,
  rows = 4,
  maxLength,
  required = false,
}) {
  const hasValue = String(value ?? '').length > 0

  return (
    <FloatingFieldWrapper id={id} label={label} floated={hasValue} error={error} multiline>
      <textarea
        id={id}
        name={name || id}
        rows={rows}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        required={required}
        placeholder=" "
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`peer w-full rounded-xl border bg-[#fffdf8] px-3 pt-3 pb-2.5 text-[13px] sm:text-xs text-[#143e22] leading-relaxed resize-y min-h-[104px] transition-all focus:outline-none focus:ring-2 ${
          error
            ? 'border-[#b91c1c] focus:border-[#b91c1c] focus:ring-[#b91c1c]/15'
            : 'border-[#d6ccb4] hover:border-[#b8ad92] focus:border-[#184828] focus:ring-[#184828]/12'
        }`}
      />
    </FloatingFieldWrapper>
  )
}

/**
 * Material-style outlined input with notched top-border floating label.
 */
export function FloatingInputField({
  id,
  name,
  label,
  type = 'text',
  value,
  onChange,
  error,
  autoComplete,
  inputMode,
  maxLength,
  readOnly = false,
  rightElement = null,
  required = false,
}) {
  const hasValue = String(value ?? '').length > 0

  return (
    <FloatingFieldWrapper id={id} label={label} floated={hasValue} error={error}>
      <input
        id={id}
        name={name || id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        readOnly={readOnly}
        required={required}
        placeholder=" "
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`peer w-full h-[40px] sm:h-[36px] rounded-xl border bg-[#fffdf8] pl-3 ${
          rightElement ? 'pr-20' : 'pr-3'
        } text-[13px] sm:text-xs text-[#143e22] transition-all focus:outline-none focus:ring-2 ${
          error
            ? 'border-[#b91c1c] focus:border-[#b91c1c] focus:ring-[#b91c1c]/15'
            : 'border-[#d6ccb4] hover:border-[#b8ad92] focus:border-[#184828] focus:ring-[#184828]/12'
        } ${readOnly ? 'bg-[#f4f9f0]/60' : ''}`}
      />
      {rightElement && (
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10">{rightElement}</div>
      )}
    </FloatingFieldWrapper>
  )
}

/**
 * Custom compact Material-style outlined dropdown with notched top-border floating label.
 */
export function FloatingSelectField({
  id,
  label,
  value,
  onChange,
  options = [],
  error,
  placement = 'bottom',
}) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const hasValue = String(value ?? '').length > 0

  useEffect(() => {
    if (!isOpen) return undefined
    const handleOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleOutside)
      document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen])

  return (
    <div ref={containerRef} className="relative">
      <FloatingFieldWrapper
        id={id}
        label={label}
        floated={hasValue || isOpen}
        error={error}
      >
        <button
          id={id}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-full h-[40px] sm:h-[36px] rounded-xl border bg-[#fffdf8] pl-3 pr-7 text-left text-[13px] sm:text-xs transition-all focus:outline-none focus:ring-2 cursor-pointer flex items-center ${
            hasValue ? 'text-[#143e22] font-medium' : 'text-transparent'
          } ${
            isOpen
              ? 'border-[#184828] ring-2 ring-[#184828]/12'
              : error
                ? 'border-[#b91c1c] focus:border-[#b91c1c] focus:ring-[#b91c1c]/15'
                : 'border-[#d6ccb4] hover:border-[#b8ad92] focus:border-[#184828] focus:ring-[#184828]/12'
          }`}
        >
          <span className="truncate block w-full">{hasValue ? value : '\u00A0'}</span>
        </button>

        <span
          className={`pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#5a705d] transition-transform duration-150 ${
            isOpen ? 'rotate-180 text-[#184828]' : ''
          }`}
          aria-hidden="true"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </FloatingFieldWrapper>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={label}
          className={`absolute left-0 right-0 z-40 rounded-xl border border-[#d6ccb4] bg-[#fffdf8] shadow-[0_12px_28px_rgba(20,62,34,0.14)] py-1 max-h-40 overflow-y-auto thin-scrollbar ${
            placement === 'top' ? 'bottom-full mb-1.5' : 'mt-1'
          }`}
        >
          {options.map((opt) => {
            const selected = opt === value
            return (
              <li key={opt}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange({ target: { type: 'select', value: opt } })
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#e8f3e1] text-[#143e22] font-semibold'
                      : 'text-[#2c3e2d] hover:bg-[#f4f7f1]'
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {selected && (
                    <svg className="w-3.5 h-3.5 text-[#184828] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

/**
 * Material-style outlined password input with notched top-border floating label and visibility toggle.
 */
export function FloatingPasswordField({
  id,
  name,
  label,
  value,
  onChange,
  error,
  autoComplete = 'new-password',
  required = false,
}) {
  const [showPassword, setShowPassword] = useState(false)
  const hasValue = String(value ?? '').length > 0

  return (
    <FloatingFieldWrapper id={id} label={label} floated={hasValue} error={error}>
      <input
        id={id}
        name={name || id}
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        placeholder=" "
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`peer w-full h-[40px] sm:h-[36px] rounded-xl border bg-[#fffdf8] pl-3 pr-8 text-[13px] sm:text-xs text-[#143e22] transition-all focus:outline-none focus:ring-2 ${
          error
            ? 'border-[#b91c1c] focus:border-[#b91c1c] focus:ring-[#b91c1c]/15'
            : 'border-[#d6ccb4] hover:border-[#b8ad92] focus:border-[#184828] focus:ring-[#184828]/12'
        }`}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#5a705d] hover:text-[#143e22] transition-colors cursor-pointer focus:outline-none"
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
    </FloatingFieldWrapper>
  )
}
