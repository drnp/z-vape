import React from 'react'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import { getCurrentUser } from '@/lib/auth'
import { CheckoutForm } from './CheckoutForm'

interface PageProps {
  searchParams: Promise<{ buy_now?: string; qty?: string }>
}

function getImageUrl(product: { images?: { image?: string | { url?: string | null } | null }[] | null }): string | null {
  const first = product.images?.[0]?.image
  if (first && typeof first === 'object' && 'url' in first) {
    return first.url ?? null
  }
  return null
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const user = await getCurrentUser()

  if (!user) {
    const target = sp.buy_now
      ? `/checkout?buy_now=${encodeURIComponent(sp.buy_now)}${sp.qty ? `&qty=${encodeURIComponent(sp.qty)}` : ''}`
      : '/checkout'
    redirect(`/login?redirect=${encodeURIComponent(target)}`)
  }

  let buyNowItem: { productId: string; name: string; price: number; quantity: number; imageUrl: string | null } | null = null

  if (sp.buy_now) {
    const payload = await getPayload({ config })
    const requestedQty = Math.max(1, parseInt(sp.qty ?? '1', 10) || 1)

    try {
      const product = await payload.findByID({
        collection: 'products',
        id: sp.buy_now,
        depth: 1,
      })

      const stock = product?.stock ?? 0
      if (product && product.status === 'active' && stock > 0) {
        buyNowItem = {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: Math.min(requestedQty, stock),
          imageUrl: getImageUrl(product),
        }
      } else {
        redirect('/products')
      }
    } catch {
      redirect('/products')
    }
  }

  return (
    <CheckoutForm
      buyNowItem={buyNowItem}
      prefill={{
        name: user.name ?? null,
        phone: user.phone ?? null,
        line1: user.shippingAddress?.line1 ?? null,
        line2: user.shippingAddress?.line2 ?? null,
        city: user.shippingAddress?.city ?? null,
        state: user.shippingAddress?.state ?? null,
        postcode: user.shippingAddress?.postcode ?? null,
      }}
    />
  )
}
