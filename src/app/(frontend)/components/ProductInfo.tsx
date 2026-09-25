import React from 'react'
import type { Product } from '@/payload-types'
import { lexicalToText } from '@/lib/lexical-to-text'

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const brandName =
    product.brand && typeof product.brand === 'object' && 'name' in product.brand
      ? product.brand.name
      : null

  const brandSlug =
    product.brand && typeof product.brand === 'object' && 'slug' in product.brand
      ? product.brand.slug
      : null

  const descriptionText = product.description
    ? lexicalToText(product.description.root)
    : null

  const hasDiscount =
    product.compareAtPrice != null &&
    product.compareAtPrice > 0 &&
    product.compareAtPrice > product.price

  const discountPercent = hasDiscount
    ? Math.round(((product.compareAtPrice! - product.price) / product.compareAtPrice!) * 100)
    : null

  const inStock = (product.stock ?? 0) > 0

  const metaFields = [
    product.flavour && { label: 'Flavour', value: product.flavour },
    product.puffCount != null && { label: 'Puffs', value: `${product.puffCount.toLocaleString()}` },
    product.nicotineStrength && { label: 'Nicotine', value: product.nicotineStrength },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <div className="flex flex-col gap-5">
      {brandName && (
        <a
          href={brandSlug ? `/brands/${brandSlug}` : undefined}
          className="text-gold text-[11px] tracking-[0.2em] uppercase hover:text-gold-light transition-colors"
        >
          {brandName}
        </a>
      )}

      <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl leading-tight">
        {product.name}
      </h1>

      <div className="flex items-baseline gap-3 flex-wrap">
        {hasDiscount && (
          <>
            <span className="text-gold text-2xl font-semibold">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-text-muted text-lg line-through">
              ${product.compareAtPrice!.toFixed(2)}
            </span>
            <span className="bg-gold/20 text-gold text-xs font-semibold px-2 py-0.5 rounded">
              -{discountPercent}%
            </span>
          </>
        )}
        {!hasDiscount && (
          <span className="text-gold text-2xl font-semibold">
            ${product.price.toFixed(2)}
          </span>
        )}
      </div>

      {metaFields.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {metaFields.map(({ label, value }) => (
            <div key={label} className="bg-bg-surface border border-border rounded-sm px-3 py-2">
              <p className="text-text-muted text-[10px] tracking-[0.12em] uppercase">{label}</p>
              <p className="text-text-primary text-sm font-medium mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`}
        />
        <span className={`text-sm ${inStock ? 'text-green-400' : 'text-red-400'}`}>
          {inStock
            ? `In Stock${product.stock! > 10 ? '' : ` — Only ${product.stock} left`}`
            : 'Out of Stock'}
        </span>
      </div>

      {descriptionText && (
        <div className="border-t border-border pt-5">
          <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">
            {descriptionText}
          </p>
        </div>
      )}

      {product.sku && (
        <p className="text-text-muted text-xs tracking-wider">
          SKU: {product.sku}
        </p>
      )}
    </div>
  )
}
