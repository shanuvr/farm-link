import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#fbf8f1] overflow-hidden">
      
      {/* Vintage Rural Landscape Wave Banner Image from uploaded assets */}
      <div className="relative w-full">
        {/* Desktop Wave Banner */}
        <div className="hidden sm:block w-full">
          <img
            src="/footer/Vintage Rural Landscape Wave Banner.png"
            alt="Kerala vintage rural landscape wave banner"
            className="w-full h-auto object-cover max-h-[220px]"
          />
        </div>

        {/* Mobile Wave Banner */}
        <div className="block sm:hidden w-full">
          <img
            src="/footer/FarmLink Green Wave Footer.png"
            alt="FarmLink green wave banner"
            className="w-full h-auto object-cover max-h-[160px]"
          />
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-[#12381f] text-white pt-10 pb-8 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                FarmLink
              </span>
              <span className="text-xl">🌱</span>
            </div>
            <p className="text-xs text-green-200 mt-0.5">Connecting Farmers with Buyers</p>
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
              <li><Link to="/contact" className="hover:text-white transition">Contact & Support</Link></li>
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
        <div className="max-w-[1400px] mx-auto mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-green-200/70">
          <p>© {new Date().getFullYear()} FarmLink. Digital Agricultural Procurement Platform. All rights reserved.</p>
          <p>Initial Pilot Market: Kerala, India</p>
        </div>
      </div>

    </footer>
  )
}
