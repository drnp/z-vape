import React from 'react'
import Link from 'next/link'

export function HeroBanner() {
  return (
    <section className="relative h-[85vh] min-h-125 max-h-225 flex items-center justify-center overflow-hidden">
      <div className="relative z-10 text-center section-padding max-w-3xl mx-auto">
        <p className="text-gold text-[10px] md:text-xs tracking-[0.4em] uppercase mb-5 md:mb-6">
          Premium Vaping Experience
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-wide mb-6 md:mb-8 leading-[1.1]">
          Crafted for
          <br />
          <span className="text-gold">Discerning Taste</span>
        </h1>
        <p className="text-text-secondary text-sm md:text-base lg:text-lg max-w-lg mx-auto mb-8 md:mb-12 leading-relaxed">
          Discover Australia&apos;s finest collection of premium vape products from the world&apos;s
          leading brands.
        </p>
        <Link
          href="/products"
          className="inline-block px-8 md:px-10 py-3 md:py-3.5 border border-gold text-gold text-[11px] tracking-[0.25em] uppercase hover:bg-gold hover:text-bg transition-all duration-500"
        >
          Explore Collection
        </Link>
      </div>
    </section>
  )
}
