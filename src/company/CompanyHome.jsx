import { useState } from 'react'
import { Link } from 'react-router-dom'
import AcceptOfferModal from '../components/AcceptOfferModal'
import ListingPhotoSlider from '../components/ListingPhotoSlider'
import { useCompany } from '../context/companyContextStore'
import { formatINR, getListingImages } from '../farmers/farmerData'
import ProduceThumb from '../farmers/ProduceThumb'
import CompanyListingModal from './CompanyListingModal'

/**
 * Executive Overview dashboard (/company/dashboard) for Company Portal buyers.
 */
export default function CompanyHome() {
  const {
    companyProfile,
    allListings,
    allOffers,
    allOrders,
    markListingViewed,
    sendCompanyOffer,
    acceptFarmerCounter,
  } = useCompany()

  const [selectedListingId, setSelectedListingId] = useState(null)
  const [acceptingOffer, setAcceptingOffer] = useState(null)

  const activeBatches = allListings.filter(
    (l) => l.status !== 'paused' && (l.quantity || 0) - (l.reservedQuantity || 0) > 0
  )
  const counterOffers = allOffers.filter((o) => o.status === 'countered_by_farmer')
  const waitingOffers = allOffers.filter((o) => o.status === 'pending_farmer')
  const activeOrders = allOrders.filter((o) => o.status !== 'Completed')
  const totalSpend = allOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)

  const latestBatches = activeBatches.slice(0, 4)
  const selectedListing = allListings.find((l) => l.id === selectedListingId) || null

  const openModal = (item) => {
    markListingViewed(item.id)
    setSelectedListingId(item.id)
  }

  const kpis = [
    {
      label: 'Available Stock Lots',
      value: activeBatches.length,
      sub: `${activeBatches.filter((l) => l.type === 'Ready Stock').length} ready for pickup`,
      to: '/company/browse',
      dot: 'bg-[#184828]',
    },
    {
      label: 'Counteroffers Received',
      value: counterOffers.length,
      sub: `${waitingOffers.length} awaiting farmer reply`,
      to: '/company/offers',
      dot: counterOffers.length > 0 ? 'bg-amber-500' : 'bg-slate-400',
    },
    {
      label: 'Active Orders',
      value: activeOrders.length,
      sub: `${allOrders.length} total orders placed`,
      to: '/company/orders',
      dot: 'bg-sky-600',
    },
    {
      label: 'Procurement Volume',
      value: formatINR(totalSpend),
      sub: 'View breakdown & CSV →',
      to: '/company/reports',
      dot: 'bg-slate-800',
    },
  ]

  return (
    <div className="space-y-5">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>
              {companyProfile.companyName} · {companyProfile.headquarters}
            </span>
          </div>
          <h1 className="mt-0.5 font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {companyProfile.officerName}
          </h1>
        </div>

        <Link
          to="/company/browse"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold shadow-2xs transition-colors self-start"
        >
          Browse Fresh Stock →
        </Link>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="rounded-xl bg-white border border-[#e2e6e1] px-4 py-3.5 hover:border-slate-300 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11.5px] font-medium text-slate-500">{item.label}</span>
              <span className={`w-2 h-2 rounded-full ${item.dot}`} aria-hidden="true" />
            </div>
            <p className="mt-1 font-serif text-xl sm:text-2xl font-bold text-slate-900 leading-tight">
              {item.value}
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500 group-hover:text-slate-800 transition-colors">
              {item.sub}
            </p>
          </Link>
        ))}
      </div>

      {/* Two-Column Action Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Counteroffers */}
        <section className="rounded-2xl bg-white border border-[#e2e6e1] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900">
              Farmer Counteroffers
            </h2>
            <Link to="/company/offers" className="text-xs font-semibold text-[#184828] hover:underline">
              All Negotiations →
            </Link>
          </div>

          {counterOffers.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center bg-slate-50 rounded-xl">
              No pending farmer counteroffers right now.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {counterOffers.slice(0, 3).map((offer) => (
                <div
                  key={offer.id}
                  className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ProduceThumb name={offer.productName} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {offer.productName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {offer.farmerName} · Proposed{' '}
                        <span className="font-bold text-amber-800">
                          ₹{offer.offeredPrice}/{offer.unit}
                        </span>{' '}
                        ({offer.quantity} {offer.unit})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setAcceptingOffer(offer)}
                      className="px-3 py-1.5 rounded-lg bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold cursor-pointer"
                    >
                      Accept ₹{offer.offeredPrice}
                    </button>
                    <Link
                      to="/company/offers"
                      className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700"
                    >
                      Revise
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Active Orders */}
        <section className="rounded-2xl bg-white border border-[#e2e6e1] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900">
              Logistics &amp; Payments Queue
            </h2>
            <Link to="/company/orders" className="text-xs font-semibold text-[#184828] hover:underline">
              Manage Orders →
            </Link>
          </div>

          {activeOrders.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center bg-slate-50 rounded-xl">
              All confirmed orders are collected and settled.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {activeOrders.slice(0, 3).map((order) => (
                <Link
                  key={order.id}
                  to="/company/orders"
                  className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3 hover:bg-slate-50/70 -mx-2 px-2 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ProduceThumb name={order.productName} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {order.productName}{' '}
                        <span className="text-xs font-medium text-slate-500">
                          · {order.agreedQuantity} {order.unit}
                        </span>
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {order.farmerName} · {order.paymentStatus}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[10.5px] font-semibold">
                      {order.status}
                    </span>
                    <p className="text-[11px] font-bold text-slate-700 mt-0.5">{order.orderRef}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Latest Available Farm Produce */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900">
            Latest Available Farm Produce
          </h2>
          <Link to="/company/browse" className="text-xs font-semibold text-[#184828] hover:underline">
            Explore Full Catalog →
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {latestBatches.map((item) => {
            const available = Math.max(0, (item.quantity || 0) - (item.reservedQuantity || 0))
            return (
              <article
                key={item.id}
                onClick={() => openModal(item)}
                className="group rounded-2xl bg-white border border-[#e2e6e1] overflow-hidden hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
              >
                <div className="bg-slate-100">
                  <ListingPhotoSlider
                    images={getListingImages(item)}
                    alt={item.productName}
                    aspectClass="aspect-[4/3]"
                    compact
                    onImageClick={() => openModal(item)}
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-serif text-sm font-bold text-slate-900 truncate group-hover:text-[#184828]">
                    {item.productName}
                  </h3>
                  <p className="text-[11px] text-slate-500 truncate">{item.farmerName}</p>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">
                      ₹{item.askingPrice}/{item.unit}
                    </span>
                    <span className="font-semibold text-[#184828]">
                      {available} {item.unit}
                    </span>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      {selectedListing && (
        <CompanyListingModal
          listing={selectedListing}
          initialPaymentMode={companyProfile.defaultPaymentMode}
          onClose={() => setSelectedListingId(null)}
          onSubmitOffer={sendCompanyOffer}
        />
      )}

      {acceptingOffer && (
        <AcceptOfferModal
          key={acceptingOffer.id}
          offer={acceptingOffer}
          role="company"
          onClose={() => setAcceptingOffer(null)}
          onConfirm={(options) => {
            acceptFarmerCounter(acceptingOffer.id, options)
            setAcceptingOffer(null)
          }}
        />
      )}
    </div>
  )
}
