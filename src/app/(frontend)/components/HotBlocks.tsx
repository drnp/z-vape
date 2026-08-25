'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { Product } from '@/payload-types'
import { useCart } from './CartContext'

export interface BrandGroup {
  slug: string
  brandName: string
  logoUrl: string | null
  products: Product[]
}

interface HotBlocksProps {
  brandGroups: BrandGroup[]
}

const BRAND_LOGO_FALLBACKS: Record<string, string> = {
  alibarbar: '/logo/alibarbar-gold.png',
  snowplus: '/logo/snowplus-gold.png',
  iget: '/logo/iget-gold.png',
}

function HotProductCard({ product }: { product: Product }) {
  const [count, setCount] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const imageUrl =
    product.images?.[0]?.image &&
    typeof product.images[0].image === 'object' &&
    'url' in product.images[0].image
      ? product.images[0].image.url!
      : null

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        imageUrl,
      },
      count
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
    setCount(1)
  }

  return (
    <div className="bg-bg-surface">
      <Link href={`/products/${product.slug}`}>
        <div
          className="relative aspect-square overflow-hidden justify-center items-center flex cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #2d1b69, #c0392b, #d4a017)' }}
        >
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} className="h-50 object-cover hover:scale-105 transition-transform duration-500" />
          ) : null}
        </div>
      </Link>
      <div style={{ height: 30 }} />
      <div className="px-2 pb-2 md:px-3 md:pb-3 justify-center items-center flex flex-col">
        <p className="text-gold text-xl font-semibold h-8">${product.price.toFixed(2)}</p>
        <Link
          href={`/products/${product.slug}`}
          className="text-gold text-base md:text-lg text-center leading-snug line-clamp-2 min-h-8 hover:text-gold-light transition-colors"
        >
          {product.name}
        </Link>
        <p className="text-white text-sm mt-0.5 min-h-8">{product.flavour ?? ''}</p>
        <div className="flex items-center gap-1.5 md:gap-2 mt-2 w-full h-10">
          <div className="flex items-center border border-gold rounded-full flex-shrink-0">
            <button
              onClick={() => setCount((c) => Math.max(1, c - 1))}
              className="w-6 h-6 flex items-center justify-center text-gold text-sm hover:opacity-70 transition-opacity"
            >
              -
            </button>
            <span className="text-gold text-sm w-6 text-center">{count}</span>
            <button
              onClick={() => setCount((c) => c + 1)}
              className="w-6 h-6 flex items-center justify-center text-gold text-sm hover:opacity-70 transition-opacity"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="ml-auto flex-1 min-w-0 text-white text-[10px] md:text-xs font-semibold px-3 md:px-4 py-1.5 rounded-full hover:opacity-80 transition-opacity truncate"
            style={{ background: added ? '#16a34a' : '#daa34a' }}
          >
            {added ? 'Added' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function HotBlocks({ brandGroups }: HotBlocksProps) {
  return (
    <div className="section-padding xl:px-10! py-12 md:py-16">
      <div className="flex flex-col gap-8 md:gap-12">
        {brandGroups.map((group) => {
          const logoSrc =
            group.logoUrl ?? BRAND_LOGO_FALLBACKS[group.slug] ?? '/logo/alibarbar-gold.png'

          return (
            <div key={group.slug} className="bg-bg-card rounded-lg overflow-hidden">
              <div className="flex justify-center items-center" style={{ height: 200 }}>
                <img
                  src={logoSrc}
                  alt={group.brandName}
                  className="h-14 md:h-16 object-contain"
                />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 p-3 md:p-4">
                {group.products.map((product) => (
                  <HotProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
