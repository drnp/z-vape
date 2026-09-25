'use client'

import React from 'react'
import Image from 'next/image'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'

interface Slide {
  image: string
  preheading?: string
}

const defaultSlides: Slide[] = [
  {
    image: '/assets/banner-01.jpg',
    preheading: 'Premium Vaping Experience',
  },
]

export function BannerCarousel({ slides = defaultSlides }: { slides?: Slide[] }) {
  const [emblaRef] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })])

  return (
    <div className="relative overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {slides.map((slide, i) => (
          <div key={i} className="relative flex-[0_0_100%] min-w-0">
            <div className="relative h-[85vh] min-h-125 max-h-225 flex items-center justify-center">
              <Image src={slide.image} fill className="object-cover" priority={i === 0} alt={''} />
              <div className="absolute inset-0 bg-black/50" />
              <div className="relative z-10 text-center section-padding max-w-3xl mx-auto">
                {slide.preheading && (
                  <p className="text-gold text-[10px] md:text-xs tracking-[0.4em] uppercase mb-5 md:mb-6">
                    {slide.preheading}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              className="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors"
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
