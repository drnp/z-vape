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

/**
 * Whether `src` is safe to hand to `next/image` for optimization.
 *
 * `next/image` throws during render (dev) when a root-relative src does not
 * match `images.localPatterns`, so any URL that is persisted outside our
 * control — e.g. the cart's `localStorage` entries — must be vetted first.
 * Untrusted sources fall back to `unoptimized`, which skips the loader and
 * therefore the pattern check.
 */
export function isOptimizableImageSrc(src: string | null | undefined): boolean {
  if (!src || !src.startsWith('/') || src.startsWith('//')) return false
  const pathname = src.split('?')[0] ?? ''
  return /^(\/api\/media\/file\/|\/assets\/|\/logo\/|\/icon\/)/.test(pathname)
}

/**
 * Resolve intrinsic dimensions that match the URL produced by {@link getMediaUrl}.
 * Returns `null` when the media is unpopulated or has no recorded size.
 * Keep the size/fallback order identical to `getMediaUrl` so the declared
 * `width`/`height` always describe the file actually rendered.
 */
export function getMediaDims(
  media: string | Media | null | undefined,
  size: MediaSize | null = null,
): { width: number; height: number } | null {
  if (!media || typeof media === 'string') return null
  if (size && media.sizes && typeof media.sizes === 'object') {
    const sized = (
      media.sizes as Record<
        string,
        { url?: string | null; width?: number | null; height?: number | null }
      >
    )[size]
    if (sized?.url) {
      // The URL points at the resized file, so falling back to `media.width`
      // would declare the wrong aspect ratio — let the caller supply a default.
      return sized.width && sized.height ? { width: sized.width, height: sized.height } : null
    }
  }
  if (media.width && media.height) return { width: media.width, height: media.height }
  return null
}

export function getProductImageDims(
  product: { images?: { image?: string | Media | null }[] | null },
  size: MediaSize | null = null,
): { width: number; height: number } | null {
  const first = product.images?.[0]?.image
  return getMediaDims(first as Media | string | null | undefined, size)
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
