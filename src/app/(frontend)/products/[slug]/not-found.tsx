import React from 'react'
import Link from 'next/link'

export default function ProductNotFound() {
  return (
    <div className="section-padding py-24 flex flex-col items-center text-center">
      <p className="text-gold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4">
        404
      </p>
      <h1 className="font-heading text-2xl md:text-3xl lg:text-4xl mb-3">
        Product Not Found
      </h1>
      <p className="text-text-secondary text-sm max-w-md mb-8">
        The product you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <div className="flex gap-4">
        <Link
          href="/products"
          className="px-8 py-3 border border-border text-[11px] tracking-[0.2em] uppercase text-text-secondary hover:border-gold hover:text-gold transition-all duration-300"
        >
          Browse Products
        </Link>
        <Link
          href="/"
          className="px-8 py-3 bg-gold text-bg text-[11px] tracking-[0.2em] uppercase font-semibold hover:bg-gold-light transition-colors duration-300"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
