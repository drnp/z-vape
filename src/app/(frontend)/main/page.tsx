import React from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

import { BannerSection } from '../components/BannerSection'
import { BrandBlocks } from '../components/BrandBlocks'
import { HotBlocks, type BrandGroup } from '../components/HotBlocks'
import { IconBlanks } from '../components/IconBlanks'
import type { Brand, Product } from '@/payload-types'

const BRAND_SLUGS = ['alibarbar', 'snowplus', 'iget']

function getBrandLogoUrl(brand: Brand): string | null {
  if (brand.logo && typeof brand.logo === 'object' && 'url' in brand.logo) {
    return brand.logo.url ?? null
  }
  return null
}

export const dynamic = 'force-dynamic'

export default async function MainPage() {
  const payload = await getPayload({ config })

  const { docs: brands } = await payload.find({
    collection: 'brands',
    where: { slug: { in: BRAND_SLUGS } },
    depth: 1,
  })

  const productsByBrand = await Promise.all(
    brands.map((brand) =>
      payload.find({
        collection: 'products',
        where: {
          and: [
            { brand: { equals: brand.id } },
            { featured: { equals: true } },
            { status: { equals: 'active' } },
          ],
        },
        sort: '-createdAt',
        limit: 4,
        depth: 2,
      })
    )
  )

  const productsMap = new Map(brands.map((b, i) => [b.slug, productsByBrand[i].docs as Product[]]))

  const brandGroups: BrandGroup[] = BRAND_SLUGS.map((slug) => {
    const brand = brands.find((b) => b.slug === slug)
    return {
      slug,
      brandName: brand?.name ?? slug,
      logoUrl: brand ? getBrandLogoUrl(brand) : null,
      products: brand ? (productsMap.get(slug) ?? []) : [],
    }
  })

  return (
    <>
      <BannerSection />
      <BrandBlocks />
      <HotBlocks brandGroups={brandGroups} />
      <IconBlanks />
    </>
  )
}
