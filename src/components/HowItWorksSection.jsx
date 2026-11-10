import { Link } from 'react-router-dom'

export default function HowItWorksSection() {
  const steps = [
    {
      num: '1. Register',
      title: 'Register',
      text: 'Create your farmer account on FarmLink',
      icon: '/icons/Farmer Typing on Laptop.png',
      alt: 'Farmer registering on laptop'
    },
    {
      num: '2. List Your Produce',
      title: 'List Your Produce',
      text: 'Add the vegetables you have, with quantity and price',
      icon: '/icons/Colourful Wicker Basket of Fresh Vegetables.png',
      alt: 'Wicker basket of fresh produce'
    },
    {
      num: '3. Get & Negotiate Offers',
      title: 'Get & Negotiate Offers',
      text: 'Receive offers from the company and agree on a fair price',
      icon: '/icons/Handshake Agreement with Accent Rays.png',
      alt: 'Handshake agreement between farmer and buyer'
    },
    {
      num: '4. Collect & Get Paid',
      title: 'Collect & Get Paid',
      text: 'The company collects the produce and completes the payment',
      icon: '/icons/Fresh Produce Truck with Rupee Badge.png',
      alt: 'Fresh produce collection truck with rupee payment badge'
    }
  ]

  return (
    <section className="relative w-full bg-[#fbf8f1] pt-12 sm:pt-16 pb-16 sm:pb-20 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Section Header with ornamental leaf accents */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-12 sm:mb-16">
          <div className="hidden sm:block w-12 sm:w-20 h-[1.5px] bg-[#3a7548]/30 rounded-full" />
          
          <div className="flex items-center gap-2">
            {/* Left Leaf Sprout */}
            <svg className="w-5 h-5 text-[#3a7548]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 3C11.5 3 7 8 7 14c0 1.5.3 3 .8 4.2L3 21l3.8-4.8c1.2.5 2.7.8 4.2.8 6 0 11-4.5 11-14z" />
            </svg>

            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#143e22] tracking-tight">
              How FarmLink Works
            </h2>

            {/* Right Leaf Sprout (Mirrored) */}
            <svg className="w-5 h-5 text-[#3a7548] scale-x-[-1]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 3C11.5 3 7 8 7 14c0 1.5.3 3 .8 4.2L3 21l3.8-4.8c1.2.5 2.7.8 4.2.8 6 0 11-4.5 11-14z" />
            </svg>
          </div>

          <div className="hidden sm:block w-12 sm:w-20 h-[1.5px] bg-[#3a7548]/30 rounded-full" />
        </div>

        {/* 4 Step Process Grid with Connecting Arrows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 relative">
          {steps.map((step, idx) => (
            <div key={step.num} className="relative flex flex-col items-center text-center group">
              
              {/* Soft organic cloud badge background behind illustration */}
              <div className="relative w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-[#e8f3e1] flex items-center justify-center p-3 mb-5 shadow-xs transition-transform duration-200 group-hover:scale-105">
                <img
                  src={step.icon}
                  alt={step.alt}
                  className="w-full h-full object-contain drop-shadow-xs"
                />
              </div>

              {/* Step Title */}
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#143e22]">
                {step.num}
              </h3>

              {/* Step Description */}
              <p className="mt-2 text-xs sm:text-sm text-[#465a48] max-w-[240px] leading-relaxed">
                {step.text}
              </p>

              {/* Connecting Arrow between steps on Desktop (hidden after last step) */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-18 -right-3 xl:-right-4 items-center justify-center text-[#465a48]/70 pointer-events-none z-10">
                  <svg
                    className="w-7 h-7"
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

        {/* Mobile View CTA Button: "See How It Works" matching mobile mockup */}
        <div className="mt-12 flex justify-center lg:hidden">
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-[#184828] bg-white text-[#184828] font-bold text-sm shadow-xs hover:bg-[#184828] hover:text-white transition-all"
          >
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 24 24"
            >
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
