export const COMPANY_STORAGE_KEY = 'farmlink_company_portal_v1'

export const KERALA_DISTRICTS = ['All Districts', 'Thrissur', 'Palakkad', 'Wayanad', 'Kozhikode']

export const PAYMENT_MODES = ['Payment Before Collection', 'Payment After Collection']

export const INITIAL_COMPANY_DATA = {
  isAuthenticated: false,
  companyProfile: {
    companyName: 'Kerala Fresh Agro Procurement Pvt Ltd',
    shortName: 'Kerala Fresh Agro',
    officerName: 'Arjun Menon',
    email: 'procurement@keralafreshagro.in',
    phone: '+91 484 235 8810',
    headquarters: 'Kochi, Kerala',
    gstin: '32AABCK4920E1Z5',
    defaultPaymentMode: 'Payment Before Collection',
  },
  partnerFarmers: [
    {
      id: 'frm-102',
      name: 'Lakshmi Devi',
      district: 'Palakkad, Kerala',
      village: 'Chittur Agro Belt',
      phone: '+91 94472 19034',
      farmSize: '4.5 Acres · Irrigated Vegetable Farm',
      verified: true,
    },
    {
      id: 'frm-103',
      name: 'Mathew Joseph',
      district: 'Wayanad, Kerala',
      village: 'Sulthan Bathery',
      phone: '+91 98951 77410',
      farmSize: '5.0 Acres · Spice & Highland Crops',
      verified: true,
    },
    {
      id: 'frm-104',
      name: 'Fathima Beevi',
      district: 'Kozhikode, Kerala',
      village: 'Koyilandy Cluster',
      phone: '+91 97450 61288',
      farmSize: '2.8 Acres · Organic Kitchen Greens',
      verified: true,
    },
  ],
  partnerListings: [
    {
      id: 'clst-501',
      farmerId: 'frm-102',
      farmerName: 'Lakshmi Devi',
      farmerPhone: '+91 94472 19034',
      productName: 'Okra (Vendakka)',
      type: 'Ready Stock',
      quantity: 140,
      reservedQuantity: 0,
      unit: 'kg',
      askingPrice: 42,
      grade: 'Grade A (Premium)',
      harvestDate: '2026-11-10',
      availableFrom: '2026-11-10',
      location: 'Chittur, Palakkad',
      notes: 'Tender morning-picked okra sorted in ventilated crates.',
      images: ['/crops/okra-1.jpg'],
      status: 'active',
      companyViewed: { viewed: false, viewedAt: null },
    },
    {
      id: 'clst-502',
      farmerId: 'frm-103',
      farmerName: 'Mathew Joseph',
      farmerPhone: '+91 98951 77410',
      productName: 'Fresh Farm Ginger',
      type: 'Ready Stock',
      quantity: 250,
      reservedQuantity: 50,
      unit: 'kg',
      askingPrice: 112,
      grade: 'Grade A (Premium)',
      harvestDate: '2026-11-08',
      availableFrom: '2026-11-09',
      location: 'Sulthan Bathery, Wayanad',
      notes: 'Cleanly washed Wayanad highland ginger, low fiber batch.',
      images: ['/crops/ginger-1.jpg'],
      status: 'active',
      companyViewed: { viewed: true, viewedAt: '3 hours ago' },
    },
    {
      id: 'clst-503',
      farmerId: 'frm-104',
      farmerName: 'Fathima Beevi',
      farmerPhone: '+91 97450 61288',
      productName: 'Bitter Gourd (Pavakka)',
      type: 'Upcoming Harvest',
      quantity: 90,
      reservedQuantity: 0,
      unit: 'kg',
      askingPrice: 56,
      grade: 'Organic / Farm Fresh',
      harvestDate: '2026-11-13',
      availableFrom: '2026-11-13',
      location: 'Koyilandy, Kozhikode',
      notes: 'Organically grown white-green Kerala pavakka.',
      images: ['/crops/bittergourd-1.jpg'],
      status: 'active',
      companyViewed: { viewed: true, viewedAt: 'Yesterday' },
    },
  ],
  partnerOffers: [
    {
      id: 'coff-601',
      listingId: 'clst-502',
      farmerId: 'frm-103',
      farmerName: 'Mathew Joseph',
      farmerLocation: 'Sulthan Bathery, Wayanad',
      productName: 'Fresh Farm Ginger',
      askingPrice: 112,
      offeredPrice: 106,
      quantity: 120,
      unit: 'kg',
      paymentPreference: 'Payment Before Collection',
      status: 'countered_by_farmer',
      expiresIn: 'Counteroffer received',
      history: [
        {
          id: 'cr-1',
          actor: 'company',
          label: 'Your Initial Offer',
          price: 100,
          quantity: 120,
          time: 'Yesterday, 3:20 PM',
        },
        {
          id: 'cr-2',
          actor: 'farmer',
          label: 'Farmer Counteroffer',
          price: 106,
          quantity: 120,
          time: 'Today, 8:40 AM',
        },
      ],
    },
  ],
  partnerOrders: [
    {
      id: 'cord-701',
      orderRef: 'FL-2026-017',
      listingId: 'clst-502',
      farmerId: 'frm-103',
      farmerName: 'Mathew Joseph',
      farmerLocation: 'Sulthan Bathery, Wayanad',
      productName: 'Fresh Farm Ginger',
      agreedQuantity: 50,
      weighedQuantity: null,
      unit: 'kg',
      agreedPrice: 108,
      totalAmount: 5400,
      paymentArrangement: 'Payment After Collection',
      paymentStatus: 'Due After Collection & Weighing',
      status: 'Confirmed',
      collectionSchedule: {
        date: 'Pending Schedule',
        timeSlot: 'Assign pickup slot',
        location: 'Sulthan Bathery, Wayanad',
        agent: 'To be assigned',
        vehicle: 'To be assigned',
      },
      createdAt: 'Today, 7:50 AM',
    },
  ],
  notifications: [
    {
      id: 'cnot-1',
      title: 'Counteroffer from Rajan Nair',
      message: 'Rajan Nair proposed ₹60/kg for 75 kg of Yardlong Beans (Payar).',
      time: 'Yesterday',
      unread: true,
      link: '/company/offers',
    },
    {
      id: 'cnot-2',
      title: 'Counteroffer from Mathew Joseph',
      message: 'Mathew Joseph countered at ₹106/kg for 120 kg of Fresh Farm Ginger.',
      time: '8:40 AM',
      unread: true,
      link: '/company/offers',
    },
    {
      id: 'cnot-3',
      title: 'Schedule pickup for FL-2026-017',
      message: '50 kg Fresh Farm Ginger confirmed and awaiting pickup scheduling.',
      time: '7:50 AM',
      unread: false,
      link: '/company/orders',
    },
  ],
}

/**
 * Trigger browser CSV download for procurement orders report.
 */
export function exportProcurementCsv(orders) {
  const headers = [
    'Order Ref',
    'Farmer',
    'Location',
    'Product',
    'Agreed Qty',
    'Weighed Qty',
    'Unit',
    'Agreed Price (INR)',
    'Total Amount (INR)',
    'Payment Arrangement',
    'Payment Status',
    'Order Status',
  ]
  const escape = (val) => `"${String(val ?? '').replaceAll('"', '""')}"`
  const rows = orders.map((o) => [
    o.orderRef,
    o.farmerName,
    o.farmerLocation,
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
  link.download = `farmlink-procurement-report-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

