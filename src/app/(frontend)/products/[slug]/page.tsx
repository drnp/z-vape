import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import { notFound } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

import { ProductGallery } from '@/app/(frontend)/components/ProductGallery'
import { ProductInfo } from '@/app/(frontend)/components/ProductInfo'
import { AddToCart } from '@/app/(frontend)/components/AddToCart'
import { MobileBottomBar } from '@/app/(frontend)/components/MobileBottomBar'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (!docs.length) return { title: 'Product Not Found' }

  const product = docs[0]
  return {
    title: `${product.name} | Z-VAPE`,
    description: `${product.name} — ${product.flavour ?? ''} ${product.puffCount ?? ''} puffs`.trim(),
  }
}

export const dynamic = 'force-dynamic'

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'products',
    where: {
      and: [{ slug: { equals: slug } }, { status: { equals: 'active' } }],
    },
    depth: 2,
    limit: 1,
  })

  if (!docs.length) {
    notFound()
  }

  const product = docs[0]

  const brandName =
    product.brand && typeof product.brand === 'object' && 'name' in product.brand
      ? product.brand.name
      : null

  const brandSlug =
    product.brand && typeof product.brand === 'object' && 'slug' in product.brand
      ? product.brand.slug
      : null

  return (
    <>
      <nav className="section-padding pt-6 pb-2 flex items-center gap-2 text-xs text-text-muted">
        <Link href="/" className="hover:text-gold transition-colors">
          Home
        </Link>
        <ChevronRight size={12} />
        <Link href="/products" className="hover:text-gold transition-colors">
          Products
        </Link>
        {brandName && brandSlug && (
          <>
            <ChevronRight size={12} />
            <Link
              href={`/brands/${brandSlug}`}
              className="hover:text-gold transition-colors"
            >
              {brandName}
            </Link>
          </>
        )}
        <ChevronRight size={12} />
        <span className="text-text-primary">{product.name}</span>
      </nav>

      <div className="section-padding pb-8 lg:pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductGallery product={product} />
          <div className="flex flex-col gap-6">
            <ProductInfo product={product} />
            <div className="border-t border-border pt-6">
              <AddToCart product={product} />
            </div>
          </div>
        </div>
      </div>

      <MobileBottomBar product={product} />
    </>
  )
}
