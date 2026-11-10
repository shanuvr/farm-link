/**
 * Editorial top hero header shared across standalone public info pages (/about, /contact, /faq).
 */
export default function PublicPageBanner({
  eyebrow,
  title,
  description,
  bottomSlot = null,
  rightSlot = null,
}) {
  return (
    <section className="relative -mt-14 lg:-mt-[48px] [@media(min-width:1280px)_and_(min-height:760px)]:-mt-[58px] pt-20 sm:pt-24 lg:pt-[76px] [@media(min-width:1280px)_and_(min-height:760px)]:pt-[92px] pb-8 sm:pb-11 lg:pb-12 bg-[#fbf8f1] border-b border-[#e5dcbd]/80 overflow-hidden">
      {/* Subtle botanical wash & faded Kerala landscape texture */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(156,197,148,0.22),transparent_54%),radial-gradient(circle_at_bottom_left,rgba(232,243,225,0.55),transparent_50%)]"
        aria-hidden="true"
      />
      <div
        className="hidden lg:block pointer-events-none absolute inset-y-0 right-0 w-[42%] opacity-15"
        aria-hidden="true"
      >
        <img
          src="/hero/hero-desktop.png"
          alt=""
          className="w-full h-full object-cover object-right"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fbf8f1] via-[#fbf8f1]/75 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={
            rightSlot
              ? 'grid grid-cols-1 lg:grid-cols-12 gap-7 lg:gap-10 items-center'
              : 'max-w-3xl'
          }
        >
          <div className={rightSlot ? 'lg:col-span-7' : ''}>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f3e1] border border-[#cde2be] text-[#184828] text-[11px] font-semibold tracking-wide uppercase mb-3">
              <svg className="w-3.5 h-3.5 text-[#2c6e43]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21 3C11.5 3 7 8 7 14c0 1.5.3 3 .8 4.2L3 21l3.8-4.8c1.2.5 2.7.8 4.2.8 6 0 11-4.5 11-14z" />
              </svg>
              <span>{eyebrow}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-bold text-[#143e22] tracking-tight leading-[1.12]">
              {title}
            </h1>

            {/* Ornamental leaf divider */}
            <div className="my-3 flex items-center gap-2 max-w-[175px]">
              <div className="flex-1 h-[1px] bg-[#3a7548]/40 rounded-full" />
              <svg className="w-3.5 h-3.5 text-[#3a7548] shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M21 3C11.5 3 7 8 7 14c0 1.5.3 3 .8 4.2L3 21l3.8-4.8c1.2.5 2.7.8 4.2.8 6 0 11-4.5 11-14z" />
              </svg>
              <div className="flex-1 h-[1px] bg-[#3a7548]/40 rounded-full" />
            </div>

            <p className="text-sm sm:text-[15.5px] text-[#465a48] leading-relaxed max-w-2xl">
              {description}
            </p>

            {bottomSlot && <div className="mt-5">{bottomSlot}</div>}
          </div>

          {rightSlot && <div className="lg:col-span-5">{rightSlot}</div>}
        </div>
      </div>
    </section>
  )
}

