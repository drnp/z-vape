'use client'

import React, { createContext, useContext, useCallback, useSyncExternalStore } from 'react'

export interface CartItem {
  productId: string
  slug: string
  name: string
  price: number
  imageUrl: string | null
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

const STORAGE_KEY = 'z-vape-cart'

const CartContext = createContext<CartContextValue | null>(null)

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CartItem[]
  } catch {
    return []
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // storage full or unavailable
  }
}

let currentItems: CartItem[] = loadCart()
const listeners = new Set<() => void>()
const EMPTY_CART: CartItem[] = []

function getSnapshot(): CartItem[] {
  return currentItems
}

function getServerSnapshot(): CartItem[] {
  return EMPTY_CART
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function notify() {
  for (const listener of listeners) listener()
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
    const existing = currentItems.find((i) => i.productId === item.productId)
    const next = existing
      ? currentItems.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + quantity } : i
        )
      : [...currentItems, { ...item, quantity }]
    currentItems = next
    saveCart(next)
    notify()
  }, [])

  const removeItem = useCallback((productId: string) => {
    const next = currentItems.filter((i) => i.productId !== productId)
    currentItems = next
    saveCart(next)
    notify()
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    const next =
      quantity <= 0
        ? currentItems.filter((i) => i.productId !== productId)
        : currentItems.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    currentItems = next
    saveCart(next)
    notify()
  }, [])

  const clearCart = useCallback(() => {
    currentItems = []
    saveCart([])
    notify()
  }, [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return ctx
}
