import { Link } from 'react-router-dom'
import AuthPortalCard from '../components/AuthPortalCard'

export default function CompanyLogin() {
  return (
    <AuthPortalCard
      tone="brown"
      badgeLabel="Company Procurement Portal"
      badgeIcon={
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 9.5L12 3L21 9.5H3Z" />
          <path d="M2 10.5H22" />
          <path d="M5 11.5V18" />
          <path d="M9.5 11.5V18" />
          <path d="M14.5 11.5V18" />
          <path d="M19 11.5V18" />
          <path d="M2 18.5H22" />
          <path d="M1 21H23" />
        </svg>
      }
      imageSrc="/hero/hero-desktop.png"
      imageAlt="Freshly harvested agricultural produce ready for company procurement"
      imageClassName="object-[right_75%]"
      showcaseTitle="Direct farm sourcing, structured offers, and effortless procurement."
      showcaseDesc="Sign in to browse verified farmer produce, negotiate fair prices, schedule collections, and manage procurement payments."
      showcaseChips={['Verified Supply', 'Offer Negotiation', 'Collection Tracking']}
      showcaseFootnote="Authorized purchasing company portal"
      title="Company Login"
      subtitle="Enter your company email ID and password to access the procurement dashboard."
      emailLabel="Company Email ID"
      emailPlaceholder="procurement@company.com"
      submitLabel="Sign In to Company Portal"
      previewPath="/company"
      previewLinkLabel="Preview Company Dashboard →"
      footerContent={
        <>
          <p>
            Managed by Admin.{' '}
            <Link to="/contact" className="font-semibold text-[#5d281f] hover:underline">
              Need access?
            </Link>
          </p>
          <Link to="/login" className="font-semibold text-[#184828] hover:underline">
            Farmer Login →
          </Link>
        </>
      }
    />
  )
}

