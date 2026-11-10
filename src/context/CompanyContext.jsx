import { useEffect, useMemo, useState } from 'react'
import { COMPANY_STORAGE_KEY, INITIAL_COMPANY_DATA } from '../company/companyData'
import { normalizePayoutDetails } from '../farmers/farmerData'
import { CompanyContext } from './companyContextStore'
import { useFarmer } from './farmerContextStore'

const PARTNER_PAYOUT_BY_ID = Object.fromEntries(
  INITIAL_COMPANY_DATA.partnerFarmers.map((pf) => [pf.id, pf.payoutDetails])
)

function normalizeCompanyState(raw) {
  if (!raw || typeof raw !== 'object') return INITIAL_COMPANY_DATA
  const partnerFarmers = Array.isArray(raw.partnerFarmers)
    ? raw.partnerFarmers.map((pf) => ({
        ...pf,
        payoutDetails: normalizePayoutDetails(pf.payoutDetails, PARTNER_PAYOUT_BY_ID[pf.id]),
      }))
    : INITIAL_COMPANY_DATA.partnerFarmers

  return {
    ...INITIAL_COMPANY_DATA,
    ...raw,
    partnerFarmers,
  }
}

function loadCompanyState() {
  try {
    const saved = localStorage.getItem(COMPANY_STORAGE_KEY)
    if (saved) {
      return normalizeCompanyState(JSON.parse(saved))
    }
    const previous = localStorage.getItem('farmlink_company_portal_v1')
    if (previous) {
      const oldState = JSON.parse(previous)
      return {
        ...INITIAL_COMPANY_DATA,
        isAuthenticated: Boolean(oldState.isAuthenticated),
        companyProfile: oldState.companyProfile || INITIAL_COMPANY_DATA.companyProfile,
      }
    }
  } catch {
    // Fallback to seeded data if storage is unavailable
  }
  return INITIAL_COMPANY_DATA
}

/**
 * Provides Company Portal state synchronized live with FarmerContext via localStorage.
 */
export function CompanyProvider({ children }) {
  const farmer = useFarmer()
  const [state, setState] = useState(loadCompanyState)

  useEffect(() => {
    try {
      localStorage.setItem(COMPANY_STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore quota errors
    }
  }, [state])

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === COMPANY_STORAGE_KEY && e.newValue) {
        try {
          setState(normalizeCompanyState(JSON.parse(e.newValue)))
        } catch {
          // Ignore malformed updates
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const rajanFarmerId = 'frm-101'

  const rajanPayout = useMemo(
    () => normalizePayoutDetails(farmer.profile.payoutDetails),
    [farmer.profile.payoutDetails]
  )

  const partnerPayoutById = useMemo(
    () =>
      Object.fromEntries(
        state.partnerFarmers.map((pf) => [
          pf.id,
          normalizePayoutDetails(pf.payoutDetails, PARTNER_PAYOUT_BY_ID[pf.id]),
        ])
      ),
    [state.partnerFarmers]
  )

  /* Combined cross-portal views: Rajan's live FarmerContext data + partner Kerala farmers */
  const allListings = useMemo(() => {
    const rajanListings = farmer.listings.map((item) => ({
      ...item,
      farmerId: rajanFarmerId,
      farmerName: farmer.profile.name,
      farmerPhone: farmer.profile.phone,
      source: 'farmer_live',
    }))
    const partner = state.partnerListings.map((item) => ({
      ...item,
      source: 'partner',
    }))
    return [...rajanListings, ...partner]
  }, [farmer.listings, farmer.profile.name, farmer.profile.phone, state.partnerListings])

  const allOffers = useMemo(() => {
    const rajanOffers = farmer.offers.map((offer) => ({
      ...offer,
      farmerId: rajanFarmerId,
      farmerName: farmer.profile.name,
      farmerLocation: farmer.profile.district,
      farmerPayout: rajanPayout,
      expiresIn:
        offer.status === 'countered_by_farmer' && offer.expiresIn === 'Awaiting company reply'
          ? 'Counteroffer received'
          : offer.expiresIn,
      history: (offer.history || []).map((round) => ({
        ...round,
        label:
          round.actor === 'farmer' && round.label === 'Your Counteroffer'
            ? 'Farmer Counteroffer'
            : round.label,
      })),
      source: 'farmer_live',
    }))
    const partner = state.partnerOffers.map((offer) => ({
      ...offer,
      farmerPayout: partnerPayoutById[offer.farmerId] || null,
      source: 'partner',
    }))
    return [...rajanOffers, ...partner]
  }, [farmer.offers, farmer.profile.name, farmer.profile.district, rajanPayout, state.partnerOffers, partnerPayoutById])

  const allOrders = useMemo(() => {
    const rajanOrders = farmer.orders.map((order) => ({
      ...order,
      farmerId: rajanFarmerId,
      farmerName: farmer.profile.name,
      farmerLocation: order.collectionSchedule?.location || farmer.profile.district,
      farmerPayout: rajanPayout,
      source: 'farmer_live',
    }))
    const partner = state.partnerOrders.map((order) => ({
      ...order,
      farmerPayout: partnerPayoutById[order.farmerId] || null,
      source: 'partner',
    }))
    return [...rajanOrders, ...partner]
  }, [farmer.orders, farmer.profile.name, farmer.profile.district, rajanPayout, state.partnerOrders, partnerPayoutById])

  const farmersDirectory = useMemo(() => {
    const primaryFarmer = {
      id: rajanFarmerId,
      name: farmer.profile.name,
      district: farmer.profile.district,
      village: farmer.profile.village,
      phone: farmer.profile.phone,
      farmSize: farmer.profile.farmSize,
      verified: farmer.profile.verified,
      payoutDetails: rajanPayout,
    }
    return [primaryFarmer, ...state.partnerFarmers].map((f) => {
      const fListings = allListings.filter((l) => l.farmerId === f.id && l.status === 'active')
      const fOrders = allOrders.filter((o) => o.farmerId === f.id)
      const suppliedVolume = fOrders.reduce((s, o) => s + (o.weighedQuantity || o.agreedQuantity || 0), 0)
      return {
        ...f,
        payoutDetails: f.payoutDetails || partnerPayoutById[f.id] || null,
        activeListingsCount: fListings.length,
        ordersCount: fOrders.length,
        suppliedVolume,
      }
    })
  }, [farmer.profile, rajanPayout, state.partnerFarmers, partnerPayoutById, allListings, allOrders])

  const loginCompany = (email) => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      companyProfile: {
        ...prev.companyProfile,
        email: email || prev.companyProfile.email,
      },
    }))
  }

  const logoutCompany = () => {
    setState((prev) => ({ ...prev, isAuthenticated: false }))
  }

  const updateCompanyProfile = (updates) => {
    setState((prev) => ({
      ...prev,
      companyProfile: { ...prev.companyProfile, ...updates },
    }))
  }

  const isRajanListing = (listingId) => farmer.listings.some((l) => l.id === listingId)
  const isRajanOffer = (offerId) => farmer.offers.some((o) => o.id === offerId)
  const isRajanOrder = (orderId) => farmer.orders.some((o) => o.id === orderId)

  const markListingViewed = (listingId) => {
    if (isRajanListing(listingId)) {
      farmer.markListingViewedByCompany(listingId, state.companyProfile.companyName)
      return
    }
    setState((prev) => ({
      ...prev,
      partnerListings: prev.partnerListings.map((l) =>
        l.id === listingId && !l.companyViewed?.viewed
          ? { ...l, companyViewed: { viewed: true, viewedAt: 'Just now' } }
          : l
      ),
    }))
  }

  const sendCompanyOffer = ({ listingId, offeredPrice, quantity, paymentPreference, validityHours = 24 }) => {
    const cleanPrice = Number(offeredPrice)
    const cleanQty = Number(quantity)
    if (!cleanPrice || cleanPrice <= 0 || !cleanQty || cleanQty <= 0) return null

    const listing = allListings.find((l) => l.id === listingId)
    if (!listing) return null

    const createdAtMs = Date.now()
    const notif = {
      id: `cnot-${createdAtMs}`,
      title: `Offer sent to ${listing.farmerName}`,
      message: `Offered ₹${cleanPrice}/${listing.unit} for ${cleanQty} ${listing.unit} of ${listing.productName}.`,
      time: 'Just now',
      unread: true,
      link: '/company/offers',
    }
    let createdOfferId

    if (isRajanListing(listingId)) {
      createdOfferId = farmer.receiveCompanyOffer({
        listingId,
        companyName: state.companyProfile.companyName,
        offeredPrice: cleanPrice,
        quantity: cleanQty,
        paymentPreference,
        validityHours,
      })
      setState((prev) => ({
        ...prev,
        notifications: [notif, ...prev.notifications],
      }))
    } else {
      createdOfferId = `coff-${createdAtMs}`
      const newOffer = {
        id: createdOfferId,
        listingId: listing.id,
        farmerId: listing.farmerId,
        farmerName: listing.farmerName,
        farmerLocation: listing.location,
        productName: listing.productName,
        askingPrice: listing.askingPrice,
        offeredPrice: cleanPrice,
        quantity: cleanQty,
        unit: listing.unit,
        paymentPreference,
        status: 'pending_farmer',
        expiresIn: `Just sent · ${validityHours}h left`,
        createdAtMs,
        history: [
          {
            id: `cr-${createdAtMs}`,
            actor: 'company',
            label: 'Initial Company Offer',
            price: cleanPrice,
            quantity: cleanQty,
            time: 'Just now',
          },
        ],
      }

      setState((prev) => ({
        ...prev,
        partnerListings: prev.partnerListings.map((l) =>
          l.id === listingId ? { ...l, companyViewed: { viewed: true, viewedAt: 'Just now' } } : l
        ),
        partnerOffers: [newOffer, ...prev.partnerOffers],
        notifications: [notif, ...prev.notifications],
      }))
    }

    return createdOfferId
  }

  const acceptFarmerCounter = (offerId, options = {}) => {
    if (isRajanOffer(offerId)) {
      farmer.acceptFarmerCounterByCompany(offerId, options)
      return
    }

    setState((prev) => {
      const target = prev.partnerOffers.find((o) => o.id === offerId)
      if (!target || target.status === 'accepted') return prev

      const nextOrderNum = prev.partnerOrders.length + farmer.orders.length + 22
      const orderRef = `FL-2026-0${nextOrderNum}`
      const chosenPreference = options?.paymentPreference || target.paymentPreference
      const isBefore = chosenPreference === 'Payment Before Collection'
      const paidNow = isBefore && Boolean(options?.payNowImmediate)
      const refText =
        (options?.paymentRef || '').trim() || `UPI${Math.floor(100000 + Math.random() * 900000)}`

      const newOrder = {
        id: `cord-${Date.now()}`,
        orderRef,
        listingId: target.listingId,
        farmerId: target.farmerId,
        farmerName: target.farmerName,
        farmerLocation: target.farmerLocation,
        productName: target.productName,
        agreedQuantity: target.quantity,
        weighedQuantity: null,
        unit: target.unit,
        agreedPrice: target.offeredPrice,
        totalAmount: target.offeredPrice * target.quantity,
        paymentArrangement: chosenPreference,
        paymentStatus: isBefore
          ? paidNow
            ? `Paid · ${refText}`
            : 'Awaiting Company Payment'
          : 'Due After Collection & Weighing',
        status: 'Confirmed',
        collectionSchedule: {
          date: 'Pending Schedule',
          timeSlot: 'Assign pickup slot',
          location: target.farmerLocation,
          agent: 'To be assigned',
          vehicle: 'To be assigned',
        },
        createdAt: 'Just now',
      }

      return {
        ...prev,
        partnerListings: prev.partnerListings.map((lst) => {
          if (lst.id !== target.listingId) return lst
          const nextRes = Math.min(lst.quantity, lst.reservedQuantity + target.quantity)
          return {
            ...lst,
            reservedQuantity: nextRes,
            status: nextRes >= lst.quantity ? 'sold_out' : lst.status,
          }
        }),
        partnerOffers: prev.partnerOffers.map((o) =>
          o.id === offerId
            ? {
                ...o,
                paymentPreference: chosenPreference,
                status: 'accepted',
                expiresIn: 'Deal Closed',
                history: [
                  ...o.history,
                  {
                    id: `cr-${Date.now()}`,
                    actor: 'company',
                    label: paidNow
                      ? `Accepted & Paid (${refText})`
                      : `Accepted Counteroffer (${isBefore ? 'Advance' : 'Pay at Pickup'})`,
                    price: o.offeredPrice,
                    quantity: o.quantity,
                    time: 'Just now',
                  },
                ],
              }
            : o
        ),
        partnerOrders: [newOrder, ...prev.partnerOrders],
        notifications: [
          {
            id: `cnot-${Date.now()}`,
            title: `Order ${orderRef} Confirmed`,
            message: `Confirmed ${target.quantity} ${target.unit} of ${target.productName} with ${target.farmerName}.`,
            time: 'Just now',
            unread: true,
            link: '/company/orders',
          },
          ...prev.notifications,
        ],
      }
    })
  }

  const reviseCompanyOffer = (offerId, pricePerUnit, quantity) => {
    const cleanPrice = Number(pricePerUnit)
    const cleanQty = Number(quantity)
    if (!cleanPrice || cleanPrice <= 0 || !cleanQty || cleanQty <= 0) return

    if (isRajanOffer(offerId)) {
      farmer.reviseOfferFromCompany(offerId, cleanPrice, cleanQty)
      return
    }

    setState((prev) => ({
      ...prev,
      partnerOffers: prev.partnerOffers.map((o) =>
        o.id === offerId
          ? {
              ...o,
              offeredPrice: cleanPrice,
              quantity: cleanQty,
              status: 'pending_farmer',
              expiresIn: '24 hours left',
              history: [
                ...o.history,
                {
                  id: `cr-${Date.now()}`,
                  actor: 'company',
                  label: 'Revised Company Offer',
                  price: cleanPrice,
                  quantity: cleanQty,
                  time: 'Just now',
                },
              ],
            }
          : o
      ),
    }))
  }

  const withdrawCompanyOffer = (offerId) => {
    if (isRajanOffer(offerId)) {
      farmer.withdrawOfferFromCompany(offerId)
      return
    }

    setState((prev) => ({
      ...prev,
      partnerOffers: prev.partnerOffers.map((o) =>
        o.id === offerId
          ? {
              ...o,
              status: 'rejected',
              expiresIn: 'Withdrawn',
              history: [
                ...o.history,
                {
                  id: `cr-${Date.now()}`,
                  actor: 'company',
                  label: 'Withdrawn by Company',
                  price: o.offeredPrice,
                  quantity: o.quantity,
                  time: 'Just now',
                },
              ],
            }
          : o
      ),
    }))
  }

  const applyOrderMutation = (orderId, updater, farmerNotif) => {
    if (isRajanOrder(orderId)) {
      farmer.updateOrderFromCompany(orderId, updater, farmerNotif)
      return
    }
    setState((prev) => ({
      ...prev,
      partnerOrders: prev.partnerOrders.map((o) => (o.id === orderId ? updater(o) : o)),
    }))
  }

  const recordAdvancePayment = (orderId, reference) => {
    const refText = reference.trim() || `UPI${Math.floor(100000 + Math.random() * 900000)}`
    applyOrderMutation(
      orderId,
      (o) => ({ ...o, paymentStatus: `Paid · ${refText}` }),
      {
        title: 'Advance payment verified',
        message: `Company completed advance payment (${refText}).`,
      }
    )
  }

  const scheduleCollection = (orderId, schedule) => {
    applyOrderMutation(
      orderId,
      (o) => ({
        ...o,
        status: 'Collection Scheduled',
        collectionSchedule: {
          ...o.collectionSchedule,
          date: schedule.date,
          timeSlot: schedule.timeSlot,
          agent: schedule.agent,
          vehicle: schedule.vehicle,
        },
      }),
      {
        title: 'Collection pickup scheduled',
        message: `Pickup scheduled on ${schedule.date} (${schedule.timeSlot}) by ${schedule.agent}.`,
      }
    )
  }

  const recordCollectionWeight = (orderId, weighedQty) => {
    const qty = Number(weighedQty)
    if (!qty || qty <= 0) return

    applyOrderMutation(
      orderId,
      (o) => {
        const isAdvancePaid =
          o.paymentArrangement === 'Payment Before Collection' && o.paymentStatus.startsWith('Paid')
        return {
          ...o,
          weighedQuantity: qty,
          totalAmount: Math.round(qty * o.agreedPrice),
          status: isAdvancePaid ? 'Completed' : 'Collected',
        }
      },
      {
        title: 'Collection weight recorded',
        message: `Actual weighed quantity recorded: ${qty}.`,
      }
    )
  }

  const completeAfterCollectionPayment = (orderId, reference) => {
    const refText = reference.trim() || `NEFT${Math.floor(10000 + Math.random() * 90000)}`
    applyOrderMutation(
      orderId,
      (o) => ({
        ...o,
        status: 'Completed',
        paymentStatus: `Settled · ${refText}`,
      }),
      {
        title: 'Order payment settled',
        message: `Final payment settled (${refText}).`,
      }
    )
  }

  const markCompanyNotificationRead = (id) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    }))
  }

  const markAllCompanyNotificationsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, unread: false })),
    }))
  }

  const resetCompanyDemoData = () => {
    setState((prev) => ({
      ...INITIAL_COMPANY_DATA,
      isAuthenticated: prev.isAuthenticated,
    }))
  }

  return (
    <CompanyContext.Provider
      value={{
        isAuthenticated: state.isAuthenticated,
        companyProfile: state.companyProfile,
        allListings,
        allOffers,
        allOrders,
        farmersDirectory,
        notifications: state.notifications,
        loginCompany,
        logoutCompany,
        updateCompanyProfile,
        markListingViewed,
        sendCompanyOffer,
        acceptFarmerCounter,
        reviseCompanyOffer,
        withdrawCompanyOffer,
        recordAdvancePayment,
        scheduleCollection,
        recordCollectionWeight,
        completeAfterCollectionPayment,
        markCompanyNotificationRead,
        markAllCompanyNotificationsRead,
        resetCompanyDemoData,
      }}
    >
      {children}
    </CompanyContext.Provider>
  )
}

