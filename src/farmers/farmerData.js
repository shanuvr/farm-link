export const STORAGE_KEY = 'farmlink_farmer_portal_v4'

export const KERALA_CROPS = [
  { name: 'Country Red Tomatoes', unit: 'kg', suggestedPrice: 44, defaultImages: ['/crops/tomatoes-1.jpg', '/crops/tomatoes-2.jpg'] },
  { name: 'Nendran Banana', unit: 'kg', suggestedPrice: 52, defaultImages: ['/crops/banana-1.jpg', '/crops/banana-2.jpg'] },
  { name: 'Violet Brinjal', unit: 'kg', suggestedPrice: 38, defaultImages: ['/crops/brinjal-1.jpg'] },
  { name: 'Yardlong Beans (Payar)', unit: 'kg', suggestedPrice: 60, defaultImages: ['/crops/beans-1.jpg'] },
  { name: 'Okra (Vendakka)', unit: 'kg', suggestedPrice: 42, defaultImages: ['/crops/okra-1.jpg'] },
  { name: 'Bitter Gourd (Pavakka)', unit: 'kg', suggestedPrice: 55, defaultImages: ['/crops/bittergourd-1.jpg'] },
  { name: 'Snake Gourd (Padavalanga)', unit: 'kg', suggestedPrice: 34, defaultImages: ['/crops/snakegourd-1.jpg'] },
  { name: 'Ash Gourd (Kumbalanga)', unit: 'kg', suggestedPrice: 24, defaultImages: ['/crops/ashgourd-1.jpg'] },
  { name: 'Tapioca (Kappa)', unit: 'kg', suggestedPrice: 28, defaultImages: ['/crops/tapioca-1.jpg'] },
  { name: 'Fresh Farm Ginger', unit: 'kg', suggestedPrice: 110, defaultImages: ['/crops/ginger-1.jpg'] },
]

const CROP_PHOTO_KEYWORDS = [
  { match: ['tomato'], images: ['/crops/tomatoes-1.jpg', '/crops/tomatoes-2.jpg'] },
  { match: ['banana', 'nendran'], images: ['/crops/banana-1.jpg', '/crops/banana-2.jpg'] },
  { match: ['brinjal', 'eggplant'], images: ['/crops/brinjal-1.jpg'] },
  { match: ['bean', 'payar'], images: ['/crops/beans-1.jpg'] },
  { match: ['okra', 'vendakka'], images: ['/crops/okra-1.jpg'] },
  { match: ['bitter', 'pavakka'], images: ['/crops/bittergourd-1.jpg'] },
  { match: ['snake', 'padavalanga'], images: ['/crops/snakegourd-1.jpg'] },
  { match: ['ash', 'kumbalanga'], images: ['/crops/ashgourd-1.jpg'] },
  { match: ['tapioca', 'kappa', 'cassava'], images: ['/crops/tapioca-1.jpg'] },
  { match: ['ginger'], images: ['/crops/ginger-1.jpg'] },
]

export function getListingImages(listing) {
  if (Array.isArray(listing?.images) && listing.images.length > 0) {
    return listing.images.filter(Boolean)
  }
  if (listing?.image && !listing.image.includes('Colourful Wicker Basket')) {
    return [listing.image]
  }
  const lower = (listing?.productName || '').toLowerCase()
  const matched = CROP_PHOTO_KEYWORDS.find((entry) =>
    entry.match.some((kw) => lower.includes(kw))
  )
  return matched?.images || []
}

export const QUALITY_GRADES = ['Grade A (Premium)', 'Grade B (Standard)', 'Organic / Farm Fresh']

export const UNIT_OPTIONS = ['kg', 'quintal', 'bunch']

export const REJECT_REASONS = [
  'Offer price is below expected cost',
  'Stock committed elsewhere',
  'Requested quantity mismatch',
]

export function formatINR(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

export const DEFAULT_FARMER_PAYOUT = {
  preferredMethod: 'UPI',
  upiId: 'rajannair.ollur@okaxis',
  accountHolder: 'Rajan Nair',
  bankName: 'Kerala Gramin Bank, Ollur',
  accountNumber: '402188901142',
  ifscCode: 'KLGB0040218',
}

export const INITIAL_FARMER_DATA = {
  profile: {
    name: 'Rajan Nair',
    email: 'rajan.thrissur@farmlink.in',
    phone: '+91 98470 55120',
    district: 'Thrissur, Kerala',
    village: 'Ollur Agro Cluster',
    verified: true,
    farmSize: '3.2 Acres · Vegetable Cultivation',
    payoutDetails: { ...DEFAULT_FARMER_PAYOUT },
  },
  listings: [
    {
      id: 'lst-101',
      productName: 'Country Red Tomatoes',
      type: 'Ready Stock',
      quantity: 120,
      reservedQuantity: 40,
      unit: 'kg',
      askingPrice: 48,
      grade: 'Grade A (Premium)',
      harvestDate: '2026-11-09',
      availableFrom: '2026-11-09',
      location: 'Ollur, Thrissur',
      notes: 'Vine-ripened morning harvest, hand-sorted into 20 kg crates.',
      images: ['/crops/tomatoes-1.jpg', '/crops/tomatoes-2.jpg'],
      status: 'active',
      companyViewed: { viewed: true, viewedAt: '45 mins ago' },
    },
    {
      id: 'lst-102',
      productName: 'Nendran Banana',
      type: 'Ready Stock',
      quantity: 200,
      reservedQuantity: 0,
      unit: 'kg',
      askingPrice: 54,
      grade: 'Grade A (Premium)',
      harvestDate: '2026-11-08',
      availableFrom: '2026-11-09',
      location: 'Ollur, Thrissur',
      notes: 'Mature green bunches suitable for wholesale & chips processing.',
      images: ['/crops/banana-1.jpg', '/crops/banana-2.jpg'],
      status: 'active',
      companyViewed: { viewed: true, viewedAt: '2 hours ago' },
    },
    {
      id: 'lst-103',
      productName: 'Yardlong Beans (Payar)',
      type: 'Upcoming Harvest',
      quantity: 75,
      reservedQuantity: 0,
      unit: 'kg',
      askingPrice: 64,
      grade: 'Organic / Farm Fresh',
      harvestDate: '2026-11-14',
      availableFrom: '2026-11-14',
      location: 'Ollur, Thrissur',
      notes: 'Pesticide-free trellis crop, ready for Friday morning pickup.',
      images: ['/crops/beans-1.jpg'],
      status: 'active',
      companyViewed: { viewed: false, viewedAt: null },
    },
    {
      id: 'lst-104',
      productName: 'Violet Brinjal',
      type: 'Ready Stock',
      quantity: 60,
      reservedQuantity: 60,
      unit: 'kg',
      askingPrice: 40,
      grade: 'Grade A (Premium)',
      harvestDate: '2026-11-06',
      availableFrom: '2026-11-06',
      location: 'Ollur, Thrissur',
      notes: 'Glossy medium brinjal batch fully allocated.',
      images: ['/crops/brinjal-1.jpg'],
      status: 'sold_out',
      companyViewed: { viewed: true, viewedAt: '3 days ago' },
    },
  ],
  offers: [
    {
      id: 'off-201',
      listingId: 'lst-101',
      productName: 'Country Red Tomatoes',
      companyName: 'Kerala Fresh Agro Procurement',
      askingPrice: 48,
      offeredPrice: 44,
      quantity: 80,
      unit: 'kg',
      paymentPreference: 'Payment Before Collection',
      status: 'pending_farmer',
      expiresIn: '14 hours left',
      history: [
        {
          id: 'r-1',
          actor: 'company',
          label: 'Initial Company Offer',
          price: 41,
          quantity: 80,
          time: 'Yesterday, 4:15 PM',
        },
        {
          id: 'r-2',
          actor: 'farmer',
          label: 'Your Counteroffer',
          price: 46,
          quantity: 80,
          time: 'Yesterday, 6:05 PM',
        },
        {
          id: 'r-3',
          actor: 'company',
          label: 'Revised Company Offer',
          price: 44,
          quantity: 80,
          time: 'Today, 9:20 AM',
        },
      ],
    },
    {
      id: 'off-202',
      listingId: 'lst-102',
      productName: 'Nendran Banana',
      companyName: 'Kerala Fresh Agro Procurement',
      askingPrice: 54,
      offeredPrice: 48,
      quantity: 150,
      unit: 'kg',
      paymentPreference: 'Payment After Collection',
      status: 'pending_farmer',
      expiresIn: '22 hours left',
      history: [
        {
          id: 'r-1',
          actor: 'company',
          label: 'Initial Company Offer',
          price: 48,
          quantity: 150,
          time: 'Today, 10:10 AM',
        },
      ],
    },
    {
      id: 'off-203',
      listingId: 'lst-103',
      productName: 'Yardlong Beans (Payar)',
      companyName: 'Kerala Fresh Agro Procurement',
      askingPrice: 64,
      offeredPrice: 60,
      quantity: 75,
      unit: 'kg',
      paymentPreference: 'Payment Before Collection',
      status: 'countered_by_farmer',
      expiresIn: 'Awaiting company reply',
      history: [
        {
          id: 'r-1',
          actor: 'company',
          label: 'Initial Company Offer',
          price: 56,
          quantity: 75,
          time: 'Yesterday, 11:30 AM',
        },
        {
          id: 'r-2',
          actor: 'farmer',
          label: 'Your Counteroffer',
          price: 60,
          quantity: 75,
          time: 'Yesterday, 2:45 PM',
        },
      ],
    },
    {
      id: 'off-204',
      listingId: 'lst-104',
      productName: 'Violet Brinjal',
      companyName: 'Kerala Fresh Agro Procurement',
      askingPrice: 40,
      offeredPrice: 38,
      quantity: 60,
      unit: 'kg',
      paymentPreference: 'Payment After Collection',
      status: 'accepted',
      expiresIn: 'Deal Closed',
      history: [
        {
          id: 'r-1',
          actor: 'company',
          label: 'Initial Company Offer',
          price: 38,
          quantity: 60,
          time: '3 days ago',
        },
        {
          id: 'r-2',
          actor: 'farmer',
          label: 'Offer Accepted',
          price: 38,
          quantity: 60,
          time: '3 days ago',
        },
      ],
    },
  ],
  orders: [
    {
      id: 'ord-301',
      orderRef: 'FL-2026-019',
      listingId: 'lst-101',
      productName: 'Country Red Tomatoes',
      companyName: 'Kerala Fresh Agro Procurement',
      agreedQuantity: 40,
      weighedQuantity: 40,
      unit: 'kg',
      agreedPrice: 46,
      totalAmount: 1840,
      paymentArrangement: 'Payment Before Collection',
      paymentStatus: 'Paid · UPI Ref #FL882104',
      status: 'Collection Scheduled',
      farmerConfirmed: false,
      collectionSchedule: {
        date: 'Tomorrow, 11 Nov',
        timeSlot: '7:00 AM – 8:30 AM',
        location: 'Ollur Farm Gate, Thrissur',
        agent: 'Suresh Menon',
        vehicle: 'KL-08-BL-4412 (Mini Reefer)',
      },
      createdAt: 'Yesterday, 5:30 PM',
    },
    {
      id: 'ord-302',
      orderRef: 'FL-2026-014',
      listingId: 'lst-104',
      productName: 'Violet Brinjal',
      companyName: 'Kerala Fresh Agro Procurement',
      agreedQuantity: 60,
      weighedQuantity: 59,
      unit: 'kg',
      agreedPrice: 38,
      totalAmount: 2242,
      paymentArrangement: 'Payment After Collection',
      paymentStatus: 'Settled · Bank NEFT #N99210',
      status: 'Completed',
      farmerConfirmed: true,
      collectionSchedule: {
        date: '07 Nov 2026',
        timeSlot: '7:45 AM (Completed)',
        location: 'Ollur Farm Gate, Thrissur',
        agent: 'Suresh Menon',
        vehicle: 'KL-08-BL-4412',
      },
      createdAt: '4 days ago',
    },
  ],
  notifications: [
    {
      id: 'not-1',
      type: 'offer',
      title: 'Revised offer on Country Red Tomatoes',
      message: 'Kerala Fresh Agro Procurement raised their offer to ₹44/kg for 80 kg.',
      time: '9:20 AM',
      unread: true,
      link: '/farmers/offers',
    },
    {
      id: 'not-2',
      type: 'view',
      title: 'Company viewed your listing',
      message: 'Kerala Fresh Agro Procurement viewed your Country Red Tomatoes listing 45 mins ago.',
      time: '45m ago',
      unread: true,
      link: '/farmers/listings',
    },
    {
      id: 'not-3',
      type: 'offer',
      title: 'New offer on Nendran Banana',
      message: 'Received ₹48/kg offer for 150 kg (₹7,200 total).',
      time: '10:10 AM',
      unread: true,
      link: '/farmers/offers',
    },
    {
      id: 'not-4',
      type: 'order',
      title: 'Pickup scheduled for FL-2026-019',
      message: 'Collection tomorrow 7:00–8:30 AM at Ollur Farm Gate. Advance payment verified.',
      time: 'Yesterday',
      unread: false,
      link: '/farmers/orders',
    },
  ],
}

/**
 * Trigger browser CSV download for Farmer Portal confirmed sales & payout report.
 */
export function exportFarmerSalesCsv(orders) {
  const headers = [
    'Order Ref',
    'Company Buyer',
    'Product',
    'Agreed Qty',
    'Weighed Qty',
    'Unit',
    'Agreed Rate (INR)',
    'Total Amount (INR)',
    'Payment Arrangement',
    'Payment Status',
    'Order Status',
  ]
  const escape = (val) => `"${String(val ?? '').replaceAll('"', '""')}"`
  const rows = orders.map((o) => [
    o.orderRef,
    o.companyName,
    o.productName,
    o.agreedQuantity,
    o.weighedQuantity ?? o.agreedQuantity,
    o.unit,
    o.agreedPrice,
    o.totalAmount,
    o.paymentArrangement,
    o.paymentStatus,
    o.status,
  ])
  const csv = [headers, ...rows].map((r) => r.map(escape).join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `farmlink-farmer-sales-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

/**
 * Merges saved farmer payout details with defaults so cached sessions stay valid.
 */
export function normalizePayoutDetails(payoutDetails, fallback = DEFAULT_FARMER_PAYOUT) {
  if (!payoutDetails) return { ...fallback }
  const preferredMethod =
    payoutDetails.preferredMethod === 'Bank Transfer' || payoutDetails.preferredMethod === 'UPI'
      ? payoutDetails.preferredMethod
      : fallback.preferredMethod || 'UPI'

  return {
    preferredMethod,
    upiId: payoutDetails.upiId ?? fallback.upiId ?? '',
    accountHolder: payoutDetails.accountHolder ?? fallback.accountHolder ?? '',
    bankName: payoutDetails.bankName ?? fallback.bankName ?? '',
    accountNumber: payoutDetails.accountNumber ?? fallback.accountNumber ?? '',
    ifscCode: (payoutDetails.ifscCode ?? fallback.ifscCode ?? '').toUpperCase(),
  }
}

/**
 * Masks all but the final 4 digits of a bank account number for secure display.
 */
export function formatMaskedAccount(accountNumber) {
  const digits = String(accountNumber || '').replace(/\s+/g, '')
  if (!digits) return ''
  if (digits.length <= 4) return digits
  return `•••• ${digits.slice(-4)}`
}

/**
 * Summarizes a farmer's preferred payout destination for company cards and payment modals.
 */
export function getPayoutDestinationInfo(payoutDetails) {
  const upiId = payoutDetails?.upiId?.trim() || ''
  const accountNumber = payoutDetails?.accountNumber?.trim() || ''
  const ifscCode = payoutDetails?.ifscCode?.trim().toUpperCase() || ''
  const bankName = payoutDetails?.bankName?.trim() || ''
  const accountHolder = payoutDetails?.accountHolder?.trim() || ''
  const preferBank = payoutDetails?.preferredMethod === 'Bank Transfer'

  if ((preferBank && accountNumber) || (!upiId && accountNumber)) {
    const masked = formatMaskedAccount(accountNumber)
    return {
      mode: 'Bank Transfer',
      shortLabel: `Bank ${masked}${ifscCode ? ` · ${ifscCode}` : ''}`,
      primaryValue: `${masked}${ifscCode ? ` · ${ifscCode}` : ''}`,
      secondaryValue: [bankName, accountHolder].filter(Boolean).join(' · '),
    }
  }

  if (upiId) {
    const bankHint = accountNumber
      ? [bankName, `(${formatMaskedAccount(accountNumber)})`].filter(Boolean).join(' ')
      : bankName
    return {
      mode: 'UPI',
      shortLabel: `UPI: ${upiId}`,
      primaryValue: upiId,
      secondaryValue: bankHint,
    }
  }

  return {
    mode: 'Pending',
    shortLabel: 'Payout details pending',
    primaryValue: 'Payout account not added yet',
    secondaryValue: '',
  }
}

