import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFarmer } from '../context/farmerContextStore'
import { formatINR, KERALA_CROPS, QUALITY_GRADES, UNIT_OPTIONS } from './farmerData'

function resizeImageToDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const maxWidth = 560
        const scale = Math.min(1, maxWidth / img.width)
        const canvas = document.createElement('canvas')
        canvas.width = Math.round(img.width * scale)
        canvas.height = Math.round(img.height * scale)
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve('')
          return
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.78))
      }
      img.onerror = () => resolve('')
      img.src = String(reader.result)
    }
    reader.onerror = () => resolve('')
    reader.readAsDataURL(file)
  })
}

export default function AddListing() {
  const { profile, addListing } = useFarmer()
  const navigate = useNavigate()

  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({
    type: 'Ready Stock',
    productName: '',
    quantity: '',
    unit: 'kg',
    askingPrice: '',
    grade: QUALITY_GRADES[0],
    harvestDate: today,
    availableFrom: today,
    location: profile.village ? `${profile.village}, ${profile.district}` : profile.district,
    notes: '',
    images: [],
  })

  const [errors, setErrors] = useState({})
  const [hasCustomPhotos, setHasCustomPhotos] = useState(false)

  const handleField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleSelectCrop = (crop) => {
    setForm((prev) => ({
      ...prev,
      productName: crop.name,
      unit: crop.unit,
      askingPrice: String(crop.suggestedPrice),
      images: hasCustomPhotos ? prev.images : crop.defaultImages || [],
    }))
    setErrors((prev) => ({ ...prev, productName: '', askingPrice: '' }))
  }

  const handleImagesUpload = async (e) => {
    const files = Array.from(e.target.files || []).slice(0, 5)
    if (files.length === 0) return

    const converted = await Promise.all(files.map(resizeImageToDataUrl))
    const valid = converted.filter(Boolean)
    if (valid.length > 0) {
      setHasCustomPhotos(true)
      setForm((prev) => ({
        ...prev,
        images: hasCustomPhotos ? [...prev.images, ...valid].slice(0, 5) : valid,
      }))
    }
    e.target.value = ''
  }

  const removeImageAt = (idx) => {
    setForm((prev) => {
      const next = prev.images.filter((_, i) => i !== idx)
      if (next.length === 0) setHasCustomPhotos(false)
      return { ...prev, images: next }
    })
  }

  const validate = () => {
    const next = {}
    if (!form.productName.trim()) next.productName = 'Please enter or pick a produce name.'
    if (!form.quantity || Number(form.quantity) <= 0) next.quantity = 'Enter a valid quantity.'
    if (!form.askingPrice || Number(form.askingPrice) <= 0) next.askingPrice = 'Enter your expected price.'
    if (!form.location.trim()) next.location = 'Please specify your farm location.'
    return next
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    addListing(form)
    navigate('/farmers/listings', { state: { createdName: form.productName.trim() } })
  }

  const estimatedTotal = (Number(form.quantity) || 0) * (Number(form.askingPrice) || 0)

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#143e22]">
          Add New Produce Listing
        </h1>
        <p className="mt-0.5 text-xs text-[#5e7160]">
          Publish available stock or an upcoming harvest with photos so the company can send offers.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-2xl bg-[#fffdf8] border border-[#e5dcbd] p-4 sm:p-5 shadow-2xs space-y-4"
      >
        {/* Listing Type Switcher */}
        <div>
          <span className="block text-xs font-semibold text-[#143e22] mb-1.5">Stock Availability Type</span>
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#f3ede0] border border-[#e3d9c3]">
            {['Ready Stock', 'Upcoming Harvest'].map((type) => {
              const active = form.type === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleField('type', type)}
                  className={`py-1.5 px-3 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    active ? 'bg-[#184828] text-white shadow-xs' : 'text-[#465a48] hover:text-[#143e22]'
                  }`}
                >
                  {type}
                </button>
              )
            })}
          </div>
        </div>

        {/* Quick Crop Suggestions */}
        <div>
          <span className="block text-xs font-semibold text-[#143e22] mb-1.5">Quick Select Vegetable</span>
          <div className="flex flex-wrap gap-1.5">
            {KERALA_CROPS.map((crop) => {
              const selected = form.productName === crop.name
              return (
                <button
                  key={crop.name}
                  type="button"
                  onClick={() => handleSelectCrop(crop)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                    selected
                      ? 'bg-[#184828] text-white border-[#184828]'
                      : 'bg-[#fbf8f1] text-[#2a3c2c] border-[#dfd5be] hover:border-[#184828]'
                  }`}
                >
                  {crop.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Produce Name & Quality */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label htmlFor="produce-name" className="block text-xs font-semibold text-[#143e22] mb-1">
              Product / Vegetable Name
            </label>
            <input
              id="produce-name"
              type="text"
              value={form.productName}
              onChange={(e) => handleField('productName', e.target.value)}
              placeholder="e.g., Country Red Tomatoes"
              className="w-full rounded-xl border border-[#dcd2b8] bg-[#fbf8f1]/80 focus:bg-white focus:border-[#184828] px-3 py-2 text-base sm:text-sm text-[#143e22] focus:outline-none"
            />
            {errors.productName && <p className="mt-1 text-xs text-[#b91c1c]">{errors.productName}</p>}
          </div>

          <div>
            <label htmlFor="produce-grade" className="block text-xs font-semibold text-[#143e22] mb-1">
              Quality Grade
            </label>
            <select
              id="produce-grade"
              value={form.grade}
              onChange={(e) => handleField('grade', e.target.value)}
              className="w-full rounded-xl border border-[#dcd2b8] bg-[#fbf8f1]/80 focus:bg-white focus:border-[#184828] px-3 py-2 text-base sm:text-sm text-[#143e22] focus:outline-none"
            >
              {QUALITY_GRADES.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quantity, Unit & Asking Price */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
          <div>
            <label htmlFor="produce-qty" className="block text-xs font-semibold text-[#143e22] mb-1">
              Quantity
            </label>
            <input
              id="produce-qty"
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => handleField('quantity', e.target.value)}
              placeholder="100"
              className="w-full rounded-xl border border-[#dcd2b8] bg-[#fbf8f1]/80 focus:bg-white focus:border-[#184828] px-3 py-2 text-base sm:text-sm text-[#143e22] focus:outline-none"
            />
            {errors.quantity && <p className="mt-1 text-xs text-[#b91c1c]">{errors.quantity}</p>}
          </div>

          <div>
            <label htmlFor="produce-unit" className="block text-xs font-semibold text-[#143e22] mb-1">
              Unit
            </label>
            <select
              id="produce-unit"
              value={form.unit}
              onChange={(e) => handleField('unit', e.target.value)}
              className="w-full rounded-xl border border-[#dcd2b8] bg-[#fbf8f1]/80 focus:bg-white focus:border-[#184828] px-3 py-2 text-base sm:text-sm text-[#143e22] focus:outline-none"
            >
              {UNIT_OPTIONS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="produce-price" className="block text-xs font-semibold text-[#143e22] mb-1">
              Price (₹/{form.unit})
            </label>
            <input
              id="produce-price"
              type="number"
              min="1"
              value={form.askingPrice}
              onChange={(e) => handleField('askingPrice', e.target.value)}
              placeholder="45"
              className="w-full rounded-xl border border-[#dcd2b8] bg-[#fbf8f1]/80 focus:bg-white focus:border-[#184828] px-3 py-2 text-base sm:text-sm text-[#143e22] focus:outline-none"
            />
            {errors.askingPrice && <p className="mt-1 text-xs text-[#b91c1c]">{errors.askingPrice}</p>}
          </div>
        </div>

        {estimatedTotal > 0 && (
          <div className="rounded-xl bg-[#eef7e9] border border-[#c6e1bc] px-3.5 py-2 flex items-center justify-between text-xs sm:text-sm">
            <span className="font-medium text-[#2c4a31]">Estimated Batch Asking Value</span>
            <span className="font-serif font-bold text-base text-[#143e22]">
              {formatINR(estimatedTotal)}
            </span>
          </div>
        )}

        {/* Dates & Farm Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label htmlFor="harvest-date" className="block text-xs font-semibold text-[#143e22] mb-1">
              {form.type === 'Upcoming Harvest' ? 'Expected Harvest' : 'Harvest Date'}
            </label>
            <input
              id="harvest-date"
              type="date"
              value={form.harvestDate}
              onChange={(e) => handleField('harvestDate', e.target.value)}
              className="w-full rounded-xl border border-[#dcd2b8] bg-[#fbf8f1]/80 focus:bg-white focus:border-[#184828] px-3 py-2 text-base sm:text-sm text-[#143e22] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="available-date" className="block text-xs font-semibold text-[#143e22] mb-1">
              Available From
            </label>
            <input
              id="available-date"
              type="date"
              value={form.availableFrom}
              onChange={(e) => handleField('availableFrom', e.target.value)}
              className="w-full rounded-xl border border-[#dcd2b8] bg-[#fbf8f1]/80 focus:bg-white focus:border-[#184828] px-3 py-2 text-base sm:text-sm text-[#143e22] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="farm-location" className="block text-xs font-semibold text-[#143e22] mb-1">
              Farm Location
            </label>
            <input
              id="farm-location"
              type="text"
              value={form.location}
              onChange={(e) => handleField('location', e.target.value)}
              placeholder="Village, District"
              className="w-full rounded-xl border border-[#dcd2b8] bg-[#fbf8f1]/80 focus:bg-white focus:border-[#184828] px-3 py-2 text-base sm:text-sm text-[#143e22] focus:outline-none"
            />
            {errors.location && <p className="mt-1 text-xs text-[#b91c1c]">{errors.location}</p>}
          </div>
        </div>

        {/* Multi-Photo Upload Strip */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-[#143e22]">
              Produce Photos (up to 5, swipeable on card)
            </span>
            <span className="text-[11px] text-[#5e7160]">{form.images.length}/5 added</span>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
            {form.images.map((src, idx) => (
              <div
                key={`${src.slice(0, 32)}-${idx}`}
                className="relative w-16 h-16 rounded-xl border border-[#dcd2b8] overflow-hidden shrink-0 bg-[#ebe4d3]"
              >
                <img src={src} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeImageAt(idx)}
                  aria-label={`Remove photo ${idx + 1}`}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/65 text-white text-[10px] font-bold flex items-center justify-center cursor-pointer"
                >
                  ×
                </button>
              </div>
            ))}

            {form.images.length < 5 && (
              <label
                htmlFor="produce-photos"
                className="w-24 h-16 rounded-xl border border-dashed border-[#c9be9e] bg-[#fbf8f1] hover:border-[#184828] flex flex-col items-center justify-center text-center cursor-pointer shrink-0 transition-colors"
              >
                <svg className="w-4 h-4 text-[#184828]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="text-[10.5px] font-semibold text-[#184828] mt-0.5">Add Photos</span>
                <input
                  id="produce-photos"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="produce-notes" className="block text-xs font-semibold text-[#143e22] mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="produce-notes"
            rows={2}
            value={form.notes}
            onChange={(e) => handleField('notes', e.target.value)}
            placeholder="Packaging details, morning harvest time, organic practices..."
            className="w-full rounded-xl border border-[#dcd2b8] bg-[#fbf8f1]/80 focus:bg-white focus:border-[#184828] px-3 py-2 text-base sm:text-sm text-[#143e22] focus:outline-none resize-none"
          />
        </div>

        {/* Submit Actions */}
        <div className="pt-1 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('/farmers/listings')}
            className="py-2 px-4 rounded-xl border border-[#dcd2b8] bg-[#fbf8f1] hover:bg-[#f2ebdb] text-[#143e22] font-semibold text-sm transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-5 rounded-xl bg-[#184828] hover:bg-[#12391f] text-white font-semibold text-sm shadow-sm transition-colors cursor-pointer"
          >
            Publish Produce Listing
          </button>
        </div>
      </form>
    </div>
  )
}
