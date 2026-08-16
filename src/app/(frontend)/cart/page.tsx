'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronRight, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../components/CartContext'

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="section-padding py-16 md:py-24 flex flex-col items-center gap-6 text-center">
        <ShoppingBag size={48} className="text-text-muted" />
        <h1 className="font-heading text-3xl md:text-4xl">Your Cart</h1>
        <p className="text-text-secondary max-w-md">
          Your cart is currently empty. Browse our collection to find your next favourite.
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

  return (
    <div className="section-padding py-8 md:py-12">
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-6">
        <Link href="/" className="hover:text-gold transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="text-text-primary">Cart</span>
      </nav>

      <h1 className="font-heading text-3xl md:text-4xl mb-8">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start">
        <div className="flex flex-col divide-y divide-border border-t border-b border-border">
          {items.map((item) => (
            <div key={item.productId} className="flex gap-4 py-5">
              <Link
                href={`/products/${item.slug}`}
                className="shrink-0 w-20 h-20 md:w-24 md:h-24 bg-bg-surface border border-border overflow-hidden flex items-center justify-center"
              >
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                ) : (
                  <ShoppingBag size={20} className="text-text-muted" />
                )}
              </Link>

              <div className="flex flex-1 flex-col gap-2 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/products/${item.slug}`}
                    className="text-text-primary text-sm md:text-base font-medium hover:text-gold transition-colors"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => removeItem(item.productId)}
                    aria-label={`Remove ${item.name}`}
                    className="text-text-muted hover:text-red-400 transition-colors shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center justify-between gap-4 mt-auto">
                  <div className="flex items-center border border-border rounded-sm">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-2 text-text-secondary hover:text-gold transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-10 text-center text-sm font-medium tabular-nums text-text-primary">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-2 text-text-secondary hover:text-gold transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="text-gold font-semibold tabular-nums">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    {item.quantity > 1 && (
                      <p className="text-text-muted text-xs tabular-nums">
                        ${item.price.toFixed(2)} each
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className="bg-bg-surface border border-border rounded-lg p-6 flex flex-col gap-5 lg:sticky lg:top-32">
          <h2 className="font-heading text-xl">Order Summary</h2>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between text-text-secondary">
              <span>Items</span>
              <span className="tabular-nums">{totalItems}</span>
            </div>
            <div className="flex items-center justify-between text-text-secondary">
              <span>Subtotal</span>
              <span className="tabular-nums">${subtotal.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="text-text-primary font-medium">Total</span>
              <span className="text-gold text-xl font-semibold tabular-nums">
                ${subtotal.toFixed(2)}
              </span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="inline-flex items-center justify-center gap-2 h-[56px] rounded-full text-sm font-semibold tracking-[0.1em] uppercase text-white hover:opacity-80 transition-opacity"
            style={{ background: '#daa34a' }}
          >
            Proceed to Checkout
          </Link>

          <div className="flex items-center justify-between gap-3">
            <Link
              href="/products"
              className="text-text-secondary text-xs tracking-[0.1em] uppercase hover:text-gold transition-colors"
            >
              Continue Shopping
            </Link>
            <button
              onClick={clearCart}
              className="text-text-muted text-xs tracking-[0.1em] uppercase hover:text-red-400 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
