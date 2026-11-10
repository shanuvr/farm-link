import { Link } from 'react-router-dom'

export function HomeIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
      <path d="M9 21v-6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6" />
    </svg>
  )
}

export function ListingsIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 10h14l-1.5 9a2 2 0 0 1-2 1.7H8.5a2 2 0 0 1-2-1.7L5 10Z" />
      <path d="M3 10h18" />
      <path d="m8 10 2.5-5" />
      <path d="m16 10-2.5-5" />
    </svg>
  )
}

export function OffersIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="m11 17 2 2a1 1 0 0 0 1.4 0l4.3-4.3a1 1 0 0 0 0-1.4L16 11" />
      <path d="m13 7-2-2a1 1 0 0 0-1.4 0L5.3 9.3a1 1 0 0 0 0 1.4L8 13" />
      <path d="m14 14 3-3" />
      <path d="m7 7 3 3" />
    </svg>
  )
}

export function ConfirmedIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </svg>
  )
}

export function PlusIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

export function ProfileIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.6-3.5 4.4-5 8-5s6.4 1.5 8 5" />
    </svg>
  )
}

export function ReportsIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

/**
 * Brand horizontal lockup backed with a borderless soft white radial glow on dark-green surfaces.
 */
export function FarmLinkLogo({
  onDark = false,
  className = '',
  imgClassName = 'h-8 w-auto',
  glowClassName = '-inset-x-6 -inset-y-2',
}) {
  if (!onDark) {
    return (
      <span className={`inline-flex items-center shrink-0 ${className}`}>
        <img
          src="/FarmLink%20Green%20Landscape%20Logo.png"
          alt="FarmLink"
          className={`${imgClassName} object-contain shrink-0 select-none`}
        />
      </span>
    )
  }

  return (
    <span className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute ${glowClassName} rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.96)_0%,rgba(255,255,255,0.85)_52%,rgba(255,255,255,0.38)_78%,transparent_100%)]`}
      />
      <img
        src="/FarmLink%20Green%20Landscape%20Logo.png"
        alt="FarmLink"
        className={`relative z-10 ${imgClassName} object-contain shrink-0 select-none`}
      />
    </span>
  )
}

/**
 * Compact dark-sidebar brand header keeping h-14 alignment with main workspace bar.
 */
export function FarmLinkSidebarBrand({ to, portalLabelTop = '', portalLabelBottom = '' }) {
  const hasLabel = Boolean(portalLabelTop || portalLabelBottom)

  return (
    <div
      className={`h-14 px-4 border-b border-white/12 flex items-center ${
        hasLabel ? '' : 'justify-center'
      }`}
    >
      <Link to={to} className="flex items-center gap-3 min-w-0">
        <FarmLinkLogo
          onDark
          imgClassName={hasLabel ? 'h-7.5 w-auto' : 'h-8.5 w-auto'}
          glowClassName={hasLabel ? '-inset-x-4 -inset-y-1.5' : '-inset-x-7 -inset-y-2'}
          className={hasLabel ? 'mx-1' : ''}
        />
        {hasLabel && (
          <div className="relative z-10 border-l border-white/20 pl-2.5 flex flex-col leading-[1.18] text-[8.5px] font-bold tracking-[0.12em] text-emerald-200/90 uppercase">
            <span>{portalLabelTop}</span>
            <span>{portalLabelBottom}</span>
          </div>
        )}
      </Link>
    </div>
  )
}

/**
 * Compact light-surface mobile header lockup shared across portal shells.
 */
export function FarmLinkMobileHeaderBrand({ to, badge }) {
  return (
    <Link to={to} className="lg:hidden flex items-center gap-2 shrink-0">
      <FarmLinkLogo imgClassName="h-8 sm:h-9 w-auto" />
      {badge && (
        <span className="px-2 py-0.5 rounded-full bg-[#e8f3e1] border border-[#cde2be] text-[#184828] text-[9.5px] font-bold tracking-wide uppercase">
          {badge}
        </span>
      )}
    </Link>
  )
}

