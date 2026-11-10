import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useFarmer } from '../context/farmerContextStore'
import { formatINR } from './farmerData'
import ProduceThumb from './ProduceThumb'

const ORDER_STEPS = ['Confirmed', 'Collection Scheduled', 'Collected', 'Completed']

function stepIndexForStatus(status) {
  const idx = ORDER_STEPS.indexOf(status)
  return idx === -1 ? 0 : idx
}

export default function FarmerOrders() {
  const { orders, confirmOrderCollection } = useFarmer()
  const [tab, setTab] = useState('active')

  const activeOrders = orders.filter((o) => o.status !== 'Completed')
  const completedOrders = orders.filter((o) => o.status === 'Completed')
  const visibleOrders = tab === 'active' ? activeOrders : completedOrders

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#143e22]">
          Confirmed Orders
        </h1>
        <p className="mt-0.5 text-xs text-[#5e7160]">
          Track pickup schedules, weighed quantities, and payment settlement.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5">
        {[
          { id: 'active', label: 'Active Orders', count: activeOrders.length },
          { id: 'completed', label: 'Completed Sales', count: completedOrders.length },
        ].map((item) => {
          const active = tab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                active
                  ? 'bg-[#184828] text-white border-[#184828]'
                  : 'bg-[#fffdf8] text-[#465a48] border-[#e2d8c1] hover:border-[#184828]'
              }`}
            >
              <span>{item.label}</span>
              <span
                className={`px-1.5 rounded-full text-[10px] font-bold ${
                  active ? 'bg-white/20 text-white' : 'bg-[#f1ead9] text-[#143e22]'
                }`}
              >
                {item.count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Order Cards (2 columns on desktop) */}
      {visibleOrders.length === 0 ? (
        <div className="rounded-2xl bg-[#fffdf8] border border-dashed border-[#dcd2b8] p-8 text-center">
          <p className="font-serif text-base font-bold text-[#143e22]">
            {tab === 'active' ? 'No active confirmed orders' : 'No completed sales yet'}
          </p>
          <p className="mt-1 text-xs text-[#5e7160]">
            Accepted offers from{' '}
            <Link to="/farmers/offers" className="font-semibold text-[#184828] underline">
              Offers
            </Link>{' '}
            appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 items-start">
          {visibleOrders.map((order) => {
            const currentStep = stepIndexForStatus(order.status)
            const isPaid = order.paymentStatus.startsWith('Paid') || order.paymentStatus.startsWith('Settled')

            return (
              <article
                key={order.id}
                className="rounded-2xl bg-[#fffdf8] border border-[#e5dcbd] p-4 shadow-2xs space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ProduceThumb name={order.productName} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-[#f3ede0] text-[#5d281f] text-[10.5px] font-bold">
                          {order.orderRef}
                        </span>
                        <h2 className="font-serif text-base font-bold text-[#143e22] truncate">
                          {order.productName}
                        </h2>
                      </div>
                      <p className="text-[11px] text-[#5e7160] truncate">
                        {order.companyName} · {order.createdAt}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-serif text-base sm:text-lg font-bold text-[#143e22]">
                      {formatINR(order.totalAmount)}
                    </p>
                    <p className="text-[11px] text-[#465a48]">
                      {order.agreedQuantity} {order.unit} × ₹{order.agreedPrice}
                    </p>
                  </div>
                </div>

                {/* 4-Step Pipeline */}
                <div className="grid grid-cols-4 gap-1.5">
                  {ORDER_STEPS.map((stepLabel, idx) => {
                    const reached = idx <= currentStep
                    return (
                      <div key={stepLabel} className="space-y-1">
                        <div
                          className={`h-1.5 rounded-full transition-colors ${
                            reached ? 'bg-[#184828]' : 'bg-[#e6dec9]'
                          }`}
                        />
                        <p
                          className={`text-[10px] leading-tight ${
                            reached ? 'font-bold text-[#143e22]' : 'text-[#7c8c7e]'
                          }`}
                        >
                          {stepLabel}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* Payment & Collection Summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-xl bg-[#fbf8f1] border border-[#ede5d2] p-3 text-[11.5px]">
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#5e7160]">
                      Payment
                    </p>
                    <p className="font-semibold text-[#143e22]">{order.paymentArrangement}</p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${
                        isPaid ? 'bg-[#e8f3e1] text-[#184828]' : 'bg-[#fef3c7] text-[#92400e]'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-[#5e7160]">
                      Collection
                    </p>
                    <p className="font-semibold text-[#143e22]">
                      {order.collectionSchedule.date} · {order.collectionSchedule.timeSlot}
                    </p>
                    <p className="text-[#465a48] truncate">{order.collectionSchedule.location}</p>
                    <p className="text-[10.5px] text-[#5e7160]">
                      {order.collectionSchedule.agent} ({order.collectionSchedule.vehicle})
                    </p>
                  </div>
                </div>

                {/* Receipt Confirmation */}
                {order.status !== 'Completed' && (
                  <div className="pt-2 border-t border-[#f0e9d9] flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[#5e7160]">
                      Confirm once picked up &amp; weighed.
                    </span>
                    <button
                      type="button"
                      onClick={() => confirmOrderCollection(order.id)}
                      className="px-3.5 py-1.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer shrink-0"
                    >
                      Confirm Collection
                    </button>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
