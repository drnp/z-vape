'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/payload-types'
import { getMediaUrl } from '@/lib/media'

interface ProductGalleryProps {
  product: Product
}

function getImageUrls(product: Product, size: 'gallery' | 'thumbnail' | null = null): string[] {
  return product.images
    .map((row) => getMediaUrl(row.image as never, size))
    .filter((url): url is string => Boolean(url))
}

export function ProductGallery({ product }: ProductGalleryProps) {
  const images = getImageUrls(product, 'gallery')
  const thumbUrls = getImageUrls(product, 'thumbnail')
  const [activeIndex, setActiveIndex] = useState(0)

  const hasImages = images.length > 0
  const hasMultiple = images.length > 1

  const prev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length)
  const next = () => setActiveIndex((i) => (i + 1) % images.length)

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square overflow-hidden bg-bg-surface rounded-sm">
        {hasImages ? (
          <Image
            src={images[activeIndex]}
            alt={`${product.name} - Image ${activeIndex + 1}`}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
        )}

        {product.newArrival && (
          <span className="absolute top-3 left-3 bg-gold text-bg text-[10px] tracking-[0.15em] uppercase px-2.5 py-0.5 font-semibold">
            New
          </span>
        )}
      </div>

      {hasMultiple && (
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="shrink-0 p-1.5 text-text-muted hover:text-gold transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-2 overflow-x-auto flex-1 justify-center">
            {thumbUrls.map((url, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`shrink-0 w-16 h-16 rounded-sm overflow-hidden border-2 transition-all duration-200 ${
                  i === activeIndex ? 'border-gold' : 'border-transparent hover:border-gold/50'
                }`}
              >
                <Image
                  src={url}
                  alt={`${product.name} thumbnail ${i + 1}`}
                  width={64}
                  height={64}
                  sizes="64px"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <button
            onClick={next}
            className="shrink-0 p-1.5 text-text-muted hover:text-gold transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  )
}
