import { Link } from 'react-router-dom'

const STEPS = [
  {
    num: '1. Register',
    text: 'Create your farmer account on FarmLink',
    icon: '/icons/Farmer Typing on Laptop.png',
    alt: 'Farmer registering on laptop',
  },
  {
    num: '2. List Your Produce',
    text: 'Add the vegetables you have, with quantity and price',
    icon: '/icons/Colourful Wicker Basket of Fresh Vegetables.png',
    alt: 'Wicker basket of fresh produce',
  },
  {
    num: '3. Get & Negotiate Offers',
    text: 'Receive offers from the company and agree on a fair price',
    icon: '/icons/Handshake Agreement with Accent Rays.png',
    alt: 'Handshake agreement between farmer and buyer',
  },
  {
    num: '4. Collect & Get Paid',
    text: 'The company collects the produce and completes the payment',
    icon: '/icons/Fresh Produce Truck with Rupee Badge.png',
    alt: 'Fresh produce collection truck with rupee payment badge',
  },
]

function WatercolorSplash() {
  return (
    <svg
      viewBox="0 0 180 140"
      className="absolute inset-0 w-full h-full text-[#e4f1d7]"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M35 28C54 12 89 9 119 18C148 27 171 45 168 74C165 103 141 124 111 129C81 134 45 129 25 108C5 87 16 44 35 28Z" />
      <path d="M22 48C42 25 78 21 112 26C146 31 164 55 157 82C150 109 124 126 91 124C58 122 25 104 16 83C7 62 11 60 22 48Z" opacity="0.65" />
    </svg>
  )
}

export default function HowItWorksSection() {
  return (
    <section className="relative flex-1 w-full bg-[#fbf8f1] flex flex-col justify-between pt-3 sm:pt-4 lg:pt-2 [@media(min-width:1280px)_and_(min-height:760px)]:pt-5 pb-12 sm:pb-14 lg:pb-9 [@media(min-width:1280px)_and_(min-height:760px)]:pb-16 overflow-x-clip">
      {/* Bottom Rural Landscape & Wave Backdrop (full aspect ratio, never height-cropped) */}
      <div className="hidden sm:block absolute inset-x-0 bottom-0 pointer-events-none select-none z-0" aria-hidden="true">
        <img
          src="/footer/wave-desktop-cropped.png"
          alt=""
          className="w-full h-auto block"
        />
      </div>
      <div className="block sm:hidden absolute inset-x-0 bottom-0 pointer-events-none select-none z-0" aria-hidden="true">
        <img
          src="/footer/wave-mobile-cropped.png"
          alt=""
          className="w-full h-auto block"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto w-full px-2.5 sm:px-6 lg:px-8 my-auto">
        {/* Section Header with ornamental leaf accents */}
        <div className="flex items-center justify-center gap-2 sm:gap-3.5 mb-3 sm:mb-4 lg:mb-1.5 [@media(min-width:1280px)_and_(min-height:760px)]:mb-5">
          <div className="w-8 sm:w-16 lg:w-24 h-[1px] bg-[#5d281f]/35 rounded-full" />

          <div className="flex items-center gap-1.5 sm:gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#3a7548]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21 3C11.5 3 7 8 7 14c0 1.5.3 3 .8 4.2L3 21l3.8-4.8c1.2.5 2.7.8 4.2.8 6 0 11-4.5 11-14z" />
            </svg>

            <h2 className="font-serif text-[20px] sm:text-2xl lg:text-[26px] xl:text-[28px] [@media(min-width:1280px)_and_(min-height:760px)]:text-[32px] font-bold text-[#143e22] tracking-tight whitespace-nowrap">
              How FarmLink Works
            </h2>

            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#3a7548] -scale-x-100" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M21 3C11.5 3 7 8 7 14c0 1.5.3 3 .8 4.2L3 21l3.8-4.8c1.2.5 2.7.8 4.2.8 6 0 11-4.5 11-14z" />
            </svg>
          </div>

          <div className="w-8 sm:w-16 lg:w-24 h-[1px] bg-[#5d281f]/35 rounded-full" />
        </div>

        {/* 4-Step Horizontal Process Grid (4 columns across mobile & desktop) */}
        <div className="grid grid-cols-4 gap-1 sm:gap-3 lg:gap-6 relative items-start">
          {STEPS.map((step, idx) => (
            <div key={step.num} className="relative flex flex-col items-center text-center group">
              {/* Organic watercolor splash behind illustration */}
              <div className="relative w-14 h-12 sm:w-22 sm:h-18 lg:w-20 lg:h-15 xl:w-22 xl:h-16 [@media(min-width:1280px)_and_(min-height:760px)]:w-30 [@media(min-width:1280px)_and_(min-height:760px)]:h-24 flex items-center justify-center p-1 sm:p-1.5 transition-transform duration-200 group-hover:scale-105">
                <WatercolorSplash />
                <img
                  src={step.icon}
                  alt={step.alt}
                  className="relative z-10 w-full h-full object-contain drop-shadow-2xs"
                />
              </div>

              {/* Step Title */}
              <h3 className="font-serif font-bold text-[10.5px] sm:text-[13px] lg:text-[15px] [@media(min-width:1280px)_and_(min-height:760px)]:text-[17px] text-[#143e22] leading-[1.2] mt-1">
                {step.num}
              </h3>

              {/* Step Description (visible on lg+ matching desktop mockup) */}
              <p className="hidden lg:block mt-0.5 text-[11.5px] xl:text-[12px] [@media(min-width:1280px)_and_(min-height:760px)]:text-[13px] text-[#465a48] max-w-[215px] leading-[1.3]">
                {step.text}
              </p>

              {/* Connecting Arrow between columns */}
              {idx < STEPS.length - 1 && (
                <div
                  className="flex absolute top-4 sm:top-7 lg:top-6 [@media(min-width:1280px)_and_(min-height:760px)]:top-9 -right-2 sm:-right-3 lg:-right-4 items-center justify-center text-[#5d281f]/75 pointer-events-none z-20"
                  aria-hidden="true"
                >
                  <svg
                    className="w-3.5 h-3.5 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="4" y1="12" x2="19" y2="12" />
                    <polyline points="14 7 19 12 14 17" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile View CTA Button matching mobile mockup */}
        <div className="mt-4 sm:mt-5 flex justify-center lg:hidden">
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#184828]/80 bg-[#fffdf8]/95 text-[#143e22] font-bold text-[13px] shadow-xs hover:bg-[#184828] hover:text-white transition-all"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <polygon points="10 8 16 12 10 16 10 8" />
            </svg>
            <span>See How It Works</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
