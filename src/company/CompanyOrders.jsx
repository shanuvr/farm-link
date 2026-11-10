import { useState } from 'react'
import PaymentGatewayModal from '../components/PaymentGatewayModal'
import { useCompany } from '../context/companyContextStore'
import { formatINR } from '../farmers/farmerData'
import ProduceThumb from '../farmers/ProduceThumb'

const ORDER_TABS = [
  { key: 'active', label: 'All Active' },
  { key: 'payment', label: 'Payment Due' },
  { key: 'schedule', label: 'Ready to Schedule' },
  { key: 'weighing', label: 'Scheduled / Weighing' },
  { key: 'completed', label: 'Completed' },
]

const ORDER_STEPS = [
  { status: 'Confirmed', label: 'Confirmed' },
  { status: 'Collection Scheduled', label: 'Scheduled' },
  { status: 'Collected', label: 'Weighed' },
  { status: 'Completed', label: 'Settled' },
]

const TIME_SLOTS = [
  '07:30 AM - 09:30 AM',
  '10:00 AM - 12:30 PM',
  '02:30 PM - 04:30 PM',
]

function stepIndexForStatus(status) {
  const idx = ORDER_STEPS.findIndex((s) => s.status === status)
  return idx === -1 ? 0 : idx
}

function getStatusPillClass(status) {
  if (status === 'Completed') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (status === 'Collected') return 'bg-amber-50 text-amber-800 border-amber-200'
  if (status === 'Collection Scheduled') return 'bg-sky-50 text-sky-700 border-sky-200'
  return 'bg-slate-100 text-slate-700 border-slate-200'
}

function needsAdvancePayment(order) {
  return (
    order.paymentArrangement === 'Payment Before Collection' &&
    !String(order.paymentStatus).startsWith('Paid') &&
    !String(order.paymentStatus).startsWith('Settled') &&
    order.status !== 'Completed'
  )
}

function needsScheduling(order) {
  if (needsAdvancePayment(order)) return false
  if (order.status === 'Completed' || order.status === 'Collected') return false
  return (
    order.status === 'Confirmed' ||
    !order.collectionSchedule?.date ||
    order.collectionSchedule.date === 'Pending Schedule'
  )
}

function needsWeighing(order) {
  return order.status === 'Collection Scheduled'
}

function needsAfterCollectionSettlement(order) {
  if (order.status === 'Completed') return false
  return (
    order.status === 'Collected' ||
    (order.paymentArrangement === 'Payment After Collection' &&
      order.weighedQuantity != null &&
      !String(order.paymentStatus).startsWith('Settled'))
  )
}

function OrderActionPanel({
  order,
  onOpenGateway,
  onScheduleCollection,
  onRecordWeight,
}) {
  const [scheduleExpanded, setScheduleExpanded] = useState(false)
  const [pickupDate, setPickupDate] = useState('2026-11-12')
  const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0])
  const [agent, setAgent] = useState('Suresh Kumar')
  const [vehicle, setVehicle] = useState('KL-07 CC 4821 · Pickup Van')
  const [weighedQty, setWeighedQty] = useState(String(order.agreedQuantity || ''))

  if (needsAdvancePayment(order)) {
    return (
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11.5px] font-semibold text-rose-700">
          Advance payment due before pickup scheduling
        </span>
        <button
          type="button"
          onClick={() => onOpenGateway(order, 'advance')}
          className="px-3.5 py-1.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors"
        >
          Pay Now ({formatINR(order.totalAmount)})
        </button>
      </div>
    )
  }

  if (needsScheduling(order)) {
    if (!scheduleExpanded) {
      return (
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <span className="text-[11.5px] text-slate-600">
            Ready to assign farm collection vehicle &amp; time slot.
          </span>
          <button
            type="button"
            onClick={() => setScheduleExpanded(true)}
            className="px-3.5 py-1.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors"
          >
            Schedule Pickup
          </button>
        </div>
      )
    }

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (!pickupDate || !agent.trim() || !vehicle.trim()) return
          onScheduleCollection(order.id, {
            date: pickupDate,
            timeSlot,
            agent: agent.trim(),
            vehicle: vehicle.trim(),
          })
          setScheduleExpanded(false)
        }}
        className="pt-3 border-t border-slate-100 space-y-2.5"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-900">Assign Collection Slot</span>
          <button
            type="button"
            onClick={() => setScheduleExpanded(false)}
            className="text-[11px] font-medium text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            Cancel
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <label className="block text-[10.5px] font-medium text-slate-500 mb-0.5">
              Collection Date
            </label>
            <input
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
              required
            />
          </div>
          <div>
            <label className="block text-[10.5px] font-medium text-slate-500 mb-0.5">
              Time Window
            </label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
            >
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10.5px] font-medium text-slate-500 mb-0.5">
              Collection Agent
            </label>
            <input
              type="text"
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
              required
            />
          </div>
          <div>
            <label className="block text-[10.5px] font-medium text-slate-500 mb-0.5">
              Vehicle Number
            </label>
            <input
              type="text"
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-500"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-3.5 py-1.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Confirm Pickup Schedule
          </button>
        </div>
      </form>
    )
  }

  if (needsWeighing(order)) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onRecordWeight(order.id, weighedQty)
        }}
        className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2"
      >
        <label className="text-[11.5px] font-medium text-slate-700 flex items-center gap-2">
          <span>Weighed ({order.unit}):</span>
          <input
            type="number"
            min="1"
            step="0.5"
            value={weighedQty}
            onChange={(e) => setWeighedQty(e.target.value)}
            className="w-20 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-500"
            required
          />
        </label>
        <button
          type="submit"
          className="px-3.5 py-1.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold cursor-pointer transition-colors shrink-0"
        >
          Save Weight &amp; Collect
        </button>
      </form>
    )
  }

  if (needsAfterCollectionSettlement(order)) {
    return (
      <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11.5px] font-semibold text-amber-800">
          Weighed {order.weighedQuantity ?? order.agreedQuantity} {order.unit} · Final invoice due
        </span>
        <button
          type="button"
          onClick={() => onOpenGateway(order, 'settlement')}
          className="px-3.5 py-1.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold shrink-0 cursor-pointer transition-colors"
        >
          Pay &amp; Settle ({formatINR(order.totalAmount)})
        </button>
      </div>
    )
  }

  return null
}

/**
 * Clean 2-column Orders, Pickup Scheduling, Weighing & Payment Settlement view (/company/orders).
 */
export default function CompanyOrders() {
  const {
    allOrders,
    recordAdvancePayment,
    scheduleCollection,
    recordCollectionWeight,
    completeAfterCollectionPayment,
  } = useCompany()

  const [tab, setTab] = useState('active')
  const [payingTarget, setPayingTarget] = useState(null) // { order, mode: 'advance' | 'settlement' }

  const counts = {
    active: allOrders.filter((o) => o.status !== 'Completed').length,
    payment: allOrders.filter((o) => needsAdvancePayment(o) || needsAfterCollectionSettlement(o))
      .length,
    schedule: allOrders.filter((o) => needsScheduling(o)).length,
    weighing: allOrders.filter((o) => needsWeighing(o)).length,
    completed: allOrders.filter((o) => o.status === 'Completed').length,
  }

  const visibleOrders = allOrders.filter((o) => {
    if (tab === 'active') return o.status !== 'Completed'
    if (tab === 'payment') return needsAdvancePayment(o) || needsAfterCollectionSettlement(o)
    if (tab === 'schedule') return needsScheduling(o)
    if (tab === 'weighing') return needsWeighing(o)
    return o.status === 'Completed'
  })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
          Orders &amp; Farm Logistics
        </h1>
        <p className="mt-0.5 text-xs text-slate-600">
          Track pickup slots, record farmgate weights, and settle verified farm invoices.
        </p>
      </div>

      {/* Compact Stage Filter Pills */}
      <div className="flex flex-wrap gap-1.5">
        {ORDER_TABS.map((t) => {
          const active = tab === t.key
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                active
                  ? 'bg-[#1e293b] text-white border-[#1e293b]'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              <span>{t.label}</span>
              <span
                className={`px-1.5 rounded-full text-[10px] font-bold ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                {counts[t.key]}
              </span>
            </button>
          )
        })}
      </div>

      {/* Orders 2-Column Grid */}
      {visibleOrders.length === 0 ? (
        <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-8 text-center">
          <p className="font-serif text-base font-bold text-slate-900">No orders in this stage</p>
          <p className="mt-1 text-xs text-slate-500">
            Switch stage tabs above or accept a counteroffer in Negotiations to create a new order.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
          {visibleOrders.map((order) => {
            const currentStep = stepIndexForStatus(order.status)
            const isPaid =
              String(order.paymentStatus).startsWith('Paid') ||
              String(order.paymentStatus).startsWith('Settled')

            return (
              <article
                key={order.id}
                className="rounded-2xl bg-white border border-[#e2e6e1] p-4 shadow-2xs space-y-3"
              >
                {/* Card Header with ProduceThumb & Right-Aligned Amount */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ProduceThumb name={order.productName} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10.5px] font-bold">
                          {order.orderRef}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full border text-[10.5px] font-semibold ${getStatusPillClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <h2 className="mt-1 font-serif text-base font-bold text-slate-900 truncate">
                        {order.productName}
                      </h2>
                      <p className="text-[11px] text-slate-500 truncate">
                        {order.farmerName} · {order.farmerLocation}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="font-serif text-base sm:text-lg font-bold text-slate-900">
                      {formatINR(order.totalAmount)}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {order.weighedQuantity ?? order.agreedQuantity} {order.unit} × ₹
                      {order.agreedPrice}
                    </p>
                  </div>
                </div>

                {/* 4-Step Pipeline Progress */}
                <div className="grid grid-cols-4 gap-1.5">
                  {ORDER_STEPS.map((step, idx) => {
                    const reached = idx <= currentStep
                    return (
                      <div key={step.status} className="space-y-1">
                        <div
                          className={`h-1.5 rounded-full transition-colors ${
                            reached ? 'bg-[#184828]' : 'bg-slate-200'
                          }`}
                        />
                        <p
                          className={`text-[10px] leading-tight ${
                            reached ? 'font-bold text-slate-900' : 'text-slate-400'
                          }`}
                        >
                          {step.label}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* Compact 2-Column Metadata Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 rounded-xl bg-[#f8faf8] border border-[#e5e9e4] p-3 text-[11.5px]">
                  <div className="space-y-1">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Payment
                    </p>
                    <p className="font-semibold text-slate-800">{order.paymentArrangement}</p>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${
                        isPaid
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Collection
                    </p>
                    <p className="font-semibold text-slate-800">
                      {order.collectionSchedule?.date || 'Pending'}
                    </p>
                    <p className="text-slate-600 truncate">
                      {order.collectionSchedule?.timeSlot || 'Assign pickup slot'}
                    </p>
                    <p className="text-[10.5px] text-slate-500 truncate">
                      {order.collectionSchedule?.agent} · {order.collectionSchedule?.vehicle}
                    </p>
                  </div>
                </div>

                <OrderActionPanel
                  order={order}
                  onOpenGateway={(targetOrder, mode) => setPayingTarget({ order: targetOrder, mode })}
                  onScheduleCollection={scheduleCollection}
                  onRecordWeight={recordCollectionWeight}
                />
              </article>
            )
          })}
        </div>
      )}

      {payingTarget && (
        <PaymentGatewayModal
          amount={payingTarget.order.totalAmount}
          recipientName={payingTarget.order.farmerName}
          recipientPayout={payingTarget.order.farmerPayout}
          itemSummary={`${payingTarget.order.orderRef} · ${payingTarget.order.productName}`}
          onClose={() => setPayingTarget(null)}
          onSuccess={(tx) => {
            if (payingTarget.mode === 'advance') {
              recordAdvancePayment(payingTarget.order.id, tx.transactionRef)
            } else {
              completeAfterCollectionPayment(payingTarget.order.id, tx.transactionRef)
            }
            setPayingTarget(null)
          }}
        />
      )}
    </div>
  )
}
