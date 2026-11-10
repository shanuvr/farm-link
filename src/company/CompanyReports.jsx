import { useMemo } from 'react'
import { useCompany } from '../context/companyContextStore'
import { formatINR } from '../farmers/farmerData'
import { exportProcurementCsv } from './companyData'

/**
 * Procurement spend, volume analytics, and CSV export view (/company/reports).
 */
export default function CompanyReports() {
  const { allOrders } = useCompany()

  const summary = useMemo(() => {
    const totalSpend = allOrders.reduce((s, o) => s + (o.totalAmount || 0), 0)
    const totalKg = allOrders.reduce(
      (s, o) => s + (o.weighedQuantity ?? o.agreedQuantity ?? 0),
      0
    )
    const completedCount = allOrders.filter((o) => o.status === 'Completed').length

    const byProduct = {}
    const byFarmer = {}

    allOrders.forEach((o) => {
      const qty = o.weighedQuantity ?? o.agreedQuantity ?? 0
      const amt = o.totalAmount || 0

      if (!byProduct[o.productName]) {
        byProduct[o.productName] = { name: o.productName, qty: 0, amount: 0, orders: 0 }
      }
      byProduct[o.productName].qty += qty
      byProduct[o.productName].amount += amt
      byProduct[o.productName].orders += 1

      if (!byFarmer[o.farmerName]) {
        byFarmer[o.farmerName] = {
          name: o.farmerName,
          location: o.farmerLocation,
          qty: 0,
          amount: 0,
          orders: 0,
        }
      }
      byFarmer[o.farmerName].qty += qty
      byFarmer[o.farmerName].amount += amt
      byFarmer[o.farmerName].orders += 1
    })

    const products = Object.values(byProduct).sort((a, b) => b.amount - a.amount)
    const farmers = Object.values(byFarmer).sort((a, b) => b.amount - a.amount)
    const maxProductAmount = products[0]?.amount || 1
    const maxFarmerAmount = farmers[0]?.amount || 1

    return {
      totalSpend,
      totalKg,
      completedCount,
      products,
      farmers,
      maxProductAmount,
      maxFarmerAmount,
    }
  }, [allOrders])

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Procurement Reports
          </h1>
          <p className="mt-0.5 text-xs text-slate-600">
            Spend summary across confirmed orders, partner farmers, and weighed crop deliveries.
          </p>
        </div>

        <button
          type="button"
          onClick={() => exportProcurementCsv(allOrders)}
          disabled={allOrders.length === 0}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#184828] hover:bg-[#12391f] disabled:opacity-50 text-white text-xs font-semibold shadow-2xs transition-colors self-start cursor-pointer"
        >
          Export Procurement CSV ↓
        </button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="rounded-xl bg-white border border-[#e2e6e1] p-4 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Total Contract Value</p>
          <p className="font-serif text-2xl font-bold text-slate-900 mt-1">
            {formatINR(summary.totalSpend)}
          </p>
        </div>
        <div className="rounded-xl bg-white border border-[#e2e6e1] p-4 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Total Volume Procured</p>
          <p className="font-serif text-2xl font-bold text-slate-900 mt-1">
            {summary.totalKg} kg
          </p>
        </div>
        <div className="rounded-xl bg-white border border-[#e2e6e1] p-4 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Orders Recorded</p>
          <p className="font-serif text-2xl font-bold text-slate-900 mt-1">{allOrders.length}</p>
        </div>
        <div className="rounded-xl bg-white border border-[#e2e6e1] p-4 shadow-2xs">
          <p className="text-xs font-medium text-slate-500">Settled &amp; Completed</p>
          <p className="font-serif text-2xl font-bold text-[#184828] mt-1">
            {summary.completedCount}
          </p>
        </div>
      </div>

      {/* Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="rounded-2xl bg-white border border-[#e2e6e1] p-5 space-y-4 shadow-2xs">
          <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900">
            Spend by Produce
          </h2>
          {summary.products.length === 0 ? (
            <p className="text-xs text-slate-500">No procurement orders recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {summary.products.map((p) => (
                <div key={p.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">{p.name}</span>
                    <span className="font-bold text-slate-700">
                      {formatINR(p.amount)} · {p.qty} kg
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#1e293b]"
                      style={{
                        width: `${Math.max(8, Math.round((p.amount / summary.maxProductAmount) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl bg-white border border-[#e2e6e1] p-5 space-y-4 shadow-2xs">
          <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900">
            Supply by Farmer
          </h2>
          {summary.farmers.length === 0 ? (
            <p className="text-xs text-slate-500">No farmer transactions recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {summary.farmers.map((f) => (
                <div key={f.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900">
                      {f.name}{' '}
                      <span className="font-normal text-slate-500">({f.location})</span>
                    </span>
                    <span className="font-bold text-[#184828]">
                      {formatINR(f.amount)} · {f.qty} kg
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-emerald-50 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#184828]"
                      style={{
                        width: `${Math.max(8, Math.round((f.amount / summary.maxFarmerAmount) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Ledger Table */}
      <section className="rounded-2xl bg-white border border-[#e2e6e1] overflow-hidden shadow-2xs">
        <div className="px-5 py-3.5 border-b border-slate-100">
          <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900">
            Procurement Ledger
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10.5px]">
              <tr>
                <th className="px-4 py-2.5">Ref</th>
                <th className="px-4 py-2.5">Produce</th>
                <th className="px-4 py-2.5">Farmer</th>
                <th className="px-4 py-2.5">Qty</th>
                <th className="px-4 py-2.5">Rate</th>
                <th className="px-4 py-2.5">Total</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {allOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-bold text-slate-700">{o.orderRef}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900">{o.productName}</td>
                  <td className="px-4 py-3 text-slate-600">{o.farmerName}</td>
                  <td className="px-4 py-3 text-slate-800">
                    {o.weighedQuantity ?? o.agreedQuantity} {o.unit}
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    ₹{o.agreedPrice}/{o.unit}
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-900">{formatINR(o.totalAmount)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${
                        o.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : o.status === 'Collection Scheduled'
                            ? 'bg-sky-50 text-sky-700'
                            : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
