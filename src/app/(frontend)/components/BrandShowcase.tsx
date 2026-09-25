import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Brand } from '@/payload-types'

interface BrandShowcaseProps {
  brands: Brand[]
}

export function BrandShowcase({ brands }: BrandShowcaseProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="section-padding text-center mb-10 md:mb-14">
        <p className="text-gold text-[10px] md:text-xs tracking-[0.3em] uppercase mb-3">
          Our Brands
        </p>
        <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl">World Leading Brands</h2>
      </div>

      <div className="section-padding">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="group relative aspect-3/4 overflow-hidden bg-bg-card"
            >
              {/* Image or fallback */}
              {brand.bannerImage &&
              typeof brand.bannerImage === 'object' &&
              brand.bannerImage.url ? (
                <Image
                  src={brand.bannerImage.url}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-800 ease-out"
                />
              ) : (
                <div className="absolute inset-0 bg-bg" />
              )}

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="font-heading text-xl md:text-2xl lg:text-3xl tracking-wide group-hover:text-gold transition-colors duration-500">
                  {brand.name}
                </h3>
                {brand.description && (
                  <p className="text-text-secondary text-xs md:text-sm mt-2 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {brand.description}
                  </p>
                )}
                <span className="inline-block mt-3 md:mt-4 text-[10px] tracking-[0.25em] uppercase text-gold opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  Discover →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
