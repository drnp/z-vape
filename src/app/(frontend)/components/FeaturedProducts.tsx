import React from 'react'
import Link from 'next/link'
import type { Product } from '@/payload-types'
import { ProductCard } from './ProductCard'

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="section-padding text-center mb-10 md:mb-14">
        <p className="text-gold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3">
          Curated Selection
        </p>
        <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl">Featured Products</h2>
      </div>

      <div className="section-padding">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      <div className="text-center mt-10 md:mt-14">
        <Link
          href="/products"
          className="inline-block px-8 py-3 border border-border text-[11px] tracking-[0.2em] uppercase text-text-secondary hover:border-gold hover:text-gold transition-all duration-300"
        >
          View All Products
        </Link>
      </div>
    </section>
  )
}
