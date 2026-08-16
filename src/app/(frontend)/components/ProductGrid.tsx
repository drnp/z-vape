import React from 'react'
import type { Product } from '@/payload-types'
import { ProductCard } from './ProductCard'

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="section-padding py-24 text-center">
        <p className="text-text-secondary text-sm">No products found.</p>
      </div>
    )
  }

  return (
    <div className="section-padding">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
