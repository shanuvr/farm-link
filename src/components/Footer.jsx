import { Link } from 'react-router-dom'
import { FarmLinkLogo } from './FarmerIcons'

export default function Footer({ showWave = true }) {
  return (
    <footer className="relative w-full bg-[#12381f] overflow-hidden">
      {showWave && (
        <div className="relative w-full bg-[#fbf8f1]">
          <div className="hidden sm:block w-full">
            <img
              src="/footer/wave-desktop-cropped.png"
              alt="Kerala rural landscape wave banner"
              className="w-full h-auto block"
            />
          </div>
          <div className="block sm:hidden w-full">
            <img
              src="/footer/wave-mobile-cropped.png"
              alt="FarmLink green wave banner"
              className="w-full h-auto block"
            />
          </div>
        </div>
      )}

      {/* Smooth color bridge from bottom of green wave into deep forest footer */}
      <div
        className="h-5 w-full bg-gradient-to-b from-[#3d630d] via-[#1f4919] to-[#12381f]"
        aria-hidden="true"
      />

      {/* Main Footer Content */}
      <div className="bg-[#12381f] text-white pt-6 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link to="/" className="inline-flex items-center" aria-label="FarmLink Home">
              <FarmLinkLogo onDark imgClassName="h-9 sm:h-10 w-auto" className="px-3 py-1.5 rounded-2xl" />
            </Link>
            <p className="text-xs text-green-200 mt-2.5">Connecting Farmers with Buyers</p>
            <p className="mt-3 text-sm text-green-100/80 max-w-md leading-relaxed">
              A transparent, organized, and direct agricultural procurement platform designed to empower farmers and streamline produce sourcing in Kerala, India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-sm text-green-100/80">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition">How It Works</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/faq" className="hover:text-white transition">Frequently Asked Questions</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact &amp; Support</Link></li>
            </ul>
          </div>

          {/* Portal Access */}
          <div>
            <h4 className="font-serif text-base font-bold text-white mb-3">Platform Portals</h4>
            <ul className="space-y-2 text-sm text-green-100/80">
              <li><Link to="/register" className="hover:text-white transition">Farmer Registration</Link></li>
              <li><Link to="/login" className="hover:text-white transition">Farmer Login</Link></li>
              <li><Link to="/company" className="hover:text-white transition">Company Procurement Portal</Link></li>
              <li><Link to="/admin" className="hover:text-white transition">Admin Control Center</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-7xl mx-auto mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-green-200/70">
          <p>© {new Date().getFullYear()} FarmLink. Digital Agricultural Procurement Platform. All rights reserved.</p>
          <p>Initial Pilot Market: Kerala, India</p>
        </div>
      </div>
    </footer>
  )
}
