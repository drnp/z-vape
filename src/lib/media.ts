import type { Media } from '@/payload-types'

export type MediaSize = 'thumbnail' | 'card' | 'gallery'

/**
 * Resolve media URL with size-preference and fallback.
 * - `media` may be string id (unpopulated) or Media object.
 * - Prefers `media.sizes[size].url`, falls back to `media.url`, then `thumbnailURL`.
 */
export function getMediaUrl(
  media: string | Media | null | undefined,
  size: MediaSize | null = null,
): string | null {
  if (!media || typeof media === 'string') return null
  if (size && media.sizes && typeof media.sizes === 'object') {
    const sized = (media.sizes as Record<string, { url?: string | null }>)[size]
    if (sized?.url) return sized.url
  }
  if (media.url) return media.url
  if (media.thumbnailURL) return media.thumbnailURL
  return null
}

export function getProductImageUrl(
  product: { images?: { image?: string | Media | null }[] | null },
  size: MediaSize | null = null,
): string | null {
  const first = product.images?.[0]?.image
  return getMediaUrl(first as Media | string | null | undefined, size)
}

export function getProductImageUrls(
  product: { images?: { image?: string | Media | null }[] | null },
  size: MediaSize | null = null,
): string[] {
  if (!product.images?.length) return []
  return product.images
    .map((row) => getMediaUrl(row.image as Media | string | null | undefined, size))
    .filter((u): u is string => Boolean(u))
}
