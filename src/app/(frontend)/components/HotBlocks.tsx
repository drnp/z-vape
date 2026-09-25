'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/payload-types'
import { getProductImageDims, getProductImageUrl } from '@/lib/media'
import { useCart } from './CartContext'

export interface BrandGroup {
  slug: string
  brandName: string
  logoUrl: string | null
  logoWidth: number
  logoHeight: number
  products: Product[]
}

interface HotBlocksProps {
  brandGroups: BrandGroup[]
}

const BRAND_LOGO_FALLBACKS: Record<string, { url: string; width: number; height: number }> = {
  alibarbar: { url: '/logo/alibarbar-gold.png', width: 343, height: 80 },
  snowplus: { url: '/logo/snowplus-gold.png', width: 252, height: 60 },
  // IGET 已停用（恢复时取消注释）
  // iget: { url: '/logo/iget-gold.png', width: 238, height: 50 },
}

function HotProductCard({ product }: { product: Product }) {
  const [count, setCount] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const imageUrl = getProductImageUrl(product, 'card')
  const imageDims = getProductImageDims(product, 'card') ?? { width: 600, height: 600 }

  const handleAddToCart = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        imageUrl,
      },
      count,
    )
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
    setCount(1)
  }

  return (
    <div className="bg-bg-surface">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden justify-center items-center flex cursor-pointer bg-bg-card">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              width={imageDims.width}
              height={imageDims.height}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="h-50 w-auto object-cover hover:scale-105 transition-transform duration-500"
            />
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
          <div className="flex items-center border border-gold rounded-full shrink-0">
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
          const fallback = BRAND_LOGO_FALLBACKS[group.slug] ?? BRAND_LOGO_FALLBACKS.alibarbar
          const logoSrc = group.logoUrl ?? fallback.url
          const logoWidth = group.logoUrl ? group.logoWidth : fallback.width
          const logoHeight = group.logoUrl ? group.logoHeight : fallback.height

          return (
            <div key={group.slug} className="bg-bg-card rounded-lg overflow-hidden">
              <div className="flex justify-center items-center" style={{ height: 200 }}>
                <Image
                  src={logoSrc}
                  alt={group.brandName}
                  width={logoWidth}
                  height={logoHeight}
                  sizes="(max-width: 768px) 200px, 300px"
                  className="h-14 md:h-16 w-auto object-contain"
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
