import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

import { ProductGrid } from '@/app/(frontend)/components/ProductGrid'
import type { Brand, Product } from '@/payload-types'

interface PageProps {
  searchParams: Promise<{ brand?: string }>
}

export const metadata: Metadata = {
  title: 'Products | Z-VAPE',
  description: 'Browse our full collection of premium vape products.',
}

export const dynamic = 'force-dynamic'

export default async function ProductsPage({ searchParams }: PageProps) {
  const { brand: brandSlug } = await searchParams
  const payload = await getPayload({ config })

  let brand: Brand | null = null

  if (brandSlug) {
    const { docs } = await payload.find({
      collection: 'brands',
      where: { slug: { equals: brandSlug } },
      limit: 1,
    })
    brand = docs[0] ?? null
  }

  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      and: [
        ...(brand ? [{ brand: { equals: brand.id } }] : []),
        { status: { equals: 'active' } },
      ],
    },
    sort: '-createdAt',
    depth: 2,
    limit: 0,
  })

  return (
    <>
      <nav className="section-padding pt-6 pb-2 flex flex-wrap items-center gap-2 text-xs text-text-muted">
        <Link href="/" className="hover:text-gold transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <span className="text-text-primary truncate min-w-0">{brand ? brand.name : 'Products'}</span>
      </nav>

      <section className="section-padding pb-8 lg:pb-16">
        <div className="mb-8 md:mb-12">
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl">
            {brand ? brand.name : 'All Products'}
          </h1>
          {brand?.description && (
            <p className="text-text-secondary text-sm mt-3 max-w-2xl">{brand.description}</p>
          )}
        </div>

        <ProductGrid products={products as Product[]} />
      </section>
    </>
  )
}
