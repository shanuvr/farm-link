import { useMemo, useState } from 'react'
import { useFarmer } from '../context/farmerContextStore'
import { exportFarmerSalesCsv, formatINR } from './farmerData'

const PAYOUT_FILTERS = [
  { key: 'all', label: 'All Orders' },
  { key: 'paid', label: 'Paid / Settled' },
  { key: 'pending', label: 'Pending Payout' },
]

function isOrderPaid(order) {
  const s = String(order.paymentStatus || '')
  return s.startsWith('Paid') || s.startsWith('Settled') || order.status === 'Completed'
}

/**
 * Farmer Portal Sales, Payout Analytics & Stock Utilization Report (/farmers/reports).
 */
export default function FarmerReports() {
  const { orders, listings } = useFarmer()
  const [filter, setFilter] = useState('all')

  const analytics = useMemo(() => {
    const totalContracted = orders.reduce((s, o) => s + (o.totalAmount || 0), 0)
    const totalPaid = orders
      .filter(isOrderPaid)
      .reduce((s, o) => s + (o.totalAmount || 0), 0)
    const totalPending = Math.max(0, totalContracted - totalPaid)
    const totalSoldKg = orders.reduce(
      (s, o) => s + (o.weighedQuantity ?? o.agreedQuantity ?? 0),
      0
    )

    const cropMap = {}
    orders.forEach((o) => {
      const qty = o.weighedQuantity ?? o.agreedQuantity ?? 0
      const amt = o.totalAmount || 0
      if (!cropMap[o.productName]) {
        cropMap[o.productName] = { name: o.productName, qty: 0, amount: 0, orders: 0 }
      }
      cropMap[o.productName].qty += qty
      cropMap[o.productName].amount += amt
      cropMap[o.productName].orders += 1
    })

    const byCrop = Object.values(cropMap).sort((a, b) => b.amount - a.amount)
    const maxCropAmount = byCrop[0]?.amount || 1

    const inventoryStats = listings.map((l) => {
      const total = l.quantity || 0
      const reserved = l.reservedQuantity || 0
      const pct = total > 0 ? Math.min(100, Math.round((reserved / total) * 100)) : 0
      return {
        id: l.id,
        name: l.productName,
        total,
        reserved,
        available: Math.max(0, total - reserved),
        unit: l.unit || 'kg',
        pct,
      }
    })

    return { totalContracted, totalPaid, totalPending, totalSoldKg, byCrop, maxCropAmount, inventoryStats }
  }, [orders, listings])

  const visibleOrders = orders.filter((o) => {
    if (filter === 'paid') return isOrderPaid(o)
    if (filter === 'pending') return !isOrderPaid(o)
    return true
  })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#143e22]">
            Sales &amp; Earnings Reports
          </h1>
          <p className="mt-0.5 text-xs text-[#5e7160]">
            Track confirmed revenue, company payments received vs pending, and crop sell-through.
          </p>
        </div>

        <button
          type="button"
          onClick={() => exportFarmerSalesCsv(orders)}
          disabled={orders.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#184828] hover:bg-[#12391f] disabled:opacity-50 text-white text-xs font-semibold shadow-2xs transition-colors self-start cursor-pointer"
        >
          Export Sales CSV ↓
        </button>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl bg-white border border-[#e2e6e1] p-4 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Total Contracted Sales</p>
          <p className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {formatINR(analytics.totalContracted)}
          </p>
        </div>

        <div className="rounded-xl bg-white border border-[#e2e6e1] p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Payments Received</p>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <p className="font-serif text-xl sm:text-2xl font-bold text-[#184828] mt-1">
            {formatINR(analytics.totalPaid)}
          </p>
        </div>

        <div className="rounded-xl bg-white border border-[#e2e6e1] p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-500">Pending Payouts</p>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <p className="font-serif text-xl sm:text-2xl font-bold text-amber-800 mt-1">
            {formatINR(analytics.totalPending)}
          </p>
        </div>

        <div className="rounded-xl bg-white border border-[#e2e6e1] p-4 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Total Harvest Sold</p>
          <p className="font-serif text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {analytics.totalSoldKg} kg
          </p>
        </div>
      </div>

      {/* Revenue Breakdown & Batch Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-2xl bg-white border border-[#e2e6e1] p-5 space-y-4 shadow-2xs">
          <h2 className="font-serif text-base sm:text-lg font-bold text-[#143e22]">
            Earnings by Crop
          </h2>
          {analytics.byCrop.length === 0 ? (
            <p className="text-xs text-slate-500">No confirmed sales recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {analytics.byCrop.map((crop) => (
                <div key={crop.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">{crop.name}</span>
                    <span className="font-bold text-[#184828]">
                      {formatINR(crop.amount)} · {crop.qty} kg
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-emerald-50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#184828]"
                      style={{
                        width: `${Math.max(8, Math.round((crop.amount / analytics.maxCropAmount) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white border border-[#e2e6e1] p-5 space-y-4 shadow-2xs">
          <h2 className="font-serif text-base sm:text-lg font-bold text-[#143e22]">
            Batch Stock Sell-Through
          </h2>
          <div className="space-y-3">
            {analytics.inventoryStats.map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 truncate">{item.name}</span>
                  <span className="text-slate-600 font-medium shrink-0">
                    <strong className="text-[#143e22]">{item.reserved}</strong> / {item.total}{' '}
                    {item.unit} committed ({item.pct}%)
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#1e293b]"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Payout & Order Ledger Table */}
      <section className="rounded-2xl bg-white border border-[#e2e6e1] overflow-hidden shadow-2xs">
        <div className="px-5 py-3.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-serif text-base sm:text-lg font-bold text-[#143e22]">
            Sales &amp; Payout Ledger
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {PAYOUT_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors cursor-pointer ${
                  filter === f.key
                    ? 'bg-[#184828] text-white border-[#184828]'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#184828]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10.5px]">
              <tr>
                <th className="px-4 py-2.5">Ref</th>
                <th className="px-4 py-2.5">Produce</th>
                <th className="px-4 py-2.5">Qty</th>
                <th className="px-4 py-2.5">Rate</th>
                <th className="px-4 py-2.5">Total</th>
                <th className="px-4 py-2.5">Payment Terms</th>
                <th className="px-4 py-2.5">Payment Status</th>
                <th className="px-4 py-2.5">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No matching sales orders found.
                  </td>
                </tr>
              ) : (
                visibleOrders.map((o) => {
                  const paid = isOrderPaid(o)
                  return (
                    <tr key={o.id} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-bold text-slate-700">{o.orderRef}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{o.productName}</td>
                      <td className="px-4 py-3 text-slate-700">
                        {o.weighedQuantity ?? o.agreedQuantity} {o.unit}
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        ₹{o.agreedPrice}/{o.unit}
                      </td>
                      <td className="px-4 py-3 font-bold text-[#184828]">
                        {formatINR(o.totalAmount)}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{o.paymentArrangement}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${
                            paid
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10.5px] font-semibold">
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

