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

export function FarmLinkLogoMark({ className = 'w-8 h-8', light = false }) {
  const roofFill = light ? '#edf5e6' : '#1b4d29'
  const roofStroke = light ? '#d7ebc8' : '#12381e'
  const trimStroke = light ? '#6ec468' : '#9cc594'
  const pillarFill = light ? '#143e22' : '#12381e'
  const wavePrimary = light ? '#a8df89' : '#1b4d29'
  const waveSecondary = light ? '#77c765' : '#2d6d3d'
  const sproutRight = light ? '#a8df89' : '#5aa866'
  const sproutLeft = light ? '#84cf71' : '#478a53'

  return (
    <svg viewBox="0 0 72 62" className={`${className} shrink-0`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 28L36 15L52 28H20Z" fill={roofFill} stroke={roofStroke} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M22 25.5L36 14.5L50 25.5" stroke={trimStroke} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="25" y="28" width="3" height="11" fill={pillarFill} rx="0.5" />
      <rect x="34.5" y="28" width="3" height="11" fill={pillarFill} rx="0.5" />
      <rect x="44" y="28" width="3" height="11" fill={pillarFill} rx="0.5" />
      <path d="M4 42C18 36 38 35 68 39" stroke={wavePrimary} strokeWidth="3.6" strokeLinecap="round" />
      <path d="M9 48C24 42 44 41 63 46" stroke={waveSecondary} strokeWidth="3.2" strokeLinecap="round" />
      <path d="M36 14C36 10 39 8 42 8C42 10 40 12.5 36 14Z" fill={sproutRight} />
      <path d="M36 14C35 10 33 9 30 9C30 11 32 13 36 14Z" fill={sproutLeft} />
    </svg>
  )
}

