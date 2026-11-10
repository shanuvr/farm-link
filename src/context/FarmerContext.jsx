import { useEffect, useState } from 'react'
import { INITIAL_FARMER_DATA, STORAGE_KEY } from '../farmers/farmerData'
import { FarmerContext } from './farmerContextStore'

function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      return JSON.parse(saved)
    }
  } catch {
    // Fall back to default demo state if storage is unavailable or malformed
  }
  return INITIAL_FARMER_DATA
}

/**
 * Provides persistent client-side state for the Farmer Portal workflow.
 */
export function FarmerProvider({ children }) {
  const [state, setState] = useState(loadInitialState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore storage quota errors in restricted browsing modes
    }
  }, [state])

  const setFarmerSessionEmail = (email) => {
    if (!email) return
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, email },
    }))
  }

  const updateProfile = (updates) => {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
    }))
  }

  const addListing = (payload) => {
    const cleanImages = Array.isArray(payload.images)
      ? payload.images.filter(Boolean)
      : payload.image
        ? [payload.image]
        : []

    const newListing = {
      id: `lst-${Date.now()}`,
      productName: payload.productName.trim(),
      type: payload.type,
      quantity: Number(payload.quantity),
      reservedQuantity: 0,
      unit: payload.unit,
      askingPrice: Number(payload.askingPrice),
      grade: payload.grade,
      harvestDate: payload.harvestDate,
      availableFrom: payload.availableFrom,
      location: payload.location.trim(),
      notes: payload.notes.trim(),
      images: cleanImages,
      status: 'active',
      companyViewed: { viewed: false, viewedAt: null },
    }

    const newNotification = {
      id: `not-${Date.now()}`,
      type: 'listing',
      title: `Listed ${newListing.productName}`,
      message: `${newListing.quantity} ${newListing.unit} published at ₹${newListing.askingPrice}/${newListing.unit} (${newListing.type}).`,
      time: 'Just now',
      unread: true,
      link: '/farmers/listings',
    }

    setState((prev) => ({
      ...prev,
      listings: [newListing, ...prev.listings],
      notifications: [newNotification, ...prev.notifications],
    }))

    return newListing
  }

  const updateListing = (listingId, updates) => {
    setState((prev) => ({
      ...prev,
      listings: prev.listings.map((item) =>
        item.id === listingId ? { ...item, ...updates } : item
      ),
    }))
  }

  const toggleListingStatus = (listingId) => {
    setState((prev) => ({
      ...prev,
      listings: prev.listings.map((item) => {
        if (item.id !== listingId || item.status === 'sold_out') return item
        return {
          ...item,
          status: item.status === 'paused' ? 'active' : 'paused',
        }
      }),
    }))
  }

  const deleteListing = (listingId) => {
    setState((prev) => ({
      ...prev,
      listings: prev.listings.filter((item) => item.id !== listingId),
    }))
  }

  const acceptOffer = (offerId) => {
    setState((prev) => {
      const target = prev.offers.find((o) => o.id === offerId)
      if (!target || target.status === 'accepted') return prev

      const nextOrderNum = prev.orders.length + 20
      const orderRef = `FL-2026-0${nextOrderNum}`
      const totalAmount = target.offeredPrice * target.quantity

      const newOrder = {
        id: `ord-${Date.now()}`,
        orderRef,
        listingId: target.listingId,
        productName: target.productName,
        companyName: target.companyName,
        agreedQuantity: target.quantity,
        weighedQuantity: null,
        unit: target.unit,
        agreedPrice: target.offeredPrice,
        totalAmount,
        paymentArrangement: target.paymentPreference,
        paymentStatus:
          target.paymentPreference === 'Payment Before Collection'
            ? 'Awaiting Company Payment'
            : 'Due After Collection & Weighing',
        status: 'Confirmed',
        farmerConfirmed: false,
        collectionSchedule: {
          date: 'Pending Schedule',
          timeSlot: 'Company will assign slot shortly',
          location: prev.profile.village || prev.profile.district,
          agent: 'To be assigned',
          vehicle: 'To be assigned',
        },
        createdAt: 'Just now',
      }

      const updatedListings = prev.listings.map((lst) => {
        if (lst.id !== target.listingId) return lst
        const nextReserved = Math.min(lst.quantity, lst.reservedQuantity + target.quantity)
        return {
          ...lst,
          reservedQuantity: nextReserved,
          status: nextReserved >= lst.quantity ? 'sold_out' : lst.status,
        }
      })

      const updatedOffers = prev.offers.map((o) =>
        o.id === offerId
          ? {
              ...o,
              status: 'accepted',
              expiresIn: 'Deal Closed',
              history: [
                ...o.history,
                {
                  id: `r-${Date.now()}`,
                  actor: 'farmer',
                  label: 'Offer Accepted',
                  price: o.offeredPrice,
                  quantity: o.quantity,
                  time: 'Just now',
                },
              ],
            }
          : o
      )

      const newNotif = {
        id: `not-${Date.now()}`,
        type: 'order',
        title: `Order ${orderRef} Confirmed`,
        message: `Agreed ${target.quantity} ${target.unit} of ${target.productName} at ₹${target.offeredPrice}/${target.unit}.`,
        time: 'Just now',
        unread: true,
        link: '/farmers/orders',
      }

      return {
        ...prev,
        listings: updatedListings,
        offers: updatedOffers,
        orders: [newOrder, ...prev.orders],
        notifications: [newNotif, ...prev.notifications],
      }
    })
  }

  const counterOffer = (offerId, pricePerUnit, quantity) => {
    const cleanPrice = Number(pricePerUnit)
    const cleanQty = Number(quantity)
    if (!cleanPrice || cleanPrice <= 0 || !cleanQty || cleanQty <= 0) return

    setState((prev) => {
      const target = prev.offers.find((o) => o.id === offerId)
      if (!target) return prev

      const updatedOffers = prev.offers.map((o) =>
        o.id === offerId
          ? {
              ...o,
              offeredPrice: cleanPrice,
              quantity: cleanQty,
              status: 'countered_by_farmer',
              expiresIn: 'Awaiting company reply',
              history: [
                ...o.history,
                {
                  id: `r-${Date.now()}`,
                  actor: 'farmer',
                  label: 'Your Counteroffer',
                  price: cleanPrice,
                  quantity: cleanQty,
                  time: 'Just now',
                },
              ],
            }
          : o
      )

      const newNotif = {
        id: `not-${Date.now()}`,
        type: 'offer',
        title: `Counteroffer sent on ${target.productName}`,
        message: `Proposed ₹${cleanPrice}/${target.unit} for ${cleanQty} ${target.unit} to ${target.companyName}.`,
        time: 'Just now',
        unread: true,
        link: '/farmers/offers',
      }

      return {
        ...prev,
        offers: updatedOffers,
        notifications: [newNotif, ...prev.notifications],
      }
    })
  }

  const rejectOffer = (offerId, reason) => {
    setState((prev) => ({
      ...prev,
      offers: prev.offers.map((o) =>
        o.id === offerId
          ? {
              ...o,
              status: 'rejected',
              expiresIn: 'Declined',
              rejectReason: reason || 'Declined by farmer',
              history: [
                ...o.history,
                {
                  id: `r-${Date.now()}`,
                  actor: 'farmer',
                  label: reason ? `Declined (${reason})` : 'Offer Declined',
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

  const confirmOrderCollection = (orderId) => {
    setState((prev) => {
      const target = prev.orders.find((o) => o.id === orderId)
      if (!target) return prev

      const updatedOrders = prev.orders.map((o) =>
        o.id === orderId
          ? {
              ...o,
              farmerConfirmed: true,
              status: 'Completed',
              paymentStatus:
                o.paymentArrangement === 'Payment Before Collection'
                  ? o.paymentStatus
                  : 'Settled · Verified upon Collection',
            }
          : o
      )

      const newNotif = {
        id: `not-${Date.now()}`,
        type: 'order',
        title: `Order ${target.orderRef} Completed`,
        message: `Collection receipt confirmed for ${target.productName}.`,
        time: 'Just now',
        unread: true,
        link: '/farmers/orders',
      }

      return {
        ...prev,
        orders: updatedOrders,
        notifications: [newNotif, ...prev.notifications],
      }
    })
  }

  const markNotificationRead = (notificationId) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) =>
        n.id === notificationId ? { ...n, unread: false } : n
      ),
    }))
  }

  const markAllNotificationsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, unread: false })),
    }))
  }

  const resetDemoData = () => {
    setState(INITIAL_FARMER_DATA)
  }

  return (
    <FarmerContext.Provider
      value={{
        ...state,
        setFarmerSessionEmail,
        updateProfile,
        addListing,
        updateListing,
        toggleListingStatus,
        deleteListing,
        acceptOffer,
        counterOffer,
        rejectOffer,
        confirmOrderCollection,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
      }}
    >
      {children}
    </FarmerContext.Provider>
  )
}

