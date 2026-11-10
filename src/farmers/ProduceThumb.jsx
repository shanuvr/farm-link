import { getListingImages } from './farmerData'

const CROP_STYLES = [
  { match: 'tomato', bg: 'bg-[#fdeceb]', border: 'border-[#f7cdc9]', text: 'text-[#b83227]', short: 'TM' },
  { match: 'banana', bg: 'bg-[#fef6dc]', border: 'border-[#f5e1a4]', text: 'text-[#9a6700]', short: 'NB' },
  { match: 'brinjal', bg: 'bg-[#f3ebfd]', border: 'border-[#dfd0f8]', text: 'text-[#6b21a8]', short: 'VB' },
  { match: 'bean', bg: 'bg-[#e7f4e4]', border: 'border-[#c8e4c1]', text: 'text-[#184828]', short: 'YB' },
  { match: 'okra', bg: 'bg-[#e7f4e4]', border: 'border-[#c8e4c1]', text: 'text-[#2c6e43]', short: 'OK' },
  { match: 'gourd', bg: 'bg-[#eaf5e9]', border: 'border-[#cce4c9]', text: 'text-[#1e5631]', short: 'GD' },
  { match: 'tapioca', bg: 'bg-[#f6eee2]', border: 'border-[#e6d5bd]', text: 'text-[#6e4720]', short: 'TP' },
  { match: 'ginger', bg: 'bg-[#faeedf]', border: 'border-[#edd3b4]', text: 'text-[#8c4a19]', short: 'GN' },
]

function getCropStyle(productName = '') {
  const lower = productName.toLowerCase()
  return (
    CROP_STYLES.find((c) => lower.includes(c.match)) || {
      bg: 'bg-[#e8f3e1]',
      border: 'border-[#cfe2c4]',
      text: 'text-[#184828]',
      short: productName.slice(0, 2).toUpperCase() || 'PR',
    }
  )
}

/**
 * Compact thumbnail for offers and orders: uses the crop photo when available, or a crop-tinted badge.
 */
export default function ProduceThumb({ name, image, size = 'md' }) {
  const dims = size === 'sm' ? 'w-10 h-10 rounded-lg' : 'w-11 h-11 rounded-xl'
  const resolved =
    image && !image.includes('Colourful Wicker Basket')
      ? image
      : getListingImages({ productName: name })[0]

  if (resolved) {
    return (
      <img
        src={resolved}
        alt={name}
        className={`${dims} object-cover border border-slate-200 shrink-0`}
      />
    )
  }

  const style = getCropStyle(name)
  return (
    <div
      className={`${dims} ${style.bg} border ${style.border} ${style.text} shrink-0 flex flex-col items-center justify-center font-serif font-bold text-xs tracking-tight select-none`}
      aria-hidden="true"
    >
      <svg className="w-4 h-4 mb-0.5 opacity-85" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 3C11.5 3 7 8 7 14c0 1.5.3 3 .8 4.2L3 21l3.8-4.8c1.2.5 2.7.8 4.2.8 6 0 11-4.5 11-14z" />
      </svg>
      <span className="text-[8.5px] font-sans font-extrabold leading-none tracking-wider">
        {style.short}
      </span>
    </div>
  )
}
