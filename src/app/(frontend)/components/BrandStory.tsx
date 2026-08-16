import React from 'react'
import Link from 'next/link'

export function BrandStory() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">

      <div className="relative z-10 section-padding text-center">
        <p className="text-gold text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4 md:mb-5">Why Choose Us</p>
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-6 md:mb-8 leading-[1.1]">
          Australia&apos;s Trusted<br />
          <span className="text-gold">Vape Destination</span>
        </h2>
        <p className="text-text-secondary text-sm md:text-base lg:text-lg max-w-xl mx-auto mb-8 md:mb-12 leading-relaxed">
          We curate only the finest products from globally recognised brands,
          ensuring every puff meets the highest standards of quality and flavour.
        </p>
        <Link
          href="/products"
          className="inline-block px-8 md:px-10 py-3 md:py-3.5 bg-gold text-bg text-[11px] tracking-[0.25em] uppercase font-semibold hover:bg-gold-light transition-colors duration-300"
        >
          Browse All Products
        </Link>
      </div>
    </section>
  )
}
