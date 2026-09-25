import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '@/payload-types'
import { getProductImageUrl } from '@/lib/media'

export function ProductCard({ product }: { product: Product }) {
  const imageUrl = getProductImageUrl(product, 'card')

  const brandName =
    product.brand && typeof product.brand === 'object' && 'name' in product.brand
      ? product.brand.name
      : null

  return (
    <Link href={`/products/${product.slug}`} className="group block bg-bg-card">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-bg-surface">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-[1.03] transition-transform duration-600 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}
        {product.newArrival && (
          <span className="absolute top-2 left-2 bg-gold text-bg text-[9px] tracking-[0.15em] uppercase px-2 py-0.5 font-semibold">
            New
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 md:p-4">
        {brandName && (
          <p className="text-text-muted text-[10px] tracking-[0.15em] uppercase mb-1">
            {brandName}
          </p>
        )}
        <h3 className="text-xs md:text-sm font-body font-medium line-clamp-2 mb-1.5 group-hover:text-gold transition-colors duration-300">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2">
          <span className="text-gold text-sm font-semibold">${product.price.toFixed(2)}</span>
          {product.compareAtPrice && (
            <span className="text-text-muted text-xs line-through">
              ${product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
        {product.flavour && <p className="text-text-muted text-[11px] mt-1">{product.flavour}</p>}
      </div>
    </Link>
  )
}
