import { useEffect, useMemo, useState } from 'react'
import { COMPANY_STORAGE_KEY, INITIAL_COMPANY_DATA } from '../company/companyData'
import { CompanyContext } from './companyContextStore'
import { useFarmer } from './farmerContextStore'

function loadCompanyState() {
  try {
    const saved = localStorage.getItem(COMPANY_STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
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
          setState(JSON.parse(e.newValue))
        } catch {
          // Ignore malformed updates
        }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const rajanFarmerId = 'frm-101'

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
      source: 'farmer_live',
    }))
    const partner = state.partnerOffers.map((offer) => ({
      ...offer,
      source: 'partner',
    }))
    return [...rajanOffers, ...partner]
  }, [farmer.offers, farmer.profile.name, farmer.profile.district, state.partnerOffers])

  const allOrders = useMemo(() => {
    const rajanOrders = farmer.orders.map((order) => ({
      ...order,
      farmerId: rajanFarmerId,
      farmerName: farmer.profile.name,
      farmerLocation: order.collectionSchedule?.location || farmer.profile.district,
      source: 'farmer_live',
    }))
    const partner = state.partnerOrders.map((order) => ({
      ...order,
      source: 'partner',
    }))
    return [...rajanOrders, ...partner]
  }, [farmer.orders, farmer.profile.name, farmer.profile.district, state.partnerOrders])

  const farmersDirectory = useMemo(() => {
    const primaryFarmer = {
      id: rajanFarmerId,
      name: farmer.profile.name,
      district: farmer.profile.district,
      village: farmer.profile.village,
      phone: farmer.profile.phone,
      farmSize: farmer.profile.farmSize,
      verified: farmer.profile.verified,
    }
    return [primaryFarmer, ...state.partnerFarmers].map((f) => {
      const fListings = allListings.filter((l) => l.farmerId === f.id && l.status === 'active')
      const fOrders = allOrders.filter((o) => o.farmerId === f.id)
      const suppliedVolume = fOrders.reduce((s, o) => s + (o.weighedQuantity || o.agreedQuantity || 0), 0)
      return {
        ...f,
        activeListingsCount: fListings.length,
        ordersCount: fOrders.length,
        suppliedVolume,
      }
    })
  }, [farmer.profile, state.partnerFarmers, allListings, allOrders])

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
    if (!cleanPrice || cleanPrice <= 0 || !cleanQty || cleanQty <= 0) return

    const listing = allListings.find((l) => l.id === listingId)
    if (!listing) return

    if (isRajanListing(listingId)) {
      farmer.receiveCompanyOffer({
        listingId,
        companyName: state.companyProfile.companyName,
        offeredPrice: cleanPrice,
        quantity: cleanQty,
        paymentPreference,
        validityHours,
      })
    } else {
      const newOffer = {
        id: `coff-${Date.now()}`,
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
        expiresIn: `${validityHours} hours left`,
        history: [
          {
            id: `cr-${Date.now()}`,
            actor: 'company',
            label: 'Your Initial Offer',
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
      }))
    }

    setState((prev) => ({
      ...prev,
      notifications: [
        {
          id: `cnot-${Date.now()}`,
          title: `Offer sent to ${listing.farmerName}`,
          message: `Offered ₹${cleanPrice}/${listing.unit} for ${cleanQty} ${listing.unit} of ${listing.productName}.`,
          time: 'Just now',
          unread: true,
          link: '/company/offers',
        },
        ...prev.notifications,
      ],
    }))
  }

  const acceptFarmerCounter = (offerId) => {
    if (isRajanOffer(offerId)) {
      farmer.acceptFarmerCounterByCompany(offerId)
      return
    }

    setState((prev) => {
      const target = prev.partnerOffers.find((o) => o.id === offerId)
      if (!target || target.status === 'accepted') return prev

      const nextOrderNum = prev.partnerOrders.length + farmer.orders.length + 22
      const orderRef = `FL-2026-0${nextOrderNum}`
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
        paymentArrangement: target.paymentPreference,
        paymentStatus:
          target.paymentPreference === 'Payment Before Collection'
            ? 'Awaiting Company Payment'
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
                status: 'accepted',
                expiresIn: 'Deal Closed',
                history: [
                  ...o.history,
                  {
                    id: `cr-${Date.now()}`,
                    actor: 'company',
                    label: 'Accepted Counteroffer',
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

