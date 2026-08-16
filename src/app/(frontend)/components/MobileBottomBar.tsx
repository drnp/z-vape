'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Minus, Plus, ShoppingBag, Zap, Check } from 'lucide-react'
import type { Product } from '@/payload-types'
import { useCart } from './CartContext'

interface MobileBottomBarProps {
  product: Product
}

function getImageUrl(product: Product): string | null {
  const first = product.images?.[0]?.image
  if (first && typeof first === 'object' && 'url' in first) {
    return first.url ?? null
  }
  return null
}

export function MobileBottomBar({ product }: MobileBottomBarProps) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const router = useRouter()

  const inStock = (product.stock ?? 0) > 0
  const maxQty = product.stock ?? 99

  const decrement = () => setQuantity((q) => Math.max(1, q - 1))
  const increment = () => setQuantity((q) => Math.min(maxQty, q + 1))

  const cartItem = {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    imageUrl: getImageUrl(product),
  }

  const handleAddToCart = () => {
    if (!inStock) return
    addItem(cartItem, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    setQuantity(1)
  }

  const handleBuyNow = () => {
    if (!inStock) return
    router.push(`/checkout?buy_now=${product.id}&qty=${quantity}`)
  }

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg-surface border-t border-border px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-border rounded-sm flex-shrink-0">
          <button
            onClick={decrement}
            disabled={!inStock || quantity <= 1}
            className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-gold transition-colors disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="w-8 text-center text-sm font-medium tabular-nums text-text-primary">
            {quantity}
          </span>
          <button
            onClick={increment}
            disabled={!inStock || quantity >= maxQty}
            className="w-8 h-8 flex items-center justify-center text-text-secondary hover:text-gold transition-colors disabled:opacity-30"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>

        <span className="text-gold font-semibold text-sm flex-shrink-0">
          ${(product.price * quantity).toFixed(2)}
        </span>

        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full text-xs font-semibold tracking-[0.05em] uppercase transition-opacity duration-300 text-white ${
            added
              ? ''
              : inStock
                ? 'active:opacity-80'
                : 'text-text-muted border border-border'
          }`}
          style={
            added
              ? { background: '#16a34a' }
              : inStock
                ? { background: '#daa34a' }
                : { background: 'transparent' }
          }
        >
          {added ? (
            <>
              <Check size={14} />
              Added
            </>
          ) : (
            <>
              <ShoppingBag size={14} />
              Cart
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={!inStock}
          className={`inline-flex items-center justify-center gap-1.5 px-4 py-3 rounded-full text-xs font-semibold tracking-[0.05em] uppercase transition-opacity duration-300 text-white ${
            inStock
              ? 'active:opacity-80'
              : 'text-text-muted border border-border'
          }`}
          style={inStock ? { background: '#0ea5e9' } : { background: 'transparent' }}
        >
          <Zap size={14} />
          Buy Now
        </button>
      </div>
    </div>
  )
}
