import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

import { ProductGrid } from '@/app/(frontend)/components/ProductGrid'
import type { Brand, Product } from '@/payload-types'

interface PageProps {
  params: Promise<{ slug: string }>
}

function getBrandLogoUrl(brand: Brand): string | null {
  if (brand.logo && typeof brand.logo === 'object' && 'url' in brand.logo) {
    return brand.logo.url ?? null
  }
  return null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'brands',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (!docs.length) return { title: 'Brand Not Found' }

  const brand = docs[0]
  return {
    title: `${brand.name} | Z-VAPE`,
    description: brand.description ?? `Shop ${brand.name} products at Z-VAPE.`,
  }
}

export const dynamic = 'force-dynamic'

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs: brands } = await payload.find({
    collection: 'brands',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (!brands.length) {
    notFound()
  }

  const brand = brands[0]

  const { docs: products } = await payload.find({
    collection: 'products',
    where: {
      and: [{ brand: { equals: brand.id } }, { status: { equals: 'active' } }],
    },
    sort: '-createdAt',
    depth: 2,
    limit: 0,
  })

  const logoUrl = getBrandLogoUrl(brand)

  return (
    <>
      <nav className="section-padding pt-6 pb-2 flex flex-wrap items-center gap-2 text-xs text-text-muted">
        <Link href="/" className="hover:text-gold transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-gold transition-colors">
          Brands
        </Link>
        <ChevronRight size={12} />
        <span className="text-text-primary truncate min-w-0">{brand.name}</span>
      </nav>

      <section className="section-padding pb-8 lg:pb-16">
        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8 md:mb-12">
          <div className="flex-1">
            {logoUrl && (
              <img
                src={logoUrl}
                alt={brand.name}
                className="h-14 md:h-16 object-contain mb-4"
              />
            )}
            <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl">{brand.name}</h1>
            {brand.description && (
              <p className="text-text-secondary text-sm mt-3 max-w-2xl">{brand.description}</p>
            )}
          </div>
        </div>

        <ProductGrid products={products as Product[]} />
      </section>
    </>
  )
}
