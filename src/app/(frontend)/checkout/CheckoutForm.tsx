'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronRight, Lock, ShoppingBag } from 'lucide-react'
import { useCart } from '../components/CartContext'
import { computeShipping, FREE_SHIPPING_THRESHOLD } from '@/lib/shipping'
import { createOrderAction } from '../actions/orders'

interface CheckoutLine {
  productId: string
  name: string
  price: number
  quantity: number
  imageUrl: string | null
}

interface CheckoutFormProps {
  buyNowItem?: CheckoutLine | null
  prefill?: {
    name?: string | null
    phone?: string | null
    line1?: string | null
    line2?: string | null
    city?: string | null
    state?: string | null
    postcode?: string | null
  }
}

const AU_STATES = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'] as const

const inputClass =
  'w-full h-12 px-4 bg-transparent border border-border text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-gold transition-colors rounded-sm'

export function CheckoutForm({ buyNowItem, prefill }: CheckoutFormProps) {
  const router = useRouter()
  const { items: cartItems, clearCart } = useCart()

  const lines: CheckoutLine[] = buyNowItem
    ? [buyNowItem]
    : cartItems.map((i) => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        imageUrl: i.imageUrl,
      }))

  const [name, setName] = useState(prefill?.name ?? '')
  const [phone, setPhone] = useState(prefill?.phone ?? '')
  const [line1, setLine1] = useState(prefill?.line1 ?? '')
  const [line2, setLine2] = useState(prefill?.line2 ?? '')
  const [city, setCity] = useState(prefill?.city ?? '')
  const [state, setState] = useState(prefill?.state ?? '')
  const [postcode, setPostcode] = useState(prefill?.postcode ?? '')
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (lines.length === 0) {
    return (
      <div className="section-padding py-16 md:py-24 flex flex-col items-center gap-6 text-center">
        <ShoppingBag size={48} className="text-text-muted" />
        <h1 className="font-heading text-3xl md:text-4xl">Checkout</h1>
        <p className="text-text-secondary max-w-md">
          There is nothing to check out. Browse our collection to find your next favourite.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center gap-2 h-[48px] px-8 rounded-full text-sm font-semibold tracking-[0.1em] uppercase text-black hover:opacity-80 transition-opacity"
          style={{ background: '#daa34a' }}
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0)
  const shipping = computeShipping(subtotal)
  const total = subtotal + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!ageConfirmed) {
      setError('You must confirm you are 18 or older to place an order.')
      return
    }

    setSubmitting(true)
    const result = await createOrderAction({
      items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
      shippingAddress: {
        name,
        phone: phone || undefined,
        line1,
        line2: line2 || undefined,
        city,
        state: state || undefined,
        postcode,
      },
    })
    setSubmitting(false)

    if (!result.ok) {
      setError(result.error ?? 'Failed to place order.')
      return
    }

    if (!buyNowItem) clearCart()
    router.push(`/order/${result.orderId}`)
  }

  return (
    <div className="section-padding py-8 md:py-12">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-text-muted mb-6">
        <Link href="/" className="hover:text-gold transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        {buyNowItem ? (
          <span className="text-text-primary truncate min-w-0">Checkout</span>
        ) : (
          <>
            <Link href="/cart" className="hover:text-gold transition-colors">
              Cart
            </Link>
            <ChevronRight size={12} />
            <span className="text-text-primary truncate min-w-0">Checkout</span>
          </>
        )}
      </nav>

      <h1 className="font-heading text-3xl md:text-4xl mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 lg:gap-12 items-start">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="font-heading text-xl mb-5">Shipping Address</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-text-secondary text-xs tracking-[0.15em] uppercase mb-2">
                  Full Name
                </label>
                <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className="block text-text-secondary text-xs tracking-[0.15em] uppercase mb-2">
                  Phone
                </label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-text-secondary text-xs tracking-[0.15em] uppercase mb-2">
                  Postcode
                </label>
                <input value={postcode} onChange={(e) => setPostcode(e.target.value)} className={inputClass} required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-text-secondary text-xs tracking-[0.15em] uppercase mb-2">
                  Address Line 1
                </label>
                <input value={line1} onChange={(e) => setLine1(e.target.value)} className={inputClass} required />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-text-secondary text-xs tracking-[0.15em] uppercase mb-2">
                  Address Line 2
                </label>
                <input value={line2} onChange={(e) => setLine2(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-text-secondary text-xs tracking-[0.15em] uppercase mb-2">
                  City
                </label>
                <input value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className="block text-text-secondary text-xs tracking-[0.15em] uppercase mb-2">
                  State
                </label>
                <select value={state} onChange={(e) => setState(e.target.value)} className={inputClass}>
                  <option value="">Select state</option>
                  {AU_STATES.map((s) => (
                    <option key={s} value={s} className="bg-bg-surface">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="border-t border-border pt-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-1 h-4 w-4 accent-[#daa34a]"
              />
              <span className="text-sm text-text-secondary leading-relaxed">
                I confirm that I am 18 years of age or older. I am aware that these products contain
                nicotine, which is an addictive chemical.
              </span>
            </label>
          </section>

          <p className="text-text-muted text-xs flex items-center gap-2">
            <Lock size={12} />
            Payment is confirmed offline. Your order will be created and our team will contact you to
            arrange payment.
          </p>
        </div>

        <aside className="bg-bg-surface border border-border rounded-lg p-6 flex flex-col gap-5 lg:sticky lg:top-32">
          <h2 className="font-heading text-xl">Order Summary</h2>

          <div className="flex flex-col gap-4">
            {lines.map((l) => (
              <div key={l.productId} className="flex gap-3">
                <div className="shrink-0 w-14 h-14 bg-bg border border-border overflow-hidden flex items-center justify-center">
                  {l.imageUrl ? (
                    <img src={l.imageUrl} alt={l.name} className="h-full w-full object-cover" />
                  ) : (
                    <ShoppingBag size={16} className="text-text-muted" />
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-center min-w-0">
                  <span className="text-text-primary text-sm truncate">{l.name}</span>
                  <span className="text-text-muted text-xs">Qty {l.quantity}</span>
                </div>
                <span className="text-text-primary text-sm tabular-nums shrink-0">
                  ${(l.price * l.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 text-sm border-t border-border pt-4">
            <div className="flex items-center justify-between text-text-secondary">
              <span>Subtotal</span>
              <span className="tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-text-secondary">
              <span>Shipping</span>
              {shipping === 0 ? (
                <span className="text-green-400">FREE</span>
              ) : (
                <span className="tabular-nums">${shipping.toFixed(2)}</span>
              )}
            </div>
            {shipping > 0 && (
              <p className="text-text-muted text-xs">
                Free shipping on orders over ${FREE_SHIPPING_THRESHOLD.toFixed(0)}.
              </p>
            )}
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="text-text-primary font-medium">Total</span>
              <span className="text-gold text-xl font-semibold tabular-nums">
                ${total.toFixed(2)}
              </span>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 h-[56px] rounded-full text-sm font-semibold tracking-[0.1em] uppercase text-white hover:opacity-80 disabled:opacity-50 transition-opacity"
            style={{ background: '#daa34a' }}
          >
            {submitting ? 'Placing order…' : 'Confirm Payment'}
          </button>
        </aside>
      </form>
    </div>
  )
}
