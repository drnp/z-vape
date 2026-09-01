import React from 'react'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/lib/auth'
import { getMediaUrl } from '@/lib/media'
import type { Order } from '@/payload-types'

interface PageProps {
  params: Promise<{ id: string }>
}

function productImageUrl(order: Order, itemIndex: number): string | null {
  const item = order.items?.[itemIndex]
  const product = item?.product
  if (product && typeof product === 'object') {
    const first = (product as { images?: { image?: unknown }[] }).images?.[0]?.image
    return getMediaUrl(first as never, 'thumbnail')
  }
  return null
}

function productName(order: Order, itemIndex: number): string {
  const item = order.items?.[itemIndex]
  const product = item?.product
  if (product && typeof product === 'object' && 'name' in product) {
    return product.name
  }
  return 'Product'
}

export const dynamic = 'force-dynamic'

export default async function OrderPage({ params }: PageProps) {
  const { id } = await params
  const user = await getCurrentUser()

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/order/${id}`)}`)
  }

  const payload = await getPayload({ config })

  let order: Order | null = null
  try {
    order = (await payload.findByID({
      collection: 'orders',
      id,
      depth: 2,
      overrideAccess: true,
    })) as Order | null
  } catch {
    order = null
  }

  if (!order) notFound()

  const ownerId =
    order.customer && typeof order.customer === 'object'
      ? order.customer.id
      : order.customer

  const isOwner = typeof ownerId === 'string' && ownerId === user.id
  const isAdmin = Boolean(user.roles?.includes('admin'))

  if (!isOwner && !isAdmin) notFound()

  const addr = order.shippingAddress

  return (
    <div className="section-padding py-10 md:py-16">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-text-muted mb-6">
        <Link href="/" className="hover:text-gold transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="text-text-primary truncate min-w-0">Order Confirmation</span>
      </nav>

      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center text-center gap-4 mb-10">
          <CheckCircle2 size={56} className="text-green-400" />
          <h1 className="font-heading text-3xl md:text-4xl">Thank You</h1>
          <p className="text-text-secondary max-w-md">
            Your order has been received. Our team will contact you to confirm and arrange payment.
          </p>
          <p className="text-text-muted text-sm">
            Order Number:{' '}
            <span className="text-gold font-semibold">{order.orderNumber}</span>
          </p>
        </div>

        <div className="bg-bg-surface border border-border rounded-lg divide-y divide-border">
          {order.items.map((item, i) => (
            <div key={item.id ?? i} className="flex gap-4 p-5">
              <div className="shrink-0 w-16 h-16 bg-bg border border-border overflow-hidden flex items-center justify-center">
                {productImageUrl(order, i) ? (
                  <img
                    src={productImageUrl(order, i) ?? ''}
                    alt={productName(order, i)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ShoppingBag size={18} className="text-text-muted" />
                )}
              </div>
              <div className="flex flex-1 items-center justify-between gap-4">
                <div>
                  <p className="text-text-primary text-sm font-medium">{productName(order, i)}</p>
                  <p className="text-text-muted text-xs">Qty {item.quantity}</p>
                </div>
                <span className="text-text-primary text-sm tabular-nums">
                  ${(item.unitPrice * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-bg-surface border border-border rounded-lg p-6 mt-4 flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between text-text-secondary">
            <span>Subtotal</span>
            <span className="tabular-nums">${(order.subtotal ?? 0).toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-text-secondary">
            <span>Shipping</span>
            {order.shipping === 0 ? (
              <span className="text-green-400">FREE</span>
            ) : (
              <span className="tabular-nums">${(order.shipping ?? 0).toFixed(2)}</span>
            )}
          </div>
          <div className="border-t border-border pt-3 flex items-center justify-between">
            <span className="text-text-primary font-medium">Total</span>
            <span className="text-gold text-xl font-semibold tabular-nums">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>

        {addr && (
          <div className="bg-bg-surface border border-border rounded-lg p-6 mt-4">
            <h2 className="font-heading text-lg mb-3">Shipping To</h2>
            <p className="text-text-primary text-sm">{addr.name}</p>
            {addr.phone && <p className="text-text-secondary text-sm">{addr.phone}</p>}
            <p className="text-text-secondary text-sm">
              {addr.line1}
              {addr.line2 ? `, ${addr.line2}` : ''}
            </p>
            <p className="text-text-secondary text-sm">
              {addr.city}
              {addr.state ? ` ${addr.state}` : ''} {addr.postcode}
            </p>
          </div>
        )}

        <div className="flex justify-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 h-[48px] px-8 rounded-full text-sm font-semibold tracking-[0.1em] uppercase text-black hover:opacity-80 transition-opacity"
            style={{ background: '#daa34a' }}
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
