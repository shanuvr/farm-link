import { Link } from 'react-router-dom'
import AuthPortalCard from '../components/AuthPortalCard'

export default function Login() {
  return (
    <AuthPortalCard
      tone="green"
      badgeLabel="Farmer Portal"
      badgeIcon={
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21 3C11.5 3 7 8 7 14c0 1.5.3 3 .8 4.2L3 21l3.8-4.8c1.2.5 2.7.8 4.2.8 6 0 11-4.5 11-14z" />
        </svg>
      }
      imageSrc="/hero/hero-mobile-cropped.png"
      imageAlt="Kerala farmland and fresh harvest basket"
      showcaseTitle="Fair offers, direct sales, and complete peace of mind."
      showcaseDesc="Log in to manage your produce listings, review company offers, and track collections & payments."
      showcaseChips={['Direct Buyer Access', 'Transparent Records']}
      title="Farmer Login"
      subtitle="Enter your email ID and password to access your FarmLink account."
      emailLabel="Email ID"
      emailPlaceholder="farmer@example.com"
      submitLabel="Sign In"
      previewPath="/farmers"
      previewLinkLabel="Preview Farmer Dashboard →"
      footerContent={
        <>
          <p>
            New farmer on FarmLink?{' '}
            <Link to="/register" className="font-semibold text-[#184828] hover:underline">
              Register here
            </Link>
          </p>
          <Link to="/company/login" className="font-semibold text-[#5d281f] hover:underline">
            Company Login →
          </Link>
        </>
      }
    />
  )
}
