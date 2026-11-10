import { Link } from 'react-router-dom'
import { useFarmer } from '../context/farmerContextStore'
import { formatINR } from './farmerData'

export default function FarmersHome() {
  const { profile, listings, offers, orders, notifications } = useFarmer()

  const activeListings = listings.filter((l) => l.status === 'active')
  const pendingOffers = offers.filter((o) => o.status === 'pending_farmer')
  const activeOrders = orders.filter((o) => o.status !== 'Completed')
  const totalEarnings = orders
    .filter((o) => o.status === 'Completed' || o.paymentStatus.startsWith('Paid'))
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0)

  const viewedListingsCount = listings.filter((l) => l.companyViewed?.viewed).length
  const nextPickup = activeOrders[0]

  const stats = [
    {
      label: 'Active Listings',
      value: activeListings.length,
      sub: `${viewedListingsCount}/${listings.length} viewed`,
      to: '/farmers/listings',
      dot: 'bg-[#184828]',
    },
    {
      label: 'Pending Offers',
      value: pendingOffers.length,
      sub: pendingOffers.length > 0 ? 'Needs reply' : 'Caught up',
      to: '/farmers/offers',
      dot: pendingOffers.length > 0 ? 'bg-[#b91c1c]' : 'bg-[#6c7d6e]',
    },
    {
      label: 'Confirmed Orders',
      value: activeOrders.length,
      sub: `${orders.length} total`,
      to: '/farmers/orders',
      dot: 'bg-[#2c6e43]',
    },
    {
      label: 'Verified Sales',
      value: formatINR(totalEarnings),
      sub: 'Report →',
      to: '/farmers/reports',
      dot: 'bg-[#184828]',
    },
  ]

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Compact Welcome Strip */}
      <section className="flex items-center justify-between gap-2 pb-0.5">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 text-[10.5px] sm:text-[11px] font-semibold text-[#2c6e43]">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#22c55e] shrink-0" />
            <span className="truncate">
              {profile.verified ? 'Verified Farmer' : 'Pending Verification'} · {profile.district}
            </span>
          </div>
          <h1 className="mt-0.5 font-serif text-lg sm:text-2xl font-bold text-[#143e22] tracking-tight truncate">
            Welcome back, {profile.name.split(' ')[0]}
          </h1>
        </div>

        <Link
          to="/farmers/offers"
          className="lg:hidden shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#184828] text-white text-[11px] font-semibold shadow-2xs"
        >
          <span>{pendingOffers.length} Pending →</span>
        </Link>
      </section>

      {/* Compact KPI Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {stats.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="rounded-xl bg-white border border-[#e2e6e1] px-3 py-2 sm:px-3.5 sm:py-3 hover:border-[#184828]/45 hover:shadow-xs transition-all group"
          >
            <div className="flex items-center justify-between gap-1.5">
              <span className="text-[11px] sm:text-[11.5px] font-medium text-[#465a48] truncate">
                {item.label}
              </span>
              <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 ${item.dot}`} aria-hidden="true" />
            </div>
            <div className="mt-1 sm:mt-1 flex items-baseline justify-between gap-1.5 sm:block">
              <p className="font-serif text-[18px] sm:text-2xl font-bold text-[#143e22] leading-none">
                {item.value}
              </p>
              <p className="text-[10px] sm:text-[11px] text-[#647566] group-hover:text-[#184828] transition-colors truncate sm:mt-1">
                {item.sub}
              </p>
            </div>
          </Link>
        ))}
      </section>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
        {/* Offers Awaiting Response */}
        <section className="lg:col-span-7 rounded-2xl bg-white border border-[#e2e6e1] p-3.5 sm:p-4 shadow-2xs">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <h2 className="font-serif text-[15px] sm:text-lg font-bold text-[#143e22]">
              Offers Awaiting Response
            </h2>
            <Link
              to="/farmers/offers"
              className="text-xs font-semibold text-[#184828] hover:underline shrink-0"
            >
              All Offers →
            </Link>
          </div>

          {pendingOffers.length === 0 ? (
            <div className="rounded-xl bg-[#f8faf8] border border-dashed border-slate-300 p-4 text-center">
              <p className="text-sm font-semibold text-[#143e22]">No pending offers right now</p>
              <p className="mt-0.5 text-xs text-[#5e7160]">
                New offers from the purchasing company will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {pendingOffers.map((offer) => (
                <div
                  key={offer.id}
                  className="py-2 first:pt-0 last:pb-0 flex items-center justify-between gap-2.5"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-serif font-bold text-[13.5px] sm:text-sm text-[#143e22] truncate">
                        {offer.productName}
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-[#fceae6] text-[#9a2e1a] text-[9.5px] sm:text-[10px] font-semibold">
                        {offer.expiresIn}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] sm:text-xs text-[#465a48] truncate">
                      <strong className="text-[#143e22]">₹{offer.offeredPrice}/{offer.unit}</strong> · {offer.quantity} {offer.unit}{' '}
                      <span className="text-[#728374]">(Asked ₹{offer.askingPrice})</span>
                    </p>
                  </div>

                  <Link
                    to="/farmers/offers"
                    className="inline-flex items-center justify-center px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#184828] hover:bg-[#12391f] text-white text-[11px] sm:text-xs font-semibold transition-colors shrink-0"
                  >
                    Bargain / Accept
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right Column: Next Collection & Activity */}
        <div className="lg:col-span-5 space-y-3 sm:space-y-4">
          {nextPickup && (
            <section className="rounded-2xl bg-white border border-[#e2e6e1] p-3.5 sm:p-4 shadow-2xs">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <h2 className="font-serif text-[15px] sm:text-base font-bold text-[#143e22]">
                  Next Confirmed Pickup
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-[#e8f3e1] text-[#184828] text-[10px] font-bold">
                  {nextPickup.orderRef}
                </span>
              </div>
              <p className="text-[13px] sm:text-sm font-semibold text-[#143e22]">
                {nextPickup.productName} · {nextPickup.agreedQuantity} {nextPickup.unit}
              </p>
              <p className="mt-0.5 text-[11px] sm:text-xs text-[#465a48]">
                {nextPickup.collectionSchedule.date} ({nextPickup.collectionSchedule.timeSlot})
              </p>
              <div className="mt-1.5 flex items-center justify-between gap-2 text-[11px]">
                <span className="text-[#5e7160]">{nextPickup.paymentStatus}</span>
                <Link to="/farmers/orders" className="font-semibold text-[#184828] hover:underline shrink-0">
                  Orders →
                </Link>
              </div>
            </section>
          )}

          <section className="rounded-2xl bg-white border border-[#e2e6e1] p-3.5 sm:p-4 shadow-2xs">
            <h2 className="font-serif text-[15px] sm:text-base font-bold text-[#143e22] mb-2">
              Recent Activity
            </h2>
            <div className="divide-y divide-slate-100">
              {notifications.slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  to={item.link || '/farmers'}
                  className="block py-1.5 sm:py-2 first:pt-0 last:pb-0 hover:bg-slate-50 -mx-1 px-1 rounded-lg transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#143e22] truncate">{item.title}</span>
                    <span className="text-[10px] text-[#6d7d6f] shrink-0">{item.time}</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-[#586a5a] line-clamp-1">{item.message}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
