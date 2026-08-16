'use server'

import { getPayloadInstance, getCurrentUser } from '@/lib/auth'
import { computeShipping } from '@/lib/shipping'

const AU_STATES = ['NSW', 'VIC', 'QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'] as const

export interface OrderLineInput {
  productId: string
  quantity: number
}

export interface ShippingAddressInput {
  name: string
  phone?: string
  line1: string
  line2?: string
  city: string
  state?: string
  postcode: string
}

export interface CreateOrderInput {
  items: OrderLineInput[]
  shippingAddress: ShippingAddressInput
  notes?: string
}

export interface CreateOrderResult {
  ok: boolean
  orderId?: string
  orderNumber?: string
  error?: string
}

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `ZV-${ts}-${rand}`
}

export async function createOrderAction(
  input: CreateOrderInput
): Promise<CreateOrderResult> {
  const user = await getCurrentUser()
  if (!user) {
    return { ok: false, error: 'You must be logged in to place an order.' }
  }

  const items = input.items ?? []
  if (items.length === 0) {
    return { ok: false, error: 'Your order is empty.' }
  }

  const addr = input.shippingAddress
  if (!addr?.name?.trim() || !addr?.line1?.trim() || !addr?.city?.trim() || !addr?.postcode?.trim()) {
    return { ok: false, error: 'Please complete your shipping address.' }
  }

  if (addr.state && !(AU_STATES as readonly string[]).includes(addr.state)) {
    return { ok: false, error: 'Invalid state.' }
  }

  const payload = await getPayloadInstance()

  const resolvedItems: { product: string; quantity: number; unitPrice: number }[] = []
  const stockUpdates: { id: string; stock: number }[] = []

  for (const line of items) {
    if (!line?.productId || !line?.quantity || line.quantity < 1) {
      return { ok: false, error: 'Invalid order item.' }
    }

    let product
    try {
      product = await payload.findByID({
        collection: 'products',
        id: line.productId,
        depth: 0,
      })
    } catch {
      product = null
    }

    if (!product || product.status !== 'active') {
      return { ok: false, error: 'A product in your order is no longer available.' }
    }

    if ((product.stock ?? 0) < line.quantity) {
      return {
        ok: false,
        error: `"${product.name}" only has ${product.stock} in stock.`,
      }
    }

    resolvedItems.push({
      product: product.id,
      quantity: line.quantity,
      unitPrice: product.price,
    })

    stockUpdates.push({
      id: product.id,
      stock: Math.max(0, (product.stock ?? 0) - line.quantity),
    })
  }

  const subtotal = resolvedItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
  const shipping = computeShipping(subtotal)
  const total = subtotal + shipping

  let order
  try {
    order = await payload.create({
      collection: 'orders',
      data: {
        orderNumber: generateOrderNumber(),
        customer: user.id,
        items: resolvedItems,
        subtotal,
        shipping,
        total,
        status: 'pending',
        shippingAddress: {
          name: addr.name.trim(),
          phone: addr.phone?.trim() || undefined,
          line1: addr.line1.trim(),
          line2: addr.line2?.trim() || undefined,
          city: addr.city.trim(),
          state: addr.state as (typeof AU_STATES)[number],
          postcode: addr.postcode.trim(),
        },
        notes: input.notes?.trim() || undefined,
        ageVerified: true,
      },
      req: { user },
    })
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Failed to create order.',
    }
  }

  for (const update of stockUpdates) {
    try {
      await payload.update({
        collection: 'products',
        id: update.id,
        data: { stock: update.stock },
      })
    } catch {
      // Best-effort display decrement — stock is not critical here.
    }
  }

  return {
    ok: true,
    orderId: order.id,
    orderNumber: order.orderNumber,
  }
}
