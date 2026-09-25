'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Minus, Plus, ShoppingBag, Check, Zap } from 'lucide-react'
import type { Product } from '@/payload-types'
import { getProductImageUrl } from '@/lib/media'
import { useCart } from './CartContext'

interface AddToCartProps {
  product: Product
}

export function AddToCart({ product }: AddToCartProps) {
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
    imageUrl: getProductImageUrl(product, 'thumbnail'),
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <label className="text-text-secondary text-xs tracking-[0.15em] uppercase">
          Quantity
        </label>
        <div className="flex items-center border border-border rounded-sm">
          <button
            onClick={decrement}
            disabled={!inStock || quantity <= 1}
            className="p-2.5 text-text-secondary hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Decrease quantity"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center text-sm font-medium tabular-nums text-text-primary">
            {quantity}
          </span>
          <button
            onClick={increment}
            disabled={!inStock || quantity >= maxQty}
            className="p-2.5 text-text-secondary hover:text-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Increase quantity"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className={`inline-flex items-center justify-center gap-2 w-60 h-15 rounded-full text-sm font-semibold tracking-widest uppercase transition-opacity duration-300 text-white ${
            added
              ? ''
              : inStock
                ? 'hover:opacity-80'
                : 'text-text-muted cursor-not-allowed border border-border'
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
              <Check size={16} />
              Added
            </>
          ) : (
            <>
              <ShoppingBag size={16} />
              Add to Cart
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={!inStock}
          className={`inline-flex items-center justify-center gap-2 w-60 h-15 rounded-full text-sm font-semibold tracking-widest uppercase transition-opacity duration-300 text-white ${
            inStock
              ? 'hover:opacity-80'
              : 'text-text-muted cursor-not-allowed border border-border'
          }`}
          style={inStock ? { background: '#0ea5e9' } : { background: 'transparent' }}
        >
          <Zap size={16} />
          Buy Now
        </button>
      </div>
    </div>
  )
}
