import { useRef, useState } from 'react'

/**
 * Interactive touch-swipeable & button-navigable photo carousel for produce listings.
 */
export default function ListingPhotoSlider({
  images = [],
  alt = 'Produce photo',
  aspectClass = 'aspect-[4/3]',
  compact = false,
  onImageClick,
}) {
  const trackRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const safeImages = images.filter(Boolean)

  if (safeImages.length === 0) {
    return (
      <div
        onClick={onImageClick}
        className={`w-full ${aspectClass} bg-[#eef5e8] flex items-center justify-center text-[#184828] ${
          onImageClick ? 'cursor-pointer' : ''
        }`}
      >
        <svg className="w-8 h-8 opacity-45" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21 3C11.5 3 7 8 7 14c0 1.5.3 3 .8 4.2L3 21l3.8-4.8c1.2.5 2.7.8 4.2.8 6 0 11-4.5 11-14z" />
        </svg>
      </div>
    )
  }

  const scrollToSlide = (nextIdx, e) => {
    if (e) e.stopPropagation()
    const el = trackRef.current
    if (!el) return
    const clamped = (nextIdx + safeImages.length) % safeImages.length
    el.scrollTo({ left: clamped * el.clientWidth, behavior: 'smooth' })
    setActiveIndex(clamped)
  }

  const handleScroll = () => {
    const el = trackRef.current
    if (!el || el.clientWidth === 0) return
    const idx = Math.round(el.scrollLeft / el.clientWidth)
    if (idx !== activeIndex && idx >= 0 && idx < safeImages.length) {
      setActiveIndex(idx)
    }
  }

  return (
    <div className={`relative w-full ${aspectClass} bg-[#ebe4d3] overflow-hidden select-none group`}>
      {/* Scroll-snap horizontal track for smooth touch swipe */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        onClick={onImageClick}
        className={`w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar ${
          onImageClick ? 'cursor-pointer' : ''
        }`}
      >
        {safeImages.map((src, idx) => (
          <img
            key={`${src}-${idx}`}
            src={src}
            alt={`${alt} ${safeImages.length > 1 ? `(${idx + 1} of ${safeImages.length})` : ''}`}
            draggable={false}
            className="w-full h-full shrink-0 snap-center object-cover"
          />
        ))}
      </div>

      {/* Multi-photo controls */}
      {safeImages.length > 1 && (
        <>
          {/* Photo count badge */}
          <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-white text-[9.5px] font-semibold leading-none pointer-events-none">
            {activeIndex + 1}/{safeImages.length}
          </span>

          {/* Left / Right arrows */}
          <button
            type="button"
            onClick={(e) => scrollToSlide(activeIndex - 1, e)}
            aria-label="Previous photo"
            className={`absolute left-1.5 top-1/2 -translate-y-1/2 rounded-full bg-black/45 hover:bg-black/65 text-white backdrop-blur-xs flex items-center justify-center transition-opacity cursor-pointer ${
              compact
                ? 'w-6 h-6 opacity-90 sm:opacity-0 sm:group-hover:opacity-100'
                : 'w-8 h-8 opacity-95'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <button
            type="button"
            onClick={(e) => scrollToSlide(activeIndex + 1, e)}
            aria-label="Next photo"
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-black/45 hover:bg-black/65 text-white backdrop-blur-xs flex items-center justify-center transition-opacity cursor-pointer ${
              compact
                ? 'w-6 h-6 opacity-90 sm:opacity-0 sm:group-hover:opacity-100'
                : 'w-8 h-8 opacity-95'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Pagination dots */}
          <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1 pointer-events-none">
            {safeImages.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => scrollToSlide(idx, e)}
                aria-label={`View photo ${idx + 1}`}
                className={`pointer-events-auto h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === activeIndex ? 'w-3.5 bg-white shadow-xs' : 'w-1.5 bg-white/60 hover:bg-white/85'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

