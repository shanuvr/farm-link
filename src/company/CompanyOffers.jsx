import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AcceptOfferModal from '../components/AcceptOfferModal'
import { useCompany } from '../context/companyContextStore'
import { formatINR } from '../farmers/farmerData'
import ProduceThumb from '../farmers/ProduceThumb'
import { getOfferSpread, KERALA_DISTRICTS } from './companyData'
import CompanyDealDrawer from './CompanyDealDrawer'

const TABS = [
  { key: 'all_open', label: 'All Open' },
  { key: 'countered', label: 'Your Turn' },
  { key: 'waiting', label: 'Awaiting Farmer' },
  { key: 'history', label: 'History' },
]

function TurnBadge({ status }) {
  if (status === 'countered_by_farmer') {
    return (
      <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10.5px] font-semibold whitespace-nowrap">
        Your Turn
      </span>
    )
  }
  if (status === 'pending_farmer') {
    return (
      <span className="px-2 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-[10.5px] font-semibold whitespace-nowrap">
        Waiting Farmer
      </span>
    )
  }
  if (status === 'accepted') {
    return (
      <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10.5px] font-semibold whitespace-nowrap">
        Accepted
      </span>
    )
  }
  return (
    <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-[10.5px] font-semibold whitespace-nowrap">
      Closed
    </span>
  )
}

function shortDistrict(loc = '') {
  const parts = loc.split(',')
  return (parts[parts.length - 1] || loc).trim()
}

function shortTerms(pref = '') {
  return pref.toLowerCase().includes('before') ? 'Advance' : 'On Pickup'
}

/**
 * High-scale Negotiations Deal Desk (/company/offers) with triage metrics, filters,
 * crop grouping, high-density deal rows, and Slide-Over Deal Inspector Drawer.
 */
export default function CompanyOffers() {
  const { allOffers, acceptFarmerCounter, reviseCompanyOffer, withdrawCompanyOffer } =
    useCompany()

  const [searchParams, setSearchParams] = useSearchParams()
  const highlightedOfferId = searchParams.get('offer') || ''

  const [tab, setTab] = useState('all_open')
  const [viewMode, setViewMode] = useState('list') // 'list' | 'crop'
  const [search, setSearch] = useState('')
  const [cropFilter, setCropFilter] = useState('All Crops')
  const [districtFilter, setDistrictFilter] = useState('All Districts')
  const [sortBy, setSortBy] = useState('recent')
  const [inspectedOfferId, setInspectedOfferId] = useState(null)
  const [acceptingOffer, setAcceptingOffer] = useState(null)
  const [collapsedCrops, setCollapsedCrops] = useState({})
  const [recentBanner, setRecentBanner] = useState('')

  const counts = useMemo(() => {
    const countered = allOffers.filter((o) => o.status === 'countered_by_farmer')
    const waiting = allOffers.filter((o) => o.status === 'pending_farmer')
    const open = [...countered, ...waiting]
    const history = allOffers.filter(
      (o) => o.status !== 'countered_by_farmer' && o.status !== 'pending_farmer'
    )

    const pipelineValue = open.reduce((s, o) => s + (o.offeredPrice || 0) * (o.quantity || 0), 0)
    const avgPct =
      open.length > 0
        ? Math.round(
            open.reduce((s, o) => s + getOfferSpread(o.offeredPrice, o.askingPrice).pct, 0) /
              open.length
          )
        : 0

    return {
      all_open: open.length,
      countered: countered.length,
      waiting: waiting.length,
      history: history.length,
      pipelineValue,
      avgPct,
    }
  }, [allOffers])

  const cropOptions = useMemo(() => {
    const set = new Set(allOffers.map((o) => o.productName).filter(Boolean))
    return ['All Crops', ...Array.from(set).sort()]
  }, [allOffers])

  const visibleOffers = useMemo(() => {
    const q = search.trim().toLowerCase()

    const filtered = allOffers.filter((o) => {
      if (tab === 'all_open') {
        if (o.status !== 'countered_by_farmer' && o.status !== 'pending_farmer') return false
      } else if (tab === 'countered') {
        if (o.status !== 'countered_by_farmer') return false
      } else if (tab === 'waiting') {
        if (o.status !== 'pending_farmer') return false
      } else {
        if (o.status === 'countered_by_farmer' || o.status === 'pending_farmer') return false
      }

      if (cropFilter !== 'All Crops' && o.productName !== cropFilter) return false
      if (
        districtFilter !== 'All Districts' &&
        !(o.farmerLocation || '').toLowerCase().includes(districtFilter.toLowerCase())
      ) {
        return false
      }
      if (q) {
        const hay = `${o.productName} ${o.farmerName} ${o.farmerLocation} ${o.paymentPreference}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })

    return [...filtered].sort((a, b) => {
      if (highlightedOfferId) {
        if (a.id === highlightedOfferId) return -1
        if (b.id === highlightedOfferId) return 1
      }
      if (sortBy === 'recent') {
        const timeDiff = (b.createdAtMs || 0) - (a.createdAtMs || 0)
        if (timeDiff !== 0) return timeDiff
      }
      if (sortBy === 'priority' || sortBy === 'recent') {
        const score = (s) => (s === 'countered_by_farmer' ? 0 : s === 'pending_farmer' ? 1 : 2)
        if (score(a.status) !== score(b.status)) return score(a.status) - score(b.status)
        const timeDiff = (b.createdAtMs || 0) - (a.createdAtMs || 0)
        if (timeDiff !== 0) return timeDiff
        return (b.offeredPrice || 0) * (b.quantity || 0) - (a.offeredPrice || 0) * (a.quantity || 0)
      }
      if (sortBy === 'price_asc') return (a.offeredPrice || 0) - (b.offeredPrice || 0)
      if (sortBy === 'discount') {
        return (
          getOfferSpread(a.offeredPrice, a.askingPrice).pct -
          getOfferSpread(b.offeredPrice, b.askingPrice).pct
        )
      }
      if (sortBy === 'value_desc') {
        return (b.offeredPrice || 0) * (b.quantity || 0) - (a.offeredPrice || 0) * (a.quantity || 0)
      }
      return (b.quantity || 0) - (a.quantity || 0)
    })
  }, [allOffers, tab, cropFilter, districtFilter, search, sortBy, highlightedOfferId])

  const groupedByCrop = useMemo(() => {
    const map = {}
    visibleOffers.forEach((o) => {
      if (!map[o.productName]) map[o.productName] = []
      map[o.productName].push(o)
    })
    return Object.entries(map).map(([cropName, items]) => {
      const minPrice = Math.min(...items.map((i) => i.offeredPrice || 0))
      const totalQty = items.reduce((s, i) => s + (i.quantity || 0), 0)
      const counterCount = items.filter((i) => i.status === 'countered_by_farmer').length
      return {
        cropName,
        unit: items[0]?.unit || 'kg',
        minPrice,
        totalQty,
        counterCount,
        items,
      }
    })
  }, [visibleOffers])

  const inspectedIndex = visibleOffers.findIndex((o) => o.id === inspectedOfferId)
  const inspectedOffer = inspectedIndex >= 0 ? visibleOffers[inspectedIndex] : null

  const handleAccept = (offer) => {
    setAcceptingOffer(offer)
  }

  const handleConfirmAccept = (options) => {
    if (!acceptingOffer) return
    acceptFarmerCounter(acceptingOffer.id, options)
    const paySummary = options.payNowImmediate
      ? 'Advance payment verified now'
      : options.paymentPreference
    setRecentBanner(
      `Confirmed ${acceptingOffer.productName} from ${acceptingOffer.farmerName} (${acceptingOffer.quantity} ${acceptingOffer.unit} at ₹${acceptingOffer.offeredPrice}/${acceptingOffer.unit} · ${paySummary}).`
    )
    setAcceptingOffer(null)
    setInspectedOfferId(null)
  }

  const handleRevise = (offerId, cleanPrice, cleanQty) => {
    reviseCompanyOffer(offerId, cleanPrice, cleanQty)
    setRecentBanner(`Counteroffer ₹${cleanPrice} sent to farmer and synced live.`)
  }

  const handleWithdraw = (offerId) => {
    withdrawCompanyOffer(offerId)
    setRecentBanner('Offer withdrawn and closed.')
    setInspectedOfferId(null)
  }

  const toggleCropGroup = (cropName) => {
    setCollapsedCrops((prev) => ({ ...prev, [cropName]: !prev[cropName] }))
  }

  const renderDesktopRow = (offer) => {
    const spread = getOfferSpread(offer.offeredPrice, offer.askingPrice)
    const rounds = (offer.history || []).length
    const isCounter = offer.status === 'countered_by_farmer'
    const isHighlighted = offer.id === highlightedOfferId || Boolean(offer.createdAtMs)

    return (
      <tr
        key={offer.id}
        onClick={() => {
          setInspectedOfferId(offer.id)
          if (highlightedOfferId) setSearchParams({})
        }}
        className={`group border-t border-slate-100 first:border-t-0 hover:bg-slate-50/90 transition-colors cursor-pointer ${
          inspectedOfferId === offer.id
            ? 'bg-sky-50/50'
            : isHighlighted
              ? 'bg-emerald-50/40'
              : ''
        }`}
      >
        {/* Crop & Terms */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <ProduceThumb name={offer.productName} size="sm" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="font-serif text-sm font-bold text-slate-900 truncate group-hover:text-[#184828]">
                  {offer.productName}
                </p>
                {offer.createdAtMs && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-[#184828] text-[9.5px] font-bold shrink-0">
                    Just Sent
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 text-[10.5px] text-slate-500">
                <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                  {shortTerms(offer.paymentPreference)}
                </span>
                <span className="truncate">{offer.expiresIn}</span>
              </div>
            </div>
          </div>
        </td>

        {/* Farmer */}
        <td className="px-3 py-3">
          <p className="text-xs font-semibold text-slate-800 whitespace-nowrap">
            {offer.farmerName}
          </p>
          <p className="text-[11px] text-slate-500 whitespace-nowrap">
            {shortDistrict(offer.farmerLocation)}
          </p>
        </td>

        {/* Turn & Round */}
        <td className="px-3 py-3">
          <div className="flex flex-col items-start gap-1">
            <TurnBadge status={offer.status} />
            <span className="text-[10.5px] font-medium text-slate-400">Round {rounds}</span>
          </div>
        </td>

        {/* Rate & Price Spread */}
        <td className="px-3 py-3 whitespace-nowrap">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-slate-900">
              ₹{offer.offeredPrice}/{offer.unit}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded-full border text-[10px] font-semibold ${spread.cls}`}
            >
              {spread.text}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Ask ₹{offer.askingPrice}/{offer.unit}
          </p>
        </td>

        {/* Qty & Deal Value */}
        <td className="px-3 py-3 whitespace-nowrap">
          <p className="text-sm font-bold text-[#184828]">
            {formatINR((offer.offeredPrice || 0) * (offer.quantity || 0))}
          </p>
          <p className="text-[11px] text-slate-500">
            {offer.quantity} {offer.unit}
          </p>
        </td>

        {/* Quick Actions */}
        <td className="px-4 py-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <div className="inline-flex items-center gap-1.5">
            {isCounter && (
              <button
                type="button"
                onClick={() => handleAccept(offer)}
                className="px-2.5 py-1.5 rounded-lg bg-[#184828] hover:bg-[#12391f] text-white text-[11.5px] font-semibold transition-colors cursor-pointer"
              >
                Accept ₹{offer.offeredPrice}
              </button>
            )}
            <button
              type="button"
              onClick={() => setInspectedOfferId(offer.id)}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-[11.5px] font-semibold transition-colors cursor-pointer"
            >
              {offer.status === 'accepted' || offer.status === 'rejected' ? 'View' : 'Negotiate'}
            </button>
          </div>
        </td>
      </tr>
    )
  }

  const renderMobileRow = (offer) => {
    const spread = getOfferSpread(offer.offeredPrice, offer.askingPrice)
    const isCounter = offer.status === 'countered_by_farmer'
    const isHighlighted = offer.id === highlightedOfferId || Boolean(offer.createdAtMs)

    return (
      <div
        key={offer.id}
        onClick={() => {
          setInspectedOfferId(offer.id)
          if (highlightedOfferId) setSearchParams({})
        }}
        className={`p-3.5 hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer space-y-2 ${
          isHighlighted ? 'bg-emerald-50/40' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <ProduceThumb name={offer.productName} size="sm" />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-serif text-sm font-bold text-slate-900 truncate">
                  {offer.productName}
                </h3>
                {offer.createdAtMs && (
                  <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-[#184828] text-[9.5px] font-bold shrink-0">
                    Just Sent
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 truncate">
                {offer.farmerName} · {shortDistrict(offer.farmerLocation)}
              </p>
            </div>
          </div>
          <TurnBadge status={offer.status} />
        </div>

        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-900">
              ₹{offer.offeredPrice}/{offer.unit}
            </span>
            <span className={`px-1.5 py-0.5 rounded-full border text-[10px] font-semibold ${spread.cls}`}>
              {spread.text}
            </span>
          </div>
          <span className="font-semibold text-[#184828]">
            {offer.quantity} {offer.unit} · {formatINR((offer.offeredPrice || 0) * (offer.quantity || 0))}
          </span>
        </div>

        {isCounter && (
          <div className="flex items-center justify-end gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => handleAccept(offer)}
              className="px-3 py-1 rounded-lg bg-[#184828] text-white text-[11px] font-semibold cursor-pointer"
            >
              Accept ₹{offer.offeredPrice}
            </button>
            <button
              type="button"
              onClick={() => setInspectedOfferId(offer.id)}
              className="px-3 py-1 rounded-lg border border-slate-200 bg-white text-slate-700 text-[11px] font-semibold cursor-pointer"
            >
              Counter / View
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="font-serif text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Offers &amp; Negotiations Desk
          </h1>
          <p className="mt-0.5 text-xs text-slate-600">
            Compare bids by crop or discount, triage farmer counteroffers, and lock confirmed orders.
          </p>
        </div>

        <Link
          to="/company/browse"
          className="px-3.5 py-1.5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white text-xs font-semibold self-start transition-colors"
        >
          + New Offer
        </Link>
      </div>

      {/* Confirmation Banner */}
      {recentBanner && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900">
          <span className="font-medium">{recentBanner}</span>
          <div className="flex items-center gap-3">
            <Link to="/company/orders" className="font-bold text-[#184828] underline">
              Go to Orders &amp; Logistics →
            </Link>
            <button
              type="button"
              onClick={() => setRecentBanner('')}
              className="text-emerald-700 hover:text-emerald-950 font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Compact Pipeline KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        <button
          type="button"
          onClick={() => setTab('countered')}
          className="text-left rounded-xl bg-white border border-[#e2e6e1] px-3.5 py-3 hover:border-amber-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Your Turn (Counters)</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <p className="font-serif text-xl font-bold text-slate-900 mt-0.5">{counts.countered}</p>
        </button>

        <button
          type="button"
          onClick={() => setTab('waiting')}
          className="text-left rounded-xl bg-white border border-[#e2e6e1] px-3.5 py-3 hover:border-sky-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Waiting on Farmers</span>
            <span className="w-2 h-2 rounded-full bg-sky-500" />
          </div>
          <p className="font-serif text-xl font-bold text-slate-900 mt-0.5">{counts.waiting}</p>
        </button>

        <div className="rounded-xl bg-white border border-[#e2e6e1] px-3.5 py-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Open Pipeline Value</span>
            <span className="w-2 h-2 rounded-full bg-slate-800" />
          </div>
          <p className="font-serif text-xl font-bold text-slate-900 mt-0.5">
            {formatINR(counts.pipelineValue)}
          </p>
        </div>

        <div className="rounded-xl bg-white border border-[#e2e6e1] px-3.5 py-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500">Avg Rate vs Ask</span>
            <span className="w-2 h-2 rounded-full bg-[#184828]" />
          </div>
          <p className="font-serif text-xl font-bold text-[#184828] mt-0.5">
            {counts.all_open > 0
              ? `${counts.avgPct > 0 ? `+${counts.avgPct}` : counts.avgPct}%`
              : '—'}
          </p>
        </div>
      </div>

      {/* Stage Pills + View Switcher + Filter Toolbar */}
      <div className="bg-white border border-[#e2e6e1] rounded-2xl p-3 sm:p-4 space-y-3 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {TABS.map((t) => {
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

          <div className="inline-flex rounded-xl bg-slate-100 p-0.5 border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              List View
            </button>
            <button
              type="button"
              onClick={() => setViewMode('crop')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                viewMode === 'crop' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              Group by Crop
            </button>
          </div>
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crop, farmer name, or village..."
            className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-[#f8faf8] text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-500"
          />

          <div className="flex flex-wrap gap-2">
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              aria-label="Filter negotiations by crop"
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-500"
            >
              {cropOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              aria-label="Filter negotiations by district"
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-500"
            >
              {KERALA_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort negotiations"
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-slate-500"
            >
              <option value="recent">Sort: Most Recent First</option>
              <option value="priority">Sort: Priority / Your Turn</option>
              <option value="discount">Sort: Biggest Discount (%)</option>
              <option value="price_asc">Sort: Lowest Rate (₹/unit)</option>
              <option value="value_desc">Sort: Highest Value (₹)</option>
              <option value="qty_desc">Sort: Largest Qty</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results View */}
      {visibleOffers.length === 0 ? (
        <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-8 text-center">
          <p className="font-serif text-base font-bold text-slate-900">
            No matching negotiations
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Adjust your crop/district filters above or submit a new offer from Browse Produce.
          </p>
        </div>
      ) : viewMode === 'list' ? (
        <div className="rounded-2xl bg-white border border-[#e2e6e1] overflow-hidden shadow-2xs">
          {/* Desktop High-Density Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-2.5">Produce &amp; Terms</th>
                  <th className="px-3 py-2.5">Farmer</th>
                  <th className="px-3 py-2.5">Turn &amp; Round</th>
                  <th className="px-3 py-2.5">Active Rate vs Ask</th>
                  <th className="px-3 py-2.5">Volume &amp; Value</th>
                  <th className="px-4 py-2.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody>{visibleOffers.map(renderDesktopRow)}</tbody>
            </table>
          </div>

          {/* Mobile Compact List Rows */}
          <div className="md:hidden divide-y divide-slate-100">
            {visibleOffers.map(renderMobileRow)}
          </div>
        </div>
      ) : (
        /* Group by Crop Accordion Mode */
        <div className="space-y-3">
          {groupedByCrop.map((group) => {
            const isCollapsed = !!collapsedCrops[group.cropName]
            return (
              <section
                key={group.cropName}
                className="rounded-2xl bg-white border border-[#e2e6e1] overflow-hidden shadow-2xs"
              >
                <button
                  type="button"
                  onClick={() => toggleCropGroup(group.cropName)}
                  className="w-full px-4 py-3 bg-[#f8faf8] hover:bg-slate-100/70 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <ProduceThumb name={group.cropName} size="sm" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-serif text-base font-bold text-slate-900 truncate">
                          {group.cropName}
                        </h2>
                        <span className="px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700 text-[10.5px] font-bold">
                          {group.items.length} {group.items.length === 1 ? 'bid' : 'bids'}
                        </span>
                        {group.counterCount > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10.5px] font-bold">
                            {group.counterCount} your turn
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Best active rate: <strong className="text-[#184828]">₹{group.minPrice}/{group.unit}</strong> · Total volume: {group.totalQty} {group.unit}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-slate-500">
                    {isCollapsed ? 'Expand ▾' : 'Collapse ▴'}
                  </span>
                </button>

                {!isCollapsed && (
                  <>
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <tbody>{group.items.map(renderDesktopRow)}</tbody>
                      </table>
                    </div>
                    <div className="md:hidden divide-y divide-slate-100">
                      {group.items.map(renderMobileRow)}
                    </div>
                  </>
                )}
              </section>
            )
          })}
        </div>
      )}

      {/* Slide-Over Deal Inspector Drawer */}
      {inspectedOffer && (
        <CompanyDealDrawer
          key={inspectedOffer.id}
          offer={inspectedOffer}
          activeIndex={inspectedIndex}
          totalCount={visibleOffers.length}
          onPrev={() => {
            if (inspectedIndex > 0) setInspectedOfferId(visibleOffers[inspectedIndex - 1].id)
          }}
          onNext={() => {
            if (inspectedIndex < visibleOffers.length - 1) {
              setInspectedOfferId(visibleOffers[inspectedIndex + 1].id)
            }
          }}
          onClose={() => setInspectedOfferId(null)}
          onAccept={handleAccept}
          onRevise={handleRevise}
          onWithdraw={handleWithdraw}
        />
      )}

      {acceptingOffer && (
        <AcceptOfferModal
          key={acceptingOffer.id}
          offer={acceptingOffer}
          role="company"
          onClose={() => setAcceptingOffer(null)}
          onConfirm={handleConfirmAccept}
        />
      )}
    </div>
  )
}
